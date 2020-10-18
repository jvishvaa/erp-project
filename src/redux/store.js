import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers';

console.log('hi');

const middlewares = [logger, thunk];

export default createStore(rootReducer, applyMiddleware(...middlewares));
