import {
  CLASS_ACCEPT_SUCCESS,
  STUDENT_ONLINECLASS_FAILURE,
  STUDENT_ONLINECLASS_REQUEST,
  STUDENT_ONLINECLASS_SUCCESS,
} from './online-class-constants';

const onlineClassReducer = (state, action) => {
  switch (action.type) {
    case STUDENT_ONLINECLASS_REQUEST:
      return {
        ...state,
        studentView: {
          ...state.studentView,
          loadingStudentOnlineClasses: true,
          errorLoadingStudentOnlineClasses: '',
        },
      };
    case STUDENT_ONLINECLASS_SUCCESS:
      return {
        ...state,
        studentView: {
          ...state.studentView,
          loadingStudentOnlineClasses: false,
          errorLoadingStudentOnlineClasses: '',
          studentOnlineClasses: action.payload.data,
          currentPage: action.payload.current_page * 1,
          totalPages: action.payload.total_pages * 1,
          currentServerTime: action.payload.current_server_time,
        },
      };
    case STUDENT_ONLINECLASS_FAILURE:
      return {
        ...state,
        studentView: {
          ...state.studentView,
          loadingStudentOnlineClasses: false,
          errorLoadingStudentOnlineClasses: action.payload,
        },
      };

    case CLASS_ACCEPT_SUCCESS:
      return {
        ...state,
        studentView: {
          ...state.studentView,
          studentOnlineClasses: state.studentView.studentOnlineClasses.map((el) => {
            if (el.id === action.payload) return { ...el, is_accepted: true };
            return el;
          }),
        },
      };

    default:
      return { ...state };
  }
};

export default onlineClassReducer;
