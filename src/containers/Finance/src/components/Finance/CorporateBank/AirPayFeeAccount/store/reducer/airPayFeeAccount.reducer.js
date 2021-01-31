import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  viewAirPay: []
}

const airPayFeeAccountReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_AIRPAY_LIST: {
      return {
        ...state,
        viewAirPay: action.payload.data
      }
    }
    case actionTypes.POST_AIRPAY: {
      return {
        ...state
      }
    }
    case actionTypes.EDIT_VIEW_BANK: {
      return {
        ...state
      }
    }
    case actionTypes.DELETE_VIEW_BANK: {
      return {
        ...state
      }
    }

    default: {
      return {
        ...state
      }
    }
  }
}

export default airPayFeeAccountReducer
