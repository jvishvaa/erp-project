import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  viewBanksList: []
}

const viewBanksReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_VIEW_BANKS: {
      return {
        ...state,
        viewBanksList: action.payload.data
      }
    }
    case actionTypes.ADD_VIEW_BANK: {
      const changeObj = [...state.viewBanksList]
      changeObj.push({
        Sr: state.viewBanksList.length ? state.viewBanksList.length + 1 : 1,
        id: action.payload.data.id ? action.payload.data.id : '',
        bank_name: action.payload.data.bank_name ? action.payload.data.bank_name : '',
        bank_branch_name: action.payload.data.bank_branch_name ? action.payload.data.bank_branch_name : '',
        AccountNumber: action.payload.data.AccountNumber ? action.payload.data.AccountNumber : '',
        bank_nick_name: action.payload.data.bank_nick_name ? action.payload.data.bank_nick_name : '',
        description: action.payload.data.description ? action.payload.data.description : '',
        is_expenses_account: action.payload.data.is_expenses_account ? action.payload.data.is_expenses_account : false,
        is_income_account: action.payload.data.is_income_account ? action.payload.data.is_income_account : false,
        is_petty_cash_account: action.payload.data.is_petty_cash_account ? action.payload.data.is_petty_cash_account : false,
        cheque_bounce_amount: action.payload.data.cheque_bounce_amount ? action.payload.data.cheque_bounce_amount : '',
        logo_url: action.payload.data.logo_url ? action.payload.data.logo_url : ''
      })
      return {
        ...state,
        viewBanksList: changeObj
      }
    }
    case actionTypes.EDIT_VIEW_BANK: {
      const bankList = [...state.viewBanksList]
      const index = bankList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      const changeObj = { ...bankList[index] }
      changeObj.id = action.payload.data.id ? action.payload.data.id : ''
      changeObj.bank_name = action.payload.data.bank_name ? action.payload.data.bank_name : ''
      changeObj.bank_branch_name = action.payload.data.bank_branch_name ? action.payload.data.bank_branch_name : ''
      changeObj.AccountNumber = action.payload.data.AccountNumber ? action.payload.data.AccountNumber : ''
      changeObj.bank_nick_name = action.payload.data.bank_nick_name ? action.payload.data.bank_nick_name : ''
      changeObj.description = action.payload.data.description ? action.payload.data.description : ''
      changeObj.is_expenses_account = action.payload.data.is_expenses_account ? action.payload.data.is_expenses_account : false
      changeObj.is_income_account = action.payload.data.is_income_account ? action.payload.data.is_income_account : false
      changeObj.is_petty_cash_account = action.payload.data.is_petty_cash_account ? action.payload.data.is_petty_cash_account : false
      changeObj.cheque_bounce_amount = action.payload.data.cheque_bounce_amount ? action.payload.data.cheque_bounce_amount : ''
      changeObj.logo_url = action.payload.data.logo_url ? action.payload.data.logo_url : ''

      bankList[index] = { ...changeObj }
      return {
        ...state,
        viewBanksList: bankList
      }
    }
    case actionTypes.DELETE_VIEW_BANK: {
      const newBankList = [...state.viewBanksList]
      const deletedBankList = newBankList.filter(bank => {
        return bank.id !== action.payload.row
      })
      return {
        ...state,
        viewBanksList: deletedBankList
      }
    }

    default: {
      return {
        ...state
      }
    }
  }
}

export default viewBanksReducer
