import { authHeader } from '../_helpers'
import { urls, qBUrls } from '../urls'

export const apiService = {
  listBranches,
  listDesignations,
  listRoles,
  listDepartments,
  listGradeCategories,
  listSections,
  listSubjects,
  listGrades,
  listAcademicSessions,
  listStaffs,
  listStaffsTab,
  listStudents,
  listStaffsSearch,
  addStudent,
  getGradeMapping,
  getGradeMappings,
  getSubjectMapping,
  getSectionMapping,
  getSectionMappings,
  listQuestionType,
  listQuestionLevel,
  listQuestionCategory,
  listQuestionPaperSearch,
  listGradesChapter,
  listChapter,
  listGradeCategoryId,
  listTests,
  getOnlineTest,
  listStudentSearch,
  globalSearchStaff,
  globalSearchStudent,
  globalSearch,
  listSmsTypes,
  getStudentAssessment,
  listClassGroupType,
  listStudentsV2
}

/* global fetch */

function listBranches () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(urls.BRANCH, requestOptions).then(handleResponse)
}

function listDesignations () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(urls.DESIGNATION, requestOptions).then(handleResponse)
}

function listRoles () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(urls.ROLE, requestOptions).then(handleResponse)
}
function listSmsTypes () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(urls.SmsTypes, requestOptions).then(handleResponse)
}
function listDepartments () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(urls.DEPARTMENT, requestOptions).then(handleResponse)
}

function listGradeCategories () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(urls.GRADECATEGORY, requestOptions).then(handleResponse)
}

function listSections () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(urls.SECTION, requestOptions).then(handleResponse)
}

function listSubjects (gradeId, islanguage) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  if (gradeId) {
    return fetch(`${urls.SUBJECT}?grade_id=${gradeId}`, requestOptions).then(handleResponse)
  } else if (islanguage) {
    return fetch(`${urls.SUBJECT}?is_language=${islanguage}`, requestOptions).then(handleResponse)
  } else {
    return fetch(urls.SUBJECT, requestOptions).then(handleResponse)
  }
}

function listGrades () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(urls.GRADE, requestOptions).then(handleResponse)
}

function listAcademicSessions (moduleId) {
  console.log('module id in services: ', moduleId)
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  if (moduleId) {
  return fetch(urls.UTILACADEMICSESSION + '?module_id=' + moduleId, requestOptions).then(handleResponse)
  } else {
    return fetch(urls.UTILACADEMICSESSION, requestOptions).then(handleResponse)
  }
}

function listStaffs (branchId, pageId, departmentId = -1) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  if (departmentId === -1) {
    return fetch(
      `${urls.Staff}?branch=${branchId}&page=${pageId}`,
      requestOptions
    ).then(handleResponse)
  } else {
    return fetch(
      `${urls.Staff}?branch=${branchId}&page=${pageId}&departmentId=${departmentId}`,
      requestOptions
    ).then(handleResponse)
  }
}
function listStudents (acadsectionmapping, status, pageId, isDelete) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  if (!isDelete) {
    return fetch(
      `${urls.Students}?acadsectionmapping=${acadsectionmapping}&status=${status}&page=${pageId}`,
      requestOptions
    ).then(handleResponse)
  } else {
    return fetch(
      `${urls.Students}?acadsectionmapping=${acadsectionmapping}&is_delete=${isDelete}&page=${pageId}`,
      requestOptions
    ).then(handleResponse)
  }
}
function listStaffsTab (branchId, pageId, isDelete) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(
    `${urls.StaffV2}?branch_id=${branchId}&page=${pageId}&is_delete=${isDelete}`,
    requestOptions
  ).then(handleResponse)
}
function listStaffsSearch (branchId, pageId, isDelete, role, search) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(
    `${urls.Search}?role=${role}&q=${search}&branch_id=${branchId}&page_no=${pageId}&is_delete=${isDelete}`,
    requestOptions
  ).then(handleResponse)
}
function globalSearchStaff (searchParameter, pageId, branchId, isDelete) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(
    `${urls.GlobalSearchStaff}?q=${searchParameter}&page=${pageId}${branchId ? `&branch_id=${branchId}` : ''}&is_delete=${isDelete}`,
    requestOptions
  ).then(handleResponse)
}
function globalSearchStudent (searchParameter, pageId, isDelete) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(
    `${urls.GlobalSearchStudent}?q=${searchParameter}&page=${pageId}&is_delete=${isDelete}`,
    requestOptions
  ).then(handleResponse)
}
function globalSearch (searchParameter, pageId, branchId, isDelete) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(
    `${urls.GlobalSearch}?q=${searchParameter}&page_no=${pageId}${branchId ? ('&branch_id=' + branchId) : ''}&is_delete=${isDelete}`,
    requestOptions
  ).then(handleResponse)
}
function listStudentSearch (role, search, sectionMappingId, pageId, isActive, isDelete) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(
    `${urls.STUDENTSEARCH}?role=${role}&q=${search}&sectionmapping_id=${sectionMappingId}&page_no=${pageId}&is_active=${isActive}&is_delete=${isDelete}`,
    requestOptions
  ).then(handleResponse)
}
function listQuestionPaperSearch (role, search) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${urls.SearchQuestionPapers}?role=${role}&q=${search}`, requestOptions).then(handleResponse)
}
function listQuestionType () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${urls.QuestionType}`, requestOptions).then(handleResponse)
}

