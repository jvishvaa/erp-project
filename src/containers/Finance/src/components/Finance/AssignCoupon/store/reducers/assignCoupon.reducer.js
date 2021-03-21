import * as actionTypes from '../../../store/actions/index'

const initialState = {
  erpList: [],
  erpAssignedCoupon: [],
  assignErp: [],
  couponHistory: [],
  erpIdDelete: []
}

const assignCouponReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ERP_LIST : {
      let notAssign = [...action.payload.data.not_assign]
      let assign = [...action.payload.data.assign_data]
      let allErp = []
      allErp.push(assign)
      allErp.push(notAssign)
      // Array.prototype.push.apply(assign, notAssign)
      // console.log('erp', assign)
      // let a = [...new Set(assign)]
      // let a = assign
      // let b = []
      // a.map((val) => val).forEach((e) => {
      //   a.map((w) => {
      //     if ((w.student && w.student.erp) === (e.student && e.student.erp) && +w.createdAt > +e.createdAt) {
      //       b.push(w)
      //     }
      //   })
      // })
      // for (let i = 0; i < a.length; i++) {
      //   if ((a[i].student && a[i].student.erp) === (a[i + 1].student && a[i + 1].student.erp) && (+a[i].createdAt > +a[i + 1].createdAt)) {
      //     b.push(a[i])
      //   }
      // }
      // console.log('b++', b)
      // console.log('a', a)
      return {
        ...state,
        erpList: notAssign,
        assignErp: assign
      }
    }
    case actionTypes.COUPON_ASSIGNED : {
      const studentList = [...state.erpList]
      console.log('student', studentList)
      action.payload.data && action.payload.data.map((val) => val.student.erp).forEach((s) => {
        let index = studentList.findIndex((item) => {
          if (item.erp) {
            return (
              item.erp === s
            )
          } else {
            return (
              item.student.erp === s
            )
          }
        })
        let index2 = action.payload.data.findIndex(item => item.student.erp === s)
        console.log('index', index)
        console.log('index2', index2)
        if (index !== -1) {
          studentList[index] = action.payload.data[index2]
        }
      })
      console.log('studentList', studentList)
      return {
        ...state,
        erpList: studentList,
        erpAssignedCoupon: action.payload.data
      }
    }
    case actionTypes.COUPON_REASSIGNED : {
      const studentList = [...state.assignErp]
      console.log('student', studentList)
      action.payload.data && action.payload.data.assign_data.map((val) => val.student.erp).forEach((s) => {
        let index = studentList.findIndex((item) => {
          if (item.erp) {
            return (
              item.erp === s
            )
          } else {
            return (
              item.student.erp === s
            )
          }
          // if (item.student && item.student.erp) {
          //   return (
          //     item.student.erp === s
          //   )
          // }
        })
        let index2 = action.payload.data.assign_data.findIndex(item => item.student.erp === s)
        console.log('index', index)
        console.log('index2', index2)
        if (index !== -1) {
          studentList[index] = action.payload.data.assign_data[index2]
        }
      })
      console.log('studentList', studentList)
      return {
        ...state,
        assignErp: studentList,
        erpAssignedCoupon: action.payload.data
      }
    }
    case actionTypes.COUPON_DELETE : {
      console.log('delete', action.payload.data)
      const a = [...state.assignErp]
      console.log('1st', a)
      let idToDelete = action.payload.data.id
      console.log('2st', idToDelete)
      let ids = idToDelete.split(',')
      console.log('id++', ids)
      ids.forEach((val) => {
        a.map((e) => {
          if (+e.id === +val) {
            let index = a.indexOf(e)
            a.splice(index, 1)
          }
        })
      })
      return {
        ...state,
        erpIdDelete: action.payload.data,
        assignErp: a
      }
    }
    case actionTypes.COUPON_HISTORY : {
      return {
        ...state,
        couponHistory: action.payload.data
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}
export default assignCouponReducer
