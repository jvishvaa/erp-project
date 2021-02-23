/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect } from 'react';
import { Paper, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
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
  } = useContext(AssessmentReviewContext) || {};

  const isTestAttempted = !!userResponseObj;
  const {
    attempt_question: attemptedQuestions,
    correct_answer: correctAnswers,
    end_time: endTime,
    start_time: startTime,
    total_question: totalQuestions,
    wrong_answer: wrongAnswer,
  } = analysis || {};
  // const themeContext = useTheme();
  // const { setAlert } = useContext(AlertNotificationContext);
  // const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  useEffect(() => {
    if (assessmentIdFromContext !== assessmentId) {
      setAssessmentId(assessmentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const assessmentAnalysis = (
    <div className={classes.analysisWrapper}>
      <h3 className={classes.cardTitleHeading}>Assessment Analysis</h3>
      <div className={classes.analysisContainer}>
        <div>
          18 Out of &nbsp;
          {totalMarks}
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
            restProps.history.push(`/assessment/${questionPaperId}/attempt/`);
          }}
        >
          Take Test
        </Button>
      </div>
      <br />
    </>
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
