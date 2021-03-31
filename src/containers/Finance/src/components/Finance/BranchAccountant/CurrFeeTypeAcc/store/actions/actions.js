import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const FETCH_MISC_FEE_LIST = 'FETCH_MISC_FEE_LIST'
export const FETCH_STUDENT_MISC_DETAILS = 'FETCH_STUDENT_MISC_DETAILS'
export const FETCH_MISC_DETAILS = 'FETCH_MISC_DETAILS'
export const SAVE_STUDENT_MISC = 'SAVE_STUDENT_MISC'

// action creators
export const fetchMiscFeeList = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.MiscList + '?academic_year=' + payload.session + '&module_id=' + payload.moduleId + '&branch_id=' + payload.branchId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_MISC_FEE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        console.log(err)
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          // payload.alert.warning(err.response.data.err_msg)
        } else {
          // payload.alert.warning('Something went Wrong!')
        }
      })
  }
}

export const fetchStudentMiscDetails = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentMiscDetails + '?academic_year=' + payload.session + '&erp=' + payload.erp + '&module_id=' + payload.moduleId + '&branch_id=' + payload.branchId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_STUDENT_MISC_DETAILS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        console.log(err)
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          // payload.alert.warning(err.response.data.err_msg)
        } else {
          // payload.alert.warning('Something went Wrong!')
        }
      })
  }
}

export const fetchMiscDetails = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FetchMiscTypeDetails + '?academic_year=' + payload.session + '&id=' + payload.miscId + '&branch_id=' + payload.branch, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_MISC_DETAILS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        console.log(err)
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          payload.alert.warning('Something went Wrong!')
        }
      })
  }
}

export const saveStudentMiscType = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.SaveStudentMiscType, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          payload.alert.success('Saved Successfully!')
          dispatch({
            type: SAVE_STUDENT_MISC,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        console.log(err)
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          payload.alert.warning('Something went Wrong!')
        }
      })
  }
}
