import * as actionTypes from '../actions'

const initialState = {
  branchPerSession: [],
  multipleBranchPerSession: [],
  dataLoader: false,
  gradeList: [],
  sectionsPerGrade: [],
  subjects: [],
  groups: [],
  gradesPerBranch: [],
  multGradesPerBranch: [],
  pdfData: [],
  branchAtAcc: [],
  ifscDetails: [],
  micrDetails: [],
  dateFromServer: null,
  studentSearchForAdmin: [],
  financialYear: [],
  ledgerType: [],
  instaDetails: [],
  sectionsPerGradeAdminAllOpt: [],
  deviceId: []
}

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_DEVICE_ID: {
      return {
        ...state,
        deviceId: action.payload.data
      }
    }
    case actionTypes.FETCH_FINANCIAL_YEAR: {
      return {
        ...state,
        financialYear: action.payload.data
      }
    }
    case actionTypes.FETCH_BRANCH_PER_SESSION: {
      const branchPerSessionNew = [...action.payload.branches]
      const multipleBranches = [...action.payload.branches]
      if (multipleBranches.length) {
        multipleBranches.unshift({
          branch: {
            branch_name: 'All Branches',
            id: 'all'
          }
        })
      }
      return {
        ...state,
        branchPerSession: branchPerSessionNew,
        multipleBranchPerSession: multipleBranches
      }
    }
    case actionTypes.DATA_LOADING: {
      return {
        ...state,
        dataLoader: true
      }
    }
    case actionTypes.DATA_LOADED: {
      return {
        ...state,
        dataLoader: false
      }
    }
    case actionTypes.GRADE_LIST : {
      console.log('===>grade<===', action.payload)
      return {
        ...state,
        gradeList: action.payload.data
      }
    }
    case actionTypes.SECTIONS_PER_GRADE: {
      console.log('===>sections<===', action.payload)
      return {
        ...state,
        sectionsPerGrade: action.payload.data
      }
    }
    case actionTypes.SECTIONS_PER_GRADE_AS_ADMIN: {
      console.log('===>sections<===', action.payload)
      const a = [...action.payload.data]
      a.unshift({
        section: {
          id: 'all',
          section_name: 'All Section'
        }
      })
      return {
        ...state,
        sectionsPerGradeAdmin: action.payload.data,
        sectionsPerGradeAdminAllOpt: a
      }
    }
    case actionTypes.FETCH_SUBJECTS: {
      console.log('===>subjects<===', action.payload)
      return {
        ...state,
        subjects: action.payload.data
      }
    }
    case actionTypes.FETCH_CLASS_GROUP: {
      console.log('===>groups<===', action.payload)
      return {
        ...state,
        groups: action.payload.data
      }
    }
    case actionTypes.FETCH_STUDENT_SUGGESTIONS_BY_NAME_ADMIN: {
      console.log('===>erpSuggetions<===', action.payload)
      return {
        ...state,
        studentSearchForAdmin: action.payload.data
      }
    }
    case actionTypes.FETCH_STUDENT_INFO_ADMIN: {
      console.log('===>erpSuggetions<===', action.payload)
      return {
        ...state,
        studentSearchForAdmin: action.payload.data
      }
    }
    case actionTypes.FEE_TRANSACTION_RECEIPT: {
      return {
        ...state,
        pdfData: action.payload.data
      }
    }
    case actionTypes.CLEAR_PDF_DATA: {
      return {
        ...state,
        pdfData: []
      }
    }
    case actionTypes.GRADE_LIST_PER_BRANCH : {
      // console.log('----GRade per branch-------------', action.payload)
      const allGrades = [...action.payload.data]
      const multipleGrades = [...action.payload.data]
      multipleGrades.unshift({
        grade: {
          grade: 'All Grades',
          id: 'all'
        }
      })
      return {
        ...state,
        gradesPerBranch: allGrades,
        multGradesPerBranch: multipleGrades
      }
    }
    case actionTypes.GET_BRANCH : {
      // console.log('----GEt Branch-------------', action.payload)
      return {
        ...state,
        branchAtAcc: action.payload.data
      }
    }
    case actionTypes.FETCH_IFSC : {
      return {
        ...state,
        ifscDetails: action.payload.data
      }
    }
    case actionTypes.FETCH_MICR : {
      return {
        ...state,
        micrDetails: action.payload.data
      }
    }
    case actionTypes.FETCH_DATE : {
      return {
        ...state,
        dateFromServer: action.payload.data
      }
    }
    case actionTypes.FETCH_LEDGER_TYPE: {
      return {
        ...state,
        ledgerType: action.payload.data
      }
    }
    case actionTypes.FETCH_INSTA_DETAILS: {
      return {
        ...state,
        instaDetails: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default commonReducer
