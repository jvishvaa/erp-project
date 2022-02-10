import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';

const style = {
  position: 'absolute',
  top: '55%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  minHeight: 250,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
  // fontSize: '0.1em',
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '500px',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 320,
    color: 'blue',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function ExistingModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [age, setAge] = React.useState('');
  const [pop, Setpop] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <button type='button' onClick={handleOpen}>
        react-transition-group
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <div
            style={{ position: 'absolute', right: '5px', top: '5px' }}
            onClick={handleClose}
          >
            <CancelIcon />
          </div>
          <div style={{ margin: '30px' }}>{`You already have ${2 + 2} scheduled for ${
            2 + 2
          } from ${
            2 + 2
          } to ${4}. Do tou still want to add ${6} event to the academic calendar ? 
          
          `}</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button style={{ backgroundColor: '#349ceb' }} onClick={handleClose}>
              Cancel
            </Button>
            <Button style={{ backgroundColor: '#349ceb' }}>Add Event</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
