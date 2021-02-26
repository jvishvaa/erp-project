import { combineReducers } from 'redux';
import postReducer from './postReducer';

const rootReducer = combineReducers({
  postReducers: postReducer,
});

export default rootReducer;
