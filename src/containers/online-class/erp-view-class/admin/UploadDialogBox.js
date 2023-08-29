import React, { useContext, useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
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
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import './uploadBox.scss';
import endpoints from '../../../../config/endpoints';
import SimpleReactLightbox, { SRLWrapper, useLightbox } from 'simple-react-lightbox';
import placeholder from '../../../../assets/images/placeholder_small.jpg';
import CancelIcon from '@material-ui/icons/Cancel';
import Attachment from '../../../homework/teacher-homework/attachment';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import APIREQUEST from "../../../../config/apiRequest";
import moment from 'moment';
import { Box } from '@material-ui/core';

import WebCamDialog from '../webCamDialog';

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

const options = {
  settings: {
    autoplaySpeed: 0,
  },
};

const UploadClassWorkDiaogBox = (props) => {
  const {
    isTeacher = false,
    imageList = [],
    setLoading,
    periodData = {},
    classWorkDialog = false,
    OpenDialogBox,
    fullData = {},
    historicalData
  } = props || {};
  const { online_class = {} } = fullData || {};
  const { id: onlineClassId = '' } = online_class || {};
  const { date: periodDate = '' } = periodData || {};

  const classes = useStyles();
  const [uploadFiles, setUploadFiles] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const { openLightbox } = useLightbox();
  const [originalFiles, setOriginalFiles] = useState([]);
  const [webOpen, setwebOpen] = useState(false)

  useEffect(() => {
    if (isTeacher) {
      setUploadFiles(imageList);
    }
  }, [isTeacher]);

  useEffect(() => {
    if (periodDate !== '' && !isTeacher) getPeriodDetails();
  }, [periodDate]);

  const msapigetPeriodDetails = () => {
    APIREQUEST("get", `/oncls/v1/oncls-classwork/?online_class_id=${onlineClassId}&date=${periodDate}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          const exstingFiles = result.data?.data || [];
          if (exstingFiles?.length) {
            setOriginalFiles([...exstingFiles]);
            setUploadFiles([...exstingFiles]);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  }

  function getPeriodDetails() {
    // setLoading(true);
    if (JSON.parse(localStorage.getItem('isMsAPI')) && historicalData === false) {
      msapigetPeriodDetails();
      return;
    }
    axiosInstance
      .get(
        `${endpoints.onlineClass.periodDetails}?online_class_id=${onlineClassId}&date=${periodDate}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          const exstingFiles = result.data?.data || [];
          if (exstingFiles?.length) {
            setOriginalFiles([...exstingFiles]);
            setUploadFiles([...exstingFiles]);
          }
        }
        // setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        // setLoading(false);
      });
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
  const [webcam, setwebcam] = useState('')
  const handleWebcam = () => {
    setwebOpen(!webOpen)

  }
  const handleUploadFile = (value) => {
    // let value = value
    // let value = e.target.files[0];
    if (uploadFiles?.length === 20) {
      setAlert('error', "Can't upload more than 20 images");
      return;
    }
    if (validateImageFile(value?.name)) {
      setLoading(true);
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
    // e.target.value = '';

  };

  const handleClose = () => {
    OpenDialogBox(false);
  };
  // const [image, setImage] = useState(null);
  // const [dimensions, setDimensions] = useState(null);
  // const [imageclick, setimageclick] = useState(false)
  // const submitImage = (img, dim) => {
  //   setImage(img);
  //   setDimensions(dim);
  //   // setimageclick(true)
  //   setwebcam('submitImage')
  //   // setId(id);
  //   // setCurrent("submitImage");
  // };

  const handleValidateFileChange = () => {
    let canUpload = false;
    if (originalFiles?.length !== uploadFiles?.length) {
      canUpload = true;
    }
    if (originalFiles?.length === uploadFiles?.length) {
      for (let i = 0; i < originalFiles?.length; i++) {
        if (!uploadFiles.includes(originalFiles[i])) {
          canUpload = true;
          break;
        }
      }
    }
    return canUpload;
  };

  const msApisubmitClassWorkAPI = (obj) => {
    APIREQUEST("post", '/oncls/v1/submit-classwork/', obj)
      .then(() => {
        handleClose();
        setAlert('success', 'Uploaded classwork');
      })
      .catch((error) => {
        setAlert('error', error.message);
      });

  }

  const reclickImage = () => {
    setwebcam('detectImage')
    // setimageclick(false)
  }

  const submitClassWorkAPI = () => {
    if (uploadFiles?.length <= 0 && !handleValidateFileChange()) {
      setAlert('error', 'Please select atleast 1 file to upload!');
      return;
    }
    if (originalFiles?.length) {
      if (!handleValidateFileChange()) {
        setAlert('error', 'Nothing to submit!');
        return;
      }
    }
    let obj = {
      online_class_id: onlineClassId,
      submitted_files: [...uploadFiles],
    };
    if (JSON.parse(localStorage.getItem('isMsAPI')) && historicalData === false) {
      msApisubmitClassWorkAPI(obj)
      return;
    }
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

  const isLessthanToday = () => {
    let currt = moment().startOf('day');
    let perddate = moment(periodDate, "YYYY-MM-DD");
    if (periodData?.class_status?.toLowerCase() == "completed" && perddate < currt) {
      return true
    }
    return false
  };

  const imageRef = useRef(null);

  return (
    <div>
      <Dialog
        className='upload-dialog-box'
        open={classWorkDialog}
        style={{ zIndex: '2001' }}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
        disableBackdropClick 
      >
        <DialogTitle className={classes.uploadBoxTitle} id='form-dialog-title'>
          {isTeacher ? 'Classwork' : 'Upload Classwork'}
        </DialogTitle>
        <DialogContent>
          <SimpleReactLightbox>
            <SRLWrapper options={options}>
              <Grid container spacing={2} className='optionImageContainer1'>
                {uploadFiles?.map((url, index) => (
                  <Grid
                    item
                    xs={6}
                    sm={3}
                    md={3}
                    lg={3}
                    className='optionImageThumbnailContainer1'
                  >
                    <img
                      ref={imageRef}
                      alt='file'
                      onError={(e) => {
                        console.log('place.e.tag', e.target.src);
                        e.target.src = placeholder;


                      }}
                      src={isTeacher ? url : `${endpoints.assessmentErp.s3}/${url}`}
                      className='optionImageAttachment1'
                    />

                    <div className='optionImageRemoveIcon1'>
                      {/* <IconButton>
                        <VisibilityIcon
                          onClick={() => {
                            console.log('imageRef',imageRef)
                            console.log('imageRef.current.click()',imageRef.current.src= placeholder)
                            // console.log('imageRef.current.classList.currentSrc',imageRef.current.classList)
                            
                            imageRef.current.click();
                            
                          }}
                          style={{ color: '#014b7e' }}
                        />
                      </IconButton> */}
                      {!isTeacher && (
                        <IconButton onClick={() => handleDeleteImage(index)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </div>
                  </Grid>
                ))}
              </Grid>
            </SRLWrapper>
          </SimpleReactLightbox>
          {uploadFiles?.length === 0 && (
            <div className='noImagesTag'>No image to display!</div>
          )}

          {/* {webcam == 'detectImage' && <ObjectDetection
            submitImage={submitImage}
          />} */}
          {webOpen && <WebCamDialog
            webOpen={webOpen}
            handleUploadFile={handleUploadFile}
            handleWebcam={handleWebcam}
          />}
          {/* {
            webcam == 'submitImage' &&
            <ImageSubmitted
              image={image}
              dimensions={dimensions}
              reclickImage={reclickImage}
            />
          } */}

        </DialogContent>
        <DialogActions>

          {!isTeacher && (
            <div className='box-size-dialog'>
              <input
                accept='image/*'
                className={classes.input}
                id='contained-button-file'
                type='file'
                onChange={(e) => {
                  handleUploadFile(e.target.files[0]);
                  e.target.value = ''
                }}
              />
              <label htmlFor='contained-button-file' style={{ color: 'white' }}>
                {!isLessthanToday() &&
                  <Button
                    startIcon={<CloudUploadIcon />}
                    className={classes.submitButton}
                    variant='contained'
                    color='primary'
                    component='span'
                    style={{ color: 'white' }}
                  >
                    Upload
                  </Button>
                }
              </label>
            </div>
          )}
          {!isTeacher && (
            <div className='cam' style={{ marginRight: "31%" }}>

              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {!isLessthanToday() &&
                  <Button
                    startIcon={<PhotoCamera />}
                    color='primary'
                    variant="contained"
                    onClick={handleWebcam}
                  >
                    Capture
                  </Button>
                  // <IconButton
                  //   color='primary'
                  //   onClick={handleWebcam}
                  // >
                  //   < />
                  // </IconButton>
                }
              </Box>
            </div>
          )}
          <Button className='cancelButton labelColor' onClick={handleClose}>
            {isTeacher ? 'Close' : 'Cancel'}
          </Button>
          {!isLessthanToday() && !isTeacher && (
            <Button
              onClick={submitClassWorkAPI}
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
            >
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default UploadClassWorkDiaogBox;
