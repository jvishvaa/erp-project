import axios from 'axios'
import { urls } from '../../../../../../../urls'
import * as actionTypes from '../../../../../store/actions/actions'

// action-creators
export const FETCH_PETTY_CASH_ACC = 'FETCH_PETTY_CASH_ACC'
export const FETCH_LEDGER_RECORD = 'FETCH_LEDGER_RECORD'
export const FETCH_LEDGER_NAME = 'FETCH_LEDGER_NAME'
export const LIST_PETTY_CASH = 'LIST_PETTY_CASH'
export const FETCH_PARTY_LIST = 'FETCH_PARTY_LIST'
export const FETCH_LEDGER_REPORT = 'FETCH_LEDGER_REPORT'
export const SET_TXN_ACTIVE_INACTIVE = 'SET_TXN_ACTIVE_INACTIVE'
export const CASH_WITHDRAW = 'CASH_WITHDRAW'
export const LIST_CASH_OPENING_BALANCE = 'LIST_CASH_OPENING_BALANCE'
export const FETCH_BANK_STATEMENT = 'FETCH_BANK_STATEMENT'
export const FETCH_CASH_STATEMENT = 'FETCH_CASH_STATEMENT'
export const FETCH_FINANCIAL_LEDGER_REPORT = 'FETCH_FINANCIAL_LEDGER_REPORT'
export const VOUCHER_RECEIPT_HEADERS = 'VOUCHER_RECEIPT_HEADERS'
export const SENDING_DATA = 'SENDING_DATA'

