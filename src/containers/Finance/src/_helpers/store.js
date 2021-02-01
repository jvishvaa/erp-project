import { createStore, applyMiddleware, compose } from 'redux'
// import { middleware as reduxPackMiddleware } from 'redux-pack'
import thunkMiddleware from 'redux-thunk'
import { BehaviorSubject } from 'rxjs'

import rootReducer from '../_reducers'
import worker from '../_components/pselect/worker'
import tracker from '../tracker'
import { filterConstants } from '../_constants'

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose
export const selectedItems = new BehaviorSubject({})
const customMiddleware = store => {
  // create and connect to the worker here
  worker.onmessage = msg => {
    store.dispatch({ type: filterConstants.REQUEST, data: msg.data })
    selectedItems.next(msg.data)
  }
  return next => action => {
    let state = store.getState().filter
    let data = JSON.stringify({ newData: action.data, state })
    if (action.type === filterConstants.UPDATE && !action.data.isTrusted) worker.postMessage(data)
    if ((typeof action.type === 'string') && (action.type).includes('_REQUEST')) tracker.postMessage('STARTED')
    if ((typeof action.type === 'string') && (action.type).includes('_SUCCESS')) tracker.postMessage('FINISHED')
    if ((typeof action.type === 'string') && (action.type).includes('_FAILURE')) tracker.postMessage('FINISHED')
    return next(action)
  }
}

const enhancer = composeEnhancers(applyMiddleware(customMiddleware,
  thunkMiddleware
))

export const store = createStore(
  rootReducer,
  enhancer
)
