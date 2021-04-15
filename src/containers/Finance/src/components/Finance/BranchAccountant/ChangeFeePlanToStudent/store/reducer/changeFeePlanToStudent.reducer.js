import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  gradeData: null,
  sectionData: null,
  studentList: [],
  feePlans: null,
  adjustFeeData: [],
  excelData: {}
}

const changeFeePlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_GRADES : {
      const newGrades = [...action.payload.data]
      const allGrades = newGrades.map(grades => (grades.grade.id
      ))
      // newGrades.unshift({
      //   grade: {
      //     grade: 'All Grades',
      //     id: allGrades
      //   }
      // })
      return {
        ...state,
        gradeData: newGrades
      }
    }
    case actionTypes.FETCH_ALL_SECTIONS : {
      const newSections = [...action.payload.data]
      const allSections = newSections.map(sections => (sections.section.id))
      // newSections.unshift({
      //   section: {
      //     section_name: 'All Sections',
      //     id: allSections
      //   }
      // })
      return {
        ...state,
        sectionData: newSections
      }
    }
    case actionTypes.FETCH_ALL_PLANS : {
      return {
        ...state,
        studentList: action.payload.data
      }
    }
    case actionTypes.CURRENT_FEE_PLAN : {
      const newList = [...state.studentList]
      const filteredList = newList.filter(student => student.fee_plan_name.fee_plan_name.includes(action.payload.data))
      return {
        ...state,
        studentList: filteredList
      }
    }
    case actionTypes.FETCH_ADJUST_FEE : {
      return {
        ...state,
        adjustFeeData: action.payload.data
      }
    }
    case actionTypes.FETCH_ALL_FEE_PLANS : {
      return {
        ...state,
        feePlans: action.payload.data
      }
    }
    case actionTypes.ADJUST_SAVE_FEE_TYPES : {
      const erpList = Object.keys(action.payload.data)
      const copyList = [...state.studentList]
      erpList.map(erp => {
        copyList.map(student => {
          if (erp === student.student.erp) {
            const filtered = Object.keys(action.payload.data)
              .filter(key => [erp].includes(key))
              .reduce((obj, key) => {
                obj[key] = action.payload.data[key]
                return obj
              }, {})
            for (let [, value] of Object.entries(filtered)) {
              student.fee_plan_name.id = value.fee_plan_id
              student.fee_plan_name.fee_plan_name = value.fee_plan
              student.total = value.fee_plan_Amount || 0
            }
          }
        })
      })
      return {
        ...state,
        excelData: action.payload.data,
        studentList: copyList
      }
    }
    case actionTypes.EDIT_STUDENT_FEE_PLAN : {
      const editStudentList = [...state.studentList]
      action.payload.data.map((e) => e.erp_code).forEach(ele => {
        const index = editStudentList.findIndex(item => item.student.erp === ele)
        if (index !== -1) {
          let id = null
          let fee = null
          let status = null
          let feePlan = null
          action.payload.data.map((e) => {
            if (e.erp_code === ele) {
              id = e.fee_plan_name_id
              fee = e.fee_plan_name
              status = e.Status
              feePlan = e.fee_plan
            }
          })
          const feePlanName = {
            id: id,
            fee_plan_name: fee,
            status: status,
            fee_plan: feePlan
            // id: action.payload.data.map((e) => {
            //   return (
            //     e.fee_plan_name_id
            //   )
            // }),

            // 'fee_plan_name': action.payload.data.map((e) => {
            //   return (
            //     e.fee_plan_name
            //   )
            // }),
            // 'status': action.payload.data.map((e) => {
            //   return (
            //     e.Status
            //   )
            // }),
            // 'fee_plan': action.payload.data.map((e) => {
            //   return (
            //     e.fee_plan
            //   )
            // })
          }
          editStudentList[index].fee_plan_name = feePlanName
        }
      })
      // editStudentList.map((ele, i) => {
      //   action.payload.data.erp_code.forEach(element => {
      //     if (element === ele.student.erp) {
      //       const changeObj = { ...editStudentList[i] }
      //       changeObj.fee_plan_name.id = action.payload.data.fee_plan_name_id ? action.payload.data.fee_plan_name_id : null
      //       changeObj.fee_plan_name.fee_plan_name = action.payload.data.fee_plan_name ? action.payload.data.fee_plan_name : null
      //       editStudentList[i] = { ...changeObj }
      //     }
      //   })
      // })

      return {
        ...state,
        studentList: editStudentList
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default changeFeePlanReducer
