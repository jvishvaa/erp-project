import axios from '../../config/axios';

export const userManagementActions = {
  CREATE_USER_REQUEST: 'CREATE_USER_REQUEST',
  CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
  CREATE_USER_FAILURE: 'CREATE_USER_FAILURE',
};

const {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
} = userManagementActions;

export const createUser = () => (dispatch) => {
  dispatch({ type: CREATE_USER_REQUEST });
  return axios
    .post('/erp_user/add_user')
    .then(() => {
      dispatch({ type: CREATE_USER_SUCCESS });
    })
    .catch((error) => {
      console.log(error);
      dispatch({ type: CREATE_USER_FAILURE });
    });
};

export const fetchBranchesForCreateUser = () => {
  return axios
    .get('/erp_user/branch/')
    .then((response) => {
      return response.data.data;
    })
    .catch(() => {});
};

export const fetchAcademicYears = () => {
  return axios
    .get('/erp_user/list-academic_year/')
    .then((response) => {
      return response.data.data;
    })
    .catch(() => {});
};

export const fetchSubjects = () => {
  return axios
    .get('/erp_user/subject/')
    .then((response) => {
      return response.data.data;
    })
    .catch(() => {});
};
