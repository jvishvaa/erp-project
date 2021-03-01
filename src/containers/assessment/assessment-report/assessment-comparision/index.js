import React from 'react';
import Layout from 'containers/Layout';
import AssessmentComparisionUI from './assessment-comparision-ui';
import { AssessmentComparisionContextProvider } from './assessment-comparision-context';

const AssessmentComparision = () => {
  return (
    <Layout>
      <AssessmentComparisionContextProvider>
        <AssessmentComparisionUI />
      </AssessmentComparisionContextProvider>
    </Layout>
  );
};
export default AssessmentComparision;
