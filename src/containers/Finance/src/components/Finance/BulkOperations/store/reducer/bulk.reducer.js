import * as actionTypes from '../../../store/actions'
// import { VideoLabel } from '@material-ui/icons'

const initialState = {
  branchList: [],
  reportStatusList: null,
  bulkReportList: []
}

const bulkReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.BRANCH_LISTING: {
      return {
        ...state,
        branchList: action.payload.data
      }
    }
    case actionTypes.BULK_REPORT_STATUS: {
      return {
        ...state,
        reportStatusList: action.payload.data
      }
    }
    case actionTypes.BULK_REPORT_LIST: {
      return {
        ...state,
        bulkReportList: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default bulkReducer
