import React from 'react';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton } from '@material-ui/core';
import { ContainerContext } from '../../../Layout';
import useStyles from './useStyles';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Badge } from 'antd';

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
  test_type_name,
}) => {
  const themeContext = useTheme();
  // const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { containerRef } = React.useContext(ContainerContext);
  const classes = useStyles();
  console.log('treehandleview', handleViewMore, testId)

  const {
    id: questionPaperId,
    grade_name: gradeName,
    subject_name: subjects = [],
  } = questionPaperObj || {};

  return (
    <Paper elevation={2} className={classes.paper} style={{ background: test_mode == 2 ? '#eaeaea' : '' }} >
      <Badge.Ribbon text={test_type_name}>
      <div className={classes.cardWrapper}>      
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop:'5%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}>
            <h3 className={classes.cardTitleHeading}  >{testTitle}</h3>
            <h4>{test_mode == 1 ? "Online" : test_mode == 2 ? "Offline" : ''}</h4>
          </div>
          {/* <h4 className={classes.cardDescription}> */}
            {/* Some test name, (This includes module) */}
            {/* {testDescription} */}
          {/* </h4> */}
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
            {testDate && <div className={classes.cardAttemptedTextRed}>
              Start Time - &nbsp;
              {testDate?.slice(11, 16)}
            </div>}
            {isTestAttempted ? (
              <>
                {test_mode == 2 ?
                  (testDate ? <div className={classes.cardAttemptedTextGreen}>
                    Completed at - &nbsp;
                    {new Date(testDate).toDateString()}
                  </div> : '' )
                  : <div className={classes.cardAttemptedTextGreen}>
                    Completed at - &nbsp;
                    {new Date(testAttemptedDate).toDateString()}
                  </div>}
              </>
            ) : (
             
              ( testDate ? (<div className={classes.cardAttemptedTextRed}>
                Scheduled at - &nbsp;
                {new Date(testDate).toDateString()}
              </div>) : '')
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
      </Badge.Ribbon>
    </Paper>
  );
};

export default QuestionPaperCard;
