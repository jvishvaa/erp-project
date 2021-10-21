import React from 'react';
import {Button,withStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DialogActions from '@material-ui/core/DialogActions';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const FeedbackFormDialog = (props) => {
  const {setAlert} = React.useContext(AlertNotificationContext) 
  const [open, setOpen] = React.useState(false);
  const StyledButton = withStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.primary.main,
      color: '#FFFFFF',
      padding: '8px 15px',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  }))(Button);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <StyledButton variant="outlined" size="small" onClick={handleClickOpen}>
        Feedback
      </StyledButton>
      <Dialog fullWidth = {true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.type} Feedback Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Please Enter Your Feedback
          </DialogContentText>
          <div style = {{position:'absolute', right :0, top:5}}>
          <IconButton onClick={() => handleClose()}>
              <HighlightOffIcon/>
          </IconButton>
          </div>
          <TextField
           
            autoFocus
            required
            variant="outlined"
            margin="dense"
            id="name"
            label="Comments"
            type="email"
            multiline
            rows={8}
            fullWidth
          />
        </DialogContent>
        <DialogActions>

          <StyledButton onClick={() => setAlert('error', 'Functionality not yet added')} color="primary">
            Submit
          </StyledButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FeedbackFormDialog
