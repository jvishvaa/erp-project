import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  internalshuffleDetails: [],
  externalshuffleDetails: []
}

const studentShuffleReportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_INTERNAL_SHUFFLE : {
      console.log('qwerty', action.payload.data)
      return {
        ...state,
        internalshuffleDetails: action.payload.data
      }
    }
    case actionTypes.FETCH_EXTERNAL_SHUFFLE : {
      console.log('qwerty', action.payload.data)
      return {
        ...state,
        externalshuffleDetails: action.payload.data
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default studentShuffleReportsReducer
