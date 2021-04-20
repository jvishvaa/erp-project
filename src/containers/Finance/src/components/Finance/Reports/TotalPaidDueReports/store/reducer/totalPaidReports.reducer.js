import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  installmentsList: [],
  multInstallmentList: [],
  feeTypes: [],
  multFeeTypes: [],
  multFeePlans: [],
  feePlans: [],
  othrFeeTyp: [],
  othrFeeInst: []
}

const totalPaidReportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INSTALLMENTS_LIST_PER_FEE_TYPE: {
      const multInstList = [...action.payload.data]
      if (multInstList.length > 0) {
        multInstList.unshift({
          installment_name: 'All Installments',
          id: 'all'
        })
      }
      return {
        ...state,
        multInstallmentList: multInstList,
        installmentsList: action.payload.data
      }
    }
    case actionTypes.FEE_TYPES_TOTAL_PAID_REPORTS_PER_BRNCH: {
      const multFeeType = [...action.payload.data]
      if (multFeeType.length > 0) {
        multFeeType.unshift({
          fee_type_name: 'All Fee Types',
          id: 'all'
        })
      }
      return {
        ...state,
        multFeeTypes: multFeeType,
        feeTypes: action.payload.data
      }
    }
    case actionTypes.FETCH_FEE_PLAN_NAMES: {
      const multFee = [...action.payload.data]
      if (multFee.length > 0) {
        multFee.unshift({
          id: 'all',
          fee_plan_name: 'All Fee Plan'
        })
      }
      const multOthrFee = [...action.payload.otherFee]
      if (multOthrFee.length > 0) {
        multOthrFee.unshift({
          id: 'all',
          fee_type_name: 'All Fee Types'
        })
      }
      const feePlan = [...action.payload.data]
      return {
        ...state,
        multFeePlans: multFee,
        feePlans: feePlan,
        othrFeeTyp: multOthrFee
      }
    }
    case actionTypes.FETCH_OTHR_FEE_INSTS: {
      const multOthrInst = [...action.payload.data]
      if (multOthrInst.length > 0) {
        multOthrInst.unshift({
          installment_name: 'All Installments',
          id: 'all'
        })
      }
      return {
        ...state,
        othrFeeInst: multOthrInst
      }
    }
    case actionTypes.CLEAR_TOTAL_PAID_PROPS: {
      return {
        ...state,
        installmentsList: [],
        multInstallmentList: [],
        feeTypes: [],
        multFeeTypes: [],
        multFeePlans: [],
        feePlans: [],
        othrFeeTyp: [],
        othrFeeInst: []
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default totalPaidReportsReducer
