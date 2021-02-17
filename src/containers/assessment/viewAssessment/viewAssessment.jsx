import React, { useState, useEffect, useContext } from 'react';
import { Container, Grid } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './viewAssessment.css';
import SidebarCounterPanel from './sidebarCounterPanel';
import McqQuestion from './mcqQuestion';
import DescriptiveQuestion from './descriptiveQuestion';
import FillUpsQuestion from './fillUpsQuestion';
import TrueFalseQuestion from './trueFalseQuestion';
import VideoQuestion from './videoQuestion';
import MatchFollowingQuestion from './matchFollowingQuestion';
import MatrixQuestion from './matrixQuestion';
import GeneralGuide from './generalGuide';
import { AssessmentHandlerContext } from '../assess-attemption/assess-attemption-context';

const ViewAssessmentUI = () => {
  const {
    assessmentQp: { fetching },
    fetchAssessmentQp,

    questionsDataObj,
    // questionsArray,
    controls: {
      //   selectQues,
      //   nextQues,
      //   prevQues,
      //   attemptQuestion,
      isStarted,
      currentQuesionId,
      start,
      //   startedAt,
    },
  } = useContext(AssessmentHandlerContext);
  React.useEffect(() => {
    fetchAssessmentQp({ assessment_id: 20 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};
  const {
    id: qId,
    question_type: questionType,
    meta: { index: qIndex } = {},
    user_response: { attemption_status: attemptionStatus } = {},
  } = currentQuestionObj || {};
  const decideQuestion = {
    1: () => <McqQuestion />,
    10: () => <DescriptiveQuestion />,
    9: () => <FillUpsQuestion />,
    8: () => <TrueFalseQuestion />,
    4: () => <VideoQuestion />,
    3: () => <MatchFollowingQuestion />,
    6: () => <MatrixQuestion />,
    undefined: () => <p>question_type undefined</p>,
    null: () => <p>question_type null</p>,
  };
  return (
    <>
      {fetching ? <Loading message='Loading...' /> : null}
      <Container>
        <CommonBreadcrumbs componentName='Assessment' childComponentName='English' />
        {isStarted ? (
          <Grid container spacing={2}>
            <Grid item md={9} xs={12}>
              <div className='main-question-panel'>
                {decideQuestion[questionType]
                  ? decideQuestion[questionType]()
                  : 'not found'}
                {/* <Button className='submit-button'></Button> */}
              </div>
            </Grid>
            <Grid item md={3} xs={12}>
              <SidebarCounterPanel />
            </Grid>
          </Grid>
        ) : (
          <div className='instruction-screen-wrapper'>
            <div className='instruction-screen'>
              {/* <h2>
                There are 20 questions with instructions given , kindly read the
                instructions before answering
              </h2>
              <div className='instruction-question'>
                <div>Q1</div>
                <div>Progress 1/20</div>
              </div>
              <p>Passage or image based questions</p>
              <div className='mcq-question-wrapper'>
                <div className='mcq-options'>Option 1</div>
                <div className='mcq-options'>Option 2</div>
                <div className='mcq-options'>Option 3</div>
                <div className='mcq-options'>Option 4</div>
              </div> */}
              <GeneralGuide />
              <button type='button' className='question-submit-btn' onClick={start}>
                Start
              </button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};
export default withRouter(ViewAssessmentUI);
