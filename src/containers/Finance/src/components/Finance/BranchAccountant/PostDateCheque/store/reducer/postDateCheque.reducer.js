import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  gradeData: null,
  pdcList: []
}

const pdcReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ALL_GRADES : {
      console.log('==> all grades in acc ==<', action.payload)
      const gradelist = [...action.payload.data]
      const allGrades = gradelist.map(grades => (grades.grade.id
      ))
      gradelist.unshift({
        grade: {
          grade: 'All Grades',
          id: allGrades
        }
      })
      return {
        ...state,
        gradeData: gradelist
      }
    }
    case actionTypes.FETCH_ALL_PDC : {
      return {
        ...state,
        pdcList: action.payload.data
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default pdcReducer
