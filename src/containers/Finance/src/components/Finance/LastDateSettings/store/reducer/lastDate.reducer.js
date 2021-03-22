import * as actionTypes from '../../../store/actions'

const initialState = {
  concessionLastDateList: [],
  backDateList: [],
  partialPayment: []
}

const lastDateReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONCESSION_LASTDATE: {
      return {
        ...state,
        concessionLastDateList: action.payload.data
      }
    }
    case actionTypes.SAVE_CONCESSION_LASTDATE: {
      const editConcessionList = [...state.concessionLastDateList]
      editConcessionList.map((ele, i) => {
        // this.state.concessionLastDateList.forEach(element => {
        if (ele.id === action.payload.data.id) {
          const changeObj = { ...editConcessionList[i] }
          changeObj.concession_last_date = action.payload.data.concession_last_date ? action.payload.data.concession_last_date : null
          editConcessionList[i] = { ...changeObj }
        }
        // })
      })
      return {
        ...state,
        concessionLastDateList: editConcessionList
      }
    }
    case actionTypes.FETCH_BACK_DATE: {
      return {
        ...state,
        backDateList: action.payload.data
      }
    }
    case actionTypes.PARTIAL_PAYMENT_LIST: {
      return {
        ...state,
        partialPayment: action.payload.data
      }
    }
    case actionTypes.SAVE_PARTIAL_PAYMENT_LASTDATE: {
      return {
        ...state,
        partialPayment: [action.payload.data]

      }
    }
    case actionTypes.SAVE_BACK_DATE: {
      // const editBackDateList = [...state.backDateList]
      // editBackDateList.map((ele, i) => {
      // this.state.backDateList.forEach(element => {
      // if (ele.id === action.payload.data.id) {
      //   const changeObj = { ...editBackDateList[i] }
      //   changeObj.payments_back_date = action.payload.data.payments_back_date ? action.payload.data.payments_back_date : null
      //   changeObj.petty_cash_back_date = action.payload.data.petty_cash_back_date ? action.payload.data.petty_cash_back_date : null
      //   editBackDateList[i] = { ...changeObj }
      // }
      // })
      // })
      return {
        ...state,
        partialPayment: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default lastDateReducer
