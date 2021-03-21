import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const FEE_MANAGEMENT_LISTS = 'FEE_MANAGEMENT_LISTS'
export const ASSIGN_FEE_MANAGEMENT = 'ASSIGN_FEE_MANAGEMENT'
export const FETCH_FEE_PLANS_PER_ERP = 'FETCH_FEE_PLANS_PER_ERP'
export const EDIT_STUDENT_FEE = 'EDIT_STUDENT_FEE'

// action creators
export const fetchFeeManagementList = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .all([
        axios.get(urls.ListFeemanagement + '?erp_code=' + payload.erp + '&academic_year=' + payload.session, {
          headers: {
            Authorization: 'Bearer ' + payload.user
          }
        }),
        axios.get(urls.CurrentFeePlaNStd + '?erp=' + payload.erp + '&academic_year=' + payload.session, {
          headers: {
            Authorization: 'Bearer ' + payload.user
          }
        })
      ]).then(axios.spread((response1, response2) => {
        console.log('Status Actions response 1', response1)
        console.log('Status Actions response 2', response2)
        dispatch({
          type: FEE_MANAGEMENT_LISTS,
          payload: {
            data: response1.data,
            feePlan: response2.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      })).catch(error => {
        console.log(error)
        payload.alert.warning('Unable To Load')
        dispatch(actionTypes.dataLoaded())
      })

    // axios
    //   .get(urls.ListFeemanagement + '?erp_code=' + payload.erp + '&academic_year=' + payload.session, {
    //     headers: {
    //       Authorization: 'Bearer ' + payload.user
    //     }
    //   }).then(response => {
    //     dispatch({
    //       type: FEE_MANAGEMENT_LISTS,
    //       payload: {
    //         data: response.data
    //       }
    //     })
    //     dispatch(actionTypes.dataLoaded())
    //   }).catch(error => {
    //     dispatch(actionTypes.dataLoaded())
    //     console.log(error)
    //     payload.alert.warning('Unable to load data')
    //   })
  }
}

export const assignFeemanagementList = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.ReassignFeemanagement, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        payload.alert.success('Updated!')
        dispatch({
          type: ASSIGN_FEE_MANAGEMENT,
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

export const fetchFeePlanPerErp = (payload) => {
  // console.log(payload)
  return (dispatch) => {
    console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeePlanPerErp + '?erp=' + payload.erp + '&academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_FEE_PLANS_PER_ERP,
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
export const editStudentFee = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.EditStudentFeePlan, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 200) {
          payload.alert.success('Successfully Changed')
          dispatch({
            type: EDIT_STUDENT_FEE,
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
