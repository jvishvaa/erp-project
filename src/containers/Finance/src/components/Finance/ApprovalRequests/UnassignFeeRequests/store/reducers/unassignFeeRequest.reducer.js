import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  feeRequestLists: [],
  pendingReqList: [],
  approvalReqList: [],
  rejectedReqList: [],
  session: null,
  branch: null
}

const unassignRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_UNASSIGNED_REQUEST_LIST : {
      return {
        ...state,
        feeRequestLists: action.payload.data,
        session: action.payload.session,
        branch: action.payload.branch
      }
    }
    case actionTypes.FETCH_PENDING_REQ_LIST : {
      console.log('reducers', action.payload.data)
      return {
        ...state,
        pendingReqList: action.payload.data
      }
    }
    case actionTypes.APPROVE_UNASSIGN_FEE_LIST : {
      const requestList = [...state.pendingReqList]
      const newList = requestList.filter(ele => {
        return ele.id !== action.payload.id
      })
      return {
        ...state,
        pendingReqList: newList
      }
    }

    case actionTypes.REJECT_UNASSIGN_FEE_LIST : {
      const requestList = [...state.pendingReqList]
      const newList = requestList.filter(ele => {
        return ele.id !== action.payload.id
      })
      return {
        ...state,
        pendingReqList: newList
      }
    }
    case actionTypes.FETCH_APPROVAL_REQ_LIST : {
      return {
        ...state,
        approvalReqList: action.payload.data
      }
    }
    case actionTypes.FETCH_REJECTED_REQ_LIST : {
      return {
        ...state,
        rejectedReqList: action.payload.data
      }
    }
    case actionTypes.CLEAR_UNASSIGN_PROPS : {
      return {
        ...state,
        feeRequestLists: []
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default unassignRequestReducer
