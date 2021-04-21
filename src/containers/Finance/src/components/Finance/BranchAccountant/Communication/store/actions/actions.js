import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const SEND_NORMAL_SMS = 'SEND_NORMAL_SMS'
export const SEND_BULK_SMS = 'SEND_BULK_SMS'
export const FETCH_STU_LIST = 'FETCH_STU_LIST'
export const SEND_CLASSWISE_SMS = 'SEND_CLASSWISE_SMS'
export const FETCH_FEE_DEFAULTER = Symbol('FETCH_FEE_DEFAULTER')
export const SEND_DEFAULTER_SMS = Symbol('SEND_DEFAULTER_SMS')
export const CLEAR_DEFAULTERS_LIST = Symbol('CLEAR_DEFAULTERS_LIST')

// action creators
export const sendNormalSms = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.NormalSms, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          payload.alert.success('Message Sent!')
          dispatch({
            type: SEND_NORMAL_SMS,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to send sms')
      })
  }
}
export const sendBulkSms = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.BulkSms, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          payload.alert.success('Message Sent!')
          dispatch({
            type: SEND_BULK_SMS,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to send sms')
      })
  }
}

export const fetchAllStuList = (payload) => {
  let url = null
  if (payload.branch) {
    url = urls.ClassWiseStudent + '?session_year=' + payload.session + '&grade=' + payload.grade +
    '&branch=' + payload.branch + '&section=' + payload.section + '&page_size=' + payload.pageSize + '&page=' + payload.page
  } else {
    url = urls.ClassWiseStudent + '?session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section + '&page_size=' + payload.pageSize + '&page=' + payload.page
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
            type: FETCH_STU_LIST,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to send sms')
      })
  }
}

export const sendClassWiseSms = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.ClassWiseSms, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          payload.alert.success('Message Sent!')
          dispatch({
            type: SEND_CLASSWISE_SMS,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to send sms')
      })
  }
}

export const fetchFeeDefaulters = (payload) => {
  return (dispatch) => {
    let url = `${urls.FeeDefaultersList}?grade=${payload.grade}` +
    `&page=${payload.page}&page_size=${payload.pageSize}&installments=${payload.installments}&session_year=${payload.session}`
    if (payload.branch) {
      url += `&branch=${payload.branch}`
    }
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(res => {
      dispatch({
        type: FETCH_FEE_DEFAULTER,
        payload: {
          data: res.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.warning('Unable To Fetch Students')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const sendDefaulterSms = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.DefaultersListSms, payload.body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(res => {
      payload.alert.success('SMS Sent Successfully')
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      dispatch(actionTypes.dataLoaded())
      console.error(err)
      payload.alert.warning('Operation Failed')
    })
  }
}
