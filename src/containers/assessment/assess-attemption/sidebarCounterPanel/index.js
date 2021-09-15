/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useState } from 'react';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { makeStyles , Typography} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import GeneralGuide from '../generalGuide';
import TimerComponent from './timer';
import { AssessmentHandlerContext } from '../assess-attemption-context';
import './sidebarPanel.css';
import ConfirmModal from './confirm-modal';

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
  cardTitleHeading : {
    marginTop: "0px",
    marginTottom: "0px",
    color: theme.palette.primary.main,
    fontSize: "15px",
  },
  sidebarPanel:{
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '5px',
    padding: '10px',
  },
  box:{
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '5px',
    background: '#fff',
    color: theme.palette.secondary.main,
    cursor: 'pointer',
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ongoing:{
    outline: `1px solid ${theme.palette.primary.main}`,
    outlineOffset: '3px',
    background: '#d277ff',
    color: 'white',
  },
  outlined:{
    border: `1px solid ${theme.palette.primary.main}`,
    background: '#fff',
    color: theme.palette.secondary.main,
    fontSize: '16px',
    letterSpacing: '0px',
  },
  demobox:{
    width: '20px',
    height: '20px',
    borderRadius:'2px',
    border: ` 1px solid ${theme.palette.primary.main}`,
  },
  green:{
    background: '#7fd400',
    color: '#fff',
    border: '0px',
  },
  sidebarOngoing:{
    outline: `1px solid ${theme.palette.secondary.main}`,
  outlineOffset: '3px',
  background: '#d277ff',
  color: 'white',
  },
  h6text:{
    borderBottom: '1px solid #c4c4c4',
  color: theme.palette.secondary.main,
  marginTop: '0px',
  fontSize: '14px',
  marginBottom: '15px',
  }

}));
const SidebarCounterPanel = (props) => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [isAutoSubmit, setIsAutoSubmit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
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
        setAlert(
          'success',
          isAutoSubmit ? 'Test timed out! Thanks for taking the test.' : `${message}`
        );
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
    if (isAutoSubmit) {
      submitTheResult(true);
      Object.entries(localStorage).forEach(([key, value]) => {
        if (key?.startsWith('assessment-')) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [isAutoSubmit]);

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
    <div className={classes.sidebarPanel}>
      <div className='sidebar-panel-wrapper'>
        <div className='sidebar-content'>
          <h4 className={classes.cardTitleHeading}>
            {[assessmentTitle, ...(sectionName ? [`sec-${sectionName}`] : [])].join(
              ', '
            ) || 'NA'}
          </h4>
          <h5>{description || ''}</h5>
        </div>
        {testDuration ? (
          <TimerComponent
            startedAt={startedAt}
            submit={submitTheResult}
            setIsAutoSubmit={setIsAutoSubmit}
            duration={testDuration}
          />
        ) : null}
      </div>
      <div className='sidebar-question-list'>
        <h6 className = {classes.h6text}>Question List</h6>
        <div className='sidebar-box-wrapper'>
          {questionsArray.map((ques, index) => {
          let classAsPerStatus = "";
          let classsesObj = { true: `${classes.green}`, false: `${classes.sidebarOngoing}`, null: '' }; 
          if(ques.sub_questions.length>0){
           let flag="null"
           ques.sub_questions.map((sub,key)=>{
             let assessmentKey=localStorage.getItem("assessment")
            //  console.log(assessmentKey,"ass")
            //  console.log(localStorage.getItem(assessmentKey),"koll")
            //  console.log(typeof localStorage.getItem(assessmentKey))
            //  console.log(JSON.parse(localStorage.getItem(assessmentKey)),"multibrancj")
             let storageValue=JSON.parse(localStorage.getItem(assessmentKey))
            //  console.log(storageValue,"==>")
             if(storageValue?.questions[sub.id].user_response.attemption_status){
              flag="true"
            }
            else{
              flag="null"
            }
          }) 
          classAsPerStatus = classsesObj[flag];
          } 
          else{
            const {
              user_response: { attemption_status: attemptionStatus },
            } = ques || {};
             classAsPerStatus = classsesObj[attemptionStatus];
           }
              return (
                <div
                key={ques.id}
                onClick={() => {
                  selectQues(ques.id);
                }}
                className={[
                  `${classes.box}`,
                  classAsPerStatus,
                  currentQuesionId == ques.id ? `${classes.sidebarOngoing}` : '',
                ].join(' ')}
              >
                {` ${index + 1}`}
              </div>
            );
          })}
        </div>
      </div>
      <div className='sidebar-legend'>
        <h6 className =  {classes.h6text}>Legends</h6>
        <div className='sidebar-box-wrapper'>
          <div className='box'>
            <div className={`${classes.demobox} ${classes.green}`} /> Attempted
          </div>
          {/* <div className='box'>
            <div className='demo-box purple' /> Incomplete
          </div> */}
          <div className='box'>
            <div className={classes.demobox} /> Unattempted
          </div>
          <div className='box'>
            <div className={`${classes.demobox} ${classes.sidebarOngoing}`} /> Ongoing.&nbsp;&nbsp;&nbsp;.
          </div>
        </div>
        <Typography color = "secondary">Note: Only attempted questions will be considered for review.</Typography>
      </div>
      <div className='sidebar-button-wrapper'>
        <Button
          className={classes.outlined}
          color='secondary'
          onClick={handleOpen}
        >
          Instructions
        </Button>
        <Button
          className='contained'
          variant='contained'
          color='primary'
          style = {{color : 'white'}}
          // disabled={!isReadyToSubmit}
          onClick={() => {
            setOpenModal(true);
          }}
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

      {openModal && (
        <ConfirmModal
          submit={() => submitTheResult()}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
};

export default withRouter(SidebarCounterPanel);
