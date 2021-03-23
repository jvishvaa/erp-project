import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  feeStructureList: [],
  listConcessionType: [],
  feeTypeList: [],
  otherFeeStrucList: [],
  otherInstStrucList: [],
  concessiontype: [],
  unassignResponse: [],
  studentDues: [],
  backDate: [],
  refund: []
}

const feeStructureReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_REFUND_VALUE : {
      return {
        ...state,
        refund: action.payload.data
      }
    }
    case actionTypes.FEE_STRUCTURE_LIST : {
      return {
        ...state,
        feeStructureList: action.payload.data
      }
    }
    case actionTypes.LIST_CON_TYPES: {
      return {
        ...state,
        listConcessionType: action.payload.data
      }
    }
    case actionTypes.SAVE_CON_REQUEST: {
      return {
        ...state
        // listConcessionType: action.payload.data
      }
    }
    case actionTypes.FETCH_CONCESSION_TYPE: {
      return {
        ...state,
        concessiontype: action.payload.data
      }
    }
    case actionTypes.FEE_TYPE_WISE: {
      return {
        ...state,
        feeTypeList: action.payload.data
      }
    }
    case actionTypes.UNASSIGN_FEE_DETAILS : {
      // const totalList = [...state.feeTypeList]
      // const unassignedList = totalList.filter(fee => {
      //   return fee.id !== action.payload.id
      // })
      return {
        ...state,
        unassignResponse: state.feeTypeList
        // feeTypeList: state.feeTypeList
      }
    }
    case actionTypes.OTHER_FEE_TYPE_LIST: {
      return {
        ...state,
        otherFeeStrucList: action.payload.data
      }
    }
    case actionTypes.OTHER_FEE_INST_LIST: {
      return {
        ...state,
        otherInstStrucList: action.payload.data
      }
    }
    case actionTypes.SAVE_OTHER_CON_REQUEST : {
      const instlist = [...state.otherInstStrucList]
      console.log('reducers', instlist)
      const index = instlist.findIndex(ele => {
        return ele.id === action.payload.data.balance.id
      })
      const changedObj = { ...instlist[index] }
      changedObj.balance = action.payload.data.balance.balance ? action.payload.data.balance.balance : 0
      changedObj.discount = action.payload.data.concession_amount ? action.payload.data.concession_amount : 0
      instlist[index] = { ...changedObj }
      console.log('reducers', instlist)
      return {
        ...state,
        otherInstStrucList: instlist
      }
    }
    case actionTypes.UPDATE_INST_FINE_AMOUNT: {
      const instTypList = [...state.feeStructureList]
      // console.log('feeStructure before', instTypList)
      // console.log('feeStructure before state', state.feeStructureList)
      // console.log('feeStructure actions data', action.payload.data)
      const index = instTypList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      // console.log('feeStructure index', index)
      instTypList[index] = action.payload.data
      // console.log('feeStructure final data', instTypList)
      return {
        ...state,
        feeStructureList: instTypList
      }
    }
    case actionTypes.UPDATE_OTHR_FINE_AMT: {
      const instOthrTypList = [...state.otherInstStrucList]
      // console.log('feeStructure before', instTypList)
      // console.log('feeStructure before state', state.feeStructureList)
      // console.log('feeStructure actions data', action.payload.data)
      const index = instOthrTypList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      // console.log('feeStructure index', index)
      instOthrTypList[index] = action.payload.data
      // console.log('feeStructure final data', instTypList)
      return {
        ...state,
        otherInstStrucList: instOthrTypList
      }
    }
    case actionTypes.FETCH_STUDENT_DUES: {
      return {
        ...state,
        studentDues: action.payload.data
      }
    }
    case actionTypes.FETCH_BACK_DATE_CONCESSION: {
      return {
        ...state,
        backDate: action.payload.data
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default feeStructureReducer
