import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const FETCH_ALL_GRADES = 'FETCH_ALL_GRADES'
export const FETCH_ALL_SECTIONS = 'FETCH_ALL_SECTIONS'
export const FETCH_ALL_PLANS = 'FETCH_ALL_PLANS'
export const FETCH_ALL_FEE_PLANS = 'FETCH_ALL_FEE_PLANS'
export const EDIT_STUDENT_FEE_PLAN = 'EDIT_STUDENT_FEE_PLAN'
export const CLEAR_ALL_PROPS = 'CLEAR_ALL_PROPS'
export const AUTOMATIC_ASSIGN_STUDENT = 'AUTOMATIC_ASSIGN_STUDENT'
export const FETCH_ADJUST_FEE = 'FETCH_ADJUST_FEE'
export const CURRENT_FEE_PLAN = 'CURRENT_FEE_PLAN'
export const ADJUST_SAVE_FEE_TYPES = 'ADJUST_SAVE_FEE_TYPES'

// action creators
export const fetchAllGrades = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentGradeAcc + '?academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_ALL_GRADES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load data')
      })
  }
}

export const fetchAdjustFee = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.OldNewFeePlanType + '?current_fee_plan_id=' + payload.currentFeePlanId + '&target_fee_plan_id=' + payload.targetFeePlanId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_ADJUST_FEE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load data')
      })
  }
}

export const fetchAllSections = (payload) => {
  let url = null
  if (payload.branch) {
    url = urls.StudentGradeSectionAcc + '?academic_year=' + payload.session + '&grade=' + payload.gradeId + '&branch_id=' + payload.branch + '&module_id=' + payload.moduleId
  } else {
    url = urls.StudentGradeSectionAcc + '?academic_year=' + payload.session + '&grade=' + payload.gradeId + '&module_id=' + payload.moduleId
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_ALL_SECTIONS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load data')
      })
  }
}

export const fetchAllPlans = (payload) => {
  console.log('feeConsole', payload)
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentListForAcc + '?academic_year=' + payload.session + '&grade=' + payload.gradeId + '&section=' + payload.sectionId + '&type=' + payload.studentType, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_ALL_PLANS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.warning('Unable to load data')
      })
  }
}

export const fetchAllFeePlans = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    // dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ListFeePlanUrl + '?academic_year=' + payload.session + '&grade_id=' + payload.gradeId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_ALL_FEE_PLANS,
          payload: {
            data: response.data
          }
        })
        // dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.warning('Unable to load data')
      })
  }
}

export const editStudentFeePlan = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.EditStudentFeePlan, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          // payload.alert.success('Successfully Changed')
          dispatch({
            type: EDIT_STUDENT_FEE_PLAN,
            payload: {
              data: response.data
              // studentId: payload.studentId
            }
          })
          dispatch(actionTypes.dataLoaded())
        }
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        payload.alert.warning('Unable to load data')
      })
  }
}

export const saveAdjustFeeTypes = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.AdjustChangeFeePlan, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        // payload.alert.success('Successfully Changed!')
        dispatch({
          type: ADJUST_SAVE_FEE_TYPES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load data')
      })
  }
}

export const assignAutomaticStudent = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentListForAcc + '?academic_year=' + payload.session + '&grade=' + payload.gradeId + '&section=' + payload.sectionId + '&type=' + payload.studentType, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: AUTOMATIC_ASSIGN_STUDENT,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load data')
      })
  }
}

export const filterCurrentFeePlan = (payload) => {
  return (dispatch) => {
    dispatch({
      type: CURRENT_FEE_PLAN,
      payload: {
        data: payload.text
      }
    })
  }
}
