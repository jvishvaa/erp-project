import axios from 'axios'
import * as actionTypes from '../../../../store/actions/actions'
import { urls } from '../../../../../../urls'

// action types
export const ACCOUNTANT_OTHER_FEE_LIST = 'ACCOUNTANT_OTHER_FEE_LIST'
export const ADD_OTHER_FEE_ACCOUNTANT = 'ADD_OTHER_FEE_ACCOUNTANT'
export const ACCOUNTANT_FEE_ACCOUNT = 'ACCOUNTANT_FEE_ACCOUNT'
export const UPDATE_ACC_OTHER_FEE_LIST = 'UPDATE_ACC_OTHER_FEE_LIST'
export const DELETE_ACC_OTHER_FEE_LIST = 'DELETE_ACC_OTHER_FEE_LIST'
export const LIST_OTHER_FEES = 'LIST_OTHER_FEES'
export const ASSIGN_OTHER_FEES = 'ASSIGN_OTHER_FEES'
export const OTHER_FEE_PAYMENT = 'OTHER_FEE_PAYMENT'
export const RECEIPT_RANGE_MESSAGE = 'RECEIPT_RANGE_MESSAGE'
export const CLEARING_ALL_PROPS = 'CLEARING_ALL_PROPS'
export const ACCOUTANT_OTHER_FEES_ASSIGN = 'ACCOUTANT_OTHER_FEES_ASSIGN'
export const ACCOUNTANT_OTHER_FEES_UNASSIGN = 'ACCOUNTANT_OTHER_FEES_UNASSIGN'
export const CREATE_OTHER_FEES_FOR_UNASSIGN = 'CREATE_OTHER_FEES_FOR_UNASSIGN'
export const DELETE_OTHER_FEES_FOR_ASSIGNED = 'DELETE_OTHER_FEES_FOR_ASSIGNED'
export const ADMIN_FEE_ACCOUNT_LIST = 'ADMIN_FEE_ACCOUNT_LIST'
export const CHECK_OTHER_FEES_INSTALLMENTS = 'CHECK_OTHER_FEES_INSTALLMENTS'
export const ASSIGN_OTHER_FEES_INSTALLMENTS = 'ASSIGN_OTHER_FEES_INSTALLMENTS'
export const SAVE_OTHER_FEES_INSTALLMENTS = 'SAVE_OTHER_FEES_INSTALLMENTS'
export const DELETE_OTHER_FEES_INSTALLMENTS = 'DELETE_OTHER_FEES_INSTALLMENTS'
export const FETCH_ADMIN_OTHER_LIST = 'FETCH_ADMIN_OTHER_LIST'
export const FETCH_INSTALLMENT_LIST = 'FETCH_INSTALLMENT_LIST'
export const UPDATE_OTHER_FEE_INST = 'UPDATE_OTHER_FEE_INST'
export const CHECK_IS_MISC = 'CHECK_IS_MISC'
export const UPLOAD_OTHER_FEES = 'UPLOAD_OTHER_FEES'
export const UPDATE_OTHER_FEE_INSTA = 'UPDATE_OTHER_FEE_INSTA'

// action creators

export const checkIsMisc = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.CheckMiscFeeAtOtherFee + '?id=' + payload.otherFeeId + '&academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log(response)
        dispatch({
          type: CHECK_IS_MISC,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to find misc or not')
        console.log(error)
      })
  }
}

export const payOtherFee = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.OtherFeePAyment, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: OTHER_FEE_PAYMENT,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Done Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const uploadBulkFees = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.OrderFeesBulkUpload, payload.body, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: UPLOAD_OTHER_FEES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Done Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const receiptMessage = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ReceiprRangeMsg + '?erp=' + payload.erp + '&academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log(response)
        dispatch({
          type: RECEIPT_RANGE_MESSAGE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load')
        console.log(error)
      })
  }
}

export const assignOtherFee = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.CreateOtherFeesForUnassigned, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ASSIGN_OTHER_FEES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Added Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const fetchListtOtherFee = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentOtherFees + '?academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: LIST_OTHER_FEES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const fetchAccountantOtherFee = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.AccountantOtherFeeList + '?session_year=' + payload.session + '&erp_code=' + payload.erp, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ACCOUNTANT_OTHER_FEE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load data')
        console.log(error.response)
      })
  }
}

