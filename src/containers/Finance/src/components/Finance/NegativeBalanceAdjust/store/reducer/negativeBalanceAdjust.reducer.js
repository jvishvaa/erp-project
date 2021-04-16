import * as actionTypes from '../../../store/actions/index'

const initialState = {
  walletAmount: [],
  transactionDetails: [],
  feeStructureList: [],
  // unassignStudent: []
  notUsedWalletAmtList: []
}

const negativeBalanceAdjustReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.WALLET_AMOUNT : {
      let assignStu = action.payload.data.assign_wallet_amount
      let notAssstu = action.payload.data.not_assign
      let allStudent = []
      allStudent.push(...assignStu)
      allStudent.push(...notAssstu)
      return {
        ...state,
        walletAmount: allStudent
      }
    }
    case actionTypes.TRANSACTION_DETAILS : {
      return {
        ...state,
        transactionDetails: action.payload.data
      }
    }
    case actionTypes.FEE_STRUCTURE_LIST_ERP : {
      return {
        ...state,
        feeStructureList: action.payload.data
      }
    }
    case actionTypes.ADD_WALLET_AMOUNT : {
      let data = state.walletAmount
      let index = data.findIndex((val) => +val.id === +action.payload.data.id)
      // if (data[index] && data[index].reaming_amount && data[index].total_amount && data[index].used_amount) {
      let unassign = null
      if (index !== -1) {
        data[index].reaming_amount = action.payload.data.reaming_amount
        data[index].total_amount = action.payload.data.total_amount
        data[index].used_amount = action.payload.data.used_amount
      } else {
        let index2 = data.findIndex((val) => +val.id === +action.payload.data.student)
        if (index2 !== -1) {
          data[index2] = { reaming_amount: action.payload.data.reaming_amount,
            total_amount: action.payload.data.total_amount,
            used_amount: action.payload.data.used_amount,
            erp: data[index2].erp,
            name: data[index2].name,
            id: data[index2].id
          }
        }
      }
      // }
      return {
        ...state,
        walletAmount: data
        // unassignStudent: unassign
      }
    }
    case actionTypes.WALLET_AMOUNT_NOT_USED : {
      return {
        ...state,
        notUsedWalletAmtList: action.payload.data
      }
    }
    case actionTypes.DELETE_WALLET_AMOUNT : {
      let data = state.walletAmount
      let index = data.findIndex((val) => +val.id === +action.payload.data[0].id)
      if (index !== -1) {
        data[index].reaming_amount = action.payload.data[0].reaming_amount
        data[index].total_amount = action.payload.data[0].total_amount
        data[index].used_amount = action.payload.data[0].used_amount
      } else {
        let index2 = data.findIndex((val) => +val.id === +action.payload.data[0].student)
        if (index2 !== -1) {
          data[index2] = { reaming_amount: action.payload.data[0].reaming_amount,
            total_amount: action.payload.data[0].total_amount,
            used_amount: action.payload.data[0].used_amount,
            erp: data[index2].erp,
            name: data[index2].name,
            id: data[index2].id
          }
        }
      }
      return {
        ...state,
        walletAmount: data
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}
export default negativeBalanceAdjustReducer
