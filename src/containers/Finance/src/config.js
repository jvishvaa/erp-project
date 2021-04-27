
const PROTO = 'http'
const HOSTNAME = 'localhost'
const PORT = '8000'
const BASE = PROTO + '://' + HOSTNAME + ':' + PORT

export const urls = {
  LOGIN: BASE + '/activity_app/login/',
  BRANCH: BASE + '/accounts/branch/',
  GRADE: BASE + '/accounts/grade/',
  Subject: BASE + '/accounts/subject/',
  Student: BASE + '/accounts/student/',
  Teacher: BASE + '/accounts/teacher/',
  SectionMapping: BASE + '/accounts/sectionmapping/',
  Designation: BASE + '/accounts/designation/',
  Department: BASE + '/accounts/department/',
  Role: BASE + '/accounts/role/',
  GradeCategory: BASE + '/accounts/grade_category/',
  GradeMapping: BASE + '/accounts/grademapping',
  MAPPING: BASE + '/accounts/branchgrademapping/',
  StaffExcelUpload: BASE + '/accounts/teacher_excel_data/',
  StudentExcelUpload: BASE + '/accounts/student_excel_data/',
  AddStaff: BASE + '/accounts/staffregistration/'
}
