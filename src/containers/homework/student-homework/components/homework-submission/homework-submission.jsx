/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  TextField,
  Button,
  SvgIcon,
  Icon,
  Slide,
  Checkbox,
  IconButton,
  Typography,
  Divider,
} from '@material-ui/core';
import {
  Attachment as AttachmentIcon,
  HighlightOffOutlined as CloseIcon,
  ListAltOutlined,
} from '@material-ui/icons';

import DescriptiveTestcorrectionModule from '../../../../../components/EvaluationTool';
import CloseFileIcon from '../../../../../assets/images/Group 8460.svg';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../../../config/axios';
import endpoints from '../../../../../config/endpoints';
import './homework-submission.scss';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import placeholder from '../../../../../assets/images/placeholder_small.jpg';
import Attachment from '../../../teacher-homework/attachment';
import {
  uploadFile,
} from '../../../../../redux/actions';

const useStyles = makeStyles((theme) => ({
  attachmentIcon: {
    color: '#ff6b6b',
    // marginLeft: '4%',
    // '&:hover': {
    //   cursor: 'pointer',
    // },
  },
  fileInput: {
    fontSize: '50px',
    position: 'absolute',
    width: '20%',
    top: 0,
    bottom: 0,
    opacity: 0,
  },
  fileRow: {
    padding: '6px',

  },
  modalButtons: {
    position: 'sticky',
    width: '98%',
    margin: 'auto',
    bottom: 0,
  },
}));

