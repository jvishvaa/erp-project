import { teacherHomeworkActions } from '../actions';

const INITIAL_STATE = {
  homeworkRows: [],
  homeworkCols: [],
  fetchingTeacherHomework: false,
  selectedHomework: null,
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
    default:
      return state;
  }
}
