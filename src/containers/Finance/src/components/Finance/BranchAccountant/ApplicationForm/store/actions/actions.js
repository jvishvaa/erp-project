import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const FETCH_ALL_APPLICATION_DETAILS = 'FETCH_ALL_APPLICATION_DETAILS'
export const FETCH_GRADES = 'FETCH_GRADES'
export const SAVE_ALL_FORMDATA = 'SAVE_ALL_FORMDATA'
export const SAVE_APP_PAYMENT = 'SAVE_APP_PAYMENT'
export const STD_SUGGESTIONS = 'STD_SUGGESTIONS'
export const APP_MOBILE_CHECKER = 'APP_MOBILE_CHECKER'
// action creators

export const appMobileChecker = (payload) => {
  return (dispatch) => {
    // dispatch(actionTypes.dataLoading())
    axios
      .get(urls.appMobileChecker + '?contact_number=' + payload.leadNumber, {
        headers: {
          Authorization: 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0NCwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6NjU3MTA1NzgxNiwiZW1haWwiOiJhZG1pbkBsZXRzZWR1dmF0ZS5jb20ifQ.Ud117VEJQbXeH5Tpx0IJndiQWVwGjV8CL-JrceixeEA'
        }
      }).then(response => {
        if (response.status === 200) {
          dispatch({
            type: APP_MOBILE_CHECKER,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          // payload.alert.warning(error.response.data.err_msg)
        } else {
          // payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}

export const fetchApplicationDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.GetApplicationDetails + '?enquiry_type=' + payload.key + '&academic_year=' + payload.session + '&branch_id=' + payload?.branch?.value, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log('app res: ', response)
        if (response.status === 200) {
          dispatch({
            type: FETCH_ALL_APPLICATION_DETAILS,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          // payload.alert.warning(error.response.data.err_msg)
        } else {
          // payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}

export const fetchGrade = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentGradeAcc + '?academic_year=' + payload.session + '&branch_id=' + payload.branch, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_GRADES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          // payload.alert.warning(error.response.data.err_msg)
        } else {
          // payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}

export const saveAllFormData = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.AddApplicationDetails, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log('res', response, response.data)
        // if (response.status === 200) {
          // payload.alert.success('Success')
          dispatch({
            type: SAVE_ALL_FORMDATA,
            payload: {
              data: response.data
            }
          })
        // }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          // payload.alert.warning(error.response.data.err_msg)
        } else {
          // payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}

export const saveAppPayment = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.ApplicationPayment, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        payload.alert.success('Successfully Saved')
        dispatch({
          type: SAVE_APP_PAYMENT,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          // payload.alert.warning(error.response.data.err_msg)
        } else {
          // payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}

export const fetchStdSuggestions = (payload) => {
  let url = null
  console.log(payload)
  if (payload.sType === 'enquiry_code') {
    url = urls.GetAppFormDet + '?search_by=enquiry_no' + '&academic_year=' + payload.session + '&search=' + payload.value
  } else if (payload.sType === 'father_name') {
    url = urls.GetAppFormDet + '?search_by=lead_name' + '&academic_year=' + payload.session + '&search=' + payload.value
  } else if (payload.sType === 'student_name') {
    url = urls.GetAppFormDet + '?search_by=child_name' + '&academic_year=' + payload.session + '&search=' + payload.value
  } else if (payload.sType === 'mobile_no') {
    url = urls.GetAppFormDet + '?search_by=contact_no' + '&academic_year=' + payload.session + '&search=' + payload.value
  }
  console.log(url)
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(url, {
        // headers: {
        //   Authorization: 'Bearer ' + payload.user
        // }
      }).then(response => {
        if (response.status === 200) {
          dispatch({
            type: STD_SUGGESTIONS,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        console.log(error)
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          // payload.alert.warning(error.response.data.err_msg)
        } else {
          // payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}
