import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const ALL_GRADES = 'ALL_GRADES'
export const FETCH_ALL_PDC = 'FETCH_ALL_PDC'

// action creators
export const fetchGrades = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentGradeAcc + '?academic_year=' + payload.session + '&module_id=' + payload.moduleId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ALL_GRADES,
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

export const fetchPdc = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ListPDC + '?academic_year=' + payload.session + '&grade_id=' + payload.grade + '&from_date=' + payload.fromDate + '&to_date=' + payload.toDate + '&branch_id=' + payload.branch, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_ALL_PDC,
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
