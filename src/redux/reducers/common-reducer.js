import { commonActions } from '../actions/common-actions';

const INITIAL_STATE = {
  selectedYear: '' || JSON.parse(localStorage.getItem('acad_session')),
  academicYearList: [],
};

const commonReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case commonActions.ACADEMIC_YEAR_LIST:
      return {
        ...state,
        academicYearList: action.payload,
        selectedYear: action.payload?.[0],
      };
    default:
      return state;
  }
};

export default commonReducer;
