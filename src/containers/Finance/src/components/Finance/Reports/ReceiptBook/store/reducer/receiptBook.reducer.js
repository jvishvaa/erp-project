import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  feeTypesPerType: [],
  feeAccounts: [],
  multipleFeeAccounts: []
}

const ReceiptbookReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FEE_TYPES_PER_TYPES: {
      const fees = [...action.payload.data]
      if (fees.length) {
        fees.unshift({
          fee_type_name: 'All Fee Types',
          id: 'all'
        })
      }
      return {
        ...state,
        feeTypesPerType: fees
      }
    }
    case actionTypes.GET_FEE_ACCOUNT_PER_BRANCH: {
      const acc = [...action.payload.data]
      acc.unshift({
        fee_account_name: 'All Fee Account',
        id: 'all'
      })
      return {
        ...state,
        feeAccounts: action.payload.data,
        multipleFeeAccounts: acc
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default ReceiptbookReducer
