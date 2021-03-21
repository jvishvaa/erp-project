import { combineReducers } from 'redux'

import storeAdmin from '../../StoreAdmin/store/reducer/storeAdm.reducer'
import branchAcc from '../../BranchAccountant/store/reducer/branchAcc.reducer'
import storeManager from '../../StoreManager/stores/reducer/reducer'

const inventory = combineReducers({
  storeAdmin,
  branchAcc,
  storeManager
})

export default inventory
