import axios from 'axios';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';

export const assessmentReportActions = {
  ASSESSMENT_REPORT_LIST_DATA_REQUEST: 'ASSESSMENT_REPORT_LIST_DATA_REQUEST',
  ASSESSMENT_REPORT_LIST_DATA_SUCCESS: 'ASSESSMENT_REPORT_LIST_DATA_SUCCESS',
  ASSESSMENT_REPORT_LIST_DATA_FAILURE: 'ASSESSMENT_REPORT_LIST_DATA_FAILURE',

  SET_REPORT_TYPE: 'SET_REPORT_TYPE',
  SET_CLEAR_FILTERS: 'SET_CLEAR_FILTERS',
};

const {
  ASSESSMENT_REPORT_LIST_DATA_REQUEST,
  ASSESSMENT_REPORT_LIST_DATA_SUCCESS,
  ASSESSMENT_REPORT_LIST_DATA_FAILURE,
  SET_REPORT_TYPE,
  SET_CLEAR_FILTERS,
} = assessmentReportActions;

function request(type) {
  return {
    type,
  };
}

function success(type, payload) {
  return {
    type,
    payload,
  };
}

function failure(type, payload) {
  return {
    type,
    payload,
  };
}

function reportTypeURL(reportTypeId) {
  let url = '';
  switch (reportTypeId) {
    case 1:
      url = `${endpoints.assessmentReportTypes.reportSectionWise}`;
      break;
    case 2:
      url = `${endpoints.assessmentReportTypes.reportTopicWise}`;
      break;
    case 3:
      url = `${endpoints.assessmentReportTypes.reportClassAverage}`;
      break;
    case 4:
      url = `${endpoints.assessmentReportTypes.reportTopicStudentAverage}`;
      break;
    default:
      url = `${endpoints.assessmentReportTypes.reportSectionWise}`;
      break;
  }
  return url;
}

export const setClearFilters = () => ({
  type: SET_CLEAR_FILTERS,
});

export const setReportType = (reportType) => ({
  type: SET_REPORT_TYPE,
  payload: reportType,
});

export const fetchAssessmentReportList = (reportType, params) => (dispatch) => {
  dispatch(request(ASSESSMENT_REPORT_LIST_DATA_REQUEST));
  if (reportType?.id) {
    let url = `${reportTypeURL(reportType?.id)}`;
    if (params) url += `${params}`;
    return axios
      .get(url, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          let payload = result.data?.data;
          dispatch(success(ASSESSMENT_REPORT_LIST_DATA_SUCCESS, payload));
        } else {
          dispatch(failure(ASSESSMENT_REPORT_LIST_DATA_FAILURE, []));
        }
      })
      .catch((error) => {
        dispatch(failure(ASSESSMENT_REPORT_LIST_DATA_FAILURE, []));
      });
  }
};
