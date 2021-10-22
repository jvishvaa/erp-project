/* eslint-disable max-len */
import React, { useState,useContext, useEffect} from 'react';
import {
  withStyles,
  Grid,
  Typography,
  Divider,
  IconButton,
  Button,
  Avatar,
} from '@material-ui/core';
// import dateFns from 'date-fns';
import ReactHtmlParser from 'react-html-parser';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PersonIcon from '@material-ui/icons/Person';
import styles from './inhouseWebinarCalender.style';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import urls from 'config/endpoints';
import Loader from '../../../../components/loader/loader';

function ViewIndividualWibenae({
  classes, handleClose, open, fullData,
}) {
  const { setAlert } = useContext(AlertNotificationContext);
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
    if (time) {
      let hour = (time.split(':'))[0];
      let min = (time.split(':'))[1];
      const part = hour > 11 ? 'PM' : 'AM';
      min = (`${min}`).length === 1 ? `0${min}` : min;
      hour = hour > 12 ? hour - 12 : hour;
      hour = (`${hour}`).length === 1 ? `0${hour}` : hour;
      return (`${hour}:${min} ${part}`);
    }
    return null;
  };

  function handleAcceptWibenar() {
    setLoading(true);
    fetch(`${urls.sureLearning.onlineMeetingApi}${fullData.user_attendence_id}/join_class/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
        'Content-Type': 'application/json',
        module: "166"
      },
    }).then((res) => {
      if (res.status === 200) {
        setLoading(false);
        setAlert('success', 'attendence marked successfully');
        
        if (fullData.isSpeaker) {
          if (fullData.speakerLink) {
            window.open(fullData.speakerLink, '_blank');
          }
        } else if (fullData.joinLink) {
          window.open(fullData.joinLink, '_blank');
        } else {
          window.open(fullData.joinLink, '_blank');
        }
       
      }
      if (res.status !== 200) {
        setLoading(false);
        setAlert('error', 'Somethingwent wrong please try again!');
        
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
        
        style={{ marginTop: '50px',marginLeft: '200px',width: '60%' }}
        disableEnforceFocus
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        closeAfterTransition
      >
        <DialogTitle id="alert-dialog-title" onClose={handleClose}>
          {fullData && fullData.type === 'meeting' ? 'Meeting' : 'Webinar' }
          {' '}
          is Scheduled on &nbsp;
          <b style={{ color: 'blue' }}>{(fullData && fullData.date && fullData.date && new Date(fullData.date).toString().split('G')[0].substring(0, 16))}</b>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={8} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={12} xs={12}>
                        <Typography variant="h6">
                          <b style={{ display: 'inline-flex' }}>
                            Speaker Name &nbsp;
                            <PersonIcon style={{ marginTop: '5px' }} />
                          &nbsp; : &nbsp;
                          </b>
                          {(fullData && fullData.speakerErp) || ''}
                        </Typography>
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Typography variant="h6">
                          <b>Topic Name : &nbsp;</b>
                          {((fullData && fullData.topicName) || '')}
                        </Typography>
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Typography variant="h6">
                          <b style={{ display: 'inline-flex' }}>
                            Start Time &nbsp;
                            <AccessTimeIcon style={{ marginTop: '5px' }} />
                          &nbsp; : &nbsp;
                          </b>
                          {(fullData && converTime(fullData && fullData.schedule)) || ''}
                        </Typography>
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Typography variant="h6">
                          <b style={{ display: 'inline-flex' }}>
                            Duration (hh:mm)&nbsp;
                            <AccessTimeIcon style={{ marginTop: '5px' }} />
                          &nbsp; : &nbsp;
                          </b>
                          {((fullData && fullData.duration) || '')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12} style={{ textAlign: 'center', padding: '20px' }}>
                    <Avatar variant="square" className={classes.square} src={fullData.profileImage ? fullData.profileImage : require('./Upp3.png')} alt="Remy Sharp" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="h6">
                  <b>About Speaker : &nbsp;</b>
                </Typography>
                <div style={{ padding: '20px' }}>{ReactHtmlParser(((fullData && fullData.aboutSpeaker) || ''))}</div>
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="h6">
                  <b>About Session : &nbsp;</b>
                </Typography>
                <div style={{ padding: '20px' }}>{ReactHtmlParser(((fullData && fullData.aboutSession) || ''))}</div>
              </Grid>
              <Grid item md={12} xs={12}>
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.textField}
                // disabled={!dateFns.isSameDay(new Date(), new Date(fullData.date))}
                  disabled={
                    (new Date().getTime() < new Date(fullData.startTime).getTime() - 600000)
                    || new Date().getTime() > new Date(fullData.endTime).getTime()
                  }
                  onClick={() => handleAcceptWibenar()}
                >
                  {fullData.isSpeaker ? 'Start' : 'Accept'}
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

ViewIndividualWibenae.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  fullData: PropTypes.instanceOf(Object).isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withStyles(styles)(ViewIndividualWibenae);
