import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const ShuffleModal = ({ openShuffleModal, setOpenShuffleModal }) => {

  return (
    <Dialog
      open={openShuffleModal}
      onClose={() => setOpenShuffleModal(false)}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle
        style={{ cursor: 'move', color: '#014b7e' }}
        id='draggable-dialog-title'
      >
        Reshuffle
      </DialogTitle>
      <DialogContent>
        Course:
        <Autocomplete
          size='small'
          id='create__class-subject'
          filterSelectedOptions
          required
          renderInput={(params) => (
            <TextField
              size='small'
              className='create__class-textfield'
              {...params}
              variant='outlined'
              label='Batch'
              placeholder='Batch'
              required
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpenShuffleModal(false)}
          className='labelColor cancelButton'
        >
          Cancel
        </Button>
        <Button color='primary' variant='contained' style={{ color: 'white' }}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShuffleModal;
