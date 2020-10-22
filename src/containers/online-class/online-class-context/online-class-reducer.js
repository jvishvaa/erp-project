import {
  LIST_GRADE_FAILURE,
  LIST_GRADE_REQUEST,
  LIST_GRADE_SUCCESS,
  LIST_SECTION_FAILURE,
  LIST_SECTION_REQUEST,
  LIST_SECTION_SUCCESS,
} from './online-class-constants';

const onlineclassReducer = (state, action) => {
  switch (action.type) {
    case LIST_GRADE_REQUEST:
      return {
        ...state,
        createOnlineClass: { ...state.createOnlineClass, loading: true },
      };
    case LIST_GRADE_SUCCESS:
      return {
        ...state,
        createOnlineClass: {
          ...state.createOnlineClass,
          loading: false,
          grades: action.payload,
        },
      };
    case LIST_GRADE_FAILURE:
      return {
        ...state,
        createOnlineClass: {
          ...state.createOnlineClass,
          loading: false,
          message: action.payload,
        },
      };

    case LIST_SECTION_REQUEST:
      return {
        ...state,
        createOnlineClass: { ...state.createOnlineClass, loading: true },
      };
    case LIST_SECTION_SUCCESS:
      return {
        ...state,
        createOnlineClass: {
          ...state.createOnlineClass,
          loading: false,
          sections: action.payload,
        },
      };
    case LIST_SECTION_FAILURE:
      return {
        ...state,
        createOnlineClass: {
          ...state.createOnlineClass,
          loading: false,
          message: action.payload,
        },
      };
    default:
      return { ...state };
  }
};

export default onlineclassReducer;
