import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action-types
export const FETCH_VIEW_BANKS = 'FETCH_VIEW_BANKS'
export const ADD_VIEW_BANK = 'ADD_VIEW_BANK'
export const EDIT_VIEW_BANK = 'EDIT_VIEW_BANK'
export const DELETE_VIEW_BANK = 'DELETE_VIEW_BANK'

// action-creators
export const fetchViewBanks = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ViewBanks + '?academic_year=' + payload.session + '&branch_id=' + payload.branchId + '&module_id=' + payload.moduleId, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_VIEW_BANKS,
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

export const addBank = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.AddBanks, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ADD_VIEW_BANK,
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

export const editBank = (payload) => {
  let updatedList = urls.Finance + payload.row + '/' + 'editbankaccountinfo/'
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(updatedList, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: EDIT_VIEW_BANK,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('Edited Successfully')
      }).catch(error => {
        // payload.alert.error('Something Went Wrong')
        dispatch(actionTypes.dataLoaded())
        console.log(error)
      })
  }
}

export const deleteBank = (payload) => {
  var updatedList = urls.Finance + payload.row + '/' + 'deletebankaccountinfo/'
  return (dispatch) => {
    const { row } = payload
    dispatch(actionTypes.dataLoading())
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: DELETE_VIEW_BANK,
          payload: {
            data: response.data,
            row
          }
        })
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('Deleted Successfully')
      }).catch(error => {
        // payload.alert.error('Something Went Wrong')
        dispatch(actionTypes.dataLoaded())
        console.log(error)
      })
  }
}
