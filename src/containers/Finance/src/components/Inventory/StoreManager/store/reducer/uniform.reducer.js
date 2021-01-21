
// import * as actionTypes from '../../../../../../store/actions'
import * as actionTypes from '../../../store/actions'

const initialState = {
  uniformDetails: []
}

const studentUniformReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STUDENT_UNIFORM_DETAILS: {
      return {
        ...state,
        uniformDetails: action.payload.data
      }
    }
    case actionTypes.STUDENT_UNIFORM_DETAILS_UPDATE: {
      return {
        ...state,
        uniformDetails: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}
export default studentUniformReducer
