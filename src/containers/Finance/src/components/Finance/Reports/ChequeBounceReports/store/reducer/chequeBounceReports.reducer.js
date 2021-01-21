import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  chequeBounceReportList: null,
  showBounce: false,
  downloadBounce: null
}

const ChequeBounceReportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHEQUE_BOUNCE_LIST_REPORTS: {
      return {
        ...state,
        chequeBounceReportList: action.payload.data,
        showBounce: true
      }
    }
    case actionTypes.DOWNLOAD_CHEQUE_BOUNCE_REPORTS: {
      return {
        ...state
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default ChequeBounceReportsReducer
