import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  registrationDetails: [],
  regList: [],
  regNum: null,
  finalRecords: null,
  appSugg: null
}

const registrationFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_STUDENT_INFO : {
      return {
        ...state,
        registrationDetails: action.payload.data,
        finalRecords: null
      }
    }
    case actionTypes.FETCH_REG_LIST : {
      return {
        ...state,
        regList: action.payload.data
      }
    }
    case actionTypes.CREATE_REG_NUM : {
      return {
        ...state,
        regNum: action.payload.data
      }
    }
    case actionTypes.SAVE_ALL_PAYMENT : {
      return {
        ...state,
        finalRecords: action.payload.data
      }
    }
    case actionTypes.APP_SUGG : {
      return {
        ...state,
        appSugg: action.payload.data
      }
    }
    case actionTypes.CLEAR_NEW_REG_FORM_PROPS : {
      return {
        ...state,
        registrationDetails: []
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default registrationFormReducer
