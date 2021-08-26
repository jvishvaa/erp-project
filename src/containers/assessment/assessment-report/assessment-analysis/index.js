import React from 'react';
import Layout from 'containers/Layout';
import AssessmentAnalysisUI from './assessment-analysis-ui';
import { AssessmentAnalysisContextProvider } from './assessment-analysis-context';

const AssessmentAnalysis = () => {
  return (
    <>
      <Layout>
        <div style={{ height: '100%' }}>
          <AssessmentAnalysisContextProvider>
            <AssessmentAnalysisUI />
          </AssessmentAnalysisContextProvider>
        </div>
      </Layout>
    </>
  );
};
export default AssessmentAnalysis;
