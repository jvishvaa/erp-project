import React from 'react';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton } from '@material-ui/core';
import { ContainerContext } from '../../../Layout';
import useStyles from './useStyles';
import GetAppIcon from '@material-ui/icons/GetApp';

const QuestionPaperCard = ({
  // testTitle,
  descriptions: testDescription,
  id: testId,
  is_test_completed: {
    is_completed: isTestAttempted,
    completed_date: testAttemptedDate,
  } = {},
  handleViewMore,
  downloadAssessment,
  test_date: testDate,
  test_name: testTitle,
  question_paper: questionPaperObj = {},
  test_mode,
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
  } = questionPaperObj || {};

  return (
    <Paper elevation={2} className={classes.paper} style={{background: test_mode == 2 ? '#eaeaea' : ''}} >
      <div className={classes.cardWrapper}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h3 className={classes.cardTitleHeading}>{testTitle}</h3>
          </div>
          <h4 className={classes.cardDescription}>
            {/* Some test name, (This includes module) */}
            {/* {testDescription} */}
          </h4>
          {/* <div style={{ float: 'right' }}>
            {isTestAttempted && (
              <IconButton
                style={{ padding: 0 }}
                onClick={() => downloadAssessment()}
                title='Download Assessment'
              >
                <GetAppIcon />
              </IconButton>
            )}
          </div> */}
        </div>
        <div className={classes.cardEasyWrapper}>
          <div>
            <div className={classes.cardDescription}>
              {[gradeName, ...(subjects || [])].join(', ')}
            </div>
            <div className={classes.cardAttemptedTextRed}>
              Start Time - &nbsp;
              {testDate.slice(11, 16)}
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
            style={{ color: 'white' }}
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
