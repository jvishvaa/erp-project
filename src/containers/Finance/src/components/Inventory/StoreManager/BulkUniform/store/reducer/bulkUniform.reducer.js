import * as actionTypes from '../../../../store/actions'

const initialState = {
  bulkUniList: []
}

const bulkUniformReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BULK_UNI: {
      return {
        ...state,
        bulkUniList: action.payload.data
      }
    }
    case actionTypes.SEND_EACH_UNI: {
      const newList = [...state.bulkUniList]
      const index = newList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })

      newList[index] = { ...action.payload.data }
      return {
        ...state,
        bulkUniList: newList
      }
    }
    case actionTypes.SEND_BULK_UNI: {
      // const newList = [...state.bulkUniList]
      return {
        ...state,
        bulkUniList: action.payload.data
      }
    }
    case actionTypes.CLEAR_ALL_SIZE: {
      // const newList = [...state.bulkUniList]
      return {
        ...state,
        bulkUniList: []
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default bulkUniformReducer
