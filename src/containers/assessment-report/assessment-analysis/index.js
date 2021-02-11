import React from 'react';
import Layout from '../../Layout';
import AssessmentAnalysisUI from './assessment-analysis-ui';
import { AssessmentAnalysisContextProvider } from './assessment-analysis-context';

const AssessmentAnalysis = () => {
  return (
    <>
      <Layout>
        <AssessmentAnalysisContextProvider>
          <AssessmentAnalysisUI />
        </AssessmentAnalysisContextProvider>
      </Layout>
    </>
  );
};
export default AssessmentAnalysis;
