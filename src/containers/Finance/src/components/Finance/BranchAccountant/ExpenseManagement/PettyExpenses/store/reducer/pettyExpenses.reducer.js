import * as actionTypes from '../../../../store/actions'

const intialState = {
  pettyCashAccounts: [],
  ledgerHeadList: [],
  ledgerNameList: [],
  pettyCashAccountsList: [],
  partyList: [],
  ledgerReportList: [],
  cashInHand: 0,
  bankStatements: null,
  financialLedgerReport: null,
  cashStatements: null,
  receiptHeader: null
}

const pettyExpensesReducer = (state = intialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PETTY_CASH_ACC: {
      return {
        ...state,
        pettyCashAccounts: action.payload.data
      }
    }
    case actionTypes.FETCH_LEDGER_RECORD: {
      return {
        ...state,
        ledgerHeadList: action.payload.data
      }
    }
    case actionTypes.FETCH_LEDGER_NAME: {
      return {
        ...state,
        ledgerNameList: action.payload.data
      }
    }
    case actionTypes.LIST_PETTY_CASH: {
      return {
        ...state,
        pettyCashAccountsList: action.payload.data
      }
    }
    case actionTypes.FETCH_PARTY_LIST: {
      return {
        ...state,
        partyList: action.payload.data
      }
    }
    case actionTypes.FETCH_LEDGER_REPORT: {
      return {
        ...state,
        ledgerReportList: action.payload.data
      }
    }
    case actionTypes.LIST_CASH_OPENING_BALANCE: {
      return {
        ...state,
        cashInHand: action.payload.data.cash_in_hand
      }
    }
    case actionTypes.CASH_WITHDRAW: {
      return {
        ...state,
        cashInHand: (+state.cashInHand) + (+action.payload.data.amount)
      }
    }
    case actionTypes.FETCH_BANK_STATEMENT: {
      return {
        ...state,
        bankStatements: action.payload.data
      }
    }
    case actionTypes.FETCH_CASH_STATEMENT: {
      return {
        ...state,
        cashStatements: action.payload.data
      }
    }
    case actionTypes.SET_TXN_ACTIVE_INACTIVE: {
      const ledgerReportList = { ...state.ledgerReportList }
      const results = [...ledgerReportList.results]
      const index = results.findIndex(item => +item.id === +action.payload.data.id)
      results[index] = action.payload.data
      ledgerReportList.results = results
      console.log('STATUS', ledgerReportList, index)
      return {
        ...state,
        ledgerReportList: ledgerReportList
      }
    }
    case actionTypes.FETCH_FINANCIAL_LEDGER_REPORT: {
      return {
        ...state,
        financialLedgerReport: action.payload.data
      }
    }
    case actionTypes.VOUCHER_RECEIPT_HEADERS: {
      return {
        ...state,
        receiptHeader: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default pettyExpensesReducer
