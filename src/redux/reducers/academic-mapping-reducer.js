import mappingConstants from '../constants/academic-mapping-constants';

const { SUBJECT_REQUEST, SUBJECT_SUCCESS, SUBJECT_FAILURE } = mappingConstants;

const initialState = {
  loading: false,
  error: '',
  subjects: [],
};

const academicMappingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBJECT_REQUEST:
      return { ...state, loading: true };
    case SUBJECT_SUCCESS:
      return { ...state, loading: false, error: '', subjects: action.payload };
    case SUBJECT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return { ...state };
  }
};

export default academicMappingReducer;
