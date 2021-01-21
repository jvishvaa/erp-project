import * as actionTypes from '../../../store/actions/index'

const initialState = {
  receiptSettingsList: []
}

const receiptSettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIPT_SETTINGS_LIST: {
      return {
        ...state,
        receiptSettingsList: action.payload.data
      }
    }
    case actionTypes.RECEIPT_SETTINGS_EDIT: {
      const editList = [...state.receiptSettingsList]
      const index = editList.findIndex(ele => {
        return ele.id === action.payload.data.id
      }
      )
      editList[index] = { ...action.payload.data }
      return {
        ...state,
        receiptSettingsList: editList
      }
    }
    default: {
      return {
        ...state
      }
    }
    case actionTypes.RECEIPT_SETTINGS_ADD: {
      const addList = [...state.receiptSettingsList, action.payload.data]
      return {
        ...state,
        receiptSettingsList: addList
      }
    }
    case actionTypes.RECEIPT_SETTINGS_DELETE: {
      const delList = [...state.receiptSettingsList]
      const newList = delList.filter(ele => {
        return ele.id !== action.payload.id
      })
      return {
        ...state,
        receiptSettingsList: newList
      }
    }
  }
}

export default receiptSettingsReducer
