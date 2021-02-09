import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import endpoints from '../../../../config/endpoints';
import useFetcher from '../../../../utility-functions/custom-hooks/use-fetcher';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';

const {
  assessment: {
    userAssessmentQuestionAnalysis: userAssessmentQuestionAnalysisAPIEndpoint,
    assessmentAnalysisTeacherExcel: assessmentAnalysisTeacherExcelAPIEndpoint,
  } = {},
} = endpoints || {};

export const AssessmentAnalysisContext = createContext();

export const AssessmentAnalysisContextProvider = ({ children, ...restProps }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  // eslint-disable-next-line no-console
  console.log(restProps);
  const assessmentQuestionAnalysisHookProps = {
    url: userAssessmentQuestionAnalysisAPIEndpoint,
    dataType: 'array',
    defaultQueryParamObj: {},
    fetchOnLoad: false,
    includeAuthtoken: true,
    isCentral: true,
  };
  const [assessmentQuestionAnalysis, fetchAssessmentQuestionAnalysisHook] = useFetcher(
    assessmentQuestionAnalysisHookProps
  );
  const fetchAssessmentQuestionAnalysis = (params = {}, callbacks = {}) => {
    const { user, assessment_id: assessmentId } = params || {};
    if (!user || !assessmentId) {
      // eslint-disable-next-line no-alert
      window.alert('param not fed');
      return null;
    }
    const dataProp = {
      queryParamObj: { user, assessment_id: assessmentId },
      callbacks,
    };
    fetchAssessmentQuestionAnalysisHook(dataProp);
    return null;
  };
  const [teacherExcelReport, setTeacherExcelReport] = useState({});
  const downloadTeacherExcelReport = () => {
    const apiURL = `${assessmentAnalysisTeacherExcelAPIEndpoint}?type=1`;
    setTeacherExcelReport({ fetching: true, fetchFailed: false });
    axios
      .get(apiURL, {
        responseType: 'blob',
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((response) => {
        setTeacherExcelReport({ fetching: false, fetchFailed: false });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'user-rport.xls'); // or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        setTeacherExcelReport({
          fetching: false,
          fetchFailed: true,
          message: err.message,
        });
        // eslint-disable-next-line no-alert
        setAlert('error', `${err.message}`);
        // window.alert('Failed to download report');
      });
  };
  return (
    <AssessmentAnalysisContext.Provider
      value={{
        assessmentQuestionAnalysis,
        fetchAssessmentQuestionAnalysis,

        teacherExcelReport,
        downloadTeacherExcelReport,
      }}
    >
      {children}
    </AssessmentAnalysisContext.Provider>
  );
};
