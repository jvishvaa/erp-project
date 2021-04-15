import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

export const FEE_COLLECTION_LIST = 'FEE_COLLECTION_LIST'
export const PAY_NON_ORCHIDS = 'PAY_NON_ORCHIDS'
export const SAVE_OUTSIDERS = 'SAVE_OUTSIDERS'
export const SEND_ALL_PAYMENTS = 'SEND_ALL_PAYMENTS'
export const STUDENT_DETAILS = 'STUDENT_DETAILS'
export const ORCHIDS_STUDNET_PAY = 'ORCHIDS_STUDNET_PAY'
export const MISC_REPORT = 'MISC_REPORT'
export const CANCEL_TRANS = 'CANCEL_TRANS'
export const SCHOOL_DETAILS = 'SCHOOL_DETAILS'

export const fetchFeeCollectionList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.feeCollection + '?session_year=' + payload.session + '&branch_id=' + payload.branch, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FEE_COLLECTION_LIST,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
    })
  }
}

export const paymentAction = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.PayNonOrchids, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        payload.alert.success('Payment Successful')
        dispatch({
          type: PAY_NON_ORCHIDS,
          payload: {
            data: response.data,
            status: true
          }
        })
      }

      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
    })
  }
}

export const saveOutsiders = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.SaveOutsiders, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 201) {
        dispatch({
          type: SAVE_OUTSIDERS,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      payload.alert.error('Student Info Failed')
      dispatch(actionTypes.dataLoaded())
      console.log(error)
    })
  }
}

// export const sendAllPayments = (payload) => {
//   return (dispatch) => {
//     dispatch(actionTypes.dataLoading())
//     axios.post(urls.CreateMakePaymentAcc, payload.data, {
//       headers: {
//         Authorization: 'Bearer ' + payload.user
//       }

//     }).then(response => {
//       if (response.status === 201) {
//         dispatch({
//           type: SEND_ALL_PAYMENTS,
//           payload: {
//             data: response.data,
//             status: true
//           }
//         })
//       }
//       dispatch(actionTypes.dataLoaded())
//       payload.alert.success('Payment Successful')
//     }).catch(err => {
//       payload.alert.error('Payment Failed')
//       dispatch(actionTypes.dataLoaded())
//     })
//   }
// }
export const fetchStudentErpDet = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.StudentsInfo}?erp_code=${payload.erp}&academic_year=${payload.session}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        dispatch({
          type: STUDENT_DETAILS,
          payload: {
            data: response.data
          }
        })
        payload.alert.success('Success!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      payload.alert.error('Student Info Failed')
      dispatch(actionTypes.dataLoaded())
      console.log(error)
    })
  }
}

export const orchidsStudentPay = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.OrchidsStudentPay, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 201 || response.status === 200) {
        payload.alert.success('Payment Successful')
        dispatch({
          type: ORCHIDS_STUDNET_PAY,
          payload: {
            data: response.data,
            status: true
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const miscReport = (payload) => {
  return (dispatch) => {
    let url = null
    if (payload.reportName === 'MiscFeeReport.xlsx' && payload.data.date_range === 2) {
      url = payload.url + '?academic_year=' + payload.data.session_year + '&branch=' + payload.data.branch + '&fee_account=' + payload.data.fee_account +
    '&payment_mode=' + payload.data.payment_mode +
    '&date_range=' + payload.data.date_range + '&date=' + payload.data.date
    } else if (payload.reportName === 'MiscFeeReport.xlsx' && payload.data.date_range === 1) {
      url = payload.url + '?academic_year=' + payload.data.session_year + '&branch=' + payload.data.branch + '&fee_account=' + payload.data.fee_account +
    '&payment_mode=' + payload.data.payment_mode +
    '&date_range=' + payload.data.date_range + '&from_date=' + payload.data.from_date + '&to_date=' + payload.data.to_date
    }
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (+response.status === 200 && response.data && response.data.length > 0) {
        dispatch({
          type: MISC_REPORT,
          payload: {
            data: response.data
          }
        })
        payload.alert.success('Success!')
      } else {
        dispatch({
          type: MISC_REPORT,
          payload: {
            data: []
          }
        })
        payload.alert.success('No Record Found!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      payload.alert.error('Student Info Failed')
      dispatch(actionTypes.dataLoaded())
      console.log(error)
    })
  }
}

export const cancelTransaction = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(`${urls.CancelTrans}?transaction_id=${payload.transId}&remark=${payload.remark}`, payload.body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      // if (response.status === 200) {
      if (response.data === 'success') {
        dispatch({
          type: CANCEL_TRANS,
          payload: {
            data: payload.transId
          }
        })
        payload.alert.success('Cancelled Successfully!')
      }
      //   payload.alert.success('Success!')
      // }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      payload.alert.error('Something Went Wrong!')
      dispatch(actionTypes.dataLoaded())
      console.log(error)
    })
  }
}

export const schoolDeatails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.SchoolDeatails}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        dispatch({
          type: SCHOOL_DETAILS,
          payload: {
            data: response.data
          }
        })
        payload.alert.success('Success!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      payload.alert.error('Student Info Failed')
      dispatch(actionTypes.dataLoaded())
      console.log(error)
    })
  }
}