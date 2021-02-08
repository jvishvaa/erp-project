import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const FEE_STRUCTURE_LIST = 'FEE_STRUCTURE_LIST'
export const LIST_CON_TYPES = 'LIST_CON_TYPES'
export const SAVE_CON_REQUEST = 'SAVE_CON_REQUEST'
export const FEE_TYPE_WISE = 'FEE_TYPE_WISE'
export const UNASSIGN_FEE_DETAILS = 'UNASSIGN_FEE_DETAILS'
export const OTHER_FEE_TYPE_LIST = 'OTHER_FEE_TYPE_LIST'
export const OTHER_FEE_INST_LIST = 'OTHER_FEE_INST_LIST'
export const SAVE_OTHER_CON_REQUEST = 'SAVE_OTHER_CON_REQUEST'
export const FETCH_CONCESSION_TYPE = 'FETCH_CONCESSION_TYPE'
export const UPDATE_INST_FINE_AMOUNT = 'UPDATE_INST_FINE_AMOUNT'
export const UPDATE_OTHR_FINE_AMT = 'UPDATE_OTHR_FINE_AMT'
export const FETCH_STUDENT_DUES = 'FETCH_STUDENT_DUES'
export const FETCH_BACK_DATE_CONCESSION = 'FETCH_BACK_DATE_CONCESSION'
export const FETCH_REFUND_VALUE = 'FETCH_REFUND_VALUE'

// action creators

export const fetchRefundValue = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FetchRefund + '?erp_code=' + payload.erp + '&academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_REFUND_VALUE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to fetch refund')
      })
  }
}

export const fetchFeeStructureList = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentPaymentAcc + '?erp_code=' + payload.erp + '&session_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_STRUCTURE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load data')
      })
  }
}

export const ListConcessionTypes = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ConcessionFeeTypes, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: LIST_CON_TYPES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const saveConcessionRequest = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.SaveConcessionReq, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          payload.alert.success('Successfully Saved')
          dispatch({
            type: SAVE_CON_REQUEST,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const fetchFeeTypeListFeeStru = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeeStructureFeeWise + '?erp_code=' + payload.erp + '&academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log('response', response)
        dispatch({
          type: FEE_TYPE_WISE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load data')
      })
  }
}

export const unassignFeeStructure = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.UnassignFeestructure, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: UNASSIGN_FEE_DETAILS,
          payload: {
            id: payload.id
          }
        })
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('Unassigned Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const fetchOtherFeeTypeList = (payload) => {
  return (dispatch) => {
    console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.OtherFeeTypeFeeStruc + '?erp_code=' + payload.erp + '&academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: OTHER_FEE_TYPE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load data')
      })
  }
}

export const fetchOtherInstTypeList = (payload) => {
  return (dispatch) => {
    console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.otherFeeInstWise + '?erp_code=' + payload.erp + '&academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: OTHER_FEE_INST_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load data')
      })
  }
}

export const saveOtherConcessionRequest = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.SaveOtherConcRequest, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          payload.alert.success('Successfully Saved')
          dispatch({
            type: SAVE_OTHER_CON_REQUEST,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const fetchListConcessionsTypes = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ConcessionListType, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_CONCESSION_TYPE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load data')
      })
  }
}

export const updateInstFineAmount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.UpdateInstFineAmt, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          // payload.alert.success('Successfully Fine Updated')
          dispatch({
            type: UPDATE_INST_FINE_AMOUNT,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const updateOthrInstFineAmount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.UpdateOthrFeeFine, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          // payload.alert.success('Successfully Fine Updated')
          dispatch({
            type: UPDATE_OTHR_FINE_AMT,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const fetchStudentDues = (payload) => {
  return (dispatch) => {
    let url = `${urls.StudentDues}?erp_code=${payload.erp}&session_year=${payload.session}`
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
      // payload.alert.warning('Unable To Load Receipt No.')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchBackDatConcession = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ConcessionBackdate + '?academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_BACK_DATE_CONCESSION,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}
