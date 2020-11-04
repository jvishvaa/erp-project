import qs from 'qs';
import axios from '../../config/axios';

export const userManagementActions = {
  CREATE_USER_REQUEST: 'CREATE_USER_REQUEST',
  CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
  CREATE_USER_FAILURE: 'CREATE_USER_FAILURE',
  FETCH_USERS_REQUEST: 'FETCH_USERS_REQUEST',
  FETCH_USERS_SUCCESS: 'FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILURE: 'FETCH_USERS_FAILURE',
};

const {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
} = userManagementActions;

export const fetchUsers = () => (dispatch) => {
  dispatch({ type: FETCH_USERS_REQUEST });
  return axios
    .get(`/communication/erp-user-info/?page=1&role=1`)
    .then((response) => {
      const transformedData = response.data.results.map((obj) => {
        const { user } = obj;
        const parent = obj.parent_details;
        let data = JSON.parse(JSON.stringify(obj));
        delete data.user;
        delete data.parent_details;
        data = { ...data, ...user, ...parent };
        return data;
      });
      dispatch({
        type: FETCH_USERS_SUCCESS,
        data: transformedData,
        current_page: response.data.current_page,
        total_pages: response.data.total_pages,
        count: response.data.count,
      });
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
      dispatch({ type: FETCH_USERS_FAILURE });
    });
};

export const createUser = (params) => (dispatch) => {
  dispatch({ type: CREATE_USER_REQUEST });
  return axios
    .post('/erp_user/add_user/', qs.stringify(params))
    .then((response) => {
      dispatch({ type: CREATE_USER_SUCCESS });
      console.log(response.data);
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
