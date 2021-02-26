import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  appDetails: [],
  gradeData: null,
  applicationNum: null,
  finalRecords: null,
  stdSuggestions: [],
  leadNumberCheck: null
}

const registrationFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.APP_MOBILE_CHECKER : {
      return {
        ...state,
        leadNumberCheck: action.payload.data
      }
    }
    case actionTypes.FETCH_ALL_APPLICATION_DETAILS : {
      return {
        ...state,
        appDetails: action.payload.data,
        leadNumberCheck: null,
        finalRecords: null
      }
    }
    case actionTypes.FETCH_GRADES : {
      return {
        ...state,
        gradeData: action.payload.data
      }
    }
    case actionTypes.SAVE_ALL_FORMDATA : {
      console.log('app no', action.payload.data)
      return {
        ...state,
        applicationNum: action.payload.data
      }
    }
    case actionTypes.SAVE_APP_PAYMENT : {
      return {
        ...state,
        finalRecords: action.payload.data
        // appDetails: []
      }
    }
    case actionTypes.STD_SUGGESTIONS : {
      return {
        ...state,
        stdSuggestions: action.payload.data,
        leadNumberCheck: null,
        appDetails: []
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
