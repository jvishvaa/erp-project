import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  normalFeeList: []
  // updatedNormalFeeList: [],
}

const normalFeeListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NORMAL_FEE_LIST: {
      return {
        ...state,
        normalFeeList: action.payload.data
      }
    }
    case actionTypes.EDIT_NORMAL_FEE_LIST: {
      // console.log("====ACTION dTAA=")
      // console.log(action.payload.data)
      const feeList = [...state.normalFeeList]
      const index = feeList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      const changeObj = { ...feeList[index] }
      changeObj.id = action.payload.data.id ? action.payload.data.id : ''
      changeObj.fee_type_name = action.payload.data.fee_type_name ? action.payload.data.fee_type_name : ''
      changeObj.priority = Number.isInteger(action.payload.data.priority) ? action.payload.data.priority : ''
      changeObj.is_concession_applicable = action.payload.data.is_concession_applicable ? action.payload.data.is_concession_applicable : false
      changeObj.is_service_based = action.payload.data.is_service_based ? action.payload.data.is_service_based : false
      changeObj.is_pro_rata = action.payload.data.is_pro_rata ? action.payload.data.is_pro_rata : false
      changeObj.is_allow_partial_amount = action.payload.data.is_allow_partial_amount ? action.payload.data.is_allow_partial_amount : false
      changeObj.is_activity_based_fee = action.payload.data.is_activity_based_fee ? action.payload.data.is_activity_based_fee : false
      changeObj.is_refundable_fee = action.payload.data.is_refundable_fee ? action.payload.data.is_refundable_fee : false
      changeObj.show_transaction_in_parent_login = action.payload.data.show_transaction_in_parent_login ? action.payload.data.show_transaction_in_parent_login : false
      feeList[index] = { ...changeObj }
      return {
        ...state,
        normalFeeList: feeList
      }
    }
    case actionTypes.ADD_NORMAL_FEE_LIST: {
      const feeList = [...state.normalFeeList]
      feeList.push({
        Sr: state.normalFeeList.length ? state.normalFeeList.length + 1 : 1,
        id: action.payload.data.id ? action.payload.data.id : '',
        fee_type_name: action.payload.data.fee_type_name ? action.payload.data.fee_type_name : '',
        priority: Number.isInteger(action.payload.data.priority) ? action.payload.data.priority : '',
        is_concession_applicable: action.payload.data.is_concession_applicable ? action.payload.data.is_concession_applicable : false,
        is_service_based: action.payload.data.is_service_based ? action.payload.data.is_service_based : false,
        is_pro_rata: action.payload.data.is_pro_rata ? action.payload.data.is_pro_rata : false,
        is_allow_partial_amount: action.payload.data.is_allow_partial_amount ? action.payload.data.is_allow_partial_amount : false,
        is_activity_based_fee: action.payload.data.is_activity_based_fee ? action.payload.data.is_activity_based_fee : false,
        is_refundable_fee: action.payload.data.is_refundable_fee ? action.payload.data.is_refundable_fee : false,
        show_transaction_in_parent_login: action.payload.data.show_transaction_in_parent_login ? action.payload.data.show_transaction_in_parent_login : false
      })
      return {
        ...state,
        normalFeeList: feeList
      }
    }
    case actionTypes.DELETE_NORMAL_FEE_LIST: {
      const newNormalFeeList = [...state.normalFeeList]
      const deletedFeeList = newNormalFeeList.filter(fee => {
        return fee.id !== action.payload.id
      })
      return {
        ...state,
        normalFeeList: deletedFeeList
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default normalFeeListReducer
