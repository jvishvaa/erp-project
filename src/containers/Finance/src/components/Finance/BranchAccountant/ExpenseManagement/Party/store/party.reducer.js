import * as actionTypes from '../../../../store/actions'

const inititalStore = {
  partyList: []
}

const partyReducer = (state = inititalStore, action) => {
  switch (action.type) {
    case actionTypes.PARTY_LIST: {
      return {
        ...state,
        partyList: action.payload.data
      }
    }
    case actionTypes.SAVE_PARTY: {
      const partyList = [...state.partyList]
      partyList.unshift({ ...action.payload.data })
      return {
        ...state,
        partyList
      }
    }
    case actionTypes.EDIT_PARTY: {
      const partyList = [...state.partyList]
      const index = partyList.findIndex(item => +item.id === +action.payload.data.id)
      partyList[index] = { ...action.payload.data }
      return {
        ...state,
        partyList
      }
    }
    case actionTypes.DELETE_PARTY: {
      const partyList = state.partyList.filter(item => +item.id !== +action.payload.data)
      return {
        ...state,
        partyList
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default partyReducer
