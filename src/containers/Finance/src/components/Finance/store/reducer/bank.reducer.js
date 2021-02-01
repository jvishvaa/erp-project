import * as actionTypes from '../actions'

const initalState = {
  bankDetails: [],
  feeAccounts: [],
  remainingBanks: []
}

const bankReducer = (state = initalState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BANK_DETAILS: {
      return {
        ...state,
        bankDetails: [...action.payload.data]
      }
    }
    case actionTypes.FETCH_FEE_ACCOUNTS: {
      return {
        ...state,
        feeAccounts: action.payload.data
      }
    }
    case actionTypes.FETCH_REMAINING_BANKS: {
      return {
        ...state,
        remainingBanks: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default bankReducer
