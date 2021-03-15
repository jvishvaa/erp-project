import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  studentAdmission: null,
  studentDetailsforAdmisssion: null,
  studentAdmissionCertificates: null,
  feePlans: null,
  installmentsPlans: null,
  admissionrecords: [],
  redirect: false,
  otherSugg: [],
  receiptGen: null
}

const admissionFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.POST_ADMISSION : {
      return {
        ...state,
        redirect: false,
        receiptGen: action.payload.data
      }
    }
    case actionTypes.GET_STUDENT_DETAILS_BY_REG_NO : {
      return {
        ...state,
        studentDetailsforAdmisssion: action.payload.data,
        installmentsPlans: null,
        receiptGen: null,
        redirect: false
      }
    }
    case actionTypes.GET_STUDENT_DETAILS_BY_APP_NO : {
      return {
        ...state,
        studentDetailsforAdmisssion: action.payload.data,
        installmentsPlans: null,
        receiptGen: null,
        redirect: false
      }
    }
    case actionTypes.SEARCH_STUDENT_DETAILS_BY_REG_NO : {
      return {
        ...state,
        regNoSuggestion: action.payload.data,
        redirect: false
      }
    }
    case actionTypes.SEARCH_STUDENT_DETAILS_BY_APP_NO : {
      return {
        ...state,
        appNoSuggestion: action.payload.data,
        redirect: false
      }
    }
    case actionTypes.GET_ADMISSSION_RECORDS : {
      return {
        ...state,
        admissionrecords: action.payload.data,
        installmentsPlans: null,
        receiptGen: null,
        redirect: false
      }
    }
    case actionTypes.FETCH_ADMISSION_RECORD_BY_ERP : {
      return {
        ...state,
        admissionrecordbyerp: action.payload.data,
        installmentsPlans: null,
        receiptGen: null,
        redirect: false
      }
    }
    case actionTypes.FETCH_STUDENT_ADMISSION_CERTIFICATES : {
      return {
        ...state,
        studentAdmissionCertificates: action.payload.data,
        redirect: false
      }
    }
    case actionTypes.POST_ADMISSION_CERTIFICATE : {
      return {
        ...state,
        redirect: false
      }
    }
    case actionTypes.SEARCH_ADMISSION_OTHERS : {
      return {
        ...state,
        otherSugg: action.payload.data
      }
    }
    case actionTypes.PUT_ADMISSION : {
      return {
        ...state,
        redirect: true
      }
    }
    case actionTypes.GET_FEE_DETAILS : {
      return {
        ...state,
        feePlans: action.payload.data,
        redirect: false
      }
    }
    case actionTypes.GET_FEE_INSTALLMENT : {
      return {
        ...state,
        installmentsPlans: action.payload.data,
        redirect: false
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}
export default admissionFormReducer
