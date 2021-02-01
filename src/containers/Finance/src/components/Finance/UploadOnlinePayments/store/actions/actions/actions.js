import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

export const AIRPAY_PAYMENT = 'AIRPAY_PAYMENT'

export const airpayPayment = (payload) => {
  let url
  if (payload.payMode && payload.payMode.value === 'Axis') {
    url = urls.AxisPayments
  } else if (payload.payMode && payload.payMode.value === 'Airpay') {
    url = urls.AirpayPayments
  } else if (payload.payMode && payload.payMode.value === 'Hdfc') {
    url = urls.HdfcPayments
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(url, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: AIRPAY_PAYMENT,
        payload: {
          data: response.data
        }
      })
      if (response.status === 200) {
        if (response.data.length > 0) {
          payload.alert.success('Success!')
        }
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 409 || err.response.status === 404)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }

      dispatch(actionTypes.dataLoaded())
    })
  }
}
