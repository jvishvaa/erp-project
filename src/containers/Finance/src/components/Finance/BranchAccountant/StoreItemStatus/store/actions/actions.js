import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const FETCH_ORDER_STATUS = 'FETCH_ORDER_STATUS'
export const SEND_EXCHANGE_DETAILS = 'SEND_EXCHANGE_DETAILS'
export const FETCH_DISPATCH_DETAILS = 'FETCH_DISPATCH_DETAILS'

// action creators
export const fetchOrderStatus = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FetchOrderStatus + '?academic_year=' + payload.session + '&erp=' + payload.erp + '&page_size=' + payload.pageSize + '&page=' + payload.page, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          dispatch({
            type: FETCH_ORDER_STATUS,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.error('Unable to load status')
      })
  }
}

export const sendExchangeDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.OrderReturn, payload.body, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          payload.alert.success('Initiated Exchange')
          dispatch({
            type: SEND_EXCHANGE_DETAILS,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.error('Unable to initiate exchange contact store admin!')
      })
  }
}

export const fetchDispatchDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.OrderDispatchDetails + '?transaction_id=' + payload.transId + '&sku_code=' + payload.skuCode + '&student_id=' + payload.studentId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          dispatch({
            type: FETCH_DISPATCH_DETAILS,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.error('Unable to load dispatch details')
      })
  }
}
