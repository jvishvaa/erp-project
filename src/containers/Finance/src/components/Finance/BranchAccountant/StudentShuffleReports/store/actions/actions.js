import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const FETCH_INTERNAL_SHUFFLE = 'FETCH_INTERNAL_SHUFFLE'
export const FETCH_EXTERNAL_SHUFFLE = 'FETCH_EXTERNAL_SHUFFLE'

// action creators
export const fetchInternalShuffle = (payload) => {
  let url = null
  if (payload.type === 2) {
    url = urls.InternalShuffle + '?academic_year=' + payload.session + '&type=' + payload.type + '&grade_id=' + payload.grade
  } else {
    url = urls.InternalShuffle + '?academic_year=' + payload.session + '&type=' + payload.type
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log('app res: ', response)
        if (response.status === 200) {
          dispatch({
            type: FETCH_INTERNAL_SHUFFLE,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        if (error.response && (error.response.status === 400 || error.response.status === 404)) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}
export const fetchExternalShuffle = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ExternalShuffle + '?academic_year=' + payload.session + '&type=' + payload.type, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log('app res: ', response.data)
        if (response.status === 200) {
          dispatch({
            type: FETCH_EXTERNAL_SHUFFLE,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        if (error.response && (error.response.status === 400 || error.response.status === 404)) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}
