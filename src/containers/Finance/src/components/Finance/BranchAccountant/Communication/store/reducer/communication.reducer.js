import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  studentList: null,
  defaultersStudentList: null
}

const communicationSmsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_STU_LIST : {
      return {
        ...state,
        studentList: action.payload.data
      }
    }
    case actionTypes.FETCH_FEE_DEFAULTER : {
      return {
        ...state,
        defaultersStudentList: action.payload.data
      }
    }
    case actionTypes.CLEAR_DEFAULTERS_LIST : {
      return {
        ...state,
        defaultersStudentList: null
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default communicationSmsReducer
