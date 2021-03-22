import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  studentErpList: []
}

const studentLedgerTabReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STUDENT_ERP_SEARCH: {
      return {
        ...state,
        studentErpList: action.payload.data
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}
export default studentLedgerTabReducer
