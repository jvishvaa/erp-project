import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action-types
export const FETCH_FEE_ACC_BRANCH_MAPPING = 'FETCH_FEE_ACC_BRANCH_MAPPING'
export const DELETE_FEE_ACC_BRANCH_MAPPING = 'DELETE_FEE_ACC_BRANCH_MAPPING'
export const FETCH_REMAINING_FEE_ACCOUNTS = 'FETCH_REMAINING_FEE_ACCOUNTS'
export const ADD_FEE_ACCOUNTS_TO_BRANCH = 'ADD_FEE_ACCOUNTS_TO_BRANCH'

// action-creators
export const fetchFeeAccountBranchMapping = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.FinanceFeeAccToBranch + '?academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      } }).then(response => {
      dispatch({
        type: FETCH_FEE_ACC_BRANCH_MAPPING,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Load')
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const deleteFeeAccountBranchMapping = (payload) => {
  const mapId = payload.mapId
  const accId = payload.accId
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.delete(urls.DeleteFeeAccToBranch + '?id=' + mapId + '&account_id=' + accId, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      } }).then(response => {
      if (response.data === 'success') {
        dispatch({
          type: DELETE_FEE_ACC_BRANCH_MAPPING,
          payload: {
            mapId,
            accId
          }
        })
        dispatch(actionTypes.dataLoaded())
      }
    }).catch(err => {
      payload.alert.warning('Unable To Delete')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchRemainingFeeAcc = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.RemainingFeeAccToBranch + '?branch_map_id=' + payload.mapId + '&academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      } }).then(response => {
      dispatch({
        type: FETCH_REMAINING_FEE_ACCOUNTS,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Load')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const addFeeAccountsToBranch = (payload) => {
  const uri = urls.AddFeeAccountsToBranch.split('*')
  const finalUrl = uri[0] + payload.mapId + uri[1]
  return (dispatch) => {
    const body = {
      branch: payload.branch,
      fee_account_name: payload.feeAccounts
    }
    dispatch(actionTypes.dataLoading())
    axios.put(finalUrl, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: ADD_FEE_ACCOUNTS_TO_BRANCH,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Add')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}
