import { assessmentReportActions } from '../actions';

const INITIAL_STATE = {
  selectedYear: {},
  selectedBranch: {},
  selectedGrade: {},
  selectedSubject: {},
  selectedTest: {},
  selectedReportType: {},
  assessmentReportListData: [],
};

const assessmentReportReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case assessmentReportActions.SET_REPORT_TYPE:
      return { ...state, selectedReportType: action.payload };
    case assessmentReportActions.ASSESSMENT_REPORT_LIST_DATA_REQUEST:
      return { ...state, assessmentReportListData: [] };
    case assessmentReportActions.ASSESSMENT_REPORT_LIST_DATA_SUCCESS:
      return { ...state, assessmentReportListData: action.payload };
    case assessmentReportActions.ASSESSMENT_REPORT_LIST_DATA_FAILURE:
      return { ...state, assessmentReportListData: action.payload };
    case assessmentReportActions.SET_REPORT_FILTERS:
      return { ...state, [action.filter]: action.data };
    case assessmentReportActions.SET_CLEAR_FILTERS:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

export default assessmentReportReducer;
