import axios from 'axios'
import * as actionTypes from '../../../store/actions/actions'
import { urls } from '../../../../../urls'

// action creators
export const RECEIPT_RANGES_LIST = 'RECEIPT_RANGES_LIST'
export const FEE_ACCOUNT_PER_BRANCH = 'FEE_AACCOUNT_PER_BRANCH'
export const UPDATE_RECEIPT_RANGES = 'UPDATE_RECEIPT_RANGES'
export const ADD_RECEIPT_RANGES = 'ADD_RECEIPT_RANGES'
export const DELETE_RECEIPT_RANGES_LIST = 'DELETE_RECEIPT_RANGES_LIST'

// action types
export const fetchReceiptRanges = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ReceiptList + '?academic_year=' + payload.session + '&branch_id=' + payload.branch + '&receipt_type_id=' + payload.receiptType, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: RECEIPT_RANGES_LIST,
          payload: {
            data: response.data.results
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const fetchFeeAccountPerBranch = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeeAccount + '?branch_id=' + payload.branch + '&academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_ACCOUNT_PER_BRANCH,
          payload: {
            data: response.data.results
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const updateReceiptRanges = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.Finance + payload.id + '/editreceipt/', payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: UPDATE_RECEIPT_RANGES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Updated Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const addReceiptRanges = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.CreateReceipt, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ADD_RECEIPT_RANGES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Added Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const deleteReceiptFeeList = (payload) => {
  const { id } = payload
  var url = urls.Finance + id + '/' + 'deletereceipt/'
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .delete(url, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        // if(response.data === 'success'){
        dispatch({
          type: DELETE_RECEIPT_RANGES_LIST,
          payload: {
            id: id
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Deleted Successfully')
        // }
      }).catch(error => {
        payload.alert.error('Something went wrong')
        dispatch(actionTypes.dataLoaded())
        console.log(error)
      })
  }
}
