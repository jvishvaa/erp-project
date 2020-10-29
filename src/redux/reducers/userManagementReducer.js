import { userManagementActions } from '../actions';

const INITIAL_STATE = {
  creatingUser: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case userManagementActions.CREATE_USER_REQUEST:
      return { ...state, creatingUser: true };
    case userManagementActions.CREATE_USER_SUCCESS:
      return { ...state, creatingUser: false };
    case userManagementActions.CREATE_USER_FAILURE:
      return { ...state, creatingUser: false };
    default:
      return state;
  }
}
