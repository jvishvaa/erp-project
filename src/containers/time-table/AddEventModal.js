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
import Grid from '@material-ui/core/Grid';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import NotesIcon from '@material-ui/icons/Notes';
import CancelIcon from '@material-ui/icons/Cancel';

const style = {
  position: 'absolute',
  top: '55%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  Height: 350,
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
  formControlevent: {
    margin: theme.spacing(1),
    minWidth: 120,
    color: 'blue',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  MuiInput: {},
}));

export default function AddEventModal() {
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
          <div>
            <div>Add event</div>
            <div style={{ margin: '15px 0' }}>
              <h4> Case Study Competition</h4>
              <hr></hr>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  margin: '20px 0px 0px 0px',
                }}
              >
                <div style={{ margin: '10px 0px' }}>
                  <NotesIcon />
                </div>
                <div style={{ margin: '10px 5px' }}>
                  <p> 28 January, 2022</p>
                  <hr></hr>
                </div>
                <div style={{ margin: '10px 5px' }}>
                  <p> 3:00 - 4:00</p>
                  <hr></hr>
                </div>
              </div>
              <div>
                <div>
                  <Grid container spacing={1} alignItems='flex-end'>
                    <Grid item>
                      <AccessTimeIcon />
                    </Grid>
                    <Grid item>
                      <TextField id='input-with-icon-grid' label='add a Description' />
                      <hr></hr>
                    </Grid>
                  </Grid>
                </div>
              </div>
              <div>
                <FormControl className={classes.formControlevent}>
                  <InputLabel id='demo-simple-select-label'>Event Type</InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={age}
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                  <hr></hr>
                </FormControl>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: 'primary',
              }}
            >
              <Button>Save</Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
