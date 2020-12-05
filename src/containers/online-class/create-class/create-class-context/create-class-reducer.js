import {
  LIST_GRADE_FAILURE,
  LIST_GRADE_REQUEST,
  LIST_GRADE_SUCCESS,
  LIST_SECTION_FAILURE,
  LIST_SECTION_REQUEST,
  LIST_SECTION_SUCCESS,
  LIST_STUDENT_FAILURE,
  LIST_STUDENT_REQUEST,
  LIST_STUDENT_SUCCESS,
  VERIFY_TUTOREMAIL_FAILURE,
  VERIFY_TUTOREMAIL_REQUEST,
  VERIFY_TUTOREMAIL_SUCCESS,
  CLEAR_VALIDATION,
  CLEAR_FILERED_STUDENTS,
  LIST_FILTERED_STUDENTS,
  CREATE_NEW_CLASS_REQUEST,
  CREATE_NEW_CLASS_SUCCESS,
  CREATE_NEW_CLASS_FAILURE,
  RESET_CREATE_CLASS_CONTEXT,
  LIST_TUTOR_EMAILS_REQUEST,
  LIST_TUTOR_EMAILS_SUCCESS,
  LIST_TUTOR_EMAILS_FAILURE,
} from './create-class-constants';

const createClassReducer = (state, action) => {
  switch (action.type) {
    // to get grades based on branch id
    case LIST_GRADE_REQUEST:
      return {
        ...state,
      };
    case LIST_GRADE_SUCCESS:
      return {
        ...state,
        loading: false,
        grades: action.payload,
      };
    case LIST_GRADE_FAILURE:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };

    // to get sections on select of grade
    case LIST_SECTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LIST_SECTION_SUCCESS:
      return {
        ...state,
        sections: action.payload,
      };
    case LIST_SECTION_FAILURE:
      return {
        ...state,
        loading: false,
      };

    // to get students based on mappings selected
    case LIST_STUDENT_REQUEST:
      return {
        ...state,
        loadingStudents: true,
        errorLoadingStudents: '',
      };
    case LIST_STUDENT_SUCCESS:
      return {
        ...state,
        studentList: action.payload,
        loadingStudents: false,
        errorLoadingStudents: '',
      };
    case LIST_STUDENT_FAILURE:
      return {
        ...state,
        loadingStudents: false,
        errorLoadingStudents: action.payload,
      };

    // validating tutor email
    case VERIFY_TUTOREMAIL_REQUEST:
      return {
        ...state,
        isValidatingTutorEmail: true,
      };
    case VERIFY_TUTOREMAIL_SUCCESS:
      return {
        ...state,
        isValidatingTutorEmail: false,
        isTutorEmailValid: true,
      };
    case VERIFY_TUTOREMAIL_FAILURE:
      return {
        ...state,
        isValidatingTutorEmail: false,
        isTutorEmailValid: false,
      };
    case CLEAR_VALIDATION:
      return {
        ...state,
        isValidatingTutorEmail: null,
        isTutorEmailValid: null,
      };

    case CLEAR_FILERED_STUDENTS:
      return {
        ...state,
        filteredStudents: [],
      };

    case LIST_FILTERED_STUDENTS:
      return {
        ...state,
        filteredStudents: action.payload,
      };

    // create new online class
    case CREATE_NEW_CLASS_REQUEST:
      return { ...state, creatingOnlineClass: true };
    case CREATE_NEW_CLASS_SUCCESS:
      return { ...state, creatingOnlineClass: false, isCreated: true };
    case CREATE_NEW_CLASS_FAILURE:
      return { ...state, creatingOnlineClass: false };

    // reset context
    case RESET_CREATE_CLASS_CONTEXT:
      return { ...state, ...action.payload };

    case LIST_TUTOR_EMAILS_REQUEST:
      return { ...state, tutorEmailsLoading: true };

    case LIST_TUTOR_EMAILS_SUCCESS:
      return { ...state, tutorEmails: action.payload, tutorEmailsLoading: false };

    case LIST_TUTOR_EMAILS_FAILURE:
      return { ...state, tutorEmailsLoading: false };

    default:
      return { ...state };
  }
};

export default createClassReducer;
