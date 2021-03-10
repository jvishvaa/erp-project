import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  studentErp: null,
  studentStatus: null
}

const changeStudentStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_STUDENT_STATUS : {
      return {
        ...state,
        studentStatus: action.payload.data
      }
    }
    case actionTypes.UPDATE_STUDENT_STATUS : {
      console.log('clicked')
      return {
        ...state
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}
export default changeStudentStatusReducer
