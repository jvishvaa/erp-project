import axios from 'axios'
import { urls } from '../../../../../urls'
import * as actionTypes from '../../../store/actions/actions'

export const ERP_LIST = 'ERP_LIST'
export const COUPON_ASSIGNED = 'COUPON_ASSIGNED'
export const COUPON_REASSIGNED = 'COUPON_REASSIGNED'
export const COUPON_DELETE = 'COUPON_DELETE'
export const COUPON_HISTORY = 'COUPON_HISTORY'

export const fetchErpList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.StudentAssignCoupon + '?academic_year=' + payload.session + '&branch_id=' + payload.branch + '&grade_id=' + payload.grade + '&section=' + payload.section, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ERP_LIST,
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
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(error)
      })
  }
}
export const couponAssignedToStudent = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.CouponAssignedToStudent, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: COUPON_ASSIGNED,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        if (response.status === 201) {
          payload.alert.success('Coupon Assigned Successfully!')
        }
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(error)
      })
  }
}
export const couponReAssignedToStudent = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.CouponReassign, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: COUPON_REASSIGNED,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        if (response.status === 200) {
          payload.alert.success('Coupon ReAssigned Successfully!')
        }
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.data && error.response.data.err_msg && (error.response.status === 400 || error.response.status === 404)) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(error)
      })
  }
}
export const couponDelete = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .delete(urls.CouponDelete + '?id=' + payload.id, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: COUPON_DELETE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        if (response.status === 200) {
          payload.alert.success('Deleted Successfully!')
        }
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        if (error.response && error.response.status === 400) {
          payload.alert.warning(error.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(error)
      })
  }
}
export const erpCouponHistory = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ErpcouponHistory + '?erp=' + payload.erp, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: COUPON_HISTORY,
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
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(error)
      })
  }
}
