import React from 'react';
import { AssessmentHandlerContextProvider } from '../assess-attemption/assess-attemption-context';
import ViewAssessmentUI from './viewAssessment';
import Layout from '../../Layout';

const ViewAssessment = () => {
  return (
    <>
      <Layout>
        <AssessmentHandlerContextProvider>
          <ViewAssessmentUI />
        </AssessmentHandlerContextProvider>
      </Layout>
    </>
  );
};
export default ViewAssessment;
