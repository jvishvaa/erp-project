import { apiService } from '../_services'
import { apiConstants } from '../_constants'

export const apiActions = {
  listBranches,
  listDesignations,
  listStaffsSearch,
  listStaffsTab,
  listStudentSearch,
  listQuestionPaperSearch,
  listQuestionSearch,
  globalSearchStaff,
  globalSearch,
  listRoles,
  globalSearchStudent,
  listDepartments,
  listGradeCategories,
  listSections,
  listSubjects,
  listAcademicSessions,
  listGrades,
  listStaffs,
  listStudents,
  addStudent,
  getGradeMapping,
  getGradeMappings,
  getSubjectMapping,
  getSectionMapping,
  getSectionMappings,
  listQuestionType,
  listQuestionLevel,
  listQuestionCategory,
  listGradesChapter,
  listChapter,
  listGradeCategoryId,
  listTests,
  getOnlineTest,
  listSmsTypes,
  getStudentAssessment,
  listClassGroupType,
  listStudentsV2
}

function listBranches () {
  return dispatch => {
    dispatch(request())
    apiService.listBranches()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }

  function request () { return { type: apiConstants.BRANCH_REQUEST } }
  function success (data) { return { type: apiConstants.BRANCH_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.BRANCH_FAILURE, error } }
}

function listDesignations () {
  return dispatch => {
    dispatch(request())
    apiService.listDesignations()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }

  function request () { return { type: apiConstants.DESIGNATION_REQUEST } }
  function success (data) { return { type: apiConstants.DESIGNATION_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.DESIGNATION_FAILURE, error } }
}

function listRoles () {
  return dispatch => {
    dispatch(request())
    apiService.listRoles()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }

  function request () { return { type: apiConstants.ROLE_REQUEST } }
  function success (data) { return { type: apiConstants.ROLE_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.ROLE_FAILURE, error } }
}
function listSmsTypes () {
  return dispatch => {
    dispatch(request())
    apiService.listSmsTypes()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }

  function request () { return { type: apiConstants.SMSTYPES_REQUEST } }
  function success (data) { return { type: apiConstants.SMSTYPES_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.SMSTYPES_FAILURE, error } }
}

function listDepartments () {
  return dispatch => {
    dispatch(request())
    apiService.listDepartments()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }

  function request () { return { type: apiConstants.DEPARTMENT_REQUEST } }
  function success (data) { return { type: apiConstants.DEPARTMENT_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.DEPARTMENT_FAILURE, error } }
}

function listGradeCategories () {
  return dispatch => {
    dispatch(request())
    apiService.listGradeCategories()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }

  function request () { return { type: apiConstants.GRADECATEGORY_REQUEST } }
  function success (data) { return { type: apiConstants.GRADECATEGORY_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.GRADECATEGORY_FAILURE, error } }
}

function listSections () {
  return dispatch => {
    dispatch(request())
    apiService.listSections()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }

  function request () { return { type: apiConstants.SECTION_REQUEST } }
  function success (data) { return { type: apiConstants.SECTION_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.SECTION_FAILURE, error } }
}

function listAcademicSessions () {
  return dispatch => {
    dispatch(request())
    apiService.listAcademicSessions()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }

  function request () { return { type: apiConstants.ACADEMICSESSION_REQUEST } }
  function success (data) { return { type: apiConstants.ACADEMICSESSION_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.ACADEMICSESSION_FAILURE, error } }
}

