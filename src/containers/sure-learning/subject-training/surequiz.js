import React, { useContext, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Check from '@material-ui/icons/Check';
import SettingsIcon from '@material-ui/icons/Settings';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import StepConnector from '@material-ui/core/StepConnector';
import { Link, useHistory } from 'react-router-dom';
import axiosInstance from '../../../config/axios';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import MatchTheFollowing from './quiz'; 
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

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

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#784af4',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
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
  {
    title: 'Question 2?',
    score: 10,
    done: false,
    code: `<div>
            <div>aooo</div>
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
  {
    title: 'Question 3?',
    score: 10,
    done: false,
    code: `<div>
            <div>kyjcvbjlkCiaooo</div>
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
  const steps = getSteps();
  const history = useHistory();

  const selectAnswerHandler = (indexQuestion, indexAnswer) => {
    const questions = this.state.questions.slice(0);
    questions[indexQuestion].givenAnswer = indexAnswer;
    questions[indexQuestion].done = true;
    this.setState({ questions });
  };
  const handleChange = (e) => {
    SetinitialValue(e.target.value);
    console.log(e.target.value,'hai')
  };
  const handleClick = () => {};
  const handleMatrixMcq = () => {};
  function getSteps() {
    return ['Select campaign settings', 'Create an ad group', 'Create an ad'];
  }


  function handleTab(quesLen, stepLen, ql, marks, index, attempted) {
   const count =0;
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
  const mcqQueList = JSON.parse(sessionStorage.getItem('Quiz'));
  // const mcqQueList=mcqQue[0].type_question.question_type_name
  const mcqLength = mcqQueList.length;
  console.log(mcqLength, 'mcqLength');
  console.log('Quiz', mcqQueList);
  console.log('Quizdata', mcqQueList.length);
  function getStepContent(stepIndex, mcqLength) {
    console.log('ids', stepIndex, 'inductionlen', mcqLength);
    if (stepIndex < mcqLength) {
      switch (stepIndex) {
        case stepIndex:
          return (
            <Grid container spacing={2} id={stepIndex + 280} style={{ textAlign: 'center' }}>
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
                                          // checked={!!(itemData.option === (choiceMatrixAns && choiceMatrixAns.length !== 0 && choiceMatrixAns[index].correctAnswer && choiceMatrixAns[index].correctAnswer))}
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
 
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleSubmit = ()=> {
    alert('quiz-completed successfully')
    history.push('/allchapterContentSubject')
  }
  const handlePrev = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleBack = () => {
    // history.push('/allchapterContentSubject');
    history.goBack();
  };

  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='courses'
          childComponentName='Quiz'
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
          
          <Stepper alternativeLabel activeStep={activeStep}>
            {mcqQueList &&
              mcqQueList.length &&
              mcqQueList.map((label, i) => (
                <Step
                  key={label.id}
                  onClick={() => handleTab(mcqQueList, activeStep, mcqQueList.id, '', i)}
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
                <Button onClick={handleReset} className={classes.button}>
                  Reset
                </Button>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}>
                  {getStepContent(activeStep, mcqLength)}
                </Typography>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handlePrev}
                    className={classes.button}
                  >
                    Previous
                  </Button>
                  {/* <Button
                    variant='contained'
                    color='primary'
                    onClick={handleNext
                    
                    }
                    className={classes.button}
                  >
                    {activeStep === mcqLength - 1
                      ? 'Finish'
                      : 'Next'}
                  </Button> */}
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}


