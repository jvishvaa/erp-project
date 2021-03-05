import axios from 'axios'
import { urls } from '../../../../../urls'
import * as actionTypes from '../../../store/actions/actions'

export const CREATE_COUPON = 'CREATE_COUPON'
export const LIST_COUPON = 'LIST_COUPON'
export const COUPON_DETAIL_UPDATE = 'COUPON_DETAIL_UPDATE'
export const LIST_ALL_COUPON = 'LIST_ALL_COUPON'

export const createCoupon = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.CreateCoupon, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: CREATE_COUPON,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        if (response.status === 201) {
          payload.alert.success('Coupon Created Successfully!')
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
export const listCoupon = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ListCoupon, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: LIST_COUPON,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
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
export const couponDetailUpdate = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.CouponDetailUpdate + payload.id + '/', payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: COUPON_DETAIL_UPDATE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        if (response.status === 200) {
          payload.alert.success('Coupon Updated Successfully!')
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

export const listAllCoupon = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ListAllCoupon, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: LIST_ALL_COUPON,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
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
