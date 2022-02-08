import React, { useState, useEffect, useRef, useContext } from 'react';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {
  TextField,
  Grid,
  CircularProgress,
  IconButton,
  Badge,
  makeStyles,
  Button
} from '@material-ui/core';
import FileValidators from 'components/file-validation/FileValidators';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { uploadFile } from '../../../redux/actions';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import endpoints from '../../../config/endpoints';
import Attachment from '../../../containers/homework/teacher-homework/attachment';
import placeholder from '../../../assets/images/placeholder_small.jpg';
import DeleteIcon from '@material-ui/icons/Delete';
import './styles.scss';
import Loader from '../../../components/loader/loader';


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

export default function NewQuestionCard(props) {
  const [question, setQuestion] = useState("");
  const firstUpdate = useRef(true);
  const fileUploadInput = useRef(null);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [fileUploadInProgress, setFileUploadInProgress] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [sizeValied, setSizeValied] = useState({});
  const [showPrev, setshowPrev] = useState(0);
  const attachmentsRef = useRef(null);
  const [enableAttachments, setEnableAttachments] = useState(false);
  //   const [pentool,setpentool] = useState(props.pentool)
  const [maxattachment, setmaxAttachment] = useState(2);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const onChange = (field, value) => {
    props.handleChange(props.index, field, value);
  };

  useEffect(() => {
    setQuestion("");
    setAttachmentPreviews([])
    setAttachments([])
    setshowPrev(0)
  }, [props?.reset])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('penTool', props.pentool);
  }, [props.pentool]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('max_attachment', maxattachment);
  }, [maxattachment]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('is_attachment_enable', enableAttachments);
  }, [enableAttachments]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('attachments', attachments);
  }, [attachments]);

  useEffect(() => {
    let count = 0;
    attachmentPreviews.forEach((e) => {
      if (typeof e == 'string') count = count + 1;
      else {
        count = Object.keys(e).length + count;
      }
    });
    setshowPrev(count > 2);
  }, [attachmentPreviews]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('question', question);
  }, [question]);

  const handleFileUpload = async (file) => {
    setLoading(true);
    if (!file) {
      return null;
    }
    const isValid = FileValidators(file);
    !isValid?.isValid && isValid?.msg && setAlert('error', isValid?.msg);

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
          setLoading(false);
          const fd = new FormData();
          fd.append('file', file);
          setFileUploadInProgress(true);
          const filePath = await uploadFile(fd);
          const final = Object.assign({}, filePath);
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
          setLoading(false);
          setAlert('error', 'Please upload valid file');
        }
      } catch (e) {
        setFileUploadInProgress(false);
        setLoading(false);
        setAlert('error', 'File upload failed');
      }
    }
  };

  const handleScroll = (dir) => {
    if (dir === 'left') {
      attachmentsRef.current.scrollLeft -= 150;
    } else {
      attachmentsRef.current.scrollLeft += 150;
    }
  };

  const removeAttachment = (pageIndex, pdfIndex, deletePdf, item) => {
    // const extension = item.split('.').pop();

    if (item !== undefined) {
      if (deletePdf) {
        setAttachmentPreviews((prevState) => {
          prevState.splice(pdfIndex, 1);
          return [...prevState];
        });
        setAttachments((prevState) => {
          prevState.splice(pdfIndex, 1);
          return [...prevState];
        });
      } else {
        setAttachmentPreviews((prevState) => {
          let newObj = prevState[pdfIndex];
          delete newObj[pageIndex];
          prevState[pdfIndex] = newObj;
          return [...prevState];
        });
        setAttachments((prevState) => {
          let newObj = prevState[pdfIndex];
          delete newObj[pageIndex];
          prevState[pdfIndex] = newObj;
          return [...prevState];
        });
      }
    } else {
      setAttachmentPreviews((prevState) => {
        prevState.splice(pdfIndex, 1);
        return [...prevState];
      });
      setAttachments((prevState) => {
        prevState.splice(pdfIndex, 1);
        return [...prevState];
      });
    }
  };

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      {loading && <Loader />}
      <TextField
        id={props.index}
        label={`Question ${props?.index + 1}`}
        style={{ background: 'white', marginTop: '10px' }}
        type='text'
        fullWidth
        multiline
        rows={4}
        variant='outlined'
        InputProps={{
          endAdornment: (
            <div>
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
                    {/*sizeValied ? 'Accepted files: jpeg,jpg,mp3,mp4,pdf,png' : 'Document size should be less than 5MB !'*/}
                  </small>
                </>
              )}
            </div>
          ),
        }}
        onChange={(e) => setQuestion(e.target.value)}
        value={question}
      />
      <input
        className='file-upload-input'
        type='file'
        name='attachments'
        style={{ display: 'none' }}
        accept='.png, .jpg, .jpeg, .mp3, .mp4, .pdf, .PNG, .JPG, .JPEG, .MP3, .MP4, .PDF'
        onChange={(e) => {
          handleFileUpload(e.target.files[0]);
          e.target.value = null;
          // onChange('attachments', Array.from(e.target.files)[]);
        }}
        ref={fileUploadInput}
      />
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
                  let cindex = 0;
                  attachmentPreviews.forEach((item, index) => {
                    if (index < pdfindex) {
                      if (typeof item == 'string') {
                        cindex = cindex + 1;
                      } else {
                        cindex = Object.keys(item).length + cindex;
                      }
                    }
                  });
                  if (typeof url == 'object') {
                    return Object.values(url).map((item, i) => {
                      let imageIndex = Object.keys(url)[i];
                      return (
                        <div className='attachment'>
                          <Attachment
                            key={`homework_student_question_attachment_${i}`}
                            fileUrl={item}
                            fileName={`${i + 1 + cindex}`}
                            urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                            index={i}
                            actions={['preview', 'download', 'delete']}
                            onDelete={(index, deletePdf) =>
                              removeAttachment(imageIndex, pdfindex, deletePdf, { item })
                            }
                            ispdf={true}
                          />
                        </div>
                      );
                    });
                  } else
                    return (
                      <div className='attachment'>
                        <Attachment
                          key={`homework_student_question_attachment_${pdfindex}`}
                          fileUrl={url}
                          fileName={`${1 + cindex}`}
                          urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                          index={pdfindex}
                          actions={['preview', 'download', 'delete']}
                          onDelete={(index, deletePdf) =>
                            removeAttachment(index, pdfindex, deletePdf)
                          }
                          ispdf={false}
                        />
                      </div>
                    );
                })}

                <div style={{ position: 'absolute', visibility: 'hidden' }}>
                  <SRLWrapper>
                    {attachmentPreviews.map((url, i) => {
                      if (typeof url == 'object') {
                        return Object.values(url).map((item, i) => {
                          return (
                            <img
                              src={`${endpoints.discussionForum.s3}/homework/${item}`}
                              onError={(e) => {
                                e.target.src = placeholder;
                              }}
                              alt={`Attachment-${i + 1}`}
                            />
                          );
                        });
                      } else
                        return (
                          <img
                            src={`${endpoints.discussionForum.s3}/homework/${url}`}
                            onError={(e) => {
                              e.target.src = placeholder;
                            }}
                            alt={`Attachment-${i + 1}`}
                          />
                        );
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
      {/* {props?.index > 0 && (
          <Button
          variant='contained'
          color='default'
          startIcon={<DeleteIcon />}
          onClick={() => 
           props?.removeQuestion(props?.index)
          }
          title='Remove Question'
          className='btn remove-question-btn'
          fullWidth
          style={{marginTop:'5px'}}
       >
          Remove Question {props?.index+1}
       </Button>
      )} */}
    </div>
  );
}
