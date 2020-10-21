import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import mappingConstants from '../constants/academic-mapping-constants';

function request(type) {
  return { type: mappingConstants[type] };
}
function success(data, type) {
  return { type: mappingConstants[type], data };
}
function failure(error, type) {
  return { type: mappingConstants[type], error };
}

export const listSubjects = () => {
  return async (dispatch) => {
    dispatch(request(mappingConstants.SUBJECT_REQUEST));
    try {
      const response = await axiosInstance(endpoints.academics.subjects);
      dispatch(success(response.data, mappingConstants.SUBJECT_SUCCESS));
    } catch (error) {
      dispatch(failure(error, mappingConstants.SUBJECT_FAILURE));
    }
  };
};

export const listGrades = () => {};
