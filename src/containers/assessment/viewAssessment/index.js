import React from 'react';
import { withRouter } from 'react-router-dom';
import { AssessmentHandlerContextProvider } from '../assess-attemption/assess-attemption-context';
import ViewAssessmentUI from './viewAssessment';
import Layout from '../../Layout';

const ViewAssessment = (props) => {
  const { match: { params: { assessmentId } = {} } = {} } = props || {};
  return (
    <>
      <Layout>
        <AssessmentHandlerContextProvider assessmentId={assessmentId}>
          <ViewAssessmentUI />
        </AssessmentHandlerContextProvider>
      </Layout>
    </>
  );
};
export default withRouter(ViewAssessment);
