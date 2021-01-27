import axios from 'axios'
import * as actionTypes from '../../../../store/actions/actions'
import { urls } from '../../../../../../urls'

// action types
export const FETCH_CURR_FEE = 'FETCH_CURR_FEE'
export const ADD_CURR_FEE = 'ADD_CURR_FEE'
export const UPDATE_CURR_FEE = 'UPDATE_CURR_FEE'
export const DELETE_CURR_FEE = 'DELETE_CURR_FEE'

// action creators
export const fetchCurrFeeList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.CurrFeeTypeList + '?session_year=' + payload.session + '&branch_id=' + payload.branch, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_CURR_FEE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          // payload.alert.warning('Something went Wrong!')
        }

        console.log(err)
      })
  }
}

export const addCurrFeeList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.AddCurrFeeType, payload.pay, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 201) {
          // payload.alert.success('Added Successfully!')
          dispatch({
            type: ADD_CURR_FEE,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          // payload.alert.warning('Something went Wrong!')
        }
        console.log(err)
      })
  }
}

export const updateCurrFeeList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.UpdateCurrFeeType, payload.pay, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          // payload.alert.success('Updated Successfully!')
          dispatch({
            type: UPDATE_CURR_FEE,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          // payload.alert.warning('Something went Wrong!')
        }
        console.log(err)
      })
  }
}

export const deleteCurrFeeList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .delete(urls.DeleteCurrFeeType + '?id=' + payload.id, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          // payload.alert.success('Deleted Successfully!')
          dispatch({
            type: DELETE_CURR_FEE,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          // payload.alert.warning('Something went Wrong!')
        }
        console.log(err)
      })
  }
}
