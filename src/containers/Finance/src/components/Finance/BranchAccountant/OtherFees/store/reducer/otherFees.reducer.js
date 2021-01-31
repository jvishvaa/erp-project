import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  accountantOtherFees: [],
  accountantFeeAccount: [],
  adminFeeAccount: [],
  listOtherFees: [],
  receiptRangeMessage: '',
  unassignedStudentList: [],
  assignedStudentList: [],
  dueDate: null,
  addOtherConfirm: false,
  transactionId: null,
  confirmPayment: false,
  otherFeeInstallment: [],
  installmentStatus: false,
  adminOtherfees: [],
  newInstallmentRes: false,
  listInstallments: [],
  isMisc: null,
  bulkUploadRes: null
}

const listOtherFeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ASSIGN_OTHER_FEES: {
      const addOtherFees = [...state.accountantOtherFees]
      addOtherFees.push({
        id: action.payload.data.id ? action.payload.data.id : '',
        balance: action.payload.data.balance ? action.payload.data.balance : 0,
        due_date: action.payload.data.due_date ? action.payload.data.due_date : 0,
        paid_amount: action.payload.data.paid_amount ? action.payload.data.paid_amount : 0,
        other_fee: {
          id: action.payload.data.other_fee.id ? action.payload.data.other_fee.id : '',
          amount: action.payload.data.other_fee.amount ? action.payload.data.other_fee.amount : 0,
          fee_type_name: action.payload.data.other_fee.fee_type_name ? action.payload.data.other_fee.fee_type_name : 0,
          sub_type: action.payload.data.other_fee.sub_type ? action.payload.data.other_fee.sub_type : 0,
          fee_account: {
            fee_account_name: action.payload.data.other_fee.fee_account.fee_account_name ? action.payload.data.other_fee.fee_account.fee_account_name : 0
          }
        }
      })
      return {
        ...state,
        accountantOtherFees: addOtherFees
      }
    }
    case actionTypes.OTHER_FEE_PAYMENT: {
      console.log('--------reducers------------', action.payload.data)
      return {
        ...state,
        transactionId: action.payload.data.transaction_id,
        confirmPayment: true,
        receiptNo: action.payload.data.receipt_number_online ? action.payload.data.receipt_number_online : ''
      }
    }
    case actionTypes.RECEIPT_RANGE_MESSAGE: {
      return {
        ...state,
        receiptRangeMessage: action.payload.data
      }
    }
    case actionTypes.UPLOAD_OTHER_FEES: {
      return {
        ...state,
        bulkUploadRes: action.payload.data
      }
    }
    case actionTypes.CHECK_IS_MISC: {
      return {
        ...state,
        isMisc: action.payload.data
      }
    }
    case actionTypes.ACCOUNTANT_OTHER_FEE_LIST: {
      return {
        ...state,
        accountantOtherFees: action.payload.data
      }
    }
    case actionTypes.LIST_OTHER_FEES: {
      return {
        ...state,
        listOtherFees: action.payload.data
      }
    }
    case actionTypes.ADD_OTHER_FEE_ACCOUNTANT: {
      const addedOtherFeeList = [...state.listOtherFees]
      addedOtherFeeList.push({
        id: action.payload.data.id ? action.payload.data.id : '',
        fee_type_name: action.payload.data.fee_type_name ? action.payload.data.fee_type_name : ''
      })
      return {
        ...state,
        listOtherFees: addedOtherFeeList,
        addOtherConfirm: true
      }
    }
    case actionTypes.ACCOUNTANT_FEE_ACCOUNT: {
      return {
        ...state,
        accountantFeeAccount: action.payload.data
      }
    }
    case actionTypes.ADMIN_FEE_ACCOUNT_LIST: {
      return {
        ...state,
        adminFeeAccount: action.payload.data
      }
    }
    case actionTypes.UPDATE_ACC_OTHER_FEE_LIST: {
      console.log(action.payload.data)
      const feeList = [...state.accountantOtherFees]
      const index = feeList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      const changeObj = { ...feeList[index] }
      changeObj.id = action.payload.data.id ? action.payload.data.id : ''
      changeObj.fee_account.fee_account_name = action.payload.data.fee_account.fee_account_name ? action.payload.data.fee_account.fee_account_name : ''
      changeObj.fee_type_name = action.payload.data.fee_type_name ? action.payload.data.fee_type_name : ''
      changeObj.sub_type = action.payload.data.sub_type ? action.payload.data.sub_type : ''
      changeObj.amount = action.payload.data.amount ? action.payload.data.amount : ''
      feeList[index] = { ...changeObj }
      return {
        ...state,
        accountantOtherFees: feeList
      }
    }
    case actionTypes.DELETE_ACC_OTHER_FEE_LIST: {
      // console.log(action.payload.id)
      const newOtherFeeList = [...state.accountantOtherFees]
      // console.log('-------before---------', newOtherFeeList)
      const deletedFeeList = newOtherFeeList.filter(fee => {
        return fee.id !== action.payload.id
      })
      // console.log('-------after---------', deletedFeeList)
      return {
        ...state,
        accountantOtherFees: deletedFeeList
      }
    }
    case actionTypes.CLEARING_ALL_PROPS: {
      return {
        ...state,
        transactionId: null,
        confirmPayment: false,
        receiptRangeMessage: '',
        otherFeeInstallment: [],
        installmentStatus: false,
        newInstallmentRes: false,
        adminOtherfees: []
      }
    }
    case actionTypes.ACCOUNTANT_OTHER_FEES_UNASSIGN: {
      return {
        ...state,
        unassignedStudentList: action.payload.data
      }
    }
    case actionTypes.ACCOUTANT_OTHER_FEES_ASSIGN: {
      return {
        ...state,
        assignedStudentList: action.payload.data.assigned,
        dueDate: action.payload.data.due_date
      }
    }
    case actionTypes.CREATE_OTHER_FEES_FOR_UNASSIGN: {
      const unassignStudentList = [...state.unassignedStudentList]
      // console.log('-actions-----------', action.payload.data)
      // console.log('------before------------', unassignStudentList)
      let updatedUnassignedStudents = []
      const assignedId = (action.payload.data.assigned.map(ele => +ele.id))
      // console.log('--id--------------', assignedId)
      updatedUnassignedStudents = unassignStudentList.filter(ele => !assignedId.includes(ele.id))
      // action.payload.data.assigned.forEach(val => {
      //   updatedUnassignedStudents = unassignStudentList.filter(ele => {
      //     return ele.id !== val.id
      //   })
      // })
      console.log('------after------------', updatedUnassignedStudents)
      return {
        ...state,
        unassignedStudentList: updatedUnassignedStudents,
        dueDate: action.payload.data.due_date
      }
    }
    case actionTypes.DELETE_OTHER_FEES_FOR_ASSIGNED: {
      const assignStudentLists = [...state.assignedStudentList]
      // console.log('------before------------', assignStudentLists)
      let updatedAssignedStudents = []
      const unassignedId = action.payload.data.unassigned.map(ele => ele.id)
      updatedAssignedStudents = assignStudentLists.filter(ele => !unassignedId.includes(ele.id))
      // console.log('------after------------', updatedAssignedStudents)
      return {
        ...state,
        assignedStudentList: updatedAssignedStudents,
        dueDate: action.payload.data.due_date
      }
    }
    case actionTypes.CHECK_OTHER_FEES_INSTALLMENTS: {
      return {
        ...state,
        otherFeeInstallment: action.payload.data,
        installmentStatus: true
      }
    }
    case actionTypes.SAVE_OTHER_FEES_INSTALLMENTS: {
      return {
        ...state,
        newInstallmentRes: true
      }
    }
    case actionTypes.DELETE_OTHER_FEES_INSTALLMENTS: {
      return {
        ...state,
        otherFeeInstallment: []
      }
    }
    case actionTypes.FETCH_ADMIN_OTHER_LIST: {
      return {
        ...state,
        adminOtherfees: action.payload.data
      }
    }
    case actionTypes.FETCH_INSTALLMENT_LIST: {
      return {
        ...state,
        listInstallments: action.payload.data
      }
    }
    case actionTypes.UPDATE_OTHER_FEE_INST: {
      const list = [...state.adminOtherfees]
      const index = list.findIndex(ele => {
        return ele.id === action.payload.data.id
      }
      )
      list[index] = action.payload.data ? { ...action.payload.data } : ''
      return {
        ...state,
        adminOtherfees: list
      }
    }
    case actionTypes.UPDATE_OTHER_FEE_INSTA: {
      const newInstaList = [...state.listInstallments]
      const index = newInstaList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      const changeObj = { ...newInstaList[index] }
      changeObj.id = action.payload.data.id ? action.payload.data.id : ''
      changeObj.installment_name = action.payload.data.installment_name ? action.payload.data.installment_name : 'NA'
      newInstaList[index] = { ...changeObj }
      return {
        ...state,
        listInstallments: newInstaList
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default listOtherFeeReducer
