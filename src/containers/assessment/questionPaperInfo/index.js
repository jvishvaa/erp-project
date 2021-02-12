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
import './questionPaperInfo.css';
// import endpoints from '../../../config/endpoints';
// import axiosInstance from '../../../config/axios';
// import '../../lesson-plan/lesson-plan-view/lesson.css';
// import downloadAll from '../../../assets/images/downloadAll.svg';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const QuestionPaperInfo = ({
  // period,
  // setPeriodDataForView,
  // setViewMoreData,
  // setViewMore,
  // viewMore,
  // filterDataDown,
  // setLoading,
  // index,
  // setCompletedStatus,
  // periodColor,
  // setPeriodColor,
  // setSelectedIndex,
  // centralGradeName,
  // centralSubjectName,
  handleCloseInfo,
}) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  //   const classes = useStyles();

  return (
    <Paper>
      <div className='testInfo'>
        <div className='closeContainer'>
          <a className='spanClose' onClick={handleCloseInfo} />
        </div>
        <div className='testInfoHeader'>
          <div>
            <h3 className='cardTitleHeading'>Paragraph Writing</h3>
            <h4 className='cardQuestions'>Practice Questions</h4>
          </div>
          <div className='cardEasyWrapper'>
            <div className='cardDifficulty'>E</div>
            <div>Accuracy: 70%</div>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default QuestionPaperInfo;
