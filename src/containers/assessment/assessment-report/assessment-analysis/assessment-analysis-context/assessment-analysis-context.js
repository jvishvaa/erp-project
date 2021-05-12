import React, { createContext, useState } from 'react';
import axios from 'axios';
import endpoints from 'config/endpoints';
import useFetcher from 'utility-functions/custom-hooks/use-fetcher';
// import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';

const {
  assessment: {
    userAssessmentQuestionAnalysis: userAssessmentQuestionAnalysisAPIEndpoint,
    assessmentAnalysisTeacherExcel: assessmentAnalysisTeacherExcelAPIEndpoint,
  } = {},
} = endpoints || {};

export const AssessmentAnalysisContext = createContext();

// const data = {
//   status_code: 200,
//   message: 'Successfully fetched student comparison report',
//   data: {
//     levels: [
//       {
//         id: '1',
//         level_name: 'easy',
//       },
//       {
//         id: '2',
//         level_name: 'medium',
//       },
//       {
//         id: '3',
//         level_name: 'tough',
//       },
//     ],
//     categories: [
//       {
//         id: '1',
//         category_name: 'Knowledge',
//       },
//       {
//         id: '2',
//         category_name: 'Understanding',
//       },
//       {
//         id: '3',
//         category_name: 'Application',
//       },
//       {
//         id: '4',
//         category_name: 'Analyse',
//       },
//     ],
//     questions: [
//       {
//         mark: 4,
//         child_id: [1, 2, 3],
//         question: 10,
//         is_parent: 'True',
//         user_answer: ['option3', 'option4'],
//         question_type: 'MCQ_MULTIPLE_CHOICE',
//         question_level: '1',
//         question_categories: '1',
//         is_correct: true,
//       },
//       {
//         mark: 5,
//         child_id: [1, 2, 3],
//         question: 12,
//         is_parent: 'True',
//         user_answer: ['option3', 'option4'],
//         question_type: 'MCQ_SINGLE_CHOICE',
//         question_level: '3',
//         question_categories: '2',
//         is_correct: true,
//       },
//       {
//         mark: 1.6,
//         child_id: [1, 2, 3],
//         question: 5,
//         is_parent: 'True',
//         user_answer: [
//           {
//             answer1: 'an-1',
//             question1: 'abc',
//           },
//           {
//             answer2: 'an-2',
//             question2: 'baca',
//           },
//         ],
//         question_type: 'Matrix Questions',
//         question_level: '2',
//         question_categories: '3',
//         is_correct: true,
//       },
//       {
//         mark: 4,
//         child_id: [1, 2, 3],
//         question: 13,
//         is_parent: 'True',
//         user_answer: [
//           {
//             answer1: 'an-1',
//             question1: 'abc',
//           },
//           {
//             answer2: 'an-2',
//             question2: 'baca',
//           },
//         ],
//         question_type: 'Matrix Questions',
//         question_level: '2',
//         question_categories: '3',
//         is_correct: true,
//       },
//     ],
//   },
// };
export const AssessmentAnalysisContextProvider = ({ children, ...restProps }) => {
  // const { setAlert } = useContext(AlertNotificationContext);
  // eslint-disable-next-line no-console
  const assessmentQuestionAnalysisHookProps = {
    url: userAssessmentQuestionAnalysisAPIEndpoint,
    dataType: 'array',
    defaultQueryParamObj: {},
    fetchOnLoad: false,
    includeAuthtoken: true,
    isCentral: false,
  };
  const [assessmentQuestionAnalysis, fetchAssessmentQuestionAnalysisHook] = useFetcher(
    assessmentQuestionAnalysisHookProps
  );
  const fetchAssessmentQuestionAnalysis = (params = {}, callbacks) => {
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
  const downloadTeacherExcelReport = (params = {}, callbacks = {}) => {
    const { onReject = () => {} } = callbacks || {};
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
        onReject(err);
        // eslint-disable-next-line no-alert
        // setAlert('error', `${err.message}`);
        // window.alert('Failed to download report');
      });
  };
  return (
    <AssessmentAnalysisContext.Provider
      value={{
        // assessmentQuestionAnalysis: { ...assessmentQuestionAnalysis, data: data.data },
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
