import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const POST_ADMISSION = 'POST_ADMISSION'
export const GET_STUDENT_DETAILS_BY_REG_NO = 'GET_STUDENT_DETAILS_BY_REG_NO'
export const GET_STUDENT_DETAILS_BY_APP_NO = 'GET_STUDENT_DETAILS_BY_APP_NO'
export const SEARCH_STUDENT_DETAILS_BY_REG_NO = 'SEARCH_STUDENT_DETAILS_BY_REG_NO'
export const SEARCH_STUDENT_DETAILS_BY_APP_NO = 'SEARCH_STUDENT_DETAILS_BY_APP_NO'
export const GET_ADMISSSION_RECORDS = 'GET_ADMISSSION_RECORDS'
export const FETCH_ADMISSION_RECORD_BY_ERP = 'FETCH_ADMISSION_RECORD_BY_ERP'
export const FETCH_STUDENT_ADMISSION_CERTIFICATES = 'FETCH_STUDENT_ADMISSION_CERTIFICATES'
export const POST_ADMISSION_CERTIFICATE = 'POST_ADMISSION_CERTIFICATE'
export const PUT_ADMISSION = 'PUT_ADMISSION'
export const SEARCH_ADMISSION_OTHERS = 'SEARCH_ADMISSION_OTHERS'
export const GET_FEE_DETAILS = 'GET_FEE_DETAILS'
export const GET_FEE_INSTALLMENT = 'GET_FEE_INSTALLMENT'

export const postAdmission = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.StudentAdmissionRTE, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 201) {
        dispatch({
          type: POST_ADMISSION,
          payload: {
            data: response.data
          }
        })
        payload.alert.success('Admission Completed Successfully with Admission # ' + response.data.admission_number + ' And ERP# ' + response.data.erp)
        dispatch(actionTypes.dataLoaded())
      }
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
      if (error.response && error.response.status === 400) {
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const getStudentdetailsbyregNumber = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.GetStudentDetailsbyregNumber + '?registration_number=' + payload.regno + '&academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: GET_STUDENT_DETAILS_BY_REG_NO,
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
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const getAdmissionRecords = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.AdmissionRecords + '?academic_year=' + payload.session + '&from_date=' + payload.fromDate + '&to_date=' + payload.toDate, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: GET_ADMISSSION_RECORDS,
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
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const getStudentdetailsbyappNumber = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.GetStudentDetailsbyappNumber + '?application_number=' + payload.appno + '&academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: GET_STUDENT_DETAILS_BY_APP_NO,
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
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const fetchFeePlan = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListFeePlanGrade + '?grade_id=' + payload.gradeValue + '&academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: GET_FEE_DETAILS,
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
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const fetchInstallment = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.Installmentsdetails + '?fee_plan_id=' + payload.feePlanId, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: GET_FEE_INSTALLMENT,
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
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const searchStudentdetailsbyregNumber = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.SearchStudentDetailbyregNumber + '?registration_number=' + payload.regno + '&academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: SEARCH_STUDENT_DETAILS_BY_REG_NO,
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
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const searchStudentdetailsbyappNumber = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.SearchStdDetbyAppNo + '?application_number=' + payload.appNo + '&academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: SEARCH_STUDENT_DETAILS_BY_APP_NO,
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
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const fetchAdmissionRecordByErp = (payload) => {
  return (dispatch) => {
    // dispatch(actionTypes.dataLoading())
    axios.get(urls.FetchAdmissionRecordByErp + '?erp=' + payload.erp, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: FETCH_ADMISSION_RECORD_BY_ERP,
          payload: {
            data: response.data
          }
        })
      }
      // dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      // dispatch(actionTypes.dataLoaded())
      console.log(error)
      if (error.response && error.response.status === 400) {
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const fetchStudentAdmissionCertificates = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.StudentAdmissionCertificate, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: FETCH_STUDENT_ADMISSION_CERTIFICATES,
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
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const postStudentAdmissionCertificate = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.StudentAdmissionCertificate, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('successfully Added')
        dispatch({
          type: POST_ADMISSION_CERTIFICATE,
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
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const putStudentAdmission = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.StudentAdmissionRTE, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        // payload.alert.success('successfully Changed')
        dispatch({
          type: PUT_ADMISSION,
          payload: {
            data: response.data
          }
        })
        payload.alert.success('Admission Completed Successfully with Admission# ' + response.data.admission_number + ' And ERP# ' + response.data.erp)
        dispatch(actionTypes.dataLoaded())
      }
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
      if (error.response && error.response.status === 400) {
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
export const searchAdmissionByOthers = (payload) => {
  let url = null
  if (payload.searchBy === 'Father Name') {
    url = urls.SearchStdDetbyAppNo + '?FatherName=' + payload.key + '&academic_year=' + payload.session
  } else if (payload.searchBy === 'Mother Name') {
    url = urls.SearchStdDetbyAppNo + '?MotherName=' + payload.key + '&academic_year=' + payload.session
  } else if (payload.searchBy === 'Mother Number') {
    url = urls.SearchStdDetbyAppNo + '?MotherNumber=' + payload.key + '&academic_year=' + payload.session
  } else if (payload.searchBy === 'Father Number') {
    url = urls.SearchStdDetbyAppNo + '?FatherNumber=' + payload.key + '&academic_year=' + payload.session
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        dispatch({
          type: SEARCH_ADMISSION_OTHERS,
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
        // payload.alert.warning(error.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
    })
  }
}
