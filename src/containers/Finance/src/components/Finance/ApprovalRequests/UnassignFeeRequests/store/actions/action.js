import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const FETCH_UNASSIGNED_REQUEST_LIST = 'FETCH_UNASSIGNED_REQUEST_LIST'
export const CLEAR_UNASSIGN_PROPS = 'CLEAR_UNASSIGN_PROPS'
export const FETCH_PENDING_REQ_LIST = 'FETCH_PENDING_REQ_LIST'
export const FETCH_APPROVAL_REQ_LIST = 'FETCH_APPROVAL_REQ_LIST'
export const FETCH_REJECTED_REQ_LIST = 'FETCH_REJECTED_REQ_LIST'
export const APPROVE_UNASSIGN_FEE_LIST = 'APPROVE_UNASSIGN_FEE_LIST'
export const REJECT_UNASSIGN_FEE_LIST = 'REJECT_UNASSIGN_FEE_LIST'

// action creators
export const fetchUnassignedRequestList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.UnassignRequestList + '?academic_year=' + payload.session.value + '&branch=' + payload.branch.value, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_UNASSIGNED_REQUEST_LIST,
          payload: {
            data: response.data,
            session: payload.session,
            branch: payload.branch
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        console.log(error)
        payload.alert.warning('Unable To Load')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const fetchPendingReqList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.pendingUnassignFeeReq + '?academic_year=' + payload.session + '&branch=' + payload.branch + '&pending=1', {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_PENDING_REQ_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        console.log(error)
        payload.alert.warning('Unable To Load')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const fetchApprovedReqList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.pendingUnassignFeeReq + '?academic_year=' + payload.session + '&branch=' + payload.branch + '&pending=0&approved=2', {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_APPROVAL_REQ_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        console.log(error)
        payload.alert.warning('Unable To Load')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const fetchRejectedReqList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.pendingUnassignFeeReq + '?academic_year=' + payload.session + '&branch=' + payload.branch + '&pending=0&approved=0', {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_REJECTED_REQ_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        console.log(error)
        payload.alert.warning('Unable To Load')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const approveUnassignFeeReq = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.ApproveAndRejectReq, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: APPROVE_UNASSIGN_FEE_LIST,
          payload: {
            id: payload.id
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Request Approved Successfully')
      }).catch(error => {
        console.log(error)
        payload.alert.error('Something Went Wrong')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const rejectUnassignFeeReq = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.ApproveAndRejectReq, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: REJECT_UNASSIGN_FEE_LIST,
          payload: {
            id: payload.id
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Request Rejected Successfully')
      }).catch(error => {
        console.log(error)
        payload.alert.error('Something Went Wrong')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const clearUnassignProps = () => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    dispatch({
      type: CLEAR_UNASSIGN_PROPS
    })
    dispatch(actionTypes.dataLoaded())
  }
}
