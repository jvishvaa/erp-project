import * as actionTypes from '../../../store/actions'

const initialState = {
  requestList: [],
  branchPendingList: [],
  sessionRed: null,
  editDetails: null,
  redirect: false
}

const storePaymentRequestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_STORE_PAY_REQS: {
      return {
        ...state,
        requestList: action.payload.data,
        sessionRed: action.payload.session,
        redirect: false
      }
    }
    case actionTypes.FETCH_STORE_BRANCH_TRANSACTION: {
      return {
        ...state,
        branchPendingList: action.payload.data
      }
    }
    // case actionTypes.FETCH_EDIT_DETAILS: {
    //   return {
    //     ...state,
    //     editDetails: action.payload.data
    //   }
    // }
    case actionTypes.UPDATE_STORE_EDIT_DETAILS: {
      return {
        ...state,
        redirect: true
      }
    }
    // case actionTypes.CLEARING_ALL: {
    //   return {
    //     ...state,
    //     redirect: false
    //   }
    // }
    default: {
      return {
        ...state
      }
    }
  }
}

export default storePaymentRequestsReducer
