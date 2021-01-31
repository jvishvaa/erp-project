import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  feeTypesList: [],
  remainingBranches: []
}

const registrationAndApplicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REGISTRATION_APPLICATION_FEE_TYPE_LIST: {
      return {
        ...state,
        feeTypesList: action.payload.data
      }
    }
    case actionTypes.UPDATE_REGISTRATION_FEE_TYPES: {
      const feeList = [...state.feeTypesList]
      const index = feeList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      const changeObj = { ...feeList[index] }
      changeObj.id = action.payload.data.id ? action.payload.data.id : ''
      changeObj.fee_type_name = action.payload.data.fee_type_name ? action.payload.data.fee_type_name : ''
      changeObj.fee_account = action.payload.data.fee_account && action.payload.data.fee_account ? action.payload.data.fee_account : ''
      changeObj.amount = action.payload.data.amount ? action.payload.data.amount : ''
      feeList[index] = { ...changeObj }
      return {
        ...state,
        feeTypesList: feeList
      }
    }
    case actionTypes.ADD_REGISTRATION_FEE_TYPES: {
      // const feeList = [...state.feeTypesList]
      // feeList.push({
      //   fee_type_name: action.payload.data.fee_type_name ? action.payload.data.fee_type_name : '',
      //   amount: action.payload.data.amount ? action.payload.data.amount : ''
      // })
      return {
        ...state
        // feeTypesList: feeList
      }
    }
    case actionTypes.DELETE_REGISTRATION_FEE_TYPES: {
      const feeList = [...state.feeTypesList]
      const deletedFeeList = feeList.filter(fee => {
        return fee.id !== action.payload.id
      })
      return {
        ...state,
        feeTypesList: deletedFeeList
      }
    }
    case actionTypes.REMAINING_BRANCHES_PER_TYPE: {
      return {
        ...state,
        remainingBranches: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default registrationAndApplicationReducer
