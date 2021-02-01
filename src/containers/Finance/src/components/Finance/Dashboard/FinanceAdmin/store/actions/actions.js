import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const GET_ACTIVE_REQUEST = 'GET_ACTIVE_REQUEST'
export const GET_INACTIVE_REQUEST = 'GET_INACTIVE_REQUEST'
export const APPROVE_REQUEST = 'APPROVE_REQUEST'
export const GET_STUDENT_STATUS_FOR_ADMIN = 'GET_STUDENT_STATUS_FOR_ADMIN'
export const GET_STUDENT_COUNT_ACTIVE = 'GET_STUDENT_COUNT_ACTIVE'
export const GET_STUDENT_COUNT_INACTIVE = 'GET_STUDENT_COUNT_INACTIVE'
export const SWITCH_BRANCH_ADMIN = 'SWITCH_BRANCH_ADMIN'
export const PENDING_ADMISSION = 'PENDING_ADMISSION'

export const getActiveRequest = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.GetActiveRequestfinAdmin + '?year=' + payload.sessionYear, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: GET_ACTIVE_REQUEST,
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

export const getInActiveRequest = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.GetActiveRequestfinAdmin + '?year=' + payload.sessionYear, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: GET_INACTIVE_REQUEST,
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
export const approveRequest = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.ApproveStudentActivateInactiveReuest, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        payload.alert.success('successfully Changed')
        dispatch({
          type: APPROVE_REQUEST,
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
export const getStudentCountActive = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.GetStudentCountDashboard, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: GET_STUDENT_COUNT_ACTIVE,
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
export const getStudentCountInActive = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.GetStudentCountDashboard + '?is_active=False', {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: GET_STUDENT_COUNT_INACTIVE,
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

export const switchBranchAdmin = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    const body = {
      'to_branch': payload.branch,
      'role_id': 16
    }
    axios.put(urls.ChangeBranchAdmin, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: SWITCH_BRANCH_ADMIN,
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

export const getPendingOnlineAdmission = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.pendingOnlineAdmission, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: PENDING_ADMISSION,
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
        payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
