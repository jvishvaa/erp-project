/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';

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
  FormControl,
  InputLabel,
  OutlinedInput,
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
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';

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
  homeworkblock:{
    color : theme.palette.secondary.main,
    fontWeight: 600
  },
  homeworkSubmitwrapper:{
    border: `1px solid ${theme.palette.primary.main}`,  
    borderRadius: "10px",
    padding: "20px",
    ['@media screen(min-width:768px)']: {
      margin: "10px",
      width: "90% !important",
      height: "auto !important",
    }
  },
  homeworkTypeItem:{
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "center",
    padding: "10% 15%",
    color: theme.palette.secondary.main,
    fontSize: "1rem",
    fontWeight: 600,
    textTransform: "capitalize",
    '@media screen and (max-width:768px)' : {
      padding: "10px 15px !important",
      width: "100%",
    }
  },descBox:{
    marginTop: "15px",
    backgroundColor: "#bcf1ff",
    color: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: "10px",
    fontSize: "16px",
    width: "70%",
    padding: "11px 18px",
    '@media screen and (max-width:768px)' : {
      width: "100%",
    },
    '&::before': {
      content: '"Instruction : "',
      fontWeight: 600,
    }
  },
  acceptedfiles:{
    color : theme.palette.secondary.main,
    width:"100%"
  },
  homeworkQuestion:{
    width: "100%",
    color:theme.palette.secondary.main,
    position: "relative",
    paddingBottom: "8px",
    fontSize: "18px",
    borderBottom: `1px solid ${theme.palette.primary.main}`

  }
}));

