import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const FETCH_STUDENT_SHUFFLE = 'FETCH_STUDENT_SHUFFLE'
export const SEND_APPROVE_REJECT = 'SEND_APPROVEE_REJECT'
export const INITIATE_STUDENT_SHUFFLE = 'INITIATE_STUDENT_SHUFFLE'

// action creators
export const fetchStudentShuffle = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FetchStudentShuffle + '?academic_year=' + payload.session + '&status=' + payload.status, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log('app res: ', response)
        if (response.status === 200) {
          dispatch({
            type: FETCH_STUDENT_SHUFFLE,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.warning('Unable to load Shuffle')
      })
  }
}

export const sendApproveReject = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.ApproveReject, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          if (payload.data.to_approve_status === 'Approved') {
            // payload.alert.success('Approved Successfully!')
          } else {
            // payload.alert.success('Rejected Successfully!')
          }
          dispatch({
            type: SEND_APPROVE_REJECT,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.warning('Unable to Approve/Reject')
      })
  }
}

export const initiateShuffleRequest = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.InitiateShuffle, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 201) {
          // payload.alert.success('Shuffle Request Initiated')
          dispatch({
            type: INITIATE_STUDENT_SHUFFLE,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        console.log(error.response)
        if (error.response.status === 406) {
          payload.alert.warning(error.response.data)
          dispatch(actionTypes.dataLoaded())
        } else {
          dispatch(actionTypes.dataLoaded())
          console.log(error)
          payload.alert.warning('Unable to initiate shuffle')
        }
      })
  }
}
