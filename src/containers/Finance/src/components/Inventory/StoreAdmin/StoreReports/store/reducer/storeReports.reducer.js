import * as actionTypes from '../../../../store/actions'

const initialState = {
  storeReportList: [],
  branchList: []
}

const storeReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_STORE_REPORT: {
      return {
        ...state,
        storeReportList: action.payload.data
      }
    }
    case actionTypes.BRANCHS_LISTS: {
      return {
        ...state,
        branchList: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default storeReportReducer
