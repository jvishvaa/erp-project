import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  miscList: [],
  studentMiscFee: [],
  miscDetails: null
}

const currFeeTypeAccReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_MISC_FEE_LIST : {
      return {
        ...state,
        miscList: action.payload.data
      }
    }
    case actionTypes.FETCH_STUDENT_MISC_DETAILS : {
      return {
        ...state,
        studentMiscFee: action.payload.data
      }
    }
    case actionTypes.FETCH_MISC_DETAILS : {
      return {
        ...state,
        miscDetails: action.payload.data
      }
    }
    case actionTypes.SAVE_STUDENT_MISC : {
      const newstudentMiscFee = [...state.studentMiscFee]
      const index = newstudentMiscFee.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      if (index !== -1) {
        newstudentMiscFee[index] = { ...action.payload.data }
        return {
          ...state,
          studentMiscFee: newstudentMiscFee
        }
      } else {
        // newstudentMiscFee.push(action.payload.data)
        const studentMiscFee = [ action.payload.data, ...state.studentMiscFee ]
        return {
          ...state,
          studentMiscFee
        }
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default currFeeTypeAccReducer
