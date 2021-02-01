import axios from 'axios'
import * as actionTypes from '../../../../store/actions/actions'
import { urls } from '../../../../../../urls'

// action types
export const MISC_FEE_LIST = 'MISC_FEE_LIST'
export const UPDATE_MISC_FEE_LIST = 'UPDATE_MISC_FEE_LIST'
export const ADD_MISC_FEE_LIST = 'ADD_MISC_FEE_LIST'
export const DELETE_MISC_FEE_LIST = 'DELETE_MISC_FEE_LIST'

// action creators
export const fetchListMiscFee = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.MiscFeeType + '?academic_year=' + payload.session + '&branch_id=' + payload.branch, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: MISC_FEE_LIST,
          payload: {
            data: response.data.results
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const deleteMiscFeeList = (payload) => {
  const { id } = payload
  var url = urls.Finance + id + '/' + 'deletemiscellaneousfee/'
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
          type: DELETE_MISC_FEE_LIST,
          payload: {
            id: id
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Deleted Successfully')
        // }
      }).catch(error => {
        // payload.alert.error('Something went wrong')
        dispatch(actionTypes.dataLoaded())
        console.log(error)
      })
  }
}

export const updateMiscFeeList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.Finance + payload.id + '/' + 'editmiscellaneousfee/', payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: UPDATE_MISC_FEE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Updated Sucessfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.error('Something went wrong')
        console.log(error)
      })
  }
}

export const addMiscFeeList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.createMiscFeeType, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ADD_MISC_FEE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Added Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.error('Something went wrong')
        console.log(error)
      })
  }
}
