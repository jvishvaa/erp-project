import axios from 'axios'

import * as actionTypes from '../../../store/actions/actions'
import { urls } from '../../../../../urls'

// Action Constants
export const FETCH_EDIT_REQS = 'FETCH_EDIT_REQS'
export const FETCH_BRANCH_TRANSACTION = 'FETCH_BRANCH_TRANSACTION'
export const FETCH_EDIT_DETAILS = 'FETCH_EDIT_DETAILS'
export const UPDATE_EDIT_DETAILS = 'UPDATE_EDIT_DETAILS'
export const CLEARING_ALL = 'CLEARING_ALL'

// Action Creators
export const fetchEditRequests = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.RequestTransactionChange + '?session_year=' + payload.session.value, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_EDIT_REQS,
        payload: {
          data: response.data,
          session: payload.session
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchBranchTransaction = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.GetBranchTransaction + '?session_year=' + payload.session + '&branch_id=' + payload.branchId + '&changed_status=' + payload.status, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_BRANCH_TRANSACTION,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchEditDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.GetEditTransDetails + '?requesttransaction_id=' + payload.requestId, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_EDIT_DETAILS,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const updateEditDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.UpdateEditDetails, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        payload.alert.success('Successfully Updated!')
        dispatch({
          type: UPDATE_EDIT_DETAILS,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const clearingAll = () => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    dispatch({
      type: CLEARING_ALL
    })
    dispatch(actionTypes.dataLoaded())
  }
}
