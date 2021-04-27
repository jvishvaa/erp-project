import axios from 'axios'
import { urls } from '../../../../../urls'
import * as actionTypes from '../../../store/actions/actions'

// action types
export const FEE_TYPE_LIST = 'FEE_TYPE_LIST'
export const FEE_ACCOUNT_LIST = 'FEE_ACCOUNT_LIST'
export const FEE_DISPLAY_INSTALLMENTS = 'FEE_DISPLAY_INSTALLMENTS'
export const FEE_CREATE_INSTALLMENTS = 'FEE_CREATE_INSTALLMENTS'
export const FEE_PLAN_TYPE_LIST = 'FEE_PLAN_TYPE_LIST'
export const CREATE_FEE_TYPE_MAPPING = 'CREATE_FEE_TYPE_MAPPING'
export const FEE_ACCOUNT_LIST_FROM_ACADID = 'FEE_ACCOUNT_LIST_FROM_ACADID'
export const UPDATE_INSTALLMENT_RECORD = 'UPDATE_INSTALLMENT_RECORD'
export const UPDATE_INSTALLMENT_AMOUNT = 'UPDATE_INSTALLMENT_AMOUNT'
export const FEE_PLAN_LIST = 'FEE_PLAN_LIST'
export const UPDATE_FEE_PLAN = 'UPDATE_FEE_PLAN'
export const DELETE_FEE_PLAN_GRADES = 'DELETE_FEE_PLAN_GRADES'
export const UPDATE_FEE_PLAN_GRADES = 'UPDATE_FEE_PLAN_GRADES'
export const DELETE_FEE_PLAN_INSTALLMENTS = 'DELETE_FEE_PLAN_INSTALLMENTS'
export const FEE_TYPE_PER_BRANCH = 'FEE_TYPE_PER_BRANCH'
export const FEE_PLAN_YEAR_APPLICABLE = 'FEE_PLAN_YEAR_APPLICABLE'
export const CREATE_FEE_PLAN = 'CREATE_FEE_PLAN'
export const CREATE_FEE_PLAN_TYPE_MAP = 'ASSIGN_FEE_PLAN'
export const CLEAR_MANAGE_FEE_PROPS = 'CLEAR_MANAGE_FEE_PROPS'

// action creators
export const fetchFeeTypeAndAccountList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.all([
      axios.get(urls.FeeTypeList + '?fee_plan_id=' + payload.feeplanId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }),
      axios.get(urls.FeeAcoountsFromFeePlan + '?fee_plan_id=' + payload.feeplanId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      })
    ])
      .then(axios.spread((typeRes, planRes) => {
        dispatch({
          type: FEE_TYPE_LIST,
          payload: {
            data: typeRes.data.results
          }
        })
        dispatch({
          type: FEE_ACCOUNT_LIST,
          payload: {
            data: planRes.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      })).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Unable to load data')
        }
      })
  }
}
export const fetchFeeTypeList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeeTypeList + '?fee_plan_id=' + payload.feePlanId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_TYPE_LIST,
          payload: {
            data: response.data.results
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Unable to load data')
        }
      })
  }
}

export const updateFeePlanGrades = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.UpdateCreateFeePlan + '?gradeid=' + payload.gradeId + '&id=' + payload.typeId, {}, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: UPDATE_FEE_PLAN_GRADES,
          payload: {
            data: response.data,
            id: payload.typeId
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Added Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.error('Something Went Wrong')
        }
      })
  }
}

export const feeAccountList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeeAcoountsFromFeePlan + '?fee_plan_id=' + payload.feeplanId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_ACCOUNT_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Unable to load data')
        }
        console.log(error)
      })
  }
}

export const feeDisplayInstallment = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.DisplayInstallments + '?fee_plan=' + payload.feePlanId + '&fee_type=' + payload.feeTypeId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_DISPLAY_INSTALLMENTS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Unable to load data')
        }
        console.log(error)
      })
  }
}