function listGrades () {
  return dispatch => {
    dispatch(request())
    apiService.listGrades()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  // eslint-disable-next-line
  debugger
  function request () { return { type: apiConstants.GRADE_REQUEST } }
  function success (data) { return { type: apiConstants.GRADE_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.GRADE_FAILURE, error } }
}
function listSubjects (gradeId, islanguage) {
  return dispatch => {
    dispatch(request())
    apiService.listSubjects(gradeId, islanguage)
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }

  function request () { return { type: apiConstants.SUBJECT_REQUEST } }
  function success (data) { return { type: apiConstants.SUBJECT_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.SUBJECT_FAILURE, error } }
}
function listStaffs (branchId, pageId, departmentId) {
  return dispatch => {
    dispatch(request())
    apiService.listStaffs(branchId, pageId, departmentId)
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.STAFF_REQUEST } }
  function success (data) { return { type: apiConstants.STAFF_SUCCESS, data: data, branchId } }
  function failure (error) { return { type: apiConstants.STAFF_FAILURE, error } }
}
function listStaffsTab (branchId, pageId, isDelete) {
  return {
    type: apiConstants.STAFF_TAB,
    promise: apiService.listStaffsTab(branchId, pageId, isDelete),
    meta: {
      onSuccess: (response) => console.log(response)
    }
  }
}
function listStaffsSearch (branchId, pageId, isDelete, role, search) {
  return {
    type: apiConstants.STAFF_SEARCH,
    promise: apiService.listStaffsSearch(branchId, pageId, isDelete, role, search),
    meta: {
      onSuccess: (response) => console.log(response)
    }
  }
}
function listStudents (acadsectionmapping, status, pageId, isDelete) {
  return dispatch => {
    dispatch(request())
    apiService.listStudents(acadsectionmapping, status, pageId, isDelete)
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.STUDENTS_REQUEST } }
  function success (data) { return { type: apiConstants.STUDENTS_SUCCESS, data: data, acadsectionmapping } }
  function failure (error) { return { type: apiConstants.STUDENTS_FAILURE, error } }
}
function listStudentSearch (role, search, sectionMappingId, pageId, isActive, isDelete) {
  return {
    type: apiConstants.STUDENT_SEARCH,
    promise: apiService.listStudentSearch(role, search, sectionMappingId, pageId, isActive.toLowerCase(), isDelete.toLowerCase())
  }
}
function listQuestionPaperSearch (role, search) {
  return {
    type: apiConstants.QUESTIONPAPER_SEARCH,
    Promise: apiService.listQuestionPaperSearch(role, search)
  }
}
function listQuestionSearch (role, search) {
  return {
    type: apiConstants.LISTQUESTION_SEARCH,
    promise: apiService.listQuestionSearch(role, search)
  }
}
function addStudent (studentData) {
  if (studentData === 'fail') {
    return dispatch => dispatch(errorReset())
  } else {
    return dispatch => {
      dispatch(request())
      apiService.addStudent(studentData)
        .then(
          data => dispatch(success(data)),
          error => dispatch(failure(error))
        )
    }
  }
  function request () { return { type: apiConstants.STUDENT_REQUEST } }
  function success (data) { return { type: apiConstants.STUDENT_SUCCESS, data: data } }
  function failure (error) { return { type: apiConstants.STUDENT_FAILURE, error } }
  function errorReset () { return { type: apiConstants.STUDENT_ERROR_RESET } }
}
function getGradeMapping (branchId, isDelete) {
  return dispatch => {
    dispatch(request())
    apiService.getGradeMapping(branchId, isDelete)
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.GRADEMAP_REQUEST } }
  function success (data) { return { type: apiConstants.GRADEMAP_SUCCESS, data: data } }
  function failure (error) { return { type: apiConstants.GRADEMAP_FAILURE, error } }
}

function getGradeMappings (branchId) {
  return dispatch => {
    dispatch(request())
    apiService.getGradeMappings(branchId)
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.GRADEMAP_REQUEST } }
  function success (data) { return { type: apiConstants.GRADEMAP_SUCCESS, data: data } }
  function failure (error) { return { type: apiConstants.GRADEMAP_FAILURE, error } }
}

function getSubjectMapping (acadMapId) {
  return dispatch => {
    dispatch(request())
    apiService.getSubjectMapping(acadMapId)
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.SUBJECTMAP_REQUEST } }
  function success (data) { return { type: apiConstants.SUBJECTMAP_SUCCESS, data: data } }
  function failure (error) { return { type: apiConstants.SUBJECTMAP_FAILURE, error } }
}
function getSectionMapping (acadMapId, includeDeletedSections, isDelete) {
  return dispatch => {
    dispatch(request())
    apiService.getSectionMapping(acadMapId, includeDeletedSections, isDelete)
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.SECTIONMAP_REQUEST } }
  function success (data) { return { type: apiConstants.SECTIONMAP_SUCCESS, data: data } }
  function failure (error) { return { type: apiConstants.SECTIONMAP_FAILURE, error } }
}

function getSectionMappings (acadMapId, branchId, gradeId) {
  return dispatch => {
    dispatch(request())
    apiService.getSectionMappings(acadMapId, branchId, gradeId)
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.SECTIONMAP_REQUEST } }
  function success (data) { return { type: apiConstants.SECTIONMAP_SUCCESS, data: data } }
  function failure (error) { return { type: apiConstants.SECTIONMAP_FAILURE, error } }
}
function listQuestionType () {
  return dispatch => {
    dispatch(request())
    apiService.listQuestionType()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.QUESTIONTYPE_REQUEST } }
  function success (data) { return { type: apiConstants.QUESTIONTYPE_SUCCESS, data: data } }
  function failure (error) { return { type: apiConstants.QUESTIONTYPE_FAILURE, error } }
}

