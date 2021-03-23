import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  feeStructurelist: []
}

const studentFeeStructureReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STUDENT_FEE_STRUCTURE_LIST: {
      return {
        ...state,
        feeStructurelist: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default studentFeeStructureReducer
