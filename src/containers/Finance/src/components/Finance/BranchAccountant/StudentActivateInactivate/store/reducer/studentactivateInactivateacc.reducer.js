import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  activeStudentList: [],
  inactiveStudentList: [],
  feeStructure: []
}

const studentactivateInactivateaccReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ACTIVE_STUDENT_DETAILS : {
      return {
        ...state,
        activeStudentList: action.payload.data
      }
    }
    case actionTypes.GET_INACTIVE_STUDENT_DETAILS : {
      return {
        ...state,
        inactiveStudentList: action.payload.data
      }
    }
    case actionTypes.FETCH_ALL_PAYMENT : {
      return {
        ...state,
        feeStructure: action.payload.data
      }
    }
    case actionTypes.POST_STUDENT_ACTIVATE : {
      const newactiveStudentList = [...state.activeStudentList]
      const newinactiveStudentList = [...state.inactiveStudentList]
      const postactiveStudentList = newactiveStudentList.filter(list => {
        return list.id !== action.payload.data.student
      })
      const postinactiveStudentList = newinactiveStudentList.filter(list => {
        return list.id !== action.payload.data.student
      })
      return {
        ...state,
        activeStudentList: postactiveStudentList,
        inactiveStudentList: postinactiveStudentList
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}
export default studentactivateInactivateaccReducer
