import React from 'react';
import { withRouter } from 'react-router-dom';
import { AssessmentHandlerContextProvider } from '../assess-attemption/assess-attemption-context';
import AssessmentAttemptionUI from './assess-attemption';
import Layout from '../../Layout';

const AssessmentAttemption = (props) => {
  const { match: { params: { assessmentId } = {} } = {} } = props || {};
  return (
    <>
      <Layout>
        <div style={{ height: '100%' }}>
          <AssessmentHandlerContextProvider assessmentId={assessmentId}>
            <AssessmentAttemptionUI />
          </AssessmentHandlerContextProvider>
        </div>
      </Layout>
    </>
  );
};
export default withRouter(AssessmentAttemption);
