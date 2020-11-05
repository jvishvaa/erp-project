/* eslint-disable no-else-return */
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Divider,
  makeStyles,
  Button,
  Grid,
  TextField,
  Tooltip,
  IconButton,
  Modal as MaterialModal,
} from '@material-ui/core';
import {
  CloudUpload as UploadIcon,
  HighlightOffOutlined as CloseIcon,
  OpenInBrowserOutlined as OpenIcon,
} from '@material-ui/icons';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { resourceModalStyles, fileUploadButton, fileRow } from './resourceModal.styles';
import Modal from './modal';

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
const useStyles = makeStyles(resourceModalStyles);
const useStyleRow = makeStyles(fileRow);

// CustomButton component
const CustomFileUpload = (props) => {
  const classes = useStylesButton();
  const { className, ...otherProps } = props;
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
const FileRow = ({
  id,
  alert,
  file,
  className,
  isExisting,
  resourceType,
  onClose,
  uploadType,
}) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [attemptModalOpen, setAttemptModalOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
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
        console.error(err);
        alert.warning('Failed To Get Image');
      });
  };

  const attemptClickHandler = (resourceLink) => {
    setAttemptModalOpen(true);
  };


  const getView = (resourceType) => {
    if (resourceType === 'image' || resourceType === 'pdf') {
      return (<><span
        className={classes.link}
        onClick={() => imageClickHandler(resourceLink)}
      >
          View
      </span>
      &nbsp;&nbsp;
        {uploadType !== 'resource' && <span
          className={classes.link}
          onClick={() => attemptClickHandler()}
        >
        Attempt Online
        </span>}</>
      )
    } else if (resourceType === 'audio') {
      return (
        <span
          onClick={() => { playClickHandler('audio', resourceLink) }}
          className={classes.link}
        >
          Play
        </span>
      )
    } else if (resourceType === 'video') {
      return (
        <span
          className={classes.link}
          onClick={() => { playClickHandler('video', resourceLink) }}
        >
          Play
        </span>
      )
    } else {
      return (
        <span>{ }</span>
      )
    }
  }

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
  function exitFullScreen() {
    // console.log("Exiting fullscreen...")
    try {
      if (document.fullscreenEnabled) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch((e) => console.log('Fullscreen issue', e));
        } else if (document.mozCancelFullScreen) {
          /* Firefox */
          document.mozCancelFullScreen().catch((e) => console.log('Fullscreen issue', e));
        } else if (document.webkitExitFullscreen) {
          /* Chrome, Safari and Opera */
          document
            .webkitExitFullscreen()
            .catch((e) => console.log('Fullscreen issue', e));
        } else if (document.msExitFullscreen) {
          /* IE/Edge */
          document.msExitFullscreen().catch((e) => console.log('Fullscreen issue', e));
        }
      }
    } catch (e) {
      console.log('Fullscreen issue', e);
    }
  }
  function enterFullScreen(elem = document.getElementById('attempt-iframe')) {
    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((e) => console.log('Fullscreen issue', e));
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen().catch((e) => console.log('Fullscreen issue', e));
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen().catch((e) => console.log('Fullscreen issue', e));
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen().catch((e) => console.log('Fullscreen issue', e));
      }
    } catch (e) {
      console.log('Fullscreen issue', e);
    }
  }
  let attemptModal = null;
  if (attemptModalOpen) {
    window.addEventListener('message', function (event) {
      console.log('received: ', event.origin, event.data);
      // can message back using event.source.postMessage(...)
      if (event.data === 'closeMe') {
        setAttemptModalOpen(false);
      } else if (event.data === 'toggleFullscreen') {
        if (isFullScreen) {
          exitFullScreen();
          setIsFullScreen(false);
        } else {
          enterFullScreen();
          setIsFullScreen(true);
        }
      }
    });
    attemptModal = (
      <MaterialModal
        open={attemptModalOpen}
        onClose={() => setAttemptModalOpen(false)}
        style={{ zIndex: '1500' }}
      >
        <div style={{ width: '100vw', height: '100vh' }}>
          <iframe
            id='attempt-iframe'
            src={`${''}/homework_tool/?file_id=${file.id}&hw_submission_id=13`}
            frameBorder='0'
            style={{ overflow: 'hidden', height: '100%', width: '100%' }}
            height='100%'
            width='100%'
          />
        </div>
      </MaterialModal>
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
        <Grid item xs={8} md={8}>
          <Typography variant='h6'>{isExisting ? name : file.name}</Typography>
        </Grid>
        {resourceType ? (
          <Grid item xs={4}>
            {getView(resourceType)}
          </Grid>
        ) : (
          <Grid item xs={4} md={4}>
            <CloseIcon onClick={onClose} className={classes.icon} />
          </Grid>
        )}
      </Grid>
      <Divider />
      {videoModal}
      {audioModal}
      {attemptModal}
    </div>
  );
};

