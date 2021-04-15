import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  promotionStudentList: [],
  studentPromoted: [],
  sectionsPerGrade: []
}

const studentPromotionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STUDENT_PROMOTION_LIST : {
      return {
        ...state,
        promotionStudentList: Array.isArray(action.payload.data) ? action.payload.data : []
      }
    }
    case actionTypes.STUDENT_PROMOTED_LIST : {
      let arr1 = [ ...state.promotionStudentList ]
      let arr2 = action.payload.data
      let unpromotedStudent = arr1.filter(el => {
        const index = arr2.findIndex(stud => stud.erp_code === el.student)
        return index < 0
      })
      return {
        ...state,
        promotionStudentList: unpromotedStudent
      }
    }
    case actionTypes.SECTIONS_GRADE: {
      let arr1 = [ ...action.payload.data ]
      arr1.unshift({ section: { id: 'All', section_name: 'All' } })
      return {
        ...state,
        sectionsPerGrade: arr1
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default studentPromotionReducer
