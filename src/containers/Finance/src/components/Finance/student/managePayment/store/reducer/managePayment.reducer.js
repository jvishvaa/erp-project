import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  studentOtherFeeList: [],
  feeDetailsList: [],
  studentMakePaymentList: [],
  confirmPayment: false,
  orderId: null,
  amount: '',
  allTransactionList: [],
  walletInfo: [],
  isPartial: false,
  status: []
}

const managePaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.IS_PARTIAL_PAY: {
      return {
        ...state,
        isPartial: action.payload.data[0].is_applicable
      }
    }
    case actionTypes.OTHER_FEE_LIST: {
      return {
        ...state,
        studentOtherFeeList: action.payload.data
      }
    }
    case actionTypes.FEE_DETAILS_LIST: {
      return {
        ...state,
        feeDetailsList: action.payload.data
      }
    }
    case actionTypes.MAKE_PAYMENT_LIST: {
      return {
        ...state,
        studentMakePaymentList: action.payload.data
      }
    }
    case actionTypes.ALL_TRANSACTIONS_LIST: {
      return {
        ...state,
        allTransactionList: action.payload.data
      }
    }
    case actionTypes.SUBMIT_MAKE_PAYMENT: {
      return {
        ...state,
        confirmPayment: true,
        orderId: action.payload.data.order_id,
        amount: action.payload.data.total_amount
      }
    }
    case actionTypes.CLEAR_UNRELEVANT_DATA: {
      return {
        ...state,
        orderId: null,
        amount: '',
        confirmPayment: false,
        studentMakePaymentList: []
      }
    }
    case actionTypes.STATUS_MAKE_PAYMENT: {
      return {
        ...state,
        status: action.payload.data
      }
    }
    case actionTypes.CANCEL_PAYMENT_STUDENT : {
      let payData = [ ...state.status ]
      let index = payData.findIndex((val) => +val.id === +action.payload.data.id)
      if (index !== -1) {
        payData[index] = { ...action.payload.data }
      }
      return {
        ...state,
        status: payData
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default managePaymentReducer
