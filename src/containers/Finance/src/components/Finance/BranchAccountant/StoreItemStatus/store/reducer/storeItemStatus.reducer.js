import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  orderStatusList: [],
  dispatchList: [],
  redirect: false
}

const storeItemStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ORDER_STATUS : {
      return {
        ...state,
        orderStatusList: action.payload.data
      }
    }
    case actionTypes.FETCH_DISPATCH_DETAILS : {
      return {
        ...state,
        dispatchList: action.payload.data
      }
    }
    case actionTypes.SEND_EXCHANGE_DETAILS : {
      const newObj = { ...state.orderStatusList }
      const newList = [ ...newObj.results ]
      const index = newList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      newList[index] = { ...action.payload.data }
      newObj.results = [ ...newList ]
      return {
        ...state,
        orderStatusList: newObj
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default storeItemStatusReducer
