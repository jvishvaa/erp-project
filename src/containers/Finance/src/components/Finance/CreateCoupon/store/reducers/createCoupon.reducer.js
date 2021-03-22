import * as actionTypes from '../../../store/actions/index'

const initialState = {
  newCoupon: [],
  couponList: [],
  couponAllList: []
}

const createCouponReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_COUPON : {
      let coupon = state.couponAllList
      let a = action.payload.data
      // let d = a && (a.valid_to).split('T')
      // if (d[1] < '12:00') {
      //   let b = a && a.valid_to.split('T').join('  (') + 'AM' + ')'
      //   a.valid_to = b
      // } else {
      //   let b = a && a.valid_to.split('T').join('  (') + 'PM' + ')'
      //   a.valid_to = b
      // }
      // let e = (a.valid_from).split('T')
      // if (e[1] < '12:00') {
      //   let c = a && a.valid_from.split('T').join('  (') + 'AM' + ')'
      //   a.valid_from = c
      // } else {
      //   let c = a && a.valid_from.split('T').join('  (') + 'PM' + ')'
      //   a.valid_from = c
      // }
      coupon.unshift(a)
      return {
        ...state,
        newCoupon: action.payload.data,
        couponAllList: coupon
      }
    }
    case actionTypes.LIST_COUPON : {
      return {
        ...state,
        couponList: action.payload.data
      }
    }
    case actionTypes.LIST_ALL_COUPON : {
      return {
        ...state,
        couponAllList: action.payload.data
      }
    }
    case actionTypes.COUPON_DETAIL_UPDATE : {
      let couList = state.couponAllList
      let index = couList.findIndex((index) => index.id === action.payload.data.id)
      couList[index] = action.payload.data
      return {
        ...state,
        couponAllList: couList
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}
export default createCouponReducer
