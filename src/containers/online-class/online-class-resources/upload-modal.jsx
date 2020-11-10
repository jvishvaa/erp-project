import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Divider,
  makeStyles,
  Button,
  Grid,
  TextField,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import {
  CloudUpload as UploadIcon,
  HighlightOffOutlined as CloseIcon,
  AddCircleOutline as AddIcon,
  EditOutlined as EditIcon,
  OpenInBrowserOutlined as OpenIcon,
} from '@material-ui/icons';

import { fileUploadStyles, fileUploadButton, fileRow } from './uploadModal.styles';
import Modal from './modal';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';

import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const allowedExtensions = [
  'ogg',
  'mpeg',
  'wav',
  'mp3',
  'mp4',
  'mkv',
  'webm',
  'png',
  'jpeg',
  'jpg',
  'pdf',
];
const audioExtension = ['ogg', 'mpeg', 'wav', 'mp3'];
const videoExtensions = ['mp4', 'mkv', 'webm'];
const imageExtensions = ['png', 'jpeg', 'jpg'];
const pdfExtensions = ['pdf'];

const { user_id: userId } = JSON.parse(localStorage.getItem('userDetails')) || {};

const getResourceType = (file, type) => {
  const resource = type === 'homework' ? file.homework : file.resource;
  const tempArr = resource.split('.');
  const ext = tempArr.length ? tempArr[tempArr.length - 1] : 'unsupported';
  if (audioExtension.includes(ext)) {
    return 'audio';
  }
  if (videoExtensions.includes(ext)) {
    return 'video';
  }
  if (imageExtensions.includes(ext)) {
    return 'image';
  }
  if (pdfExtensions.includes(ext)) {
    return 'pdf';
  }
  return 'unsupported';
};

const useStylesButton = makeStyles(fileUploadButton);
const useStyles = makeStyles(fileUploadStyles);
const useStyleRow = makeStyles(fileRow);

// CustomButton component
const CustomFileUpload = (props) => {
  const classes = useStylesButton();
  const { className, ...otherProps } = props;
  const { setAlert } = useContext(AlertNotificationContext);
  return (
    <div className={[classes.wrapper, className].join(' ')}>
      <Button
        color='primary'
        variant='contained'
        size={otherProps.isMobile ? 'small' : 'large'}
        startIcon={<UploadIcon />}
      >
        Upload File
        <input type='file' className={classes.fileInput} {...otherProps} />
      </Button>
    </div>
  );
};

