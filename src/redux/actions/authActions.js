
import axios from '../../config/axios';
import { isMsAPI } from "../../utility-functions/index"

export const authActions = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  SET_ROLE_DETAILS: 'SET_ROLE_DETAILS',
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  FETCH_LOGGED_IN_USER_INFO_REQUEST: 'FETCH_LOGGED_IN_USER_INFO_REQUEST',
  FETCH_LOGGED_IN_USER_INFO_SUCCESS: 'FETCH_LOGGED_IN_USER_INFO_SUCCESS',
  FETCH_LOGGED_IN_USER_INFO_FAILURE: 'FETCH_LOGGED_IN_USER_INFO_FAILURE',
};

const {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  FETCH_LOGGED_IN_USER_INFO_REQUEST,
  FETCH_LOGGED_IN_USER_INFO_SUCCESS,
  FETCH_LOGGED_IN_USER_INFO_FAILURE,
} = authActions;


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
        isMsAPI();
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

export const aolLogin = (token) => (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  return axios
    .post(
      '/erp_user/login/',
      {
        // data
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
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
        isMsAPI();
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
};

export const fetchLoggedInUserDetails = () => (dispatch) => {
  dispatch({ type: FETCH_LOGGED_IN_USER_INFO_REQUEST });
  const { role_details: roleDetails } =
    JSON.parse(localStorage.getItem('userDetails')) || {};
  return axios
    .get(`/erp_user/user-data/?erp_user_id=${roleDetails?.erp_user_id}`)
    .then((response) => {
      dispatch({
        type: FETCH_LOGGED_IN_USER_INFO_SUCCESS,
        data: response.data.result,
      });
    })
    .catch(() => {
      dispatch({ type: FETCH_LOGGED_IN_USER_INFO_FAILURE });
      // throw new Error();
    });
};
