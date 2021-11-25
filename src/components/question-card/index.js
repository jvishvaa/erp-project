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
import InputLabel from '@material-ui/core/InputLabel';
import './styles.scss';
import { makeStyles } from '@material-ui/core/styles';

const StyledButton = withStyles({
  root: {
    color: '#FFFFFF',
    backgroundColor: '#FF6B6B',
    '&:hover': {
      backgroundColor: '#FF6B6B',
    },
  },
})(Button);
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  questionCard: {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: '10px',
  },
  acceptedfiles: {
    color: theme.palette.secondary.main,
    width: '100%',
  },
}));
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
  isEdit,
  question,
  index,
  handleChange,
  removeQuestion,
}) => {
  const classes = useStyles();
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
  const [showPrev, setshowPrev] = useState(0)
  const [pentool, setpentool] = useState(false)
  const [maxattachment, setmaxAttachment] = useState(2)
  // const [isAttachmentenable,setisAttachmentenable] = useState(false)



  const [questionData, setquestionData] = useState()
  const [edit, setisEdit] = useState(isEdit)


  const handleScroll = (dir) => {
    if (dir === 'left') {
      attachmentsRef.current.scrollLeft -= 150;
    } else {
      attachmentsRef.current.scrollLeft += 150;
    }
  };


  useEffect(() => {
    if (edit) {
      setisEdit(false)
      setquestionData(question.question)
      setAttachmentPreviews(question.attachments)
      setAttachments(question.attachments)
      setpentool(question.penTool)
      setmaxAttachment(question.max_attachment)
      setEnableAttachments(question.is_attachment_enable)
    }
  }, [question.question, question.attachments])

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
    if (!file) {
      return null
    }
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
          file.name.toLowerCase().lastIndexOf('.pdf') > 0 ||
          file.name.toLowerCase().lastIndexOf('.jpeg') > 0 ||
          file.name.toLowerCase().lastIndexOf('.jpg') > 0 ||
          file.name.toLowerCase().lastIndexOf('.png') > 0 ||
          file.name.toLowerCase().lastIndexOf('.mp3') > 0 ||
          file.name.toLowerCase().lastIndexOf('.mp4') > 0
        ) {
          const fd = new FormData();
          fd.append('file', file);
          setFileUploadInProgress(true);
          const filePath = await uploadFile(fd);
          const final = Object.assign({}, filePath)
          if (file.type === 'application/pdf') {
            setAttachments((prevState) => [...prevState, final]);
            setAttachmentPreviews((prevState) => [...prevState, final]);
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

  const removeAttachment = (pageIndex, pdfIndex, deletePdf, item) => {
    // const extension = item.split('.').pop();

    if (item !== undefined) {
      if (deletePdf) {
        setAttachmentPreviews((prevState) => {
          prevState.splice(pdfIndex, 1)
          return [...prevState]
        })
        setAttachments((prevState) => {
          prevState.splice(pdfIndex, 1)
          return [...prevState]
        })
      }
      else {
        setAttachmentPreviews((prevState) => {
          let newObj = prevState[pdfIndex]
          delete newObj[pageIndex]
          prevState[pdfIndex] = newObj
          return [...prevState]
        })
        setAttachments((prevState) => {
          let newObj = prevState[pdfIndex]
          delete newObj[pageIndex]
          prevState[pdfIndex] = newObj
          return [...prevState]
        })
      }

    }
    else {
      setAttachmentPreviews((prevState) => {
        prevState.splice(pdfIndex, 1)
        return [...prevState]
      })
      setAttachments((prevState) => {
        prevState.splice(pdfIndex, 1)
        return [...prevState]
      })
    }


  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('penTool', pentool);
  }, [pentool])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('max_attachment', maxattachment);
  }, [maxattachment])
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('is_attachment_enable', enableAttachments);
  }, [enableAttachments])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('question', questionData);
  }, [questionData])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('attachments', attachments);
  }, [attachments]);

  useEffect(() => {
    let count = 0
    attachmentPreviews.forEach((e) => {
      if (typeof e == 'string')
        count = count + 1
      else {
        count = Object.keys(e).length + count
      }
    }
    )
    setshowPrev(count > 2)
  }, [attachmentPreviews])

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
          <Button
            autoFocus
            className='labelColor cancelButton'
            size='medium'
            onClick={closeAttachmentsModal}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12}>
        <Card className={` ${classes.questionCard} question-card`}>
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
                        setquestionData(e.target.value)
                        // onChange('question', questionData);
                      }}
                      label='Question'
                      autoFocus
                      multiline
                      rows={4}
                      rowsMax={6}
                      value={questionData}
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
                      accept='.png, .jpg, .jpeg, .mp3, .mp4, .pdf, .PNG, .JPG, .JPEG, .MP3, .MP4, .PDF'
                      onChange={(e) => {
                        handleFileUpload(e.target.files[0]);
                        e.target.value = null
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
                        <small className={classes.acceptedfiles}>
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
                      {showPrev && (
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
                        {attachmentPreviews.map((url, pdfindex) => {
                          let cindex = 0
                          attachmentPreviews.forEach((item, index) => {
                            if (index < pdfindex) {
                              if (typeof item == 'string') {
                                cindex = cindex + 1
                              } else {
                                cindex = Object.keys(item).length + cindex
                              }
                            }
                          })
                          if (typeof url == 'object') {
                            return Object.values(url).map((item, i) => {
                              let imageIndex = Object.keys(url)[i]
                              return <div className='attachment'>
                                <Attachment
                                  key={`homework_student_question_attachment_${i}`}
                                  fileUrl={item}
                                  fileName={`Attachment-${i + 1 + cindex}`}
                                  urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                                  index={i}
                                  actions={['preview', 'download', 'delete']}
                                  onDelete={(index, deletePdf) => removeAttachment(imageIndex, pdfindex, deletePdf, { item })}
                                  ispdf={true}
                                />
                              </div>

                            })
                          } else return <div className='attachment'>
                            <Attachment
                              key={`homework_student_question_attachment_${pdfindex}`}
                              fileUrl={url}
                              fileName={`Attachment-${1 + cindex}`}
                              urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                              index={pdfindex}
                              actions={['preview', 'download', 'delete']}
                              onDelete={(index, deletePdf) => removeAttachment(index, pdfindex, deletePdf)}
                              ispdf={false}
                            />
                          </div>


                        })}

                        <div style={{ position: 'absolute', visibility: 'hidden' }}>
                          <SRLWrapper>
                            {attachmentPreviews.map((url, i) => {
                              if (typeof url == 'object') {
                                return Object.values(url).map((item, i) => {
                                  return <img
                                    src={`${endpoints.discussionForum.s3}/homework/${item}`}
                                    onError={(e) => {
                                      e.target.src = placeholder;
                                    }}
                                    alt={`Attachment-${i + 1}`}
                                  />
                                })
                              } else return <img
                                src={`${endpoints.discussionForum.s3}/homework/${url}`}
                                onError={(e) => {
                                  e.target.src = placeholder;
                                }}
                                alt={`Attachment-${i + 1}`}
                              />
                            })}
                          </SRLWrapper>
                        </div>
                      </div>
                    </SimpleReactLightbox>
                    <div className='next-btn'>

                      {showPrev && (
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
                          // onChange('is_attachment_enable', e.target.checked);
                        }}
                        name='checkedA'
                        color='primary'
                        checked={enableAttachments}
                      // value = {enableAttachments}
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
                      defaultValue={2}
                      onChange={(e) =>
                        setmaxAttachment(e.target.value)}
                      // onChange('max_attachment', e.target.value)}   
                      value={maxattachment}
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
                          setpentool(e.target.checked)
                        }}
                        color='primary'
                        checked={pentool}
                        value={pentool}
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
        <Grid item xs={12} className='question-btn-container' />
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
