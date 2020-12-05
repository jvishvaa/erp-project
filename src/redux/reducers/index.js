import { combineReducers } from 'redux';
import auth from './authReducer';
import roleManagement from './roleManagementReducer';
import userManagement from './userManagementReducer';
import academicMappingReducer from './academic-mapping-reducer';
import teacherHomework from './teacherHomeworkReducer';

export default combineReducers({
  auth,
  roleManagement,
  userManagement,
  academic: academicMappingReducer,
  teacherHomework,
});
