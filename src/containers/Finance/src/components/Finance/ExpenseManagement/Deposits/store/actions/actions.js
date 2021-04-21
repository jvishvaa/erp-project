import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action-types
export const FETCH_ALL_ACCOUNTS = 'FETCH_ALL_ACCOUNTS'
export const SAVE_PETTY_CASH_DIPOSIT = 'SAVE_PETTY_CASH_DIPOSIT'
export const FETCH_DEPOSIT_TRANSACTION = 'FETCH_DEPOSIT_TRANSACTION'
export const FETCH_OTHER_ACCOUNTS = 'FETCH_OTHER_ACCOUNTS'
export const UPDATE_DEPOSIT_ENTRY = 'UPDATE_DEPOSIT_ENTRY'

// action creators

export const fetchAllAccounts = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.BankListPettyCash}?session_year=${payload.session}&&branch=${payload.branchId}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_ALL_ACCOUNTS,
        payload: {
          data: response.data[0].bank_fee_mapping
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const savePettyCashDiposit = (payload) => {
  const body = {
    session_year: payload.session,
    'branch': payload.branchId,
    'expense_account': payload.expenseAcc,
    'deposit_mode': payload.mode,
    'income_account': payload.collectionAcc,
    petty_cash_account: payload.pettyCashAcc,
    amount: payload.amount,
    date: payload.date,
    remarks: payload.remark,
    cheque: payload.mode === 'Cheque' ? ({
      cheque_number: payload.chequeNo
    }) : null,
    online: payload.mode === 'Online Transfer' ? ({
      approved_by: payload.approvedBy,
      sendEmail: payload.email,
      sendSms: payload.sms
    }) : null
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.SavePettyCashDiposit, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch(actionTypes.dataLoaded())
      if (response.status === 201) {
        payload.alert.success('Saved Successfully')
      } else {
        payload.alert.warning('Unable To Save')
      }
    }).catch(err => {
      dispatch(actionTypes.dataLoaded())
      console.log(err)
      payload.alert.warning('Unable To Save')
    })
  }
}

export const fetchDepositTransaction = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListPettyCashDeposit + '?session_year=' + payload.session + '&branch=' + payload.branch + '&from_date=' + payload.fromDate + '&to_date=' + payload.toDate + '&deposit_type=' + payload.depositType, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_DEPOSIT_TRANSACTION,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const saveExpenseDeposit = (payload) => {
  const body = {
    'session_year': payload.session,
    'branch': payload.branchId,
    'transfer_to': payload.expenseAcc,
    'deposit_mode': payload.mode,
    'transfer_from': payload.collectionAcc,
    amount: payload.amount,
    date: payload.date,
    remarks: payload.remark,
    cheque: payload.mode === 'Cheque' ? ({
      cheque_number: payload.chequeNo
    }) : null,
    online: payload.mode === 'Online Transfer' ? ({
      approved_by: payload.approvedBy,
      sendEmail: payload.email,
      sendSms: payload.sms
    }) : null
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.SaveExpenseDeposit, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch(actionTypes.dataLoaded())
      if (response.status === 201) {
        payload.alert.success('Saved Successfully')
      } else {
        payload.alert.warning('Unable To Save')
      }
    }).catch(err => {
      dispatch(actionTypes.dataLoaded())
      console.log(err)
      payload.alert.warning('Unable To Save')
    })
  }
}

export const fetchOtherAccounts = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.BankListPettyCash}?session_year=${payload.session}&&branch=${payload.branchId}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_OTHER_ACCOUNTS,
        payload: {
          data: response.data[0].bank_fee_mapping
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const saveCollectionDeposit = (payload) => {
  const body = {
    'session_year': payload.session,
    'to_branch': payload.toBranchId,
    'from_branch': payload.fromBranchId,
    'from_account': payload.otherCollectionAcc,
    'to_account': payload.collectionAcc,
    'deposit_mode': payload.mode,
    amount: payload.amount,
    date: payload.date,
    remarks: payload.remark,
    cheque: payload.mode === 'Cheque' ? ({
      cheque_number: payload.chequeNo
    }) : null,
    online: payload.mode === 'Online Transfer' ? ({
      approved_by: payload.approvedBy,
      sendEmail: payload.email,
      sendSms: payload.sms
    }) : null
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.saveCollectionDeposit, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch(actionTypes.dataLoaded())
      if (response.status === 201) {
        payload.alert.success('Saved Successfully')
      } else {
        payload.alert.warning('Unable To Save')
      }
    }).catch(err => {
      dispatch(actionTypes.dataLoaded())
      console.log(err)
      payload.alert.warning('Unable To Save')
    })
  }
}

export const saveCollectionCashDeposit = (payload) => {
  return (dispatch) => {
    const {
      session,
      toAccount,
      toBranch,
      amount,
      date,
      remarks,
      approvedBy,
      user,
      alert
    } = payload

    const body = {
      academic_year: session,
      to_account: toAccount,
      to_branch: toBranch,
      amount,
      date: date,
      remarks,
      approved_by_whom: approvedBy,
      from_branch: null
    }
    dispatch(actionTypes.dataLoading())
    axios.post(urls.CollectionAccMoney, body, {
      headers: {
        'Authorization': 'Bearer ' + user
      }
    }).then(res => {
      dispatch(actionTypes.dataLoaded())
      if (res.status === 201) {
        alert.success('Saved Successfully')
      } else {
        alert.warning('Unable To Save')
      }
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      alert.warning('Unable To Save')
    })
  }
}

export const updateDepositEntry = (payload) => {
  return (dispatch) => {
    const {
      id,
      date,
      amount,
      remarks,
      isCancelled,
      depositType,
      user,
      alert
    } = payload

    const body = {
      date,
      amount,
      remarks,
      is_cancelled: isCancelled,
      deposit_type: depositType.value,
      partial: true
    }
    dispatch(actionTypes.dataLoading())
    axios.put(urls.Finance + id + urls.EditViewDeposit, body, {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }).then(response => {
      if (response.status === 200) {
        alert.success('Saved Successfully')
        dispatch({
          type: UPDATE_DEPOSIT_ENTRY,
          payload: {
            data: response.data
          }
        })
      } else {
        alert.warning('Unable To Save')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      dispatch(actionTypes.dataLoaded())
      alert.warning('Unable To Save')
      console.log(err)
    })
  }
}
