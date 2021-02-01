import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  viewFeeAccList: []
}

const viewFeeAccountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_FEE_ACCOUNTS: {
      return {
        ...state,
        viewFeeAccList: action.payload.data
      }
    }
    case actionTypes.ADD_FEE_ACCOUNTS: {
      const changeObj = [...state.viewFeeAccList]
      changeObj.push({
        Sr: state.viewFeeAccList.length ? state.viewFeeAccList.length + 1 : 1,
        id: action.payload.data.id ? action.payload.data.id : '',
        fee_account_name: action.payload.data.fee_account_name ? action.payload.data.fee_account_name : '',
        prefix: action.payload.data.prefix ? action.payload.data.prefix : '',
        receipt_sub_header: action.payload.data.receipt_sub_header ? action.payload.data.receipt_sub_header : '',
        receipt_footer: action.payload.data.receipt_footer ? action.payload.data.receipt_footer : '',
        payslip_header: action.payload.data.payslip_header ? action.payload.data.payslip_header : '',
        can_be_shown_reports: action.payload.data.can_be_shown_reports ? action.payload.data.can_be_shown_reports : '',
        is_trust: action.payload.data.is_trust ? action.payload.data.is_trust : '',
        is_expenses_account: action.payload.data.is_expenses_account ? action.payload.data.is_expenses_account : ''
      })
      return {
        ...state,
        viewFeeAccList: changeObj
      }
    }
    case actionTypes.EDIT_FEE_ACCOUNTS: {
      const feeList = [...state.viewFeeAccList]
      const index = feeList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      const changeObj = { ...feeList[index] }
      changeObj.id = action.payload.data.id ? action.payload.data.id : ''
      changeObj.fee_account_name = action.payload.data.fee_account_name ? action.payload.data.fee_account_name : ''
      changeObj.prefix = action.payload.data.prefix ? action.payload.data.prefix : ''
      changeObj.receipt_sub_header = action.payload.data.receipt_sub_header ? action.payload.data.receipt_sub_header : ''
      changeObj.receipt_footer = action.payload.data.receipt_footer ? action.payload.data.receipt_footer : ''
      changeObj.payslip_header = action.payload.data.payslip_header ? action.payload.data.payslip_header : ''
      changeObj.can_be_shown_reports = action.payload.data.can_be_shown_reports
      changeObj.is_expenses_account = action.payload.data.is_expenses_account
      changeObj.is_trust = action.payload.data.is_trust

      feeList[index] = { ...changeObj }
      return {
        ...state,
        viewFeeAccList: feeList
      }
    }
    case actionTypes.DELETE_FEE_ACCOUNTS: {
      const newBankList = [...state.viewFeeAccList]
      const deletedBankList = newBankList.filter(bank => {
        return bank.id !== action.payload.deleteId
      })
      return {
        ...state,
        viewFeeAccList: deletedBankList
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default viewFeeAccountsReducer
