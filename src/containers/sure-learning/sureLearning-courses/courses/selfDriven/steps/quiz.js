import React, { useContext, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Loading from '../../../../../../components/loader/loader';
import StepConnector from '@material-ui/core/StepConnector';
import { Link, useHistory } from 'react-router-dom';
import axiosInstance from '../../../../../../config/axios';
import Check from '@material-ui/icons/Check';
import MatchTheFollowing from './MatchTheFollowing';
import endpoints from 'config/endpoints';
import axios from 'axios';
import { AlertNotificationContext } from '../../../../../../context-api/alert-context/alert-state';
import AllCoursesAssignedByCoordinator from '../../selfDriven/steps/allCoursesAssignedByCoordinator';
import CommonBreadcrumbs from '../../../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../../../Layout';
import ReactHtmlParser from 'react-html-parser';
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
  makeStyles,
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
import { goBack } from 'react-router-redux';
const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);


// function QontoStepIcon(props) {
//   const classes = useQontoStepIconStyles();

//   const { active, completed } = props;

//   return (
//     <div
//       className={clsx(classes.root, {
//         [classes.active]: active,
//       })}
//     >
//       {completed ? (
//         <Check className={classes.completed} />
//       ) : (
//         <div className={classes.circle} />
//       )}
//     </div>
//   );
// }



const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
    float: 'right',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));
const questions = [
  {
    title: 'Question 1?',
    score: 10,
    done: false,
    code: `<div>
            <div>Ciaooo</div>
           </div>`,
    answers: [
      {
        text: 'Text  1',
        correct: true,
      },
      {
        text: 'Text  2',
      },
      {
        text: 'Text  3',
      },
    ],
  },
];

