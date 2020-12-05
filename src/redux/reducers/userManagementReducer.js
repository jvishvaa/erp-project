import { userManagementActions } from '../actions';

const INITIAL_STATE = {
  creatingUser: false,
  fetchingUsers: false,
  users: [],
  current_page: 1,
  limit: 10,
  count: 0,
  selectedUser: null,
  fetchingUserDetails: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case userManagementActions.CREATE_USER_REQUEST:
      return { ...state, creatingUser: true };
    case userManagementActions.CREATE_USER_SUCCESS:
      return { ...state, creatingUser: false };
    case userManagementActions.CREATE_USER_FAILURE:
      return { ...state, creatingUser: false };
    case userManagementActions.FETCH_USERS_REQUEST:
      return { ...state, fetchingUsers: true };
    case userManagementActions.FETCH_USERS_SUCCESS:
      return { ...state, fetchingUsers: false, users: action.data };
    case userManagementActions.FETCH_USERS_FAILURE:
      return { ...state, fetchingUsers: false };
    case userManagementActions.FETCH_USER_DETAIL_REQUEST:
      return { ...state, fetchingUserDetails: true };
    case userManagementActions.FETCH_USER_DETAIL_SUCCESS:
      return { ...state, fetchingUserDetails: true, selectedUser: action.data };
    case userManagementActions.FETCH_USER_DETAIL_FAILURE:
      return { ...state, fetchingUserDetails: true };
    default:
      return state;
  }
}
