import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

export const FETCH_STUDENT_INFO = 'FETCH_STUDENT_INFO'
export const FETCH_REG_LIST = 'FETCH_REG_LIST'
export const SAVE_ALL_PAYMENT = 'SAVE_ALL_PAYMENT'
export const CREATE_REG_NUM = 'CREATE_REG_NUM'
export const APP_SUGG = 'APP_SUGG'
export const CLEAR_NEW_REG_FORM_PROPS = 'CLEAR_NEW_REG_FORM_PROPS'
// export const FETCH_REG_NUM = 'FETCH_REG_NUM'

export const getStudentInfo = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.GetStudentInfoRegistration + '?application_number=' + payload.data + '&academic_year=' + payload.session + '&branch_id=' + payload.branchId + '&module_id=' + payload.moduleId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          dispatch({
            type: FETCH_STUDENT_INFO,
            payload: {
              data: response.data
            }
          })
          let data = {
            acad_session_id: response.data.academic_year.id,
            student: response.data.id,
            session_year: payload.session,
            branch_id: payload.branchId
          }
          axios
            .post(urls.AddRegForm, data, {
              headers: {
                Authorization: 'Bearer ' + payload.user
              }
            }).then(res => {
              payload.alert.success('Success')
              dispatch({
                type: CREATE_REG_NUM,
                payload: {
                  data: res.data
                }
              })
              dispatch(actionTypes.dataLoaded())
            }).catch(error => {
              dispatch(actionTypes.dataLoaded())
              if (error.response && error.response.status === 400) {
                payload.alert.warning(error.response.data.err_msg)
              } else {
                payload.alert.warning('Something Went Wrong!')
              }
            })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const fetchRegistrationList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.GetRegistrationList + '?year=' + payload.session.value + '&from_date=' + payload.fromDate + '&to_date=' + payload.toDate + '&branch_id=' + payload.branchId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          dispatch({
            type: FETCH_REG_LIST,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}

export const fetchRegistrationSugg = (payload) => {
  let url = null
  if (payload.type === 'Application No') {
    url = urls.SearchAppNumber + '?application_no=' + payload.value + '&academic_year=' + payload.session + '&branch_id=' + payload.branchId + '&module_id=' + payload.moduleId
  } else if (payload.type === 'Student Name') {
    url = urls.SearchAppNumber + '?student_name=' + payload.value + '&academic_year=' + payload.session + '&branch_id=' + payload.branchId + '&module_id=' + payload.moduleId
  } else {
    url = urls.SearchAppNumber + '?Phone_no=' + payload.value + '&academic_year=' + payload.session + '&branch_id=' + payload.branchId + '&module_id=' + payload.moduleId
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          dispatch({
            type: APP_SUGG,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        console.log(error)
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}

export const sendAllPaymentReg = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.RegistrationPayment, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        payload.alert.success('Success')
        dispatch({
          type: SAVE_ALL_PAYMENT,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}

export const createRegNum = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.AddRegForm, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        payload.alert.success('Success')
        dispatch({
          type: CREATE_REG_NUM,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        payload.alert.warning('Unable create app num')
      })
  }
}

export const clearNewRegFormProps = () => {
  return (dispatch) => {
    // dispatch(actionTypes.dataLoading())
    dispatch({
      type: CLEAR_NEW_REG_FORM_PROPS
    })
    // dispatch(actionTypes.dataLoaded())
  }
}
