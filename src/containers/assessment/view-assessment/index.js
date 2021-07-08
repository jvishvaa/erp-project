import React from 'react';
import { withRouter } from 'react-router-dom';
import Layout from '../../Layout';
import { AssessmentReviewContextProvider } from '../assess-attemption/assess-review-context';
import ViewAssessmentsUI from './view-assessment';

const ViewAssessments = () => {
  return (
    <>
      <AssessmentReviewContextProvider>
        {/* <Layout> */}
        <ViewAssessmentsUI />
        {/* </Layout> */}
      </AssessmentReviewContextProvider>
    </>
  );
};

export default withRouter(ViewAssessments);
