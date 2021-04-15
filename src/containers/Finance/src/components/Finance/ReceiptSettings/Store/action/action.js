import axios from 'axios'
import * as actionTypes from '../../../store/actions/actions'
import { urls } from '../../../../../urls'

// action types
export const RECEIPT_SETTINGS_LIST = 'RECEIPT_SETTINGS_LIST'
export const RECEIPT_SETTINGS_EDIT = 'RECEIPT_SETTINGS_EDIT'
export const RECEIPT_SETTINGS_ADD = 'RECEIPT_SETTINGS_ADD'
export const RECEIPT_SETTINGS_DELETE = 'RECEIPT_SETTINGS_DELETE'

// action creators
export const fetchReceiptSettingsList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.receiptSettingsList + '?academic_year=' + payload.session + '&branch=' + payload.branch, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: RECEIPT_SETTINGS_LIST,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
    })
  }
}

export const editReceiptSettings = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.receiptSettingEdit, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        dispatch({
          type: RECEIPT_SETTINGS_EDIT,
          payload: {
            data: response.data
          }
        })
        // payload.alert.success('Edited Successfully')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
    })
  }
}

export const AddReceiptSetting = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.addReceiptSetting, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 201) {
        dispatch({
          type: RECEIPT_SETTINGS_ADD,
          payload: {
            data: response.data
          }
        })
        // payload.alert.success('added Successfully')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      // payload.alert.error('Something Went Wrong')
      console.log(error)
    })
  }
}
export const deleteReceiptSettingList = (payload) => {
  const { id } = payload
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.delete(urls.receiptSettingEdit + '?id=' + id, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 204) {
        dispatch({
          type: RECEIPT_SETTINGS_DELETE,
          payload: {
            id: id
          }
        })
        // payload.alert.success('deleted Successfully')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      // payload.alert.error('Something Went Wrong')
      console.log(error)
    })
  }
}
