import axios from 'axios'
import * as actionTypes from '../../../../store/actions/actions'
import { urls } from '../../../../../../urls'

export const FETCH_LEDGER_LIST = 'FETCH_LEDGER_LIST'
export const ADD_LEDGER_ACC_HEAD = 'ADD_LEDGER_ACC_HEAD'
export const DELETE_LEDGER_HEAD = 'DELETE_LEDGER_HEAD'
export const EDIT_LEDGER_HEAD = 'EDIT_LEDGER_HEAD'
export const ADD_LEDGER_ENTRY = 'ADD_LEDGER_ENTRY'
export const EDIT_LEDGER_ENTRY = 'EDIT_LEDGER_ENTRY'
export const DELETE_LEDGER_ENTRY = 'DELETE_LEDGER_ENTRY'
export const ADD_LEDGER_TYPE = 'ADD_LEDGER_TYPE'

export const fetchLedgerList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.AllLedgerList, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_LEDGER_LIST,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Something Went Wrong')
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const addLedgerAccHead = (payload) => {
  return (dispatch) => {
    const body = {
      account_head_name: payload.headName,
      ledger_type: payload.type
    }
    dispatch(actionTypes.dataLoading())
    axios.post(urls.AddLedgerAccHead, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: ADD_LEDGER_ACC_HEAD,
        payload: {
          data: {
            ...response.data,
            sub_header: []
          }
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const deleteLedgerHead = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.delete(`${urls.Finance}${payload.headId}/${urls.EditLedgerAccHead}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (+response.status === 204) {
        const { headId } = payload
        dispatch({
          type: DELETE_LEDGER_HEAD,
          payload: {
            data: headId
          }
        })
      } else {
        throw new Error('Cannot Delete Item')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const editLedgerHead = (payload) => {
  return (dispatch) => {
    const body = {
      account_head_name: payload.headName,
      ledger_type: {
        id: payload.type
      }
    }
    dispatch(actionTypes.dataLoading())
    axios.put(`${urls.Finance}${payload.headId}/${urls.EditLedgerAccHead}`, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: EDIT_LEDGER_HEAD,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      payload.alert.warning('Something Went Wrong')
    })
  }
}

export const addLedgerEntry = (payload) => {
  return (dispatch) => {
    const {
      headId,
      ledgerName,
      remarks,
      user,
      alert
    } = payload
    const body = {
      ledger_account: ledgerName,
      remarks: remarks,
      id: headId
    }
    dispatch(actionTypes.dataLoading())
    axios.post(urls.AddLedgerEntry, body, {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }).then(response => {
      dispatch({
        type: ADD_LEDGER_ENTRY,
        payload: {
          data: response.data,
          headId
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      alert.warning('Something Went Wrong')
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const editLedgerEntry = (payload) => {
  const body = {
    ledger_account: payload.ledgerName,
    remarks: payload.remarks,
    ledger_status: payload.status
  }
  return (dispatch) => {
    const { alert, headId } = payload
    dispatch(actionTypes.dataLoading())
    axios.put(`${urls.Finance}${payload.id}${urls.EditDeleteLedgerEntry}`, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: EDIT_LEDGER_ENTRY,
        payload: {
          data: response.data,
          headId
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

export const deleteLedgerEntry = (payload) => {
  return (dispatch) => {
    const {
      headId,
      id,
      alert,
      user
    } = payload
    dispatch(actionTypes.dataLoading())
    axios.delete(`${urls.Finance}${payload.id}${urls.EditDeleteLedgerEntry}`, {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }).then(response => {
      if (+response.status === 204) {
        dispatch({
          type: DELETE_LEDGER_ENTRY,
          payload: {
            headId,
            id
          }
        })
      } else {
        throw new Error('Cannot Delete Item')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      alert.warning('Something Went Wrong')
    })
  }
}

export const addLedgerType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    const {
      typeName,
      user,
      alert
    } = payload
    const body = {
      'ledger_type_name': typeName
    }
    axios.post(urls.AddLedgerType, body, {
      headers: {
        'Authorization': 'Bearer ' + user
      }
    }).then(response => {
      if (+response.status === 201) {
        alert.success('Saved Successfully')
        dispatch({
          type: ADD_LEDGER_TYPE,
          payload: {
            data: response.data
          }
        })
      } else {
        alert.warning('Unable To Save')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      alert.warning('Unable To Save')
      dispatch(actionTypes.dataLoaded())
    })
  }
}
