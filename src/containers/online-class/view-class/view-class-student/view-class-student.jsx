import React, { useContext, useEffect, useState } from 'react';
import { Grid, Typography, Button, Modal } from '@material-ui/core';
import moment from 'moment';

import Countdown from '../../../../components/countdown/countdown';
import './view-class-student.scss';
import { OnlineclassViewContext } from '../../online-class-context/online-class-state';
import ResourceModal from '../../online-class-resources/resourceModal';
import OnlineClassFeedback from '../../Feedback/OnlineClassFeedback';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';

const ViewClassStudent = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [onlineClassId, setOnlineClassId] = useState(null);
  const {
    data: {
      resource_available: isResourceAvailable,
      is_accepted: isAccepted,
      join_time: joinTime,
      id: meetingId,
      zoom_meeting: {
        id: zoomId,
        online_class: {
          id: olClassId,
          start_time: startTime,
          end_time: endTime,
          title = '',
          description = '',
          subject = {},
          join_limit: joinLimit,
          is_assigned_to_parent: isParentClass,
        },
      } = {},
    },
  } = props || {};

  const {
    handleAccept,
    dispatch,
    handleJoin,
    studentView: { currentServerTime },
  } = useContext(OnlineclassViewContext);

  const [hasClassStarted, setHasClassStarted] = useState(false);
  const [hasClassEnded, setHasClassEnded] = useState(false);
  const [isJoinTime, setIsJoinTime] = useState(false);

  const { setAlert } = useContext(AlertNotificationContext);

  const { role_details: roleDetails } =
    JSON.parse(localStorage.getItem('userDetails')) || {};

  useEffect(() => {
    const now = new Date(moment(currentServerTime).format('llll'));
    // const now = new Date(currentServerTime);
    if (startTime) {
      const difference = new Date(moment(startTime).format('llll')) - now;
      setTimeout(() => {
        setHasClassStarted(true);
      }, difference);
    }
    if (joinTime) {
      const difference = new Date(moment(joinTime).format('llll')) - now;
      setTimeout(() => {
        setIsJoinTime(true);
      }, difference);
    }
    if (endTime) {
      const difference = new Date(moment(endTime).format('llll')) - now;
      setTimeout(() => {
        setHasClassStarted(false);
        setHasClassEnded(true);
        setIsJoinTime(false);
      }, difference);
    }
  }, []);

  const getClassOngoingStatus = () => {
    if (hasClassEnded) {
      return <>Class has ended</>;
    }
    if (hasClassStarted) {
      return <>Class is ongoing</>;
    }
    return (
      <>
        <Countdown startTime={startTime} />
      </>
    );
  };

  const handleClassAccept = () => {
    dispatch(handleAccept(meetingId));
  };

  const handleClassJoin = async () => {
    try {
      const response = await axiosInstance.get(
        `${endpoints.onlineClass.feedback}?erp_user_id=${roleDetails.erp_user_id}`
      );
      const {
        is_attended: isAttended,
        feedback_submitted: feedbackSubmitted,
      } = response.data;
      if (isAttended && feedbackSubmitted === false) {
        setIsFeedbackOpen(true);
      } else {
        dispatch(handleJoin(meetingId));
      }
    } catch (error) {
      setAlert('error', 'Failed to get attendance details');
    }
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  const handleFeedbackClick = async (rating) => {
    try {
      const formData = new FormData();
      formData.append('online_class_id', olClassId);
      formData.append('zoom_meeting_id', zoomId);
      formData.append('erp_user_id', roleDetails.erp_user_id);
      formData.append('rating', rating);
      await axiosInstance.post(`${endpoints.onlineClass.feedback}`, formData);
      setIsFeedbackOpen(false);
      dispatch(handleJoin(meetingId));
    } catch (error) {
      setAlert('error', 'Failed to submit feedback');
    }
  };

  return (
    <div className='viewclass__student-container'>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={8}>
          {/*  */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant='h5' gutterBottom color='primary'>
                {title}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant='h6'
                gutterBottom
                color='secondary'
                className='responsive__align'
              >
                {getClassOngoingStatus()}
              </Typography>
            </Grid>
          </Grid>
          {/*  */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant='h6' gutterBottom color='secondary'>
                {subject.subject_name}
              </Typography>
              <Typography variant='h6' gutterBottom color='secondary'>
                {moment(startTime).format('MMMM Do YYYY, h:mm:ss a')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant='h6'
                gutterBottom
                color='secondary'
                className='responsive__align'
              >
                Join limit: {joinLimit}
              </Typography>
            </Grid>
          </Grid>
          {/*  */}
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              {!isAccepted ? (
                <Button
                  className='viewclass__student-btn'
                  variant='contained'
                  color='primary'
                  disabled={isAccepted || !!hasClassEnded}
                  onClick={handleClassAccept}
                >
                  Accept Class
                </Button>
              ) : (
                <Button
                  className='viewclass__student-btn'
                  variant='contained'
                  color='primary'
                  disabled={!isJoinTime}
                  onClick={handleClassJoin}
                >
                  Join Class
                </Button>
              )}
            </Grid>
            {isResourceAvailable ? (
              <Grid item xs={12} sm={6}>
                <Button
                  className='viewclass__student-btn'
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    setIsModalOpen(true);
                    setOnlineClassId(olClassId);
                  }}
                >
                  Resources
                </Button>
              </Grid>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      </Grid>
      {onlineClassId && (
        <ResourceModal
          alert={setAlert}
          isOpen={isModalOpen}
          onClick={closeModalHandler}
          id={olClassId}
          type='resource'
          key={`resource_modal${olClassId}`}
        />
      )}
      <Modal
        open={isFeedbackOpen}
        onClose={() => {
          setIsFeedbackOpen(false);
        }}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        <div className='onlineclass__feedback--modal'>
          <div className='onlineclass__feedback--topbar'>
            <p className='onlineclass__feedback--topbartitle'>
              How was your last online class ?
            </p>
          </div>
          <div className='onlineclass__emoji--container'>
            <OnlineClassFeedback
              handleFeedBack={(rating) => {
                handleFeedbackClick(rating);
              }}
              feedbackType='numeric'
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ViewClassStudent;
