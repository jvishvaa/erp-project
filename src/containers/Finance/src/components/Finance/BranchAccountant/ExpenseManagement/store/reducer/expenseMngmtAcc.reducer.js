import { combineReducers } from 'redux'

import PettyExpensesReducer from '../../PettyExpenses/store/reducer/pettyExpenses.reducer'
import PartyReducer from '../../Party/store/party.reducer'

const expenseMngmtAccReducer = combineReducers({
  pettyExpenses: PettyExpensesReducer,
  party: PartyReducer
})

export default expenseMngmtAccReducer
