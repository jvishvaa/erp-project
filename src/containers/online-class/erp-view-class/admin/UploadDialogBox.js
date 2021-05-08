import React, { useContext, useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import axiosInstance from '../../../../config/axios';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import DialogTitle from '@material-ui/core/DialogTitle';
import './uploadBox.scss';
const useStyles = makeStyles((theme) => ({
  box: {
    width: '51%',
    height: '39%',
  },
  input: {
    display: 'none',
  },
}));

const UploadClassWorkDiaogBox = (props) => {
  const classes = useStyles();
  const [uploadFiles, setUploadFiles] = useState();
  const { setAlert } = useContext(AlertNotificationContext);

  //     const [open, setOpen] = React.useState(false);

  //     const handleClickOpen = () => {
  //       setOpen(true);
  //     };
  // console.log(props.fullData, 'fulldata');
  const handleUploadFile = (e) => {
    // if (e.target.files[0]) {
    //   const data  = e.target.files[0];
    //   const tempArr = e.target.files[0].name.split('.');
     
    //   const ext = tempArr.length ? tempArr[tempArr.length - 1] : 'unsupported';
    //   const newFiles = [...files, e.target.files[0]];
    // }
    // const fd = new FormData();
    // fd.append('file', data);
    
    e.persist()
    let value = e.target.files[0];
    // let arrayFiles = uploadFiles;
    // arrayFiles.push(value);
    setUploadFiles(value);

    console.log(uploadFiles, 'files selected');
  };
  const handleClose = () => {
    props.OpenDialogBox(false);
  };
  //   let date = new Date().getDate();
  //   console.log(date);
  const submitClassWorkAPI = () => {
    const formData = new FormData();
    formData.append('submitted_files', uploadFiles);  
    formData.append('online_class_id', props.fullData.online_class.id);
    let obj = {
      online_class_id: props.fullData.online_class.id,
      submitted_files: formData,
    };
    console.log(obj,'test and check')
    axiosInstance
      .post('/erp_user/student-classwork-upload/', formData)
      .then((res) => {
          handleClose();
          setAlert('success', 'Uploaded classwork')
        // setAssignedTeacher(res.data.result);
      })
      .catch((error) => {
        setAlert('error', error.message)
      });
  };

  return (
    <div className='upload-dialog-box'>
      <Dialog
        open={props.classWorkDialog}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Upload ClassWork</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText> */}
          <div className='box-size-dialog'>
            <input
              accept='image/*'
              className={classes.input}
              id='contained-button-file'
              // multiple
              type='file'
              onChange={(e) => handleUploadFile(e)}
            />
            <label htmlFor='contained-button-file'>
              <Button variant='contained' color='primary' component='span'>
                Upload
              </Button>
            </label>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={submitClassWorkAPI} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UploadClassWorkDiaogBox;
