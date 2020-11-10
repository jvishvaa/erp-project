import {
  CLASS_ACCEPT_SUCCESS,
  STUDENT_ONLINECLASS_FAILURE,
  STUDENT_ONLINECLASS_REQUEST,
  STUDENT_ONLINECLASS_SUCCESS,
  MANAGEMENT_ONLINECLASS_REQUEST,
  MANAGEMENT_ONLINECLASS_SUCCESS,
  MANAGEMENT_ONLINECLASS_FAILURE,
  RESOURCE_ONLINECLASS_REQUEST,
  RESOURCE_ONLINECLASS_SUCCESS,
  RESOURCE_ONLINECLASS_FAILURE,
  LIST_GRADE_FAILURE,
  LIST_GRADE_REQUEST,
  LIST_GRADE_SUCCESS,
  LIST_SECTION_FAILURE,
  LIST_SECTION_REQUEST,
  LIST_SECTION_SUCCESS,
  CANCEL_CLASS,
  SET_TAB,
  SET_RESOURCE_TAB,
  SET_MANAGEMENT_PAGE,
  SET_RESOURCE_PAGE,
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

    case MANAGEMENT_ONLINECLASS_REQUEST:
      return {
        ...state,
        managementView: {
          ...state.managementView,
          loadingManagementOnlineClasses: true,
          errorLoadingManagementOnlineClasses: '',
        },
      };
    case MANAGEMENT_ONLINECLASS_SUCCESS:
      return {
        ...state,
        managementView: {
          ...state.managementView,
          loadingManagementOnlineClasses: false,
          errorLoadingManagementOnlineClasses: '',
          managementOnlineClasses: action.payload.data,
          currentPage: action.payload.current_page * 1,
          totalPages: action.payload.total_pages * 1,
          currentServerTime: action.payload.current_server_time,
        },
      };
    case MANAGEMENT_ONLINECLASS_FAILURE:
      return {
        ...state,
        managementView: {
          ...state.managementView,
          loadingManagementOnlineClasses: false,
          errorLoadingManagementOnlineClasses: action.payload,
        },
      };

    case SET_MANAGEMENT_PAGE:
      return {
        ...state,
        managementView: {
          ...state.managementView,
          currentPage: action.payload,
        },
      };

    case SET_RESOURCE_PAGE:
      return {
        ...state,
        resourceView: {
          ...state.resourceView,
          currentPage: action.payload,
        },
      };

    case RESOURCE_ONLINECLASS_REQUEST:
      return {
        ...state,
        resourceView: {
          ...state.resourceView,
          loadingResourceOnlineClasses: true,
          errorLoadingResourceOnlineClasses: '',
        },
      };
    case RESOURCE_ONLINECLASS_SUCCESS:
      return {
        ...state,
        resourceView: {
          ...state.resourceView,
          loadingResourceOnlineClasses: false,
          errorLoadingResourceOnlineClasses: '',
          resourceOnlineClasses: action.payload.data,
          currentPage: action.payload.current_page * 1,
          totalPages: action.payload.total_pages * 1,
          currentServerTime: action.payload.current_server_time,
        },
      };
    case RESOURCE_ONLINECLASS_FAILURE:
      return {
        ...state,
        resourceView: {
          ...state.resourceView,
          loadingResourceOnlineClasses: false,
          errorLoadingResourceOnlineClasses: action.payload,
        },
      };

    case CANCEL_CLASS:
      return {
        ...state,
        managementView: {
          ...state.managementView,
          managementOnlineClasses: state.managementView.managementOnlineClasses.map(
            (el) => {
              if (el.id === action.payload) {
                return { ...el, is_canceled: true };
              }
              return el;
            }
          ),
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

    case SET_TAB:
      return {
        ...state,
        managementView: {
          ...state.managementView,
          currentManagementTab: action.payload,
        },
      };

    case SET_RESOURCE_TAB:
      return {
        ...state,
        resourceView: {
          ...state.resourceView,
          currentResourceTab: action.payload,
        },
      };

    default:
      return { ...state };
  }
};

export default onlineClassReducer;
