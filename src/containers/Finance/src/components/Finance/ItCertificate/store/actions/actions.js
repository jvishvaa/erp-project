import axios from 'axios'

import * as actionTypes from '../../../store/actions/actions'
import { urls } from '../../../../../urls'

// Action Constants
export const FETCH_ALL_FEE_TYPE = 'FETCH_ALL_FEE_TYPE'
export const FETCH_ITC_LIST = 'FETCH_ITC_LIST'
export const SAVE_FEE_TYPE = 'SAVE_FEE_TYPE'
export const DELETE_ITC_LIST = 'DELETE_ITC_LIST'

// Action Creators
export const fetchAllFeeType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.FeeTypesForIT + '?academic_year=' + payload.session + '&branch=' + payload.branchId, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_ALL_FEE_TYPE,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Unable To Load')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchItcList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ITCList + '?academic_year=' + payload.session + '&branch=' + payload.branchId, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_ITC_LIST,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Unable To Load')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const saveFeeType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.ITC, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: SAVE_FEE_TYPE,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
      // payload.alert.success('Added Successfully')
    }).catch(err => {
      // payload.alert.warning('Unable To Load')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const deleteITCList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.delete(urls.DeleteItcList + '?fee_type=' + payload.id + '&academic_year=' + payload.session + '&branch=' + payload.branch, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: DELETE_ITC_LIST,
        payload: {
          id: payload.id
        }
      })
      dispatch(actionTypes.dataLoaded())
      // payload.alert.success('Deleted Successfully')
    }).catch(err => {
      // payload.alert.error('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}
