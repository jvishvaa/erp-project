import React,{useState} from 'react';
import {Dialog,DialogActions,DialogContent,DialogContentText,Button } from '@material-ui/core';

function EndquizDialog(props){
  const handleYes = ()=>{
      props.handletoggle()
      if(props.closeSocket){
        props.closeSocket()
      }
      if(props.endQuizTrigger){
        props.endQuizTrigger()
      }
  }

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={props.open}
        onClose={()=>props.handletoggle()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are you sure you want to exit from this quiz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>props.handletoggle()}>Cancel</Button>
          <Button onClick={handleYes} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default EndquizDialog 