import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  countPostDate: null,
  postDatedList: [],
  branchData: null,
  branchList: [],
  switchBranchStatus: null,
  checkReturn: true
}

const financeDashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_POST_DATE_COUNT : {
      return {
        ...state,
        countPostDate: action.payload.data
      }
    }
    case actionTypes.FETCH_RECENT_CHEQUES : {
      return {
        ...state,
        postDatedList: action.payload.data
      }
    }
    case actionTypes.FETCH_ACCOUNTANT_BRANCH : {
      return {
        ...state,
        branchData: action.payload.data
      }
    }
    case actionTypes.FETCH_BRANCH : {
      return {
        ...state,
        branchList: action.payload.data
      }
    }
    case actionTypes.SWITCH_BRANCH : {
      return {
        ...state,
        switchBranchStatus: action.payload.data
      }
    }
    case actionTypes.CHECK_RETURN : {
      return {
        ...state,
        checkReturnStatus: action.payload.data
      }
    }
    case actionTypes.RETURN_ADMIN : {
      return {
        ...state,
        returnAdminData: action.payload.data
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default financeDashboardReducer
