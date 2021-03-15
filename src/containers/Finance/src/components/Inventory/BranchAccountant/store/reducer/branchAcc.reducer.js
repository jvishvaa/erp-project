import { combineReducers } from 'redux'

import storeAtAccReducer from '../../StoreAtAcc/reducer/storeAtAcc.reducer'

const branchAcc = combineReducers({
  storeAtAcc: storeAtAccReducer
})

export default branchAcc
