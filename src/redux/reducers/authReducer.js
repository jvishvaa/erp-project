import { authActions } from '../actions';

const INITIAL_STATE = {
  loginInProgress: false,
  userDetails: {},
  navigationData: {},
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case authActions.LOGIN_REQUEST:
      return { ...state, loginInProgress: true };
    case authActions.LOGIN_SUCCESS:
      return {
        ...state,
        loginInProgress: false,
        userDetails: action.userDetails,
        navigationData: action.navigationData,
      };
    default:
      return state;
  }
}
