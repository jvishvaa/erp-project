/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect } from 'react';
import { Paper, Button } from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';
import { withRouter } from 'react-router-dom';
import { timeDeltaDiff } from '../../../utility-functions';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
// import { useTheme } from '@material-ui/core';

// import toddler from '../../../assets/images/toddler.png';
// import toddlerBg from '../../../assets/images/toddler-bg.svg';
import toddlerGroup from '../../../assets/images/toddler-group.svg';

// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { AssessmentReviewContext } from '../assess-review/assess-review-context';

import './questionPaperInfo.css';
import useStyles from './useStyles';

const QuestionPaperInfo = ({ assessmentId, handleCloseInfo, ...restProps }) => {
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
        analysis = {},
        user_response: userResponseObj,
      } = {},
      fetching,
      fetchFailed,
      message,
    } = {},
    questionsArray,
  } = useContext(AssessmentReviewContext) || {};
  console.log(useContext(AssessmentReviewContext), 'useContext(AssessmentReviewContext)');

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
  useEffect(() => {
    if (assessmentIdFromContext !== assessmentId) {
      setAssessmentId(assessmentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const testAnalysisRouteBtn = (
    <>
      <br />
      <div style={{ display: 'flex' }}>
        <Button
          style={{
            padding: '0.3rem 1rem',
            borderRadius: '0.6rem',
            fontSize: '0.9rem',
            margin: 'auto',
          }}
          onClick={() => {
            restProps.history.push(`/assessment/${questionPaperId}/analysis/`);
          }}
        >
          View question wise analysis
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
              <div className={classes.scoreGain}>18</div>
              <div className={classes.scoreOutOf}>
                Out of
                {` ${totalMarks}`}
              </div>
            </div>
            <div className={classes.timeTakenContainer}>
              <div className={classes.timeTakenLabel}>You took</div>
              <div className={classes.timeTaken}>
                {`${
                  timeDeltaDiff(new Date(endTime), new Date(startTime), true)?.minutes
                }`}
                <span className={classes.timeUnits}>min</span>
                {` ${
                  timeDeltaDiff(new Date(endTime), new Date(startTime), true)?.seconds
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
              <div>{totalQuestions}</div>
            </div>
            <div className={classes.marksBar}>
              <div>Ques. attempted</div>
              <div>{attemptedQuestions}</div>
            </div>
          </div>
          <div className={classes.toddlerContainer}>
            <div className={classes.toddlerWrapper}>
              <img className={classes.toddler} alt='toddler' src={toddlerGroup} />
            </div>
          </div>
        </div>
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
          {`${isTestAttempted ? 'Appeared on' : 'Scheduled at'} \n ${
            new Date(testDate).toDateString() || (fetching ? 'Loading...' : '')
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
        <Button
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
        </Button>
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