// ACTION TYPES
export const fetchPettyCashAcc = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListPettyCashAccounts + '?academic_year='  + payload.session + '&branch_id=' + payload.branch, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log(response)
      dispatch({
        type: FETCH_PETTY_CASH_ACC,
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

export const fetchLedgerRecord = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.LedgerList}?ledger_type=${payload.ledgerType}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_LEDGER_RECORD,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchLedgerName = (payload) => {
  return (dispatch) => {
    const {
      user,
      headId,
      alert
    } = payload
    dispatch(actionTypes.dataLoading())
    axios.get(urls.LedgerNameList + '?id=' + headId, {
      headers: {
        'Authorization': 'Bearer ' + user
      }
    }).then(response => {
      dispatch({
        type: FETCH_LEDGER_NAME,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      alert.warning('Something Went Wrong')
    })
  }
}

export const listPettyCash = (payload) => {
  return (dispatch) => {
    const {
      user,
      alert
    } = payload
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListPettyCashAccounts + '?branch_id=' + payload.branch, {
      headers: {
        'Authorization': 'Bearer ' + user
      }
    }).then(response => {
      dispatch({
        type: LIST_PETTY_CASH,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      alert.warning('Something Went Wrong')
    })
  }
}

export const savePettyCashExpense = (payload) => {
  return (dispatch) => {
    const {
      body,
      user,
      alert
    } = payload
    dispatch(actionTypes.dataLoading())
    axios.post(urls.SavePettyCashExpenses, body, {
      headers: {
        'Authorization': 'Bearer ' + user
      }
    }).then(response => {
      console.log(response)
      if (+response.status === 201) {
        alert.success('Data Successfully Saved')
      } else {
        alert.warning('Failed To Save Data')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      alert.warning('Failed To Save Data')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const fetchPartyList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListCreateParty + '?branch_id=' + payload.branch, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_PARTY_LIST,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded)
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      payload.alert.warning('Something Went Wrong')
    })
  }
}

export const fetchLedgerReport = (payload) => {
  return (dispatch) => {
    const {
      academicSession,
      ledgerType,
      ledgerHead,
      ledgerName,
      fromDate,
      toDate,
      user,
      alert,
      page, 
      branch
    } = payload
    dispatch(actionTypes.dataLoading())
    let url = `${urls.ListCashSpent}?academic_year=${academicSession}&page_no=${page}&branch_id=${branch}`
    if (ledgerType && ledgerHead && ledgerName) {
      url = `${url}&ledger_type=${ledgerType}&ledger_head=${ledgerHead}&ledger_name=${ledgerName}&branch_id=${branch}`
    }
    if (fromDate && toDate) {
      url = `${url}&from_date=${fromDate}&to_date=${toDate}&branch_id=${branch}`
    }
    axios.get(url, {
      headers: {
        'Authorization': 'Bearer ' + user
      }
    }).then(response => {
      dispatch({
        type: FETCH_LEDGER_REPORT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
      console.log(response.data)
    }).catch(err => {
      console.log(err)
      alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const downloadLedgerAttachment = (payload) => {
  window.location.replace(payload.urls[0].file)
  return (dispatch) => {
    // const options = payload.urls.map(atUrl => ({
    //   url: atUrl.file,
    //   method: 'get',
    //   responseType: 'blob',
    //   headers: {
    //     Authorization: 'Bearer ' + payload.user
    //   }
    // }))
    // dispatch(actionTypes.dataLoading())
    // axios.all(
    //   options.map(optn => (
    //     axios.request(optn)
    //   ))
    // ).then(axios.spread((...args) => {
    //   args.forEach((response, i) => {
    //     const splitArr = payload.urls[i].file.split('.')
    //     const ext = splitArr[splitArr.length - 1]
    //     const url = window.URL.createObjectURL(new Blob([response.data]))
    //     const link = document.createElement('a')
    //     link.href = url
    //     link.target = '_blank'
    //     link.setAttribute('download', `attachment-${i + 1}.${ext}`)
    //     document.body.appendChild(link)
    //     link.click()
    //   })
    //   dispatch(actionTypes.dataLoaded())
    // })).catch(err => {
    //   console.log(err)
    //   payload.alert.warning('Unable To Download Some Files')
    //   dispatch(actionTypes.dataLoaded())
    // })
    // axios.get(payload.url, {
    //   headers: {
    //     Authorization: 'Bearer ' + payload.user
    //   },
    //   responseType: 'blob'
    // }).then(response => {
    //   // console.log(urls.BASE)
    //   const url = window.URL.createObjectURL(new Blob([response.data]))
    //   const link = document.createElement('a')
    //   link.href = url
    //   link.target = '_blank'
    //   link.setAttribute('download', payload.reportName)
    //   document.body.appendChild(link)
    //   link.click()
    // }).catch(err => {
    //   console.log('Error in Second Axios', err)
    // })
  }
}

export const setTxnActiveInactive = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    const url = `${urls.Finance}${payload.id}${urls.UpdateMoneySpentInactive}`
    axios.put(url, {}, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
      }
    }).then(response => {
      if (+response.status === 200) {
        // payload.alert.success('Saved Successfully')
        dispatch({
          type: SET_TXN_ACTIVE_INACTIVE,
          payload: {
            data: response.data
          }
        })
      } else {
        // payload.alert.warning('Unable To Change')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      // payload.alert.warning('Something Went Wrong')
    })
  }
}

export const cashWithdraw = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    const {
      session,
      bank,
      amount,
      narration,
      chequeNo,
      approvedBy,
      date,
      alert,
      user, 
      branch
    } = payload
    const body = {
      academic_year: session,
      bank,
      amount,
      narration,
      cheque_no: chequeNo,
      approved_by: approvedBy,
      date,
      branch_id: branch
    }
    axios.post(urls.AddCashWithdraw, body, {
      headers: {
        'Authorization': 'Bearer ' + user
      }
    }).then(response => {
      console.log(response)
      if (+response.status === 201) {
        // alert.success('Saved Successfully')
        dispatch({
          type: CASH_WITHDRAW,
          payload: {
            data: response.data
          }
        })
      } else {
        // alert.warining('Unable To Save')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      // alert.warning('Something Went Wrong')
    })
  }
}

export const listCashOpeningBalance = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.CashOpeningBalance + '?academic_year='  + payload.session + '&branch_id=' + payload.branch, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: LIST_CASH_OPENING_BALANCE,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      // payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const fetchBankStatement = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    const {
      session,
      bankId,
      user,
      alert
    } = payload
    axios.get(`${urls.ListFinancialLedgerReport}?academic_year=${session}&bank_id=${bankId}`, {
      headers: {
        'Authorization': 'Bearer ' + user
      }
    }).then(response => {
      dispatch({
        type: FETCH_BANK_STATEMENT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      alert.warning('Something Went Wrong')
    })
  }
}

export const fetchCashStatement = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.CashWithdrawReports}?financial_year=${payload.session}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_CASH_STATEMENT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      dispatch(actionTypes.dataLoaded())
      console.err(err)
      payload.alert.warning('Something Went Wrong')
    })
  }
}

export const fetchFinancialLedgerReport = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    const {
      session,
      user,
      alert,
      branch 
    } = payload
    axios.get(`${urls.LedgerFinancialReport}?session_year=${session}&branch_id=${branch}`, {
      headers: {
        'Authorization': 'Bearer ' + user
      }
    }).then(response => {
      dispatch({
        type: FETCH_FINANCIAL_LEDGER_REPORT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded)
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      alert.warning('Something Went Wrong')
    })
  }
}

export const fetchReceiptHeader = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.VoucherReceiptHeaders + '?session_year=' + payload.session + '&branch_id=' + payload.branch, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log('voucher header res:', response)
      dispatch({
        type: VOUCHER_RECEIPT_HEADERS,
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

export const sendingData = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())

      dispatch({
        type: SENDING_DATA,
        payload: {
          data: payload.data
        }
      })
      dispatch(actionTypes.dataLoaded())
  }
}