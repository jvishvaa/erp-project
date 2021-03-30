import axios from 'axios'

import * as actionTypes from '../../../store/actions/actions'
import { urls } from '../../../../../urls'

// Action Constants
export const FETCH_ALL_PAYMENT = 'FETCH_ALL_PAYMENT'
export const SEND_ALL_PAYMENT = 'SEND_ALL_PAYMENT'
export const CLEAR_ALL_PROPS = 'CLEAR_ALL_PROPS'
export const FETCH_RECEIPT_RANGE = 'FETCH_RECEIPT_RANGE'
export const FETCH_STUDENT_SUGGESTIONS = 'FETCH_STUDENT_SUGGESTIONS'
export const FETCH_STUDENT_DETAILS = 'FETCH_STUDENT_DETAILS'
export const FETCH_STUDENT_DUES = ' FETCH_STUDENT_DUES'
export const FETCH_NORMAL_WALLET = 'FETCH_NORMAL_WALLET'
export const SEND_AXIS_POS_PAYMENT = 'SEND_AXIS_POS_PAYMENT'
export const PAYMENT_CARD_DETAILS = 'PAYMENT_CARD_DETAILS'

// Action Creators
export const fetchAllPayment = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.all([
      axios.get(urls.StudentPayAtAcc + '?student=' + payload.erp + '&academic_year=' + payload.session + '&module_id=' + payload.moduleId + '&branch_id=' + payload.branchId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }),
      axios.get(urls.StudentInfo + '?erp_code=' + payload.erp + '&academic_year=' + payload.session + '&module_id=' + payload.moduleId + '&branch_id=' + payload.branchId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      })
    ])
      .then(axios.spread((feeType, stdRes) => {
        dispatch({
          type: FETCH_ALL_PAYMENT,
          payload: {
            data: feeType.data,
            erp: payload.erp
          }
        })
        dispatch({
          type: FETCH_STUDENT_DETAILS,
          payload: {
            data: stdRes.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      })).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.warning('Unable to load data')
      })

    // axios.get(urls.StudentPayAtAcc + '?student=' + payload.erp + '&academic_year=' + payload.session, {
    //   headers: {
    //     Authorization: 'Bearer ' + payload.user
    //   }

    // }).then(response => {
    //   dispatch({
    //     type: FETCH_ALL_PAYMENT,
    //     payload: {
    //       data: response.data,
    //       erp: payload.erp
    //     }
    //   })
    //   dispatch(actionTypes.dataLoaded())
    // }).catch(err => {
    //   payload.alert.warning('Unable To Load')
    //   dispatch(actionTypes.dataLoaded())
    //   console.log(err)
    // })
  }
}

export const sendAllPayment = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.CreateMakePaymentAcc, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }

    }).then(response => {
      if (response.status === 201) {
        dispatch({
          type: SEND_ALL_PAYMENT,
          payload: {
            data: response.data,
            status: true
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
      payload.alert.success('Payment Successful')
    }).catch(err => {
      payload.alert.error('Payment Failed')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchReceiptRange = (payload) => {
  return (dispatch) => {
    let url = urls.ReceiprRangeMsg + '?academic_year=' + payload.session + '&branch_id=' + payload.branch 
    // if (payload.branch) {
    //   url = url + `&branch=${payload.branch}`
    // }
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_RECEIPT_RANGE,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Unable To Load Receipt No.')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const clearAllProps = () => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    dispatch({
      type: CLEAR_ALL_PROPS
    })
    dispatch(actionTypes.dataLoaded())
  }
}

export const fetchErpSuggestions = (payload) => {
  let url = ''
  if (payload.type === 'erp') {
    url = urls.SuggestionsForErp + '?erp=' + payload.erp +
    '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
    '&state=' + payload.status
  } else if (payload.type === 'student') {
    url = urls.SuggestionsForErp + '?student_name=' + payload.erp +
    '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
    '&state=' + payload.status
  } else if (payload.type === 'fatherName') {
    url = urls.SuggestionsForErp + '?father_name=' + payload.erp +
    '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
    '&state=' + payload.status
  } else if (payload.type === 'fatherNo') {
    url = urls.SuggestionsForErp + '?father_contact_no=' + payload.erp +
    '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
    '&state=' + payload.status
  } else if (payload.type === 'motherName') {
    url = urls.SuggestionsForErp + '?mother_name=' + payload.erp +
    '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
    '&state=' + payload.status
  } else if (payload.type === 'motherNo') {
    url = urls.SuggestionsForErp + '?mother_contact_no=' + payload.erp +
    '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
    '&state=' + payload.status
  }
  return (dispatch) => {
    // dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }

    }).then(response => {
      dispatch({
        type: FETCH_STUDENT_SUGGESTIONS,
        payload: {
          data: response.data
        }
      })
      // dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Load')
      // dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchStudentDues = (payload) => {
  return (dispatch) => {
    let url = `${urls.StudentDues}?erp_code=${payload.erp}&session_year=${payload.session}&module_id=${payload.moduleId}&branch_id=${payload.branchId}`
    if (payload.branch) {
      url = url + `&branch=${payload.branch}`
    }
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_STUDENT_DUES,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Load Receipt No.')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchNormalWallet = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.WalletInfo + '?academic_year=' + payload.session + '&student=' + payload.erp, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_NORMAL_WALLET,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        if (err.response && err.response.data && err.response.data.err_msg && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(err)
      })
  }
}

export const sendAxisPosPayment = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.AxisPos, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }

    }).then(response => {
      if (response.status === 201) {
        dispatch({
          type: SEND_AXIS_POS_PAYMENT,
          payload: {
            data: response.data,
            status: true
          }
        })
      }
      if ((response.data && response.data.data && +response.data.status_code === 201) && (response.data && response.data.data && +response.data.data.ResponseCode !== 0)) {
        payload.alert.warning(response.data.data.ResponseMessage)
      }
      dispatch(actionTypes.dataLoaded())
      if (response.status === 201 && (response.data && response.data.data && +response.data.data.ResponseCode === 0)) {
        payload.alert.success('Success')
      }
    }).catch(err => {
      if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 404)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const cardDetailsPayment = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.CardDetails, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }

    }).then(response => {
      dispatch({
        type: PAYMENT_CARD_DETAILS,
        payload: {
          data: response.data,
          status: true
        }
      })
      console.log('data2', response.data)
      console.log('data3', response)
      dispatch(actionTypes.dataLoaded())
      payload.alert.success('Success')
    }).catch(err => {
      if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 404)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}
