import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const FEE_CONCESSION_DETAILS = 'FEE_CONCESSION_DETAILS'
export const OTHER_FEE_CONCESSION_DETAILS = 'OTHER_FEE_CONCESSION_DETAILS'

// action creators
export const fetchFeeConcessionList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeeConcessionList + '?erp=' + payload.erp + '&academic_year=' + payload.session + '&branch_id=' + payload.branch + '&moduleId=' + payload.moduleId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_CONCESSION_DETAILS,
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

export const fetchOtherFeeConcessionList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.OtherFeeConcessionList + '?erp_code=' + payload.erp + '&academic_year=' + payload.session + '&branch_id=' + payload.branch + '&moduleId=' + payload.moduleId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: OTHER_FEE_CONCESSION_DETAILS,
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
