import axios from 'axios'
import { urls } from '../../../../../../../urls'
import * as actionTypes from '../../../../../store/actions/actions'

// action types
export const FETCH_ACCOUNTANT_TRANSACTIONS = 'FETCH_ACCOUNTANT_TRANSACTIONS'
export const EDIT_ACCOUNTANT_TRANSACTIONS = 'EDIT_ACCOUNTANT_TRANSACTIONS'
export const UPDATE_ACCOUNTANT_TRANSACTIONS = 'UPDATE_ACCOUNTANT_TRANSACTIONS'

// action creators
export const fetchAccountantTransaction = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    let url = null
    if (payload.erpNo) {
      url = `${urls.AccountantTransaction}?erp_code=${payload.erpNo}&session_year=${payload.session}&branch_id=${this.props.branchId}&module_id=${this.props.moduleId}`
    } else {
      url = `${urls.AccountantTransaction}?session_year=${payload.session}&branch_id=${this.props.branchId}&module_id=${this.props.moduleId}`
    }
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log(response)
      dispatch({
        type: FETCH_ACCOUNTANT_TRANSACTIONS,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}

export const editAccountantTransaction = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.EditAccTransaction + '?transaction_id=' + payload.transactionId + '&branch_id=' + payload.branchId + '&module_id=' + payload.moduleId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: EDIT_ACCOUNTANT_TRANSACTIONS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        console.log(err)
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}

export const updateAccountantTransaction = (payload) => {
  let url = null
  console.log('payload ::', payload)
  if (payload.data && payload.data.kit_payment) {
    url = urls.StorePaymentCancelRequest
  } else {
    url = urls.RequestAccTransaction
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(url, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 201) {
          payload.alert.success('Request Sent Successfully!')
          dispatch({
            type: UPDATE_ACCOUNTANT_TRANSACTIONS,
            payload: {
              refresh: true,
              data: response.data,
              data2: true
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        console.log(err)
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}
