import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  feeCollectionList: [],
  status: true,
  transactionId: null,
  ReceiptNo: '',
  studentId: null
}

export const feeCollectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FEE_COLLECTION_LIST: {
      return {
        ...state,
        feeCollectionList: action.payload.data
      }
    }
    case actionTypes.PAY_NON_ORCHIDS: {
      return {
        ...state,
        transactionId: action.payload.data.transaction_id,
        status: action.payload.status,
        ReceiptNo: action.payload.data.receipt_number_online ? action.payload.data.receipt_number_online : ''
      }
    }
    case actionTypes.SAVE_OUTSIDERS: {
      return {
        ...state,
        studentId: action.payload.data && action.payload.data.student ? action.payload.data.student : null
      }
    }
    // case actionTypes.SEND_ALL_PAYMENTS: {
    //   return {
    //     ...state,
    //     transactionId: action.payload.data.transaction_id,
    //     status: action.payload.status,
    //     ReceiptNo: action.payload.data.receipt_number_online ? action.payload.data.receipt_number_online : ''
    //   }
    // }
    default : {
      return {
        ...state
      }
    }
  }
}

export default feeCollectionReducer
