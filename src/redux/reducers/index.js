import { combineReducers } from 'redux';
import auth from './authReducer';
import academicMappingReducer from './academic-mapping-reducer';

export default combineReducers({
  auth,
  academicMappingReducer,
});
