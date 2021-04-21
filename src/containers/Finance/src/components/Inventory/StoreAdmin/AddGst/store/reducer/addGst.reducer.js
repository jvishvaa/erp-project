import * as actionTypes from '../../../../store/actions'

const initialState = {
  gstList: []
}

const addGstReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_GST_LIST: {
      return {
        ...state,
        gstList: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default addGstReducer
