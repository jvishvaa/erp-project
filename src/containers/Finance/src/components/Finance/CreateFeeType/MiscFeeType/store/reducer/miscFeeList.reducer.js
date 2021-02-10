import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  miscFeeList: []
}

const miscFeeListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MISC_FEE_LIST: {
      return {
        ...state,
        miscFeeList: action.payload.data
      }
    }
    case actionTypes.UPDATE_MISC_FEE_LIST: {
      // console.log(action.payload.data)
      const feeList = [...state.miscFeeList]
      const index = feeList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      const changeObj = { ...feeList[index] }
      changeObj.id = action.payload.data.id ? action.payload.data.id : ''
      changeObj.fee_type_name = action.payload.data.fee_type_name ? action.payload.data.fee_type_name : ''
      changeObj.is_multiple_records_allow = action.payload.data.is_multiple_records_allow ? action.payload.data.is_multiple_records_allow : false
      changeObj.individual_student_wise = action.payload.data.individual_student_wise ? action.payload.data.individual_student_wise : false
      changeObj.allow_partial_payments = action.payload.data.allow_partial_payments ? action.payload.data.allow_partial_payments : false
      changeObj.can_be_group = action.payload.data.can_be_group ? action.payload.data.can_be_group : false
      changeObj.is_allow_remarks = action.payload.data.is_allow_remarks ? action.payload.data.is_allow_remarks : false
      changeObj.allow_excess_amount = action.payload.data.allow_excess_amount ? action.payload.data.allow_excess_amount : false
      changeObj.is_last_year_due = action.payload.data.is_last_year_due ? action.payload.data.is_last_year_due : false
      changeObj.is_advance_fee = action.payload.data.is_advance_fee ? action.payload.data.is_advance_fee : false
      changeObj.is_parent_enable = action.payload.data.is_parent_enable ? action.payload.data.is_parent_enable : false
      changeObj.set_due_date = action.payload.data.set_due_date ? action.payload.data.set_due_date : ''
      changeObj.amount = action.payload.data.amount ? action.payload.data.amount : ''
      changeObj.start_date = action.payload.data.start_date ? action.payload.data.start_date : ''
      changeObj.end_date = action.payload.data.end_date ? action.payload.data.end_date : ''
      changeObj.is_store_related = action.payload.data.is_store_related ? action.payload.data.is_store_related : ''
      changeObj.fee_account = action.payload.data.fee_account
      feeList[index] = { ...changeObj }
      return {
        ...state,
        miscFeeList: feeList
      }
    }
    case actionTypes.ADD_MISC_FEE_LIST : {
      const addedFeeList = [...state.miscFeeList]
      addedFeeList.push({
        Sr: state.miscFeeList.length ? state.miscFeeList.length + 1 : 1,
        id: action.payload.data.id ? action.payload.data.id : '',
        fee_type_name: action.payload.data.fee_type_name ? action.payload.data.fee_type_name : '',
        is_multiple_records_allow: action.payload.data.is_multiple_records_allow ? action.payload.data.is_multiple_records_allow : false,
        individual_student_wise: action.payload.data.individual_student_wise ? action.payload.data.individual_student_wise : false,
        allow_partial_payments: action.payload.data.allow_partial_payments ? action.payload.data.allow_partial_payments : false,
        can_be_group: action.payload.data.can_be_group ? action.payload.data.can_be_group : false,
        is_allow_remarks: action.payload.data.is_allow_remarks ? action.payload.data.is_allow_remarks : false,
        allow_excess_amount: action.payload.data.allow_excess_amount ? action.payload.data.allow_excess_amount : false,
        is_last_year_due: action.payload.data.is_last_year_due ? action.payload.data.is_last_year_due : false,
        is_advance_fee: action.payload.data.is_advance_fee ? action.payload.data.is_advance_fee : false,
        is_parent_enable: action.payload.data.is_parent_enable ? action.payload.data.is_parent_enable : false,
        set_due_date: action.payload.data.set_due_date ? action.payload.data.set_due_date : '',
        start_date: action.payload.data.start_date ? action.payload.data.start_date : '',
        end_date: action.payload.data.end_date ? action.payload.data.end_date : '',
        is_store_related: action.payload.data.is_store_related ? action.payload.data.is_store_related : '',
        amount: action.payload.data.amount ? action.payload.data.amount : '',
        fee_account: action.payload.data.fee_account
      })
      return {
        ...state,
        miscFeeList: addedFeeList
      }
    }
    case actionTypes.DELETE_MISC_FEE_LIST: {
      const newMiscFeeList = [...state.miscFeeList]
      const deletedFeeList = newMiscFeeList.filter(fee => {
        return fee.id !== action.payload.id
      })
      return {
        ...state,
        miscFeeList: deletedFeeList
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default miscFeeListReducer
