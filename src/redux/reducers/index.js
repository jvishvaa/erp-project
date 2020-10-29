import { combineReducers } from 'redux';
import auth from './authReducer';
import roleManagement from './roleManagementReducer';
import userManagement from './userManagementReducer';

export default combineReducers({
  auth,
  roleManagement,
  userManagement,
});
