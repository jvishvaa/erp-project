import React, { useEffect, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import './dialogOpen.scss';
const DownloadClassWorkFile = (props) => {
  const [uploadedFiles, setfiles] = useState(false);
  const handleClose = () => {
    props.handleCloseDialog();
  };

//   console.log(props.uploadData, 'all-data');
  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby='simple-dialog-title'
        open={props.openDialog}
      >
        <DialogTitle id='simple-dialog-title'>All Files</DialogTitle>
        <div className='all-files'>
          {props?.uploadData?.submitted_files &&
            props?.uploadData?.submitted_files.map((data, index) => (
              <div className='lower-box-download' onClick={()=> window.open(data)}>{index + 1}</div>
            ))}
        </div>
      </Dialog>
    </div>
  );
};

export default DownloadClassWorkFile;
