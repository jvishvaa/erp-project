import { combineReducers } from 'redux';
import auth from './authReducer';
import roleManagement from './roleManagementReducer';

export default combineReducers({
  auth,
  roleManagement,
});
