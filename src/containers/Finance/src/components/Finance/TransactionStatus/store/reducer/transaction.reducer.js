import * as actionTypes from '../../../store/actions'

const initialState = {
  transactionsDetail: null,
  feePlansMulti: [],
  multiFeeAcc: []
}

const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_TRANSACTION: {
      return {
        ...state,
        transactionsDetail: action.payload.data
      }
    }
    case actionTypes.UPDATE_TRANSACTION_STATUS: {
      const index = state.transactionsDetail.results.findIndex(result => {
        return result.id === action.payload.id
      })
      const modifiedTransactionalDetails = { ...state.transactionsDetail }
      const resultantArr = [...modifiedTransactionalDetails.results]
      const modifiedObj = { ...resultantArr[index] }
      Object.keys(action.payload.data).forEach(key => {
        modifiedObj[key] = action.payload.data[key]
      })
      resultantArr[index] = modifiedObj
      modifiedTransactionalDetails.results = resultantArr
      return {
        ...state,
        transactionsDetail: modifiedTransactionalDetails
      }
    }
    case actionTypes.FETCH_MULTI_FEETYPE_TRAN: {
      const feeAccounts = [...action.payload.data]
      if (feeAccounts.length > 0) {
        feeAccounts.unshift({
          fee_account_name: 'All Fee Accounts',
          id: 'all'
        })
      }
      return {
        ...state,
        feePlansMulti: action.payload.data,
        multiFeeAcc: feeAccounts
      }
    }
    case actionTypes.CLEAR_FEE_DAY_REPORTS_PROPS: {
      return {
        ...state,
        transactionsDetail: null,
        feePlansMulti: [],
        multiFeeAcc: []
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default transactionReducer
