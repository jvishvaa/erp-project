import { combineReducers } from 'redux'
import depositReducer from '../../Deposits/store/reducer/deposit.reducer'
import ledgerReducer from '../../Ledger/store/reducer/ledger.reducer'

const expenseMngmtReducer = combineReducers({
  deposit: depositReducer,
  ledger: ledgerReducer
})

export default expenseMngmtReducer
