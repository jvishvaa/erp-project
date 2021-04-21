import * as actionTypes from '../../../../store/actions'

const initialState = {
  storeSubCat: [],
  measurementsList: [],
  colorsList: [],
  itemsList: []
}

const schoolStoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LIST_UNIT_COLOR_SUBCAT: {
      return {
        ...state,
        measurementsList: action.payload.measurement,
        colorsList: action.payload.color,
        storeSubCat: action.payload.subCat
      }
    }
    case actionTypes.CREATE_MEASUREMENT: {
      const updatedMeas = [...state.measurementsList]
      updatedMeas.push(action.payload.data)
      return {
        ...state,
        measurementsList: updatedMeas
      }
    }
    case actionTypes.CREATE_COLOR: {
      const updatedColors = [...state.colorsList]
      updatedColors.push(action.payload.data)
      return {
        ...state,
        colorsList: updatedColors
      }
    }
    case actionTypes.CREATE_SUBCAT: {
      const updatedSubcat = [...state.storeSubCat]
      updatedSubcat.push(action.payload.data)
      return {
        ...state,
        storeSubCat: updatedSubcat
      }
    }
    case actionTypes.ADD_ITEM: {
      const updatedItem = [action.payload.data, ...state.itemsList]
      // updatedItem.push(action.payload.data)
      return {
        ...state,
        itemsList: updatedItem
      }
    }
    case actionTypes.LIST_ITEMS: {
      return {
        ...state,
        itemsList: action.payload.data
      }
    }
    case actionTypes.UPDATE_ITEMS: {
      const lists = [...state.itemsList]
      const index = lists.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      lists[index] = action.payload.data
      return {
        ...state,
        itemsList: lists
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default schoolStoreReducer
