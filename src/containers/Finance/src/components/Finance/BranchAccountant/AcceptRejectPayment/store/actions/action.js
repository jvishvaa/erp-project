import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

export const GET_PAYMENT_DETAILS = 'GET_PAYMENT_DETAILS'
export const CANCEL_PAYMENT = 'CANCEL_PAYMENT'
export const ACCEPT_PAYMENT = 'ACCEPT_PAYMENT'

export const getPaymentDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.PaymentDetails + '?academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: GET_PAYMENT_DETAILS,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        payload.alert.warning(error.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const cancelPayment = (payload) => {
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
          type: CANCEL_PAYMENT,
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
        payload.alert.warning(error.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const acceptPayment = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.AcceptPayment, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: ACCEPT_PAYMENT,
          payload: {
            data: response.data
          }
        })
        payload.alert.success('Accepted Successfully!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        payload.alert.warning(error.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
