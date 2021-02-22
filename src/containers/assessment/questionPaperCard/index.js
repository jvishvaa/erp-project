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
  question_paper: { id: questionPaperId },
}) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();

  return (
    <Paper elevation={1}>
      <div className={classes.cardWrapper}>
        <div>
          <h3 className={classes.cardTitleHeading}>{testTitle}</h3>
          <h4 className={classes.cardQuestions}>
            <span className={classes.cardQuestionNumber}>{testTotalQuestions ?? 20}</span>
            Questions
          </h4>
          <p className={classes.cardAttemptedText}>Last Attempted on 23.11.21 </p>
        </div>
        <div className={classes.cardEasyWrapper}>
          <div className={classes.cardDifficulty}>E</div>
          <Button
            className={classes.cardStartButton}
            variant='contained'
            color='primary'
            onClick={() => handleStartTest(questionPaperId)}
          >
            Start
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default QuestionPaperCard;
