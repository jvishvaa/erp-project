import React from 'react';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme } from '@material-ui/core';
import { ContainerContext } from '../../../Layout';
import useStyles from './useStyles';

const QuestionPaperCard = ({
  // testTitle,
  descriptions: testDescription,
  is_test_completed: { is_completed: isTestAttempted, completed_date: testAttemptedDate } = {},
  handleViewMore,
  test_date: testDate,
  test_name: testTitle,
  question_paper: questionPaperObj = {},
}) => {
  const themeContext = useTheme();
  // const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { containerRef } = React.useContext(ContainerContext);
  const classes = useStyles();

  const {
    id: questionPaperId,
    grade_name: gradeName,
    subject_name: subjects = [],
  } = questionPaperObj || {}

  return (
    <Paper elevation={2} className={classes.paper}>
      <div className={classes.cardWrapper}>
        <div>
          <h3 className={classes.cardTitleHeading}>{testTitle}</h3>
          <h4 className={classes.cardDescription}>
            {/* Some test name, (This includes module) */}
            {/* {testDescription} */}
          </h4>
        </div>
        <div className={classes.cardEasyWrapper}>
          <div>
            <div className={classes.cardDescription}>
              {[gradeName, ...(subjects || [])].join(', ')}
            </div>
            <div className={classes.cardAttemptedTextRed}>
                Start Time - &nbsp;
                {testDate.slice(11,16)}
              </div>
            {isTestAttempted ? (
              <div className={classes.cardAttemptedTextGreen}>
                Completed at - &nbsp;
                {new Date(testAttemptedDate).toDateString()}
              </div>
            ) : (
              <div className={classes.cardAttemptedTextRed}>
                Scheduled at - &nbsp;
                {new Date(testDate).toDateString()}
              </div>
            )}
          </div>
          <Button
            className={classes.cardStartButton}
            variant='contained'
            color='primary'
            onClick={(e) => {
              handleViewMore(questionPaperId);
              e.stopPropagation();
              if (containerRef.current) {
                containerRef.current.style.scrollBehavior = 'smooth';
                containerRef.current.scrollTo(0, 0);
              }
            }}
          >
            View more
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default QuestionPaperCard;
