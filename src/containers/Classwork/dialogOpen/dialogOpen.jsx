import React, { useEffect, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
const DownloadClassWorkFile = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const handleClose = () =>{
    setOpenDialog(true);
  }
  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby='simple-dialog-title' open={openDialog}>
        <DialogTitle id='simple-dialog-title'>All Files</DialogTitle>
      </Dialog>
    </div>
  );
};

export default DownloadClassWorkFile;
