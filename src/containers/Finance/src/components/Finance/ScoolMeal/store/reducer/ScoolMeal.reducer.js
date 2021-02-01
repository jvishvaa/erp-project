import * as actionTypes from '../../../store/actions/index'

const initialState = {
  termsList: []
}

const scoolMealReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TERM_LIST: {
      return {
        ...state,
        termsList: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default scoolMealReducer
