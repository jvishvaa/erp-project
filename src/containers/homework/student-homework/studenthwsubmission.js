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
  // Button,
  SvgIcon,
  Icon,
  Slide,
  // Checkbox,
  IconButton,
  Typography,
  // Divider,
  Popover,
  withStyles,
} from '@material-ui/core';
import { FormControl, InputLabel, OutlinedInput } from '@material-ui/core';
import {
  Attachment as AttachmentIcon,
  HighlightOffOutlined as CloseIcon,
  ListAltOutlined,
} from '@material-ui/icons';

import DescriptiveTestcorrectionModule from 'components/EvaluationTool';
import CloseFileIcon from 'assets/images/Group 8460.svg';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import '../student-homework/components/homework-submission/homework-submission.scss';
import '../coordinator-homework/styles.scss';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import placeholder from 'assets/images/placeholder_small.jpg';
import Attachment from '../teacher-homework/attachment';
import { uploadFile } from 'redux/actions';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import {
  message,
  Tabs,
  Badge,
  Drawer,
  Form,
  DatePicker,
  Breadcrumb,
  Divider,
  Button,
  Empty,
  Checkbox,
  Tooltip,
  Progress,
  Modal
} from 'antd';
import { LeftOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import Loader from 'components/loader/loader';
const useStyles = makeStyles((theme) => ({
  attachmentIcon: {
    color: '#ff6b6b',
    // marginLeft: '4%',
    // '&:hover': {
    // cursor: 'pointer',
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
  homeworkblock: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
  },
  homeworkSubmitwrapper: {
    border: '1px solid #BCD2F2',
    borderRadius: '10px',
    padding: '20px',
    ['@media screen(min-width:768px)']: {
      margin: '10px',
      width: '90% !important',
      height: 'auto !important',
    },
  },
  homeworkTypeItem: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '10px',
    marginBottom: '20px',
    textAlign: 'center',
    padding: '10% 15%',
    color: theme.palette.secondary.main,
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'capitalize',
    '@media screen and (max-width:768px)': {
      padding: '10px 15px !important',
      width: '100%',
    },
  },
  descBox: {
    marginTop: '15px',
    backgroundColor: '#bcf1ff',
    color: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '10px',
    fontSize: '16px',
    width: '70%',
    padding: '11px 18px',
    '@media screen and (max-width:768px)': {
      width: '100%',
    },
    '&::before': {
      content: '"Instruction : "',
      fontWeight: 600,
    },
  },
  acceptedfiles: {
    color: theme.palette.secondary.main,
    width: '100%',
  },
  homeworkQuestion: {
    width: '100%',
    color: theme.palette.secondary.main,
    position: 'relative',
    paddingBottom: '8px',
    fontSize: '18px',
    background: '#EEF2F8',
  },
  instructionText: {
    display: 'flex',
    // border: `1px solid ${theme.palette.primary.main}`,
    background: '#EEF2F8',
    borderRadius: '5px',
    height: '38px',
    alignItems: 'center',
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
const StyledButton = withStyles({
  root: {
    color: '#FFFFFF',
    backgroundColor: '#FF6B6B',
    '&:hover': {
      backgroundColor: '#FF6B6B',
    },
  },
})(Button);

const HomeworkSubmissionNew = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const {
    homeworkSubmission,
    setHomeworkSubmission,
    setLoading,
    setHwSelect,
    dueDate,
    setDeuDate,
  } = props || {};
  const { isOpen, subjectId, date, subjectName, isEvaluated } = homeworkSubmission || {};
  const [isQuestionWise, setIsQuestionWise] = useState(false);
  const [allQuestionAttachment, setAllQuestionAttachment] = useState([]);
  const [attachmentData, setAttachmentData] = useState([]);
  const [attachmentDataDisplay, setAttachmentDataDisplay] = useState([]);
  const [bulkData, setBulkData] = useState([]);
  const [bulkDataDisplay, setBulkDataDisplay] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [loadFlag, setLoadFlag] = useState(false);
  const [subjectQuestions, setSubjectQuestions] = useState([]);
  const [isBulk, setIsBulk] = useState(false);
  const [submittedEvaluatedFilesBulk, setSubmittedEvaluatedFilesBulk] = useState([]);
  const [penToolOpen, setPenToolOpen] = useState(false);
  const [penToolUrl, setPenToolUrl] = useState('');
  const [penToolIndex, setPenToolIndex] = useState('');
  const [comment, setComment] = useState('');
  const [homeworkTitle, setHomeworkTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [questionwiseComment, setQuestionwiseComment] = useState('');
  const [questionwiseRemark, setQuestionwiseRemark] = useState('');
  const [overallRemark, setOverallRemark] = useState('');
  const [overallScore, setOverallScore] = useState('');
  const [attachmentCount, setAttachmentCount] = useState([]);
  const [maxCount, setMaxCount] = useState(0);
  const [calssNameWise, setClassName] = useState('');
  const [studentBulkComment, setStudentBulkComment] = useState('');
  const [resultdata, setresultdata] = useState();
  const [qwiseEvaluated, setQwiseEvaluated] = useState([]);
  const [bulkTeacherRemark, setBulkTeacherRemark] = useState();
  const fileUploadInput = useRef(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [ percentValue , setPercentValue ] = useState(10)
  const [uploadStart, setUploadStart] = useState(false);


  let idInterval = null;
  useEffect(() => {
    console.log(uploadStart , 'start' , percentValue ,idInterval);
    if(uploadStart == true && percentValue < 90){
      console.log(percentValue , 'pval');
      idInterval = setInterval(() => setPercentValue((oldCount) => checkCount(oldCount) ), 1000);
    }

    return () => {
      clearInterval(idInterval);
      setPercentValue(10)
    };
  }, [uploadStart]);

  const checkCount = (count) => {
    console.log(count , 'count');
    if(count < 90){
      return count+5;
    }else {
      return count;
    }
  }


  const handleHomeworkSubmit = () => {
    let count = 0;
    if (isQuestionWise)
      for (let i = 0; i < attachmentDataDisplay.length; i++) {
        if (attachmentDataDisplay[i].length > 0) count += 1;
      }
    else
      for (let i = 0; i < bulkData.length; i++) {
        if (bulkData[i].length > 0) count += 1;
      }

    let requestData = {
      homework: homeworkSubmission.homeworkId,
      is_question_wise: isQuestionWise,
      questions: isQuestionWise
        ? attachmentData
        : [{ attachments: bulkData, attachmentData }],
      comment: comment,
    };
    if (count !== 0) {
      if (isupdate) {
        setisupdate(true);
        setUploadLoading(true);
        axiosInstance
          .put(
            `${endpoints.homeworkStudent.hwupdate}${homeworkSubmission.homeworkId}/update-hw/`,
            requestData
          )
          .then((result) => {
            if (result.data.status_code === 200) {
              setAlert('success', result.data.message);
              handleHomeworkCancel();
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
      } else {
        setLoading(true);
        setUploadLoading(true);
        axiosInstance
          .post(`${endpoints.homeworkStudent.submitHomework}`, requestData)
          .then((result) => {
            if (result.data.status_code === 201) {
              setAlert('success', result.data.message);
              handleHomeworkCancel();
              setLoading(false);
              setUploadLoading(false);
            } else {
              setAlert('error', result.data.message);
              setLoading(false);
              setUploadLoading(false);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
            setLoading(false);
          });
      }
    } else {
      setAlert('error', 'No file attached!');
      setUploadLoading(false);
    }
  };

  const handleHomeworkCancel = () => {
    // setDisplayRatingBox(false);
    setHwSelect(false);
    setDeuDate();
    setHomeworkSubmission((prev) => ({
      ...prev,
      isOpen: false,
      subjectId: '',
      subjectName: '',
    }));
  };

  const handlequestionwiseclick = () => {
    if (resultdata.hw_questions.questions) {
      let maxVal = 0;

      for (let i = 0; i < resultdata.hw_questions.questions.length; i++) {
        attachmentCount.push(0);
        attachmentDataDisplay.push([]);
        attachmentData.push({
          homework_question: resultdata.hw_questions.questions[i].id,
          attachments: [],
          comments: '',
        });
        maxVal += resultdata.hw_questions.questions[i].max_attachment;
      }
      setMaxCount(maxVal);
    }
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
      .get(
        `/academic/${homeworkSubmission.homeworkId}/hw-questions/?hw_status=${homeworkSubmission.status}&module_id=1`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setresultdata(result.data.data);
          if (result?.data?.data?.is_question_wise) {
            setIsQuestionWise(result.data.data.is_question_wise);
            setIsBulk(!result.data.data.is_question_wise);
          }

          // setBulkData(result.data.data.hw_questions[0].submitted_files)z
          if (homeworkSubmission.status === 1) {
            // setBulkData(result.data.data.hw_questions.submitted_files || [])
            // setBulkDataDisplay(result.data.data.hw_questions.submitted_files || [])
            setSubjectQuestions(result.data.data.hw_questions);
            setHomeworkTitle(result?.data?.data?.homework_name);
            setDesc(result.data.data.description);
            for (let i = 0; i < result.data.data.hw_questions.length; i++) {
              attachmentCount.push(0);
              attachmentDataDisplay.push([]);
              attachmentData.push({
                homework_question: result.data.data.hw_questions[i].id,
                attachments: [],
                comments: '',
              });
              if (result.data.data.hw_questions[i]?.is_attachment_enable == true) {
                maxVal += result.data.data.hw_questions[i].max_attachment;
              }

            }
            setMaxCount(maxVal);
          } else if (homeworkSubmission.status === 2 || homeworkSubmission.status === 3) {
            setDesc(result.data.data.homework.description);
            setHomeworkTitle(result.data.data.homework.homework_name);
            if (result.data.data.is_question_wise) {
              setIsBulk(false);

              for (let i = 0; i < result.data.data.hw_questions.length; i++) {
                attachmentCount.push(i + 1);
                attachmentDataDisplay.push(
                  result.data.data.hw_questions[i].submitted_files
                );
                attachmentData.push({
                  homework_question: result.data.data.hw_questions[i].question_id,
                  attachments: result.data.data.hw_questions[i].submitted_files,
                });
                if (result.data.data.hw_questions[i]?.is_attachment_enable == true) {
                  maxVal += result.data.data.hw_questions[i].max_attachment;
                }
              }

              setMaxCount(maxVal);

              setSubjectQuestions(result.data.data.hw_questions);
              if (homeworkSubmission.status === 3) {
                setQwiseEvaluated(result?.data?.data);
                setOverallRemark(result.data.data.overall_remark);
                setOverallScore(result.data.data.score);
                setQuestionwiseComment(result.data.data.hw_questions?.comment);
                setQuestionwiseRemark(result.data.data.hw_questions?.remark);
              }
            } else {
              for (let i = 0; i < result.data.data.hw_questions.questions.length; i++) {
                maxVal += result.data.data.hw_questions.questions[i].max_attachment;
              }
              setMaxCount(maxVal);

              setBulkDataDisplay(result.data.data.hw_questions.submitted_files);

              setBulkData(result.data.data.hw_questions.submitted_files);
              setIsBulk(true);
              setSubjectQuestions(result.data.data.hw_questions.questions);
              if (homeworkSubmission.status === 2) {
                setSubmittedEvaluatedFilesBulk(
                  result.data.data.hw_questions.submitted_files
                );
              } else if (homeworkSubmission.status === 3) {
                setOverallRemark(result.data.data.overall_remark);
                setOverallScore(result.data.data.score);
                setSubmittedEvaluatedFilesBulk(
                  result.data.data.hw_questions.evaluated_files
                );
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
    if(maxCount == 0){
      message.error('File Upload Restriction, please contact subject teacher')
    }
    else if (bulkDataDisplay?.length >= maxCount) {
      setAlert('warning', `Can\'t upload more than ${maxCount} attachments in total.`);
    } else {
      fileUploadInput.current.click();
    }
  };
  const handleBulkUpload = (e) => {
    e.persist();
    if (bulkDataDisplay?.length >= maxCount) {
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
        // fil.name.toLowerCase().lastIndexOf('.doc') > 0
        // fil.name.toLowerCase().lastIndexOf('.docx') > 0
      ) {
        setUploadStart(true);
        const formData = new FormData();
        formData.append('file', fil);
        axiosInstance
          .post(`${endpoints.homeworkStudent.fileUpload}`, formData)
          .then((result) => {
            if (result.data.status_code === 200) {
              const list = bulkDataDisplay?.slice();
              if (fil.name.lastIndexOf('.pdf') > 0) {
                const arr = [...result.data.data];
                for (let k = 0; k < arr.length; k++) {
                  bulkData.push(arr[k]);
                  list.push(arr[k]);
                  setBulkDataDisplay(list);
                }
                setPercentValue(100)
                setUploadStart(false);
              } else {
                list.push(e.target.files[0]);
                setBulkDataDisplay(list);
                bulkData.push(result.data.data);
                setPercentValue(100)
                setUploadStart(false);
              }
              setAlert('success', result.data.message);
            } else {
              setUploadStart(false);
              setAlert('error', result.data.message);
            }
          })
          .catch((error) => {
            setUploadStart(false);
            // setAlert('error',error.message)
          });
        console.log('homework', fil);
      } else {
        setUploadStart(false);
        setAlert(
          'error',
          'Only image(.jpeg, .jpg, .png), audio(mp3), video(.mp4) and pdf(.pdf) are acceptable'
        );
      }
    }
  };

  const removeBulkFileHandler = (i) => {
    const list = [...bulkDataDisplay];
    setLoading(true);
    axiosInstance
      .post(`${endpoints.deleteFromS3}`, {
        file_name: `homework/${list[i]}`,
      })
      .then((result) => {
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
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  };

  const uploadFileHandler = (e, index, maxVal, question) => {
    console.log(question , 'ques');
    e.persist();
    if(question?.is_attachment_enable == false){
      message.error('File Upload Restriction, please contact subject teacher')
    }
    else if (attachmentCount[index] >= maxVal) {
      setAlert(
        'warning',
        `Can\'t upload more than ${maxVal} attachments for question ${index + 1}`
      );
    } else {
      const fil = e.target.files[0];
      if (
        fil.name.toLowerCase().lastIndexOf('.pdf') > 0 ||
        fil.name.toLowerCase().lastIndexOf('.jpeg') > 0 ||
        fil.name.toLowerCase().lastIndexOf('.jpg') > 0 ||
        fil.name.toLowerCase().lastIndexOf('.png') > 0 ||
        fil.name.toLowerCase().lastIndexOf('.mp3') > 0 ||
        fil.name.toLowerCase().lastIndexOf('.mp4') > 0
      ) {
        setPercentValue(10)
        setUploadStart(true);
        const formData = new FormData();
        formData.append('file', fil);
        axiosInstance
          .post(`${endpoints.homeworkStudent.fileUpload}`, formData)
          .then((result) => {
            if (result.data.status_code === 200) {
              const list = attachmentDataDisplay.slice();
              if (fil.name.lastIndexOf('.pdf') > 0) {
                const arr = [...result.data.data];
                for (let k = 0; k < arr.length; k++) {
                  attachmentCount[index]++;
                  attachmentData[index].attachments.push(arr[k]);
                  list[index].push(arr[k]);
                  setAttachmentDataDisplay(list);
                }
                setUploadStart(false);
                setPercentValue(100)
              } else {
                attachmentCount[index]++;
                list[index] = [...attachmentDataDisplay[index], result.data.data];
                setAttachmentDataDisplay(list);
                attachmentData[index].attachments.push(result.data.data);
                setUploadStart(false);
                setPercentValue(100)
              }
              setAlert('success', result.data.message);
            } else {
              setUploadStart(false);
              setAlert('error', result.data.message);
            }
          })
          .catch((error) => {
            setUploadStart(false);
            // setAlert('error',error.response.result.error_msg)
          });
      } else {
        setAlert(
          'error',
          'Only image(.jpeg, .jpg, .png), audio(mp3), video(.mp4) and pdf(.pdf) are acceptable'
        );
      }
    }
  };

  const removeFileHandler = (questionIndex, i) => {
    const listDisplay = [...attachmentDataDisplay[questionIndex]];
    setLoading(true);
    axiosInstance
      .post(`${endpoints.deleteFromS3}`, {
        file_name: `homework/${listDisplay[i]}`,
      })
      .then((result) => {
        if (result.data.status_code === 204) {
          listDisplay.splice(i, 1);
          setAttachmentDataDisplay([
            ...attachmentDataDisplay.slice(0, questionIndex),
            listDisplay,
            ...attachmentDataDisplay.slice(questionIndex + 1),
          ]);
          attachmentData[questionIndex].attachments.splice(i, 1);
          attachmentCount[questionIndex]--;
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

  const FileRow = (props) => {
    const { file, onClose, index } = props;
    return (
      <div className='file_row_hw' style={{ width: '130px' }}>
        <div className='file_name_container_hw'>File {index + 1}</div>
        <IconButton size='small'>
          <VisibilityIcon />
        </IconButton>
        <div className='file_close_hw'>
          <span onClick={onClose}>
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
  const scrollableContainerEvaluated = useRef(null);

  const handleScroll = (index, dir) => {
    const ele = document.getElementById(`homework_student_question_container_${index}`);
    if (dir === 'left') {
      ele.scrollLeft -= 150;
    } else {
      ele.scrollLeft += 150;
    }
  };

  const handleScrollevaluated = (index, dir) => {
    const ele = document.getElementById(`homework_student_question_container_${index}`);
    if (dir === 'left') {
      ele.scrollLeft -= 150;
    } else {
      ele.scrollLeft += 150;
    }
  };

  const handleScrollAnswer = (index, dir) => {
    const ele = document.getElementById(`homework_student_answer_attachment_${index}`);
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
    let maxAttachmentArray = resultdata.hw_questions;
    let totalMaxAttachment = '';
    let result = 0;
    if (isupdate == true) {
      totalMaxAttachment = maxAttachmentArray?.questions.map((item) => {
        return (result += item.max_attachment);
      });
    } else if (isupdate == false) {
      totalMaxAttachment = maxAttachmentArray?.map((item) => {
        return (result += item.max_attachment);
      });
    }

    if (
      isQuestionWise &&
      attachmentCount[penToolIndex] >= maxAttachmentArray[penToolIndex].max_attachment
    ) {
      setAlert(
        'warning',
        `Can\'t upload more than ${attachmentCount[penToolIndex]} attachments in total.`
      );
      handleCloseCorrectionModal();
      return;
    } else {
      if (bulkDataDisplay.length >= totalMaxAttachment[totalMaxAttachment.length - 1]) {
        setAlert(
          'warning',
          `Can\'t upload more than ${totalMaxAttachment[totalMaxAttachment.length - 1]
          } attachments in total.`
        );
        handleCloseCorrectionModal();
        return;
      }
    }

    const fd = new FormData();
    fd.append('file', file);
    const filePath = await uploadFile(fd);

    if (isQuestionWise) {
      const list = attachmentDataDisplay.slice();
      list[penToolIndex] = [...attachmentDataDisplay[penToolIndex], filePath];
      setAttachmentDataDisplay(list);
      attachmentData[penToolIndex].attachments.push(filePath);
      attachmentCount[penToolIndex] += 1;
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
  };

  const desTestDetails = [{ asessment_response: { evaluvated_result: '' } }];

  useEffect(() => {
    if (penToolUrl) {
      setPenToolOpen(true);
    } else {
      setPenToolOpen(false);
    }
  }, [penToolUrl]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(true);
  };

  const handleDelete = () => {
    if (homeworkSubmission.isEvaluated) {
      setAlert('error', 'Homework Evaluated, can not be deleted');
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
        setAlert('error', 'error1');
        setLoading(false);
      });
  };
  const [isupdate, setisupdate] = useState(false);

  const onEdit = () => {
    if (homeworkSubmission.isEvaluated) {
      setAlert('error', 'Homework Evaluated, can not be Updated');
      return;
    } else setisupdate(true);
    setHomeworkSubmission({ ...homeworkSubmission, status: 1 });
  };

  const handleQuesComments = (index, value) => {
    // if(quesComments[index])
    // setQuesComments(...quesComments,quesComments[index]=value)
    // else{
    // // setQuesComments(...quesComments,quesComments.push(value))
    // attachmentData[index]=value
    // }
    attachmentData[index].comments = value;
  };

  const handleUpdate = () => {
    setisupdate(false);
    setLoading(true);
    axiosInstance
      .put(`${endpoints.homework.hwupdate}${homeworkSubmission.homeworkId}/update-hw/`)
      .then((result) => { });
  };

  return (
    <div className='create_group_filter_container'>
      {uploadLoading ? <Loader /> : ''}
      <div style={{ width: '90%', margin: '0 auto' }}>
        <div
          className='th-br-5 p-4 my-2 d-flex'
          style={{ background: '#EEF2F8', width: '100%', cursor: 'pointer' }}
          onClick={handleHomeworkCancel}
        >
          <LeftOutlined
            className='d-flex align-items-center'
            style={{ color: '#535BA0' }}
          />
          <p
            className='th-14 mx-2 my-0 d-flex align-items-center'
            style={{ color: '#535BA0', fontWeight: '600' }}
          >
            Back To Homework
          </p>
        </div>
        <div
          className='th-br-5 p-4 my-2'
          style={{ background: '#F1F7FF', width: '100%' }}
        >
          <div className='d-flex justify-content-between'>
            <div className='th-fw-600'> Subject : {subjectName}</div>
            <div>Creation Date : {date}</div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div style={{ width: '90%', margin: '0 auto' }} className='card th-br-10'>
          <div className={classes.homeworkSubmitwrapper}>
            {desc ? (
              <div className={classes.instructionText}>
                <span
                  style={{
                    marginLeft: '6px',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                  }}
                  className='p-3 m-0'
                >
                  Instructions : {desc}
                </span>
              </div>
            ) : null}

            <div
              className='row justify-content-between th-br-10 my-2 p-3 col-md-12'
              style={{ background: '#EEF2F8' }}
            >
              <Tooltip title={homeworkTitle} >
                <div className='th-14 th-fw-600 col-md-8 text-truncate'>Homework Title : {homeworkTitle}</div>
              </Tooltip>
              {homeworkSubmission.status === 1 && (
                <div className='checkWrapper'>
                  <div className='homework_block_questionwise_check'>
                    <Checkbox
                      onChange={() => {
                        setIsQuestionWise(!isQuestionWise);
                        if (!isQuestionWise) {
                          setClassName('upload-wise');
                        } else {
                          setClassName('');
                        }
                      }}
                      onClick={handlequestionwiseclick}
                      color='primary'
                      checked={isQuestionWise}
                    />
                    <p className='th-13 th-fw-600 mx-2'>Upload Question Wise</p>
                  </div>
                </div>
              )}
            </div>

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
                  <div className={` ${classes.homeworkQuestion} ${calssNameWise}`}>
                    <span className='question th-13 th-fw-600 p-2'>
                      Q{index + 1}: {question.question}
                    </span>
                  </div>

                  {isQuestionWise && homeworkSubmission.status == 1 && (
                    <div className='questionWiseAttachmentsContainer before submit'>
                      <IconButton
                        fontSize='small'
                        id='file-icon'
                        disableRipple
                        component='label'
                        className={classes.attachmentIcon}
                      >
                        <AttachmentIcon fontSize='small' />
                        <input
                          type='file'
                          accept='.png, .jpg, .jpeg, .mp3, .mp4, .pdf, .PNG, .JPG, .JPEG, .MP3, .MP4, .PDF'
                          onChange={(e) => {
                            uploadFileHandler(e, index, question.max_attachment , question);
                            e.target.value = null;
                          }}
                          className={classes.fileInput}
                        />
                      </IconButton>
                      <small style={{ width: '100%', color: '#014b7e' }}>
                        {' '}
                        Accepted files: jpeg,jpg,mp3,mp4,pdf,png
                      </small>
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
                                <IconButton
                                  onClick={() => handleScrollAnswer(index, 'left')}
                                >
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
                                  <div
                                    className='attachment'
                                    style={{ height: '200px', width: '300px' }}
                                  >
                                    <Attachment
                                      key={`homework_student_question_attachment_${i}`}
                                      fileUrl={file}
                                      fileName={`Attachment-${i + 1}`}
                                      urlPrefix={
                                        file.includes('/lesson_plan_file/')
                                          ? `${endpoints.homework.resourcesFiles}`
                                          : `${endpoints.discussionForum.s3}/homework`
                                      }
                                      index={i}
                                      //onOpenInPenTool={(url) => openInPenTool(url, index)}
                                      actions={['preview']}
                                    />
                                  </div>
                                ))}
                                <div
                                  style={{
                                    position: 'absolute',
                                    visibility: 'hidden',
                                    width: '0',
                                    height: '0px',
                                  }}
                                >
                                  <SRLWrapper>
                                    {attachmentData[index]?.attachments?.map((url, i) => (
                                      <img
                                        src={
                                          url.includes('/lesson_plan_file/')
                                            ? `${endpoints.homework.resourcesFiles}${url}`
                                            : `${endpoints.discussionForum.s3}/homework/${url}`
                                        }
                                        onError={(e) => {
                                          e.target.src = placeholder;
                                        }}
                                        alt={`Attachment-${i + 1}`}
                                        style={{ width: '0', height: '0px' }}
                                      />
                                    ))}
                                  </SRLWrapper>
                                </div>
                              </div>
                            </SimpleReactLightbox>
                            <div className='next-btn'>
                              {attachmentData[index]?.attachments.length > 1 && (
                                <IconButton
                                  onClick={() => handleScrollAnswer(index, 'right')}
                                >
                                  <ArrowForwardIosIcon color='primary' />
                                </IconButton>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(homeworkSubmission.status === 1 ||
                    homeworkSubmission.status === 2 ||
                    homeworkSubmission.status === 3) &&
                    question.question_files?.length > 0 && (
                      <div className='attachments-container'>
                        <Typography component='h4' color='primary' className='header'>
                          Attachments
                        </Typography>
                        <div className='attachments-list-outer-container'>
                          <div className='prev-btn'>
                            {question.question_files.length > 0 && (
                              <IconButton onClick={() => handleScroll(index, 'left')}>
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
                              {question.question_files.map((url, i) => {
                                let cindex = 0;
                                question.question_files.forEach((item, index) => {
                                  if (index < i) {
                                    if (typeof item == 'string') {
                                      cindex = cindex + 1;
                                    } else {
                                      cindex = Object.keys(item).length + cindex;
                                    }
                                  }
                                });
                                if (typeof url == 'object') {
                                  return Object.values(url).map((item, i) => {
                                    return (
                                      <div className='attachment'>
                                        <Attachment
                                          key={`homework_student_question_attachment_${i}`}
                                          fileUrl={item}
                                          fileName={`Attachment-${i + 1 + cindex}`}
                                          urlPrefix={
                                            item.includes('/lesson_plan_file/')
                                              ? `${endpoints.homework.resourcesFiles}`
                                              : `${endpoints.discussionForum.s3}/homework`
                                          }
                                          index={i + cindex}
                                          onOpenInPenTool={(item) =>
                                            openInPenTool(item, index)
                                          }
                                          actions={[
                                            'preview',
                                            'download',
                                            homeworkSubmission.status === 1 &&
                                            question.is_pen_editor_enable &&
                                            !item.includes('/lesson_plan_file/') &&
                                            'pentool',
                                          ]}
                                        />
                                      </div>
                                    );
                                  });
                                } else
                                  return (
                                    <div className='attachment'>
                                      <Attachment
                                        key={`homework_student_question_attachment_${i}`}
                                        fileUrl={url}
                                        fileName={`Attachment-${i + 1}`}
                                        urlPrefix={
                                          url.includes('/lesson_plan_file/')
                                            ? `${endpoints.homework.resourcesFiles}`
                                            : `${endpoints.discussionForum.s3}/homework`
                                        }
                                        index={cindex}
                                        onOpenInPenTool={(url) =>
                                          openInPenTool(url, index)
                                        }
                                        actions={
                                          url.includes('/lesson_plan_file/')
                                            ? ['download']
                                            : [
                                              'preview',
                                              'download',
                                              homeworkSubmission.status === 1 &&
                                              question.is_pen_editor_enable &&
                                              !url.includes('/lesson_plan_file/') &&
                                              'pentool',
                                            ]
                                        }
                                      />
                                    </div>
                                  );
                              })}
                              <div
                                style={{
                                  position: 'absolute',
                                  visibility: 'hidden',
                                  height: '0px',
                                  width: '0px',
                                }}
                              >
                                <SRLWrapper>
                                  {question.question_files.map((url, i) => {
                                    if (typeof url == 'object') {
                                      return Object.values(url).map((item, i) => {
                                        return (
                                          <img
                                            src={
                                              item.includes('/lesson_plan_file/')
                                                ? `${endpoints.homework.resourcesFiles}${item}`
                                                : `${endpoints.discussionForum.s3}/homework/${item}`
                                            }
                                            onError={(e) => {
                                              e.target.src = placeholder;
                                            }}
                                            alt={`Attachment-${i + 1}`}
                                            style={{ width: '0px', height: '0px' }}
                                          />
                                        );
                                      });
                                    } else
                                      return (
                                        <img
                                          src={
                                            url.includes('/lesson_plan_file/')
                                              ? `${endpoints.homework.resourcesFiles}${url}`
                                              : `${endpoints.discussionForum.s3}/homework/${url}`
                                          }
                                          onError={(e) => {
                                            e.target.src = placeholder;
                                          }}
                                          alt={`Attachment-${i + 1}`}
                                          style={{ width: '0px', height: '0px' }}
                                        />
                                      );
                                  })}
                                </SRLWrapper>
                              </div>
                            </div>
                          </SimpleReactLightbox>
                          <div className='next-btn'>
                            {question.question_files.length > 0 && (
                              <IconButton onClick={() => handleScroll(index, 'right')}>
                                <ArrowForwardIosIcon color='primary' />
                              </IconButton>
                            )}
                          </div>
                        </div>
                        {homeworkSubmission.status === 1 && (
                          <div
                            className='comments-remarks-container'
                            style={{ display: 'flex', width: '95%', margin: '0 auto' }}
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
                        )}
                        {/* for bulk:- student comments for student evaluated homework*/}
                        <div className='overallContainer'>
                          {studentBulkComment[index] && (
                            <div className='scoreBox1' style={{ marginBottom: '1%' }}>
                              Comment : {studentBulkComment[index]}
                            </div>
                          )}
                        </div>

                        <div className='overallContainer'>
                          {question?.teacher_comment && (
                            <div className='scoreBox1'>
                              Teacher's comment : {question?.teacher_comment}
                            </div>
                          )}
                          {question?.remark && (
                            <div className='remarkBox1'>
                              Teacher's Remark : {question?.remark}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  {!isBulk && (
                    <>
                      {((homeworkSubmission.status === 2 &&
                        question.submitted_files?.length > 0) ||
                        (homeworkSubmission.status === 3 &&
                          question.evaluated_files?.length > 0)) && (
                          <div className='attachments-container'>
                            {(() => {
                              document.body.style.overflow = 'hidden';
                            })()}
                            <Typography component='h4' color='primary' className='header'>
                              {homeworkSubmission.status === 2
                                ? 'Submitted Files'
                                : 'Evaluated Files'}
                            </Typography>
                            <div className='attachments-list-outer-container'>
                              <div className='prev-btn'>
                                {question?.submitted_files?.length > 1 && (
                                  <IconButton onClick={() => handleScroll(index, 'left')}>
                                    <ArrowBackIosIcon />
                                  </IconButton>
                                )}
                              </div>
                              {homeworkSubmission.status === 2 && (
                                <SimpleReactLightbox>
                                  <div
                                    className='attachments-list'
                                    ref={scrollableContainer}
                                    onScroll={(e) => {
                                      e.preventDefault();
                                    }}
                                    id={`homework_student_question_container_${index}`}
                                  >
                                    {question.submitted_files.map((url, i) => (
                                      <>
                                        <div className='attachment'>
                                          <Attachment
                                            key={`homework_student_question_attachment_${i}`}
                                            fileUrl={url}
                                            fileName={`Attachment-${i + 1}`}
                                            urlPrefix={
                                              url.includes('/lesson_plan_file/')
                                                ? `${endpoints.homework.resourcesFiles}`
                                                : `${endpoints.discussionForum.s3}/homework`
                                            }
                                            index={i}
                                            actions={['preview', 'download']}
                                          />
                                        </div>
                                      </>
                                    ))}
                                    <div
                                      style={{
                                        position: 'absolute',
                                        visibility: 'hidden',
                                        height: '0px',
                                        width: '0px',
                                      }}
                                    >
                                      <SRLWrapper>
                                        {question.submitted_files.map((url, i) => (
                                          <img
                                            src={
                                              url.includes('/lesson_plan_file/')
                                                ? `${endpoints.homework.resourcesFiles}${url}`
                                                : `${endpoints.discussionForum.s3}/homework/${url}`
                                            }
                                            onError={(e) => {
                                              e.target.src = placeholder;
                                            }}
                                            alt={`Attachment-${i + 1}`}
                                            style={{ height: '0px' }}
                                          />
                                        ))}
                                      </SRLWrapper>
                                    </div>
                                  </div>
                                </SimpleReactLightbox>
                              )}
                              {homeworkSubmission.status === 3 && (
                                <SimpleReactLightbox>
                                  <div
                                    className='attachments-list'
                                    ref={scrollableContainer}
                                    onScroll={(e) => {
                                      e.preventDefault();
                                    }}
                                    id={`homework_student_question_container_${index}`}
                                  >
                                    {question.evaluated_files.map((url, i) => (
                                      <>
                                        <div className='attachment'>
                                          <Attachment
                                            key={`homework_student_question_attachment_${i}`}
                                            fileUrl={url}
                                            fileName={`Attachment-${i + 1}`}
                                            urlPrefix={
                                              url.includes('/lesson_plan_file/')
                                                ? `${endpoints.homework.resourcesFiles}`
                                                : `${endpoints.discussionForum.s3}/homework`
                                            }
                                            index={i}
                                            actions={['preview', 'download']}
                                          />
                                        </div>
                                      </>
                                    ))}
                                    <div
                                      style={{ position: 'absolute', visibility: 'hidden' }}
                                    >
                                      <SRLWrapper>
                                        {question.evaluated_files.map((url, i) => (
                                          <img
                                            src={
                                              url.includes('/lesson_plan_file/')
                                                ? `${endpoints.homework.resourcesFiles}${url}`
                                                : `${endpoints.discussionForum.s3}/homework/${url}`
                                            }
                                            onError={(e) => {
                                              e.target.src = placeholder;
                                            }}
                                            alt={`Attachment-${i + 1}`}
                                            style={{ height: '0px' }}
                                          />
                                        ))}
                                      </SRLWrapper>
                                    </div>
                                  </div>
                                </SimpleReactLightbox>
                              )}
                              <div className='next-btn'>
                                {question?.submitted_files?.length > 1 && (
                                  <IconButton onClick={() => handleScroll(index, 'right')}>
                                    <ArrowForwardIosIcon color='primary' />
                                  </IconButton>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                    </>
                  )}
                  {isQuestionWise && homeworkSubmission.status == 3 && (
                    <div className='scoreBox1 w-50 m-5'>
                      Question Wise Remarks : {question?.remark}
                    </div>
                  )}
                </div>
              </>
            ))}

            {homeworkSubmission.status === 1 && !isQuestionWise && (
              <div className='bulkContainer'>
                <>
                  <div className='bulkUploadButton'>
                    <Button
                      variant='contained'
                      type='primary'
                      // style={{ color: 'white' }}
                      component='label'
                      size='medium'
                      onClick={handleBulkNotification}
                      icon={<UploadOutlined />}
                    >
                      Bulk Upload
                      {bulkDataDisplay?.length < maxCount ||
                        bulkDataDisplay === undefined ? (
                        <input
                          type='file'
                          accept='.png, .jpg, .jpeg, .mp3, .mp4, .pdf, .PNG, .JPG, .JPEG, .MP3, .MP4, .PDF'
                          style={{ display: 'none' }}
                          id='raised-button-file'
                          onChange={(e) => {
                            handleBulkUpload(e);
                            e.target.value = null;
                          }}
                          ref={fileUploadInput}
                        />
                      ) : null}
                    </Button>
                  </div>
                  <small className={classes.acceptedfiles}>
                    {' '}
                    Accepted files: jpeg,jpg,mp3,mp4,pdf,png
                  </small>
                </>
                <div className='bulk_upload_attachments'>
                  {bulkDataDisplay?.map((file, i) => (
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
                        {bulkData?.length > 1 && (
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
                          {bulkData?.length > 0 &&
                            bulkData?.map((file, i) => (
                              <div className='attachment'>
                                <Attachment
                                  key={`homework_student_question_attachment_${i}`}
                                  fileUrl={file}
                                  fileName={`Attachment-${i + 1}`}
                                  urlPrefix={
                                    file.includes('/lesson_plan_file/')
                                      ? `${endpoints.homework.resourcesFiles}`
                                      : `${endpoints.discussionForum.s3}/homework`
                                  }
                                  index={i}
                                  //onOpenInPenTool={(url) => openInPenTool(url, index)}
                                  actions={['preview']}
                                />
                              </div>
                            ))}
                          <div style={{ position: 'absolute', visibility: 'hidden' }}>
                            <SRLWrapper>
                              {bulkData?.map((url, i) => (
                                <img
                                  src={
                                    url.includes('/lesson_plan_file/')
                                      ? `${endpoints.homework.resourcesFiles}${url}`
                                      : `${endpoints.discussionForum.s3}/homework/${url}`
                                  }
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
                        {bulkData?.length > 1 && (
                          <IconButton onClick={() => handleScrollBulk('right')}>
                            <ArrowForwardIosIcon color='primary' />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isBulk && (
              <>
                {(homeworkSubmission.status === 2 || homeworkSubmission.status === 3) &&
                  submittedEvaluatedFilesBulk?.length > 0 && (
                    <div className='homework-question-container student-view'>
                      <div className='attachments-container'>
                        <Typography component='h4' color='primary' className='header'>
                          {homeworkSubmission.status === 2
                            ? 'All Submitted Files'
                            : 'All Evaluated Files'}
                        </Typography>
                        <div className='attachments-list-outer-container'>
                          { }
                          <div className='prev-btn'>
                            {submittedEvaluatedFilesBulk.length > 5 && (
                              <IconButton onClick={() => handleScroll('left')}>
                                <ArrowBackIosIcon />
                              </IconButton>
                            )}
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
                                      urlPrefix={
                                        url.includes('/lesson_plan_file/')
                                          ? `${endpoints.homework.resourcesFiles}`
                                          : `${endpoints.discussionForum.s3}/homework`
                                      }
                                      index={i}
                                      // actions={['preview', 'download']}
                                      actions={
                                        url.includes('.doc')
                                          ? ['download']
                                          : ['preview', 'download']
                                      }
                                    />
                                  </div>
                                </>
                              ))}
                              <div style={{ position: 'absolute', visibility: 'hidden' }}>
                                <SRLWrapper>
                                  {submittedEvaluatedFilesBulk?.map((url, i) => (
                                    <img
                                      src={
                                        url.includes('/lesson_plan_file/')
                                          ? `${endpoints.homework.resourcesFiles}${url}`
                                          : `${endpoints.discussionForum.s3}/homework/${url}`
                                      }
                                      onError={(e) => {
                                        e.target.src = placeholder;
                                      }}
                                      alt={`Attachment-${i + 1}`}
                                      style={{ height: '0px' }}
                                    />
                                  ))}
                                </SRLWrapper>
                              </div>
                            </div>
                          </SimpleReactLightbox>
                          {submittedEvaluatedFilesBulk.length > 5 && (
                            <div className='next-btn'>
                              <IconButton onClick={() => handleScroll('right')}>
                                <ArrowForwardIosIcon color='primary' />
                              </IconButton>
                            </div>
                          )}
                        </div>
                      </div>
                      {homeworkSubmission.status === 3 ? (
                        <div className='overallContainer'>
                          {questionwiseComment && (
                            <div className='scoreBox1'>
                              Teacher's comment : {questionwiseComment}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}
              </>
            )}

            {/* {homeworkSubmission.status === 3 && isQuestionWise && (
                            <>
                                {console.log(qwiseEvaluated, 'ques3')}
                                {qwiseEvaluated?.hw_questions?.length > 0 && qwiseEvaluated?.hw_questions?.map((each, index) => (
                                    < div className='add-homework-container-coordinator'>
                                        <div className='th-13 col-md-8 th-br-10' style={{ background: '#eef2f8' }} >
                                            <div className='p-4 th-14 th-fw-600'>Question {index + 1} : {each.question}</div>
                                        </div>

                                        <div className='attachments-container'>
                                            <div className='col-md-8 my-2 p-2 th-14 th-fw-600 th-br-10' style={{ background: '#eef2f8', borderBottom: '1px solid grey' }} >
                                                Teacher Attachments
                                            </div>
                                            <div className='attachments-list-outer-container'>
                                                <div className='prev-btn'>
                                                    <IconButton onClick={() => handleScroll(index,'left')}>
                                                        <ArrowBackIosIcon />
                                                    </IconButton>
                                                </div>
                                                <SimpleReactLightbox>
                                                    <div
                                                        className='attachments-list'
                                                        ref={scrollableContainer}
                                                        onScroll={(e) => {
                                                            e.preventDefault();
                                                        }}
                                                    id={`homework_student_question_container_${index}`}

                                                    >
                                                        {each?.question_files.map((url, i) => {
                                                          
                                                            return (
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
                                                            );
                                                        })}
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                width: '0',
                                                                height: '0',
                                                                visibility: 'hidden',
                                                            }}
                                                        >
                                                            <SRLWrapper>
                                                                {each.question_files.map((url, i) => (
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
                                                    <IconButton onClick={() => handleScroll(index,'right')}>
                                                        <ArrowForwardIosIcon color='primary' />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </div>

                                        {each?.evaluated_files?.length > 0 ?
                                        <div className='attachments-container'>
                                            <div className='col-md-8 my-2 p-2 th-14 th-fw-600 th-br-10' style={{ background: '#eef2f8', borderBottom: '1px solid grey' }} >
                                                Evaluated Attachments
                                            </div>
                                            <div className='attachments-list-outer-container'>
                                                <div className='prev-btn'>
                                                    <IconButton onClick={() => handleScrollevaluated(index,'left')}>
                                                        <ArrowBackIosIcon />
                                                    </IconButton>
                                                </div>
                                                <SimpleReactLightbox>
                                                    <div
                                                        className='attachments-list'
                                                        ref={scrollableContainerEvaluated}
                                                        onScroll={(e) => {
                                                            e.preventDefault();
                                                        }}
                                                    id={`homework_student_question_container_${index}`}

                                                    >
                                                        {each?.evaluated_files.map((url, i) => {
                                                          
                                                            return (
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
                                                            );
                                                        })}
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                width: '0',
                                                                height: '0',
                                                                visibility: 'hidden',
                                                            }}
                                                        >
                                                            <SRLWrapper>
                                                                {each.evaluated_files.map((url, i) => (
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
                                                    <IconButton onClick={() => handleScrollevaluated(index,'right')}>
                                                        <ArrowForwardIosIcon color='primary' />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </div>
                                        : ''}
                                     

                                        <div className='th-13 col-md-8 th-br-10' style={{ background: '#eef2f8' }} >
                                            <div className='p-4 th-14 th-fw-600'>Remarks : {each.remark}</div>
                                        </div>
                                    <Divider />
                                    </div>
                                ))}
                            </>
                        )} */}
            <div>
              {homeworkSubmission.status === 3 ? (
                <div className='overallContainer1'>
                  {isBulk ? (
                    <>
                      {questionwiseRemark != '' && (
                        <div className='scoreBox'>
                          Teacher Remark : {questionwiseRemark}
                        </div>
                      )}
                    </>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}
            </div>

            <div className='overallContainer1'>
              {homeworkSubmission.status === 3 ? (
                <>
                  {overallScore != 0 && (
                    <div className='scoreBox'>Overall Score : {overallScore}</div>
                  )}
                  {overallRemark != '' && (
                    <div className='remarkBox'>Overall Remark : {overallRemark}</div>
                  )}
                </>
              ) : null}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                {/* <div>
                                    <Button
                                        variant='contained'
                                        className='cancelButton labelColor homework_submit_button_cancel mx-2'
                                        size='medium'
                                        onClick={handleHomeworkCancel}
                                        >
                                        {homeworkSubmission.status === 1 ? 'CANCEL' : 'BACK'}
                                    </Button>
                                </div> */}

                {!isupdate && homeworkSubmission.status === 2 && (
                  <Button
                    variant='contained'
                    type='secondary'
                    onClick={onEdit}
                    style={{ width: '15%' }}
                  >
                    Edit
                  </Button>
                )}

                {homeworkSubmission.status === 2 && !isupdate && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleClick}
                    style={{
                      backgroundColor: 'red',
                      width: '15%',
                      color: 'white',
                      marginLeft: '20px',
                    }}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                )}
                {homeworkSubmission.status === 1 && (
                  <div>
                    <Button
                      variant='contained'
                      style={{ color: 'white' }}
                      onClick={handleHomeworkSubmit}
                      type='primary'
                      size='medium'
                      className='mx-2 '
                    >
                      {isupdate == true ? 'Update' : 'Submit'}
                    </Button>
                  </div>
                )}
                <Dialog id={id} open={open} onClose={handleClose}>
                  <DialogTitle id='draggable-dialog-title'>Delete</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete ?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={(e) => handleClose()}
                      className='labelColor cancelButton'
                    >
                      Cancel
                    </Button>
                    <Button
                      type='primary'
                      variant='contained'
                      style={{ color: 'white' }}
                      onClick={handleDelete}
                    >
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
                <Modal maskClosable={false} closable={false} footer={null} visible={uploadStart} width={1000} centered>
                  <Progress
                    strokeColor={{
                      from: '#108ee9',
                      to: '#87d068',
                    }}
                    percent={percentValue}
                    status="active"
                    className='p-4'
                  />
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default HomeworkSubmissionNew;