export const fetchAccountantFeeAccount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.AccountantFeeAccount + '?erp_code=' + payload.erp + '&academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ACCOUNTANT_FEE_ACCOUNT,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const addAccountantOtherFee = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.AddOtherFeeAccountant, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ADD_OTHER_FEE_ACCOUNTANT,
          payload: {
            data: response.data,
            confirm: true
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Added Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const updateAccOtherFeeList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.Finance + payload.id + '/retrieveupdatedestroyotherfee/', payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: UPDATE_ACC_OTHER_FEE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Updated Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const deleteAccOtherFeeList = (payload) => {
  const { id } = payload
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .delete(urls.Finance + id + '/retrieveupdatedestroyotherfee/', payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: DELETE_ACC_OTHER_FEE_LIST,
          payload: {
            id: id
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Deleted Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const assignAccoutantOtherFees = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.AccountantAssignOtherFees +
        '?academic_year=' + payload.session +
        '&otherfee=' + payload.otherFeeId +
        '&grade=' + payload.grade +
        '&section=' + payload.section +
        '&type=' + payload.type, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log(response)
        if (Array.isArray(response.data)) {
          dispatch({
            type: ACCOUNTANT_OTHER_FEES_UNASSIGN,
            payload: {
              data: response.data
            }
          })
        } else {
          dispatch({
            type: ACCOUTANT_OTHER_FEES_ASSIGN,
            payload: {
              data: response.data
            }
          })
        }

        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load')
        console.log(error)
      })
  }
}

export const createOtherFeeForUnassigned = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.CreateOtherFeesForUnassigned, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log(response)
        dispatch({
          type: CREATE_OTHER_FEES_FOR_UNASSIGN,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Students Assigned')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error.response)
      })
  }
}

export const deleteOtherFeeForAssigned = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.DeleteOtherFeesForassigned, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log(response)
        dispatch({
          type: DELETE_OTHER_FEES_FOR_ASSIGNED,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Students unassigned')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error.response)
      })
  }
}

export const fetchAdminFeeAccount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.AccountantFeeAccount + '?session_year=' + payload.session + '&branch_id=' + payload.branch, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ADMIN_FEE_ACCOUNT_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const checkOtherFeesInstallment = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.CheckForInstallments + '?session_year=' + payload.session + '&branch_id=' + payload.branch + '&fee_type_name=' + payload.feeName, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log(response)
        dispatch({
          type: CHECK_OTHER_FEES_INSTALLMENTS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load')
        console.log(error)
      })
  }
}

export const assignInstallmentOtherFees = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.SaveOtherFeesInstallments, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ASSIGN_OTHER_FEES_INSTALLMENTS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Done Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const saveInstallmentOtherFees = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.SaveOtherFeesInstallments, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: SAVE_OTHER_FEES_INSTALLMENTS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Done Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const deleteOtherFeesInstallments = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .delete(urls.DeleteOtherFeesInstallments + '?session_year=' + payload.session + '&branch_id=' + payload.branch + '&fee_type_name=' + payload.feeName, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log(response)
        dispatch({
          type: DELETE_OTHER_FEES_INSTALLMENTS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Installments Deleted')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const fetchAdminOtherFees = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.AdminOtherFeesList + '?session_year=' + payload.session + '&branch_id=' + payload.branch, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log(response)
        dispatch({
          type: FETCH_ADMIN_OTHER_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load')
        console.log(error)
      })
  }
}

export const fetchInstallmentLists = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.GetInstallmentList + '?branch_name=' + payload.branch + '&academic_year=' + payload.session + '&otherfee_id=' + payload.otherFee, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log(response)
        dispatch({
          type: FETCH_INSTALLMENT_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load')
        console.log(error)
      })
  }
}

export const updateOtherFeeInst = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.UpdateOtherFeeInst, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: UPDATE_OTHER_FEE_INST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Done Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const clearingAllProps = () => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    dispatch({
      type: CLEARING_ALL_PROPS
    })
    dispatch(actionTypes.dataLoaded())
  }
}

export const updateOtherFeeInstaName = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.EditOtherFeeInstallments, payload.body, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: UPDATE_OTHER_FEE_INSTA,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Updated Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}
