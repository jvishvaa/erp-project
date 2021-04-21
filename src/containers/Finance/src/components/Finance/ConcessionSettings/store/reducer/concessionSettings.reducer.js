import * as actionTypes from '../../../store/actions/index'

const initialState = {
  listFeeType: [],
  concessionFeeType: [],
  listConcessions: [],
  listConcessionType: null
}

const concessionFeeTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LIST_CONCESSION_SETTINGS: {
      return {
        ...state,
        listConcessions: action.payload.data
      }
    }
    case actionTypes.ADD_CONCESSION_TYPES: {
      const listConcessionType = { ...state.listConcessionType }
      const list = listConcessionType.concession_type ? [...listConcessionType.concession_type] : []
      list.push({
        id: action.payload.data.id ? action.payload.data.id : '',
        type_name: action.payload.data.type_name ? action.payload.data.type_name : ''
      })
      listConcessionType.concession_type = list
      return {
        ...state,
        listConcessionType
      }
    }
    case actionTypes.UPDATE_LIST_CONCESSION_SETTINGS: {
      const concessionList = [...state.listConcessions]
      const index = concessionList.findIndex(ele => {
        return ele.id === action.payload.data.id
      })
      const changeObj = { ...concessionList[index] }
      changeObj.id = action.payload.data.id ? action.payload.data.id : ''
      changeObj.Fixed_amount = action.payload.data.Fixed_amount ? action.payload.data.Fixed_amount : ''
      changeObj.concession_name = action.payload.data.concession_name ? action.payload.data.concession_name : ''
      changeObj.concession_type = action.payload.data.concession_type ? action.payload.data.concession_type : ''
      changeObj.adjustment_type = action.payload.data.adjustment_type ? action.payload.data.adjustment_type : ''
      changeObj.min_amount = action.payload.data.min_amount ? action.payload.data.min_amount : ''
      changeObj.automatic_concession_percentage = action.payload.data.automatic_concession_percentage ? action.payload.data.automatic_concession_percentage : ''
      changeObj.branch_level_limit_amount = action.payload.data.branch_level_limit_amount ? action.payload.data.branch_level_limit_amount : ''
      changeObj.adjustment_order = action.payload.data.adjustment_order ? action.payload.data.adjustment_order : ''
      concessionList[index] = { ...changeObj }
      return {
        ...state,
        listConcessions: concessionList
      }
    }
    case actionTypes.ADD_LIST_CONCESSION_SETTINGS: {
      const addedConcessionList = [...state.listConcessions]
      addedConcessionList.push({
        Sr: action.payload.data.length ? action.payload.data.length + 1 : 1,
        id: action.payload.data.id ? action.payload.data.id : '',
        concession_name: action.payload.data.concession_name ? action.payload.data.concession_name : '',
        concession_type: action.payload.data.concession_type ? action.payload.data.concession_type : '',
        adjustment_type: action.payload.data.adjustment_type ? action.payload.data.adjustment_type : '',
        min_amount: action.payload.data.min_amount ? action.payload.data.min_amount : '',
        automatic_concession_percentage: action.payload.data.automatic_concession_percentage ? action.payload.data.automatic_concession_percentage : '',
        branch_level_limit_amount: action.payload.data.branch_level_limit_amount ? action.payload.data.branch_level_limit_amount : '',
        adjustment_order: action.payload.data.adjustment_order ? action.payload.data.adjustment_order : ''
      })
      return {
        ...state,
        listConcessions: addedConcessionList
      }
    }
    case actionTypes.LIST_CONCESSION_TYPES: {
      return {
        ...state,
        listConcessionType: action.payload.data
      }
    }
    case actionTypes.LIST_FEE_TYPE: {
      return {
        ...state,
        listFeeType: action.payload.data
      }
    }
    case actionTypes.ADD_LIST_FEE_TYPE: {
      const addedFeeTypeList = [...state.listFeeType]
      addedFeeTypeList.push({
        id: action.payload.data.id ? action.payload.data.id : '',
        fee_type: [{
          fee_type_name: action.payload.data.fee_type_name ? action.payload.data.fee_type_name : '',
          id: action.payload.data.fee_type_id ? action.payload.data.fee_type_id : ''
        }]
      })
      return {
        ...state,
        listFeeType: addedFeeTypeList
      }
    }
    case actionTypes.CONCESSION_FEE_TYPE_PER_FEE_TYPE: {
      return {
        ...state,
        concessionFeeType: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default concessionFeeTypeReducer
