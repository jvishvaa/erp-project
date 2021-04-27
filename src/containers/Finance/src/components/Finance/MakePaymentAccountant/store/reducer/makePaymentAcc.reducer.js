import * as actionTypes from '../../../store/actions'

const initialState = {
  feeDetailsList: null,
  erpCode: null,
  transactionId: null,
  receiptRange: null,
  status: false,
  receiptNo: '',
  erpSuggestions: null,
  erpDetails: [],
  studentDues: null,
  walletInfo: [],
  axisPosData: null,
  cardDetailsData: null
}

const makePaymentAccReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_NORMAL_WALLET: {
      return {
        ...state,
        walletInfo: action.payload.data
      }
    }
    case actionTypes.FETCH_ALL_PAYMENT: {
      return {
        ...state,
        feeDetailsList: action.payload.data,
        erpCode: action.payload.erp
      }
    }
    case actionTypes.FETCH_STUDENT_DETAILS: {
      return {
        ...state,
        erpDetails: action.payload.data
      }
    }
    case actionTypes.SEND_ALL_PAYMENT: {
      return {
        ...state,
        transactionId: action.payload.data.transaction_id,
        status: action.payload.status,
        receiptNo: action.payload.data.receipt_number_online ? action.payload.data.receipt_number_online : ''
      }
    }
    case actionTypes.FETCH_RECEIPT_RANGE: {
      return {
        ...state,
        receiptRange: action.payload.data
      }
    }
    case actionTypes.CLEAR_ALL_PROPS: {
      return {
        ...state,
        transactionId: null,
        receiptRange: null,
        status: false,
        receiptNo: '',
        erpSuggestions: []
      }
    }
    case actionTypes.FETCH_STUDENT_SUGGESTIONS: {
      return {
        ...state,
        erpSuggestions: action.payload.data
      }
    }
    case actionTypes.FETCH_STUDENT_DUES: {
      return {
        ...state,
        studentDues: action.payload.data
      }
    }
    case actionTypes.SEND_AXIS_POS_PAYMENT: {
      return {
        ...state,
        axisPosData: action.payload.data,
        cardDetailsData: null
      }
    }
    case actionTypes.PAYMENT_CARD_DETAILS: {
      return {
        ...state,
        cardDetailsData: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default makePaymentAccReducer
