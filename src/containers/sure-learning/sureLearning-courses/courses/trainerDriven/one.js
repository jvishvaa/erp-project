/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Typography,
  withStyles,
  Button,
  Checkbox,
  Radio,
  Divider,
  StepLabel,
  Card,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormGroup,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core';
import './trainingunit.css';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import Stepper from '@material-ui/core/Stepper';
import ReactHtmlParser from 'react-html-parser';
import Step from '@material-ui/core/Step';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import TextModel from './viewTestModel';
import VideoModel from './viewVideoModel';
import useFetch from './useFetch';
import Loader from '../../../../../components/loader/loader';
import urls from 'config/endpoints';
// import endpoints from '';
import { AlertNotificationContext as useAlert } from '../../../../../context-api/alert-context/alert-state';

import styles from './TrainingUnit.style.js';
import MatchTheFollowing from './MatchTheFollowing';
import ViewPdfModel from './viewPdfModel';

let count=0;

const TrainingUnits = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const [courseType] = useState(localStorage.getItem('coursesType'));
  const [next, setnext] = useState(false);
  const [mcqTestOpen, setMcqTestOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedValue, setSelectedValue] = useState([]);
  const [choosenAnswerStatus, setChoosenAnswerStatus] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [mcqQueList, setMcqQuesList] = useState('');
  const [initialValue, SetinitialValue] = useState([]);
  const [questionPaperId, setQuestionPaperId] = useState('');
  const [choiceMatrixAns, setChoiceMatrixAns] = useState([]);
  const [loading, setloading] = useState(false);
  const [openReview, setReviewOpen] = useState(false);
  const [contentReleratedId, setContentReleratedId] = useState('');
  const [AssessmentId, setAssessmentId] = useState('');
  const [assessmentReviewFile, setAssessmentReviewFile] = useState('');
  const [assessmentTitle, setAssessmentTitle] = useState('');
  const [assessmentQuestionFile, setAssessmentQuestonFile] = useState('');
  const [currentChapter, setCurrentChapter] = useState('');
  const [curretnIndex, setCurrentIndex] = useState('');
  const [fullData, setFullData] = useState('');
  const [contentId, setContentId] = useState('');
  const [courseContentId, setCOurseContentId] = useState('');
  const [mcqStatus, setMcqStatus] = useState(false);
  const [mcqScore, setMcqScore] = useState('');
  const [mcqTestTitle, setMcqTestTitle] = useState('');
  const [questionPaperData, setQuestionPaperData] = useState('');
  const [contentRelatedChapterID, setContentReletedChapterID] = useState('');
  const [courseWiseVideoId, setCourseWiseVideoId] = useState('');
  const [ModalID, setModalID] = useState('');
  const [open, setOpen] = React.useState(false);
  const alert = useAlert();
  const classIdNo = sessionStorage.getItem('classId');
  const history = useHistory();
  // const modelName = sessionStorage.getItem('moduleName');
  // const chapterName = sessionStorage.getItem('chapterName');

  const location = useLocation();
  const {
    chapterData: currentData,
    currentIndexNo: currentIndexId,
    nextInfo: nextData,
  } = location.state;

  useEffect(() => {
    if (location.state !== undefined) {
      setCurrentIndex(currentIndexId);
      setFullData(nextData);
      setCurrentChapter(currentData);
      setContentId((nextData[currentIndexId].id && nextData[currentIndexId].id));
      setCOurseContentId(nextData[currentIndexId].course_content);
    }
  }, [auth]);

  const contentIdInformation = localStorage.getItem('contentId');
  const courseId = localStorage.getItem('courseIdNO');
  const classIdNoInformation = sessionStorage.getItem('classId');
  const {
    data: trainingLessons,
    isLoading: gettingTrainingLessons,
    doFetch: fetchTrainerLessons,
  } = useFetch(null);

  useEffect(() => {
    if (trainingLessons && trainingLessons.length !== 0) {
      setContentId(trainingLessons[curretnIndex].id);
      setFullData(trainingLessons);
      setCOurseContentId(trainingLessons[curretnIndex].course_content);
      setCurrentChapter(trainingLessons[curretnIndex].course_wise_videos);
      // alert.success('View Your Test Score');
    }
  }, [trainingLessons]);

  function mcqSubmitResponse() {
    let URL;
    if (((auth.personal_info && auth.personal_info.role === 'AcademicHeads') || (auth.personal_info && auth.personal_info.role === 'Planner') || (auth.personal_info && auth.personal_info.role === 'Coordinator') || (auth.personal_info && auth.personal_info.role === 'AcademicManager') || (auth.personal_info && auth.personal_info.role === 'Principal') || (auth.personal_info && auth.personal_info.role === 'LeadTeacher')) && courseType === 'trainer') {
      URL = `${urls.inHouseModules}?content_id=${contentIdInformation}&course_instance_id=${courseId}&${courseType}=true&class_id=${classIdNoInformation}`;
    } else {
      URL = `${urls.inHouseModules}?content_id=${contentIdInformation}&course_instance_id=${courseId}&${courseType}=true`;
    }
    fetchTrainerLessons({
      url: URL,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
          module: localStorage.getItem('Induction_Training')
      },
    });
  }

  function handleNextChapter() {
    window.scrollTo(0, 0);
    if (fullData.length === curretnIndex + 1) {
      let data;
      if (courseType === 'self_driven') {
        data = {
          is_finish: true,
          content_id: contentId,
          course_content_id: courseContentId,
          is_self_driven: true,
        };
      } else if (courseType === 'is_training_course') {
        data = {
          is_finish: true,
          content_id: contentId,
          course_content_id: courseContentId,
          is_self_driven: true,
          is_training_course: true,
        };
      } else if (courseType === 'triner_driven') {
        data = {
          is_finish: true,
          content_id: contentId,
          course_content_id: courseContentId,
          is_trainer_driven: true,
        };
      } else if (courseType === 'trainer') {
        data = {
          is_finish: true,
          content_id: contentId,
          course_content_id: courseContentId,
          is_trainer: true,
          class_id: classIdNo,
        };
      } else {
        data = {
          is_finish: true,
          content_id: contentId,
          course_content_id: courseContentId,
          is_induction_training: true,
        };
      }
      let URL;
      if (((auth.personal_info && auth.personal_info.role === 'AcademicHeads') || (auth.personal_info && auth.personal_info.role === 'Planner') || (auth.personal_info && auth.personal_info.role === 'Coordinator') || (auth.personal_info && auth.personal_info.role === 'AcademicManager') || (auth.personal_info && auth.personal_info.role === 'Principal') || (auth.personal_info && auth.personal_info.role === 'LeadTeacher')) && courseType === 'trainer') {
        URL = `${urls.FinishChapterApi}?${courseType}=true&class_id=${classIdNo}`;
      } else {
        URL = `${urls.FinishChapterApi}?${courseType}=true`;
      }
      setloading(true);
      fetch(URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
          module: localStorage.getItem('Induction_Training')
        },
        flag: true,
      })
        .then((res) => {
          if (res.status === 404) {
            setloading(false);
            alert.warning('Please complete mcq test');
          }
          if (res.status === 200) {
            setloading(false);
            alert.error('Please take the course again, as you haven\'t cross the cutoff marks.');
            history.push('./chapters');
          }
          if (res.status === 201) {
            setloading(false);
            history.push('./chapters');
            alert.success('You have successfully completed this lesson');
            return res.json();
          }
          if (res.status !== 201 && res.status !== 404 && res.status !== 200) {
            setloading(false);
            alert.warning('Something went wrong please try again ');
          }
          return 0;
        });
    }
    if (fullData.length !== curretnIndex + 1) {
      // setContentId(fullData[curretnIndex + 1].id);
      // setCOurseContentId(fullData[curretnIndex + 1].course_content);
      // setCurrentChapter(fullData[curretnIndex + 1].course_wise_videos);
      // setCurrentIndex((prev) => prev + 1);
      let data;
      if (courseType === 'self_driven') {
        data = {
          content_id: contentId,
          course_content_id: courseContentId,
          is_self_driven: true,
        };
      } else if (courseType === 'is_training_course') {
        data = {
          content_id: contentId,
          course_content_id: courseContentId,
          is_self_driven: true,
          is_training_course: true,
        };
      } else if (courseType === 'triner_driven') {
        data = {
          content_id: contentId,
          course_content_id: courseContentId,
          is_trainer_driven: true,
        };
      } else if (courseType === 'trainer') {
        data = {
          content_id: contentId,
          course_content_id: courseContentId,
          is_trainer: true,
          class_id: classIdNo,
        };
      } else {
        data = {
          content_id: contentId,
          course_content_id: courseContentId,
          is_induction_training: true,
        };
      }

      // setloading(true);
      const URL = `${urls.FinishChapterApi}?${courseType}=true`;
      fetch(URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
          module: localStorage.getItem('Induction_Training')
        },
      })
        .then((res) => {
          if (res.status === 404) {
            setloading(false);
            alert.warning('please complete mcq test');
          }
          if (res.status === 201) {
            setloading(false);
            alert.success(`You have successfully completed step ${curretnIndex + 1}`);
            setContentId(fullData[curretnIndex + 1].id);
            setCOurseContentId(fullData[curretnIndex + 1].course_content);
            setCurrentChapter(fullData[curretnIndex + 1].course_wise_videos);
            setCurrentIndex((prev) => prev + 1);
            return res.json();
          }
          if (res.status !== 201 && res.status !== 404) {
            setloading(false);
            alert.warning('somthing went wrong please try again ');
          }
          return 0;
        });
    }
  }

  useEffect(() => {
    if (auth) {
      setnext(false);
    }
  }, [auth]);

  const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  };
  DialogTitle.propTypes = {
    children: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  function multichoiceCompareFunction(a, b) {
    let value = 0;
    for (let i = 0; i < a.length; i += 1) { for (let j = 0; j < b.length; j += 1) { if (a[i] === b[j]) { value += 1; } } }
    return value === a.length;
  }

  function handleChange(e, ql, index) {
    if (ql && ql.type_question && ql.type_question.question_type_name === 'Single Choice') {
      const awV = [...selectedValue];
      awV[index] = true;
      console.log(awV[index], awV);
      setSelectedValue(awV);
      const anwew = [...choosenAnswerStatus];
      console.log('anwew', anwew);
      console.log(choosenAnswerStatus);
      anwew[index] = Object.keys(mcqQueList && mcqQueList[activeStep].correct_ans && JSON.parse(`${mcqQueList[activeStep].correct_ans}`))[0] === e.target.value;
      setChoosenAnswerStatus(anwew);
      console.log('After setting', choosenAnswerStatus);
      const awa = [...selectedOption];
      const ans = {
        id: ql.id,
        answer: e.target.value,
        question_type: ql.type_question.id,
      };
      awa[index] = ans;
      setSelectedOption(awa);
      SetinitialValue(e.target.value);
    }

    if (ql && ql.type_question && ql.type_question.question_type_name === 'Multiple Choice') {
      const currentIndex = initialValue.indexOf(e.target.value);
      const newChecked = [...initialValue];
      if (currentIndex === -1) {
        newChecked.push(e.target.value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      SetinitialValue(newChecked);
      const awV = [...selectedValue];
      awV[index] = !(newChecked && newChecked.length === 0);
      setSelectedValue(awV);
      const anwew = [...choosenAnswerStatus];
      anwew[index] = mcqQueList && mcqQueList[activeStep].correct_ans && JSON.parse(mcqQueList[activeStep].correct_ans).length === newChecked.length && multichoiceCompareFunction(JSON.parse(mcqQueList[activeStep].correct_ans), newChecked);
      setChoosenAnswerStatus(anwew);
      const awa = [...selectedOption];
      const ans = {
        id: ql.id,
        answer: newChecked,
        question_type: ql.type_question.id,
      };
      awa[index] = ans;
      setSelectedOption(awa);
    }
  }

  // function handleDrop(ql, marks, index) {
  //   if (ql && ql.type_question && ql.type_question.question_type_name === 'Match The Following') {
  //     const awV = [...selectedValue];
  //     awV[index] = true;
  //     setSelectedValue(awV);
  //     const awa = [...selectedOption];
  //     const ans = {
  //       id: ql.id,
  //       answer: marks,
  //       question_type: ql.type_question.id,
  //     };
  //     const anwew = [...choosenAnswerStatus];
  //     anwew[index] = mcqQueList && mcqQueList.length !== 0 && mcqQueList[activeStep] && mcqQueList[activeStep].question.length === marks;
  //     setChoosenAnswerStatus(anwew);
  //     awa[index] = ans;
  //     setSelectedOption(awa);
  //   }
  // }

  function handleClick(e, ql, index) {
    if (ql && ql.type_question && ql.type_question.question_type_name === 'Single Choice') {
      const awV = [...selectedValue];
      awV[index] = !awV[index];
      setSelectedValue(awV);
      const anwew = [...choosenAnswerStatus];
      anwew[index] = Object.keys(mcqQueList && mcqQueList[activeStep].correct_ans && JSON.parse(`${mcqQueList[activeStep].correct_ans}`))[0] === e.target.value;
      setChoosenAnswerStatus(anwew);
      const awa = [...selectedOption];
      const ans = {
        id: ql.id,
        answer: e.target.value,
        question_type: ql.type_question.id,
      };
      awa[index] = awa[index] ? null : ans;
      setSelectedOption(awa);
      SetinitialValue(e.target.value);
    }

    if (ql && ql.type_question && ql.type_question.question_type_name === 'Choice Table Matrix') {
      const awV = [...selectedValue];
      awV[index] = true;
      setSelectedValue(awV);
      const awa = [...selectedOption];
      const ans = {
        id: ql.id,
        choosen_answer: choiceMatrixAns,
        answers: null,
        question_type: ql.type_question.id,
      };
      awa[index] = awa[index] ? null : ans;
      setSelectedOption(awa);
      SetinitialValue(choiceMatrixAns);
    }

    if (ql && ql.type_question && ql.type_question.question_type_name === 'Multiple Choice') {
      const currentIndex = initialValue.indexOf(e.target.value);
      const newChecked = [...initialValue];
      if (currentIndex === -1) {
        newChecked.push(e.target.value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      SetinitialValue(newChecked);
      const awV = [...selectedValue];
      awV[index] = !(newChecked && newChecked.length === 0);
      setSelectedValue(awV);
      const anwew = [...choosenAnswerStatus];
      anwew[index] = mcqQueList && mcqQueList[activeStep].correct_ans && JSON.parse(mcqQueList[activeStep].correct_ans).length === newChecked.length && multichoiceCompareFunction(JSON.parse(mcqQueList[activeStep].correct_ans), newChecked);
      setChoosenAnswerStatus(anwew);
      const awa = [...selectedOption];
      const ans = {
        id: ql.id,
        answer: newChecked,
        question_type: ql.type_question.id,
      };
      awa[index] = awa[index] ? null : ans;
      setSelectedOption(awa);
    }
  }

  const handleCloseMcqTest = () => {
    setSelectedOption([]);
    SetinitialValue(null);
    setChoiceMatrixAns([]);
    setMcqQuesList([]);
    setMcqTestOpen(false);
    setChoosenAnswerStatus([]);
    setSelectedValue([]);
    setActiveStep(0);
    setQuestionPaperId('');
    setMcqStatus(false);
    setMcqScore('');
    setMcqTestTitle('');
    setQuestionPaperData('');
    setQuestionPaperData('');
    setContentReletedChapterID('');
    setCourseWiseVideoId('');
  };

  useEffect(() => {
    let correctNo = 0;
    const n = choiceMatrixAns && choiceMatrixAns.length;
    for (let i = 0; i < n; i += 1) {
      if ((choiceMatrixAns && choiceMatrixAns[i].correctAnswer) === (mcqQueList && mcqQueList[activeStep] && mcqQueList[activeStep].question[i].correctAnswer)) {
        correctNo += 1;
      }
    }
    if (selectedOption && selectedOption.length !== 0 && selectedOption[activeStep] && selectedOption[activeStep].Choosen_answer) {
      const anwew = [...choosenAnswerStatus];
      anwew[activeStep] = choiceMatrixAns.length === correctNo;
      setChoosenAnswerStatus(anwew);
      setSelectedOption((Information) => {
        const newData = [...Information];
        switch ('answer') {
          case 'answer':
            newData[activeStep].answer = correctNo;
            return newData;
          default:
            return null;
        }
      });
    }
  }, [choiceMatrixAns]);

  // const handleStep = (step) => () => {
  //   setActiveStep(step);
  //   if ((selectedOption && selectedOption[step] && selectedOption[step].answer) || (selectedOption && selectedOption[step] && selectedOption[step].Choosen_answer)) {
  //     SetinitialValue(selectedOption && selectedOption[step] && selectedOption[step].answer);
  //     setChoiceMatrixAns(selectedOption && selectedOption[step] && selectedOption[step].Choosen_answer);
  //   } else {
  //     SetinitialValue([]);
  //     setChoiceMatrixAns([]);
  //     if ((mcqQueList && mcqQueList[step] && mcqQueList[step].type_question.question_type_name === 'Choice Table Matrix')) {
  //       const n = mcqQueList && mcqQueList[step] && mcqQueList[step].question.length;
  //       const array = [];
  //       for (let i = 0; i < n; i += 1) {
  //         array.push({ correctAnswer: null });
  //       }
  //       setChoiceMatrixAns(array);
  //     }
  //   }
  // };

  function handleMatrixMcq(e, optInd, key, ql, index) {
    setChoiceMatrixAns((Info) => {
      const newData = [...Info];
      switch (key) {
        case 'correctAnswer':
          newData[optInd][key] = e;
          return newData;
        default:
          return null;
      }
    });
    const awV = [...selectedValue];
    awV[index] = true;
    setSelectedValue(awV);
    const awa = [...selectedOption];
    const ans = {
      id: ql.id,
      Choosen_answer: choiceMatrixAns,
      answer: null,
      question_type: ql.type_question.id,
    };
    awa[index] = ans;
    setSelectedOption(awa);
  }

  // function handleBack() {
  //   if ((selectedOption && selectedOption[activeStep - 1] && selectedOption[activeStep - 1].answer && selectedOption[activeStep - 1].answer.length !== 0) || (selectedOption && selectedOption[activeStep - 1] && selectedOption[activeStep - 1].Choosen_answer.length !== 0)) {
  //     SetinitialValue(selectedOption && selectedOption[activeStep - 1] && selectedOption[activeStep - 1].answer);
  //     setChoiceMatrixAns(selectedOption && selectedOption[activeStep - 1] && selectedOption[activeStep - 1].Choosen_answer);
  //   } else {
  //     SetinitialValue([]);
  //     setChoiceMatrixAns([]);
  //     if ((mcqQueList && mcqQueList[activeStep - 1] && mcqQueList[activeStep - 1].type_question.question_type_name === 'Choice Table Matrix')) {
  //       const n = mcqQueList && mcqQueList[activeStep - 1] && mcqQueList[activeStep - 1].question.length;
  //       const array = [];
  //       for (let i = 0; i < n; i += 1) {
  //         array.push({ correctAnswer: null });useEffectuseEffect
  //       }
  //       setChoiceMatrixAns(array);
  //     }
  //   }
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // }
  function handleNext(quesLen, stepLen, ql, marks, index, attempted) {
    if (ql && ql.type_question && ql.type_question.question_type_name === 'Match The Following') {
      const awV = [...selectedValue];
      awV[index] = !attempted;
      setSelectedValue(awV);
      const awa = [...selectedOption];
      const ans = {
        id: ql.id,
        answer: marks,
        question_type: ql.type_question.id,
      };
      const anwew = [...choosenAnswerStatus];
      anwew[index] = mcqQueList && mcqQueList.length !== 0 && mcqQueList[activeStep] && mcqQueList[activeStep].question.length === marks;
      setChoosenAnswerStatus(anwew);
      awa[index] = ans;
      setSelectedOption(awa);
    }
    if (((selectedOption && selectedOption[activeStep + 1] && selectedOption[activeStep + 1].answer && selectedOption[activeStep + 1].answer.length !== 0) || (selectedOption && selectedOption[activeStep + 1] && selectedOption[activeStep + 1].Choosen_answer.length !== 0)) && (stepLen < quesLen.length - 1)) {
      SetinitialValue(selectedOption && selectedOption[activeStep + 1] && selectedOption[activeStep + 1].answer);
      setChoiceMatrixAns(selectedOption && selectedOption[activeStep + 1] && selectedOption[activeStep + 1].Choosen_answer);
    } else if (stepLen < quesLen.length - 1) {
      SetinitialValue([]);
      setChoiceMatrixAns([]);
      if ((mcqQueList && mcqQueList[activeStep + 1] && mcqQueList[activeStep + 1].type_question.question_type_name === 'Choice Table Matrix')) {
        const n = mcqQueList && mcqQueList[activeStep + 1] && mcqQueList[activeStep + 1].question.length;
        const array = [];
        for (let i = 0; i < n; i += 1) {
          array.push({ correctAnswer: null });
        }
        setChoiceMatrixAns(array);
      }
    }
    if (stepLen < quesLen.length) {
      console.log('outside next loop', choosenAnswerStatus);
      for(let i = activeStep; i < quesLen.length; i++)
      {
        console.log('Inside next loop', choosenAnswerStatus[i]);
        if(choosenAnswerStatus[i+1] === undefined)
        {
          setActiveStep(i+1);
          break;
        }
      }
      // setActiveStep(activeStep + 1); 
    }
    if (activeStep === quesLen.length - 1) {
      let data;
      if (courseType === 'self_driven') {
        data = {
          question_paper: questionPaperId,
          answers: selectedOption,
          questions: mcqQueList,
          question_paper_response: questionPaperData,
          content_related_chapter: contentRelatedChapterID,
          course_wise_video: courseWiseVideoId,
          is_self_driven: true,
        };
      } else if (courseType === 'is_training_course') {
        data = {
          question_paper: questionPaperId,
          answers: selectedOption,
          questions: mcqQueList,
          question_paper_response: questionPaperData,
          content_related_chapter: contentRelatedChapterID,
          course_wise_video: courseWiseVideoId,
          is_self_driven: true,
          is_training_course: true,
        };
      } else if (courseType === 'triner_driven') {
        data = {
          question_paper: questionPaperId,
          answers: selectedOption,
          questions: mcqQueList,
          question_paper_response: questionPaperData,
          content_related_chapter: contentRelatedChapterID,
          course_wise_video: courseWiseVideoId,
          is_trainer_driven: true,
        };
      } else if (courseType === 'trainer') {
        data = {
          question_paper: questionPaperId,
          answers: selectedOption,
          questions: mcqQueList,
          question_paper_response: questionPaperData,
          content_related_chapter: contentRelatedChapterID,
          course_wise_video: courseWiseVideoId,
          is_trainer: true,
        };
      } else {
        data = {
          question_paper: questionPaperId,
          answers: selectedOption,
          questions: mcqQueList,
          question_paper_response: questionPaperData,
          content_related_chapter: contentRelatedChapterID,
          course_wise_video: courseWiseVideoId,
          is_induction_training: true,
        };
      }

      setloading(true);
      const URL = `${urls.apiToFinishMcqTest}`;
      fetch(URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
          module: localStorage.getItem('Induction_Training')
        },
      })
        .then((res) => {
          if (res.status === 409) {
            setloading(false);
            alert.warning('Test Already Submitted');
          }
          if (res.status === 201) {
            setloading(false);
            alert.success('Test Successfully Submitted');
            mcqSubmitResponse();
            handleCloseMcqTest();
            return res.json();
          }
          if (res.status !== 201 && res.status !== 409) {
            setloading(false);
            alert.warning('somthing went wrong please try again ');
          }
          return 0;
        });
    }
  }


  //submit event for exame
  function handleSubmit(quesLen, stepLen, ql, marks, index, attempted) {
    if (ql && ql.type_question && ql.type_question.question_type_name === 'Match The Following') {
      const awV = [...selectedValue];
      awV[index] = !attempted;
      setSelectedValue(awV);
      const awa = [...selectedOption];
      const ans = {
        id: ql.id,
        answer: marks,
        question_type: ql.type_question.id,
      };
      const anwew = [...choosenAnswerStatus];
      anwew[index] = mcqQueList && mcqQueList.length !== 0 && mcqQueList[activeStep] && mcqQueList[activeStep].question.length === marks;
      setChoosenAnswerStatus(anwew);
      awa[index] = ans;
      setSelectedOption(awa);
    }
    if (((selectedOption && selectedOption[activeStep + 1] && selectedOption[activeStep + 1].answer && selectedOption[activeStep + 1].answer.length !== 0) || (selectedOption && selectedOption[activeStep + 1] && selectedOption[activeStep + 1].Choosen_answer.length !== 0)) && (stepLen < quesLen.length - 1)) {
      SetinitialValue(selectedOption && selectedOption[activeStep + 1] && selectedOption[activeStep + 1].answer);
      setChoiceMatrixAns(selectedOption && selectedOption[activeStep + 1] && selectedOption[activeStep + 1].Choosen_answer);
    } else if (stepLen < quesLen.length - 1) {
      SetinitialValue([]);
      setChoiceMatrixAns([]);
      if ((mcqQueList && mcqQueList[activeStep + 1] && mcqQueList[activeStep + 1].type_question.question_type_name === 'Choice Table Matrix')) {
        const n = mcqQueList && mcqQueList[activeStep + 1] && mcqQueList[activeStep + 1].question.length;
        const array = [];
        for (let i = 0; i < n; i += 1) {
          array.push({ correctAnswer: null });
        }
        setChoiceMatrixAns(array);
      }
    }
    if (stepLen < quesLen.length) {
      console.log('outside next loop', choosenAnswerStatus);
      for(let i = activeStep; i < quesLen.length; i++)
      {
        console.log('Inside next loop', choosenAnswerStatus[i]);
        if(choosenAnswerStatus[i+1] === undefined)
        {
          setActiveStep(i+1);
          break;
        }
      }
      // setActiveStep(activeStep + 1); 
    }
    if (true) {
      let data;
      if (courseType === 'self_driven') {
        data = {
          question_paper: questionPaperId,
          answers: selectedOption,
          questions: mcqQueList,
          question_paper_response: questionPaperData,
          content_related_chapter: contentRelatedChapterID,
          course_wise_video: courseWiseVideoId,
          is_self_driven: true,
        };
      } else if (courseType === 'is_training_course') {
        data = {
          question_paper: questionPaperId,
          answers: selectedOption,
          questions: mcqQueList,
          question_paper_response: questionPaperData,
          content_related_chapter: contentRelatedChapterID,
          course_wise_video: courseWiseVideoId,
          is_self_driven: true,
          is_training_course: true,
        };
      } else if (courseType === 'triner_driven') {
        data = {
          question_paper: questionPaperId,
          answers: selectedOption,
          questions: mcqQueList,
          question_paper_response: questionPaperData,
          content_related_chapter: contentRelatedChapterID,
          course_wise_video: courseWiseVideoId,
          is_trainer_driven: true,
        };
      } else if (courseType === 'trainer') {
        data = {
          question_paper: questionPaperId,
          answers: selectedOption,
          questions: mcqQueList,
          question_paper_response: questionPaperData,
          content_related_chapter: contentRelatedChapterID,
          course_wise_video: courseWiseVideoId,
          is_trainer: true,
        };
      } else {
        data = {
          question_paper: questionPaperId,
          answers: selectedOption,
          questions: mcqQueList,
          question_paper_response: questionPaperData,
          content_related_chapter: contentRelatedChapterID,
          course_wise_video: courseWiseVideoId,
          is_induction_training: true,
        };
      }

      setloading(true);
      const URL = `${urls.apiToFinishMcqTest}`;
      fetch(URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
          module: localStorage.getItem('Induction_Training')
        },
      })
        .then((res) => {
          if (res.status === 409) {
            setloading(false);
            alert.warning('Test Already Submitted');
          }
          if (res.status === 400) {
            setloading(false);
            alert.warning('You have not cleared MCQ test please try again');
            // mcqSubmitResponse();
            handleCloseMcqTest();
            return res.json();
          }
          if (res.status === 201) {
            setloading(false);
            alert.success('Test Successfully Submitted');
            mcqSubmitResponse();
            handleCloseMcqTest();
            return res.json();
          }
          if (res.status !== 201 && res.status !== 409) {
            setloading(false);
            alert.warning('somthing went wrong please try again ');
          }
          return 0;
        });
    }
  }

  function handleTab(quesLen, stepLen, ql, marks, index, attempted) {
    count=0;
    if (ql && ql.type_question && ql.type_question.question_type_name === 'Match The Following') {
      const awV = [...selectedValue];
      awV[index] = !attempted;
      setSelectedValue(awV);
      const awa = [...selectedOption];
      const ans = {
        id: ql.id,
        answer: marks,
        question_type: ql.type_question.id,
      };
      const anwew = [...choosenAnswerStatus];
      anwew[index] = mcqQueList && mcqQueList.length !== 0 && mcqQueList[activeStep] && mcqQueList[activeStep].question.length === marks;
      setChoosenAnswerStatus(anwew);
      awa[index] = ans;
      setSelectedOption(awa);
    }
    if (((selectedOption && selectedOption[activeStep + 1] && selectedOption[activeStep + 1].answer && selectedOption[activeStep + 1].answer.length !== 0) || (selectedOption && selectedOption[activeStep + 1] && selectedOption[activeStep + 1].Choosen_answer.length !== 0)) && (stepLen < quesLen.length - 1)) {
      SetinitialValue(selectedOption && selectedOption[activeStep + 1] && selectedOption[activeStep + 1].answer);
      setChoiceMatrixAns(selectedOption && selectedOption[activeStep + 1] && selectedOption[activeStep + 1].Choosen_answer);
    } else if (stepLen < quesLen.length - 1) {
      SetinitialValue([]);
      setChoiceMatrixAns([]);
      if ((mcqQueList && mcqQueList[activeStep + 1] && mcqQueList[activeStep + 1].type_question.question_type_name === 'Choice Table Matrix')) {
        const n = mcqQueList && mcqQueList[activeStep + 1] && mcqQueList[activeStep + 1].question.length;
        const array = [];
        for (let i = 0; i < n; i += 1) {
          array.push({ correctAnswer: null });
        }
        setChoiceMatrixAns(array);
      }
    }
    if (stepLen < quesLen.length ) {
      // setActiveStep((prevActiveStep) => prevActiveStep + 1);
      for(let i = activeStep; i < quesLen.length; i++)
      {
        console.log('Inside next loop', choosenAnswerStatus[i]);
        if(choosenAnswerStatus[index] === undefined)
        {
          setActiveStep(index);
          break;
        }
      }
    }
  }

  function getStepContent(stepIndex, len) {
    // console.log('ids',stepIndex, 'inductionlen',len)
    if (stepIndex < len) {
      switch (stepIndex) {
        case stepIndex:
          return (
            <Grid container spacing={2} id={stepIndex + 280}>
              <Grid item md={12} xs={12} style={{ textAlign: 'center', color: 'blue' }}>
                <Typography variant="h5">
                  {(mcqQueList && mcqQueList[stepIndex] && mcqQueList[stepIndex].type_question.question_type_name) || ''}
                </Typography>
              </Grid>
              <Grid item md={12} xs={12} id={stepIndex + 480}>
                <Typography variant="h6">
                  {stepIndex + 1}
                  {' '}
                  {ReactHtmlParser(mcqQueList && mcqQueList[stepIndex] && mcqQueList[stepIndex].question[0].mcqQuestion)}
                  {ReactHtmlParser(mcqQueList && mcqQueList[stepIndex] && mcqQueList[stepIndex].choice_table_matrix_question_title) || ''}
                </Typography>
              </Grid>
              {mcqQueList && mcqQueList[stepIndex].type_question && mcqQueList[stepIndex].type_question.question_type_name === 'Single Choice' && (
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <FormLabel component="legend">
                      Choose Correct Answer :
                    </FormLabel>
                    <RadioGroup
                      style={{ marginTop: '20px' }}
                      aria-label="Answer"
                      name="Answer"
                      value={initialValue && typeof initialValue === 'string' ? initialValue : false}
                      onChange={(e) => handleChange(e, mcqQueList[stepIndex], stepIndex)}
                      onClick={(e) => handleClick(e, mcqQueList[stepIndex], stepIndex)}
                    >
                      <Grid container spacing={5}>
                        <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                          <FormControlLabel
                            value="option1"
                            control={<Radio color="primary" />}
                            label={ReactHtmlParser(mcqQueList && mcqQueList[stepIndex] && mcqQueList[stepIndex].question[0].option1)}
                            labelPlacement="end"
                          />
                        </Grid>
                        <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                          <FormControlLabel
                            value="option2"
                            control={<Radio color="primary" />}
                            label={ReactHtmlParser(mcqQueList && mcqQueList[stepIndex] && mcqQueList[stepIndex].question[0].option2)}
                            labelPlacement="end"
                          />
                        </Grid>
                        <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                          <FormControlLabel
                            value="option3"
                            control={<Radio color="primary" />}
                            label={ReactHtmlParser(mcqQueList && mcqQueList[stepIndex] && mcqQueList[stepIndex].question[0].option3)}
                            labelPlacement="end"
                          />
                        </Grid>
                        <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                          <FormControlLabel
                            value="option4"
                            control={<Radio color="primary" />}
                            label={ReactHtmlParser(mcqQueList && mcqQueList[stepIndex] && mcqQueList[stepIndex].question[0].option4)}
                            labelPlacement="end"
                          />
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              )}
              {mcqQueList && mcqQueList[stepIndex].type_question && mcqQueList[stepIndex].type_question.question_type_name === 'Multiple Choice' && (
              <Grid item md={12} xs={12}>
                <Grid item md={12} xs={12}>
                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <FormLabel component="legend">
                      Choose Correct Answer :
                    </FormLabel>

                    <FormGroup style={{ marginTop: '20px' }}>
                      <Grid container spacing={5}>
                        <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                          <FormControlLabel
                            control={(
                              <Checkbox
                                color="primary"
                                checked={initialValue && initialValue.some((element) => element === 'option1')}
                                onChange={(e) => handleChange(e, mcqQueList[stepIndex], stepIndex)}
                                onClick={(e) => handleClick(e, mcqQueList[stepIndex], stepIndex)}
                                value="option1"
                              />
                              )}
                            label={ReactHtmlParser(mcqQueList && mcqQueList[stepIndex] && mcqQueList[stepIndex].question[0].option1)}
                          />
                        </Grid>
                        <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                          <FormControlLabel
                            control={(
                              <Checkbox
                                color="primary"
                                checked={initialValue && initialValue.some((element) => element === 'option2')}
                                onChange={(e) => handleChange(e, mcqQueList[stepIndex], stepIndex)}
                                onClick={(e) => handleClick(e, mcqQueList[stepIndex], stepIndex)}
                                value="option2"
                              />
                              )}
                            label={ReactHtmlParser(mcqQueList && mcqQueList[stepIndex] && mcqQueList[stepIndex].question[0].option2)}
                          />
                        </Grid>
                        <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                          <FormControlLabel
                            control={(
                              <Checkbox
                                color="primary"
                                checked={initialValue && initialValue.some((element) => element === 'option3')}
                                onChange={(e) => handleChange(e, mcqQueList[stepIndex], stepIndex)}
                                onClick={(e) => handleClick(e, mcqQueList[stepIndex], stepIndex)}
                                value="option3"
                              />
                              )}
                            label={ReactHtmlParser(mcqQueList && mcqQueList[stepIndex] && mcqQueList[stepIndex].question[0].option3)}
                          />
                        </Grid>
                        <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                          <FormControlLabel
                            control={(
                              <Checkbox
                                color="primary"
                                checked={initialValue && initialValue.some((element) => element === 'option4')}
                                onChange={(e) => handleChange(e, mcqQueList[stepIndex], stepIndex)}
                                onClick={(e) => handleClick(e, mcqQueList[stepIndex], stepIndex)}
                                value="option4"
                              />
                              )}
                            label={ReactHtmlParser(mcqQueList && mcqQueList[stepIndex] && mcqQueList[stepIndex].question[0].option4)}
                          />
                        </Grid>
                      </Grid>
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
              )}
              {mcqQueList && mcqQueList[stepIndex].type_question && mcqQueList[stepIndex].type_question.question_type_name === 'Choice Table Matrix' && (
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <Box border={1} className={classes.box}>
                    <Table>
                      {mcqQueList[stepIndex].question && mcqQueList[stepIndex].question.length !== 0 && mcqQueList[stepIndex].question.map((item, index) => (
                        <TableBody key={index}>
                          <TableRow>
                            <TableCell>{item.choice}</TableCell>
                            {item && item.optionsArray && item.optionsArray.length !== 0 && item.optionsArray.map((itemData, OptionIndex) => (
                              <TableCell key={OptionIndex}>
                                <Radio
                                  checked={!!(itemData.option === (choiceMatrixAns && choiceMatrixAns.length !== 0 && choiceMatrixAns[index].correctAnswer && choiceMatrixAns[index].correctAnswer))}
                                  onChange={(e) => handleMatrixMcq(e.target.value, index, 'correctAnswer', mcqQueList[stepIndex], stepIndex)}
                                  onClick={(e) => handleClick(e, mcqQueList[stepIndex], stepIndex)}
                                  value={itemData.option}
                                  color="primary"
                                  name="radio-button-demo"
                                  inputProps={{ 'aria-label': 'B' }}
                                />
                                {itemData.option}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      ))}
                    </Table>
                  </Box>
                </Grid>
              </Grid>
              )}
              {mcqQueList && mcqQueList[stepIndex].type_question && mcqQueList[stepIndex].type_question.question_type_name === 'Match The Following' && (
              <div style={{ width: '100%' }} id={stepIndex}>
                <MatchTheFollowing
                  receivedArray={mcqQueList[stepIndex].question}
                  totalArray={mcqQueList[stepIndex]}
                  stepIndex={stepIndex}
                  id={stepIndex + 100}
                  propFunc={handleNext}
                  totalQuestionArray={mcqQueList}
                  activeStepId={activeStep}
                />
              </div>
              )}
            </Grid>
          );
        default:
          return 'Uknown stepIndex';
      }
    } else {
      return ' ';
    }
  }

  function QontoStepIcon(props, i) {
    // eslint-disable-next-line react/prop-types
    const { active, completed } = props;
    return (
      <div className={clsx(classes.rootS, { [classes.active]: active })}>
        {(completed && choosenAnswerStatus[i] && selectedValue[i] &&<CheckCircleOutlineIcon className={classes.completed} />) || (completed && !choosenAnswerStatus[i] && selectedValue[i] &&<HighlightOffIcon className={classes.wrong} />) || <div className={classes.circle} />}
      </div>
    );
  }

  const FunctionToTakeMcqTest = () => {
    let modal = null;
    modal = (
      <>
        <Dialog
          fullWidth
          maxWidth="xl"
          open={mcqTestOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className={classes.mcqmodal}
        >
          <DialogTitle id="alert-dialog-title" onClose={handleCloseMcqTest}>
            Mcq Test 
          </DialogTitle>
          <Divider />
          {mcqQueList && mcqQueList.length === 0 && mcqStatus === undefined && (
            <DialogContent>
              <Typography
                variant="h4"
                style={{ color: 'blue', textAlign: 'center' }}
              >
                {' '}
                No Questions Found
              </Typography>
            </DialogContent>
          )}
          {mcqStatus === true
            && (
            <DialogContent>
              <Typography
                variant="h5"
                style={{ color: 'black', textAlign: 'center' }}
              >
                Test On :
                <span style={{ color: 'blue' }}>{` ${mcqTestTitle} `}</span>
              </Typography>
              <Typography
                variant="h5"
                style={{ color: 'black', textAlign: 'center' }}
              >
                Marks Scored:
                <span style={{ color: 'blue' }}>
                  {` ${mcqScore} % `}
                </span>
              </Typography>
            </DialogContent>
            )}
          {mcqQueList && mcqQueList.length !== 0 && mcqStatus === undefined && (
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12} className={classes.paperMain}>
                  <Card className={classes.card}>
                    <Stepper alternativeLabel activeStep={activeStep} >
                      {mcqQueList
                        && mcqQueList.length
                        && mcqQueList.map((label, i) => (
                          <Step key={label.id} onClick = {() => handleTab(mcqQueList, activeStep, mcqQueList.id,'',i)}>
                            <StepLabel StepIconComponent={(props) => QontoStepIcon(props, i)}>
                              <Typography variant="h5" className={activeStep === i ? classes.stepBtn : ''}>{i + 1}</Typography>
                            </StepLabel>
                          </Step>
                        ))}
                    </Stepper>
                  </Card>
                </Grid>
                <Grid item md={12} xs={12}>
                  {getStepContent(activeStep, mcqQueList.length)}
                </Grid>
                <Grid container spacing={2}>
                  {/* <Grid item md={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ margin: '10px' }}
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.backButton}
                    >
                      Back
                    </Button>
                  </Grid> */}
                  {mcqQueList && mcqQueList.length !== 0 && mcqQueList[activeStep] && mcqQueList[activeStep].type_question && mcqQueList[activeStep].type_question.question_type_name !== 'Match The Following'
                  && (

                  <Grid item md={12}>
                  {activeStep !== mcqQueList.length - 1 ?
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        margin: '10px',
                        // float: activeStep === mcqQueList.length - 1 ? 'right' : 'right',
                        float : 'right'
                        
                      }}
                      onClick={() => handleNext(mcqQueList, activeStep, mcqQueList.id)}
                    >
                      {/* {activeStep === mcqQueList.length - 1 ? 'Finish' : 'Next'} */}
                      Next
                    </Button>
                    :null}

                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        margin: '10px',
                        float: 'left',
                        float: activeStep === mcqQueList.length - 1 ? 'right' : 'left',
                      }}
                      onClick={() => handleSubmit(mcqQueList, activeStep, mcqQueList.id)}
                    >
                      {/* {activeStep === mcqQueList.length - 1 ? 'Finish' : 'Next'} */}
                      Finish
                    </Button>
                  </Grid>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
          )}
        </Dialog>
      </>
    );
    return modal;
  };

  function shuffle(array) {
    if (array && array.length !== 0) {
      let currentIndex = array && array.length; let temporaryValue; let
        randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        return array;
      }
    }
    return [];
  }
  function functionToOpenToTakeMcqTest(mcqFile, title, Id, status, score, questionPaperDetails, coueseWiseId, contenWiseId) {
    setQuestionPaperId(Id);
    setChoosenAnswerStatus([]);
    setSelectedValue([]);
    setActiveStep(0);
    setMcqQuesList(shuffle(mcqFile));
    setMcqTestOpen(true);
    setMcqStatus(status);
    setMcqTestTitle(title);
    setMcqScore(score);
    setQuestionPaperData(questionPaperDetails);
    setContentReletedChapterID(contenWiseId);
    setCourseWiseVideoId(coueseWiseId);
  }

  useEffect(() => {
    if (mcqQueList) {
      if (mcqQueList && mcqQueList[0] && mcqQueList[0].type_question.question_type_name === 'Choice Table Matrix') {
        const n = mcqQueList && mcqQueList[0] && mcqQueList[0].question.length;
        const array = [];
        for (let i = 0; i < n; i += 1) {
          array.push({ correctAnswer: null });
        }
        setChoiceMatrixAns(array);
      }
    }
  }, [mcqQueList]);

  const HandleCloseReview = () => {
    setReviewOpen(false);
    setContentReleratedId('');
    setAssessmentReviewFile([]);
    setAssessmentId('');
    setAssessmentQuestonFile('');
    setAssessmentTitle('');
  };

  function functionToSubmitReview() {
    if (!assessmentReviewFile || assessmentReviewFile.length === 0) {
      alert.warning('upload Review File');
      return;
    }
    const formData = new FormData();
    formData.append('course_wise_video', AssessmentId);
    assessmentReviewFile.forEach((file) => {
      formData.append('answer_file', file);
    });
    formData.append('question_file', assessmentQuestionFile);
    formData.append('content_related_chapter', contentReleratedId);

    if (courseType === 'self_driven') {
      formData.append('is_self_driven', 'true');
    } else if (courseType === 'is_training_course') {
      formData.append('is_training_course', 'true');
    } else if (courseType === 'triner_driven') {
      formData.append('is_trainer_driven', 'true');
    } else if (courseType === 'trainer') {
      formData.append('is_trainer', 'true');
    } else {
      formData.append('is_induction_training', 'true');
    }
    setloading(true);
    fetch(`${urls.AssessmentReviewApi}?${courseType}=true`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
          module: localStorage.getItem('Induction_Training')
      },
    }).then((res) => {
      if (res.status === 201 || res.status === 200) {
        setloading(false);
        HandleCloseReview();
        mcqSubmitResponse();
        alert.success('Review Uploaded successfully');
        return res.json();
      }
      if (res.status === 409) {
        setloading(false);
        alert.warning('Review Already Submitted');
        return res.json();
      }
      if (res.status !== 201 && res.status !== 409) {
        setloading(false);
        alert.warning('somthing went wrong please try again ');
      }
      return 0;
    });
  }
  function handleZipFile(data) {
    if (Object.values(data).map((item) => (((item.type === 'image/jpeg') || (item.type === 'image/png')))).filter((INFO) => INFO === false).length === 0) {
      setAssessmentReviewFile((prevVal) => [...prevVal, ...data]);
    } else {
      alert.warning('Select only Images of png and jpeg formate only');
    }
  }
  function handleRemoveFile(data) {
    const array = [];
    Object.values(assessmentReviewFile).map((item) => {
      if (item.name !== data.name) {
        array.push(item);
      }
      return array;
    });
    setAssessmentReviewFile(array);
  }
  function handleRemoveUploadedFile(data) {
    const params = {
      answer_id: data.id,
      is_delete: true,
    };
    axios
      .put(`${urls.assessmentUpdate}`, JSON.stringify(params), {
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
          module: localStorage.getItem('Induction_Training')
        },
      }).then((res) => {
        if (res.status === 200) {
          alert.warning('Deleted Successfully');
          let URL;
          if (((auth.personal_info && auth.personal_info.role === 'AcademicHeads') || (auth.personal_info && auth.personal_info.role === 'Planner') || (auth.personal_info && auth.personal_info.role === 'Coordinator') || (auth.personal_info && auth.personal_info.role === 'AcademicManager') || (auth.personal_info && auth.personal_info.role === 'Principal') || (auth.personal_info && auth.personal_info.role === 'LeadTeacher')) && courseType === 'trainer') {
            URL = `${urls.inHouseModules}?content_id=${contentIdInformation}&course_instance_id=${courseId}&${courseType}=true&class_id=${classIdNoInformation}`;
          } else {
            URL = `${urls.inHouseModules}?content_id=${contentIdInformation}&course_instance_id=${courseId}&${courseType}=true`;
          }
          fetchTrainerLessons({
            url: URL,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.personal_info.token}`,
          module: localStorage.getItem('Induction_Training')
            },
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    console.log(assessmentReviewFile);
  }

  function handleEditUploadedFile(data, fileID) {
    console.log(fileID);
    setloading(true);
    const formData = new FormData();
    formData.append('answer_id', fileID);
    formData.append('answer_file', data[0]);
    axios
      .put(`${urls.assessmentUpdate}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
          module: localStorage.getItem('Induction_Training')
        },
      }).then((res) => {
        // eslint-disable-next-line no-empty
        if (res.status === 200) {
          let URL;
          if (((auth.personal_info && auth.personal_info.role === 'AcademicHeads') || (auth.personal_info && auth.personal_info.role === 'Planner') || (auth.personal_info && auth.personal_info.role === 'Coordinator') || (auth.personal_info && auth.personal_info.role === 'AcademicManager') || (auth.personal_info && auth.personal_info.role === 'Principal') || (auth.personal_info && auth.personal_info.role === 'LeadTeacher')) && courseType === 'trainer') {
            URL = `${urls.inHouseModules}?content_id=${contentIdInformation}&course_instance_id=${courseId}&${courseType}=true&class_id=${classIdNoInformation}`;
          } else {
            URL = `${urls.inHouseModules}?content_id=${contentIdInformation}&course_instance_id=${courseId}&${courseType}=true`;
          }
          fetchTrainerLessons({
            url: URL,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.personal_info.token}`,
          module: localStorage.getItem('Induction_Training')
            },
          });
        }
        setloading(false);
        alert.success('Replaced Image Successfully');
      }).catch((err) => {
        alert.warning(err);
      });
  }
  function handleEditZipFile(data, fileID) {
    if (Object.values(data).map((item) => (((item.type === 'image/jpeg') || (item.type === 'image/png')))).filter((INFO) => INFO === false).length === 0) {
      handleEditUploadedFile(data, fileID);
    } else {
      alert.warning('Select only Images of png and jpeg formate only');
    }
  }

  const reviewAssessmentModel = () => {
    let review = null;
    review = (
      <Dialog
        fullWidth
        maxWidth="md"
        open={openReview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.mcqmodal}
      >
        <DialogTitle id="alert-dialog-title" onClose={HandleCloseReview}>
          {`Assessment Review for ${assessmentTitle}`}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <input
                style={{ display: 'none' }}
                className={classes.fileUpload}
                multiple
                id="outlined-button-file"
                type="file"
                accept=".jpeg, .png"
                onChange={(e) => handleZipFile(e.target.files)}
              />
              <label htmlFor="outlined-button-file">
                <Button
                  variant="outlined"
                  color="primary"
                  component="span"
                  className={classes.fileUpload}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Images
                </Button>
              </label>
            </Grid>
            <Grid item md={12} xs={12}>
              <Grid container spacing={2}>
                {Object.values(assessmentReviewFile).map(
                  (item) => (
                    <Grid item md={3} xs={12} key={item}>
                      <Grid container spacing={1}>
                        <Grid item md={12} xs={12}>
                          <Box border={2}>
                            <div className="container">
                              <img className="image" src={window.URL.createObjectURL(item)} alt="crash" height="350" width="350px" />
                              <div className="middle">
                                <div className="text"><IconButton size="small" variant="contained" color="secondary" onClick={() => handleRemoveFile(item)}><DeleteIcon /></IconButton></div>
                              </div>
                            </div>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  ),
                )}
              </Grid>
            </Grid>
            <Grid item md={12} xs={12}>
              <Button variant="contained" color="primary" onClick={() => functionToSubmitReview()}>Submit</Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
    return review;
  };
  function openReviewModel(id, title, contentIdInfo, quesstionFile) {
    setAssessmentId(id);
    setReviewOpen(true);
    setAssessmentQuestonFile(quesstionFile);
    setContentReleratedId(contentIdInfo);
    setAssessmentTitle(title);
  }

  const showMcqButton = (mcqFile, title, questionPaperid, status, score, questionPaperDetails, coueseWiseId, contenWiseId) => {
    let MCQTESTBUTTON = null;
    MCQTESTBUTTON = (
      <>
        <Grid container spacing={2} style={{ padding: '20px', paddingTop: '70px' }}>
          <Grid item md={12} xs={12}>
            <Box border={1} style={{ padding: '20px', borderColor: 'lightgray' }}>
              <Grid container spacing={2} className={classes.Mcqgrid}>
                <Grid item md={1} />
                <Grid item md={10} xs={12}>
                  <Typography variant="h5">
                    {status ? 'View Mcq Test Score on' : 'Press the Below Button to Take Test on'}
                    {' '}
                    <b style={{ color: 'blue' }}>{title}</b>
                  </Typography>
                  <Divider className={classes.divider} />
                </Grid>
                <Grid item md={1} />
                <Grid item md={1} />
                <Grid item md={10} xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => functionToOpenToTakeMcqTest(mcqFile, title, questionPaperid, status, score, questionPaperDetails, coueseWiseId, contenWiseId)}
                  >
                    {status ? 'View Score' : ' Take Mcq Test'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </>
    );
    return MCQTESTBUTTON;
  };

  const videoPlay = (file, title) => {
    let play = null;
    play = (
      <>
        <VideoModel file={file} title={title} />
      </>
    );
    return play;
  };

  const showImage = (imageFile, title, pdfLinks, downloadabl) => {
    let text = null;
    text = (
      <>
        <ViewPdfModel imageFile={imageFile} title={title} pdfLinks={pdfLinks} downloadabl={downloadabl} currentIndux={curretnIndex} />
      </>
    );
    return text;
  };
  const handleOpen = (id) => {
    setOpen(true);
    setModalID(id);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const multipleUpload = (FileAssessment, title, id, contentReleatedId, status, downloadable, message, dueDate, marksScored) => {
    let multiple = null;
    let isDelete = false;
    isDelete = marksScored.every((item) => (
      item.answer_file.every((file) => file.is_delete === true)));
    multiple = (
      <>
        {!isDelete && marksScored.length !== 0
          ? (
            <Button variant="outlined" onClick={(event) => handleOpen(id, event)}>
              View Uploaded Files
            </Button>
          )
          : ''}
        {status === true && dueDate === true && (
          <>
            {marksScored.length === 0 ? <span style={{ color: 'Black' }}>Upload Assessment Review : </span> : ''}
            <Button color="primary" onClick={() => openReviewModel(id, title, contentReleatedId, FileAssessment)}>{!isDelete && marksScored.length !== 0 ? 'Click Here to ReUpload' : 'Click to Upload' }</Button>
          </>
        )}
        {id === ModalID
                      && (
                      <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                      >
                        <Fade in={open}>
                          <div key={id} id={id} className={classes.paper2}>
                            {/* <Typography align="center"> Click to View </Typography> */}
                            <Grid item md={12} xs={12}>
                              <Grid container spacing={2}>
                                {marksScored && marksScored.map((item) => (
                                  item.answer_file.map((file) => (
                                    !file.is_delete
                                      ? (
                                        <>
                                          <Grid item sm={6} xs={3}>
                                            <div className="container">
                                              <img
                                                // className="image"
                                                className="fileUploadImg"
                                                src={file.answer_file}
                                                alt="crash"
                                              />
                                              <div className="middle">
                                                <div className="text"><IconButton size="small" variant="contained" color="secondary" onClick={() => handleRemoveUploadedFile(file)}><DeleteIcon /></IconButton></div>
                                                <input
                                                  style={{ display: 'none' }}
                                                  className={classes.fileUpload}
                                                  multiple
                                                  id={file.id}
                                                  type="file"
                                                  accept=".jpeg, .png"
                                                  onChange={(e) => handleEditZipFile(e.target.files, file.id)}
                                                />
                                                <label htmlFor={file.id}>
                                                  <IconButton
                                                    variant="outlined"
                                                    color="primary"
                                                    component="span"
                                                    className={classes.fileUpload}
                                                  >
                                                    <EditIcon />
                                                  </IconButton>
                                                </label>
                                                {/* <div className="text"><IconButton size="small" variant="contained" color="secondary" onClick={() => handleEditUploadedFile(file)}><EditIcon /></IconButton></div> */}
                                              </div>
                                            </div>
                                            {/* <a href={file.answer_file}>
                                        <img src={file.answer_file} className="fileUploadImg" alt="Not available" />
                                      </a> */}
                                          </Grid>
                                        </>
                                      )
                                      : ''
                                  ))
                                ))}
                              </Grid>
                            </Grid>
                            <Button variant="outlined" onClick={handleClose}>Close</Button>
                          </div>
                        </Fade>
                      </Modal>
                      )}
      </>
    );
    return multiple;
  };
  const assiessmentDisplay = (FileAssessment, title, id, contentReleatedId, status, downloadable, message, dueDate, marksScored) => {
    let assiessmentFile = null;
    assiessmentFile = (
      <>
        <Grid container spacing={2} style={{ padding: '20px', paddingTop: '70px' }}>
          <Grid item md={12} xs={12}>
            <Box border={1} style={{ padding: '20px', borderColor: 'lightgray' }}>
              <Grid container spacing={2}>
                <Grid item md={1} />
                <Grid item md={10} xs={12}>
                  <Typography variant="h5">{title}</Typography>
                  <Divider className={classes.divider} />
                </Grid>
                <Grid item md={1} />
                <Grid item md={1} />
                <Grid item md={10} xs={12}>
                  <Grid item md={12} xs={12} style={{ margin: '12px 0px' }}>
                    <iframe
                      title="myFrame"
                      src={`${FileAssessment}#toolbar=0`}
                      style={{ width: '100%', height: '700px', frameborder: '0' }}
                      alt="PDF file is crashed"
                    />
                  </Grid>
                  {downloadable
                    && (
                    <Grid item md={12} xs={12} style={{ textAlign: 'center', padding: '5px' }}>
                      <Typography variant="h6">
                        Click Hear to Download Assignment file &nbsp;
                        <a href={FileAssessment} target="_blank" rel="noopener noreferrer">Download File</a>
                      </Typography>
                    </Grid>
                    )}
                </Grid>
                {message
                  && (
                  <Grid item md={12} xs={12} style={{ textAlign: 'center', padding: '5px' }}>
                    <Typography style={{ color: 'red' }} variant="h6">{message || ''}</Typography>
                  </Grid>
                  )}
                {status === true
                  && (
                  <Grid item md={12} xs={12} style={{ textAlign: 'center', fontSize: '20px' }}>
                    <Typography style={{ color: 'blue' }} variant="h5">
                      {marksScored && typeof (marksScored) === 'number' ? `Marks Scored - ${marksScored}` : (
                        // <>
                        //   <Button variant="outlined" onClick={(event) => handleOpen(id, event)}>
                        //     View Uploaded Files
                        //   </Button>
                        //   {status === true && dueDate === true && (
                        //   <Button color="primary" onClick={() => openReviewModel(id, title, contentReleatedId, FileAssessment)}>Click Here to ReUpload</Button>
                        //   )}
                        // </>
                        multipleUpload(FileAssessment, title, id, contentReleatedId, status, downloadable, message, dueDate, marksScored)
                      )}
                    </Typography>
                  </Grid>
                  )}
                {status === false && dueDate === true
                  && (
                  <Grid item md={12} xs={12} style={{ textAlign: 'center', fontSize: '20px' }}>
                    <span>Upload Assessment Review : </span>
                    <Button color="primary" onClick={() => openReviewModel(id, title, contentReleatedId, FileAssessment)}>Click Here</Button>
                  </Grid>
                  )}
                <Divider className={classes.divider} />
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </>
    );
    return assiessmentFile;
  };

  const textDisplay = (document, title) => {
    let text = null;
    text = (
      <>
        <TextModel document={document} title={title} />
      </>
    );
    return text;
  };

  const renderData = () => {
    let showChapters = null;
    showChapters = (
      <>
        {currentChapter && currentChapter.length !== 0
          && currentChapter.map((index, Id) => (
            <React.Fragment key={Id}>
              <Grid container spacing={1}>
                <Grid item md={12} xs={12}>
                  {index && index.content_type === 'Video' ? videoPlay(index.file, index.title) : ''}
                  {index && index.content_type === 'Text' ? textDisplay(index.description, index.title) : ''}
                  {index && index.content_type === 'File' ? showImage(index.file, index.title, index.ppt_page_links, index.is_download) : ''}
                  {index && index.content_type === 'Assignment' ? assiessmentDisplay(index.file, index.title, index.id, index.content_related_chapter, index.assessment_status, index.is_download, index.due_status_message, index.due_status, index.marks_scored) : ''}
                  {index && index.content_type === 'McqTest' ? showMcqButton(index.chapter_wise_mcq, index.title, index.question_paper.id, index.quiz_status, index.marks_scored, index.question_paper, index.id, index.content_related_chapter) : ''}
                </Grid>
              </Grid>
            </React.Fragment>
          ))}
      </>
    );
    return showChapters;
  };

  const onNextHandler = () => {
    window.scrollTo(0, 0);
    if (curretnIndex === 0) {
      if (auth.personal_info.role === 'Teacher' && (courseType === 'is_training_course' || courseType === 'self_driven')) {
        history.push('/teacherDashboard/lessons');
      } else {
        history.push('/lessons');
      }
    } else {
      setCurrentChapter(fullData[curretnIndex - 1].course_wise_videos);
      setCurrentIndex((prev) => prev - 1);
      setContentId(nextData[curretnIndex - 1].id || 0);
      setCOurseContentId(nextData[curretnIndex - 1].course_content);
    }
  };

  const backToCourseEnrol = () => {
    if (auth.personal_info.role === 'Teacher' && (courseType === 'is_training_course' || courseType === 'self_driven')) {
      history.push('/teacherDashboard/lessons');
    } else {
      history.push('/lessons');
    }
  };

  let loader = null;
  if (loading || gettingTrainingLessons) {
    loader = <Loader open />;
  }
  return (
    <main className={classes.contentStyle}>
      <Grid container style={{ paddingTop: '50px' }}>
        <Grid item md={1} xs={1} />
        <Grid item md={10} xs={10}>
          <Paper className={classes.paper}>
            <Grid container spacing={2}>
              <Grid item md={10} xs={6}>
                <Typography
                  variant="h4"
                  styles={{ color: 'white' }}
                  className={classes.typographyPadding}
                >
                  Chapter Content
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ float: 'right' }}
                  onClick={backToCourseEnrol}
                >
                  <ArrowBackIcon style={{ color: 'white', paddingRight: '5px' }} />
                  GO TO STEP
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item md={1} />
        <Grid item md={10} xs={12}>
          <Box border={2} className={classes.paperr}>
            {currentChapter && currentChapter.length !== 0 && renderData()}
            {currentChapter && currentChapter.length === 0 && <Typography variant="h4"> Content of this chapter is empty..! </Typography>}
          </Box>
        </Grid>
      </Grid>
      <Grid item md={12} xs={12}>
        <Button
          variant="contained"
          disabled={next}
          color="primary"
          style={{ marginBottom: '10px', marginLeft: '2%', marginTop: '20px' }}
          onClick={onNextHandler}
        >
          PREVIOUS STEP
        </Button>
        <Button
          variant="contained"
          disabled={next}
          color="primary"
          style={{
            marginBottom: '10px', marginLeft: '2%', float: 'right', marginTop: '20px', marginRight: '2%',
          }}
          onClick={handleNextChapter}
        >
          {(nextData === 1) || ((curretnIndex && curretnIndex + 1) === (nextData && nextData.length)) ? 'Finish' : 'Next Step'}
        </Button>
      </Grid>

      {loader}
      {reviewAssessmentModel()}
      {FunctionToTakeMcqTest()}
    </main>
  );
};
TrainingUnits.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};
export default withStyles(styles)(TrainingUnits);
