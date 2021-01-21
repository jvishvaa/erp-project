import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

export const FEE_COLLECTION_LIST = 'FEE_COLLECTION_LIST'
export const PAY_NON_ORCHIDS = 'PAY_NON_ORCHIDS'
export const SAVE_OUTSIDERS = 'SAVE_OUTSIDERS'
export const SEND_ALL_PAYMENTS = 'SEND_ALL_PAYMENTS'

export const fetchFeeCollectionList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.feeCollection + '?session_year=' + payload.session, {
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
      if (response.status === 201) {
        payload.alert.success('Payment Successful')
        console.log(response)
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
        console.log(response)
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
//         console.log(response)
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
//       console.log(err)
//     })
//   }
// }
