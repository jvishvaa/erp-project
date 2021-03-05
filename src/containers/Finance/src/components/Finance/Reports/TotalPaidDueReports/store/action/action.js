import axios from 'axios'
import * as actionTypes from '../../../../store/actions/actions'
import { urls } from '../../../../../../urls'

// action types
export const INSTALLMENTS_LIST_PER_FEE_TYPE = 'INSTALLMENTS_LIST_PER_FEE_TYPE'
export const FEE_TYPES_TOTAL_PAID_REPORTS_PER_BRNCH = 'FEE_TYPES_TOTAL_PAID_REPORTS_PER_BRNCH'
// export const FETCH_FEE_TYPES_NAMES = 'FETCH_FEE_TYPES_NAMES'
export const FETCH_FEE_PLAN_NAMES = 'FETCH_FEE_PLAN_NAMES'
export const CLEAR_TOTAL_PAID_PROPS = 'CLEAR_TOTAL_PAID_PROPS'
export const FETCH_OTHR_FEE_INSTS = 'FETCH_OTHR_FEE_INSTS'

// action creators
export const fetchInstallmentListPerFeeType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.InstallmentsListPerFeeTypes, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log('====>response from installemnt<======', response)
        dispatch({
          type: INSTALLMENTS_LIST_PER_FEE_TYPE,
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

export const fetchFeeTypesPaidReportsPerBranch = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeeTypesPerBranchAndAcadId + '?fee_plan=' + payload.feePlanId + '&academic_year=' + payload.session + '&branch_id=' + payload.branch + '&grade_id=' + payload.grade, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_TYPES_TOTAL_PAID_REPORTS_PER_BRNCH,
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

// export const fetchFeePlanNames = (payload) => {
//   return (dispatch) => {
//     dispatch(actionTypes.dataLoading())
//     axios
//       .get(urls.TotalPaidFeePlan + '?academic_year=' + payload.session + '&grades=' + payload.grades + '&branch=' + payload.branch, {
//         headers: {
//           Authorization: 'Bearer ' + payload.user
//         }
//       }).then(response => {
//         dispatch({
//           type: FETCH_FEE_PLAN_NAMES,
//           payload: {
//             data: response.data
//           }
//         })
//         dispatch(actionTypes.dataLoaded())
//       }).catch(error => {
//         dispatch(actionTypes.dataLoaded())
//         payload.alert.warning('Unable to load fee plans')
//         console.log(error)
//       })
//   }
// }

export const feePlanNamesWithoutOtherFee = (payload) => {
  let url = urls.TotalPaidFeePlan + '?academic_year=' + payload.session + '&grades=' + payload.grades
  if (payload.branch) {
    url += '&branch=' + payload.branch
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_FEE_PLAN_NAMES,
        payload: {
          data: response.data,
          otherFee: []
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      dispatch(actionTypes.dataLoaded())
      payload.alert.warning('Unable to load fee plans')
      console.log(err)
    })
  }
}

export const fetchFeePlanNames = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    const header = {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }
    axios.all([
      axios.get(urls.TotalPaidFeePlan + '?academic_year=' + payload.session + '&grades=' + payload.grades + '&branch=' + payload.branch, header),
      axios.get(urls.OthrFeeTypesPerGrade + '?academic_year=' + payload.session + '&grades=' + payload.grades + '&branches=' + payload.branch, header)
    ]).then(axios.spread((feePlan, othrFee) => {
      dispatch({
        type: FETCH_FEE_PLAN_NAMES,
        payload: {
          data: feePlan.data,
          otherFee: othrFee.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    })).catch(error => {
      dispatch(actionTypes.dataLoaded())
      payload.alert.warning('Unable to load fee plans')
      console.log(error)
    })
  }
}

export const fetchOthrFeeInsts = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.OthrFeeInstAllments + '?academic_year=' + payload.data.academic_year + '&grades=' + payload.data.grades +
      '&branches=' + payload.data.branch + '&other_fee=' + payload.data.fee_types, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_OTHR_FEE_INSTS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load fee plans')
        console.log(error)
      })
  }
}

export const clearTotalPaidProps = () => {
  return (dispatch) => {
    // dispatch(actionTypes.dataLoading())
    dispatch({
      type: CLEAR_TOTAL_PAID_PROPS
    })
    // dispatch(actionTypes.dataLoaded())
  }
}
