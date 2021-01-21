import { combineReducers } from 'redux'

import SchoolStore from '../../SchoolStore/store/reducer/schoolStore.reducer'
import Kit from '../../Kit/store/reducer/kit.reducer'
import storeReportReducer from '../../StoreReports/store/reducer/storeReports.reducer'
import addGstReducer from '../../AddGst/store/reducer/addGst.reducer'
import subCategoryReducer from '../../SubCategoryAllow/store/reducer/subCategoryAllow.reducer'

const storeAdmin = combineReducers({
  schoolStore: SchoolStore,
  kit: Kit,
  storeReport: storeReportReducer,
  addGst: addGstReducer,
  subCategoryReducer: subCategoryReducer
})

export default storeAdmin
