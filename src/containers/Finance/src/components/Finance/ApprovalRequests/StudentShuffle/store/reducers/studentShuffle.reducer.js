import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  pendingLists: [],
  studFeeDeatils: {},
  totalPaidAmount: 0,
  instLists: [],
  feePlans: [],
  reassignRes: false,
  approveLists: [],
  rejectedLists: [],
  rejectReqres: ''
}

const studentShuffleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SHUFFLE_PENDING_REQ : {
      return {
        ...state,
        pendingLists: action.payload.data
      }
    }
    case actionTypes.FETCH_STD_FEE_TYPE_DETAILS : {
      return {
        ...state,
        studFeeDeatils: action.payload.data,
        totalPaidAmount: action.payload.amount
      }
    }
    case actionTypes.FETCH_INST_LIST_PER_FEE_PAN : {
      return {
        ...state,
        instLists: action.payload.data
      }
    }
    case actionTypes.FETCH_FEE_PLANS_SHUFFLE : {
      return {
        ...state,
        feePlans: action.payload.data
      }
    }
    case actionTypes.REASSIGN_STUDENT_SHUFFLE : {
      return {
        ...state,
        reassignRes: true
      }
    }
    case actionTypes.CLEARING_REASSIGN_PROPS : {
      return {
        ...state,
        reassignRes: false,
        instLists: []
      }
    }
    case actionTypes.FETCH_SHUFFLE_APPROVAL_LISTS : {
      return {
        ...state,
        approveLists: action.payload.data
      }
    }
    case actionTypes.FETCH_SHUFFLE_REJECTED_LISTS : {
      return {
        ...state,
        rejectedLists: action.payload.data
      }
    }
    case actionTypes.REJECT_REQUEST_FOR_SHUFFLE : {
      return {
        ...state,
        rejectReqres: action.payload.data
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default studentShuffleReducer
