import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  shuffleDetails: [],
  redirect: false
}

const studentShuffleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_STUDENT_SHUFFLE : {
      return {
        ...state,
        shuffleDetails: action.payload.data,
        redirect: false
      }
    }
    case actionTypes.SEND_APPROVE_REJECT : {
      // const newStudentList = [...state.shuffleDetails]
      // console.log('the copied list: ', newStudentList)
      const newStudentList = state.shuffleDetails.filter((row) => row.id !== action.payload.data.id)
      console.log('filtered list: ', newStudentList)
      return {
        ...state,
        shuffleDetails: newStudentList
      }
    }
    case actionTypes.INITIATE_STUDENT_SHUFFLE : {
      return {
        ...state,
        redirect: true
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default studentShuffleReducer
