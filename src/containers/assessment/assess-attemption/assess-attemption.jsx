import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Grid } from '@material-ui/core';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import SidebarCounterPanel from './sidebarCounterPanel';
import GeneralGuide from './generalGuide';
import { AssessmentHandlerContext } from './assess-attemption-context';
import './assess-attemption.css';
import { makeStyles } from '@material-ui/core';
import QuestionHandler from './question-handler/question-handler';

const useStyles = makeStyles((theme)=>({
  mainquestionpanel:{
    border: `1px solid ${theme.palette.primary.main}`,
    padding: '10px',
    overflow:"scroll",
    borderRadius: '5px',
    color: theme.palette.secondary.main,
  },
  questionsubmitbtn:{
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: '5px',
    background: theme.palette.secondary.main,
    padding: '10px',
    width: '100%',
    textAlign: 'center',
    maxWidth: '400px',
    cursor: 'pointer',
    color: '#fff',
    marginTop: '20px',
  }
}))
const AssessmentAttemptionUI = (props) => {
  const classes = useStyles()
  const {
    match: {
      // params: { assessmentId },
      params: { questionPaperId, assessmentId },
    },
  } = props || {};
  const {
    assessmentDetails: {
      question_paper__grade_name: questionPaperGradeName,
      question_paper__subject_name: subjectNames = [],
      instructions: assessmentInstructions,
    } = {},
    assessmentQp: { fetching } = {},
    fetchAssessmentQp,
    controls: { isStarted, start } = {},
  } = useContext(AssessmentHandlerContext) || {};
  React.useEffect(() => {
    // fetchAssessmentQp({ assessment_id: assessmentId });
    fetchAssessmentQp({ question_paper_id : questionPaperId, assessment_id: assessmentId });
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
              <div className={classes.mainquestionpanel}>
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
              <GeneralGuide text={assessmentInstructions} />
              <button type='button' className={classes.questionsubmitbtn} onClick={start}>
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
