/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core';

// import toddler from '../../../assets/images/toddler.png';
// import toddlerBg from '../../../assets/images/toddler-bg.svg';
import toddlerGroup from '../../../assets/images/toddler-group.svg';

import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { AssessmentReviewContext } from '../assess-review/assess-review-context';
import './questionPaperInfo.css';
import useStyles from './useStyles';

const QuestionPaperInfo = ({
  loading,
  test_name: testTitle,
  test_date: testDate,
  id: assessmentId,
  question_paper: {
    // id: assessmentId = undefined,
    // id: questionPaperId,
    grade_name: gradeName,
    subject_name: subjects = [],
  } = {},
  handleCloseInfo,
}) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const { assessmentId: assessmentIdFromContext = null, setAssessmentId } =
    useContext(AssessmentReviewContext) || {};
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  useEffect(() => {
    if (assessmentIdFromContext !== assessmentId) {
      setAssessmentId(assessmentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Paper elevation={2} className={classes.paper}>
      {/* <div className={classes.paperWrap}> */}
      <div className={classes.testInfo}>
        <div className='closeContainer'>
          <a className='spanClose' onClick={handleCloseInfo}>
            &nbsp;
          </a>
        </div>
        <div className={classes.testInfoHeader}>
          <div>
            <h3 className={classes.cardTitleHeading}>
              {testTitle || (loading ? 'Loading...' : '')}
            </h3>
            <h4 className={classes.cardDescription}>
              {[gradeName, ...(subjects || [])].join(', ')}
            </h4>
          </div>
          <div className={classes.cardDate}>
            {`Appeared on \n ${
              new Date(testDate).toDateString() || (loading ? 'Loading...' : '')
            }`}
          </div>
        </div>
        <div className={classes.analysisWrapper}>
          <h3 className={classes.cardTitleHeading}>Assessment Analysis</h3>
          <div className={classes.analysisContainer}>
            <div>18 Out of 20</div>
            <div className={classes.marksBarContainer}>
              <div className={classes.marksBar}>
                <div>Correct </div>
                <div>18</div>
              </div>
              <div className={classes.marksBar}>
                <div>Wrong</div>
                <div>18</div>
              </div>
              <div className={classes.marksBar}>
                <div>No. of Questions</div>
                <div>18</div>
              </div>
              <div className={classes.marksBar}>
                <div>Ques. attempted</div>
                <div>18</div>
              </div>
            </div>
            <div className={classes.toddlerContainer}>
              <div className={classes.toddlerWrapper}>
                <img className={classes.toddler} alt='toddler' src={toddlerGroup} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </Paper>
  );
};

export default QuestionPaperInfo;
