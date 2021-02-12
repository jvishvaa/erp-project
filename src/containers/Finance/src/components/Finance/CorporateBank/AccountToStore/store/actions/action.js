import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action-types
export const FETCH_STORE_ACC_BRANCH_MAPPING = 'FETCH_STORE_ACC_BRANCH_MAPPING'
export const UPDATE_STORE_FEE_ACC_MAP = 'UPDATE_STORE_FEE_ACC_MAP'
export const ADD_STORE_FEE_ACCOUNTS = 'ADD_STORE_FEE_ACCOUNTS'
export const ACTIVE_INACTIVE_FEE_ACCOUNTS = 'ACTIVE_INACTIVE_FEE_ACCOUNTS'

// action-creators
export const fetchStoreBranchMapping = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.StoreBranchAccList + '?academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      } }).then(response => {
      dispatch({
        type: FETCH_STORE_ACC_BRANCH_MAPPING,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Unable To Load')
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const updateFeeAccountStoreMap = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.UpdateFeeAccountName, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      } }).then(response => {
      dispatch({
        type: UPDATE_STORE_FEE_ACC_MAP,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
      // payload.alert.success('Updated Successfully')
    }).catch(error => {
      if (error.response && error.response.status === 400) {
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.error('Something Went Wrong')
      }
      console.log(error)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const addStoreFeeAccount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.UpdateStoreFeeAcc, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      } }).then(response => {
      dispatch({
        type: ADD_STORE_FEE_ACCOUNTS,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
      // payload.alert.success('Updated Successfully')
    }).catch(error => {
      // if (err.response.data.status_code === 404 && err.response.data.statusText === 'Fee Account is already present') {
      //   payload.alert.error(err.response.data.statusText)
      // } else {
      //   payload.alert.error('Something Went Wrong')
      // }
      if (error.response && error.response.status === 400) {
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      console.log(error.response)
      // console.log(error.response.data)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const activeInactiveAccount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.ActiveInactiveFeeAccount, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      } }).then(response => {
      dispatch({
        type: ACTIVE_INACTIVE_FEE_ACCOUNTS,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
      console.log('data++++++', response.data)
      // payload.alert.success('Updated Successfully')
    }).catch(error => {
      if (error.response && error.response.status === 400) {
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Unable To get status')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}