function listQuestionLevel () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${urls.QuestionLevel}`, requestOptions).then(handleResponse)
}

function listQuestionCategory () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${urls.QuestionCategory}`, requestOptions).then(handleResponse)
}

function listGradesChapter (subject) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${qBUrls.Grades}?s_id=${subject}`, requestOptions).then(
    handleResponse
  )
}

function listChapter (subject, grade) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(
    `${urls.Chapter}?s_id=${subject}&g_id=${grade}`,
    requestOptions
  ).then(handleResponse)
}

function addStudent (studentData) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(studentData)
  }
  requestOptions.headers['Content-Type'] = 'application/json'
  return fetch(`${urls.Student}`, requestOptions).then(handleResponse)
}
function getGradeMapping (branchId, isDelete) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${urls.GradeMapping}?branch=${branchId}&is_delete=${isDelete}`, requestOptions).then(
    handleResponse
  )
}

function getGradeMappings (branchId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${urls.GRADEMAPPINGv2}?branch_id=${branchId}`, requestOptions).then(
    handleResponse
  )
}

function getSubjectMapping (acadMapId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(
    `${urls.SUBJECTMAPPING}?acad_branch_grade_mapping_id=${acadMapId}`,
    requestOptions
  ).then(handleResponse)
}
function getSectionMapping (acadMapId, includeDeletedSections, isDelete) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(
    `${urls.SectionMapping}?acad_branch_grade_mapping_id=${acadMapId}&include_deleted_sections=${includeDeletedSections}&is_delete=${isDelete}`,
    requestOptions
  ).then(handleResponse)
}

function getSectionMappings (acadMapId, branchId, gradeId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(
    `${urls.SECTIONMAPPINGv2}?acad_branch_grade_mapping_id=${acadMapId}&branch_id=${branchId}&grade_id=${gradeId}`,
    requestOptions
  ).then(handleResponse)
}

function handleResponse (response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        console.warn('An error occured with the API.')
      }
      const error = (data && (data.status || data.message)) || response.statusText
      return Promise.reject(error)
    }
    return data
  })
}
function listGradeCategoryId (gradecategory) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(
    `${urls.GRADE}?gradecategory=${gradecategory}`,
    requestOptions
  ).then(handleResponse)
}

function listTests () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  let path = urls.ListTests + '?get_status=True'
  return fetch(`${path}`, requestOptions).then(handleResponse)
}

function getOnlineTest (id, userId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  let path = `${urls.ListTests}?id=${id}&get_status=True`
  path += userId ? `&user_id=${userId}` : ''
  return fetch(path, requestOptions).then(handleResponse)
}

function getStudentAssessment () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(urls.StudentAssessment, requestOptions).then(handleResponse)
}

function listClassGroupType () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(urls.LISTCLASSGROUPTYPE, requestOptions).then(handleResponse)
}

function listStudentsV2 (acadsectionmapping, status, pageId, isDelete, pageSize, academicYear) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  if (!isDelete) {
    return fetch(
      `${qBUrls.StudentYearWise}?acadSectionMappingIds=${acadsectionmapping}&status=${status}&pageNumber=${pageId}&pageSize=${pageSize}&academicYear=${academicYear}`,
      requestOptions
    ).then(handleResponse)
  } else {
    return fetch(
      `${qBUrls.StudentYearWise}?acadSectionMappingIds=${acadsectionmapping}&status=${status}&isDelete=${isDelete}&pageNumber=${pageId}&pageSize=${pageSize}&academicYear=${academicYear}`,
      requestOptions
    ).then(handleResponse)
  }
}
// function listStudents (acadsectionmapping, status, pageId, isDelete) {
//   const requestOptions = {
//     method: 'GET',
//     headers: authHeader()
//   }
//   if (!isDelete) {
//     return fetch(
//       `${urls.Students}?acadsectionmapping=${acadsectionmapping}&status=${status}&page=${pageId}`,
//       requestOptions
//     ).then(handleResponse)
//   } else {
//     return fetch(
//       `${urls.Students}?acadsectionmapping=${acadsectionmapping}&is_delete=${isDelete}&page=${pageId}`,
//       requestOptions
//     ).then(handleResponse)
//   }
// }
