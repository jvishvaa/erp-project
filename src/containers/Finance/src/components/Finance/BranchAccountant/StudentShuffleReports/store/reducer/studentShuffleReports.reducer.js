import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  internalshuffleDetails: [],
  externalshuffleDetails: []
}

const studentShuffleReportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_INTERNAL_SHUFFLE : {
      return {
        ...state,
        internalshuffleDetails: action.payload.data
      }
    }
    case actionTypes.FETCH_EXTERNAL_SHUFFLE : {
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
