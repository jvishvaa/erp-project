/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import { Grid, Card, Divider, Button, Popover, Typography } from '@material-ui/core';
import {useHistory} from 'react-router-dom'
// import CloseIcon from '@material-ui/icons/Close';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Loader from '../../components/loader/loader';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const TeacherBatchFullView = ({ fullData, handleClose }) => {
  const [noOfPeriods, setNoOfPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const history =useHistory()
  useEffect(() => {
    if (fullData) {
      axiosInstance
        .get(
          `erp_user/${
            fullData && fullData.online_class && fullData.online_class.id
          }/online-class-details/`
        )
        .then((res) => {
          setNoOfPeriods(res.data.data);
        })
        .catch((error) => setAlert('error', error.message));
    }
  }, [fullData]);

  const handleCloseData = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const converTime = (info) => {
    let hour = info.split(':')[0];
    let min = info.split(':')[1];
    const part = hour > 12 ? 'PM' : 'AM';
    min = `${min}`.length === 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = `${hour}`.length === 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`;
  };
  console.log(fullData,'==========')

  function handleCancel() {
    setLoading(true);
    const params = {
      zoom_meeting_id: fullData && fullData.online_class && fullData.online_class.id,
      class_date: fullData && fullData && fullData.join_time,

    };
    let url = '';
    if (window.location.pathname === '/online-class/attend-class') {
      url = endpoints.studentViewBatchesApi.rejetBatchApi;
    } else {
      url = endpoints.teacherViewBatches.cancelBatchApi;
    }
    axiosInstance
      .put(url, params)
      .then((res) => {
        setLoading(false);
        setAlert('success', res.data.message);
        handleClose('success');
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  }

  const handleAttendance=()=>{
    alert('attendance')
    history.push(`/aol-attendance-list/${fullData.online_class.aol_batch_id}`)
  }
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12} className='teacherBatchFullViewMainDiv'>
          <Card className='teacherBatchFullViewMainCard'>
            <Grid container spacing={2} className='teacherBatchFullViewHeader'>
              <Grid item md={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={8} xs={8}>
                    <h4 className='teacherBatchFullCardLable'>
                      {(fullData &&
                        fullData.online_class &&
                        fullData.online_class.title) ||
                        ''}
                    </h4>
                    <h4 className='teacherBatchFullCardLable'>
                      {(fullData &&
                        fullData.online_class &&
                        fullData.online_class.subject &&
                        fullData.online_class.subject.length !== 0 &&
                        fullData.online_class.subject.map((item) => (
                          <span>
                            {item.subject_name || ''}
                            &nbsp;
                          </span>
                        ))) ||
                        ''}
                    </h4>
                  </Grid>
                  <Grid item md={4} xs={4}>
                    <h4 className='teacherBatchFullCardLable'>
                      {(fullData &&
                        fullData.join_time &&
                        converTime(fullData.join_time.split(' ')[1])) ||
                        ''}
                    </h4>
                    <h4 className='teacherBatchFullCardLable'>
                      {noOfPeriods && noOfPeriods.length}
                      &nbsp;Periods
                    </h4>
                  </Grid>
                  {/* <Grid item md={1} xs={1} style={{ textAlign: 'right' }}>
                    <IconButton
                      size='small'
                      className='teacherBatchFullViewClose'
                      onClick={() => handleClose()}
                    >
                      <CloseIcon className='teacherBatchFullViewCloseIcon' />
                    </IconButton>
                  </Grid> */}
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <span className='TeacherFullViewdescreption'>Description</span>
              </Grid>
              <Grid item md={12} xs={12}>
                <Divider className='fullViewDivider' />
                <Grid container spacing={2} direction='row' alignItems='center'>
                  <Grid item md={6} xs={12}>
                    <span className='TeacherFullViewdescreption1'>
                      {(fullData &&
                        fullData.online_class &&
                        fullData.online_class.start_time &&
                        new Date(fullData.online_class.start_time)
                          .toString()
                          .split('G')[0]
                          .substring(0, 16)) ||
                        ''}
                    </span>
                  </Grid>
                  <Grid item md={3} xs={6}>
                    <Button
                      size='small'
                      fullWidth
                      variant='contained'
                      onClick={() =>
                        window.open(
                          window.location.pathname === '/online-class/attend-class'
                            ? fullData && fullData.join_url
                            : fullData && fullData.presenter_url,
                          '_blank'
                        )}
                      className='teacherFullViewSmallButtons'
                    >
                      {window.location.pathname === '/online-class/attend-class'
                        ? 'Accept'
                        : 'Host'}
                    </Button>
                  </Grid>
                  <Grid item md={3} xs={6}>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      style={{ overflow: 'hidden' }}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <Grid
                        container
                        spacing={2}
                        style={{ textAlign: 'center', padding: '10px' }}
                      >
                        <Grid item md={12} xs={12}>
                          <Typography>Are you sure to Cancel ?</Typography>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <Button
                            variant='contained'
                            size='small'
                            style={{ fontSize: '11px' }}
                            onClick={() => handleCloseData()}
                          >
                            Cancel
                          </Button>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <Button
                            variant='contained'
                            color='primary'
                            style={{ fontSize: '11px' }}
                            size='small'
                            onClick={() => handleCancel()}
                          >
                            Confirm
                          </Button>
                        </Grid>
                      </Grid>
                    </Popover>
                    <Button
                      size='small'
                      fullWidth
                      variant='contained'
                      onClick={(e) => handleClick(e)}
                      className='teacherFullViewSmallButtons1'
                    >
                      {window.location.pathname === '/online-class/attend-class'
                        ? 'Reject'
                        : 'Cancel'}
                    </Button>
                  </Grid>
                </Grid>
                <Divider className='fullViewDivider' />
              </Grid>
              <Grid item md={12} xs={12}>
                {window.location.pathname !== '/online-class/attend-class' && (
                  <Button fullWidth size='small' className='teacherFullViewFullButtons' onClick={handleAttendance}>
                    Attendance
                  </Button>
                )}
                <Button fullWidth size='small' className='teacherFullViewFullButtons'>
                  View Course Plan
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      {loading && <Loader />}
    </>
  );
};

export default TeacherBatchFullView;
