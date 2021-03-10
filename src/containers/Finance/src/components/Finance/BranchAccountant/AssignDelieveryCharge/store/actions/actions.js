import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

export const FETCH_DELIEVERY_ERP = 'FETCH_DELIEVERY_ERP'
export const FETCH_ALL_DELIEVERY_CHARGE = 'FETCH_ALL_DELIEVERY_CHARGE'
export const ASSIGN_DELIEVERY_CHARGE = 'ASSIGN_DELIEVERY_CHARGE'

// action creators
export const fetchAssignedDelieveryErp = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.DelieveryChargeErp + '?academic_year=' + payload.session + '&grade=' + payload.grade, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_DELIEVERY_ERP,
          payload: {
            data: response.data
          }
        })
        if (response.status === 200) {
          payload.alert.success('Data Loaded Successfully!')
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        console.log(err)
        if (err.response && err.response.status === 400) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}
export const fetchAllDelieverycharge = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ListDelieveryCharge + '?academic_year=' + payload.session + '&grade=' + payload.grade, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_ALL_DELIEVERY_CHARGE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        console.log(err)
        if (err.response && err.response.status === 400) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
      })
  }
}

export const assignDelieveryChargeStudent = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.AssignDelieveryCharge, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ASSIGN_DELIEVERY_CHARGE,
          payload: {
            data: response.data
          }
        })
        if (response.status === 200) {
          payload.alert.success('Delivery Charge Kit Assigned Successfully!')
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