export default function CustomizedSteppers() {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [activeStep, setActiveStep] = useState(0);
  const [initialValue, SetinitialValue] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [choosenAnswerStatus, setChoosenAnswerStatus] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [choiceMatrixAns, setChoiceMatrixAns] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [qualifiedExam, setQualifiedExam] = useState(false);
  const steps = getSteps();
  const history = useHistory();
  const [toggle, setToggle] = useState(false);

  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails.personal_info.token;
  const moduleData = udaanDetails.role_permission.modules;

  const selectAnswerHandler = (indexQuestion, indexAnswer) => {
    const questions = this.state.questions.slice(0);
    questions[indexQuestion].givenAnswer = indexAnswer;
    questions[indexQuestion].done = true;
    this.setState({ questions });
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
  // const handleChange = (e) => {
  //   SetinitialValue(e.target.value);
  //   console.log(e.target.value, 'hai');
  // };
  const handleChange = (e, ql, index) => {
    // console.log('onchange', e.target.value);
    if (
      ql &&
      ql.type_question &&
      ql.type_question.question_type_name === 'Single Choice'
    ) {
      const awV = [...selectedValue];
      awV[index] = true;
      // console.log(awV[index], awV);
      setSelectedValue(awV);
      const anwew = [...choosenAnswerStatus];
      // console.log('anwew', anwew);
      // console.log(choosenAnswerStatus);
      anwew[index] =
        Object.keys(
          mcqQueList &&
            mcqQueList[activeStep].correct_ans &&
            JSON.parse(`${mcqQueList[activeStep].correct_ans}`)
        )[0] === e.target.value;
      setChoosenAnswerStatus(anwew);
      // console.log('After setting', choosenAnswerStatus);
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
      awa[index] = ans;
      setSelectedOption(awa);
    }
    // console.log('intialselectedOptionStatus,',initialValue,selectedOption,choosenAnswerStatus)
  };
  const handleClick = (e, ql, index) => {
    // console.log('onclick', e.target.value);
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
      // console.log('awa', awa);
    }

    if (
      ql &&
      ql.type_question &&
      ql.type_question.question_type_name === 'Choice Table Matrix'
    ) {
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
  };
  
  function QontoStepIcon(props, i) {
    // eslint-disable-next-line react/prop-types
    
    const { active, completed ,rootS} = props;
    return (
      <div className={clsx(classes.rootS, { [classes.active]: active })}>
        {(completed && choosenAnswerStatus[i] && selectedValue[i] && (
          <CheckCircleOutlineIcon style={{ fontSize: 35,zIndex: 1,color :'green'}} />
        )) ||
          (completed && !choosenAnswerStatus[i] && selectedValue[i] && (
            <HighlightOffIcon style={{ zIndex: 1,fontSize: 35,color :'red'}} />
          )) || (completed && !choosenAnswerStatus[i] && selectedValue[i]==null && (
            <div style={{ width :20, height:20,borderRadius :'50%',backgroundColor :'lightgray'}} />
     
          )) || ''}
      </div>
    );
  }
  QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};
  const handleMatrixMcq = (e, optInd, key, ql, index) => {
    setChoiceMatrixAns((Info) => {
      const newData = [...Info];
      switch (key) {
        case 'correctAnswer':
          newData[optInd][key] = e;
          console.log('correctAnswer', newData);
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
  };
  function getSteps() {
    return ['Select campaign settings', 'Create an ad group', 'Create an ad'];
  }

  function handleTab(quesLen, stepLen, ql, marks, index, attempted) {
    const count = 0;
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
    if (stepLen < quesLen.length) {
      // setActiveStep((prevActiveStep) => prevActiveStep + 1);
      for (let i = activeStep; i < quesLen.length; i++) {
        // console.log('Inside next loop', choosenAnswerStatus[i]);
        if (choosenAnswerStatus[index] === undefined) {
          setActiveStep(index);
          break;
        }
      }
    }
  }
  const mcqQueList = JSON.parse(sessionStorage.getItem('Quiz'));
  // const mcqQueList=mcqQue[0].type_question.question_type_name
  const mcqLength = mcqQueList.length;

  // console.log(mcqLength, 'mcqLength');
  // console.log('Quiz', history.location.state);
  // console.log('Quizdata', mcqQueList[0].question);
  function getStepContent(stepIndex, mcqLength) {
    // console.log('ids', stepIndex, 'inductionlen', mcqLength);
    if (stepIndex < mcqLength) {
      switch (stepIndex) {
        case stepIndex:
          return (
            <Grid
              container
              spacing={2}
              id={stepIndex + 280}
              style={{ textAlign: 'center' }}
            >
              <Grid item md={12} xs={12} style={{ textAlign: 'center', color: 'blue' }}>
                <Typography variant='h5'>
                  {(mcqQueList &&
                    mcqQueList[stepIndex] &&
                    mcqQueList[stepIndex].type_question.question_type_name) ||
                    ''}
                </Typography>
              </Grid>
              <Grid item md={12} xs={12} id={stepIndex + 480}>
                <Typography variant='h6'>
                  {stepIndex + 1}{' '}
                  {ReactHtmlParser(
                    mcqQueList &&
                      mcqQueList[stepIndex] &&
                      mcqQueList[stepIndex].question[0].mcqQuestion
                  )}
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
                          onClick={(e) =>
                            handleClick(e, mcqQueList[stepIndex], stepIndex)
                          }
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
                            <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color='primary'
                                    checked={
                                      initialValue &&
                                      initialValue.some(
                                        (element) => element === 'option1'
                                      )
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
                            <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color='primary'
                                    checked={
                                      initialValue &&
                                      initialValue.some(
                                        (element) => element === 'option2'
                                      )
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
                            <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color='primary'
                                    checked={
                                      initialValue &&
                                      initialValue.some(
                                        (element) => element === 'option3'
                                      )
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
                            <Grid item md={6} xs={12} style={{ marginTop: '10px' }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color='primary'
                                    checked={
                                      initialValue &&
                                      initialValue.some(
                                        (element) => element === 'option4'
                                      )
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
                                      <TableCell>
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
                                            handleClick(
                                              e,
                                              mcqQueList[stepIndex],
                                              stepIndex
                                            )
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
                mcqQueList[stepIndex].type_question.question_type_name ===
                  'Match The Following' && (
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
  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Assigned_by_Principal_CoOrdinator') {
          setModuleId(item.module);
          console.log(item.module);
        }
      });
    }
  }, []);

  const mcqSubmitResponse = () => {};

  const handleCloseMcqTest = () => {};
  useEffect(() => {
    if (qualifiedExam === true) {
      let courseFinish;
      console.log('hlkjhgfdsdfghjklkjhgf');
      console.log('hlkjhgfdsdfghjklkjhgf', history.location.courseType);
      if (history.location.courseType === 'self_driven') {
        courseFinish = {
          is_finish: true,
          content_id: history?.location?.state?.id,
          course_content_id: history?.location?.state?.course_content,
          is_self_driven: true,
        };
      } else if (history.location.courseType === 'is_induction_training') {
        courseFinish = {
          is_finish: true,
          content_id: history?.location?.state?.id,
          course_content_id: history?.location?.state?.course_content,
          is_induction_training: true,
        };
      }

      setLoading(true);
      axios
        .post(
          `${endpoints.sureLearning.FinishChapterApi}?${history?.location?.course}=true`,
          JSON.stringify(courseFinish),
          {
            headers: {
              Authorization: `Bearer ${udaanToken}`,
              module: moduleId,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          if (res.status === 404) {
            setLoading(false);
            setAlert('warning', 'please complete mcq test');
          }
          if (res.status === 200) {
            setLoading(false);
            setAlert('warning', 'cut off not cleared');
          }
          if (res.status === 201) {
            setLoading(false);
            setAlert('success', 'You have successfully completed this lesson');
            history.goBack();
          }
          if (res.status !== 201 && res.status !== 404 && res.status !== 200) {
            setLoading(false);
            setAlert('error', 'somthing went wrong please try again ');
          }
          return 0;
        });
    }
    // if (mcqQueList.length !== activeStep + 1) {
    //   let courseFinish;
    //   console.log('hlkjhgfdsdfghjklkjhgf');
    //   console.log('hlkjhgfdsdfghjklkjhgf', history.location.courseType);
    //   console.log('hlkjhgfdsdfghjklkjhgf', history?.location?.course);
    //   console.log('hlkjhgfdsdfghjklkjh', history?.location?.state?.course_content);
    //   if (history.location.courseType === 'self_driven') {
    //     courseFinish = {
    //       content_id: history?.location?.state?.id,
    //       course_content_id: history?.location?.state?.course_content,
    //       is_self_driven: true,
    //     };
    //   } else {
    //     courseFinish = {
    //       content_id: history?.location?.state?.id,
    //       course_content_id: history?.location?.state?.course_content,
    //       is_induction_training: true,
    //     };
    //   }

    //   setLoading(true);
    //   axios
    //     .post(
    //       `${endpoints.sureLearning.FinishChapterApi}?${history?.location?.course}=true`,
    //       JSON.stringify(courseFinish),
    //       {
    //         headers: {
    //           Authorization: `Bearer ${udaanToken}`,
    //           module: moduleId,
    //           'Content-Type': 'application/json',
    //         },
    //       }
    //     )
    //     .then((res) => {
    //       if (res.status === 404) {
    //         setLoading(false);
    //         setAlert('warning', 'please complete mcq test');
    //       }
    //       if (res.status === 201) {
    //         setLoading(false);
    //         setAlert('success', 'You have successfully completed this lesson');
    //         history.goBack();
    //       }
    //       if (res.status !== 201 && res.status !== 404) {
    //         setLoading(false);
    //         setAlert('warning', 'somthing went wrong please try again ');
    //       }
    //       return 0;
    //     });
    // }
  }, [qualifiedExam]);
  const handleSubmit = (quesLen, stepLen, ql, marks, index, attempted) => {
    console.log('clicked finish');
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
    if (stepLen < quesLen.length) {
      // console.log('outside next loop', choosenAnswerStatus);
      for (let i = activeStep; i < quesLen.length; i++) {
        // console.log('Inside next loop', choosenAnswerStatus[i]);
        if (choosenAnswerStatus[i + 1] === undefined) {
          setActiveStep(i + 1);
          break;
        }
      }
      // setActiveStep(activeStep + 1);
    }
    console.log(
      'question_paper',
      history.location.state.course_wise_videos[0].question_paper.id
    );
    console.log('answers', selectedOption);
    console.log(
      'questions',
      history.location.state.course_wise_videos[0].chapter_wise_mcq
    );
    console.log(
      'question_paper_response',
      history.location.state.course_wise_videos[0].question_paper
    );

    console.log(
      'content_related_chapter',
      history.location.state.course_wise_videos[0].content_related_chapter
    );
    console.log('course_wise_video', history.location.state.course_wise_videos[0].id);
    console.log('is_self_driven', true);
    console.log(history?.location?.course, 'history?.location?.state?.course');

    if (true) {
      let data;
      if (history.location.courseType === 'self_driven') {
        data = {
          question_paper: history.location.state.course_wise_videos[0].question_paper.id,
          answers: selectedOption,
          questions: history.location.state.course_wise_videos[0].chapter_wise_mcq,
          question_paper_response:
            history.location.state.course_wise_videos[0].question_paper,
          content_related_chapter:
            history.location.state.course_wise_videos[0].content_related_chapter,
          course_wise_video: history.location.state.course_wise_videos[0].id,
          is_self_driven: true,
        };
      } else if (history.location.courseType === 'is_induction_training') {
        data = {
          question_paper: history.location.state.course_wise_videos[0].question_paper.id,
          answers: selectedOption,
          questions: history.location.state.course_wise_videos[0].chapter_wise_mcq,
          question_paper_response:
            history.location.state.course_wise_videos[0].question_paper,
          content_related_chapter:
            history.location.state.course_wise_videos[0].content_related_chapter,
          course_wise_video: history.location.state.course_wise_videos[0].id,
          is_induction_training: true,
        };
      }
      setLoading(true);
      axios
        .post(endpoints.sureLearning.applicantQuizDetails, JSON.stringify(data), {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          setLoading(false);
          setToggle(true);
          if (res.status === 201) {
            setAlert('success', 'Test Successfully Submitted');
            setQualifiedExam(true);
          }
          if (res.status !== 201 && res.status !== 409) {
            setAlert('error', 'somthing went wrong please try again');
            // setAlert('somthing went wrong please try again');
            // alert.error('somthing went wrong please try again ');
          }
          return 0;
        })
        .catch((error) => {
          setLoading(false);
          setToggle(true);
          console.log('hit catch', error.response);
          if (error.response.status === 409) {
            setAlert('warning', 'Test Already Submitted');
          }
          if (error.response.status === 400) {
            console.log('hit');

            setAlert('warning', 'You have not cleared MCQ test please try again');
            // alert.warning('You have not cleared MCQ test please try again');
            mcqSubmitResponse();
            handleCloseMcqTest();
            // return res.json();
          } else {
            setAlert('error', error.response.statusText);
          }
          history.goBack();
        });
    }
  };
  const handleNext = (quesLen, stepLen, ql, marks, index, attempted) => {
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
    if (stepLen < quesLen.length) {
      // console.log('outside next loop', choosenAnswerStatus);
      // console.log('done',history);
      for (let i = activeStep; i < quesLen.length; i++) {
        // console.log('Inside next loop', choosenAnswerStatus[i]);
        if (choosenAnswerStatus[i + 1] === undefined) {
          setActiveStep(i + 1);
          break;
        }
      }
      setActiveStep(activeStep + 1);
    }
    if (true) {
      let data;
      if (history.location.courseType === 'self_driven') {
        data = {
          question_paper: history.location.state.course_wise_videos[0].question_paper.id,
          answers: selectedOption,
          questions: history.location.state.course_wise_videos[0].chapter_wise_mcq,
          question_paper_response:
            history.location.state.course_wise_videos[0].question_paper,
          content_related_chapter:
            history.location.state.course_wise_videos[0].content_related_chapter,
          course_wise_video: history.location.state.course_wise_videos[0].id,
          is_self_driven: true,
        };
      } else if (history.location.courseType === 'is_induction_training') {
        data = {
          question_paper: history.location.state.course_wise_videos[0].question_paper.id,
          answers: selectedOption,
          questions: history.location.state.course_wise_videos[0].chapter_wise_mcq,
          question_paper_response:
            history.location.state.course_wise_videos[0].question_paper,
          content_related_chapter:
            history.location.state.course_wise_videos[0].content_related_chapter,
          course_wise_video: history.location.state.course_wise_videos[0].id,
          is_induction_training: true,
        };
      }
      // setLoading(true);
      // axios
      //   .post(endpoints.sureLearning.applicantQuizDetails, JSON.stringify(data), {
      //     headers: {
      //       Authorization: `Bearer ${udaanToken}`,
      //       module: moduleId,
      //       'Content-Type': 'application/json',
      //     },
      //   })
      //   .then((res) => {
      //     if (res.status === 409) {
      //       setLoading(false);
      //       alert.warning("Test Already Submitted");
      //     }
      //     if (res.status === 201) {
      //       setLoading(false);
      //       setAlert("success","Test Successfully Submitted");
      //       mcqSubmitResponse();
      //       handleCloseMcqTest();
      //       return res.json();
      //     }
      //     if (res.status !== 201 && res.status !== 409) {
      //       setLoading(false);
      //       alert.warning("somthing went wrong please try again ");
      //     }
      //     return 0;
      //   });
    }
  };

  // const handlePrev = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  const handleBack = () => {
    // history.push('allCoursesAssignedByCoordinatorContent');
    history.goBack();
  };
  const BreadCrumb = sessionStorage.getItem('BreadCrumb');
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout className='accessBlockerContainer'>
        <div className={classes.parentDiv}>
          <CommonBreadcrumbs
            componentName='Sure Learning'
            childComponentName={BreadCrumb}
            isAcademicYearVisible={true}
          />
          <div className={classes.root}>
            <Grid item md={2} xs={12}>
              <Button
                variant='contained'
                size='medium'
                style={{ width: '50%', margin: '0 20px' }}
                className='cancelButton labelColor'
                // onClick={history.push('/subjectTrain')}
                onClick={handleBack}
              >
                Back
              </Button>
            </Grid>
            {/* <Stepper alternativeLabel activeStep={activeStep}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9,10,11].map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper> */}
            <Stepper alternativeLabel activeStep={activeStep}>
              {mcqQueList &&
                mcqQueList.length &&
                mcqQueList.map((label, i) => (
                  <Step
                    key={label.id}
                    onClick={() =>
                      handleTab(mcqQueList, activeStep, mcqQueList.id, '', i)
                    }
                  >
                    <StepLabel StepIconComponent={(props) => QontoStepIcon(props, i)}>
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

            <div>
              {activeStep === mcqLength.length ? (
                <div>
                  <Typography className={classes.instructions}>
                    All steps completed - you&apos;re finished
                  </Typography>
                </div>
              ) : (
                <div>
                  <Typography className={classes.instructions}>
                    {getStepContent(activeStep, mcqLength)}
                  </Typography>
                  <div>
                    {activeStep !== mcqQueList.length - 1 ? (
                      <Button
                        variant='contained'
                        color='primary'
                        style={{
                          margin: '10px',
                          // float: activeStep === mcqQueList.length - 1 ? 'right' : 'right',
                          float: 'right',
                        }}
                        onClick={() => handleNext(mcqQueList, activeStep, mcqQueList.id)}
                      >
                        {/* {activeStep === mcqQueList.length - 1 ? 'Finish' : 'Next'} */}
                        Next
                      </Button>
                    ) : null}
                    <Button
                      variant='contained'
                      color='primary'
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