function listQuestionLevel () {
  return dispatch => {
    dispatch(request())
    apiService.listQuestionLevel()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.QUESTIONLEVEL_REQUEST } }
  function success (data) { return { type: apiConstants.QUESTIONLEVEL_SUCCESS, data: data } }
  function failure (error) { return { type: apiConstants.QUESTIONLEVEL_FAILURE, error } }
}

function globalSearchStaff (searchParameter, pageId, isDelete) {
  return {
    type: apiConstants.GLOBAL_SEARCH_STAFF,
    promise: apiService.globalSearchStaff(searchParameter, pageId, isDelete)
  }
}
function globalSearch (searchParameter, pageId, branchId, isDelete) {
  return {
    type: apiConstants.GLOBAL_SEARCH,
    promise: Promise.all([apiService.globalSearchStaff(searchParameter, pageId, branchId, false), apiService.globalSearchStudent(searchParameter, pageId, false)])
  }
}
function globalSearchStudent (searchParameter, pageId, isDelete) {
  console.log('List of students searched...')
  return {
    type: apiConstants.GLOBAL_SEARCH_STUDENT,
    promise: apiService.globalSearchStudent(searchParameter, pageId, isDelete)
  }
}

function listQuestionCategory () {
  return dispatch => {
    dispatch(request())
    apiService.listQuestionCategory()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.QUESTIONCATEGORY_REQUEST } }
  function success (data) { return { type: apiConstants.QUESTIONCATEGORY_SUCCESS, data: data } }
  function failure (error) { return { type: apiConstants.QUESTIONCATEGORY_FAILURE, error } }
}
function listGradesChapter (sub) {
  return dispatch => {
    dispatch(request())
    apiService.listGradesChapter(sub)
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.GRADECHAPTER_REQUEST } }
  function success (data) { return { type: apiConstants.GRADECHAPTER_SUCCESS, data: data } }
  function failure (error) { return { type: apiConstants.GRADECHAPTER_FAILURE, error } }
}
function listChapter (sub, grd) {
  return dispatch => {
    dispatch(request())
    apiService.listChapter(sub, grd)
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.CHAPTER_REQUEST } }
  function success (data) { return { type: apiConstants.CHAPTER_SUCCESS, data: data } }
  function failure (error) { return { type: apiConstants.CHAPTER_FAILURE, error } }
}

function listGradeCategoryId (gradecategory) {
  console.log(gradecategory, 'action file')
  return dispatch => {
    dispatch(request())
    apiService.listGradeCategoryId(gradecategory)
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.LISTGRADECATEGORYID_REQUEST } }
  function success (data) { return { type: apiConstants.LISTGRADECATEGORYID_SUCCESS, data: data, gradecategory } }
  function failure (error) { return { type: apiConstants.LISTGRADECATEGORYID_FAILURE, error } }
}

function listTests () {
  return dispatch => {
    dispatch(request())
    apiService.listTests()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }

  function request () { return { type: apiConstants.LISTTESTS_REQUEST } }
  function success (data) { return { type: apiConstants.LISTTESTS_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.LISTTESTS_FAILURE, error } }
}

function getOnlineTest (id, userId) {
  return dispatch => {
    dispatch(request())
    apiService.getOnlineTest(id, userId)
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }

  function request () { return { type: apiConstants.GETONLINETEST_REQUEST } }
  function success (data) { return { type: apiConstants.GETONLINETEST_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.GETONLINETEST_FAILURE, error } }
}

function getStudentAssessment () {
  return dispatch => {
    dispatch(request())
    apiService.getStudentAssessment()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.STUDENTASSESSMENT_REQUEST } }
  function success (data) { return { type: apiConstants.STUDENTASSESSMENT_SUCCESS, data: data } }
  function failure (error) { return { type: apiConstants.STUDENTASSESSMENT_FAILURE, error } }
}

function listClassGroupType () {
  return dispatch => {
    dispatch(request())
    apiService.listClassGroupType()
      .then(
        data => dispatch(success(data)),
        error => dispatch(failure(error))
      )
  }
  function request () { return { type: apiConstants.CLASSGROUPTYPE_REQUEST } }
  function success (data) { return { type: apiConstants.CLASSGROUPTYPE_SUCCESS, data } }
  function failure (error) { return { type: apiConstants.CLASSGROUPTYPE_FAILURE, error } }
}

function listStudentsV2 (acadsectionmapping, status, pageId, isDelete, pageSize, academicYear) {
  return {
    type: apiConstants.STUDENT_V2DATA,
    promise: apiService.listStudentsV2(acadsectionmapping, status, pageId, isDelete, pageSize, academicYear),
    meta: {
      onFailure: (response) => {
        console.log(`Error`)
      },
      onSuccess: (response) => {
        console.log(`Success`)
      }
    }
  }
}
