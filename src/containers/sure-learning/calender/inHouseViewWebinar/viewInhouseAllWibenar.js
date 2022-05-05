/* eslint-disable max-len */
import React, { useState,useContext, useEffect} from 'react';
import {
  withStyles,
  Grid,
  Typography,
  Divider,
  IconButton,
  Table,
  TableRow,
  Paper,
  TableCell,
  TableHead,
  TableBody,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
// import dateFns from 'date-fns';
import styles from './inhouseWebinarCalender.style';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import urls from 'config/endpoints';
import Loader from '../../../../components/loader/loader';

function ViewAllWibenars({
  classes, handleClose, open, fullData, setEditfromModel, type, setEditModelForMeeting,
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

  function handleAcceptMeeting(Joinlink, id) {
    setLoading(true);
    fetch(`${urls.sureLearning.onlineMeetingApi}${id}/join_class/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
        'Content-Type': 'application/json',
        module: localStorage.getItem('Meeting')!=="null"?localStorage.getItem('Meeting'):localStorage.getItem('Webinar')
      },
    }).then((res) => {
      if (res.status === 200) {
        // module: localStorage.getItem('Notification')
        setLoading(false);
        alert.success('attendence marked successfully');
        if (Joinlink) {
          window.open(Joinlink, '_blank');
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
        disableEnforceFocus
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        closeAfterTransition
      >
        <DialogTitle id="alert-dialog-title" onClose={handleClose}>
          View All Scheduled
          {' '}
          {type}
          {' '}
          on &nbsp;
          <b style={{ color: 'blue' }}>{(fullData && fullData.meeting_date && fullData.meeting_date && new Date(fullData.meeting_date).toString().split('G')[0].substring(0, 16))}</b>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <Paper className={classes.paper2}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell float="left">S.No.</TableCell>
                        <TableCell float="left">Topic</TableCell>
                        <TableCell float="left">Speaker Name</TableCell>
                        <TableCell float="left">Schedule Time (hh:mm)</TableCell>
                        <TableCell float="left">Duration (hh:mm) </TableCell>
                        <TableCell float="left">View</TableCell>
                        <TableCell float="left">Accept</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fullData && fullData[type]
                      && fullData[type].length !== 0 && fullData[type].map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell float="left">{index + 1}</TableCell>
                          <TableCell float="left">{(item.zoom_details && item.zoom_details.topic) || ''}</TableCell>
                          <TableCell float="left">{(item.user && item.user.first_name) || ''}</TableCell>
                          <TableCell float="left">{(item.zoom_details && item.zoom_details.start_time && converTime(new Date(item.zoom_details.start_time).toTimeString())) || ''}</TableCell>
                          <TableCell float="left">{(item.zoom_details && item.zoom_details.duration) || ''}</TableCell>
                          <TableCell float="left">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => (type === 'meetings' ? setEditModelForMeeting(item, fullData.user_id, fullData.meeting_date) : setEditfromModel(item, fullData.user_id, fullData.meeting_date))}
                            >
                              View More
                            </Button>
                          </TableCell>
                          <TableCell float="left">
                            <Button
                              variant="contained"
                              color="primary"
                              //  disabled={!dateFns.isSameDay(new Date(), new Date(item.zoom_details.start_time))}
                              disabled={
                                (new Date().getTime() < new Date(item.zoom_details.start_time).getTime() - 600000)
                                || new Date().getTime() > new Date(item.zoom_details.end_time).getTime()
                              }
                              onClick={() => handleAcceptMeeting((item.zoom_url && item.zoom_url.is_speaker === true ? item.zoom_url.url : item.zoom_details && item.zoom_details.join_url),item.zoom_url && item.zoom_url.id)}
                            >
                              {item.zoom_url && item.zoom_url.is_speaker === true ? 'Start' : 'Accept'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </>
        </DialogContent>
      </Dialog>
      {loader}
    </>
  );
}

ViewAllWibenars.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  fullData: PropTypes.instanceOf(Object).isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setEditfromModel: PropTypes.func.isRequired,
  setEditModelForMeeting: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default withStyles(styles)(ViewAllWibenars);
