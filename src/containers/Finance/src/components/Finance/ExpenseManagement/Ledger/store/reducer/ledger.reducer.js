import * as actionTypes from '../../../../store/actions'

const initialState = {
  ledgerList: [],
  ledgerTypeList: []
}

const ledgerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_LEDGER_LIST: {
      return {
        ...state,
        ledgerList: action.payload.data
      }
    }
    case actionTypes.DELETE_LEDGER_HEAD: {
      const newLedgerList = state.ledgerList.filter(item => item.id !== action.payload.data)
      return {
        ...state,
        ledgerList: newLedgerList
      }
    }
    case actionTypes.ADD_LEDGER_ACC_HEAD: {
      const newLedgerList = [action.payload.data, ...state.ledgerList]
      return {
        ...state,
        ledgerList: newLedgerList
      }
    }
    case actionTypes.EDIT_LEDGER_HEAD: {
      const index = state.ledgerList.findIndex(item => item.id === action.payload.data.id)
      const ledger = {
        ...state.ledgerList[index],
        account_head_name: action.payload.data.account_head_name,
        ledger_type: { ...action.payload.data.ledger_type }
      }
      const newLedgerList = [...state.ledgerList]
      newLedgerList[index] = ledger
      return {
        ...state,
        ledgerList: newLedgerList
      }
    }
    case actionTypes.ADD_LEDGER_ENTRY: {
      const index = state.ledgerList.findIndex(item => +item.id === +action.payload.headId)
      const newLedgerList = [...state.ledgerList]
      const ledgerEntry = {
        id: action.payload.data.id,
        ledger_account: action.payload.data.ledger_account,
        ledger_status: action.payload.data.ledger_status,
        remarks: action.payload.data.remarks
      }
      const subHeader = [ledgerEntry, ...newLedgerList[index].sub_header]
      console.log('subHead: ', subHeader)
      const newSubHeader = subHeader.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
      newLedgerList[index].sub_header = newSubHeader
      return {
        ...state,
        ledgerList: newLedgerList
      }
    }
    case actionTypes.EDIT_LEDGER_ENTRY: {
      const index = state.ledgerList.findIndex(item => item.id === action.payload.headId)
      const newLedgerList = [...state.ledgerList]
      const ledgerEntry = action.payload.data
      const newSubHeader = [...newLedgerList[index].sub_header]
      const subLedgerIndex = newSubHeader.findIndex(item => +item.id === +ledgerEntry.id)
      newSubHeader[subLedgerIndex] = ledgerEntry
      newLedgerList[index].sub_header = newSubHeader
      return {
        ...state,
        ledgerList: newLedgerList
      }
    }
    case actionTypes.DELETE_LEDGER_ENTRY: {
      const index = state.ledgerList.findIndex(item => item.id === action.payload.headId)
      const newLedgerList = [...state.ledgerList]
      const newSubHeader = [...newLedgerList[index].sub_header].filter(item => item.id !== action.payload.id)
      newLedgerList[index].sub_header = newSubHeader
      return {
        ...state,
        ledgerList: newLedgerList
      }
    }
    case actionTypes.ADD_LEDGER_TYPE: {
      const ledgerTypeLists = [...state.ledgerTypeList]
      ledgerTypeLists.push(action.payload.data)
      return {
        ...state,
        ledgerTypeList: ledgerTypeLists
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default ledgerReducer
