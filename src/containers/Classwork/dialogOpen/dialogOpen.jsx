import React, { useEffect, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Attachment from '../../../components/attachment/index';
import './dialogOpen.scss';
const useStyles = makeStyles({
  root: {
    maxHeight: 'none',
    // width: '50%',
  },
});
const DownloadClassWorkFile = (props) => {
  const classes = useStyles();
  const [uploadedFiles, setfiles] = useState(false);
  const handleClose = () => {
    props.handleCloseDialog();
  };

  //   console.log(props.uploadData, 'all-data');
  return (
    <div className='dialog-Box-classwork'>
      <Dialog
        onClose={handleClose}
        // aria-labelledby='simple-dialog-title'
        open={props.openDialog}
        className={classes.root}
        maxWidth={false}
        fullWidth={true}
        // fullScreen
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle id='simple-dialog-title' color='primary'>
            All Files
          </DialogTitle>
          <DialogTitle id='simple-dialog-title' color='primary' onClick={handleClose}>
            <CloseIcon />
          </DialogTitle>
        </div>

        <div className='all-files'>
          {props?.uploadData?.submitted_files &&
            props?.uploadData?.submitted_files.map((data, index) => (
              <div className='attachment-files'>
              <Attachment
                key={`homework_student_question_attachment_${index}`}
                fileUrl={data}
                fileName={`Attachment-${index + 1}`}
                index={index}
                actions={['preview', 'download']}
              />
              </div>
              // <div className='lower-box-download' onClick={() => window.open(data)}>
              //   {index + 1}
              // </div>
            ))}
        </div>
      </Dialog>
    </div>
  );
};

export default DownloadClassWorkFile;
