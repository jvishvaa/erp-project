import { commonActions } from '../actions/common-actions';

const INITIAL_STATE = {
  selectedYear: '' || JSON.parse(sessionStorage.getItem('acad_session')),
  academicYearList: '' || JSON.parse(sessionStorage.getItem('acad_session_list')),
  isMsAPIKey: !!JSON.parse(localStorage.getItem('isMsAPI')),
  erpConFigKey: !!JSON.parse(localStorage.getItem('erp_config')),
};

export const getDefaultYear = (data) => {
  return data.filter(({ is_current_session = false }) => Boolean(is_current_session))[0];
};

const commonReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case commonActions.ACADEMIC_YEAR_LIST:
      return {
        ...state,
        academicYearList: action.payload,
        selectedYear: getDefaultYear(action.payload) || action.payload[0],
      };
    case commonActions.SELECTED_YEAR:
      return {
        ...state,
        selectedYear: action.payload,
      };
    case commonActions.MS_API:
      return {
        ...state,
        isMsAPIKey: action.payload,
      };
    case commonActions.ERP_CONFIG:
      return {
        ...state,
        erpConFigKey: action.payload,
      };
    default:
      return state;
  }
};

export default commonReducer;
