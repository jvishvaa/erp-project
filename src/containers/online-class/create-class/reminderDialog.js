import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

const ReminderDialog = ({ createClass, onlineClass, openModal, setOpenModal }) => {
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const { selectedTime, selectedDate } = onlineClass || {};
  const [date, setDate] = useState([...String(new Date(selectedDate)).split(' ')] || []);

  return (
    <Dialog
      className='reminderDialog'
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle
        style={{ cursor: 'move', color: '#014b7e' }}
        id='draggable-dialog-title'
      >
        <div>You are scheduling class for</div>
        <div>
          {date?.[0]}, {date?.[2]} {date?.[1]}, {formatAMPM(selectedTime)}
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{`Do you want to proceed?`}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} className='labelColor cancelButton'>
          Ignore
        </Button>
        <Button
          color='primary'
          onClick={() => {
            createClass();
            handleCloseModal();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ReminderDialog;
