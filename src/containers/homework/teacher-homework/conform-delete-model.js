import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';

const ConformDeleteMOdel = ({ openModal, setOpenModal, submit ,ispdf}) => {
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
        <div>Are you sure you want to Delete ?</div>
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleCloseModal} className='labelColor cancelButton'>
          Cancel
        </Button>
        <Button
          color='primary'
          variant='contained'
          style={{ color: 'white' }}
          onClick={() => {
            submit();
            handleCloseModal();
          }}
        >
          Delete this page
        </Button>
        {ispdf && <Button
          color='primary'
          variant='contained'
          style={{ color: 'white' }}
          onClick={() => {
            submit(true);
            handleCloseModal();
          }}
        >
          Delete this pdf
        </Button>
        }
      </DialogActions>
    </Dialog>
  );
};
export default ConformDeleteMOdel;
