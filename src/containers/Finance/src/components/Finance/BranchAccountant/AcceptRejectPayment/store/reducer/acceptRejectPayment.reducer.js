import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  paymentDetails: [],
  rejectPayment: []
}

const acceptRejectPaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PAYMENT_DETAILS : {
      return {
        ...state,
        paymentDetails: action.payload.data
      }
    }
    case actionTypes.CANCEL_PAYMENT : {
      let payData = [ ...state.paymentDetails ]
      let index = payData.findIndex((val) => +val.id === +action.payload.data.id)

      if (index !== -1) {
        payData[index] = { ...action.payload.data }
      }
      return {
        ...state,
        paymentDetails: payData
      }
    }
    case actionTypes.ACCEPT_PAYMENT : {
      let payData = [ ...state.paymentDetails ]
      let index = payData.findIndex((val) => +val.id === +action.payload.data.id)
      let dataPayload = null
      if (index !== -1) {
        dataPayload = action.payload.data
        // dataPayload.payment_screenshot = 'http://localhost:8000' + action.payload.data.payment_screenshot
        payData[index] = { ...dataPayload }
      }
      return {
        ...state,
        paymentDetails: payData
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}
export default acceptRejectPaymentReducer
