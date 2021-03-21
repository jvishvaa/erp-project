import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  feeManagementList: [],
  feePlans: [],
  currentFeePlan: [],
  editFeePlan: []
}

const feeManagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FEE_MANAGEMENT_LISTS : {
      return {
        ...state,
        feeManagementList: action.payload.data,
        currentFeePlan: action.payload.feePlan
      }
    }
    case actionTypes.FETCH_FEE_PLANS_PER_ERP : {
      return {
        ...state,
        feePlans: action.payload.data
      }
    }
    case actionTypes.EDIT_STUDENT_FEE : {
      console.log('edit fee plan', action.payload.data)
      const editFeePlanStu = state.currentFeePlan
      editFeePlanStu[0].fee_plan_name = {
        'fee_plan_name': action.payload.data[0].fee_plan_name,
        'status': action.payload.data[0].Status,
        'fee_plan': action.payload.data[0].fee_plan
      }
      console.log('editFeePlanStu', editFeePlanStu)
      return {
        ...state,
        currentFeePlan: editFeePlanStu
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default feeManagementReducer
