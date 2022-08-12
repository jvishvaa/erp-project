import ENVCONFIG from './config';

const {
  apiGateway: {
    baseURLCentral,
    baseUdaan,
    msReportsUrl,
    baseFinanceURL,
    baseURL,
    baseURLMPQ,
    msOriginUrl,
    msReportsUrlNew,
  },
  s3: { BUCKET: s3BUCKET, ERP_BUCKET },
} = ENVCONFIG;

export default {
  auth: {
    login: '/auth/login/',
  },
  checkAcademicView: {
    isAcademicView: '/period/period-erp-system-config/',
  },
  userManagement: {
    userLevelList: `${baseURLCentral}/central-admin/user_level_list/`,
  },
  academics: {
    subjects: '/erp_user/subject/',
    branches: '/erp_user/branch/',
    grades: '/erp_user/grademapping/',
    sections: '/erp_user/sectionmapping/',
    testTypes: '/assessment/exam-type-list/',
    chapter: '/assessment/chapters/',
    courses: '/aol/courses/',
    attendance: '/academic/student_attendance_between_date_range/',
    showAttendance: '/academic/show_attendance/',
    createAttendance: '/academic/create_or_update_attendance/',
    studentList: '/academic/get_user_details/',
    multipleStudentsAttendacne: '/academic/multiple_student_attendance_between_dates/',
    singleStudentAttendance: '/academic/single_student_attendance_between_days/',
    markAttendance: '/academic/bulk_create_attendance/',
    students: '/academic/get_student_list/',
    getHoliday: '/academic/holiday/',
    teacherAttendanceData: '/erp_user/erpuser-attendance-erp/',
    teacherAttendanceSent: '/erp_user/erpuser-attendance/',
    getTeacherAttendanceData: '/erp_user/erpuser-attendance-monthly-reports/',
    getStudentCountReportData: '/erp_user/grade-section-wise-student-count/',
  },
  adminDashboard: {
    announcements: '/announcement/v2/inbox/',
    staffAttendanceStats: `${msReportsUrl}/api/acad_performance/v1/staff_att/all-staff-stats/`,
    overallAttendanceStats: `${msReportsUrl}/api/acad_performance/v2/attendance-overall-stats/`,
    curriculumStats: `${msReportsUrl}/api/acad_performance/v1/curriculum-stats-branch/`,
    testScoreStats: `${msReportsUrl}/api/acad_performance/v1/student_report/combined-branch-wise-stats/`,
    attendacneReport: `${msReportsUrl}/api/acad_performance/v1/staff_att/all-staff-stats/`,
    calendarEvents: `${msReportsUrl}/api/reports/v1/holiday/`,
    feesOverviewData: `${baseFinanceURL}/apiV1/dashboard/finance-dashboard-monthly/`,
    feesStatsData: `${baseFinanceURL}/apiV1/dashboard/finance_dashboard`,
    financeYearList: `${baseFinanceURL}/apiV1/finance-session-year-list/`,
  },
  teacherDashboard: {
    todaysAttendance: `${msReportsUrl}/api/acad_performance/v1/teacher-dashboard/attendance-today/`,
    classwiseAttendance: `${msReportsUrl}/api/acad_performance/v1/student-attendance-report/`,
    assessment: `${msReportsUrl}/api/acad_performance/v1/student-assessment-report/`,
    curriculumCompletion: `${msReportsUrl}/api/acad_performance/v2/curriculam-grade-subject-sectionwise-report/`,
    classworkReport: `${msReportsUrl}/api/reports/v1/classwork-stats/`,
    homeworkReport: `${msReportsUrl}/api/reports/v1/homework-stats/`,
  },
  teacherAssessment: {
    tests: `${msReportsUrl}/api/acad_performance/v1/test/academic-test-report/`,
  },
  studentDashboard: {
    todaysClasses: `${msOriginUrl}/api/oncls/v1/student-oncls/`,
    pendingHomework: `${msReportsUrlNew}/api/acad_performance/v1/student-hw-report-dash/`,
    pendingClasswork: `${msReportsUrlNew}/api/acad_performance/v1/student-cw-report-dash/`,
    assessment: `${msReportsUrlNew}/api/acad_performance/v1/student-assesment-report-dash/`,
  },
  doodle: {
    checkDoodle: `/assessment/check-sys-config/`,
  },
  createAnnouncement: {
    membersCount: `/announcement/members/`,
    uploadFile: `announcement/upload-announcement-file/`,
    announcementCategory: `announcement/announcement-category/`,
    publishAnnouncement: `/announcement/create/`,
    updateAnnouncement: 'announcement/v2/announcement-update',
  },
  acadCalendar: {
    monthly: `/period/calendar-v2/`,
    weekly: `/period/calendar/`,
    daily: `/period/calendar/`,
  },
  generalDiary: {
    diaryList: '/academic/general-dairy-messages/',
  },
  dailyDiary: {
    createDiary: '/academic/create-dairy/',
    branches: '/academic/chapters/',
    updateDelete: '/academic/',
    chapterList: '/academic/logged-in-users-subjects/',
    questionList: '/assessment/questions-list/',
    upload: '/academic/dairy-upload/',
    removeFile: '/academic/delete-file/',
    generalDiaryUsers: '/academic/general-dairy-users/',
    assignHomeworkDiary: '/academic/assign-homework-dairy/',
  },
  announcementList: { s3erp: 'https://d3ka3pry54wyko.cloudfront.net/' },
  s3: s3BUCKET,
  deleteFromS3: '/academic/delete-file/',
  aolConfirmURL: 'aol.letseduvate.com', //WARNING: Uncomment this code before pushing
  baseURLCentral,
};
