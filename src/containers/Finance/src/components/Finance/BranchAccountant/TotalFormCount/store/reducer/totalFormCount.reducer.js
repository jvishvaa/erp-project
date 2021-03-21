import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  formCount: null,
  formList: null,
  modeDetails: {},
  branchList: null
  // closeModal: null
}

const totalFormCountReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_FORM_COUNT : {
      return {
        ...state,
        formCount: action.payload.data
      }
    }
    case actionTypes.FETCH_ALL_APP_LIST : {
      return {
        ...state,
        formList: action.payload.data
      }
    }
    case actionTypes.FETCH_FORM_MODE_DETAILS: {
      return {
        ...state,
        modeDetails: action.payload.data
      }
    }
    case actionTypes.UPDATE_TRANSACTION_MODE: {
      return {
        ...state
        // closeModal: action.payload.data
      }
    }
    case actionTypes.BRANCH_LIST: {
      return {
        ...state,
        branchList: action.payload.data
      }
    }
    case actionTypes.DELETE_FORMS: {
      const newList = { ...state.formList }
      const newResult = [...newList.results]
      let newFormList = []
      if (action.payload.data.type === 'application') {
        newFormList = newResult.filter(form => {
          return form.application_number !== action.payload.data.num
        })
      } else if (action.payload.data.type === 'registration') {
        newFormList = newResult.filter(form => {
          return form.registration_number !== action.payload.data.num
        })
      } else {
        newFormList = newResult.filter(form => {
          return form.admission_number !== action.payload.data.num
        })
      }
      newList.results = newFormList
      return {
        ...state,
        formList: newList
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default totalFormCountReducer
