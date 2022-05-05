/* eslint-disable max-len */
import React, { useState , useEffect, useContext} from 'react';
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
import 'date-fns';
import { isSameDay } from 'date-fns'
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import styles from './inhouseWebinarCalender.style';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import urls from 'config/endpoints';
import Loader from '../../../../components/loader/loader';

function ViewInhouseAllMeetings({
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

  function handelJoinMeeting(link, data) {
    setLoading(true);
    fetch(`${urls.sureLearning.onlineMeetingApi}${data.class_id.id}/join_class/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.status === 200) {
        setLoading(false);
        alert.success('attendence marked successfully');
        if (link) {
          window.open(link, '_blank');
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
          View All Scheduled Online Classes on &nbsp;
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
                        <TableCell float="left">Course Name </TableCell>
                        <TableCell float="left">Trainer Name</TableCell>
                        <TableCell float="left">Start time (hh:mm)</TableCell>
                        <TableCell float="left">End time (hh:mm)</TableCell>
                        <TableCell float="left">Join</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fullData && fullData.online_classes
                     && fullData.online_classes.length !== 0 && fullData.online_classes.map((item, index) => (
                       <TableRow key={item.id}>
                         <TableCell float="left">{index + 1}</TableCell>
                         <TableCell float="left">{(item.zoom_details && item.zoom_details.topic) || ''}</TableCell>
                         <TableCell float="left">{(item.class_initiate && item.class_initiate.course && item.class_initiate.course.course_name) || ''}</TableCell>
                         <TableCell float="left">{(item.class_initiate && item.class_initiate.user && item.class_initiate.user.first_name) || ''}</TableCell>
                         <TableCell float="left">{(item.zoom_details && item.zoom_details.start_time && converTime(new Date(item.zoom_details.start_time).toTimeString())) || ''}</TableCell>
                         <TableCell float="left">{(item.zoom_details && item.zoom_details.end_time && converTime(new Date(item.zoom_details.end_time).toTimeString())) || ''}</TableCell>
                         <TableCell float="left">
                           <Button
                             variant="contained"
                             color="primary"
                            //  disabled={!dateFns.isSameDay(new Date(), new Date(item.zoom_details.start_time))}
                             disabled={!((isSameDay(new Date(), new Date(item.zoom_details.start_time))) && (((new Date().getTime() - new Date(item.zoom_details.start_time).getTime()) >= 0)))}
                             onClick={() => handelJoinMeeting(item.zoom_details.join_url, item)}
                           >
                             Join
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

ViewInhouseAllMeetings.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  fullData: PropTypes.instanceOf(Object).isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withStyles(styles)(ViewInhouseAllMeetings);
