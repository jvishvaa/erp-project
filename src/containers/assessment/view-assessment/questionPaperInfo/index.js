/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect, useState } from 'react';
import { Paper, Button } from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';
import { withRouter } from 'react-router-dom';
import { timeDeltaDiff } from '../../../../utility-functions';
import QuestionReview from './questions-review';
import toddlerGroup from '../../../../assets/images/toddler-group.svg';

import { AssessmentReviewContext } from '../../assess-attemption/assess-review-context';

import './questionPaperInfo.css';
import useStyles from './useStyles';

const QuestionPaperInfo = ({ assessmentId, handleCloseInfo, ...restProps }) => {
  const [subQuestionsData, setsubQuestionData] = useState([])
  const classes = useStyles();
  const {
    assessmentId: assessmentIdFromContext = null,
    setAssessmentId,
    assessmentResult: {
      data: {
        instructions: testInstructions,
        descriptions: testDescription,
        test_name: testTitle,
        test_date: testDate,
        // id: assessmentId,
        question_paper: {
          // id: assessmentId = undefined,
          id: questionPaperId,
          grade_name: gradeName,
          subject_name: subjects = [],
        } = {},
        total_mark: totalMarks,
        obtained_mark: obtainedMarks,
        analysis = {},
        user_response: userResponseObj,
        test_duration: testDuration,
      } = {},
      fetching,
      fetchFailed,
      message,
    } = {},
    questionsArray,
  } = useContext(AssessmentReviewContext) || {};
  useEffect(() => {
    countSubQuestions()
  }, [questionsArray])
  const countSubQuestions = () => {
    let data = 0;
    questionsArray.map((e) => {
      if (e.sub_question_answer?.length) {
        data = data + e.sub_question_answer?.length
      }
      setsubQuestionData(data)
    }
    )
  }
  const testEndTime = new Date(testDate).getTime() + testDuration * 60 * 1000;

  const isTestAttempted = !!userResponseObj;
  const {
    attempt_question: attemptedQuestions,
    correct_answer: correctAnswers,
    end_time: endTime,
    start_time: startTime,
    total_question: totalQuestions,
    wrong_answer: wrongAnswer,
  } = analysis || {};

  // const timeTakenForTest = timeDeltaDiff(new Date(endTime), new Date(startTime), true);
  // const themeContext = useTheme();
  // const { setAlert } = useContext(AlertNotificationContext);
  // const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const getTestStatus = () => {
    return new Date(testDate).getTime() <= new Date().getTime();
  }

  useEffect(() => {
    if (assessmentIdFromContext !== assessmentId) {
      setAssessmentId(assessmentId);
    }
  }, []);

  const testAnalysisRouteBtn = (
    <>
      <div style={{ display: 'flex' }}>
        <Button
          //  className={classes.customHover}
          variant='contained'
          color='primary'
          style={{
            padding: '0.3rem 1rem',
            borderRadius: '0.6rem',
            fontSize: '0.9rem',
            margin: 'auto',
          }}
          onClick={() => {
            restProps.history.push(`/assessment/${questionPaperId}/${assessmentId}/analysis/`);
          }}
        >
          Details
        </Button>
      </div>
      <br />
    </>
  );
  const assessmentAnalysis = (
    <>
      <div className={classes.analysisWrapper}>
        <h3 className={classes.cardTitleHeading}>Assessment Analysis</h3>
        <div className={classes.analysisContainer}>
          <div className={classes.scoreBoard}>
            <div className={classes.scoreContainer}>
              <div className={classes.scoreGain}>{obtainedMarks || 0}</div>
              <div className={classes.scoreOutOf}>
                Out of
                {` ${totalMarks}`}
              </div>
            </div>
            <div className={classes.timeTakenContainer}>
              <div className={classes.timeTakenLabel}>You took</div>
              <div className={classes.timeTaken}>
                {`${timeDeltaDiff(new Date(endTime), new Date(startTime), true)?.minutes
                  }`}
                <span className={classes.timeUnits}>min</span>
                {` ${timeDeltaDiff(new Date(endTime), new Date(startTime), true)?.seconds
                  }`}
                <span className={classes.timeUnits}>secs</span>
              </div>
            </div>
          </div>
          <div className={classes.marksBarContainer}>
            <div className={classes.marksBar}>
              <div>Correct </div>
              <div>{correctAnswers}</div>
            </div>
            <div className={classes.marksBar}>
              <div>Wrong</div>
              <div>{wrongAnswer}</div>
            </div>
            <div className={classes.marksBar}>
              <div>No. of Questions</div>
              <div>{totalQuestions || (questionsArray && questionsArray.length)}</div>
            </div>
            <div className={classes.marksBar}>
              <div>Ques. Attempted</div>
              <div>{attemptedQuestions}</div>
            </div>
            <div className={classes.marksBar}>
              <div>SubQuestion</div>
              <div>{subQuestionsData}</div>
            </div>
          </div>
          <div className={classes.toddlerContainer}>
            <div className={classes.toddlerWrapper}>
              <img className={classes.toddler} alt='toddler' src={toddlerGroup} />
            </div>
          </div>
        </div>
        <QuestionReview />
      </div>
      {testAnalysisRouteBtn}
    </>
  );
  const headersUI = (
    <>
      <div className='closeContainer'>
        <a className='spanClose' onClick={handleCloseInfo}>
          &nbsp;
        </a>
      </div>
      <div className={classes.testInfoHeader}>
        <div>
          <h3 className={classes.cardTitleHeading}>
            {testTitle || (fetching ? 'Loading...' : fetchFailed ? `${message}` : '')}
          </h3>
          <h4 className={classes.cardDescription}>
            {[gradeName, ...(subjects || [])].join(', ')}
          </h4>
        </div>
        <div className={classes.cardDate}>
          {`${isTestAttempted ? 'Appeared on' : 'Scheduled at'} \n ${new Date(testDate).toDateString() || (fetching ? 'Loading...' : '')
            }`}
        </div>
      </div>
    </>
  );
  const takeTestUI = (
    <div style={{ padding: '10px' }}>
      <div>
        <h4 className={classes.cardTitleHeading}>Description:</h4>
        <div>
          &nbsp; &nbsp;
          {ReactHtmlParser(testDescription)}
        </div>
      </div>
      <div>
        <h4 className={classes.cardTitleHeading}>Instructions</h4>
        <div>
          &nbsp; &nbsp;
          {ReactHtmlParser(testInstructions)}
        </div>
      </div>
      {questionsArray && questionsArray.length ? (
        <div>
          <h4 className={classes.cardTitleHeading}>
            No of questions: &nbsp;
            {questionsArray && questionsArray.length}
          </h4>
        </div>
      ) : null}
      <div style={{ display: 'flex' }}>
        {/* <Button
          style={{
            padding: '0.3rem 1rem',
            borderRadius: '0.6rem',
            fontSize: '0.9rem',
            margin: 'auto',
          }}
          disabled={!questionPaperId}
          onClick={() => {
            restProps.history.push(`/assessment/${questionPaperId}/attempt/`);
          }}
        >
          Take Test
        </Button> */}
        {testEndTime < new Date().getTime() ? (
          <Button
            style={{
              padding: '0.3rem 1rem',
              borderRadius: '0.6rem',
              fontSize: '0.9rem',
              margin: 'auto',
            }}
            disabled
          // onClick={() => {
          //   restProps.history.push(`/assessment/${questionPaperId}/attempt/`);
          // }}
          >
            Not Attempted
          </Button>
        ) : (
          <Button
            variant='contained'
            color='primary'
            style={{
              padding: '0.3rem 1rem',
              borderRadius: '0.6rem',
              fontSize: '0.9rem',
              margin: 'auto',
            }}
            disabled={!getTestStatus()}
            onClick={() => {
              // Object.entries(localStorage).forEach(([key, value]) => {
              //   if (key?.startsWith('assessment-')) {
              //     localStorage.removeItem(key);
              //   }
              // });
              restProps.history.push(`/assessment/${questionPaperId}/${assessmentId}/attempt/`);
            }}
          >
            {getTestStatus() ? 'Take Test' : 'Not Started'}
          </Button>
        )}
      </div>
      {/* <br /> */}
    </div>
  );
  return (
    <Paper elevation={2} className={classes.paper}>
      <div className={classes.testInfo}>
        {headersUI}
        {isTestAttempted ? assessmentAnalysis : takeTestUI}
        {/* {takeTestUI} */}
      </div>
    </Paper>
  );
};

export default withRouter(QuestionPaperInfo);
