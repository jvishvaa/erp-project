/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useState } from 'react';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import GeneralGuide from '../generalGuide';
import TimerComponent from './timer';
import { AssessmentHandlerContext } from '../assess-attemption-context';
import './sidebarPanel.css';
import { duration } from 'moment';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    maxWidth: '100%',
    // maxHeight: '50vh',
    // overflowY: 'auto',
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
const SidebarCounterPanel = (props) => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [toBeSubmitted, setToBeSubmitted] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    assessmentDetails: {
      test: assessmentId,
      test_duration: testDuration,
      question_paper__grade_name: questionPaperGradeName,
      question_paper__subject_name: subjectNames = [],
      test_name: assessmentTitle,
      instructions: testInstructions,
    },
    questionsMetaInfo: { is_ready_to_submit: isReadyToSubmit } = {},
    questionsArray,
    questionsDataObj,
    controls: { selectQues, currentQuesionId, submit, startedAt },
  } = useContext(AssessmentHandlerContext) || {};
  const { setAlert } = useContext(AlertNotificationContext);

  const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};

  // const { topic, topic_name: topicName } = currentQuestionObj || {};
  const { section: { name: sectionName } = {} } = currentQuestionObj || {};

  const submitTheResult = () => {
    const onSubmitSuccess = (res = {}) => {
      const { message, status_code: statusCodeResponse } = res.data || {};
      const statusCode = Number(statusCodeResponse);
      if (statusCode > 199 && statusCode < 300) {
        setAlert('Success', `${message}`);
        props.history.push(`/assessment/?info=${assessmentId}`);
        // 'Result Submitted Successfully!'
      } else {
        setAlert('error', `${message}`);
      }
    };
    const onSubmitFailure = (err) => {
      const {
        response: { statusText = 'Failed to connect to server' } = {},
        data: { message: messageFromDev } = {},
      } = err || {};
      setAlert('error', `${messageFromDev || statusText}`);
    };
    submit({ onResolve: onSubmitSuccess, onReject: onSubmitFailure });
  };

  React.useEffect(() => {
    if (toBeSubmitted) {
      submitTheResult();
      Object.entries(localStorage).forEach(([key, value]) => {
        if (key?.startsWith('assessment-')) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [toBeSubmitted]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {/* <h2 id='simple-modal-title'>Text in a modal</h2> */}
      <p id='simple-modal-description'>
        <GeneralGuide text={testInstructions} handleClose={handleClose} />
      </p>
    </div>
  );
  const description = [questionPaperGradeName, ...(subjectNames || [])].join(', ');
  return (
    <div className='sidebar-panel'>
      <div className='sidebar-panel-wrapper'>
        <div className='sidebar-content'>
          <h4 className='cardTitleHeading'>
            {[assessmentTitle, ...(sectionName ? [`sec-${sectionName}`] : [])].join(
              ', '
            ) || 'NA'}
          </h4>
          <h5>{description || 'NA'}</h5>
        </div>
        {testDuration ? (
          <TimerComponent
            startedAt={startedAt}
            submit={submitTheResult}
            setToBeSubmitted={setToBeSubmitted}
            duration={testDuration}
          />
        ) : null}
      </div>
      <div className='sidebar-question-list'>
        <h6>Question List</h6>
        <div className='sidebar-box-wrapper'>
          {questionsArray.map((ques, index) => {
            const {
              user_response: { attemption_status: attemptionStatus },
            } = ques || {};
            const classsesObj = { true: 'green', false: 'purple', null: '' };
            const classAsPerStatus = classsesObj[attemptionStatus];
            return (
              <div
                key={ques.id}
                onClick={() => {
                  selectQues(ques.id);
                }}
                className={[
                  'box',
                  classAsPerStatus,
                  currentQuesionId == ques.id ? 'ongoing' : '',
                ].join(' ')}
              >
                {` ${index + 1}`}
              </div>
            );
          })}
        </div>
      </div>
      <div className='sidebar-legend'>
        <h6>Legends</h6>
        <div className='sidebar-box-wrapper'>
          <div className='box'>
            <div className='demo-box green' /> Attempted
          </div>
          {/* <div className='box'>
            <div className='demo-box purple' /> Incomplete
          </div> */}
          <div className='box'>
            <div className='demo-box' /> Unattempted
          </div>
          <div className='box'>
            <div className='demo-box ongoing' /> Ongoing.&nbsp;&nbsp;&nbsp;.
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
          // disabled={!isReadyToSubmit}
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

export default withRouter(SidebarCounterPanel);
