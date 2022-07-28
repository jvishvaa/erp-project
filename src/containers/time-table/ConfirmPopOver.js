import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';

export default function ConfirmPopOver({
  openModal,
  setOpenModal,
  submit,
  message,
  operation,
  opendelete,
}) {
  const retureMessage = () => {
    switch (operation) {
      case 'delete':
        return 'Are you sure you want to delete ?';
      case 'edit':
        return 'Are you sure you want to edit ?';
      case 'draft':
        return 'Are you sure you want to draft ?';
      case 'publish':
        return 'Are you sure you want to publish ?';
      case 'active':
        return 'Are you sure want to deactivate existing timetable and activate this timetable ?';
      case 'deActive':
        return 'Are you sure you want to deactivate ?';
      case 'custom':
        return message;
      default:
        return 'Are You Sure ?';
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
        <div>{retureMessage()}</div>
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleCloseModal} className='labelColor cancelButton'>
          Cancel
        </Button>
        {operation === "custom" ? <Button
          color='primary'
          onClick={() => {
            submit();
            handleCloseModal();
          }}
        >
          Deactivate Periods
        </Button> : <Button
          color='primary'
          variant='contained'
          onClick={() => {
            submit();
            handleCloseModal();
          }}
        >
          {opendelete ? 'Delete' : 'Submit'}
        </Button>}
      </DialogActions>
    </Dialog>
  );
}
