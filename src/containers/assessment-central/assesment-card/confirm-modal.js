import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';

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
        <div>Are you sure you want to Delete ?</div>
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleCloseModal} className='labelColor cancelButton'>
          Cancel
        </Button>
        <Button
          color='primary'
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