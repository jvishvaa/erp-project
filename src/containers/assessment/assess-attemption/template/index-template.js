import React from 'react';
import Layout from '../../../Layout';
import AssessmentHandlerUI from './assess-attemption-ui-template';
import { AssessmentHandlerContextProvider } from '../assess-attemption-context';

const AssessmentAttemption = () => {
  return (
    <>
      <Layout>
        <AssessmentHandlerContextProvider>
          <AssessmentHandlerUI />
        </AssessmentHandlerContextProvider>
      </Layout>
    </>
  );
};
export default AssessmentAttemption;
