import * as actionTypes from '../../../store/actions/index'

const initialState = {
  receiptList: [],
  feeAccPerBrnch: []
}

const receiptRangeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIPT_RANGES_LIST: {
      return {
        ...state,
        receiptList: action.payload.data
      }
    }
    case actionTypes.UPDATE_RECEIPT_RANGES: {
      const receiptList = [...state.receiptList]
      const index = receiptList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      const changeObj = { ...receiptList[index] }
      changeObj.id = action.payload.data.id ? action.payload.data.id : ''
      changeObj.fee_account.fee_account_name = action.payload.data.fee_account.fee_account_name ? action.payload.data.fee_account.fee_account_name : ''
      changeObj.range_from = action.payload.data.range_from ? action.payload.data.range_from : ''
      changeObj.range_to = action.payload.data.range_to ? action.payload.data.range_to : ''
      changeObj.sequence_no = action.payload.data.sequence_no ? action.payload.data.sequence_no : ''
      changeObj.is_active = action.payload.data.is_active ? action.payload.data.is_active : false
      receiptList[index] = { ...changeObj }
      return {
        ...state,
        receiptList: receiptList
      }
    }
    case actionTypes.FEE_ACCOUNT_PER_BRANCH: {
      return {
        ...state,
        feeAccPerBrnch: action.payload.data
      }
    }
    case actionTypes.ADD_RECEIPT_RANGES: {
      const receiptList = [...state.receiptList]
      receiptList.push({
        Sr: state.receiptList.length ? state.receiptList.length + 1 : 1,
        id: action.payload.data.id ? action.payload.data.id : '',
        fee_account: action.payload.data.fee_account ? action.payload.data.fee_account : '',
        range_from: action.payload.data.range_from ? action.payload.data.range_from : '',
        range_to: action.payload.data.range_to ? action.payload.data.range_to : '',
        sequence_no: action.payload.data.sequence_no ? action.payload.data.sequence_no : '',
        is_active: action.payload.data.is_active ? action.payload.data.is_active : false
      })
      return {
        ...state,
        receiptList: receiptList
      }
    }
    case actionTypes.DELETE_RECEIPT_RANGES_LIST: {
      const receiptList = [...state.receiptList]
      const deletedReceiptList = receiptList.filter(fee => {
        return fee.id !== action.payload.id
      })
      return {
        ...state,
        receiptList: deletedReceiptList
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default receiptRangeReducer
