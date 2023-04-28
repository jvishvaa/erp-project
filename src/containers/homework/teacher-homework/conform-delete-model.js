import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';

const ConformDeleteMOdel = ({ openModal, setOpenModal, submit ,ispdf , isfile}) => {
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  console.log(ispdf , 'is');

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
        {isfile == 'file' ? 'Delete This File' :
          'Delete This Pdf'}
        </Button>
        }
      </DialogActions>
    </Dialog>
  );
};
export default ConformDeleteMOdel;
