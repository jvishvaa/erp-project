import React, { useState } from 'react';
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
import styles from './wibenarSchedule.style';
import { useAlert } from '../../../hoc/alert/alert';
import urls from '../../../url';
import Loader from '../../../hoc/loader';

function ViewAllWibenars({
  classes, handleClose, open, fullData, setEditfromModel, type, setEditModelForMeeting,
}) {
  const [loading, setLoading] = useState(false);
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const alert = useAlert();
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
  if (loading) {
    loader = <Loader open />;
  }

  const converTime = (time) => {
    let hour = (time.split(':'))[0];
    let min = (time.split(':'))[1];
    const part = hour > 12 ? 'PM' : 'AM';
    min = (`${min}`).length === 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (`${hour}`).length === 1 ? `0${hour}` : hour;
    return (`${hour}:${min} ${part}`);
  };

  function cancleMeeting(id) {
    setLoading(true);
    fetch(`${urls.updateWibemarApi}${id}/create_webinar/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          handleClose('success');
          alert.success('wibenar Cancled successfully');
          return res.json();
        }
        if (res.status !== 200) {
          setLoading(false);
          alert.warning('something went wrong please try again ');
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
                        <TableCell float="left">S.No</TableCell>
                        <TableCell float="left">Topic</TableCell>
                        <TableCell float="left">Speaker Erp</TableCell>
                        <TableCell float="left">Schedule Time</TableCell>
                        <TableCell float="left">Duration</TableCell>
                        <TableCell float="left">Edit</TableCell>
                        <TableCell float="left">Cancel</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fullData && fullData[type]
                     && fullData[type].length !== 0 && fullData[type].map((item, index) => (
                       <TableRow key={item.id}>
                         <TableCell float="left">{index + 1}</TableCell>
                         <TableCell float="left">{(item.zoom_details && item.zoom_details.topic) || ''}</TableCell>
                         <TableCell float="left">{(item.user && item.user.username) || ''}</TableCell>
                         <TableCell float="left">{(item.zoom_details && item.zoom_details.start_time && converTime(new Date(item.zoom_details.start_time).toTimeString())) || ''}</TableCell>
                         <TableCell float="left">{(item.zoom_details && item.zoom_details.duration) || ''}</TableCell>
                         <TableCell float="left">
                           <Button variant="contained" color="primary" onClick={() => (type === 'meetings' ? setEditModelForMeeting(item, fullData.user_id, fullData.meeting_date) : setEditfromModel(item, fullData.user_id, fullData.meeting_date))}>Edit</Button>
                         </TableCell>
                         <TableCell float="left">
                           <Button variant="contained" color="secondary" onClick={() => cancleMeeting(item.id)}>Cancel</Button>
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
