import * as actionTypes from '../../../store/actions/index'

const initialState = {
  collectionAccounts: [],
  pettyCashAccounts: [],
  expenseAccounts: [],
  pettyCashTransactions: [],
  otherCollectionAccounts: []
}

const depositReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_ACCOUNTS: {
      const collectionAccounts = action.payload.data.filter(ele => {
        return ele.bank_name.is_income_account
      })
      console.log('Collection Accounts', collectionAccounts)
      const expenseAccounts = action.payload.data.filter(ele => {
        return ele.bank_name.is_expenses_account
      })
      const pettyCashAccounts = action.payload.data.filter(ele => {
        return ele.bank_name.is_petty_cash_account
      })
      return {
        ...state,
        collectionAccounts,
        expenseAccounts,
        pettyCashAccounts
      }
    }
    case actionTypes.FETCH_DEPOSIT_TRANSACTION: {
      return {
        ...state,
        pettyCashTransactions: action.payload.data
      }
    }
    case actionTypes.FETCH_OTHER_ACCOUNTS: {
      const collectionAccounts = action.payload.data.filter(ele => {
        return ele.bank_name.is_income_account
      })
      return {
        ...state,
        otherCollectionAccounts: collectionAccounts
      }
    }
    case actionTypes.UPDATE_DEPOSIT_ENTRY: {
      const txns = [...state.pettyCashTransactions]
      const index = txns.findIndex(item => item.id === action.payload.data.id)
      txns[index] = action.payload.data
      return {
        ...state,
        pettyCashTransactions: txns
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default depositReducer
