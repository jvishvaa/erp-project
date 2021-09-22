import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import { result } from 'lodash';

const ShuffleModal = ({ openShuffleModal, setOpenShuffleModal }) => {
  const [batchList, setBatchList] = useState([]);
  const [list, setList] = useState([]);

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
          // options={yearList}
          // value={yearDisplay}
          // getOptionLabel={(option) => option.session_year}
          filterSelectedOptions
          // onChange={handleYearChange}
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