const HomeworkSubmission = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { homeworkSubmission, setHomeworkSubmission } = props || {};
  const { isOpen, subjectId, date, subjectName } = homeworkSubmission || {};
  const [isQuestionWise, setIsQuestionWise] = useState(false);
  const [allQuestionAttachment, setAllQuestionAttachment] = useState([]);
  const [attachmentData, setAttachmentData] = useState([])
  const [attachmentDataDisplay, setAttachmentDataDisplay] = useState([])
  const [bulkData, setBulkData] = useState([])
  const [bulkDataDisplay, setBulkDataDisplay] = useState([])
  const { setAlert } = useContext(AlertNotificationContext);
  const [loadFlag, setLoadFlag] = useState(false)
  const [subjectQuestions, setSubjectQuestions] = useState([]);
  const [isBulk, setIsBulk] = useState(false)
  const [submittedFilesBulk, setSubmittedFilesBulk] = useState([])
  const [penToolOpen, setPenToolOpen] = useState(false)
  const [penToolUrl, setPenToolUrl] = useState('');
  const [penToolIndex, setPenToolIndex] = useState('');

  const handleHomeworkSubmit = () => {

    let count = 0
    if (isQuestionWise)
      for (let i = 0; i < attachmentDataDisplay.length; i++) {
        if (attachmentDataDisplay[i].length > 0)
          count += 1
      }
    else
      for (let i = 0; i < bulkData.length; i++) {
        if (bulkData[i].length > 0)
          count += 1
      }

    let requestData = {
      "homework": homeworkSubmission.homeworkId,
      "is_question_wise": isQuestionWise,
      "questions": isQuestionWise ? attachmentData : [{ 'attachments': bulkData }]
    }

    if (count !== 0) {
      axiosInstance.post(`${endpoints.homeworkStudent.submitHomework}`, requestData)
        .then(result => {
          if (result.data.status_code === 201) {
            setAlert('success', result.data.message)
            handleHomeworkCancel()
          }
          else
            setAlert('error', result.data.message)
        })
        .catch(error => {
          setAlert('error', error.message)
        })
    }
    else
      setAlert('error', 'No file attached!')
  };

  const handleHomeworkCancel = () => {
    setHomeworkSubmission({ isOpen: false, subjectId: '', date: '', subjectName: '' });
  };

  useEffect(() => {
    axiosInstance
      .get(`/academic/${homeworkSubmission.homeworkId}/hw-questions/?hw_status=${homeworkSubmission.status}&module_id=1`)
      .then((result) => {
        if (result.data.status_code === 200) {
          if (homeworkSubmission.status === 1) {
            setSubjectQuestions(result.data.data);
            for (let i = 0; i < result.data.data.length; i++) {
              attachmentDataDisplay.push([])
              attachmentData.push(
                {
                  "homework_question": result.data.data[i].id,
                  "attachments": []
                }
              )
            }
          } else if (homeworkSubmission.status === 2 || homeworkSubmission.status === 3) {
            if (result.data.data.is_question_wise) {
              setIsBulk(false)
              setSubjectQuestions(result.data.data.hw_questions)
            } else {
              setIsBulk(true)
              setSubjectQuestions(result.data.data.hw_questions.questions)
              setSubmittedFilesBulk(result.data.data.hw_questions.submitted_files)
            }
          }
        } else {
          setAlert('error', result.data.message)
        }
      })
      .catch((error) => {
        setAlert('error', error.message)
      });
  }, []);

  const handleBulkUpload = (e) => {
    e.persist()
    if (e.target.files[0]) {
      const formData = new FormData()
      formData.append('file', e.target.files[0])
      axiosInstance.post(`${endpoints.homeworkStudent.fileUpload}`, formData)
        .then(result => {
          if (result.data.status_code === 200) {
            const list = bulkDataDisplay.slice()
            // if (e.target.files[0].name.lastIndexOf('.pdf') > 0
            //   || e.target.files[0].name.lastIndexOf('.jpg') > 0) {
            list.push(e.target.files[0])
            setBulkDataDisplay(list)
            bulkData.push(result.data.data)
            // }
            // else {
            //   setAlert('error', 'Only video and image(.jpg, .jpeg) file is acceptable either with .xls or .xlsx extension')
            // }
            setAlert('success', result.data.message)
          } else {
            setAlert('error', result.data.message)
          }
        })
        .catch(error => {
          // setAlert('error',error.message)
        })
    }
    console.log(bulkData)
  }


  const removeBulkFileHandler = (i) => {
    const list = [...bulkDataDisplay]
    list.splice(i, 1)
    setBulkDataDisplay(list)
    bulkData.splice(i, 1)
  }

  const uploadFileHandler = (e, index) => {
    e.persist()
    const fil = e.target.files[0]
    if (fil && (fil.name.lastIndexOf(".pdf") > 0
      || fil.name.lastIndexOf(".jpeg") > 0
      || fil.name.lastIndexOf(".jpg") > 0
      || fil.name.lastIndexOf(".png") > 0
      || fil.name.lastIndexOf(".mp3") > 0
      || fil.name.lastIndexOf(".mp4") > 0)) {
      const formData = new FormData()
      formData.append('file', fil)
      axiosInstance.post(`${endpoints.homeworkStudent.fileUpload}`, formData)
        .then(result => {
          if (result.data.status_code === 200) {
            const list = attachmentDataDisplay.slice();
            list[index] = [...attachmentDataDisplay[index], fil];
            setAttachmentDataDisplay(list);
            attachmentData[index].attachments.push(result.data.data)
            setAlert('success', result.data.message)
          } else {
            setAlert('error', result.data.message)
          }
        })
        .catch(error => {
          // setAlert('error',error.response.result.error_msg)
        })
    } else {
      setAlert('error', "Only image(.jpeg, .jpg, .png), audio(mp3), video(.mp4) and pdf(.pdf) are acceptable")
    }
  }

  const removeFileHandler = (questionIndex, i) => {
    const listDisplay = [...attachmentDataDisplay[questionIndex]]
    listDisplay.splice(i, 1)
    setAttachmentDataDisplay([...attachmentDataDisplay.slice(0, questionIndex), listDisplay, ...attachmentDataDisplay.slice(questionIndex + 1)])
    attachmentData[questionIndex].attachments.splice(i, 1)
  }

  const FileRow = (props) => {
    const { file, onClose, index } = props;
    return (
      <div className='file_row'>
        <div className='file_name_container'>
          Attachment {index + 1}
        </div>
        <div className='file_close'>
          <span
            onClick={onClose}
          >
            <SvgIcon
              component={() => (
                <img
                  style={{
                    width: '35px',
                    padding: '5px',
                    cursor: 'pointer',
                  }}
                  src={CloseFileIcon}
                  alt='given'
                />
              )}
            />
          </span>
        </div>
      </div>
    );
  };

  const scrollableContainer = useRef(null);
  const handleScroll = (dir) => {
    if (dir === 'left') {
      scrollableContainer.current.scrollLeft -= 150;
    } else {
      scrollableContainer.current.scrollLeft += 150;
    }
  };

  const openInPenTool = (url, index) => {
    setPenToolUrl(url);
    setPenToolIndex(index)
    // setPenToolOpen(true);
  };

  const handleCloseCorrectionModal = () => {
    setPenToolUrl('');
    setPenToolIndex('')
    // setPenToolOpen(false);
  };

  const handleSaveEvaluatedFile = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const filePath = await uploadFile(fd);

    if (isQuestionWise) {
      const list = attachmentDataDisplay.slice()
      list[penToolIndex] = [...attachmentDataDisplay[penToolIndex], filePath]
      setAttachmentDataDisplay(list)
      attachmentData[penToolIndex].attachments.push(filePath)
      setPenToolUrl('')
    } else {
      const list = bulkDataDisplay.slice()
      list.push(filePath)
      setBulkDataDisplay(list)
      bulkData.push(filePath)
      setPenToolUrl('')
    }
  };

  const mediaContent = {
    file_content: penToolUrl,
    id: 1,
    splitted_media: null,
  }

  const desTestDetails = [{ asessment_response: { evaluvated_result: '' } }]

  useEffect(() => {
    if (penToolUrl) {
      setPenToolOpen(true);
    } else {
      setPenToolOpen(false);
    }
  }, [penToolUrl])

  return (
    <div className='create_group_filter_container'>
      <Grid container spacing={2} className='message_log_container'>
        <Grid item className='homework_type_wrapper'>
          <div className='homework_type'>
            <div
              className='homework_type_item non_selected_homework_type_item'
              onClick={handleHomeworkCancel}
            >
              All Homeworks
            </div>
            <div className='homework_type_item selected'>
              <div>{date}</div>
              <div>{subjectName}</div>
            </div>
          </div>
        </Grid>
        <Grid item lg={10}>
          <div className='homework_submit_wrapper'>
            <div className='homework_block_wrapper_submit'>
              <div className='homework_block homework_submit_tag'>
                Homework - {subjectName}, {date}
              </div>
              {homeworkSubmission.status === 1 &&
                <div className="checkWrapper">
                  <div className='homework_block_questionwise_check'>
                    <Checkbox
                      onChange={() => {
                        setIsQuestionWise(!isQuestionWise);
                      }}
                      color='primary'
                      checked={isQuestionWise}
                    />
                    <span>Upload question wise</span>
                  </div>
                </div>
              }
            </div>
            {homeworkSubmission.status === 1 && !isQuestionWise &&
              (<div className="bulkContainer">
                <div className='bulkUploadButton'>
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ color: 'white' }}
                    component='label'
                    size='small'
                  >
                    Collated file submission
                  <input
                      type='file'
                      accept=".png, .jpg, .jpeg, .mp3, mp4, .pdf"
                      style={{ display: 'none' }}
                      id='raised-button-file'
                      onChange={e => handleBulkUpload(e)}
                    />
                  </Button>
                </div>
                <div className="bulk_upload_attachments">
                  {bulkDataDisplay.map((file, i) => (
                    <FileRow
                      key={`homework_student_question_attachment_bulk_${i}`}
                      file={file}
                      index={i}
                      onClose={() => removeBulkFileHandler(i)}
                    />
                  ))}
                </div>
              </div>)}


            {penToolOpen && (
              <DescriptiveTestcorrectionModule
                desTestDetails={desTestDetails}
                mediaContent={mediaContent}
                handleClose={handleCloseCorrectionModal}
                alert={undefined}
                open={penToolOpen}
                callBackOnPageChange={() => { }}
                handleSaveFile={handleSaveEvaluatedFile}
              />
            )}

            {subjectQuestions?.map((question, index) => (
              <>
                <div
                  className='homework-question-container student-view'
                  key={`homework_student_question_${index}`}
                >
                  <div className='homework-question'>
                    <span className='question'>{question.question}</span>
                  </div>
                  {isQuestionWise &&
                    <div className="questionWisettachmentsContainer">
                      <IconButton
                        fontSize='small'
                        disableRipple
                        component='label'
                        className={classes.attachmentIcon}
                      >
                        <AttachmentIcon fontSize='small'/>
                        <input
                          type='file'
                          accept=".png, .jpg, .jpeg, .mp3, mp4, .pdf"
                          onChange={(e) => uploadFileHandler(e, index)}
                          className={classes.fileInput}
                        />
                      </IconButton>
                      {attachmentDataDisplay[index]?.map((file, i) => (
                        <FileRow
                          key={`homework_student_question_attachment_${i}`}
                          file={file}
                          index={i}
                          onClose={() => removeFileHandler(index, i)}
                        />
                      ))}
                    </div>
                  }

                  {((homeworkSubmission.status === 1 || homeworkSubmission.status === 2 || homeworkSubmission.status === 3) && question.question_files?.length > 0) &&
                    <div className='attachments-container'>
                      <Typography component='h4' color='primary' className='header'>
                        Attachments
                    </Typography>
                      <div className='attachments-list-outer-container'>
                        <div className='prev-btn'>
                          <IconButton onClick={() => handleScroll('left')}>
                            <ArrowBackIosIcon />
                          </IconButton>
                        </div>
                        <SimpleReactLightbox>
                          <div
                            className='attachments-list'
                            ref={scrollableContainer}
                            onScroll={(e) => {
                              e.preventDefault();
                              console.log('scrolled');
                            }}
                          >
                            {question.question_files.map((url, i) => (
                              <>
                                <div className='attachment'>
                                  <Attachment
                                    key={`homework_student_question_attachment_${i}`}
                                    fileUrl={url}
                                    fileName={`Attachment-${i + 1}`}
                                    urlPrefix={`${endpoints.s3}/homework`}
                                    index={i}
                                    onOpenInPenTool={(url) => openInPenTool(url, index)}
                                    actions={['preview', 'download', homeworkSubmission.status === 1 && question.is_pen_editor_enable && 'pentool']}
                                  />
                                </div>
                              </>
                            ))}
                            <div style={{ position: 'absolute', visibility: 'hidden' }}>
                              <SRLWrapper>
                                {question.question_files.map((url, i) => (
                                  <img
                                    src={`${endpoints.s3}/homework/${url}`}
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
                          <IconButton onClick={() => handleScroll('right')}>
                            <ArrowForwardIosIcon color='primary' />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  }
                  {!isBulk &&
                    <>
                      {((homeworkSubmission.status === 2 && question.submitted_files?.length > 0) ||
                        (homeworkSubmission.status === 3 && question.evaluated_files?.length > 0))
                        &&
                        <div className='attachments-container'>
                          <Typography component='h4' color='primary' className='header'>
                            {homeworkSubmission.status === 2 ? 'Submitted Files' : 'Evaluated Files'}
                          </Typography>
                          <div className='attachments-list-outer-container'>
                            <div className='prev-btn'>
                              <IconButton onClick={() => handleScroll('left')}>
                                <ArrowBackIosIcon />
                              </IconButton>
                            </div>
                            {homeworkSubmission.status === 2 &&
                              <SimpleReactLightbox>
                                <div
                                  className='attachments-list'
                                  ref={scrollableContainer}
                                  onScroll={(e) => {
                                    e.preventDefault();
                                    console.log('scrolled');
                                  }}
                                >
                                  {question.submitted_files.map((url, i) => (
                                    <>
                                      <div className='attachment'>
                                        <Attachment
                                          key={`homework_student_question_attachment_${i}`}
                                          fileUrl={url}
                                          fileName={`Attachment-${i + 1}`}
                                          urlPrefix={`${endpoints.s3}/homework`}
                                          index={i}
                                          actions={['preview', 'download']}
                                        />
                                      </div>
                                    </>
                                  ))
                                  }
                                  <div style={{ position: 'absolute', visibility: 'hidden' }}>
                                    <SRLWrapper>
                                      {question.submitted_files.map((url, i) => (
                                        <img
                                          src={`${endpoints.s3}/homework/${url}`}
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
                            }
                            {homeworkSubmission.status === 3 &&
                              <SimpleReactLightbox>
                                <div
                                  className='attachments-list'
                                  ref={scrollableContainer}
                                  onScroll={(e) => {
                                    e.preventDefault();
                                    console.log('scrolled');
                                  }}
                                >
                                  {question.evaluated_files.map((url, i) => (
                                    <>
                                      <div className='attachment'>
                                        <Attachment
                                          key={`homework_student_question_attachment_${i}`}
                                          fileUrl={url}
                                          fileName={`Attachment-${i + 1}`}
                                          urlPrefix={`${endpoints.s3}/homework`}
                                          index={i}
                                          actions={['preview', 'download']}
                                        />
                                      </div>
                                    </>
                                  ))
                                  }
                                  <div style={{ position: 'absolute', visibility: 'hidden' }}>
                                    <SRLWrapper>
                                      {question.evaluated_files.map((url, i) => (
                                        <img
                                          src={`${endpoints.s3}/homework/${url}`}
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
                            }
                            <div className='next-btn'>
                              <IconButton onClick={() => handleScroll('right')}>
                                <ArrowForwardIosIcon color='primary' />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      }
                    </>
                  }

                </div>
              </>))}

            {isBulk &&
              <>
                {((homeworkSubmission.status === 2 || homeworkSubmission.status === 3) && submittedFilesBulk?.length > 0) &&
                  <div className='homework-question-container student-view'>
                    <div className='attachments-container'>
                      <Typography component='h4' color='primary' className='header'>
                        {homeworkSubmission.status === 2 ? 'All Submitted Files' : 'All Evaluated Files'}
                      </Typography>
                      <div className='attachments-list-outer-container'>
                        <div className='prev-btn'>
                          <IconButton onClick={() => handleScroll('left')}>
                            <ArrowBackIosIcon />
                          </IconButton>
                        </div>
                        <SimpleReactLightbox>
                          <div
                            className='attachments-list'
                            ref={scrollableContainer}
                            onScroll={(e) => {
                              e.preventDefault();
                              console.log('scrolled');
                            }}
                          >
                            {submittedFilesBulk?.map((url, i) => (
                              <>
                                <div className='attachment'>
                                  <Attachment
                                    key={`homework_student_question_attachment_${i}`}
                                    fileUrl={url}
                                    fileName={`Attachment-${i + 1}`}
                                    urlPrefix={`${endpoints.s3}/homework`}
                                    index={i}
                                    actions={['preview', 'download']}
                                  />
                                </div>
                              </>
                            ))
                            }
                            <div style={{ position: 'absolute', visibility: 'hidden' }}>
                              <SRLWrapper>
                                {submittedFilesBulk.map((url, i) => (
                                  <img
                                    src={`${endpoints.s3}/homework/${url}`}
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
                          <IconButton onClick={() => handleScroll('right')}>
                            <ArrowForwardIosIcon color='primary' />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </>
            }

            {homeworkSubmission.status === 1 ?
              <div style={{ margin: '15px' }}>
                <TextField
                  className='commentBoxStyle'
                  id='comments'
                  size='small'
                  name='comments'
                  // onChange={(e) => {
                  //   onChange('question', e.target.value);
                  // }}
                  multiline
                  rows={3}
                  rowsMax={5}
                  placeholder='Add comments about assignment here'
                  variant='outlined'
                  style={{ width: '70%' }}
                />
                <div style={{ marginTop: '15px' }}>
                  <TextField
                    id='instruction'
                    size='small'
                    name='instruction'
                    className='instructionBox'
                    variant='outlined'
                    InputProps={{
                      readOnly: true,
                    }}
                    defaultValue='Instruction by teacher / Deadline mention about assignment'
                    style={{ width: '70%' }}
                  />
                </div>
              </div>
              : null}



            <div>
              {homeworkSubmission.status === 3 ?
                <div className="overallContainer">
                  <div className="scoreBox">
                    Overall Score :
                </div>
                  <div className="remarkBox">
                    Overall Remark :
                </div>
                </div>
                : null}

              <div className='homework_submit_button_wrapper'>
                <Button
                  variant='contained'
                  className='custom_button_master labelColor homework_submit_button_cancel'
                  size='medium'
                  onClick={handleHomeworkCancel}
                >
                  {homeworkSubmission.status === 1 ? 'CANCEL' : 'BACK'}
                </Button>
                {homeworkSubmission.status === 1 &&
                  <Button
                    variant='contained'
                    style={{ color: 'white' }}
                    onClick={handleHomeworkSubmit}
                    color='primary'
                    className='custom_button_master'
                    size='medium'
                  >
                    Submit
              </Button>
                }
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>);
});

export default HomeworkSubmission;
