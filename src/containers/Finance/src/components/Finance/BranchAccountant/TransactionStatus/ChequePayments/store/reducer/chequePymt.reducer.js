import * as actionTypes from '../../../../../store/actions/index'

const initialState = {
  allChequeTransactions: null,
  chequeBounceData: null,
  sentData: false,
  total: null
}

const accountantChequePaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ACCOUNTANT_CHEQUE_TRANSACTIONS: {
      return {
        ...state,
        allChequeTransactions: action.payload.data,
        total: action.payload.total
      }
    }
    case actionTypes.FETCH_CHEQUE_BOUNCE: {
      return {
        ...state,
        chequeBounceData: action.payload.data
      }
    }
    case actionTypes.SAVE_CHEQUE_BOUNCE: {
      const chequeTrans = [...state.allChequeTransactions]
      // const newCheque = [...chequeTrans.results]
      console.log('reducer: ', chequeTrans)
      const index = chequeTrans.findIndex(ele => {
        return +ele.transaction_id === +action.payload.data.transaction_id
      })
      console.log('index: ', index)
      const changeObj = { ...chequeTrans[index] }
      changeObj.is_bounced = action.payload.data.is_bounced ? action.payload.data.is_bounced : null
      chequeTrans[index] = { ...changeObj }
      // chequeTrans = [...chequeTrans]
      console.log('cheque: ', chequeTrans[index])
      return {
        ...state,
        allChequeTransactions: chequeTrans
      }
    }
    default: {
      return { ...state }
    }
  }
}

export default accountantChequePaymentReducer
