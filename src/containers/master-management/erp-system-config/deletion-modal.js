import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@material-ui/core';

const DeletionModal = ({ openDeleteModal, setOpenDeleteModal, handleDelete }) => {
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal();
  };

  return (
    <Dialog
      open={openDeleteModal}
      onClose={handleCloseDeleteModal}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle id='draggable-dialog-title'>Delete Config</DialogTitle>
      <DialogContent>
        <DialogContentText>Confirm Delete Config</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteModal} className='labelColor cancelButton'>
          Cancel
        </Button>
        <Button
          variant='contained'
          style={{ color: 'white' }}
          color='primary'
          onClick={() => handleDelete(openDeleteModal)}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(DeletionModal);
