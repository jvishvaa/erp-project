import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  feeConcessionList: [],
  otherFeeConList: []
}

const concessionDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FEE_CONCESSION_DETAILS : {
      return {
        ...state,
        feeConcessionList: action.payload.data
      }
    }
    case actionTypes.OTHER_FEE_CONCESSION_DETAILS : {
      return {
        ...state,
        otherFeeConList: action.payload.data
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default concessionDetailsReducer
