/* eslint-disable no-debugger */
import axios from '../../config/axios';

export const authActions = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  SET_ROLE_DETAILS: 'SET_ROLE_DETAILS',
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
};

const { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST } = authActions;

export const login = (params) => (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  return axios
    .post('/erp_user/login/', params)
    .then((response) => {
      if (response.data.status_code === 200) {
        dispatch({
          type: LOGIN_SUCCESS,
          userDetails: response.data.result.user_details,
          navigationData: response.data.result.navigation_data,
        });
        localStorage.setItem(
          'userDetails',
          JSON.stringify(response.data.result.user_details)
        );
        localStorage.setItem(
          'navigationData',
          JSON.stringify(response.data.result.navigation_data)
        );
        const result = { isLogin: true, message: response.data.message };
        return result;
      }
      dispatch({ type: LOGIN_FAILURE });
      const result = { isLogin: false, message: response.data.message };
      return result;
    })
    .catch(() => {
      dispatch({ type: LOGIN_FAILURE });
    });
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT_REQUEST });
  localStorage.clear();
};
