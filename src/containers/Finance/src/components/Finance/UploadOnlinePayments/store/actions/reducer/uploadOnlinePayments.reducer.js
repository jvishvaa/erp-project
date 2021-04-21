import * as actionTypes from '../../../../store/actions'

const initialState = {
  airpayData: null
}

const onlinePaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AIRPAY_PAYMENT: {
      return {
        ...state,
        airpayData: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default onlinePaymentReducer
