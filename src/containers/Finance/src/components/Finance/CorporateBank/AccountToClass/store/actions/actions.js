import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action-types
export const FETCH_FEE_TYPES = 'FETCH_FEE_TYPES'
export const FETCH_CLASS_ACC_MAPPING = 'FETCH_CLASS_ACC_MAPPING'
export const DELETE_CLASS_ACC_MAPPING = 'DELETE_CLASS_ACC_MAPPING'
export const FETCH_FEE_ACC_TO_BRANCH = 'FETCH_FEE_ACC_TO_BRANCH'
export const ADD_FEE_ACC_TO_CLASS = 'ADD_FEE_ACC_TO_CLASS'

// misc-functions
const getCorrectedData = (data) => {
  const gradeObj = { ...data[data.length - 1] }
  const modifiedData = gradeObj.grades.map(grade => {
    return {
      ...grade,
      'fee_account_name': null
    }
  })
  const modifiedDataNew = modifiedData.map(grade => {
    let index = data.findIndex(ele => {
      return ele.grades.id === grade.id
    })

    if (index !== -1) {
      grade['fee_account_name'] = { ...data[index]['fee_account_name'] }
      return {
        ...grade
      }
    }

    return {
      ...grade
    }
  })

  return modifiedDataNew
}

// action-creators
export const fetchFeeTypes = (payload) => {
  return (dispatch) => {
    axios.get(urls.BranchFeeList + '?academic_year=' + payload.session + '&branch_id=' + payload.branchId, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_FEE_TYPES,
        payload: {
          data: response.data.results
        }
      })
    }).catch(err => {
      // payload.alert.warning('Unable To Load')
      console.log(err)
    })
  }
}

export const fetchClassAccMapping = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.FeeAccToClass + '?branch_id=' + payload.branchId + '&fee_type=' + payload.feeId, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      let dataToShow = getCorrectedData(response.data)
      dispatch({
        type: FETCH_CLASS_ACC_MAPPING,
        payload: {
          data: dataToShow
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Unable To Load')
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const deleteClassAccMapping = (payload) => {
  const {
    branchId,
    session,
    gradeId,
    feeTypeId,
    feeAccId
  } = payload
  const body = {
    headers: {
      Authorization: 'Bearer ' + payload.user
    }
  }
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.delete(`${urls.FeeAccToClass}?branch=${branchId}&academic_year=${session}&grade_id=${gradeId}&fee_type_name=${feeTypeId}&fee_account_name=${feeAccId}`
      , body).then(response => {
      if (response.data === 'success') {
        dispatch({
          type: DELETE_CLASS_ACC_MAPPING,
          payload: {
            data: {
              gradeId
            }
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      // payload.alert.warning('Unable To Delete')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const fetchFeeAccountToBranch = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.FinanceGradeFeeAccountMapping + '?academic_year=' + payload.session + '&branch=' + payload.branchId + '&grade=' + payload.gradeId, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_FEE_ACC_TO_BRANCH,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Unable To Load')
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const addFeeAccToClass = (payload) => {
  const {
    branchId,
    session,
    gradeId,
    feeTypeId,
    feeAccId,
    newFeeAcc,
    newFeeAccName
  } = payload
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    let body = {
      'branch_id': branchId,
      'academic_year': session,
      'grade_id': gradeId,
      'fee_type_name': feeTypeId,
      'fee_account_name': feeAccId,
      'new_fee_account_name': newFeeAcc
    }

    if (!feeAccId) {
      body = {
        'branch_id': branchId,
        'academic_year': session,
        'grade_id': gradeId,
        'fee_type_name': feeTypeId,
        'new_fee_account_name': newFeeAcc
      }
    }
    axios.put(urls.FeeAccToClass, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.data === 'success') {
        dispatch({
          type: ADD_FEE_ACC_TO_CLASS,
          payload: {
            data: {
              gradeId,
              id: newFeeAcc,
              name: newFeeAccName
            }
          }
        })
      }

      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      // payload.alert.warning('Unable To Add')
      dispatch(actionTypes.dataLoaded())
    })
  }
}
