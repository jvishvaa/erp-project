import React, { useContext, useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import axiosInstance from '../../../../config/axios';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import DialogTitle from '@material-ui/core/DialogTitle';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import './uploadBox.scss';
import endpoints from '../../../../config/endpoints';
import SimpleReactLightbox, { SRLWrapper, useLightbox } from 'simple-react-lightbox';
import placeholder from '../../../../assets/images/placeholder_small.jpg';
import CancelIcon from '@material-ui/icons/Cancel';
import Attachment from '../../../homework/teacher-homework/attachment';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles((theme) => ({
  box: {
    width: '51%',
    height: '39%',
  },
  input: {
    display: 'none',
  },
  submitButton: {
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    color: 'rgb(140, 140, 140)',
  },
  uploadBoxTitle: {
    color: '#014b7e',
  },
}));

const UploadClassWorkDiaogBox = (props) => {
  const {
    setLoading,
    periodData: { date: periodDate },
    fullData: {
      online_class: { id: onlineClassId },
    },
  } = props;

  const classes = useStyles();
  const [uploadFiles, setUploadFiles] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const { openLightbox } = useLightbox();

  useEffect(() => {
    if (periodDate!=='') getPeriodDetails();
  }, [periodDate]);

  function getPeriodDetails() {
    axiosInstance
      .get(
        `${endpoints.onlineClass.periodDetails}?online_class_id=${onlineClassId}&date=${periodDate}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          const exstingFiles = result.data?.data || [];
          if (exstingFiles?.length) {
            setUploadFiles(exstingFiles);
          }
        }
      })
      .catch((error) => setAlert('error', error?.message));
  }

  function validateImageFile(imageName) {
    return (
      imageName?.endsWith('.jpg') ||
      imageName?.endsWith('.jpeg') ||
      imageName?.endsWith('.png')
    );
  }

  const handleDeleteImage = (index) => {
    setLoading(true);
    axiosInstance
      .post(`${endpoints.assessmentErp.fileRemove}`, {
        file_name: uploadFiles[index],
      })
      .then((result) => {
        if (result.data.status_code === 204) {
          const list = [...uploadFiles];
          list.splice(index, 1);
          setUploadFiles(list);
          setAlert('success', result.data.message);
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  };

  const handleUploadFile = (e) => {
    let value = e.target.files[0];
    if (uploadFiles?.length === 20) {
      setAlert('error', "Can't upload more than 20 images");
      return;
    }
    setLoading(true);
    if (validateImageFile(value?.name)) {
      const fd = new FormData();
      fd.append('file', value);
      fd.append('online_class_id', onlineClassId);
      fd.append('date', periodDate);
      axiosInstance
        .post(`academic/dairy-upload/`, fd)
        .then((result) => {
          if (result.data?.status_code === 200) {
            setAlert('success', result.data?.message);
            const list = [...uploadFiles];
            list.push(result.data?.result);
            setUploadFiles(list);
          } else {
            setAlert('error', result.data?.message);
          }
          setLoading(false);
        })
        .catch((error) => {
          setAlert('error', error?.message);
          setLoading(false);
        });
    } else {
      setAlert('error', 'Image can be of .jpg / .jpeg / .png format');
    }
  };

  const handleClose = () => {
    props.OpenDialogBox(false);
  };

  const submitClassWorkAPI = () => {
    if (uploadFiles?.length <= 0) {
      setAlert('error', 'Please select atleast 1 file to upload!');
      return;
    }
    let obj = {
      online_class_id: onlineClassId,
      submitted_files: [...uploadFiles],
    };
    axiosInstance
      .post('/erp_user/student-classwork-upload/', obj)
      .then((res) => {
        handleClose();
        setAlert('success', 'Uploaded classwork');
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };

  const imageRef = useRef(null);

  return (
    <div>
      <Dialog
        className='upload-dialog-box'
        open={props.classWorkDialog}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle className={classes.uploadBoxTitle} id='form-dialog-title'>
          Upload Classwork
        </DialogTitle>
        <DialogContent>
          <SimpleReactLightbox>
            <SRLWrapper>
              <div className='optionImageContainer1'>
                {uploadFiles?.map((url, index) => (
                  <div className='optionImageThumbnailContainer1'>
                    <img
                      ref={imageRef}
                      alt='file'
                      onError={(e) => {
                        e.target.src = placeholder;
                      }}
                      src={`${endpoints.assessmentErp.s3}${url}`}
                      className='optionImageAttachment1'
                    />
                    <div className='optionImageRemoveIcon1'>
                      <IconButton>
                        <VisibilityIcon
                          onClick={() => {
                            imageRef.current.click();
                          }}
                          style={{ color: '#ffffff' }}
                        />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteImage(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </SRLWrapper>
          </SimpleReactLightbox>
          {uploadFiles?.length === 0 && (
            <div className='noImagesTag'>No image to display!</div>
          )}
        </DialogContent>
        <DialogActions>
          <div className='box-size-dialog'>
            <input
              accept='image/*'
              className={classes.input}
              id='contained-button-file'
              type='file'
              onChange={(e) => handleUploadFile(e)}
            />
            <label htmlFor='contained-button-file' style={{ color: 'white' }}>
              <Button
                startIcon={<CloudUploadIcon />}
                className={classes.submitButton}
                variant='contained'
                color='primary'
                component='span'
              >
                Upload
              </Button>
            </label>
          </div>
          <Button className={classes.cancelButton} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className={classes.submitButton}
            onClick={submitClassWorkAPI}
            color='primary'
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UploadClassWorkDiaogBox;
