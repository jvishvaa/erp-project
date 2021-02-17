/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useState, useEffect } from 'react';
import { AssessmentHandlerContext } from '../../assess-attemption/assess-attemption-context';
import './sidebarPanel.css';
import { Button } from '@material-ui/core';
// import { AssessmentHandlerContext } from '../../assess-attemption/assess-attemption-context';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import GeneralGuide from '../generalGuide';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const SidebarCounterPanel = () => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    assessmentQp: { fetching },
    fetchAssessmentQp,

    questionsDataObj,
    questionsArray,
    controls: {
      selectQues,
      nextQues,
      //   prevQues,
      attemptQuestion,
      isStarted,
      currentQuesionId,
      start,
      //   startedAt,
    },
  } = useContext(AssessmentHandlerContext);
  const { setAlert } = useContext(AlertNotificationContext);

  const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};

  const {
    id: qId,
    question_type: questionType,
    meta: { index: qIndex } = {},
    question_answer,
    topic,
    topic_name: topicName,
    user_response: { attemption_status: attemptionStatus } = {},
  } = currentQuestionObj || {};

  // const [{ answer, options, question }] = question_answer;
  const [minutes, setMinutes] = useState(60);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });
  const submitTheResult = () => {
    setAlert('Success', 'Result Submitted Successfully!');
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {/* <h2 id='simple-modal-title'>Text in a modal</h2> */}
      <p id='simple-modal-description'>
        <GeneralGuide />
      </p>
    </div>
  );
  return (
    <div className='sidebar-panel'>
      <div className='sidebar-panel-wrapper'>
        <div className='sidebar-content'>
          <h4 className='cardTitleHeading'>{topic || 'NA'}</h4>
          <h5>{topicName || 'NA'}</h5>
        </div>
        <div className='sidebar-time-counter'>
          <h4>Time Remaining</h4>
          <h5 className='counter-timer'>
            {minutes}:
{seconds}
          </h5>
        </div>
      </div>
      <div className='sidebar-question-list'>
        <h6>Question List</h6>
        <div className='sidebar-box-wrapper'>
          {questionsArray.map((ques, index) => (
            <div
              key={ques.id}
              onClick={() => {
                selectQues(ques.id);
              }}
              className={`box ${
                ques?.user_response?.attemptionStatus ? 'green' : 'purple'
              } ${currentQuesionId == ques.id ? 'ongoing' : ''}`}
            >
              {` ${index + 1}`}
            </div>
          ))}
        </div>
      </div>
      <div className='sidebar-legend'>
        <h6>Legends</h6>
        <div className='sidebar-box-wrapper'>
          <div className='box'>
            <div className='demo-box green' /> Attempted
          </div>
          <div className='box'>
            <div className='demo-box purple' /> Incomplete
          </div>
          {/* <div className='box'>
            <div className='demo-box' /> Unattempted
          </div> */}
          <div className='box'>
            <div className='demo-box purple ongoing' /> Ongoing
          </div>
        </div>
        <p>Note: Only attempted questions will be considered for review.</p>
      </div>
      <div className='sidebar-button-wrapper'>
        <Button
          className='outlined'
          color='outlined'
          color='secondary'
          onClick={handleOpen}
        >
          Instructions
        </Button>
        <Button
          className='contained'
          variant='contained'
          color='primary'
          onClick={submitTheResult}
        >
          Submit
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {body}
      </Modal>
    </div>
  );
};

export default SidebarCounterPanel;
