import { authActions } from '../actions';

const INITIAL_STATE = {
  loginInProgress: false,
  userDetails: {},
  navigationData: {},
  fetchingUserDetails: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case authActions.LOGIN_REQUEST:
      return { ...state, loginInProgress: true };
    case authActions.LOGIN_SUCCESS:
      return {
        ...state,
        loginInProgress: false,
        // userDetails: action.userDetails,
        // navigationData: action.navigationData,
      };
    case authActions.LOGOUT_REQUEST:
      return {
        ...state,
        loginInProgress: false,
        userDetails: {},
        navigationData: {},
      };
    case authActions.FETCH_LOGGED_IN_USER_INFO_REQUEST:
      return {
        ...state,
        fetchingUserDetails: true,
      };
    case authActions.FETCH_LOGGED_IN_USER_INFO_SUCCESS:
      return {
        ...state,
        fetchingUserDetails: false,
        userDetails: action.data,
      };
    case authActions.FETCH_LOGGED_IN_USER_INFO_FAILURE:
      return {
        ...state,
        fetchingUserDetails: false,
      };
    default:
      return state;
  }
}
