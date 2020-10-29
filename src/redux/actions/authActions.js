import axios from '../../config/axios';

export const authActions = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  SET_ROLE_DETAILS: 'SET_ROLE_DETAILS',
};

const { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } = authActions;

export const login = (params) => (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  return axios
    .post('/erp_user/login/', params)
    .then((response) => {
      dispatch({
        type: LOGIN_SUCCESS,
        userDetails: response.data.result.user_details,
        navigationData: response.data.result.navigation_data,
      });
    })
    .catch(() => {
      dispatch({ type: LOGIN_FAILURE });
    });
};
