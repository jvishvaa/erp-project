import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  feeList: [],
  accToClassMapping: [],
  feeAccountsToBranch: []
}

const accToClassReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_FEE_TYPES: {
      return {
        ...state,
        feeList: action.payload.data
      }
    }
    case actionTypes.FETCH_CLASS_ACC_MAPPING: {
      return {
        ...state,
        accToClassMapping: action.payload.data
      }
    }
    case actionTypes.FETCH_FEE_ACC_TO_BRANCH: {
      return {
        ...state,
        feeAccountsToBranch: action.payload.data
      }
    }
    case actionTypes.ADD_FEE_ACC_TO_CLASS: {
      const newAccToClassMapping = [...state.accToClassMapping]
      const index = newAccToClassMapping.findIndex(ele => {
        return ele.id === action.payload.data.gradeId
      })
      const classMap = { ...newAccToClassMapping[index] }
      classMap.fee_account_name = {
        id: action.payload.data.id,
        fee_account_name: action.payload.data.name
      }
      newAccToClassMapping[index] = classMap
      return {
        ...state,
        accToClassMapping: newAccToClassMapping
      }
    }
    case actionTypes.DELETE_CLASS_ACC_MAPPING: {
      const newAccToClassMapping = [...state.accToClassMapping]
      const index = newAccToClassMapping.findIndex(ele => {
        return ele.id === action.payload.data.gradeId
      })
      const classMap = { ...newAccToClassMapping[index] }
      classMap.fee_account_name = null
      newAccToClassMapping[index] = classMap
      return {
        ...state,
        accToClassMapping: newAccToClassMapping
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default accToClassReducer
