import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton, SvgIcon } from '@material-ui/core';
import Box from '@material-ui/core/Box';
// import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
import useStyles from './useStyles';
// import endpoints from '../../../config/endpoints';
// import axiosInstance from '../../../config/axios';
// import '../../lesson-plan/lesson-plan-view/lesson.css';
// import downloadAll from '../../../assets/images/downloadAll.svg';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const QuestionPaperCard = ({
  testTitle,
  testDescription,
  testId,
  testDuration,
  testType,
  testTotalQuestions,
  testTotalMarks,
  handleStartTest,
  test_date: testDate,
  question_paper: {
    id: questionPaperId,
    grade_name: gradeName,
    subject_name: subjects = [],
  },
}) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();

  return (
    <Paper elevation={2} className={classes.paper}>
      <div className={classes.cardWrapper}>
        <div>
          <h3 className={classes.cardTitleHeading}>{testTitle}</h3>
          <h4 className={classes.cardDescription}>
            Some test name, (This includes module)
          </h4>
        </div>
        <div className={classes.cardEasyWrapper}>
          <div>
            <div className={classes.cardDescription}>
              {[gradeName, ...(subjects || [])].join(', ')}
            </div>
            <div className={classes.cardAttemptedTextGreen}>
              Completed at &nbsp;
              {new Date(testDate).toDateString()}
            </div>
          </div>
          <Button
            className={classes.cardStartButton}
            variant='contained'
            color='primary'
            onClick={() => handleStartTest(questionPaperId)}
          >
            View more
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default QuestionPaperCard;
