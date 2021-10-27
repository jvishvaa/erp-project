import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';

const ConfirmModal = ({ openModal, setOpenModal, submit }) => {
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
        <div style={{ fontFamily: 'Andika New Basic, sans-serif' }}>Are you sure you want to submit ?</div>
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleCloseModal} className='labelColor cancelButton' style={{ fontFamily: 'Andika New Basic, sans-serif' }}>
          Cancel
        </Button>
        <Button
          color='primary'
          variant='contained'
          style={{ color: 'white', fontFamily: 'Andika New Basic, sans-serif' }}
          onClick={() => {
            submit();
            handleCloseModal();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmModal;
