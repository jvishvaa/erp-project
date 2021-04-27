import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action-types
export const FETCH_ALL_FEE_ACCOUNTS = 'FETCH_ALL_FEE_ACCOUNTS'
export const ADD_FEE_ACCOUNTS = 'ADD_FEE_ACCOUNTS'
export const EDIT_FEE_ACCOUNTS = 'EDIT_FEE_ACCOUNTS'
export const DELETE_FEE_ACCOUNTS = 'DELETE_FEE_ACCOUNTS'

export const fetchAllFeeAccounts = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListStoreFeeAccount + '?academic_year=' + payload.session + '&branch_id=' + payload.branchId + '&module_id=' + payload.moduleId, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_ALL_FEE_ACCOUNTS,
        payload: {
          data: response.data.results
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

export const addFeeAccounts = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.AddFeeAccount, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (+response.status === 201) {
          dispatch({
            type: ADD_FEE_ACCOUNTS,
            payload: {
              data: response.data
            }
          })
          payload.alert.success('Added Successfully')
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        payload.alert.error('Something Went Wrong')
        dispatch(actionTypes.dataLoaded())
        console.log(error)
      })
  }
}

export const editFeeAccounts = (payload) => {
  let updatedList = urls.Finance + payload.id + '/editfeeaccountinfo/'
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(updatedList, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          payload.alert.success('Edited Successfully')
          dispatch({
            type: EDIT_FEE_ACCOUNTS,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        payload.alert.error('Something Went Wrong')
        dispatch(actionTypes.dataLoaded())
        console.log(error)
      })
  }
}

export const deleteFeeAccounts = (payload) => {
  var updatedList = urls.Finance + payload.deleteId + '/editfeeaccountinfo/'
  return (dispatch) => {
    const { deleteId } = payload
    dispatch(actionTypes.dataLoading())
    axios
      .put(updatedList, payload.deleteData, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: DELETE_FEE_ACCOUNTS,
          payload: {
            data: response.data,
            deleteId
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Deleted Successfully')
      }).catch(error => {
        payload.alert.error('Something Went Wrong')
        dispatch(actionTypes.dataLoaded())
        console.log(error)
      })
  }
}
