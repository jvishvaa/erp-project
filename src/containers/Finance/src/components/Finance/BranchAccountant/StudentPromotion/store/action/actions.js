import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const STUDENT_PROMOTION_LIST = 'STUDENT_PROMOTION_LIST'
export const STUDENT_PROMOTED_LIST = 'STUDENT_PROMOTED_LIST'
export const SECTIONS_GRADE = 'SECTIONS_GRADE'

// action creators
export const studentPromotionList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(`${urls.StudentPromotion}?academic_year=${payload.data.academic_year}&branch=${payload.data.branch}&section=${payload.data.section}&grade=${payload.data.grade}`, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          dispatch({
            type: STUDENT_PROMOTION_LIST,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.error(error.response && error.response.data)
        } else {
          payload.alert.error('Unable to load ')
        }
        console.error(error)
      })
  }
}
export const sendStudentPromotionList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.StudentPromotionList, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          dispatch({
            type: STUDENT_PROMOTED_LIST,
            payload: {
              data: response.data
            }
          })
          payload.alert.success('Successfully Done')
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        console.log(err)
        if (err.response && err.response.status === 400) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          payload.alert.warning('Unable To get Status')
        }
      })
  }
}

export const fetchAllSection = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentGradeSectionAcc + '?grade=' + payload.gradeId + '&academic_year=' + payload.session + '&branch_id=' + payload.branchId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: SECTIONS_GRADE,
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
