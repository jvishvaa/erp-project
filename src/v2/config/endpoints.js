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
    newBlogURL,
  },
  s3: { BUCKET: s3BUCKET, ERP_BUCKET, CENTRAL_BUCKET: CENTRAL_BUCKET },
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
    getEvents: '/academic/events/',
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
    staffAttandance: `${msReportsUrl}/api/acad_performance/v1/staff_att/branch-wise-stats/`,
    staffRoleStates: `${msReportsUrl}/api/acad_performance/v1/staff_att/role-wise-stats/`,
    staffStats: `${msReportsUrl}/api/acad_performance/v1/staff_att/branch-role-staff-wise-stats/`,
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
  teacherAttendance: {
    gradewiseAttendance: `${msReportsUrl}/api/acad_performance/v2/erpuser-grade-sections/`,
    sectionwiseAttendance: `${msReportsUrl}/api/acad_performance/v2/erpuser-grade-sections-students/`,
  },
  studentDashboard: {
    todaysClasses: `${msOriginUrl}/api/oncls/v1/student-oncls/`,
    pendingHomework: `${msReportsUrlNew}/api/acad_performance/v1/student-hw-report-dash/`,
    pendingClasswork: `${msReportsUrlNew}/api/acad_performance/v1/student-cw-report-dash/`,
    assessment: `${msReportsUrlNew}/api/acad_performance/v1/student-assesment-report-dash/`,
    studentAnnualAttendanceReport: `${msReportsUrl}/api/reports/v1/stu-annual-attreport/`,
    studentMonthlyAttendanceReport: `${msReportsUrl}/api/reports/v1/stu-monthly-attreport/`,
    studentUpcomingHolidays: `${msReportsUrl}/api/reports/v1/stu-upcoming-holydays/`,
  },
  doodle: {
    checkDoodle: `/assessment/check-sys-config/`,
    fetchDoodle: `/erp_user/fetch-doodle/`,
  },
  profile: {
    getUserStatus: '/erp_user/user-information/',
    getPendingFeeStatus: '/apiV1/fee-defaulters-banner/',
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

  diaryReport: {
    dashboardDiaryreport: `${msReportsUrl}/api/reports/v2/dashboard/diary/`,
    gradewiseReport: `${msReportsUrl}/api/reports/v2/diary/grade/view/`,
    sectionwiseReport: `${msReportsUrl}/api/reports/v2/diary/grade/section/view/`,
    subjectwiseReport: `${msReportsUrl}/api/reports/v2/diary/grade/section/subject/view/`,
    subjectTeacherReport: `${msReportsUrl}/api/reports/v2/diary/grade/section/subject/teacher/view/`,
    teacherReport: `${msReportsUrl}/api/reports/v2/diary/grade/section/subject/teacher/data/view/`,
  },
  lessonPlan: {
    subjects: 'academic/v2/lesson-plan-subjects/',
    volumeList: `${baseURLCentral}/lesson_plan/list-volume/`,
    academicYearList: `${baseURLCentral}/lesson_plan/list-session/`,
    chapterList: 'academic/central-chapters-list-v3/',
    keyConceptList: 'academic/get-key-concept-list/',
    bucket: `${CENTRAL_BUCKET}`,
  },
  homework: {
    resourcesFiles: `${CENTRAL_BUCKET}`,
  },
  grievances: {
    grievanceTicket: `${baseFinanceURL}/apiV1/ticket/`,
  },

  newBlog: {
    activityCreate: `${newBlogURL}/api/activity_detail_create/`,
    activityWebLogin: `${newBlogURL}/api/web_login/`,
    activitySessionLogin: `${newBlogURL}/api/update_user_session/`,
    activityBranch: `${newBlogURL}/api/branches/`,
    activityGrade: `${newBlogURL}/api/grades/`,
    activitySection: `${newBlogURL}/api/sections/`,
    getActivityType: `${newBlogURL}/api/activity_types/`,
    getTemplates: `${newBlogURL}/api/get_templates/`,

    previewDetails: `${newBlogURL}/api/get_activity_detail/`,
    unAssign: `${newBlogURL}/api/get_activities/`,
    Assign: `${newBlogURL}/api/get_activities/`,
    confirmAssign: `${newBlogURL}/api/activity_detail_update/`,
    pendingReview: `${newBlogURL}/api/review_student_activity/`,
    activityReview: `${newBlogURL}/api/student_activity_update/`,

    activityTypeSubmit: `${newBlogURL}/api/activity_type_create/`,

    studentReviews: `${newBlogURL}/api/student_review/`,
    studentReviewss: `${newBlogURL}/api/student_reviews/`,

    studentSideApi: `${newBlogURL}/api/student_activity_get/`,
    studentSideWriteApi: `${newBlogURL}/api/student_activity_create/`,
    createTemplates: `${newBlogURL}/api/template_create/`,
    studentPublishApi: `${newBlogURL}/api/publish_list/`,

    studentPublicSpeakingApi: `${newBlogURL}/api/ps_submissions/`,
    studentPSContentApi: `${newBlogURL}/api/ps_content/`,
    publishBlogWallApi: `${newBlogURL}/api/publish_submission/`,
    blogWallApi: `${newBlogURL}/api/blog_wall/`,
    blogListDropApi: `${newBlogURL}/api/activity_dropdown/`,
    blogRedirectApi: `${newBlogURL}/api/activity_type_count/`,
  },

  announcementList: { s3erp: 'https://d3ka3pry54wyko.cloudfront.net/' },
  principalSign: `${baseFinanceURL}/apiV1/get-principle-sign/`,

  s3: s3BUCKET,
  deleteFromS3: '/academic/delete-file/',
  aolConfirmURL: 'aol.letseduvate.com', //WARNING: Uncomment this code before pushing
  baseURLCentral,
};
