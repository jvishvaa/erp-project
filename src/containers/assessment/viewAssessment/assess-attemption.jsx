import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Grid } from '@material-ui/core';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import SidebarCounterPanel from './sidebarCounterPanel';
import GeneralGuide from './generalGuide';
import { AssessmentHandlerContext } from '../assess-attemption/assess-attemption-context';
import './assess-attemption.css';

import QuestionHandler from './question-handler/question-handler';

const AssessmentAttemptionUI = (props) => {
  const {
    match: {
      params: { assessmentId },
    },
  } = props || {};
  const {
    assessmentDetails: {
      question_paper__grade_name: questionPaperGradeName,
      question_paper__subject_name: subjectNames = [],
    } = {},
    assessmentQp: { fetching } = {},
    fetchAssessmentQp,
    controls: { isStarted, start } = {},
  } = useContext(AssessmentHandlerContext) || {};
  React.useEffect(() => {
    fetchAssessmentQp({ assessment_id: assessmentId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const {
  //   test_duration: testDuration,
  //   question_paper__grade_name: questionPaperGradeName,
  //   question_paper__subject_name: subjectNames = [],
  //   test_name: assessmentTitle,
  // } = assessmentDetails || {};
  // const description = [questionPaperGradeName, ...(subjectNames || [])].join(', ');
  return (
    <>
      {fetching ? <Loading message='Loading...' /> : null}
      <Container>
        <CommonBreadcrumbs
          componentName='Assessment'
          {...(questionPaperGradeName
            ? { childComponentName: questionPaperGradeName }
            : {})}
          {...(subjectNames && subjectNames.length
            ? { childComponentNameNext: subjectNames[0] }
            : {})}
        />
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
export default withRouter(AssessmentAttemptionUI);
