import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const UPDATE_STUDENT_STATUS = 'UPDATE_STUDENT_STATUS'
export const GET_STUDENT_STATUS = 'GET_STUDENT_STATUS'

// action creators

// export const getStatusH = (payload) => {
//     return (dispatch) => {
//         dispatch(actionTypes.dataLoading())
//         axios.get(urls.)
//     }
// }
export const getStudentActiveStatus = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.GetStudentActiveStatus + '?erp=' + payload.studentErp, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        dispatch({
          type: GET_STUDENT_STATUS,
          payload: {
            data: response.data
          }
        })
      }
      // dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
      payload.alert.warning('Unable to load data')
    })
  }
}

export const updateStudentStatus = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.UpdateStudentStatus, payload.data, {
      headers: {
        Authorization: 'Bearer' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        payload.alert.success('successfully Changed')
        dispatch({
          type: UPDATE_STUDENT_STATUS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
      payload.alert.warning('Unable to load data')
    })
  }
}
