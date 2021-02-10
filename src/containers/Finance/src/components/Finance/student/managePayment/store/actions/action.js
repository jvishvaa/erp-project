import axios from 'axios'
import * as actionTypes from '../../../../store/actions/actions'
import { urls } from '../../../../../../urls'

// action types
export const OTHER_FEE_LIST = 'OTHER_FEE_LIST'
export const FEE_DETAILS_LIST = 'FEE_DETAILS_LIST'
export const MAKE_PAYMENT_LIST = 'MAKE_PAYMENT_LIST'
export const SUBMIT_MAKE_PAYMENT = 'SUBMIT_MAKE_PAYMENT'
export const ALL_TRANSACTIONS_LIST = 'ALL_TRANSACTIONS_LIST'
export const CLEAR_UNRELEVANT_DATA = 'CLEAR_UNRELEVANT_DATA'
export const IS_PARTIAL_PAY = 'IS_PARTIAL_PAY'
export const STATUS_MAKE_PAYMENT = 'STATUS_MAKE_PAYMENT'
export const CANCEL_PAYMENT_STUDENT = 'CANCEL_PAYMENT_STUDENT'

// action creators

export const isPartialPay = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.IsPartialPay + '?academic_year=' + payload.session + '&grades=' + payload.gradeId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: IS_PARTIAL_PAY,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        if (err.response && err.response.data && err.response.data.err_msg && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          // payload.alert.warning('Something Went Wrong!')
        }
        console.log(err)
      })
  }
}

export const fetchOtherFeeList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ListOtherFeesForStudentPayment + '?academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: OTHER_FEE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        if (err.response && err.response.data && err.response.data.err_msg && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(err)
      })
  }
}

export const fetchFeeDetailsList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentFeeDetails + '?academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_DETAILS_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        if (err.response && err.response.data && err.response.data.err_msg && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          // payload.alert.warning('Something Went Wrong!')
        }
        console.log(err)
      })
  }
}

export const fetchMakePaymentList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentMakePayment + '?academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: MAKE_PAYMENT_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        if (err.response && err.response.data && err.response.data.err_msg && (err.response.status === 400 || err.response.status === 404)) {
          // payload.alert.warning(err.response.data.err_msg)
        } else {
          // payload.alert.warning('Something Went Wrong!')
        }
        console.log(err)
      })
  }
}

export const makePaymentStudent = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.StudentCheckPayment, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: SUBMIT_MAKE_PAYMENT,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        if (err.response && err.response.data && err.response.data.err_msg && (err.response.status === 400 || err.response.status === 404)) {
          // payload.alert.warning(err.response.data.err_msg)
        } else {
          // payload.alert.warning('Something Went Wrong!')
        }
        console.log(err)
      })
  }
}

export const fetchAllTransactionsList = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.AccountantTransaction}?session_year=${payload.session}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log(response)
      dispatch({
        type: ALL_TRANSACTIONS_LIST,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      if (err.response && err.response.data && err.response.data.err_msg && (err.response.status === 400 || err.response.status === 404)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}
export const statusMakePaymentList = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.StatusMakePayment}?academic_year=${payload.session}&erp=${payload.erp}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log(response)
      dispatch({
        type: STATUS_MAKE_PAYMENT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      if (err.response && err.response.data && err.response.data.err_msg && (err.response.status === 400 || err.response.status === 404)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const cancelPaymentStudent = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.CancelPyayment, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: CANCEL_PAYMENT_STUDENT,
          payload: {
            data: response.data
          }
        })
        payload.alert.success('Rejected Successfully!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
