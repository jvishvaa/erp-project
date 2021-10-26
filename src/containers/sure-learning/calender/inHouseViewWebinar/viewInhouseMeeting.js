/* eslint-disable max-len */
import React, { useState ,useContext, useEffect} from 'react';
import {
  withStyles,
  Grid,
  Typography,
  Divider,
  IconButton,
  Button,
} from '@material-ui/core';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PersonIcon from '@material-ui/icons/Person';
import 'date-fns';
import {isSameDay} from 'date-fns';
import styles from './inhouseWebinarCalender.style';
// import { useAlert } from '../../../hoc/alert';
import urls from 'config/endpoints';
import Loader from '../../../../components/loader/loader';

function ViewInhouseMeeting({

  classes, handleClose, open, fullData,
}) {

  const { alert } = useContext(AlertNotificationContext);
  const [Loading, setLoading] = useState(false);
  const [auth] = useState(JSON.parse(localStorage.getItem('udaanDetails')));
  const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  };
  DialogTitle.propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  let loader = null;
  if (Loading) {
    loader = <Loader open />;
  }

  const converTime = (time) => {
    let hour = (time.split(':'))[0];
    let min = (time.split(':'))[1];
    const part = hour > 11 ? 'PM' : 'AM';
    min = (`${min}`).length === 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (`${hour}`).length === 1 ? `0${hour}` : hour;
    return (`${hour}:${min} ${part}`);
  };

  function joinMeetingFuction(data) {
    setLoading(true);
    fetch(`${urls.sureLearning.onlineMeetingApi}${data.class_id.id}/join_class/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
        'Content-Type': 'application/json',
        module: localStorage.getItem('Meeting')!=="null"?localStorage.getItem('Meeting'):localStorage.getItem('Webinar')
      },
    }).then((res) => {
      if (res.status === 200) {
        setLoading(false);
        alert.success('attendence marked successfully');
        if (fullData && fullData.data && fullData.data.zoom_details
          && fullData.data.zoom_details.join_url) {
          window.open(fullData && fullData.data && fullData.data.zoom_details && fullData.data.zoom_details.join_url, '_blank');
        }
        return res.json();
      }
      if (res.status !== 200) {
        setLoading(false);
        alert.error('Somthing went wrong please try again');
        return res.json();
      }
      return 0;
    });
  }

  return (
    <>
      <Dialog
        maxWidth="xl"
        className={classes.modal}
        open={open}
        style={{ marginTop: '50px' }}
        disableEnforceFocus
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        closeAfterTransition
      >
        <DialogTitle id="alert-dialog-title" onClose={handleClose}>
          Online Class on &nbsp;
          <b style={{ color: 'blue' }}>{(fullData && fullData.date && fullData.date && new Date(fullData.date).toString().split('G')[0].substring(0, 16))}</b>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <Typography variant="h6">
                  <b>Topic : &nbsp;</b>
                  {(fullData && fullData.data && fullData.data.zoom_details && fullData.data.zoom_details.topic) || ''}
                </Typography>
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="h6">
                  <b>Course Name : &nbsp;</b>
                  {(fullData && fullData.data && fullData.data.class_initiate && fullData.data.class_initiate.course && fullData.data.class_initiate.course.course_name) || ''}
                </Typography>
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="h6">
                  <b style={{ display: 'inline-flex' }}>
                    Trainer Name&nbsp;
                    <PersonIcon style={{ marginTop: '5px' }} />
                  &nbsp; : &nbsp;
                  </b>
                  {(fullData && fullData.data && fullData.data.class_initiate && fullData.data.class_initiate.user && fullData.data.class_initiate.user.first_name) || ''}
                </Typography>
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="h6">
                  <b style={{ display: 'inline-flex' }}>
                    Start Time  &nbsp;
                    <AccessTimeIcon style={{ marginTop: '5px' }} />
                  &nbsp; : &nbsp;
                  </b>
                  {(fullData && fullData.data && fullData.data.zoom_details && fullData.data.zoom_details.start_time && converTime(new Date(fullData.data.zoom_details.start_time).toTimeString())) || ''}
                </Typography>
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="h6">
                  <b style={{ display: 'inline-flex' }}>
                    End Time &nbsp;
                    <AccessTimeIcon style={{ marginTop: '5px' }} />
                  &nbsp; : &nbsp;
                  </b>
                  {(fullData && fullData.data && fullData.data.zoom_details && fullData.data.zoom_details.end_time && converTime(new Date(fullData.data.zoom_details.end_time).toTimeString())) || ''}
                </Typography>
              </Grid>
              <Grid item md={12} xs={12}>
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.textField}
                  disabled={!((isSameDay(new Date(), new Date(fullData.date))) && (((new Date().getTime() - new Date(fullData.data && fullData.data.zoom_details && fullData.data.zoom_details.start_time).getTime()) >= 0)))}
                  onClick={() => joinMeetingFuction(fullData.data)}
                >
                  Join
                </Button>
              </Grid>
            </Grid>
          </>
        </DialogContent>
      </Dialog>
      {loader}
    </>
  );
}

ViewInhouseMeeting.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  fullData: PropTypes.instanceOf(Object).isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withStyles(styles)(ViewInhouseMeeting);
