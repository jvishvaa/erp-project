import * as actionTypes from '../../../store/actions'

const initialState = {
  feeTypeList: [],
  itcList: [],
  showAddButton: false
}

const itCertificateReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_FEE_TYPE: {
      return {
        ...state,
        feeTypeList: action.payload.data
      }
    }
    case actionTypes.FETCH_ITC_LIST: {
      return {
        ...state,
        itcList: action.payload.data,
        showAddButton: true
      }
    }
    case actionTypes.SAVE_FEE_TYPE: {
      const ITList = [...state.itcList]
      action.payload.data.forEach(data => {
        ITList.push({
          id: data.id ? data.id : '',
          fee_type_name: data.fee_type_name ? data.fee_type_name : ''
        })
      })
      return {
        ...state,
        itcList: ITList
      }
    }
    case actionTypes.DELETE_ITC_LIST: {
      const listITC = [...state.itcList]
      const updatedItcList = listITC.filter(itc => {
        return itc.id !== action.payload.id
      })
      return {
        ...state,
        itcList: updatedItcList
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default itCertificateReducer
