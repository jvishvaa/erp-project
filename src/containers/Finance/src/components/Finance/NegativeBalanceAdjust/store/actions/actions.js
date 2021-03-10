import axios from 'axios'
import { urls } from '../../../../../urls'
import * as actionTypes from '../../../store/actions/actions'

export const STUDENT_VALID_REQUEST = 'STUDENT_VALID_REQUEST'
export const WALLET_AMOUNT = 'WALLET_AMOUNT'
export const TRANSACTION_DETAILS = 'TRANSACTION_DETAILS'
export const ADD_WALLET_AMOUNT = 'ADD_WALLET_AMOUNT'
export const FEE_STRUCTURE_LIST_ERP = 'FEE_STRUCTURE_LIST_ERP'
export const WALLET_AMOUNT_NOT_USED = 'WALLET_AMOUNT_NOT_USED'
export const DELETE_WALLET_AMOUNT = 'DELETE_WALLET_AMOUNT'

export const sendValidRequest = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.ValidRequest, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: STUDENT_VALID_REQUEST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        if (response.status === 200) {
          payload.alert.success('Valid Request Successfully Send!')
        }
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(error)
      })
  }
}

export const fetchWalletAmount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.WalletAmount + '?academic_year=' + payload.session + '&branch=' + payload.branch + '&grade=' + payload.grade, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: WALLET_AMOUNT,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        if (response.status === 200) {
          payload.alert.success('Got Valid Amount Successfully!')
        }
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(error)
      })
  }
}

export const fetchTransDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.TransactionDetails + '?academic_year=' + payload.session + '&branch=' + payload.branch + '&grade=' + payload.grade + '&student=' + payload.student, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: TRANSACTION_DETAILS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        // if (response.status === 200) {
        //   payload.alert.success('Got Valid Amount Successfully!')
        // }
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(error)
      })
  }
}
export const addWalletAmount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.AddWalletAmount, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ADD_WALLET_AMOUNT,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        if (response.status === 201) {
          payload.alert.success('Added Successfully!')
        }
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(error)
      })
  }
}

export const fetchFeeStructureListErp = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeeStructure + '?erp_code=' + payload.erp + '&academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_STRUCTURE_LIST_ERP,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.warning('Something Went Wrong!')
      })
  }
}
export const fetchWalletAmtNotUsed = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.WalletAmtNotUsed + '?erp_code=' + payload.erp + '&academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: WALLET_AMOUNT_NOT_USED,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.warning('Something Went Wrong!')
      })
  }
}
export const deleteWalletUnusedAmount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.WalletAmtRemoved, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: DELETE_WALLET_AMOUNT,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        if (response.status === 201) {
          payload.alert.success('Deleted Successfully!')
        }
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(error)
      })
  }
}
