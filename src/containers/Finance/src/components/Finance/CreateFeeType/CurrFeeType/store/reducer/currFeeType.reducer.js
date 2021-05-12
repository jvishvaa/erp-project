import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  currList: []
}

const currFeeTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CURR_FEE: {
      return {
        ...state,
        currList: action.payload.data
      }
    }
    case actionTypes.ADD_CURR_FEE: {
      const newCurrList = [...state.currList]
      newCurrList.unshift(action.payload.data)
      return {
        ...state,
        currList: newCurrList
      }
    }
    case actionTypes.UPDATE_CURR_FEE: {
      const newCurrList = [...state.currList]
      const index = newCurrList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      newCurrList[index] = { ...action.payload.data }
      return {
        ...state,
        currList: newCurrList
      }
    }
    case actionTypes.DELETE_CURR_FEE: {
      const currList = [...state.currList].filter(item => +item.id !== +action.payload.data.id)
      return {
        ...state,
        currList
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default currFeeTypeReducer
