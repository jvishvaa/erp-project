import * as actionTypes from '../../../store/actions/index'

const initialState = {
  feeTypeList: [],
  feeAccountList: [],
  feeInstallments: [],
  feePlanTypeList: [],
  feeAccountListFromAcadId: [],
  feePlanList: [],
  feeTypePerBranch: [],
  feePlanYearApplicable: []
}

const feePlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FEE_TYPE_LIST : {
      return {
        ...state,
        feeTypeList: action.payload.data
      }
    }
    case actionTypes.FEE_CREATE_INSTALLMENTS : {
      console.log(action.payload.data)
      const newInstallmentList = [...state.feeInstallments]
      console.log('--------before---------', newInstallmentList)
      action.payload.data.map(val => {
        return (
          newInstallmentList.push({
            installment_name: val.installment_name ? val.installment_name : '',
            installment_amount: val.installment_amount ? val.installment_amount : '',
            installment_percentage: val.installment_percentage ? val.installment_percentage : '',
            due_date: val.due_date ? val.due_date : '',
            installment_start_date: val.installment_start_date ? val.installment_start_date : '',
            installment_end_date: val.installment_end_date ? val.installment_end_date : '',
            fee_account: {
              fee_account_name: val.fee_account.fee_account_name ? val.fee_account.fee_account_name : ''
            },
            fine_amount: val.fine_amount ? val.fine_amount : ''
          })
        )
      })
      console.log('--------after---------', newInstallmentList)
      return {
        ...state,
        feeInstallments: newInstallmentList
      }
    }
    case actionTypes.DELETE_FEE_PLAN_INSTALLMENTS : {
      // const newInstallmentList = [...state.feeInstallments]
      // console.log('------before-------------', newInstallmentList)
      // const deletedInstallmentList = newInstallmentList.filter(inst => {
      //   return inst.id !== action.payload.id
      // })
      // console.log('=========afyer--------------', deletedInstallmentList)
      return {
        ...state,
        feeInstallments: []
      }
    }
    case actionTypes.FEE_ACCOUNT_LIST : {
      return {
        ...state,
        feeAccountList: action.payload.data
      }
    }
    case actionTypes.UPDATE_FEE_PLAN_GRADES : {
      const feeList = [...state.feePlanList]
      const updatedFeePlanGrades = feeList.filter(fee => fee.id === action.payload.id)
      const index = feeList.findIndex(ele => {
        return ele.id === action.payload.id
      })
      const UpdatedFeeList = { ...updatedFeePlanGrades[0] }
      UpdatedFeeList.grades.push({
        id: action.payload.data.grade_id,
        grade: action.payload.data.grade_name
      })
      feeList[index] = UpdatedFeeList
      return {
        ...state,
        feePlanList: feeList
      }
    }
    case actionTypes.FEE_DISPLAY_INSTALLMENTS : {
      return {
        ...state,
        feeInstallments: action.payload.data
      }
    }
    case actionTypes.FEE_PLAN_TYPE_LIST : {
      return {
        ...state,
        feePlanTypeList: action.payload.data
      }
    }
    case actionTypes.CREATE_FEE_TYPE_MAPPING : {
      console.log(action.payload)
      const updatedFeeTypesList = [...state.feeTypeList]
      console.log('-------------before----------', updatedFeeTypesList)
      // updatedFeeTypesList.push({
      //   id: action.payload.data.id ? action.payload.data.id : '',
      //   amount: action.payload.data.amount ? action.payload.data.amount : ''
      // })
      updatedFeeTypesList.push(action.payload.data)
      console.log('------------after-------', updatedFeeTypesList)
      return {
        ...state,
        feeTypeList: updatedFeeTypesList
      }
    }
    case actionTypes.FEE_ACCOUNT_LIST_FROM_ACADID : {
      return {
        ...state,
        feeAccountListFromAcadId: action.payload.data
      }
    }
    case actionTypes.UPDATE_INSTALLMENT_RECORD : {
      const installmentList = [...state.feeInstallments]
      const index = installmentList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      const changeObj = { ...installmentList[index] }
      changeObj.id = action.payload.data.id ? action.payload.data.id : ''
      changeObj.installment_name = action.payload.data.installment_name ? action.payload.data.installment_name : ''
      changeObj.fee_account = action.payload.data.fee_account ? action.payload.data.fee_account : ''
      changeObj.due_date = action.payload.data.due_date ? action.payload.data.due_date : ''
      changeObj.fine_amount = !!action.payload.data.fine_amount
      changeObj.installment_amount = action.payload.data.installment_amount ? action.payload.data.installment_amount : ''
      changeObj.installment_start_date = action.payload.data.installment_start_date ? action.payload.data.installment_start_date : ''
      changeObj.installment_end_date = action.payload.data.installment_end_date ? action.payload.data.installment_end_date : ''
      changeObj.id = action.payload.data.id ? action.payload.data.id : ''
      installmentList[index] = { ...changeObj }
      return {
        ...state,
        feeInstallments: installmentList
      }
    }

    case actionTypes.UPDATE_INSTALLMENT_AMOUNT : {
      // console.log('before changing++++', state.feeTypeList)
      const installmentList = [...state.feeInstallments]
      const updatedFeeTypesList = [...state.feeTypeList]
      const index = installmentList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      const prevAmount = installmentList[index].installment_amount
      const changeObj = { ...installmentList[index], ...action.payload.data }
      installmentList[index] = { ...changeObj }
      const newAmount = installmentList[index].installment_amount
      const feeTypeIndex = updatedFeeTypesList.findIndex(ele => (+ele.fee_type_name.id) === (+action.payload.feeTypeId))
      // console.log('fee type index++++', feeTypeIndex)
      if (feeTypeIndex !== -1) {
        const feeTypeObj = { ...updatedFeeTypesList[feeTypeIndex], amount: updatedFeeTypesList[feeTypeIndex].amount + newAmount - prevAmount }
        updatedFeeTypesList[feeTypeIndex] = feeTypeObj
      }
      // console.log('after changing++++', updatedFeeTypesList)
      return {
        ...state,
        feeInstallments: installmentList,
        feeTypeList: updatedFeeTypesList
      }
    }

    case actionTypes.FEE_PLAN_LIST : {
      return {
        ...state,
        feePlanList: action.payload.data
      }
    }
    case actionTypes.UPDATE_FEE_PLAN : {
      const updatedFeePlanList = [...state.feePlanList]
      console.log('----------feelist---------', updatedFeePlanList)
      const index = updatedFeePlanList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      const changeObj = { ...updatedFeePlanList[index], ...action.payload.data }
      // changeObj.id = action.payload.data.id ? action.payload.data.id : ''
      // changeObj.fee_plan_name = action.payload.data.fee_plan_name ? action.payload.data.fee_plan_name : ''
      // changeObj.is_dayscholar = !!action.payload.data.is_dayscholar
      // changeObj.is_afternoonbatch = !!action.payload.data.is_afternoonbatch
      // changeObj.is_new_admission = !!action.payload.data.is_new_admission
      // changeObj.is_regular = !!action.payload.data.is_regular
      // changeObj.is_rte = !!action.payload.data.is_rte
      // changeObj.is_specialchild = !!action.payload.data.is_specialchild
      // changeObj.is_this_a_limited_plan = !!action.payload.data.is_this_a_limited_plan
      // changeObj.plan_status = !!action.payload.data.plan_status
      updatedFeePlanList[index] = { ...changeObj }
      console.log('------------after-----------', updatedFeePlanList)
      return {
        ...state,
        feePlanList: updatedFeePlanList
      }
    }
    case actionTypes.DELETE_FEE_PLAN_GRADES : {
      // console.log(action.payload)
      const oldFeePlanList = [...state.feePlanList]
      const index = oldFeePlanList.findIndex(fee => {
        return fee.id === action.payload.typeId
      })
      const deletedFeePlanList = oldFeePlanList.filter(fee => {
        return fee.id === action.payload.typeId
      })
      const deletedGrades = [...deletedFeePlanList[0].grades]
      const newGrades = deletedGrades.filter(ele => {
        return ele.id !== action.payload.gradeId
      })
      deletedFeePlanList[0].grades = newGrades
      oldFeePlanList[index] = { ...deletedFeePlanList[0] }
      return {
        ...state,
        feePlanList: oldFeePlanList
      }
    }
    case actionTypes.FEE_TYPE_PER_BRANCH : {
      return {
        ...state,
        feeTypePerBranch: action.payload.data
      }
    }
    case actionTypes.FEE_PLAN_YEAR_APPLICABLE : {
      return {
        ...state,
        feePlanYearApplicable: action.payload.data
      }
    }
    case actionTypes.CREATE_FEE_PLAN : {
      const feePlanList = [...state.feePlanList]
      feePlanList.unshift(action.payload.data)
      console.log('feePlanList', feePlanList)
      return {
        ...state,
        feePlanList: feePlanList
      }
    }
    case actionTypes.CREATE_FEE_PLAN_TYPE_MAP : {
      return {
        ...state
      }
    }
    case actionTypes.CLEAR_MANAGE_FEE_PROPS : {
      return {
        ...state,
        feeTypeList: [],
        feeAccountList: [],
        feeInstallments: []
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default feePlanReducer
