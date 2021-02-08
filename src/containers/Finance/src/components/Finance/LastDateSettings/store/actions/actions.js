import axios from 'axios'

import * as actionTypes from '../../../store/actions/actions'
import { urls } from '../../../../../urls'

// Action Constants
export const FETCH_CONCESSION_LASTDATE = 'FETCH_CONCESSION_LASTDATE'
export const SAVE_CONCESSION_LASTDATE = 'SAVE_CONCESSION_LASTDATE'
export const FETCH_BACK_DATE = 'FETCH_BACK_DATE'
export const SAVE_BACK_DATE = 'SAVE_BACK_DATE'
export const PARTIAL_PAYMENT_LIST = 'PARTIAL_PAYMENT_LIST'
export const SAVE_PARTIAL_PAYMENT_LASTDATE = 'SAVE_PARTIAL_PAYMENT_LASTDATE'

// Action Creators
export const fetchConcessionLastDate = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ConcessionLastDateList + '?academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_CONCESSION_LASTDATE,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Unable To Load')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const saveConcessionLastDate = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    var link = urls.Finance + payload.id + '/updateconcessionlastdate/'
    axios.put(link, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        // payload.alert.success('Updated successfully!')
        dispatch({
          type: SAVE_CONCESSION_LASTDATE,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Unable To Load')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchBackDate = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListBackDate + '?academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_BACK_DATE,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Unable To Load')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const saveBackDate = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    var link = urls.Finance + payload.id + '/updatebackdate/'
    axios.put(link, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        // payload.alert.success('Updated successfully!')
        dispatch({
          type: SAVE_BACK_DATE,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Something Went Wrong!')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}
export const partialPaymentList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.PartialPaymentList + '?academic_year=' + payload.session + '&branch=' + payload.branch + '&grades=' + payload.grade, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        if (response && response.data.length <= 0) {
          // payload.alert.warning('Please Create Back Date to View BackDate!')
        }
      }
      dispatch({
        type: PARTIAL_PAYMENT_LIST,
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

export const savePartialPaymentLastDate = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.SetPartialPaymentBackDate, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        // payload.alert.success('Updated successfully!')
        dispatch({
          type: SAVE_PARTIAL_PAYMENT_LASTDATE,
          payload: {
            data: response.data
          }
        })
      } else if (response.status === 201) {
        // payload.alert.success('Created successfully!')
        dispatch({
          type: SAVE_PARTIAL_PAYMENT_LASTDATE,
          payload: {
            data: response.data
          }
        })
      }
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
