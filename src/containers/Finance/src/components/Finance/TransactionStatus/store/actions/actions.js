import axios from 'axios'

import * as actionTypes from '../../../store/actions/actions'
import { urls } from '../../../../../urls'

// Action Constants
export const FETCH_ALL_TRANSACTION = 'FETCH_ALL_TRANSACTION'
export const UPDATE_TRANSACTION_STATUS = 'UPDATE_TRANSACTION_STATUS'
export const SORT_ASCENDING = 'SORT_ASCENDING'
export const SORT_DESCENDING = 'SORT_DESCENDING'
export const FETCH_MULTI_FEETYPE_TRAN = 'FETCH_MULTI_FEETYPE_TRAN'
export const CLEAR_FEE_DAY_REPORTS_PROPS = 'CLEAR_FEE_DAY_REPORTS_PROPS'

// action-creators
export const fetchAllTransaction = (payload) => {
  const {
    session,
    branchId,
    mode,
    fees,
    feePlanIds,
    fromDate,
    toDate,
    page,
    user,
    alert,
    isAccountant
  } = payload
  const body = [{
    academic_year: session,
    mode: mode,
    payment_type: fees,
    from_date: fromDate,
    to_date: toDate
  }]
  console.log('Is Accountant', isAccountant)
  let url = `${urls.TransactionStatusList}?academic_year=${session}&mode=${mode}&payment_type=${fees}&fee_plan=${feePlanIds}&from_date=${fromDate}&to_date=${toDate}`
  // if (!isAccountant) {
    // body[0].branch_id = branchId
    url = url + `&branch_id=${branchId}`
  // }
  if (page !== 0) {
    body[0].page = page + 1
    // url = `${urls.TransactionStatusList}?academic_year=${session}&branch_id=${branchId}&mode=${mode}&from_date=${fromDate}&to_date=${toDate}&page=${page + 1}`
    url = url + `&page=${page + 1}`
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + user
      }

    }).then(response => {
      console.log('**')
      dispatch({
        type: FETCH_ALL_TRANSACTION,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      alert.warning('Unable To Load')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const updateTransactionStatus = (payload) => {
  const {
    currentPaid,
    currentCollected,
    currentBankClearance,
    currentCancelled,
    user,
    alert,
    id
    // session
  } = payload
  const body = {
    'is_paid': currentPaid,
    'is_collected': currentCollected,
    'is_cancelled': currentCancelled,
    'is_bank_clearance_done': currentBankClearance
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.UpdateTransactionList + id + '/updatetransactionrecord/', body, {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }).then(response => {
      dispatch({
        type: UPDATE_TRANSACTION_STATUS,
        payload: {
          data: response.data,
          id: id
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      alert.warning('Updation Failed')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const fetchMultiFeeTypeTransaction = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    let url = `${urls.FeePlansForTransaction}?session_year=${payload.session}`
    if (payload.branchId) {
      url = `${url}&branch_id=${payload.branchId}`
    }
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log('Tran Response', response)
      dispatch({
        type: FETCH_MULTI_FEETYPE_TRAN,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Updation Failed')
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const sortAsc = () => {
  // dispatch({
  //   type: SORT_ASCENDING
  // })
}

export const sortDesc = () => {
  // dispatch({
  //   type: SORT_DESCENDING
  // })
}

export const clearFeeDayProps = () => {
  return (dispatch) => {
    // dispatch(actionTypes.dataLoading())
    dispatch({
      type: CLEAR_FEE_DAY_REPORTS_PROPS
    })
    // dispatch(actionTypes.dataLoaded())
  }
}
