import { teacherHomeworkActions } from '../actions';

const INITIAL_STATE = {
  homeworkRows: [],
  homeworkCols: [],
  fetchingTeacherHomework: false,
  selectedHomework: null,
  selectedHomeworkDetails: null,
  fetchingSelectedHomeworkDetails: false,
  evaluatedStudents: [],
  submittedStudents: [],
  unSubmittedStudents: [],
  unevaluatedStudents: [],
  fetchingStudentLists: false,
  submittedHomeworkDetails: [],
  totalSubmittedQuestions: 0,
  isQuestionwise: true,
  collatedSubmissionFiles: [],
  fetchingSubmittedHomeworkDetails: false,
  selectedTeacherByCoordinatorToCreateHw: false,
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

    case teacherHomeworkActions.FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_REQUEST:
      return { ...state, fetchingStudentLists: true };

    case teacherHomeworkActions.FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_SUCCESS:
      return {
        ...state,
        fetchingStudentLists: false,
        evaluatedStudents: action.evaluatedStudents,
        submittedStudents: action.submittedStudents,
        unSubmittedStudents: action.unSubmittedStudents,
        unevaluatedStudents: action.unevaluatedStudents,
      };
    case teacherHomeworkActions.FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_FAILURE:
      return {
        ...state,
        fetchingStudentLists: false,
      };

    case teacherHomeworkActions.FETCH_SUBMITTED_HOMEWORK_DETAILS_REQUEST:
      return {
        ...state,
        fetchingSubmittedHomeworkDetails: true,
      };
    case teacherHomeworkActions.FETCH_SUBMITTED_HOMEWORK_DETAILS_SUCCESS:
      return {
        ...state,
        fetchingSubmittedHomeworkDetails: false,
        submittedHomeworkDetails: action.data,
        totalSubmittedQuestions: action.totalQuestions,
        isQuestionwise: action.isQuestionwise,
        collatedSubmissionFiles: action.collatedSubmissionFiles,
      };
    case teacherHomeworkActions.FETCH_SUBMITTED_HOMEWORK_DETAILS_FAILURE:
      return {
        ...state,
        fetchingSubmittedHomeworkDetails: false,
      };
      case teacherHomeworkActions.ADD_HOMEWORK_SUCCESS_COORD:
      case teacherHomeworkActions.SET_TEACHER_HOMEWORK_ID_FROM_CORD_SUCCESS:
      return { ...state, selectedTeacherByCoordinatorToCreateHw: action.data };

    default:
      return state;
  }
}
