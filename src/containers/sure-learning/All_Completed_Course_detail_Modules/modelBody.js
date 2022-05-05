/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
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
  TableRow,
  TableBody,
  TableCell,
} from '@material-ui/core';
import clsx from 'clsx';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ReactHtmlParser from 'react-html-parser';
import PropTypes from 'prop-types';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import IconButton from '@material-ui/core/IconButton';
import MatchTheFollowing from './MatchTheFollowing';
import Loader from 'components/loader/loader';
import styles from './modelBody.style';
import ViewPdf from './viewPdf';
import endpoints from 'config/endpoints';
import Layout from 'containers/Layout';

const ModelBody = ({ classes, history }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('udaanDetails')));
  const [double, setDouble] = useState(false);
  const [next, setnext] = useState(false);
  const [session, setSession] = useState(false);
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

  const [currentIndexId, setCurrentIndexId] = useState('');
  const [chapter, setCurrentChapter] = useState('');
  const [fulldata, setFullData] = useState([]);

  function handleBackChapter() {
    window.scrollTo(0, 0);
    if (currentIndexId === 0) {
      history.push('/sure_learning/courses_details');
    } else {
      setCurrentChapter(fulldata[currentIndexId - 1].chapter_wise_videos);
      setCurrentIndexId((prev) => prev - 1);
    }
  }
  function handleNextChapter() {
    window.scrollTo(0, 0);
    if (fulldata.length === currentIndexId + 1) {
      history.push('/sure_learning/courses_details');
    }
    if (fulldata.length !== currentIndexId + 1) {
      setCurrentChapter(fulldata[currentIndexId + 1].chapter_wise_videos);
      setCurrentIndexId((prev) => prev + 1);
    }
  }

  const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant='h6'>{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label='close'
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
    for (let i = 0; i < a.length; i += 1) {
      for (let j = 0; j < b.length; j += 1) {
        if (a[i] === b[j]) {
          value += 1;
        }
      }
    }
    return value === a.length;
  }

  function handleChange(e, ql, index) {
    if (
      ql &&
      ql.type_question &&
      ql.type_question.question_type_name === 'Single Choice'
    ) {
      const awV = [...selectedValue];
      awV[index] = true;
      setSelectedValue(awV);
      const anwew = [...choosenAnswerStatus];
      anwew[index] =
        Object.keys(
          mcqQueList &&
            mcqQueList[activeStep].correct_ans &&
            JSON.parse(`${mcqQueList[activeStep].correct_ans}`)
        )[0] === e.target.value;
      setChoosenAnswerStatus(anwew);
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

    if (
      ql &&
      ql.type_question &&
      ql.type_question.question_type_name === 'Multiple Choice'
    ) {
      const currentIndex = initialValue.indexOf(e.target.value);
      const newChecked = [...initialValue];
      if (currentIndex === -1) {
        newChecked.push(e.target.value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      const anwew = [...choosenAnswerStatus];
      anwew[index] =
        mcqQueList &&
        mcqQueList[activeStep].correct_ans &&
        JSON.parse(mcqQueList[activeStep].correct_ans).length === newChecked.length &&
        multichoiceCompareFunction(
          JSON.parse(mcqQueList[activeStep].correct_ans),
          newChecked
        );
      setChoosenAnswerStatus(anwew);
      SetinitialValue(newChecked);
      const awV = [...selectedValue];
      awV[index] = !(newChecked && newChecked.length === 0);
      setSelectedValue(awV);
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
    if (
      ql &&
      ql.type_question &&
      ql.type_question.question_type_name === 'Single Choice'
    ) {
      const awV = [...selectedValue];
      awV[index] = !awV[index];
      setSelectedValue(awV);
      const anwew = [...choosenAnswerStatus];
      anwew[index] =
        Object.keys(
          mcqQueList &&
            mcqQueList[activeStep].correct_ans &&
            JSON.parse(`${mcqQueList[activeStep].correct_ans}`)
        )[0] === e.target.value;
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

    if (
      ql &&
      ql.type_question &&
      ql.type_question.question_type_name === 'Choice Table Matrix'
    ) {
      const awV = [...selectedValue];
      // awV[index] = !!(choiceMatrixAns && choiceMatrixAns.filter((item) => item.correctAnswer === null).length === 0);
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

    if (
      ql &&
      ql.type_question &&
      ql.type_question.question_type_name === 'Multiple Choice'
    ) {
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
      anwew[index] =
        mcqQueList &&
        mcqQueList[activeStep].correct_ans &&
        JSON.parse(mcqQueList[activeStep].correct_ans).length === newChecked.length &&
        multichoiceCompareFunction(
          JSON.parse(mcqQueList[activeStep].correct_ans),
          newChecked
        );
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
    setChoiceMatrixAns([]);
    setMcqQuesList([]);
    setMcqTestOpen(false);
    setActiveStep(0);
    setQuestionPaperId('');
    setSelectedValue([]);
    setSelectedOption([]);
    SetinitialValue([]);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
    if (
      (selectedOption && selectedOption[step] && selectedOption[step].answer) ||
      (selectedOption && selectedOption[step] && selectedOption[step].Choosen_answer)
    ) {
      SetinitialValue(
        selectedOption && selectedOption[step] && selectedOption[step].answer
      );
      setChoiceMatrixAns(
        selectedOption && selectedOption[step] && selectedOption[step].Choosen_answer
      );
    } else {
      SetinitialValue([]);
      setChoiceMatrixAns([]);
      if (
        mcqQueList &&
        mcqQueList[step] &&
        mcqQueList[step].type_question.question_type_name === 'Choice Table Matrix'
      ) {
        const n = mcqQueList && mcqQueList[step] && mcqQueList[step].question.length;
        const array = [];
        for (let i = 0; i < n; i += 1) {
          array.push({ correctAnswer: null });
        }
        setChoiceMatrixAns(array);
      }
    }
  };

  useEffect(() => {
    let correctNo = 0;
    const n = choiceMatrixAns && choiceMatrixAns.length;
    for (let i = 0; i < n; i += 1) {
      if (
        (choiceMatrixAns && choiceMatrixAns[i].correctAnswer) ===
        (mcqQueList &&
          mcqQueList[activeStep] &&
          mcqQueList[activeStep].question[i].correctAnswer)
      ) {
        correctNo += 1;
      }
    }
    if (
      selectedOption &&
      selectedOption.length !== 0 &&
      selectedOption[activeStep] &&
      selectedOption[activeStep].Choosen_answer
    ) {
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

  function handleBack() {
    if (
      (selectedOption &&
        selectedOption[activeStep - 1] &&
        selectedOption[activeStep - 1].answer &&
        selectedOption[activeStep - 1].answer.length !== 0) ||
      (selectedOption &&
        selectedOption[activeStep - 1] &&
        selectedOption[activeStep - 1].Choosen_answer.length !== 0)
    ) {
      SetinitialValue(
        selectedOption &&
          selectedOption[activeStep - 1] &&
          selectedOption[activeStep - 1].answer
      );
      setChoiceMatrixAns(
        selectedOption &&
          selectedOption[activeStep - 1] &&
          selectedOption[activeStep - 1].Choosen_answer
      );
    } else {
      SetinitialValue([]);
      setChoiceMatrixAns([]);
      if (
        mcqQueList &&
        mcqQueList[activeStep - 1] &&
        mcqQueList[activeStep - 1].type_question.question_type_name ===
          'Choice Table Matrix'
      ) {
        const n =
          mcqQueList &&
          mcqQueList[activeStep - 1] &&
          mcqQueList[activeStep - 1].question.length;
        const array = [];
        for (let i = 0; i < n; i += 1) {
          array.push({ correctAnswer: null });
        }
        setChoiceMatrixAns(array);
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  function handleNext(quesLen, stepLen, ql, marks, index, attempted) {
    if (
      ql &&
      ql.type_question &&
      ql.type_question.question_type_name === 'Match The Following'
    ) {
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
      anwew[index] =
        mcqQueList &&
        mcqQueList.length !== 0 &&
        mcqQueList[activeStep] &&
        mcqQueList[activeStep].question.length === marks;
      setChoosenAnswerStatus(anwew);
      awa[index] = ans;
      setSelectedOption(awa);
    }
    if (
      ((selectedOption &&
        selectedOption[activeStep + 1] &&
        selectedOption[activeStep + 1].answer &&
        selectedOption[activeStep + 1].answer.length !== 0) ||
        (selectedOption &&
          selectedOption[activeStep + 1] &&
          selectedOption[activeStep + 1].Choosen_answer.length !== 0)) &&
      stepLen < quesLen.length - 1
    ) {
      SetinitialValue(
        selectedOption &&
          selectedOption[activeStep + 1] &&
          selectedOption[activeStep + 1].answer
      );
      setChoiceMatrixAns(
        selectedOption &&
          selectedOption[activeStep + 1] &&
          selectedOption[activeStep + 1].Choosen_answer
      );
    } else if (stepLen < quesLen.length - 1) {
      SetinitialValue([]);
      setChoiceMatrixAns([]);
      if (
        mcqQueList &&
        mcqQueList[activeStep + 1] &&
        mcqQueList[activeStep + 1].type_question.question_type_name ===
          'Choice Table Matrix'
      ) {
        const n =
          mcqQueList &&
          mcqQueList[activeStep + 1] &&
          mcqQueList[activeStep + 1].question.length;
        const array = [];
        for (let i = 0; i < n; i += 1) {
          array.push({ correctAnswer: null });
        }
        setChoiceMatrixAns(array);
      }
    }
    if (stepLen < quesLen.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    if (
      (activeStep === quesLen.length - 1 &&
        auth &&
        auth.personal_info &&
        auth.personal_info.role === 'Teacher') ||
      auth.personal_info.role === 'Deputy Zonal Head' ||
      auth.personal_info.role === 'Business Development Manager' ||
      auth.personal_info.role === 'Assistant Business Development Manager' ||
      auth.personal_info.role === 'Zonal Head- Inbound Marketing' ||
      auth.personal_info.role === 'Cluster Counselor' ||
      auth.personal_info.role === 'Counselor' ||
      auth.personal_info.role === 'Digital marketing head' ||
      auth.personal_info.role === 'MarketingHead' ||
      auth.personal_info.role === 'SEO head' ||
      auth.personal_info.role === 'Digital marketing specialist' ||
      auth.personal_info.role === 'Digital Marketing Executive' ||
      auth.personal_info.role === 'Associate Content and Management Lead' ||
      auth.personal_info.role === 'EA' ||
      auth.personal_info.role === 'FOE'
    ) {
      const data = {
        question_paper_id: questionPaperId,
        answer: selectedOption,
      };
      setloading(true);
      fetch(endpoints.sureLearning.finishMCQTest, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (res.status === 302) {
          setloading(false);
          alert.warning('somthing went wrong please try again ');
        }
        if (res.status === 201) {
          setloading(false);
          alert.success('Successfully Submitted');
          setMcqTestOpen(false);
          setActiveStep(0);
          setQuestionPaperId('');
          setSelectedValue([]);
          setSelectedOption([]);
          SetinitialValue(null);
          return res.json();
        }
        if (res.status === 400) {
          setloading(false);
          alert.warning('You have not cleared MCQ test please try again');
          setMcqTestOpen(false);
          setActiveStep(0);
          setQuestionPaperId('');
          setSelectedValue([]);
          setSelectedOption([]);
          SetinitialValue(null);
          return res.json();
        }
        if (res.status !== 201 && res.status !== 302) {
          setloading(false);
          alert.warning('somthing went wrong please try again ');
        }
        return 0;
      });
    }
  }

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case stepIndex:
        return (
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} style={{ textAlign: 'center', color: 'blue' }}>
              <Typography variant='h5'>
                {(mcqQueList &&
                  mcqQueList[stepIndex] &&
                  mcqQueList[stepIndex].type_question.question_type_name) ||
                  ''}{' '}
                Hello
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography variant='h6'>
                {stepIndex + 1}
                {ReactHtmlParser(
                  mcqQueList &&
                    mcqQueList[stepIndex] &&
                    mcqQueList[stepIndex].question[0].mcqQuestion
                ) || ''}
                {ReactHtmlParser(
                  mcqQueList &&
                    mcqQueList[stepIndex] &&
                    mcqQueList[stepIndex].choice_table_matrix_question_title
                ) || ''}
              </Typography>
            </Grid>
            {mcqQueList &&
              mcqQueList[stepIndex].type_question &&
              mcqQueList[stepIndex].type_question.question_type_name ===
                'Single Choice' && (
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <FormControl component='fieldset' className={classes.formControl}>
                      <FormLabel component='legend'>Choose Correct Answer :</FormLabel>
                      <RadioGroup
                        style={{ marginTop: '20px' }}
                        aria-label='Answer'
                        name='Answer'
                        value={
                          initialValue && typeof initialValue === 'string'
                            ? initialValue
                            : false
                        }
                        onChange={(e) =>
                          handleChange(e, mcqQueList[stepIndex], stepIndex)
                        }
                        onClick={(e) => handleClick(e, mcqQueList[stepIndex], stepIndex)}
                      >
                        <Grid container spacing={5}>
                          <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                            <FormControlLabel
                              value='option1'
                              control={<Radio color='primary' />}
                              label={ReactHtmlParser(
                                mcqQueList &&
                                  mcqQueList[stepIndex] &&
                                  mcqQueList[stepIndex].question[0].option1
                              )}
                              labelPlacement='end'
                            />
                          </Grid>
                          <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                            <FormControlLabel
                              value='option2'
                              control={<Radio color='primary' />}
                              label={ReactHtmlParser(
                                mcqQueList &&
                                  mcqQueList[stepIndex] &&
                                  mcqQueList[stepIndex].question[0].option2
                              )}
                              labelPlacement='end'
                            />
                          </Grid>
                          <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                            <FormControlLabel
                              value='option3'
                              control={<Radio color='primary' />}
                              label={ReactHtmlParser(
                                mcqQueList &&
                                  mcqQueList[stepIndex] &&
                                  mcqQueList[stepIndex].question[0].option3
                              )}
                              labelPlacement='end'
                            />
                          </Grid>
                          <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                            <FormControlLabel
                              value='option4'
                              control={<Radio color='primary' />}
                              label={ReactHtmlParser(
                                mcqQueList &&
                                  mcqQueList[stepIndex] &&
                                  mcqQueList[stepIndex].question[0].option4
                              )}
                              labelPlacement='end'
                            />
                          </Grid>
                        </Grid>
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            {mcqQueList &&
              mcqQueList[stepIndex].type_question &&
              mcqQueList[stepIndex].type_question.question_type_name ===
                'Multiple Choice' && (
                <Grid item md={12} xs={12}>
                  <Grid item md={12} xs={12}>
                    <FormControl component='fieldset' className={classes.formControl}>
                      <FormLabel component='legend'>Choose Correct Answer :</FormLabel>
                      <FormGroup style={{ marginTop: '20px' }}>
                        <Grid container spacing={5}>
                          <Grid item md={6} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  color='primary'
                                  checked={
                                    initialValue &&
                                    initialValue.some((element) => element === 'option1')
                                  }
                                  onChange={(e) =>
                                    handleChange(e, mcqQueList[stepIndex], stepIndex)
                                  }
                                  onClick={(e) =>
                                    handleClick(e, mcqQueList[stepIndex], stepIndex)
                                  }
                                  value='option1'
                                />
                              }
                              label={ReactHtmlParser(
                                mcqQueList &&
                                  mcqQueList[stepIndex] &&
                                  mcqQueList[stepIndex].question[0].option1
                              )}
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  color='primary'
                                  checked={
                                    initialValue &&
                                    initialValue.some((element) => element === 'option2')
                                  }
                                  onChange={(e) =>
                                    handleChange(e, mcqQueList[stepIndex], stepIndex)
                                  }
                                  onClick={(e) =>
                                    handleClick(e, mcqQueList[stepIndex], stepIndex)
                                  }
                                  value='option2'
                                />
                              }
                              label={ReactHtmlParser(
                                mcqQueList &&
                                  mcqQueList[stepIndex] &&
                                  mcqQueList[stepIndex].question[0].option2
                              )}
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  color='primary'
                                  checked={
                                    initialValue &&
                                    initialValue.some((element) => element === 'option3')
                                  }
                                  onChange={(e) =>
                                    handleChange(e, mcqQueList[stepIndex], stepIndex)
                                  }
                                  onClick={(e) =>
                                    handleClick(e, mcqQueList[stepIndex], stepIndex)
                                  }
                                  value='option3'
                                />
                              }
                              label={ReactHtmlParser(
                                mcqQueList &&
                                  mcqQueList[stepIndex] &&
                                  mcqQueList[stepIndex].question[0].option3
                              )}
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  color='primary'
                                  checked={
                                    initialValue &&
                                    initialValue.some((element) => element === 'option4')
                                  }
                                  onChange={(e) =>
                                    handleChange(e, mcqQueList[stepIndex], stepIndex)
                                  }
                                  onClick={(e) =>
                                    handleClick(e, mcqQueList[stepIndex], stepIndex)
                                  }
                                  value='option4'
                                />
                              }
                              label={ReactHtmlParser(
                                mcqQueList &&
                                  mcqQueList[stepIndex] &&
                                  mcqQueList[stepIndex].question[0].option4
                              )}
                            />
                          </Grid>
                        </Grid>
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            {mcqQueList &&
              mcqQueList[stepIndex].type_question &&
              mcqQueList[stepIndex].type_question.question_type_name ===
                'Choice Table Matrix' && (
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <Box border={1} className={classes.box}>
                      <Table>
                        {mcqQueList[stepIndex].question &&
                          mcqQueList[stepIndex].question.length !== 0 &&
                          mcqQueList[stepIndex].question.map((item, index) => (
                            <TableBody key={index}>
                              <TableRow>
                                <TableCell>{item.choice}</TableCell>
                                {item &&
                                  item.optionsArray &&
                                  item.optionsArray.length !== 0 &&
                                  item.optionsArray.map((itemData, OptionIndex) => (
                                    <TableCell key={OptionIndex}>
                                      <Radio
                                        checked={
                                          !!(
                                            itemData.option ===
                                            (choiceMatrixAns &&
                                              choiceMatrixAns.length !== 0 &&
                                              choiceMatrixAns[index].correctAnswer &&
                                              choiceMatrixAns[index].correctAnswer)
                                          )
                                        }
                                        onChange={(e) =>
                                          handleMatrixMcq(
                                            e.target.value,
                                            index,
                                            'correctAnswer',
                                            mcqQueList[stepIndex],
                                            stepIndex
                                          )
                                        }
                                        onClick={(e) =>
                                          handleClick(e, mcqQueList[stepIndex], stepIndex)
                                        }
                                        value={itemData.option}
                                        color='primary'
                                        name='radio-button-demo'
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
            {mcqQueList &&
              mcqQueList[stepIndex].type_question &&
              mcqQueList[stepIndex].type_question.question_type_name === 'Synonyms' && (
                <Grid container spacing={2}>
                  {mcqQueList[stepIndex].question &&
                    mcqQueList[stepIndex].question.length !== 0 &&
                    mcqQueList[stepIndex].question.map((item, index) => (
                      <Grid item md={12} xs={8} key={index}>
                        <Button
                          variant='outlined'
                          // onClick={(e) => HandleSynonyms(e.target.value)}
                        >
                          {item.synonyms}
                        </Button>
                      </Grid>
                    ))}
                </Grid>
              )}
            {mcqQueList &&
              mcqQueList[stepIndex].type_question &&
              mcqQueList[stepIndex].type_question.question_type_name ===
                'Match The Following' && (
                <div style={{ width: '100%' }} id={stepIndex}>
                  <MatchTheFollowing
                    receivedArray={mcqQueList[stepIndex].question}
                    totalArray={mcqQueList[stepIndex]}
                    stepIndex={stepIndex}
                    propFunc={handleNext}
                    id={stepIndex + 100}
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
  }

  function QontoStepIcon(props, i) {
    // eslint-disable-next-line react/prop-types
    const { active, completed } = props;
    return (
      <div className={clsx(classes.rootS, { [classes.active]: active })}>
        {(completed && choosenAnswerStatus[i] && selectedValue[i] && (
          <CheckCircleOutlineIcon className={classes.completed} />
        )) ||
          (completed && !choosenAnswerStatus[i] && selectedValue[i] && (
            <HighlightOffIcon className={classes.wrong} />
          )) || <div className={classes.circle} />}
      </div>
    );
  }

  const FunctionToTakeMcqTest = () => {
    let modal = null;
    modal = (
      <>
        <Dialog
          fullWidth
          maxWidth='xl'
          onClose={handleCloseMcqTest}
          open={mcqTestOpen}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          className={classes.mcqmodal}
        >
          <DialogTitle id='alert-dialog-title' onClose={handleCloseMcqTest}>
            Mcq Test
          </DialogTitle>
          <Divider />
          {mcqQueList && mcqQueList.length === 0 && (
            <DialogContent>
              <Typography variant='h4' style={{ color: 'blue', textAlign: 'center' }}>
                No Questions Found
              </Typography>
            </DialogContent>
          )}
          {mcqQueList && mcqQueList.length !== 0 && (
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12} className={classes.paperMain}>
                  <Card>
                    <Stepper alternativeLabel activeStep={activeStep}>
                      {mcqQueList &&
                        mcqQueList.length &&
                        mcqQueList.map((label, i) => (
                          <Step key={label.id}>
                            <StepLabel
                              StepIconComponent={(props) => QontoStepIcon(props, i)}
                              onClick={handleStep(i)}
                            >
                              <Typography
                                variant='h5'
                                className={activeStep === i ? classes.stepBtn : ''}
                              >
                                {i + 1}
                              </Typography>
                            </StepLabel>
                          </Step>
                        ))}
                    </Stepper>
                  </Card>
                </Grid>
                <Grid item md={12} xs={12}>
                  {getStepContent(activeStep)}
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={1}>
                    <Button
                      variant='contained'
                      color='primary'
                      style={{ margin: '10px' }}
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.backButton}
                    >
                      Back
                    </Button>
                  </Grid>
                  {mcqQueList &&
                    mcqQueList.length !== 0 &&
                    mcqQueList[activeStep] &&
                    mcqQueList[activeStep].type_question &&
                    mcqQueList[activeStep].type_question.question_type_name !==
                      'Match The Following' && (
                      <Grid item md={11}>
                        <Button
                          variant='contained'
                          color='primary'
                          style={{
                            marginTop: '10px',
                            float: activeStep === mcqQueList.length - 1 ? 'right' : '',
                          }}
                          onClick={() =>
                            handleNext(mcqQueList, activeStep, mcqQueList.id)
                          }
                        >
                          {activeStep === mcqQueList.length - 1 ? 'Finish' : 'Next'}
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

  const location = useLocation();

  useEffect(() => {
    if (location.state.next === undefined) {
      setnext(true);
      setSession(true);
    } else if (location.state.next.index === location.state.next.data.length) {
      setnext(true);
      setSession(true);
    } else {
      setnext(false);
      setSession(false);
    }
  });

  const {
    chapterData: currentChapter,
    chapterId: chapterID,
    isCompleted,
    completeData: nextStepInfo,
    currentIndex: currentIndexNumber,
  } = location.state.current;

  useEffect(() => {
    console.log(location.state.current, 'current details coming for display');
  }, [location]);

  useEffect(() => {
    if (auth) {
      setCurrentChapter(currentChapter);
      setCurrentIndexId(currentIndexNumber);
      setFullData(nextStepInfo);
    }
  }, [auth]);

  const courseId = localStorage.getItem('courseID');
  const courseContentId = localStorage.getItem('courseContentId');

  const videoPlay = (file, title) => {
    let play = null;
    play = (
      <>
        <Grid container spacing={2}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Typography variant='h5'>{title}</Typography>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item md={1} />
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Grid item md={12} xs={12} style={{ margin: '12px 0px' }}>
              <video
                id='background-video'
                controls
                controlsList='nodownload'
                alt='video file is crashed'
                height='100%'
                width='100%'
              >
                <source src={file} type='video/mp4' />
                <track src={file} kind='captions' srcLang='en' label='english_captions' />
              </video>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
    return play;
  };

  function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  function functionToOpenToTakeMcqTest(mcqFile, title, Id) {
    setQuestionPaperId(Id);
    setMcqQuesList(shuffle(mcqFile));
    setMcqTestOpen(true);
  }
  useEffect(() => {
    if (mcqQueList) {
      if (
        mcqQueList &&
        mcqQueList[0] &&
        mcqQueList[0].type_question.question_type_name === 'Choice Table Matrix'
      ) {
        const n = mcqQueList && mcqQueList[0] && mcqQueList[0].question.length;
        const array = [];
        for (let i = 0; i < n; i += 1) {
          array.push({ correctAnswer: null });
        }
        setChoiceMatrixAns(array);
      }
    }
  }, [mcqQueList]);

  const showMcqButton = (mcqFile, title, questionPaperid) => {
    let MCQTESTBUTTON = null;
    MCQTESTBUTTON = (
      <>
        <Grid container spacing={2} className={classes.Mcqgrid}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Typography variant='h5'>
              Press the Below Button to View Test on
              <b style={{ color: 'blue' }}>{title}</b>
            </Typography>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item md={1} />
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => functionToOpenToTakeMcqTest(mcqFile, title, questionPaperid)}
            >
              {(auth &&
                auth.personal_info &&
                auth.personal_info.role !== 'InHouse' &&
                `View Mcq Test on ${title}`) ||
                `Take Mcq Test on ${title}`}
            </Button>
          </Grid>
        </Grid>
      </>
    );
    return MCQTESTBUTTON;
  };

  function viewFileType(data, pdfLinkdInfo, download) {
    const res = data.substring(data.length - 3, data.length);
    if (res === 'zip' || download === true) {
      return (
        <Grid item md={4} xs={12} style={{ textAlign: 'center', paddingBottom: '20px' }}>
          <a href={data} target='_blank' rel='noopener noreferrer'>
            Download File
          </a>
        </Grid>
      );
    }
    if (download === false) {
      return (
        <ViewPdf
          pdfFileLink={data}
          pdfLinks={pdfLinkdInfo || []}
          isDownloadaded={download || false}
        />
      );
    }
    return null;
  }

  const showImage = (imageFile, title, pdfLinks, downloadab) => {
    let text = null;
    text = (
      <>
        <Grid container spacing={2}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Typography variant='h5'>{title}</Typography>
            <Divider className={classes.divider} />
          </Grid>
          {/* <Grid item md={1} /> */}
          <Grid item md={12} xs={12}>
            {viewFileType(imageFile, JSON.parse(pdfLinks), downloadab)}
          </Grid>
          <Divider className={classes.divider} />
        </Grid>
      </>
    );
    return text;
  };

  const textDisplay = (document, title) => {
    let text = null;
    text = (
      <>
        <Grid container spacing={2}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Typography variant='h5'>{title}</Typography>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item md={1} />
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Grid
              item
              md={12}
              xs={12}
              style={{ margin: '12px 0px', textAlign: 'justify' }}
            >
              <Typography alt='text file null'>{ReactHtmlParser(document)}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
    return text;
  };
  const assiessmentDisplay = (FileAssessment, title, downloadable) => {
    let assiessmentFile = null;
    assiessmentFile = (
      <>
        <Grid container spacing={2}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Typography variant='h5'>{title}</Typography>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item md={1} />
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Grid item md={12} xs={12} style={{ margin: '12px 0px' }}>
              <iframe
                title='myFrame'
                src={`${FileAssessment}#toolbar=0`}
                style={{ width: '100%', height: '700px', frameborder: '0' }}
                alt='PDF file is crashed'
              />
              {/* <ViewPdf pdfFileLink={FileAssessment}  pdfLinks={[]} /> */}
            </Grid>
            {downloadable && (
              <Grid item md={12} xs={12} style={{ textAlign: 'center', padding: '20px' }}>
                <Typography variant='h6'>
                  Click Hear to Download Assignment file &nbsp;
                  <a href={FileAssessment} target='_blank' rel='noopener noreferrer'>
                    Download File
                  </a>
                </Typography>
              </Grid>
            )}
          </Grid>
          <Divider className={classes.divider} />
        </Grid>
      </>
    );
    return assiessmentFile;
  };

  const showPPT = (document123) => ({ __html: document123 });

  const renderData = () => {
    let showChapters = null;
    showChapters = (
      <>
        {chapter &&
          chapter.map((index, Id) => (
            <React.Fragment key={Id}>
              <Grid container spacing={1}>
                <Grid item md={12} xs={12}>
                  {index && index.content_type === 'Video'
                    ? videoPlay(index.file, index.title)
                    : ''}
                  {index && index.content_type === 'Text'
                    ? textDisplay(index.description, index.title)
                    : ''}
                  {index && index.content_type === 'File'
                    ? showImage(
                        index.file,
                        index.title,
                        index.ppt_page_links,
                        index.is_download
                      )
                    : ''}
                  {index && index.content_type === 'McqTest'
                    ? showMcqButton(
                        index.chapter_wise_mcq && index.chapter_wise_mcq.mcq_questions,
                        index.title,
                        index.question_paper
                      )
                    : ''}
                  {index && index.content_type === 'ppt' && (
                    <Grid container spacing={2}>
                      <Grid item md={1} />
                      <Grid item md={10} xs={12}>
                        <Typography variant='h5'>{index.title}</Typography>
                        <Divider className={classes.divider} />
                      </Grid>
                      <Grid item md={2} />
                      <Grid
                        item
                        md={10}
                        xs={12}
                        style={{
                          margin: '12px 0px',
                          textAlign: 'justify',
                          display: 'inline',
                          width: '10%',
                          height: '10%',
                        }}
                        dangerouslySetInnerHTML={showPPT(index.ppt_iframe, index.title)}
                      />
                    </Grid>
                  )}
                  {index && index.content_type === 'Assignment'
                    ? assiessmentDisplay(index.file, index.title, index.is_download)
                    : ''}
                </Grid>
              </Grid>
            </React.Fragment>
          ))}
      </>
    );
    return showChapters;
  };

  const onNextHandler = () => {
    const { data, index, itemId } = location.state.next;

    history.push({
      pathname: '/modelbody',
      state: {
        current: {
          chapterData: data[index].chapter_wise_videos,
          chapterId: data[index].id,
          itemID: itemId,
          isCompleted: data[index].is_chapter_completed,
        },
        next: {
          data,
          index: index + 1,
          itemId,
        },
      },
    });
    setDouble(false);
    setSession(false);
  };
  const onBackHandler = () => {
    history.push('/sure_learning/courses_details');
  };
  const backToCourseEnrol = () => {
    history.push('/sure_learning/completed_courses');
  };

  const completedID = (id) => {
    if (id) {
      const obj = {
        content_related_chapter: id,
        course: courseId,
        course_content: courseContentId,
      };

      fetch(`${endpoints.sureLearning.isChapterComplete}`, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 201) {
            alert.success('Successfully Created');
            return res.json();
          }
          return 0;
        })
        .then((data) => {
          setDouble(true);
          // eslint-disable-next-line no-console
          console.log(data);
        });
    } else {
      alert.warning('Chapter ID empty..!');
    }

    setSession(false);
  };
  let loader = null;
  if (loading) {
    loader = <Loader open />;
  }
  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Sure Learning'
        childComponentName='All Completed Courses'
        childComponentNameNext='Chapter resource'
        isAcademicYearVisible={true}
      />

      <div style={{display : 'flex', justifyContent : 'space-between', width : '84%', marginLeft : '8%'}}>
        <Button
          variant='contained'
          color='primary'
          style={{ marginBottom: '10px', float: 'left' }}
          onClick={() => handleBackChapter()}
        >
          {currentIndexId === 0 ? 'Back to Course Content' : 'Previous Chapter'}
        </Button>
        <Button
          variant='contained'
          color='primary'
          style={{ marginBottom: '10px', float: 'right' }}
          onClick={() => handleNextChapter()}
        >
          Next Chapter
        </Button>
      </div>
      <Grid container>
        <Grid item md={1} />
        <Grid item md={10} xs={12}>
          <Paper className={classes.paper}>
            <Grid container spacing={2}>
              <Grid item md={11} xs={11}>
                <Typography
                  variant='h4'
                  styles={{ color: 'white' }}
                  className={classes.typographyPadding}
                >
                  Chapter Content
                </Typography>
              </Grid>
              <Grid item md={1} xs={1}>
                <IconButton style={{ float: 'right' }} onClick={backToCourseEnrol}>
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={1} />
        <Grid item md={10} xs={12}>
          <Box border={2} className={classes.paperr}>
            {chapter &&
              chapter.length !== 0 &&
              chapterID &&
              chapter !== null &&
              renderData()}
            {chapter && chapter.length === 0 && (
              <Typography variant='h4'> Content of this chapter is empty..! </Typography>
            )}
          </Box>
        </Grid>
        <Grid item md={1} />
      </Grid>

      <Grid item md={12} xs={12} style={{ display: 'none' }}>
        {chapter &&
        chapter.length !== 0 &&
        chapterID &&
        isCompleted === false &&
        chapter != null ? (
          <Button
            variant='contained'
            disabled={double}
            color='primary'
            style={{ marginBottom: '10px', marginLeft: '40%' }}
            onClick={() => completedID(chapterID)}
          >
            complete
          </Button>
        ) : (
          ''
        )}
        {chapter && chapter.length !== 0 && chapterID && chapter != null ? (
          <Button
            variant='contained'
            disabled={next}
            color='primary'
            style={{ marginBottom: '10px', marginLeft: '2%' }}
            onClick={onNextHandler}
          >
            Next
          </Button>
        ) : (
          ''
        )}
        {session ? (
          <Button
            variant='contained'
            color='primary'
            style={{ marginBottom: '10px', marginLeft: '2%' }}
            onClick={onBackHandler}
          >
            Finish
          </Button>
        ) : (
          ''
        )}
      </Grid>
      {loader}
      {FunctionToTakeMcqTest()}
    </Layout>
  );
};

ModelBody.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(ModelBody);