// UploadModal Component
const ResourceModal = ({ id, alert, onClick, isMobile, type, isOpen }) => {
  const [files, setFiles] = useState([]);
  const [existingUpload, setExistingUpload] = useState([]);
  const [description, setDescription] = useState('');
  const [existingLinks, setExistingLinks] = useState([]);
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
        if (res.data && res.data.data && res.data.data.length > 0) {
          if (type === 'homework') {
            setExistingUpload(res.data.data[0].homeworkfile || []);
            setDescription(res.data.data[0].description);
          } else {
            setExistingUpload(res.data.data);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [id, type, alert]);

  const uploadFileHandler = (e) => {
    if (e.target.files[0]) {
      const tempArr = e.target.files[0].name.split('.');
      const ext = tempArr.length ? tempArr[tempArr.length - 1] : 'unsupported';
      if (!allowedExtensions.includes(ext)) {
        alert.warning('Unsupported File Type');
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

  const submitFilesHandler = () => {
    if (files.length === 0 && type === 'homework' && existingUpload.length === 0) {
      alert.warning('Minimum 1 file is required');
      return;
    }
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, files[index]);
    });
    formData.set('online_class_id', id);
    axiosInstance
      .post(endpoints.onlineClass.resourceFile, formData)
      .then((response) => {
        alert.success('Work Submitted Successfully');
        setTimeout(() => {
          onClick();
        }, 500);
      })
      .catch((err) => {
        console.error(err);
        alert.warning(
          (err.response &&
            err.response.data &&
            err.response.data.status &&
            err.response.data.status[0].status) ||
            'Something Went Wrong'
        );
      });
  };

  const openLinkHandler = (link) => {
    if (link && link.length) {
      window.open(link);
    }
  };

  const getResourceLink = (resources) => {
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
            disabled
            onChange={(e) => {}}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label='Resource Link'
            value={item.link || ''}
            variant='outlined'
            placeholder='Resource Link'
            fullWidth
            disabled
            name='link'
            onChange={(e) => {}}
          />
        </Grid>
        <Grid item xs={6} md={1}>
          <Tooltip title='Open Link'>
            <IconButton onClick={() => openLinkHandler(item.link && item.link.trim())}>
              <OpenIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid xs={12}>
          <Divider />
        </Grid>
      </React.Fragment>
    ));

    return addResourceLink;
  };

  const homeWorkViewRender = () => (
    <>
      {description && (
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
          fullWidth
          disabled
          onChange={(e) => {}}
        />
      )}
      <Divider className={classes.divider} />
      <Typography variant='body1' style={{ textAlign: 'center' }}>
        Upload Your Files Here
      </Typography>
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
      <div>
        <Button
          color='primary'
          variant='contained'
          onClick={submitFilesHandler}
          size={isMobile ? 'small' : 'large'}
        >
          Submit
        </Button>
        <Typography variant='caption'>
          **Note: Supported File Formats are Image, Audio, Video, PDF
        </Typography>
      </div>
    </>
  );

  const resourceViewRenderer = () => (
    <Grid container spacing={2} alignItems='center' style={{ marginTop: '12px' }}>
      {getResourceLink(existingLinks)}
    </Grid>
  );

  return (
    <Modal open={isOpen} click={onClick} large>
      <div className={classes.container}>
        <Typography variant={isMobile ? 'h6' : 'h4'} className={classes.heading}>
          <span style={{ textTransform: 'capitalize' }}>{type}</span> Files
        </Typography>
        <Divider />
        {existingUpload.map((file, i) => (
          <FileRow
            file={file}
            isExisting
            className={classes.fileRow}
            resourceType={getResourceType(file, type)}
            alert={alert}
            uploadType={type}
          />
        ))}
        {type.trim() === 'homework' ? homeWorkViewRender() : resourceViewRenderer()}
      </div>
    </Modal>
  );
};

export default ResourceModal;
