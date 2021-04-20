import * as actionTypes from '../../../../../store/actions/index'

const initialState = {
  allTransactions: null,
  editTrans: null,
  refresh: false,
  transId: null
}

const accountantPaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ACCOUNTANT_TRANSACTIONS: {
      return {
        ...state,
        allTransactions: action.payload.data,
        refresh: false
      }
    }
    case actionTypes.EDIT_ACCOUNTANT_TRANSACTIONS: {
      // const a = state.allTransactions
      // let index = a.results.findIndex((val) => +val.transaction_id === +action.payload.data.transaction_id)
      // a.results[index].is_raised_for_cancellation = action.payload.data.is_wrong_payment
      return {
        ...state,
        editTrans: action.payload.data
        // allTransactions: a
      }
    }
    case actionTypes.UPDATE_ACCOUNTANT_TRANSACTIONS: {
      // let a = null
      // if (action.payload.data2) {
      //   a = state.allTransactions
      //   let index = a.results.findIndex((val) => +val.transaction_id === +action.payload.data.transaction_id)
      //   a.results[index].is_cancelled = true
      // }
      // jj
      // const newAllTransactions = [...state.allTransactions]
      // const index = newAllTransactions.findIndex(ele => {
      //   return ele.transaction_id === action.payload.data.transaction_id
      // })
      // const changeObj = { ...newAllTransactions[index] }
      // changeObj.date_of_payment = action.payload.data.date_of_payment ? action.payload.data.date_of_payment : changeObj.date_of_payment
      // changeObj.RecepitNo = action.payload.data.RecepitNo ? action.payload.data.RecepitNo : changeObj.RecepitNo
      // newAllTransactions[index] = { ...changeObj }
      return {
        ...state,
        // allTransactions: newAllTransactions,
        // allTransactions: a
        refresh: action.payload.refresh,
        transId: action.payload.data.transaction_id
      }
    }
    default: {
      return { ...state }
    }
  }
}

export default accountantPaymentReducer
