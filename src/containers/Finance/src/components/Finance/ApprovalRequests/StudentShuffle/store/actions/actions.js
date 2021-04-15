import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const FETCH_SHUFFLE_PENDING_REQ = 'FETCH_SHUFFLE_PENDING_REQ'
export const FETCH_STD_FEE_TYPE_DETAILS = 'FETCH_STD_FEE_TYPE_DETAILS'
export const FETCH_INST_LIST_PER_FEE_PAN = 'FETCH_INST_LIST_PER_FEE_PAN'
export const FETCH_FEE_PLANS_SHUFFLE = 'FETCH_FEE_PLANS_SHUFFLE'
export const REASSIGN_STUDENT_SHUFFLE = 'REASSIGN_STUDENT_SHUFFLE'
export const CLEARING_REASSIGN_PROPS = 'CLEARING_REASSIGN_PROPS'
export const FETCH_SHUFFLE_APPROVAL_LISTS = 'FETCH_SHUFFLE_APPROVAL_LISTS'
export const FETCH_SHUFFLE_REJECTED_LISTS = 'FETCH_SHUFFLE_REJECTED_LISTS'
export const REJECT_REQUEST_FOR_SHUFFLE = 'REJECT_REQUEST_FOR_SHUFFLE'

// action creators
export const fetchShufflePendingReq = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentPendingReq + '?year=' + payload.session.value + '&branch=' + payload.branch.value + '&status=Pending', {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_SHUFFLE_PENDING_REQ,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        // payload.alert.warning('Unable To Load')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const fetchStudentFeeDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .all([
        axios.get(urls.StudentDetails + '?studentshuffle_id=' + payload.studentId, {
          headers: {
            Authorization: 'Bearer ' + payload.user
          }
        }),
        axios.get(urls.StudentTotalPaidAmount + '?studentshuffle_id=' + payload.studentId, {
          headers: {
            Authorization: 'Bearer ' + payload.user
          }
        })
      ]).then(axios.spread((response1, response2) => {
        dispatch({
          type: FETCH_STD_FEE_TYPE_DETAILS,
          payload: {
            data: response1.data,
            amount: response2.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      })).catch(error => {
        console.log(error)
        // payload.alert.warning('Unable To Load')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const fetchInstListPerFeePlan = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.InstListPerFeePlan + '?fee_plan_id=' + payload.feePlanId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_INST_LIST_PER_FEE_PAN,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        console.log(error)
        // payload.alert.warning('Unable To Load')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const fetchFeePlanPerStdShuffle = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StdShuffleFeePlan + '?studentshuffle_id=' + payload.stdId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_FEE_PLANS_SHUFFLE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        console.log(error)
        // payload.alert.warning('Unable To Load')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const reassignStudentShuffle = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.ReassignShuffleReq, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: REASSIGN_STUDENT_SHUFFLE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Reassigned Successfully')
      }).catch(error => {
        if (error.response && error.response.data && error.response.data.err_msg) {
          // payload.alert.error(error.response.data.err_msg)
        } else {
          // payload.alert.error('Something went wrong!')
        }
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const fetchShuffleApprLists = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentPendingReq + '?year=' + payload.session.value + '&branch=' + payload.branch.value + '&status=Approved', {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_SHUFFLE_APPROVAL_LISTS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        console.log(error)
        // payload.alert.warning('Unable To Load')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const fetchShuffleRejectLists = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentPendingReq + '?year=' + payload.session.value + '&branch=' + payload.branch.value + '&status=Rejected', {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_SHUFFLE_REJECTED_LISTS,
          payload: {
            data: response.data
          }
        })
        // payload.alert.success('Shuffle Request Rejected')
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        console.log(error)
        // payload.alert.error('Something Went Wrong')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const rejectShuffleRequest = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.RejectedShuffleReq, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: REJECT_REQUEST_FOR_SHUFFLE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        console.log(error)
        // payload.alert.warning('Unable To Load')
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const clearReassignProps = () => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    dispatch({
      type: CLEARING_REASSIGN_PROPS
    })
    dispatch(actionTypes.dataLoaded())
  }
}
