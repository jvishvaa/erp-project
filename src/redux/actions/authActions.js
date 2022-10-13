import axios from '../../config/axios';
import { selectedVersion } from '../../redux/actions/common-actions';
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

const LOGIN_TIMEOUT = 60000;

export const handleSendOtp = (payload) => {
  const url = '/erp_user/login-otp/';
  return axios
    .post(url, payload)
    .then((response) => {
      return {
        status: response?.data?.status_code,
        message: response?.data?.message,
        attempts: response?.data?.attempts,
        expiryTime: +response?.data?.expiration_in_sec,
      };
    })
    .catch((error) => console.log(error));
};

export const login = (payload, isOtpLogin) => (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  const url = isOtpLogin ? '/erp_user/verify-otp/' : '/erp_user/login/';
  const config = { timeout: LOGIN_TIMEOUT };
  return axios
    .post(url, payload, config)
    .then((response) => {
      const data = isOtpLogin ? response.data.login_response : response.data;
      // const data = response.data;
      // dispatch(selectedVersion(data?.result?.is_v2_enabled));
      // localStorage.setItem('isV2', data?.result?.is_v2_enabled);

      if (data.status_code === 200) {
        const actualData = data;
        if (isOtpLogin && data.status_code !== 200) {
          dispatch({ type: LOGIN_FAILURE });
          const result = { isLogin: false, message: data.message };
          return result;
        }
        dispatch(selectedVersion(data?.result?.is_v2_enabled));
        localStorage.setItem('isV2', data?.result?.is_v2_enabled);
        dispatch({
          type: LOGIN_SUCCESS,
          userDetails: actualData?.result?.user_details,
          navigationData: actualData?.result?.navigation_data,
        });
        localStorage.setItem(
          'userDetails',
          JSON.stringify(actualData?.result?.user_details)
        );
        localStorage.setItem(
          'navigationData',
          JSON.stringify(actualData?.result?.navigation_data)
        );
        if (isOtpLogin === true) {
          localStorage.setItem(
            'apps',
            JSON.stringify(response?.data?.login_response?.result?.apps)
          );
        } else {
          localStorage.setItem('apps', JSON.stringify(response?.data?.result?.apps));
        }
        const result = { isLogin: true, message: actualData.message };
        return result;
      }
      dispatch({ type: LOGIN_FAILURE });
      const result = { isLogin: false, message: data.message };
      return result;
    })
    .catch(() => {
      dispatch({ type: LOGIN_FAILURE });
    });
};

export const loginMobile = (payload, isOtpMobileLogin) => (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  const url = isOtpMobileLogin ? '/erp_user/mobile-verify-otp/' : '/erp_user/login/';
  const config = { timeout: LOGIN_TIMEOUT };
  return axios.post(url, payload, config).then((response) => {
    // const data = isOtpLogin ? response.data.login_response : response.data;
    const data = response.data;
    if (data.status_code === 200) {
      const actualData = data;
      if (isOtpMobileLogin && data.status_code !== 200) {
        dispatch({ type: LOGIN_FAILURE });
        const result = {
          isLogin: false,
          message: data?.message,
          profile_data: actualData,
        };
        return result;
      }
      dispatch({
        type: LOGIN_SUCCESS,
        // userDetails: actualData,
        // navigationData: actualData,
      });
      localStorage.setItem('profileDetails', JSON.stringify(actualData));
      // localStorage.setItem(
      //   'navigationData',
      //   JSON.stringify(actualData?.result.navigation_data)
      // );
      // localStorage.setItem(
      //   'apps',
      //   JSON.stringify(response?.data?.result?.apps)
      // );
      const result = { isLogin: true, message: actualData.message, profile_data: data };
      return result;
    }
    dispatch({ type: LOGIN_FAILURE });
    const result = { isLogin: false, message: data.message };
    return result;
  });
  // .catch(() => {
  //   dispatch({ type: LOGIN_FAILURE });
  // });
};

export const handleSendMobileOtp = (payload) => {
  const url = '/erp_user/mobile-login/';
  return axios
    .post(url, payload)
    .then((response) => {
      return {
        status: response?.data?.status_code,
        message: response?.data?.message,
        attempts: response?.data?.attempts,
        expiryTime: +response?.data?.expiration_in_sec,
      };
    })
    .catch((error) => console.log(error));
};

export const aolLogin = (token) => (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  const config = { timeout: LOGIN_TIMEOUT };
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
        ...config,
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
        dispatch(selectedVersion(response.data?.result?.is_v2_enabled));
        localStorage.setItem('isV2', response.data?.result?.is_v2_enabled);
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
