import axios from 'axios'
import { urls } from '../../../../../../../urls'
import * as actionTypes from '../../../../../store/actions/actions'

// action types
export const FETCH_ACCOUNTANT_CHEQUE_TRANSACTIONS = 'FETCH_ACCOUNTANT_CHEQUE_TRANSACTIONS'
export const FETCH_CHEQUE_BOUNCE = 'FETCH_CHEQUE_BOUNCE'
export const SAVE_CHEQUE_BOUNCE = 'SAVE_CHEQUE_BOUNCE'

// action creators
export const fetchAccountantChequeTransaction = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.AccountantChequeTransaction}?erp_code=${payload.erpNo}&session_year=${payload.session}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_ACCOUNTANT_CHEQUE_TRANSACTIONS,
        payload: {
          data: response.data.results,
          total: response.data.total
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const fetchChequeBounce = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.FetchChequeBounce + '?transaction_id=' + payload.transId + '&erp=' + payload.erp, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log('response from cheque bounce ', response)
      if (response.status === 200) {
        dispatch({
          type: FETCH_CHEQUE_BOUNCE,
          payload: {
            data: response.data.results
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.error('Unable to load')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const saveChequeBounce = (payload) => {
  let url = null
  if (payload.chequeBounce) {
    url = urls.UpdateChequeBounce
  } else {
    url = urls.SaveChequeBounce
  }
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.put(url, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        // payload.alert.success('Updated Successfully')
        dispatch({
          type: SAVE_CHEQUE_BOUNCE,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      // payload.alert.error('Unable to load')
      dispatch(actionTypes.dataLoaded())
    })
  }
}