// FileRow Component
const FileRow = ({ file, onClose, className, isExisting, resourceType, uploadType }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [source, setSource] = useState(null);

  const resourceLink = uploadType === 'resource' ? file.resource : file.homework;
  const classes = useStyleRow();

  const playClickHandler = (resourceType, src) => {
    if (resourceType === 'audio') {
      setAudioModalOpen(true);
    } else {
      setVideoModalOpen(true);
    }
    setSource(src);
  };

  const imageClickHandler = (src) => {
    axiosInstance
      .get(src, {
        responseType: 'blob',
      })
      .then((res) => {
        const url = window.URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => {
        setAlert('error', 'Failed To Get Image');
      });
  };

  const getView = (resourceType) => {
    if (resourceType === 'image' || resourceType === 'pdf') {
      return (
        <span className={classes.link} onClick={() => imageClickHandler(resourceLink)}>
          View
        </span>
      );
    }
    if (resourceType === 'audio') {
      return (
        <span
          onClick={() => {
            playClickHandler('audio', resourceLink);
          }}
          className={classes.link}
        >
          Play
        </span>
      );
    }
    if (resourceType === 'video') {
      return (
        <span
          className={classes.link}
          onClick={() => {
            playClickHandler('video', resourceLink);
          }}
        >
          Play
        </span>
      );
    }
    return <span>{}</span>;
  };

  let name = null;
  if (isExisting) {
    const tempArr = resourceLink.split('/');
    name = tempArr[tempArr.length - 1];
  }

  let audioModal = null;
  if (audioModalOpen) {
    audioModal = (
      <Modal
        open={audioModalOpen}
        click={() => setAudioModalOpen(false)}
        style={{ zIndex: '1500' }}
        small
      >
        <audio controls style={{ marginTop: '15px' }}>
          <source src={source} type='audio/ogg' />
          <source src={source} type='audio/mpeg' />
          <source src={source} type='audio/wav' />
          Your browser does not support the audio element.
        </audio>
      </Modal>
    );
  }

  let videoModal = null;
  if (videoModalOpen) {
    videoModal = (
      <Modal
        open={videoModalOpen}
        click={() => setVideoModalOpen(false)}
        style={{ zIndex: '1500' }}
      >
        <video width='100%' height='100%' autoPlay controls style={{ marginTop: '15px' }}>
          <source src={source} type='video/mp4' />
          <source src={source} type='video/ogg' />
          <source src={source} type='video/webm' />
          Your browser does not support the video tag.
        </video>
      </Modal>
    );
  }
  return (
    <div className={className}>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h6'>{isExisting ? name : file.name}</Typography>
        </Grid>
        <Grid item xs={6} md={2}>
          <CloseIcon onClick={onClose} className={classes.icon} />
        </Grid>
        {resourceType ? (
          <Grid item xs={2}>
            {getView(resourceType)}
          </Grid>
        ) : null}
      </Grid>
      <Divider />
      {videoModal}
      {audioModal}
    </div>
  );
};

// UploadModal Component
const UploadModal = ({ id, onClose, isMobile, type }) => {
  const [files, setFiles] = useState([]);
  const [existingUpload, setExistingUpload] = useState([]);
  const [description, setDescription] = useState('');
  const [resourceLinks, setResourceLinks] = useState([{}]);
  const [existingLinks, setExistingLinks] = useState([]);
  // const [descriptions, setDescriptions] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [descriptionError, setDescriptionError] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const { setAlert } = useContext(AlertNotificationContext);

  const classes = useStyles();

  useEffect(() => {
    let url;
    if (type === 'resource') {
      url = endpoints.onlineClass.resourceFile;

      axiosInstance
        .get(`${endpoints.onlineClass.resourceLink}?online_class_id=${id}`)
        .then((res) => {
          if (res.data && res.data.data.length > 0) {
            setExistingLinks(res.data.data);
          }
        })
        .catch((err) => console.error(err));
    } else {
      url = endpoints.onlineClass.resourceFile;
    }
    axiosInstance
      .get(`${url}?online_class_id=${id}`)
      .then((res) => {
        if (res.data && res.data.data) {
          if (type === 'homework') {
            setExistingUpload(res.data.data.homework[0].homeworkfile || []);
            setDescription(res.data.data.homework[0].description);
          } else {
            setExistingUpload(res.data.data);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [id, type]);

  const uploadFileHandler = (e) => {
    if (e.target.files[0]) {
      const tempArr = e.target.files[0].name.split('.');
      const ext = tempArr.length ? tempArr[tempArr.length - 1] : 'unsupported';
      if (!allowedExtensions.includes(ext)) {
        setAlert('error', 'Unsupported File Type');
        return;
      }
      const newFiles = [...files, e.target.files[0]];
      setFiles(newFiles);
    }
  };

  const removeFileHandler = (i) => {
    const newFiles = files.filter((_, index) => index !== i);
    setFiles(newFiles);
  };

  const removeExistingFileHandler = (fileId) => {
    let url = endpoints.onlineClass.resourceFile;
    let params = {
      resource_id: fileId,
    };
    if (type === 'homework') {
      url = endpoints.onlineClass.resourceFile;
      params = {
        homework_id: fileId,
      };
    }
    axiosInstance
      .delete(`${url}`, {
        params,
      })
      .then((res) => {
        const updatedFiles = existingUpload.filter((file) => file.id !== fileId);
        setExistingUpload(updatedFiles);
        setAlert('success', 'Deleted Permanently');
      })
      .catch((err) => {
        setAlert('error', 'Failed To Delete Resource');
      });
  };

  const errorCallback = (err, errorQueue, customMessage) => {
    errorQueue && errorQueue.push(customMessage);
    setAlert(
      'warning',
      (err.response &&
        err.response.data &&
        err.response.data.status &&
        err.response.data.status[0].status) ||
        customMessage ||
        'Something Went Wrong'
    );
  };
  // const Description = () => {
  //   setDescriptions(descriptions)
  //   if (!descriptions) {
  //     setDescriptionError(true)
  //   }
  // }

  const submitFilesHandler = () => {
    setDescriptionError(false);
    setDisableButton(true);
    const filteredResourceLinks = resourceLinks.filter((item) => item.name && item.link);
    const filteredExisitingLinks = existingLinks.filter((item) => item.isEditable);
    // let descripationValue = Description()
    // if (descripationValue) {
    //   return
    // }

    if (
      files.length === 0 &&
      type === 'resource' &&
      filteredResourceLinks.length === 0 &&
      filteredExisitingLinks === 0
    ) {
      setAlert('warning', 'Atleast one file or link is required');
      setDisableButton(false);
      return;
    }
    if (type === 'homework' && files.length === 0 && existingUpload.length === 0) {
      setAlert('warning', 'Select atleast one file');
      setDisableButton(false);
      return;
    }
    if (type === 'homework' && !description) {
      setDisableButton(false);
      setAlert('warning', 'Description is required');
      return;
    }

    const errorQueue = [];
    const formData = new FormData();
    let url;
    let uploadPromise;
    let linkPostPromise;
    let linkPutPromise;

    if (type === 'resource') {
      url = endpoints.onlineClass.resourceFile;
      if (filteredExisitingLinks.length > 0) {
        const links = JSON.stringify(filteredExisitingLinks);
        const fData = new FormData();
        fData.append('online_class_id', id);
        fData.append('resource', links);
        fData.append('user_id', userId);
        // const body = {
        //   online_class_id: id,
        //   resource: filteredExisitingLinks,
        //   user_id: userId,
        // };
        linkPutPromise = axiosInstance.put(endpoints.onlineClass.resourceLink, fData);
      }

      if (filteredResourceLinks.length > 0) {
        const links = JSON.stringify(filteredResourceLinks);
        const fData = new FormData();
        fData.append('online_class_id', id);
        fData.append('resource', links);
        fData.append('user_id', userId);
        // const body = {
        //   online_class_id: id,
        //   resource: filteredResourceLinks,
        //   user_id: userId,
        // };
        linkPostPromise = axiosInstance.post(endpoints.onlineClass.resourceLink, fData);
      }
    } else {
      url = endpoints.onlineClass.resourceLink;
      formData.set('description', description);
      formData.set('is_home_work_uploaded', 'true');
    }

    files.forEach((file, index) => {
      formData.append(`files`, files[index]);
    });
    formData.set('online_class_id', id);

    if (existingUpload.length && files.length) {
      uploadPromise = axiosInstance.put(url, formData);
    } else if (files.length) {
      uploadPromise = axiosInstance.post(url, formData);
    }

    Promise.all(
      [uploadPromise, linkPostPromise, linkPutPromise].filter(Boolean).map((p) =>
        p.catch((err) => {
          setDisableButton(false);
          errorCallback(
            err,
            errorQueue,
            `Error Occured While ${
              p === uploadPromise
                ? 'Uploading Resources'
                : p === linkPostPromise
                ? 'Submitting Links'
                : 'Updating Links'
            }`
          );
        })
      )
    ).then(() => {
      if (errorQueue.length === 0) {
        setAlert('success', 'Work Submitted Successfully');
        setDisableButton(false);
        setTimeout(() => {
          onClose();
        }, 500);
      }
    });
  };

  const resourceChangeHandler = (e, index, isExisting) => {
    const resources = isExisting ? existingLinks : resourceLinks;
    const newLinks = [...resources];
    const newResource = { ...newLinks[index] };
    newResource[e.target.name] = e.target.value;
    newLinks[index] = newResource;
    isExisting ? setExistingLinks(newLinks) : setResourceLinks(newLinks);
  };

  const removeLinkHandler = (index, isExisting, id) => {
    if (!isExisting) {
      const newLink = resourceLinks.filter((_, i) => index !== i);
      setResourceLinks(newLink);
      return;
    }
    axiosInstance
      .delete(`${endpoints.onlineClass.resourceLink}?online_class_resource_link_id=${id}`)
      .then(() => {
        const newLink = existingLinks.filter((item) => +item.id !== +id);
        setExistingLinks(newLink);
        setAlert('success', 'Record Deleted Successfully');
      })
      .catch((err) => {
        setAlert('warning', 'Failed to perform action');
      });
  };

  const addLinkHandler = () => {
    const newLink = [...resourceLinks, {}];
    setResourceLinks(newLink);
  };

  const editLinkHandler = (i) => {
    const newExistingLinks = [...existingLinks];
    const record = { ...newExistingLinks[i], isEditable: true };
    newExistingLinks[i] = record;
    setExistingLinks(newExistingLinks);
  };

  const openLinkHandler = (link) => {
    if (link && link.length) {
      window.open(link);
    }
  };

  const getResourceLink = (resources, isExisting) => {
    const addResourceLink = resources.map((item, i) => (
      <React.Fragment key={`item-${i}`}>
        <Grid item xs={12} md={3}>
          <TextField
            label='Resource Name'
            value={item.name || ''}
            variant='outlined'
            placeholder='Resource Name'
            fullWidth
            name='name'
            inputProps={{maxLength:30}}
            disabled={isExisting && !item.isEditable}
            onChange={(e) => resourceChangeHandler(e, i, isExisting)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label='Resource Link'
            value={item.link || ''}
            variant='outlined'
            placeholder='Resource Link'
            fullWidth
            disabled={isExisting && !item.isEditable}
            name='link'
            onChange={(e) => resourceChangeHandler(e, i, isExisting)}
          />
        </Grid>
        {(i > 0 || isExisting) && (
          <Grid item xs={4} md={1}>
            <Tooltip title='Remove'>
              <IconButton onClick={() => removeLinkHandler(i, isExisting, item.id)}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        {isExisting ? (
          <Grid item xs={8} md={2}>
            <Grid container alignItems='center' spacing={2}>
              <Grid item xs={6}>
                <Tooltip title='Edit Link'>
                  <IconButton onClick={() => editLinkHandler(i)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <Tooltip title='Open Link'>
                  <IconButton
                    onClick={() => openLinkHandler(item.link && item.link.trim())}
                  >
                    <OpenIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid item xs={4} md={1}>
            <Tooltip title='Add New'>
              <IconButton onClick={addLinkHandler}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        <Grid xs={12}>
          <Divider />
        </Grid>
      </React.Fragment>
    ));

    return addResourceLink;
  };

  return (
    <div className={classes.container}>
      <Typography variant={isMobile ? 'h6' : 'h4'} className={classes.heading}>
        Upload <span style={{ textTransform: 'capitalize' }}>{type}</span> Files
      </Typography>
      <Divider />
      {existingUpload.map((file, i) => {
        return (
          <FileRow
            file={file}
            isExisting
            onClose={() => removeExistingFileHandler(file.id)}
            className={classes.fileRow}
            resourceType={getResourceType(file, type)}
            uploadType={type}
            key={file.resource_id}
          />
        );
      })}
      {files.map((file, i) => (
        <FileRow
          file={file}
          onClose={() => removeFileHandler(i)}
          className={classes.fileRow}
        />
      ))}
      <CustomFileUpload
        className={classes.uploadButton}
        onChange={uploadFileHandler}
        isMobile={isMobile}
        accept='image/*, audio/*, video/*, application/pdf'
      />
      {existingLinks && existingLinks.length > 0 && (
        <Grid container spacing={2} alignItems='center' style={{ marginTop: '15px' }}>
          {getResourceLink(existingLinks, true)}
        </Grid>
      )}
      {type.trim() === 'homework' ? (
        <TextField
          className={classes.description}
          required
          label='Description'
          value={description}
          variant='outlined'
          multiline
          placeholder='Homework Description'
          rowsmax={6}
          rows={6}
          inputProps={{maxLength:250}}
          fullWidth
          onChange={(e) => setDescription(e.target.value)}
        />
      ) : (
        <Grid container spacing={2} alignItems='center' style={{ marginTop: '15px' }}>
          {getResourceLink(resourceLinks, false)}
        </Grid>
      )}
      <div className={classes.submitButton}>
        <Button
          color='primary'
          variant='contained'
          onClick={submitFilesHandler}
          disabled={disableButton}
          size={isMobile ? 'small' : 'large'}
        >
          Submit
        </Button>
        <Typography variant='caption'>
          **Note: Supported File Formats are Image, Audio, Video, PDF
        </Typography>
      </div>
    </div>
  );
};

export default UploadModal;
