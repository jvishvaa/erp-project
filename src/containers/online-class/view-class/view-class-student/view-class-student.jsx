import React, { useContext, useEffect, useState } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import moment from 'moment';

import Countdown from '../../../../components/countdown/countdown';
import './view-class-student.scss';
import { OnlineclassViewContext } from '../../online-class-context/online-class-state';

const ViewClassStudent = (props) => {
  const {
    data: {
      is_accepted: isAccepted,
      join_time: joinTime,
      id: meetingId,
      zoom_meeting: {
        online_class: {
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

  useEffect(() => {
    const now = new Date(currentServerTime);
    if (startTime) {
      const difference = new Date(startTime) - now;
      setTimeout(() => {
        setHasClassStarted(true);
      }, difference);
    }

    if (joinTime) {
      const difference = new Date(joinTime) - now;
      setTimeout(() => {
        setIsJoinTime(true);
      }, difference);
    }

    if (endTime) {
      const difference = new Date(endTime) - now;
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

  const handleClassJoin = () => {
    dispatch(handleJoin(meetingId));
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
                Join limit
              </Typography>
              <Typography
                variant='h6'
                gutterBottom
                color='secondary'
                className='responsive__align'
              >
                {joinLimit}
              </Typography>
            </Grid>
          </Grid>
          {/*  */}
          <Grid container spacing={2}>
            <Grid item xs={8}>
              {isParentClass ? (
                <Typography variant='h5' gutterBottom color='secondary'>
                  Class For parents
                </Typography>
              ) : (
                ''
              )}
              <Typography variant='subtitle1' gutterBottom color='secondary'>
                {description}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Grid container spacing={3}>
            {/* <Grid item xs={6}>
              <Button
                className='viewclass__student-btn'
                variant='outlined'
                color='primary'
              >
                Set reminder
              </Button>
            </Grid> */}
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <Button
                className='viewclass__student-btn'
                variant='contained'
                color='primary'
              >
                Resources
              </Button>
            </Grid>
            {/* <Grid item xs={6}>
              <Button
                className='viewclass__student-btn'
                variant='outlined'
                color='primary'
              >
                Homework
              </Button>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewClassStudent;
