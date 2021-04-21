import { combineReducers } from 'redux'

import { authentication } from './authentication.reducer'
import { users } from './users.reducer'
import { alert } from './alert.reducer'
import { branches } from './branches.reducer'
import { designations } from './designation.reducer'
import { roles } from './roles.reducer'
import { smsTypes } from './smsTypes.reducer'
import { department } from './department.reducer'
import { gradeCategory } from './gradeCategory.reducer'
import { sections } from './section.reducer'
import { subjects } from './subject.reducer'
import { academicSession } from './academicSession.reducer'

import { grades } from './grade.reducer'
import { staffs } from './staff.reducer'
import { student } from './student.reducer'
import { staffSearch } from './staffSearch.reducer'
import { studentSearch } from './studentSearch.reducer'

import { gradeMap } from './gradeMap.reducer'
import { subjectMap } from './subjectMap.reducer'
import { sectionMap } from './sectionMap.reducer'
import { questionType } from './questionType.reducer'
import { questionLevel } from './questionLevel.reducer'
import { questionCategory } from './questionCategory.reducer'
import { gradeSubject } from './gradeSubject.reducer'
import { chapter } from './chapter.reducer'
import { listGradeCategoryId } from './listGradeCategoryId.reducer'
import { listTests } from './listTests.reducer'
import { onlineTest } from './onlineTest.reducer'
import { globalSearch } from './globalSearch.reducer'
import { globalSearchStaff } from './globalSearchStaff.reducer'
import { globalSearchStudent } from './globalSearchStudent.reducer'
import { filter } from './filter.reducer'
import { view } from './view.reducer'
import { filterIndex } from './filterIndex.reducer'
import finance from '../components/Finance/store/reducer'
import inventory from '../components/Inventory/store/reducer/inventory.reducer'
import { studentAssessment } from './studentAssessment.reducer'
import { classgrouptypes } from './classGroupType.reducer'

import { userConstants } from '../_constants'

const appReducer = combineReducers({
  authentication,
  users,
  alert,
  branches,
  designations,
  roles,
  smsTypes,
  department,
  view,
  gradeCategory,
  sections,
  subjects,
  academicSession,
  grades,
  staffs,
  student,
  staffSearch,
  globalSearch,
  globalSearchStaff,
  globalSearchStudent,
  studentSearch,
  filter,
  filterIndex,
  gradeMap,
  subjectMap,
  sectionMap,
  questionType,
  questionLevel,
  questionCategory,
  gradeSubject,
  chapter,
  listGradeCategoryId,
  listTests,
  onlineTest,
  finance,
  inventory,
  studentAssessment,
  classgrouptypes
})

const rootReducer = (state, action) => {
  if (action.type === userConstants.LOGOUT) {
    state = {
      ...state,
      finance: undefined,
      inventory: undefined
    }
  }

  return appReducer(state, action)
}

export default rootReducer
