import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Grid } from '@material-ui/core';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import SidebarCounterPanel from './sidebarCounterPanel';
import GeneralGuide from './generalGuide';
import { AssessmentHandlerContext } from '../assess-attemption/assess-attemption-context';
import './viewAssessment.css';

import QuestionHandler from './question-handler/question-handler';

const ViewAssessmentUI = (props) => {
  const {
    match: {
      params: { assessmentId },
    },
  } = props || {};
  const {
    assessmentQp: { fetching },
    fetchAssessmentQp,

    // questionsDataObj,
    // questionsArray,
    controls: {
      //   selectQues,
      //   nextQues,
      //   prevQues,
      //   attemptQuestion,
      isStarted,
      // currentQuesionId,
      start,
      //   startedAt,
    },
  } = useContext(AssessmentHandlerContext);
  React.useEffect(() => {
    fetchAssessmentQp({ assessment_id: assessmentId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};
  // const {
  //   id: qId,
  //   question_type: questionType,
  //   meta: { index: qIndex } = {},
  //   user_response: { attemption_status: attemptionStatus } = {},
  // } = currentQuestionObj || {};

  return (
    <>
      {fetching ? <Loading message='Loading...' /> : null}
      <Container>
        <CommonBreadcrumbs componentName='Assessment' childComponentName='English' />
        {isStarted ? (
          <Grid container spacing={2}>
            <Grid item md={9} xs={12}>
              <div className='main-question-panel'>
                <QuestionHandler />
              </div>
            </Grid>
            <Grid item md={3} xs={12}>
              <SidebarCounterPanel />
            </Grid>
          </Grid>
        ) : (
          <div className='instruction-screen-wrapper'>
            <div className='instruction-screen'>
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
