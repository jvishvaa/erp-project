import { teacherHomeworkActions } from '../actions';

const INITIAL_STATE = {
  homeworkRows: [],
  homeworkCols: [],
  fetchingTeacherHomework: false,
  selectedHomework: null,
  selectedHomeworkDetails: null,
  fetchingSelectedHomeworkDetails: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case teacherHomeworkActions.FETCH_TEACHER_HOMEWORK_REQUEST:
      return { ...state, fetchingTeacherHomework: true };
    case teacherHomeworkActions.FETCH_TEACHER_HOMEWORK_SUCCESS:
      return {
        ...state,
        homeworkRows: action.data.homeworkRows,
        homeworkCols: action.data.homeworkColumns,
        fetchingTeacherHomework: false,
      };
    case teacherHomeworkActions.FETCH_TEACHER_HOMEWORK_FAILURE:
      return {
        ...state,
        fetchingTeacherHomework: false,
      };
    case teacherHomeworkActions.SET_SELECTED_HOME_WORK:
      return { ...state, selectedHomework: action.data };

    case teacherHomeworkActions.FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_REQUEST:
      return { ...state, fetchingSelectedHomeworkDetails: true };

    case teacherHomeworkActions.FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_SUCCESS:
      return {
        ...state,
        fetchingSelectedHomeworkDetails: false,
        selectedHomeworkDetails: action.data,
      };

    case teacherHomeworkActions.FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_FAILURE:
      return {
        ...state,
        fetchingSelectedHomeworkDetails: false,
      };
    default:
      return state;
  }
}
