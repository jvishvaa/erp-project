import axios from 'axios'
import * as actionTypes from '../../../../Finance/store/actions/actions'
import { urls } from '../../../../../urls'

export const STUDENT_UNIFORM_DETAILS = 'STUDENT_UNIFORM_DETAILS'
export const STUDENT_UNIFORM_DETAILS_UPDATE = 'STUDENT_UNIFORM_DETAILS_UPDATE'

export const uniformDetails = (payload) => {
  let url
  if (payload.isStoreManager) {
    url = `${urls.StudentUniform}?erp=${payload.erp}`
  } else {
    url = urls.StudentUniform
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: STUDENT_UNIFORM_DETAILS,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const uniformDetailsUpdate = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(`${urls.StudentUniformUpdate}${payload.data.id}/`, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: STUDENT_UNIFORM_DETAILS_UPDATE,
        payload: {
          data: response.data
        }
      })
      payload.alert.success('Successfully Done')
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}
