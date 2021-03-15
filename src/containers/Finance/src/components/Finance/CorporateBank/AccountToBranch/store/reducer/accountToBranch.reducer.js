import * as actionTypes from '../../../../store/actions'

const initialState = {
  feeAccToBranchMapping: [],
  remainingFeeAccForBrnch: []
}

const accToBranchReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_FEE_ACC_BRANCH_MAPPING: {
      return {
        ...state,
        feeAccToBranchMapping: action.payload.data
      }
    }
    case actionTypes.FETCH_REMAINING_FEE_ACCOUNTS: {
      return {
        ...state,
        remainingFeeAccForBrnch: action.payload.data
      }
    }
    case actionTypes.DELETE_FEE_ACC_BRANCH_MAPPING: {
      const newFeeAccToBranchMapping = state.feeAccToBranchMapping.map(result => {
        if (result.id === action.payload.mapId) {
          const newFeeAccountName = [...result.fee_account_name].filter(acc => {
            return acc.id !== action.payload.accId
          })
          return {
            ...result,
            fee_account_name: newFeeAccountName
          }
        }
        return {
          ...result
        }
      })

      return {
        ...state,
        feeAccToBranchMapping: newFeeAccToBranchMapping
      }
    }
    case actionTypes.ADD_FEE_ACCOUNTS_TO_BRANCH: {
      const { payload } = action
      const newFeeAccMapping = [...state.feeAccToBranchMapping]
      const index = newFeeAccMapping.findIndex(ele => {
        return ele.branch.id === payload.data.branch.id
      })
      const updatedBranch = { ...newFeeAccMapping[index] }
      updatedBranch['fee_account_name'] = [...payload.data.fee_account_name]
      newFeeAccMapping[index] = updatedBranch
      return {
        ...state,
        feeAccToBranchMapping: newFeeAccMapping
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default accToBranchReducer
