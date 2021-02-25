import React from 'react';
import AssessmentComparisionUI from './assessment-comparision-ui';
import Layout from '../../Layout';
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
