import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  activeRequstList: { reactive: [], inactive: [] },
  inActiveRequestList: null,
  activeCount: null,
  inactiveCount: null,
  switchBranchAdminData: null,
  onlinePendingAdmissionData: []
}

const financeAdminDashBoardReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ACTIVE_REQUEST : {
      return {
        ...state,
        activeRequstList: action.payload.data
      }
    }
    case actionTypes.GET_INACTIVE_REQUEST : {
      return {
        ...state,
        inActiveRequestList: action.payload.data
      }
    }
    case actionTypes.APPROVE_REQUEST : {
      const newactiveRequstList = [...state.activeRequstList.reactive]
      const newInactivateRequestList = [...state.activeRequstList.inactive]
      let putactiveRequstList = newactiveRequstList
      let putinactiveRequstList = newInactivateRequestList
      if (action.payload.data.is_active_request === true) {
        putactiveRequstList = newactiveRequstList.filter(list => {
          return list.student.id !== action.payload.data.student
        })
      } else if (action.payload.data.is_active_request === false) {
        putinactiveRequstList = newInactivateRequestList.filter(list => {
          return list.student.id !== action.payload.data.student
        })
      }
      return {
        ...state,
        activeRequstList: { reactive: putactiveRequstList, inactive: putinactiveRequstList }
      }
    }
    case actionTypes.GET_STUDENT_COUNT_ACTIVE : {
      return {
        ...state,
        activeCount: action.payload.data
      }
    }
    case actionTypes.GET_STUDENT_COUNT_INACTIVE : {
      return {
        ...state,
        inactiveCount: action.payload.data
      }
    }
    case actionTypes.SWITCH_BRANCH_ADMIN : {
      return {
        ...state,
        switchBranchAdminData: action.payload.data
      }
    }
    case actionTypes.PENDING_ADMISSION : {
      return {
        ...state,
        onlinePendingAdmissionData: action.payload.data
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}
export default financeAdminDashBoardReducer
