/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import {
  IconButton,
  OutlinedInput,
  FormHelperText,
  Typography,
  Badge,
} from '@material-ui/core';
// import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { Grid, withStyles, Popover } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CancelIcon from '@material-ui/icons/Cancel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import { uploadFile } from '../../redux/actions';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import placeholder from '../../assets/images/placeholder_small.jpg';
import Attachment from '../../containers/homework/teacher-homework/attachment';
import endpoints from '../../config/endpoints';
import FileValidators from '../../components/file-validation/FileValidators';

import './styles.scss';

const StyledButton = withStyles({
  root: {
    color: '#FFFFFF',
    backgroundColor: '#FF6B6B',
    '&:hover': {
      backgroundColor: '#FF6B6B',
    },
  },
})(Button);

const CancelButton = withStyles({
  root: {
    color: '#8C8C8C',
    backgroundColor: '#e0e0e0',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
})(Button);

const QuestionCard = ({
  addNewQuestion,
  question,
  index,
  handleChange,
  removeQuestion,
}) => {
  const [attachments, setAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [enableAttachments, setEnableAttachments] = useState(false);
  const [openAttachmentModal, setOpenAttachmentModal] = useState(false);
  const [fileUploadInProgress, setFileUploadInProgress] = useState(false);
  const firstUpdate = useRef(true);
  const fileUploadInput = useRef(null);
  const attachmentsRef = useRef(null);
  const { setAlert } = useContext(AlertNotificationContext);
  const [sizeValied, setSizeValied] = useState({});

  const handleScroll = (dir) => {
    if (dir === 'left') {
      attachmentsRef.current.scrollLeft -= 150;
    } else {
      attachmentsRef.current.scrollLeft += 150;
    }
  };

  const openAttchmentsModal = () => {
    setOpenAttachmentModal(true);
  };

  const closeAttachmentsModal = () => {
    setOpenAttachmentModal(false);
  };

  const onChange = (field, value) => {
    handleChange(index, field, value);
  };

  const handleFileUpload = async (file) => {
    const isValid = FileValidators(file);
    !isValid?.isValid && isValid?.msg && setAlert('error', isValid?.msg);

    //setSizeValied(isValid);
    // if(file.name.lastIndexOf('.mp3') || file.name.lastIndexOf('.mp4')){
    //   if(file.size > 5242880){
    //     setSizeValied(true);
    //     return false
    //   }
    //   else {
    //     setSizeValied(false);
    //   }
    // }

    if (isValid?.isValid) {
      try {
        if (
          file.name.lastIndexOf('.pdf') > 0 ||
          file.name.lastIndexOf('.jpeg') > 0 ||
          file.name.lastIndexOf('.jpg') > 0 ||
          file.name.lastIndexOf('.png') > 0 ||
          file.name.lastIndexOf('.mp3') > 0 ||
          file.name.lastIndexOf('.mp4') > 0
        ) {
          const fd = new FormData();
          fd.append('file', file);
          setFileUploadInProgress(true);
          const filePath = await uploadFile(fd);
          if (file.type === 'application/pdf') {
            setAttachments((prevState) => [...prevState, ...filePath]);
            setAttachmentPreviews((prevState) => [...prevState, ...filePath]);
          } else {
            setAttachments((prevState) => [...prevState, filePath]);
            setAttachmentPreviews((prevState) => [...prevState, filePath]);
          }
          setFileUploadInProgress(false);
          setAlert('success', 'File uploaded successfully');
          setSizeValied('');
        } else {
          setAlert('error', 'Please upload valid file');
        }
      } catch (e) {
        setFileUploadInProgress(false);
        setAlert('error', 'File upload failed');
      }
    }
  };

  // Confirm Popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const removeAttachment = (index) => {
    setAttachmentPreviews((prevState) => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ]);
    setAttachments((prevState) => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ]);
  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('attachments', attachments);
  }, [attachments]);

  return (
    <Grid container className='home-question-container'>
      <Dialog maxWidth='sm' open={openAttachmentModal} onClose={closeAttachmentsModal}>
        <DialogTitle color='primary'>Attachments</DialogTitle>
        <DialogContent style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Grid container>
            {attachmentPreviews.map((preview, index) => (
              <Grid item md='4' spacing={2}>
                <IconButton onClick={() => removeAttachment(index)}>
                  <CancelIcon style={{ width: '25px' }} className='disabled-icon' />
                </IconButton>
                <img src={preview} alt='preview' style={{ width: '100%' }} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeAttachmentsModal}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12}>
        <Card className='question-card'>
          <CardContent>
            <Grid container>
              <Grid item container>
                <Grid item xs={12}>
                  <FormControl variant='outlined' fullWidth size='small'>
                    {/* <InputLabel htmlFor='component-outlined'>Question</InputLabel> */}
                    <TextField
                      id='question'
                      name='question'
                      onChange={(e) => {
                        onChange('question', e.target.value);
                      }}
                      label='Question'
                      autoFocus
                      multiline
                      rows={4}
                      rowsMax={6}
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {question.errors?.question}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item md={6}>
                  <div>
                    <input
                      className='file-upload-input'
                      type='file'
                      name='attachments'
                      accept='.png, .jpg, .jpeg, .mp3, .mp4, .pdf'
                      onChange={(e) => {
                        handleFileUpload(e.target.files[0]);
                        // onChange('attachments', Array.from(e.target.files)[]);
                      }}
                      ref={fileUploadInput}
                    />
                    {fileUploadInProgress ? (
                      <div>
                        <CircularProgress
                          color='primary'
                          style={{ width: '25px', height: '25px', margin: '5px' }}
                        />
                      </div>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => fileUploadInput.current.click()}
                          title='Attach files'
                        >
                          <Badge badgeContent={attachmentPreviews.length} color='primary'>
                            <AttachFileIcon color='primary' />
                          </Badge>
                        </IconButton>
                        <small style={{ width: '100%', color: '#014b7e' }}>
                          {' '}
                          Accepted files: jpeg,jpg,mp3,mp4,pdf,png
                          {/*sizeValied ? 'Accepted files: jpeg,jpg,mp3,mp4,pdf,png' : 'Document size should be less than 5MB !'*/}
                        </small>
                      </>
                    )}
                  </div>
                  <div>
                    {/* {attachmentPreviews.slice(0, 2).map((url) => (
                      <img
                        src={url}
                        alt='preview'
                        style={{ width: '45px', margin: '5px' }}
                      />
                    ))}
                    {attachmentPreviews.length > 2 && (
                      <Typography
                        component='h5'
                        color='primary'
                        onClick={openAttchmentsModal}
                        style={{ cursor: 'pointer', marginTop: '5px' }}
                      >
                        View all attachments
                      </Typography>
                    )} */}
                  </div>
                </Grid>
              </Grid>
              {attachmentPreviews.length > 0 && (
                <Grid item xs={12} className='attachments-grid'>
                  <div className='attachments-list-outer-container'>
                    <div className='prev-btn'>
                      {attachmentPreviews.length > 2 && (
                        <IconButton onClick={() => handleScroll('left')}>
                          <ArrowBackIosIcon />
                        </IconButton>
                      )}
                    </div>
                    <SimpleReactLightbox>
                      <div
                        className='attachments-list'
                        ref={attachmentsRef}
                        onScroll={(e) => {
                          e.preventDefault();
                        }}
                      >
                        {attachmentPreviews.map((url, i) => (
                          <>
                            {Array.from({ length: 1 }, () => (
                              <div className='attachment'>
                                <Attachment
                                  key={`homework_student_question_attachment_${i}`}
                                  fileUrl={url}
                                  fileName={`Attachment-${i + 1}`}
                                  urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                                  index={i}
                                  actions={['preview', 'download', 'delete']}
                                  onDelete={removeAttachment}
                                />
                              </div>
                            ))}
                          </>
                        ))}

                        <div style={{ position: 'absolute', visibility: 'hidden' }}>
                          <SRLWrapper>
                            {attachmentPreviews.map((url, i) => (
                              <img
                                src={`${endpoints.discussionForum.s3}/homework/${url}`}
                                onError={(e) => {
                                  e.target.src = placeholder;
                                }}
                                alt={`Attachment-${i + 1}`}
                              />
                            ))}
                          </SRLWrapper>
                        </div>
                      </div>
                    </SimpleReactLightbox>
                    <div className='next-btn'>
                      {attachmentPreviews.length > 2 && (
                        <IconButton onClick={() => handleScroll('right')}>
                          <ArrowForwardIosIcon color='primary' />
                        </IconButton>
                      )}
                    </div>
                  </div>
                </Grid>
              )}
            </Grid>
            <Grid container className='question-ctrls-container'>
              <Grid item xs={12} md={3} className='question-ctrls-inner'>
                <Box className='question-ctrl-inner-container'>
                  <IconButton className='question-cntrl-file-upload'>
                    <CloudUploadIcon color='primary' />
                  </IconButton>
                  <FormControlLabel
                    className='question-ctrl'
                    control={
                      <Switch
                        onChange={(e) => {
                          setEnableAttachments(e.target.checked);
                          onChange('is_attachment_enable', e.target.checked);
                        }}
                        name='checkedA'
                        color='primary'
                      />
                    }
                    label='File Upload'
                    labelPlacement='start'
                  />
                </Box>
              </Grid>
              {enableAttachments && (
                <Grid item xs={12} md={4} className='question-ctrl-outer-container'>
                  <Box className='question-ctrl-inner-container max-attachments'>
                    <div className='question-ctrl-label'>Maximum number of files</div>

                    <Select
                      native
                      labelId='demo-customized-select-label'
                      id='demo-customized-select'
                      onChange={(e) => onChange('max_attachment', e.target.value)}
                    >
                      {Array.from({ length: 10 }, (_, index) => (
                        <option value={index + 1}>{index + 1}</option>
                      ))}
                    </Select>
                  </Box>
                </Grid>
              )}
              <Grid item xs={12} md={4}>
                <Box className='question-ctrl-inner-container'>
                  <IconButton className='question-cntrl-file-upload'>
                    <CreateIcon color='primary' />
                  </IconButton>
                  <FormControlLabel
                    className='question-ctrl'
                    control={
                      <Switch
                        name='penTool'
                        onChange={(e) => {
                          onChange('penTool', e.target.checked);
                        }}
                        color='primary'
                      />
                    }
                    label='Pen tool'
                    labelPlacement='start'
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={12} className='question-btn-container'>
          <div className='question-btn-inner-container '>
            {/* <Button
              color='primary'
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => {
                addNewQuestion(index + 1);
              }}
              title='Add Question'
              className='btn add-quesiton-btn outlined-btn'
            >
              Add another question
            </Button> */}
          </div>
        </Grid>
        {index > 0 && (
          <Grid item xs={12} className='question-btn-container'>
            <div className='question-btn-inner-container '>
              <Button
                variant='contained'
                color='default'
                startIcon={<DeleteIcon />}
                onClick={() => {
                  handleClick();
                }}
                title='Remove Question'
                className='btn remove-question-btn'
              >
                Remove question
              </Button>
            </div>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <div style={{ padding: '20px 30px' }}>
                <Typography style={{ fontSize: '20px', marginBottom: '15px' }}>
                  Are you sure you want to delete?
                </Typography>
                <div>
                  <CancelButton onClick={(e) => handleClose()}>Cancel</CancelButton>
                  <StyledButton
                    onClick={() => removeQuestion(index)}
                    style={{ float: 'right' }}
                  >
                    Confirm
                  </StyledButton>
                </div>
              </div>
            </Popover>
          </Grid>
        )}
        {/*        
        <IconButton
          style={{ display: 'block' }}
          onClick={() => {
            removeQuestion(index);
          }}
          title='Remove Question'
        >
          <CancelIcon className='disabled-icon' />
        </IconButton>{' '} */}
      </Grid>
    </Grid>
  );
};

export default QuestionCard;
