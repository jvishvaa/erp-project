import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  feeAccountPerBranch: [],
  confirmStatus: false
}

const tallyReportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FEE_ACOUNT_PER_BRANCH_AND_ACADID: {
      const feeAccounts = [...action.payload.data]
      if (feeAccounts.length > 0) {
        feeAccounts.unshift({
          fee_account_name: 'All Fee Accounts',
          id: 'all'
        })
      }
      return {
        ...state,
        feeAccountPerBranch: feeAccounts
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default tallyReportsReducer