export const feeCreateInstallment = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.CreateInstallments, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_CREATE_INSTALLMENTS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Created Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.error('Something went wrong')
        }
        console.log(error)
      })
  }
}

export const feePlanTypeList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeePLanTypeList + '?fee_plan_id=' + payload.feeId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_PLAN_TYPE_LIST,
          payload: {
            data: response.data.results
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.error('Unable to load data')
        }
        console.log(error)
      })
  }
}

export const createFeeType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.CreateFeeTypeMapping, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: CREATE_FEE_TYPE_MAPPING,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Added Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.error('Something Went Wrong')
        }
        console.log(error)
      })
  }
}

export const feeAccountListFromAcadId = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeeAccountBranches + '?academic_year=' + payload.acadId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_ACCOUNT_LIST_FROM_ACADID,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Unable to load data')
        }
        console.log(error)
      })
  }
}

export const updateInstallmentRecord = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.Finance + payload.installmentId + '/updateinstallmentsrecords/', payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: UPDATE_INSTALLMENT_RECORD,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Updated Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.error('Something went wrong')
        }
        console.log(error)
      })
  }
}

export const updateInstallmentAmount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    const { feeTypeId } = payload
    axios.put(urls.Finance + payload.id + urls.UpdateInstallmentAmount + '?new_amount=' + payload.data.installmentAmount, {}, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    })
      .then(response => {
        dispatch({
          type: UPDATE_INSTALLMENT_AMOUNT,
          payload: {
            data: response.data,
            feeTypeId
          }
        })
        payload.alert.success('Updated Successfully')
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.error('Something went wrong')
        }
        console.log(error)
      })
  }
}

export const fetchFeePlanList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeePlanList + '?academic_year=' + payload.session + '&branch_id=' + payload.branch, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_PLAN_LIST,
          payload: {
            data: response.data.results
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Unable to load data')
        }
        console.log(error)
      })
  }
}

export const updateFeePlan = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.Finance + payload.feePlanId + '/editcreatefeeplan/', payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: UPDATE_FEE_PLAN,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Updated Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.error('Something went wrong')
        }
        console.log(error)
      })
  }
}

export const deleteFeePlanGrades = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .delete(urls.UpdateCreateFeePlan + '?gradeid=' + payload.gradeId + '&id=' + payload.typeId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: DELETE_FEE_PLAN_GRADES,
          payload: {
            gradeId: payload.gradeId,
            typeId: payload.typeId
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Deleted Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.error('Something went wrong')
        }
        console.log(error)
      })
  }
}

export const deleteFeePlanInstallments = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .delete(urls.DeleteInstallments +
        '?fee_type=' + payload.feeTypeId +
        '&fee_plan=' + payload.feePlanId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: DELETE_FEE_PLAN_INSTALLMENTS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Deleted Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.error('Something went wrong')
        }
        console.log(error)
      })
  }
}

export const fetchFeeTypesPerBranch = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeeType + '?academic_year=' + payload.session + '&branch_id=' + payload.branch, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_TYPE_PER_BRANCH,
          payload: {
            data: response.data.results
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Unable to load data')
        }
        console.log(error)
      })
  }
}

export const fetchFeePlanYearApplicable = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeePlanYearApplicable + '?branch=' + payload.branch, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_PLAN_YEAR_APPLICABLE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Unable to load data')
        }
        console.log(error)
      })
  }
}

export const createFeePlan = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.CreateFeePlan, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: CREATE_FEE_PLAN,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Created Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.error('Something Went wrong')
        }
        console.log(error)
      })
  }
}

export const createFeePlanTypeMap = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.CreateFeeTypePlanMapping, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: CREATE_FEE_PLAN_TYPE_MAP,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        payload.alert.success('Created Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.error('Something Went wrong')
        }
        console.log(error)
      })
  }
}

export const clearManageFeeTypesProps = () => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    dispatch({
      type: CLEAR_MANAGE_FEE_PROPS
    })
    dispatch(actionTypes.dataLoaded())
  }
}
