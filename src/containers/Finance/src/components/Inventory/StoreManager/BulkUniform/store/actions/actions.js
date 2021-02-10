import axios from 'axios'
import * as actionTypes from '../../../../../Finance/store/actions/actions'
import { urls } from '../../../../../../urls'

// action-types
export const FETCH_BULK_UNI = 'FETCH_BULK_UNI'
export const SEND_BULK_UNI = 'SEND_BULK_UNI'
export const SEND_EACH_UNI = 'SEND_EACH_UNI'
export const CLEAR_ALL_SIZE = 'CLEAR_ALL_SIZE'

// action - creators
export const fetchBulkUniform = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListBulkUniform + '?session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_BULK_UNI,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      // payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const sendEachUni = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.UpdateEachUni, payload.body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) payload.alert.success('Saved!')
      dispatch({
        type: SEND_EACH_UNI,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      // payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const sendBulkUniform = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.UpdateBulkUni, payload.body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) payload.alert.success('Saved!')
      dispatch({
        type: SEND_BULK_UNI,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      // payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const clearAllSize = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    dispatch({
      type: CLEAR_ALL_SIZE
    })
    dispatch(actionTypes.dataLoaded())
  }
}