const HomeworkSubmission = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { homeworkSubmission, setHomeworkSubmission, setLoading, setDisplayRatingBox } = props || {};
  const { isOpen, subjectId, date, subjectName, isEvaluated } = homeworkSubmission || {};
  const [isQuestionWise, setIsQuestionWise] = useState(false);
  const [allQuestionAttachment, setAllQuestionAttachment] = useState([]);
  const [attachmentData, setAttachmentData] = useState([]);
  const [attachmentDataDisplay, setAttachmentDataDisplay] = useState([]);
  const [bulkData, setBulkData] = useState([]);
  const [bulkDataDisplay, setBulkDataDisplay] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [loadFlag, setLoadFlag] = useState(false)
  const [subjectQuestions, setSubjectQuestions] = useState([]);
  const [isBulk, setIsBulk] = useState(false);
  const [submittedEvaluatedFilesBulk, setSubmittedEvaluatedFilesBulk] = useState([]);
  const [penToolOpen, setPenToolOpen] = useState(false)
  const [penToolUrl, setPenToolUrl] = useState('');
  const [penToolIndex, setPenToolIndex] = useState('');
  const [comment, setComment] = useState('');
  const [homeworkTitle, setHomeworkTitle] = useState('')
  const [desc, setDesc] = useState('');
  const [questionwiseComment, setQuestionwiseComment] = useState('');
  const [questionwiseRemark, setQuestionwiseRemark] = useState('');
  const [overallRemark, setOverallRemark] = useState('');
  const [overallScore, setOverallScore] = useState('');
  const [attachmentCount, setAttachmentCount] = useState([]);
  const [maxCount, setMaxCount] = useState(0);
  const [calssNameWise, setClassName] = useState('');
  const [studentBulkComment, setStudentBulkComment] = useState('');
  // const [quesComments, setQuesComments] = useState([]);
  const handleHomeworkSubmit = () => {

    let count = 0;
    if (isQuestionWise)
      for (let i = 0; i < attachmentDataDisplay.length; i++) {
        if (attachmentDataDisplay[i].length > 0)
          count += 1;
      }
    else
      for (let i = 0; i < bulkData.length; i++) {
        if (bulkData[i].length > 0)
          count += 1;
      }

    let requestData = {
      "homework": homeworkSubmission.homeworkId,
      "is_question_wise": isQuestionWise,
      "questions": isQuestionWise ? attachmentData : ([{ 'attachments': bulkData,attachmentData }]),
      "comment": comment
    }

    if (count !== 0) {
      axiosInstance.post(`${endpoints.homeworkStudent.submitHomework}`, requestData)
        .then(result => {
          if (result.data.status_code === 201) {
            setAlert('success', result.data.message);
            handleHomeworkCancel();
          }
          else
            setAlert('error', result.data.message);
        })
        .catch(error => {
          setAlert('error', error.message);
        })
    }
    else
      setAlert('error', 'No file attached!')
  };

  const handleHomeworkCancel = () => {
    setDisplayRatingBox(false);
    setHomeworkSubmission(prev => ({ ...prev, isOpen: false, subjectId: '', subjectName: '' }));
  };

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Homework' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Student Homework') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    let maxVal = 0;
    axiosInstance
      .get(`/academic/${homeworkSubmission.homeworkId}/hw-questions/?hw_status=${homeworkSubmission.status}&module_id=1`)
      .then((result) => {
        if (result.data.status_code === 200) {
          if (homeworkSubmission.status === 1) {
            setSubjectQuestions(result.data.data.hw_questions);
            setHomeworkTitle(result.data.data.homework_name);
            setDesc(result.data.data.description);
            for (let i = 0; i < result.data.data.hw_questions.length; i++) {
              attachmentCount.push(0);
              attachmentDataDisplay.push([]);
              attachmentData.push(
                {
                  "homework_question": result.data.data.hw_questions[i].id,
                  "attachments": [],
                  "comments":''
                }
              );
              maxVal += result.data.data.hw_questions[i].max_attachment;
            }
            setMaxCount(maxVal);
          } else if (homeworkSubmission.status === 2 || homeworkSubmission.status === 3) {
            if (result.data.data.is_question_wise) {
              setIsBulk(false);
              setSubjectQuestions(result.data.data.hw_questions);
              if (homeworkSubmission.status === 3) {
                setOverallRemark(result.data.data.overall_remark);
                setOverallScore(result.data.data.score);
                setQuestionwiseComment(result.data.data.hw_questions?.comment);
                setQuestionwiseRemark(result.data.data.hw_questions?.remark);
              }
            } else {
              setIsBulk(true);
              setSubjectQuestions(result.data.data.hw_questions.questions);
              if (homeworkSubmission.status === 2) {
                setSubmittedEvaluatedFilesBulk(result.data.data.hw_questions.submitted_files);
              } else if (homeworkSubmission.status === 3) {
                setOverallRemark(result.data.data.overall_remark);
                setOverallScore(result.data.data.score);
                setSubmittedEvaluatedFilesBulk(result.data.data.hw_questions.evaluated_files);
                setQuestionwiseComment(result.data.data.hw_questions?.teacher_comment);
                setQuestionwiseRemark(result.data.data.hw_questions?.remark);
                setStudentBulkComment(result.data.data.hw_questions?.student_comment);
              }
            }
          }
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);

  const handleBulkNotification = () => {
    if (bulkDataDisplay.length >= maxCount) {
      setAlert('warning', `Can\'t upload more than ${maxCount} attachments in total.`);
    }
  }
  const handleBulkUpload = (e) => {
    e.persist()
    if (bulkDataDisplay.length >= maxCount) {
      setAlert('warning', `Can\'t upload more than ${maxCount} attachments in total.`);
    } else {
      const fil = e.target.files[0] || null;
      if (
        fil.name.toLowerCase().lastIndexOf('.pdf') > 0 ||
          fil.name.toLowerCase().lastIndexOf('.jpeg') > 0 ||
          fil.name.toLowerCase().lastIndexOf('.jpg') > 0 ||
          fil.name.toLowerCase().lastIndexOf('.png') > 0 ||
          fil.name.toLowerCase().lastIndexOf('.mp3') > 0 ||
          fil.name.toLowerCase().lastIndexOf('.mp4') > 0
        ) {
        setLoading(true);
        const formData = new FormData()
        formData.append('file', fil);
        axiosInstance.post(`${endpoints.homeworkStudent.fileUpload}`, formData)
          .then(result => {
            if (result.data.status_code === 200) {
              const list = bulkDataDisplay.slice()
              if (fil.name.lastIndexOf(".pdf") > 0) {
                const arr = [...result.data.data];
                for (let k = 0; k < arr.length; k++) {
                  bulkData.push(arr[k]);
                  list.push(arr[k])
                  setBulkDataDisplay(list);
                }
                setLoading(false);
              } else {
                list.push(e.target.files[0]);
                setBulkDataDisplay(list);
                bulkData.push(result.data.data);
                setLoading(false);
              }
              setAlert('success', result.data.message);
            } else {
              setLoading(false);
              setAlert('error', result.data.message);
            }
          })
          .catch(error => {
            setLoading(false);
            // setAlert('error',error.message)
          })
      } else {
        setLoading(false);
        setAlert('error', "Only image(.jpeg, .jpg, .png), audio(mp3), video(.mp4) and pdf(.pdf) are acceptable")
      }
    }
  }


  const removeBulkFileHandler = (i) => {
    const list = [...bulkDataDisplay];
    setLoading(true);
    axiosInstance.post(`${endpoints.deleteFromS3}`, {
      "file_name": `homework/${list[i]}`
    }).then(result => {
      if (result.data.status_code === 204) {
        list.splice(i, 1);
        setBulkDataDisplay(list);
        bulkData.splice(i, 1);
        setAlert('success', result.data.message);
        setLoading(false);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    }).catch(error => {
      setAlert('error', error.message);
      setLoading(false);
    })

  }

  const uploadFileHandler = (e, index, maxVal) => {
    e.persist();
    if (attachmentCount[index] >= maxVal) {
      setAlert('warning', `Can\'t upload more than ${maxVal} attachments for question ${index + 1}`);
    }
    else {
      const fil = e.target.files[0];
      if (
        fil.name.toLowerCase().lastIndexOf('.pdf') > 0 ||
          fil.name.toLowerCase().lastIndexOf('.jpeg') > 0 ||
          fil.name.toLowerCase().lastIndexOf('.jpg') > 0 ||
          fil.name.toLowerCase().lastIndexOf('.png') > 0 ||
          fil.name.toLowerCase().lastIndexOf('.mp3') > 0 ||
          fil.name.toLowerCase().lastIndexOf('.mp4') > 0
        ) {
        setLoading(true);
        const formData = new FormData()
        formData.append('file', fil)
        axiosInstance.post(`${endpoints.homeworkStudent.fileUpload}`, formData)
          .then(result => {
            if (result.data.status_code === 200) {
              const list = attachmentDataDisplay.slice();
              if (fil.name.lastIndexOf(".pdf") > 0) {
                const arr = [...result.data.data];
                for (let k = 0; k < arr.length; k++) {
                  attachmentCount[index]++;
                  attachmentData[index].attachments.push(arr[k]);
                  list[index].push(arr[k])
                  setAttachmentDataDisplay(list);
                }
                setLoading(false);
              } else {
                attachmentCount[index]++;
                list[index] = [...attachmentDataDisplay[index], result.data.data];
                setAttachmentDataDisplay(list);
                attachmentData[index].attachments.push(result.data.data);
                setLoading(false);
              }
              setAlert('success', result.data.message);
            } else {
              setLoading(false);
              setAlert('error', result.data.message);
            }
          })
          .catch(error => {
            setLoading(false);
            // setAlert('error',error.response.result.error_msg)
          })
      } else {
        setAlert('error', "Only image(.jpeg, .jpg, .png), audio(mp3), video(.mp4) and pdf(.pdf) are acceptable")
      }
    }
  }

  const removeFileHandler = (questionIndex, i) => {
    const listDisplay = [...attachmentDataDisplay[questionIndex]];
    setLoading(true);
    axiosInstance.post(`${endpoints.deleteFromS3}`, {
      "file_name": `homework/${listDisplay[i]}`
    }).then(result => {
      if (result.data.status_code === 204) {
        listDisplay.splice(i, 1);
        setAttachmentDataDisplay([...attachmentDataDisplay.slice(0, questionIndex), listDisplay, ...attachmentDataDisplay.slice(questionIndex + 1)]);
        attachmentData[questionIndex].attachments.splice(i, 1);
        attachmentCount[questionIndex]--;
        setAlert('success', result.data.message);
        setLoading(false);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    }).catch(error => {
      setAlert('error', error.message);
      setLoading(false);
    })
  }

  const FileRow = (props) => {
    const { file, onClose, index } = props;
    return (
      <div className='file_row_hw' style={{ width: '130px' }}>
        <div className='file_name_container_hw'>
          File {index + 1}
        </div>
        <IconButton size='small'>
          <VisibilityIcon />
        </IconButton>
        <div className='file_close_hw'>
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
  const handleScroll = (index,dir) => {
    const ele = document.getElementById(`homework_student_question_container_${index}`)
    if (dir === 'left') {
      ele.scrollLeft -= 150;
    } else {
      ele.scrollLeft += 150;
    }
  };

  const handleScrollAnswer = (index,dir) => {
    const ele = document.getElementById(`homework_student_answer_attachment_${index}`)
    if (dir === 'left') {
      ele.scrollLeft -= 150;
    } else {
      ele.scrollLeft += 150;
    }
  };

  const scrollableContainerBulk = useRef(null);
  const handleScrollBulk = (dir) => {
    if (dir === 'left') {
      scrollableContainerBulk.current.scrollLeft -= 150;
    } else {
      scrollableContainerBulk.current.scrollLeft += 150;
    }
  };

  const openInPenTool = (url, index) => {
    setPenToolUrl(url);
    setPenToolIndex(index);
  };

  const handleCloseCorrectionModal = () => {
    setPenToolUrl('');
    setPenToolIndex('');
  };

  const handleSaveEvaluatedFile = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const filePath = await uploadFile(fd);

    if (isQuestionWise) {
      const list = attachmentDataDisplay.slice()
      list[penToolIndex] = [...attachmentDataDisplay[penToolIndex], filePath];
      setAttachmentDataDisplay(list);
      attachmentData[penToolIndex].attachments.push(filePath);
      setPenToolUrl('');
    } else {
      const list = bulkDataDisplay.slice();
      list.push(filePath);
      setBulkDataDisplay(list);
      bulkData.push(filePath);
      setPenToolUrl('');
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

  const handleDelete = () => {
    if(homeworkSubmission.isEvaluated){
      setAlert('error', "Homework Evaluated, can not be deleted");
      return;
    }
      setLoading(true);
        axiosInstance
          .delete(
            `${endpoints.homework.hwDelete}${homeworkSubmission.homeworkId}/hw-questions/`
          )
          .then((result) => {
            if (result.data.status_code === 200) {
              handleHomeworkCancel();
              setAlert('success', result.data?.message);
              setLoading(false);
            } else {
              setAlert('error', result.data?.message);
              setLoading(false);
            }
          })
          .catch((error) => {
            setAlert('error', "error1");
            setLoading(false);
          });
    };

  const handleQuesComments = (index, value) =>{
    // if(quesComments[index])
    //   setQuesComments(...quesComments,quesComments[index]=value)
    // else{
    //   // setQuesComments(...quesComments,quesComments.push(value))
    //   attachmentData[index]=value
    // }
    attachmentData[index].comments=value
  }


  return (
    <div className='create_group_filter_container'>
      <Grid container spacing={2} className='message_log_container'>
        <Grid item className='homework_type_wrapper'>
          <div className='homework_type'>
            <div
              className={`${classes.homeworkTypeItem} non_selected_homework_type_item all-homeWorks`}
              onClick={handleHomeworkCancel}
            >
              All Homeworks
            </div>
            <div className={`${classes.homeworkTypeItem} selected all-homeWorks home-sub`}>
              <div className="date-sub-home">
                <div>{date}</div>
                <div>{subjectName}</div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item lg={10}>
          <div className={classes.homeworkSubmitwrapper}>
            <div className='homework_block_wrapper_submit'>
              <div className={` ${classes.homeworkblock} homework_submit_tag`}>
                Homework - {subjectName} : {homeworkTitle}
              </div>
              {homeworkSubmission.status === 1 &&
                <div className="checkWrapper">
                  <div className='homework_block_questionwise_check'>
                    <Checkbox
                      onChange={() => {
                        setIsQuestionWise(!isQuestionWise);
                        if (!isQuestionWise) {
                          setClassName('upload-wise')
                        } else {
                          setClassName('')

                        }
                      }}
                      color='primary'
                      checked={isQuestionWise}
                    />
                    <Typography color = "secondary" style={{marginTop : "10px"}}>Upload Question Wise</Typography>
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
                    size='medium'
                    onClick={handleBulkNotification}
                  >
                    Bulk Upload
                  {bulkDataDisplay.length < maxCount ?
                  <input
                      type='file'
                      accept=".png, .jpg, .jpeg, .mp3, .mp4, .pdf, .PNG, .JPG, .JPEG, .MP3, .MP4, .PDF"
                      style={{ display: 'none' }}
                      id='raised-button-file'
                      onChange={e => handleBulkUpload(e)}
                    />:null}
                  </Button>

                </div>
                <small className={classes.acceptedfiles} >{" "}Accepted files: jpeg,jpg,mp3,mp4,pdf,png</small>
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
                <div className='homework-question-container student-view'>
                  <div className='attachments-container'>
                    <div className='attachments-list-outer-container'>
                      <div className='prev-btn'>
                        {bulkData.length > 1 && (
                          <IconButton onClick={() => handleScrollBulk('left')}>
                            <ArrowBackIosIcon />
                          </IconButton>
                        )}
                      </div>
                      <SimpleReactLightbox>
                        <div
                          className='attachments-list'
                          ref={scrollableContainerBulk}
                          onScroll={(e) => {
                            e.preventDefault();
                          }}
                        >
                          {bulkData.length > 0 && bulkData.map((file, i) => (
                            <div className='attachment'>
                              <Attachment
                                key={`homework_student_question_attachment_${i}`}
                                fileUrl={file}
                                fileName={`Attachment-${i + 1}`}
                                urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                                index={i}
                                //onOpenInPenTool={(url) => openInPenTool(url, index)}
                                actions={['preview']}
                              />
                            </div>
                          ))}
                          <div style={{ position: 'absolute', visibility: 'hidden' }}>
                            <SRLWrapper>
                              {bulkData.map((url, i) => (
                                <img
                                  src={`${endpoints.discussionForum.s3}/homework/${url}`}
                                  onError={(e) => {
                                    e.target.src = placeholder;
                                  }}
                                  alt={`Attachment-${i + 1}`}
                                  style={{ width: '0', height: '0' }}
                                />
                              ))}
                            </SRLWrapper>
                          </div>
                        </div>
                      </SimpleReactLightbox>
                      <div className='next-btn'>
                        {bulkData.length > 1 && (
                          <IconButton onClick={() => handleScrollBulk('right')}>
                            <ArrowForwardIosIcon color='primary' />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  </div>
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
                  className={`homework-question-container student-view ${calssNameWise}`}
                  key={`homework_student_question_${index}`}
                >
                  <div className={` ${classes.homeworkQuestion} ${calssNameWise}`} >
                    <span className='question'>Q{index + 1}: {question.question}</span>
                  </div>
                  {isQuestionWise &&
                    <div className="questionWiseAttachmentsContainer ">
                      <IconButton
                        fontSize='small'
                        id="file-icon"
                        disableRipple
                        component='label'
                        className={classes.attachmentIcon}
                      >
                        <AttachmentIcon fontSize='small' />
                        <input
                          type='file'
                          accept=".png, .jpg, .jpeg, .mp3, .mp4, .pdf, .PNG, .JPG, .JPEG, .MP3, .MP4, .PDF"
                          onChange={(e) => uploadFileHandler(e, index, question.max_attachment)}
                          className={classes.fileInput}
                        />
                      </IconButton>
                      <small style={{ width: '100%', color: '#014b7e' }} >{" "}Accepted files: jpeg,jpg,mp3,mp4,pdf,png</small>
                      {attachmentDataDisplay[index]?.map((file, i) => (
                        <FileRow
                          key={`homework_student_question_attachment_${i}`}
                          file={file}
                          index={i}
                          onClose={() => removeFileHandler(index, i)}
                        />
                      ))}
                      <div className='homework-question-container student-view'>
                        <div className='attachments-container'>
                          <div className='attachments-list-outer-container'>
                            <div className='prev-btn'>
                              {attachmentData[index]?.attachments.length > 1 && (
                                <IconButton onClick={() => handleScrollAnswer(index,'left')}>
                                  <ArrowBackIosIcon />
                                </IconButton>
                              )}
                            </div>
                            <SimpleReactLightbox>
                              <div
                                className='attachments-list'
                                id={`homework_student_answer_attachment_${index}`}
                                ref={scrollableContainer}
                                onScroll={(e) => {
                                  e.preventDefault();
                                }}
                              >
                                {attachmentData[index]?.attachments.map((file, i) => (
                                  <div className='attachment' style={{ height: '200px', width: '300px' }}>
                                    <Attachment
                                      key={`homework_student_question_attachment_${i}`}
                                      fileUrl={file}
                                      fileName={`Attachment-${i + 1}`}
                                      urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                                      index={i}
                                      //onOpenInPenTool={(url) => openInPenTool(url, index)}
                                      actions={['preview']}
                                    />
                                  </div>
                                ))}
                                <div style={{ position: 'absolute', visibility: 'hidden' }}>
                                  <SRLWrapper>
                                    {bulkData.map((url, i) => (
                                      <img
                                        src={`${endpoints.discussionForum.s3}/homework/${url}`}
                                        onError={(e) => {
                                          e.target.src = placeholder;
                                        }}
                                        alt={`Attachment-${i + 1}`}
                                        style={{ width: '0', height: '0' }}
                                      />
                                    ))}
                                  </SRLWrapper>
                                </div>
                              </div>
                            </SimpleReactLightbox>
                            <div className='next-btn'>
                              {attachmentData[index]?.attachments.length > 1 && (
                                <IconButton onClick={() => handleScrollAnswer(index,'right')}>
                                  <ArrowForwardIosIcon color='primary' />
                                </IconButton>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }

                  {((homeworkSubmission.status === 1 || homeworkSubmission.status === 2 || homeworkSubmission.status === 3) && question.question_files?.length > 0) &&
                    <div className='attachments-container'>
                      <Typography component='h4' color='primary' className='header'>
                        Attachments
                    </Typography>
                      <div className='attachments-list-outer-container'>
                        <div className='prev-btn'>
                          {question.question_files.length > 1 && (
                            <IconButton onClick={() => handleScroll(index,'left')}>
                              <ArrowBackIosIcon />
                            </IconButton>
                          )}
                        </div>
                        <SimpleReactLightbox>
                          <div
                            className='attachments-list'
                            ref={scrollableContainer}
                            id={`homework_student_question_container_${index}`}
                            onScroll={(e) => {
                              e.preventDefault();
                            }}
                          >
                            {question.question_files.map((url, i) => (
                              <>
                                <div className='attachment'>
                                  <Attachment
                                    key={`homework_student_question_attachment_${i}`}
                                    fileUrl={url}
                                    fileName={`Attachment-${i + 1}`}
                                    urlPrefix={`${endpoints.discussionForum.s3}/homework`}
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
                                    src={`${endpoints.discussionForum.s3}/homework/${url}`}
                                    onError={(e) => {
                                      e.target.src = placeholder;
                                    }}
                                    alt={`Attachment-${i + 1}`}
                                    style={{ width: '0', height: '0' }}
                                  />
                                ))}
                              </SRLWrapper>
                            </div>
                          </div>
                        </SimpleReactLightbox>
                        <div className='next-btn'>
                          {question.question_files.length > 1 && (
                            <IconButton onClick={() => handleScroll(index,'right')}>
                              <ArrowForwardIosIcon color='primary' />
                            </IconButton>
                          )}
                        </div>
                      </div>
                      {homeworkSubmission.status===1 &&
                      <div
                        className='comments-remarks-container'
                        style={{ display: 'flex', width: '95%', margin: '0 auto'}}
                      >
                        <div className='item comment'>
                          <FormControl variant='outlined' fullWidth size='small'>
                            {/* <InputLabel htmlFor='component-outlined'>Comments</InputLabel> */}
                            <OutlinedInput
                              id='comments'
                              name='comments'
                              inputProps={{ maxLength: 150 }}
                              multiline
                              rows={3}
                              rowsMax={4}
                              // label='Comments'
                              placeholder='Add comments about question (optional)'
                              // value={quesComments[index] || ''}
                              onChange={(e) => {
                                handleQuesComments(index, e.target.value);
                              }}
                            />
                          </FormControl>
                        </div>
                      </div>
                      }
                      {console.log({subjectQuestions})}
                      {/* for bulk:- student comments for student evaluated homework*/}
                      <div className="overallContainer">
                        {studentBulkComment[index] &&
                          <div className="scoreBox1" style={{marginBottom:'1%'}}>
                            Comment : {studentBulkComment[index]}
                          </div>}
                      </div>

                      <div className="overallContainer">
                        {question?.teacher_comment &&
                          <div className="scoreBox1">
                            Teacher's comment : {question?.teacher_comment}
                          </div>}
                        {question?.remark &&
                          <div className="remarkBox1">
                            Teacher's Remark : {question?.remark}
                          </div>}
                      </div>
                    </div>
                  }
                  {!isBulk &&
                    <>
                      {((homeworkSubmission.status === 2 && question.submitted_files?.length > 0) ||
                        (homeworkSubmission.status === 3 && question.evaluated_files?.length > 0))
                        &&
                        <div className='attachments-container'>
                          {/* {document.body.style.overflow = "hidden"} */}
                          <Typography component='h4' color='primary' className='header'>
                            {homeworkSubmission.status === 2 ? 'Submitted Files' : 'Evaluated Files'}
                          </Typography>
                          <div className='attachments-list-outer-container'>
                            <div className='prev-btn'>
                              {question?.submitted_files?.length > 1 && (
                                <IconButton onClick={() => handleScroll('left')}>
                                  <ArrowBackIosIcon />
                                </IconButton>
                              )}
                            </div>
                            {homeworkSubmission.status === 2 &&
                              <SimpleReactLightbox>
                                <div
                                  className='attachments-list'
                                  ref={scrollableContainer}
                                  onScroll={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  {question.submitted_files.map((url, i) => (
                                    <>
                                      <div className='attachment'>
                                        <Attachment
                                          key={`homework_student_question_attachment_${i}`}
                                          fileUrl={url}
                                          fileName={`Attachment-${i + 1}`}
                                          urlPrefix={`${endpoints.discussionForum.s3}/homework`}
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
                            }
                            {homeworkSubmission.status === 3 &&
                              <SimpleReactLightbox>
                                <div
                                  className='attachments-list'
                                  ref={scrollableContainer}
                                  onScroll={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  {question.evaluated_files.map((url, i) => (
                                    <>
                                      <div className='attachment'>
                                        <Attachment
                                          key={`homework_student_question_attachment_${i}`}
                                          fileUrl={url}
                                          fileName={`Attachment-${i + 1}`}
                                          urlPrefix={`${endpoints.discussionForum.s3}/homework`}
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
                            }
                            <div className='next-btn'>
                              {question?.submitted_files?.length > 1 && (
                                <IconButton onClick={() => handleScroll('right')}>
                                  <ArrowForwardIosIcon color='primary' />
                                </IconButton>
                              )}
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
                {((homeworkSubmission.status === 2 || homeworkSubmission.status === 3) && submittedEvaluatedFilesBulk?.length > 0) &&
                  <div className='homework-question-container student-view'>
                    <div className='attachments-container'>
                      <Typography component='h4' color='primary' className='header'>
                        {homeworkSubmission.status === 2 ? 'All Submitted Files' : 'All Evaluated Files'}
                      </Typography>
                      <div className='attachments-list-outer-container'>
                        {}
                        <div className='prev-btn'>
                          {submittedEvaluatedFilesBulk.length > 5 &&
                            <IconButton onClick={() => handleScroll('left')}>
                              <ArrowBackIosIcon />
                            </IconButton>}
                        </div>
                        <SimpleReactLightbox>
                          <div
                            className='attachments-list'
                            ref={scrollableContainer}
                            onScroll={(e) => {
                              e.preventDefault();
                            }}
                          >
                            {submittedEvaluatedFilesBulk?.map((url, i) => (
                              <>
                                <div className='attachment'>
                                  <Attachment
                                    key={`homework_student_question_attachment_${i}`}
                                    fileUrl={url}
                                    fileName={`Attachment-${i + 1}`}
                                    urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                                    index={i}
                                    actions={['preview', 'download']}
                                  />
                                </div>
                              </>
                            ))
                            }
                            <div style={{ position: 'absolute', visibility: 'hidden' }}>
                              <SRLWrapper>
                                {submittedEvaluatedFilesBulk?.map((url, i) => (
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
                        {submittedEvaluatedFilesBulk.length > 5 &&
                          <div className='next-btn'>
                            <IconButton onClick={() => handleScroll('right')}>
                              <ArrowForwardIosIcon color='primary' />
                            </IconButton>
                          </div>}
                      </div>
                    </div>
                    {homeworkSubmission.status === 3 ?
                      <div className="overallContainer">
                        {questionwiseComment &&
                          <div className="scoreBox1">
                            Teacher's comment : {questionwiseComment}
                          </div>}
                        {questionwiseRemark &&
                          <div className="remarkBox1">
                            Teacher's Remark : {questionwiseRemark}
                          </div>}
                      </div>
                      : null}
                  </div>
                }
              </>
            }

            {/* {homeworkSubmission.status === 1 ?
              <div style={{ margin: '15px' }}>
                <TextField
                  className='commentBoxStyle'
                  id='comments'
                  size='small'
                  name='comments'
                  onChange={e => setComment(e.target.value)}
                  multiline
                  rows={3}
                  rowsMax={5}
                  placeholder='Add comments about assignment here'
                  variant='outlined'
                  style={{ width: '70%' }}
                />
                {desc &&
                  <div className={classes.descBox}>
                    {desc}
                  </div>
                }
              </div>: null
            } */}

            <div>
              {homeworkSubmission.status === 3 ?
              <>
              {overallScore &&
                <div className="scoreBox">
                  Overall Score  : {overallScore}
                </div>}
              {overallRemark &&
                <div className="remarkBox">
                  Overall Remark : {overallRemark}
                </div>}
              </>:null}
              <div style={{width:'100%'}}>    
                <Button
                  variant='contained'
                  className='cancelButton labelColor homework_submit_button_cancel'
                  size='medium'
                  style={{ width: '15%'}}
                  onClick={handleHomeworkCancel}
                >
                  {homeworkSubmission.status === 1 ? 'CANCEL' : 'BACK'}
                </Button>
                {homeworkSubmission.status === 2 &&
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDelete}
                  style={{backgroundColor:'red',width:'15%'}}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>}
              </div>
              {homeworkSubmission.status === 1 &&
                <div>
                  <Button
                    variant='contained'
                    style={{ color: 'white', width: '100%' }}
                    onClick={handleHomeworkSubmit}
                    color='primary'
                    size='medium'
                  >
                    Submit
              </Button>
                </div>
                }
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
});

export default HomeworkSubmission;
