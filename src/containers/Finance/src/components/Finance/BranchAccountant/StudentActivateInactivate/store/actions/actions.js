import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

export const GET_ACTIVE_STUDENT_DETAILS = 'GET_ACTIVE_STUDENT_DETAILS'
export const GET_INACTIVE_STUDENT_DETAILS = 'GET_INACTIVE_STUDENT_DETAILS'
export const FETCH_ALL_PAYMENT = 'FETCH_ALL_PAYMENT'
export const POST_STUDENT_ACTIVATE = 'POST_STUDENT_ACTIVATE'
export const getActiveStudentDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.Studentstatusfilter + '?academic_year=' + payload.session + '&status=' + payload.status + '&section=' + payload.section + '&grade=' + payload.grade, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: GET_ACTIVE_STUDENT_DETAILS,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
      payload.alert.warning('Unable to load data')
    })
  }
}
export const getInActiveStudentDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.Studentstatusfilter + '?academic_year=' + payload.session + '&status=False&section=' + payload.section + '&grade=' + payload.grade, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: GET_INACTIVE_STUDENT_DETAILS,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
      payload.alert.warning('Unable to load data')
    })
  }
}
export const fetchAllPayment = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.StudentPayAtAcc + '?student=' + payload.erp + '&academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }

    }).then(response => {
      dispatch({
        type: FETCH_ALL_PAYMENT,
        payload: {
          data: response.data,
          erp: payload.erp
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Load')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}
export const postStudentActivateInactivate = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.InitiateStudentActiveInactive, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 201) {
        payload.alert.success('successfully Changed')
        dispatch({
          type: POST_STUDENT_ACTIVATE,
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
