import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const NORMAL_FEE_LIST = 'NORMAL_FEE_LIST'
export const EDIT_NORMAL_FEE_LIST = 'EDIT_NORMAL_FEE_LIST'
export const ADD_NORMAL_FEE_LIST = 'ADD_NORMAL_FEE_LIST'
export const DELETE_NORMAL_FEE_LIST = 'DELETE_NORMAL_FEE_LIST'

// action creators
export const fetchListNormalFee = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.NormalFeeType + '?academic_year=' + payload.session + '&branch_id=' + payload.branch, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: NORMAL_FEE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load data')
      })
  }
}

export const editNormalFeeList = (payload) => {
  var url = urls.Finance + payload.id + '/' + 'editnormalfee/'
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(url, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        // console.log(response)
        dispatch({
          type: EDIT_NORMAL_FEE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('Updated Successfully')
      }).catch(error => {
        // payload.alert.error('Something Went Wrong')
        dispatch(actionTypes.dataLoaded())
        console.log(error)
      })
  }
}

export const addNormalFeeList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.createFeeType, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ADD_NORMAL_FEE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('Added Successfully')
      }).catch(error => {
        // payload.alert.error('Something Went Wrong')
        dispatch(actionTypes.dataLoaded())
        console.log(error)
      })
  }
}

export const deleteNormalFeeList = (payload) => {
  const { id } = payload
  var url = urls.Finance + 'deletenormalfee/' + '?fee_type_id=' + id
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
          type: DELETE_NORMAL_FEE_LIST,
          payload: {
            id: id
          }
        })
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('Deleted Successfully')
        // }
      }).catch(error => {
        // payload.alert.error('Something went wrong')
        dispatch(actionTypes.dataLoaded())
        console.log(error)
      })
  }
}
