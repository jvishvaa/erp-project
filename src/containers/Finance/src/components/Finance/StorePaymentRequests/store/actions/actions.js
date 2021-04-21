import axios from 'axios'

import * as actionTypes from '../../../store/actions/actions'
import { urls } from '../../../../../urls'

// Action Constants
export const FETCH_STORE_PAY_REQS = 'FETCH_STORE_PAY_REQS'
export const FETCH_STORE_BRANCH_TRANSACTION = 'FETCH_STORE_BRANCH_TRANSACTION'
// export const FETCH_EDIT_DETAILS = 'FETCH_EDIT_DETAILS'
export const UPDATE_STORE_EDIT_DETAILS = 'UPDATE_STORE_EDIT_DETAILS'
// export const CLEARING_ALL = 'CLEARING_ALL'

// Action Creators
export const fetchStorePayRequests = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.StorePaymentReqList + '?academic_year=' + payload.session.value, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_STORE_PAY_REQS,
        payload: {
          data: response.data,
          session: payload.session
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Fetch')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchStoreBranchTransaction = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.GetStoreBranchTransaction + '?academic_year=' + payload.session + '&branch_id=' + payload.branchId + '&changed_status=' + payload.status, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_STORE_BRANCH_TRANSACTION,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Fetch branch data')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const updateStoreEditDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.StoreAcceptPaymentRequest, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        payload.alert.success('Successfully Updated!')
        dispatch({
          type: UPDATE_STORE_EDIT_DETAILS,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Update')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

// export const clearingAll = () => {
//   return (dispatch) => {
//     dispatch(actionTypes.dataLoading())
//     dispatch({
//       type: CLEARING_ALL
//     })
//     dispatch(actionTypes.dataLoaded())
//   }
// }
