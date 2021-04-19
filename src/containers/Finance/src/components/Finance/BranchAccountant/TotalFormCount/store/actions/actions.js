import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'
// import { BRANCH_LISTING } from '../../../../store/actions'

// action types
export const FETCH_FORM_COUNT = 'FETCH_FORM_COUNT'
export const FETCH_ALL_APP_LIST = 'FETCH_ALL_APP_LIST'
export const FETCH_FORM_MODE_DETAILS = 'FETCH_FORM_MODE_DETAILS'
export const UPDATE_TRANSACTION_MODE = 'UPDATE_TRANSACTION_MODE'
export const DELETE_FORMS = 'DELETE_FORMS'
export const BRANCH_LIST = 'BRANCH_LIST'

// action creators
export const fetchFormCount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.CountAppReg + '?academic_year=' + payload.session + '&from_date=' + payload.fromDate + '&to_date=' + payload.toDate + `&branch=` + payload.branch + '&report_type=' + payload.report + '&select_dates=' + payload.dates, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          dispatch({
            type: FETCH_FORM_COUNT,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.warning('Unable to load count')
      })
  }
}

export const fetchAllAppFormList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ListAllForm + '?academic_year=' + payload.session + '&from_date=' + payload.fromDate + '&to_date=' + payload.toDate + '&select_date=' + payload.selectedDates + '&select_report=' + payload.selectedReport + '&type=' + payload.formType + '&branch=' + payload.branch + '&page_size=' + payload.pageSize + '&page=' + payload.page, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          dispatch({
            type: FETCH_ALL_APP_LIST,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.warning('Unable to load count')
      })
  }
}

export const updateTotalFormDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.updateTotalFormDetails, payload.body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      payload.alert.success('Updated!')
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
      payload.alert.warning('Unable to Edit')
    })
  }
}

export const deleteForms = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.DeleteForms, payload.body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        payload.alert.success('Deleted!')
        dispatch({
          type: DELETE_FORMS,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
      payload.alert.warning('Unable to Edit')
    })
  }
}

export const fetchFormModeDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.fetchFormModeDetails}?form_type=${payload.type}&transaction_id=${payload.transactionId}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    })
      .then(res => {
        dispatch({
          type: FETCH_FORM_MODE_DETAILS,
          payload: {
            data: res.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        console.log(err.message)
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to Get')
      })
  }
}

export const updateTransactionMode = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.PaymentModeEdit, payload.body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(res => {
      payload.alert.success('Updated!')
      dispatch({
        type: UPDATE_TRANSACTION_MODE,
        payload: {
          data: res.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err.message)
      dispatch(actionTypes.dataLoaded())
      payload.alert.warning('Unable to Edit')
    })
  }
}

export const fetchBranchList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.BranchList}?session_year=${payload.branch}&module_id=${payload.moduleId}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(res => {
      dispatch({
        type: BRANCH_LIST,
        payload: {
          data: res.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err.message)
      dispatch(actionTypes.dataLoaded())
      payload.alert.warning('Unable to Edit')
    })
  }
}
