import * as actionTypes from '../../../../store/actions'

const initialState = {
  itemsList: [],
  colorsList: [],
  kitList: [],
  itemsListKitWise: []
}

const adminKitReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LIST_COLOR_ITEMS: {
      const itemsList = action.payload.item
      const colorsList = action.payload.color
      return {
        ...state,
        colorsList,
        itemsListKitWise: itemsList
      }
    }
    case actionTypes.CREATE_COLOR_KIT: {
      const updatedColors = [...state.colorsList]
      updatedColors.push(action.payload.data)
      return {
        ...state,
        colorsList: updatedColors
      }
    }
    case actionTypes.LIST_GRADE_KIT : {
      return {
        ...state,
        kitList: action.payload.data
      }
    }
    case actionTypes.CREATE_GRADE_KIT: {
      const kitList = [ action.payload.data, ...state.kitList ]
      return {
        ...state,
        kitList
      }
    }
    case actionTypes.UPDATE_GRADE_KIT: {
      const newKitList = [...state.kitList]
      const index = newKitList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      newKitList[index] = { ...action.payload.data }
      return {
        ...state,
        kitList: newKitList
      }
    }
    case actionTypes.DELETE_GRADE_KIT: {
      const kitList = [...state.kitList].filter(item => item.id !== action.id)
      return {
        ...state,
        kitList
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default adminKitReducer
