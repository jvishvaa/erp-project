import * as actionTypes from '../../../../store/actions'

const initialState = {
  vedioUrl: []
}

const uniformVedioReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BULK_UNI: {
      return {
        ...state,
        vedioUrl: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default uniformVedioReducer
