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
    fetchAssessmentQp({ assessment_id: 3 });
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
    2: () => <DescriptiveQuestion />,
    3: () => <FillUpsQuestion />,
    5: () => <McqQuestion />,
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
          <div>
            <button type='button' onClick={start}>
              Start
            </button>
          </div>
        )}
      </Container>
    </>
  );
};
export default withRouter(ViewAssessmentUI);
