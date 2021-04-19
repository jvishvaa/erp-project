import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  studentList: [],
  listDelieveryCharge: [],
  assignedDelieveryErp: []
}

const assignDelieveryChargeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_DELIEVERY_ERP : {
      let notAssign = [...action.payload.data.not_assign]
      let assign = [...action.payload.data.assign_data]
      let allErp = []
      allErp.push(...assign)
      allErp.push(...notAssign)
      return {
        ...state,
        studentList: allErp
      }
    }
    case actionTypes.FETCH_ALL_DELIEVERY_CHARGE : {
      return {
        ...state,
        listDelieveryCharge: action.payload.data
      }
    }
    case actionTypes.ASSIGN_DELIEVERY_CHARGE : {
      const studentLists = [...state.studentList]
      action.payload.data && action.payload.data.map((val) => val.student.erp).forEach((s) => {
        let index = studentLists.findIndex((item) => {
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

        if (index !== -1) {
          studentLists[index] = action.payload.data[index2]
        }
      })
      return {
        ...state,
        assignedDelieveryErp: action.payload.data,
        studentList: studentLists
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default assignDelieveryChargeReducer
