import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import axiosInstance from '../../../../config/axios';
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
  const [uploadFiles, setUploadFiles] = useState([]);
  //     const [open, setOpen] = React.useState(false);

  //     const handleClickOpen = () => {
  //       setOpen(true);
  //     };
  console.log(props.fullData, 'fulldata');
  const handleUploadFile = (e) => {
    let value = e.target.value;
    let arrayFiles = uploadFiles;
    arrayFiles.push(value);
    setUploadFiles(arrayFiles);

    console.log(uploadFiles, 'files selected');
  };
  const handleClose = () => {
    props.OpenDialogBox(false);
  };
  //   let date = new Date().getDate();
  //   console.log(date);
  const submitClassWorkAPI = () => {
    // let date = new Date().getDate();
    // console.log(date);
    let obj = {
      online_class_id: props.fullData.online_class.id,
      // date:,
      submitted_files: uploadFiles,
    };
    axiosInstance
      .post('/erp_user/student-classwork-upload/', obj)
      .then((res) => {
          handleClose();
        // setAssignedTeacher(res.data.result);
      })
      .catch((error) => {
        // setAlert('error', "can't fetch teachers list");
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
              multiple
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
