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
    gcloud,
  },
  s3: {
    BUCKET: s3BUCKET,
    ERP_BUCKET,
    erp_googleapi,
    ERP_BUCKET_2,
    CENTRAL_BUCKET: CENTRAL_BUCKET,
    IBOOK_BUCKET: IBOOK_BUCKET,
    FINANCE_BUCKET: FINANCE_BUCKET,
  },
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
    userDesignation: `${baseURLCentral}/central-admin/user_designation/`,
    downloadUserData: '/communication/erp-user-info-excel-v2/',
    getParentData: '/erp_user/fetch-parent-data/',
    serachParent: '/erp_user/search-parent/',
    addChildToParent: '/erp_user/add-child-to-parent/',
    updateParent: '/erp_user/update-parent',
  },
  roleManagement: {
    roleList: '/erp_user/roles/',
    roleSearch: '/erp_user/role-search/',
    deleteRole: '/erp_user/delete_role/',
    restoreRole: '/erp_user/restore_role/',
    moduleList: '/erp_user/list_module/',
    createRole: '/erp_user/create_role/',
    updateRole: '/erp_user/update_role_module/',
  },
  newEbook: {
    ebookGrade: '/academic/ebook_mapped_grades_v1/',
    ebookSubject: '/academic/ebook_mapped_subjects/',
    ebookSubjectStudent: '/academic/v1/ebook_mapped_subjects/',
    ebookList: `/academic/v1/ebook_school_wise_filter/`,
    ebookDefault: `/academic/v1/ebook_school_wise_default/`,
    ebookClose: '/academic/v1/ebook_user/',
    ebook_ibook_count: '/academic/v1/ebook_ibook_count/',
  },
  newibook: {
    ibookList: '/academic/v1/ibook_school_wise_filter/',
    ibookDefault: '/academic/v1/ibook_school_wise_default/',
    ibookConfig: '/assessment/check-sys-config/?config_key=is_ibook_blocked',
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
    getStudentCountReportDataV2: '/erp_user/grade-section-wise-student-count-v2/',
    getConfigAnnouncement: '/assessment/check-sys-config/',
    erpBucket: ERP_BUCKET_2,
    profanity: `/erp_user/profanity-txt/`,
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
    gradeWise: `${msReportsUrl}/api/acad_performance/v2/curriculam-grade-wise-data/`,
    calendarEventsEvent: `${msReportsUrl}/api/reports/v1/events/`,
  },
  teacherDashboard: {
    todaysAttendance: `${msReportsUrl}/api/acad_performance/v1/teacher-dashboard/attendance-today/`,
    classwiseAttendance: `${msReportsUrl}/api/acad_performance/v1/student-attendance-report/`,
    assessment: `${msReportsUrl}/api/acad_performance/v1/student-assessment-report/`,
    curriculumCompletion: `${msReportsUrl}/api/acad_performance/v2/curriculam-grade-subject-sectionwise-report/`,
    classworkReport: `${msReportsUrl}/api/reports/v1/classwork-stats/`,
    homeworkReport: `${msReportsUrl}/api/reports/v1/homework-stats/`,
    curriculumnWidget: `${msReportsUrl}/api/acad_performance/grade-subject-wise-curriculum-completion-widget/`,
    diaryStats: `${msReportsUrl}/api/reports/teacher_dsh_todays_diary/`,
    diaryStatsV2: `${msReportsUrl}/api/reports/teacher-dsh-todays-diary-v2/`,
    todaysClass: `${msReportsUrl}/api/reports/teacher_retrieve_daily_periods/`,
    todaysClassV2: `${msReportsUrl}/api/reports/teacher-retrieve-daily-periods-v2/`,
    studentsAttendance: `${msReportsUrl}/api/reports/teacher_dsh_st_attendance/`,
    activities: `${newBlogURL}/api/get_activities_dashboard/`,
    curriculumReport: `${msReportsUrl}/api/reports/td-curriculum-report/`,
  },
  teacherAssessment: {
    tests: `${msReportsUrl}/api/acad_performance/v1/test/academic-test-report/`,
    historicQuestion: '/assessment/v1/hst-quest-bank/',
  },
  teacherAttendance: {
    gradewiseAttendance: `${msReportsUrl}/api/acad_performance/v2/erpuser-grade-sections/`,
    sectionwiseAttendance: `${msReportsUrl}/api/acad_performance/v2/erpuser-grade-sections-students/`,
  },
  studentDashboard: {
    checkConfigStatus: `${msReportsUrl}/api/acad_performance/get-dashboard-cfg/`,
    todaysClasses: `${msOriginUrl}/api/oncls/v1/student-oncls/`,
    pendingHomework: `${msReportsUrlNew}/api/acad_performance/v1/student-hw-report-dash/`,
    pendingClasswork: `${msReportsUrlNew}/api/acad_performance/v1/student-cw-report-dash/`,
    assessment: `${msReportsUrlNew}/api/acad_performance/v1/student-assesment-report-dash/`,
    studentAnnualAttendanceReport: `${msReportsUrl}/api/reports/v1/stu-annual-attreport/`,
    studentMonthlyAttendanceReport: `${msReportsUrl}/api/reports/v1/stu-monthly-attreport/`,
    studentUpcomingHolidays: `${msReportsUrl}/api/reports/v2/stu-upcoming-holydays/`,
    assessmentPerformance: `${msReportsUrl}/api/reports/student_performance/`,
    upcomingAssessment: `${msReportsUrl}/api/reports/upcoming_exam/`,
    homeworkReport: `${msReportsUrl}/api/reports/dashboard_student_hw_performance/`,
    diaryStats: `${msReportsUrl}/api/reports/diary_homework_count/`,
    todaysTimeTable: `${msReportsUrl}/api/reports/retrieve_daily_periods/`,
    todaysTimeTableV2: `${msReportsUrl}/api/reports/retrieve-daily-periods-v2/`,
    classwisehomeworkReport: `${msReportsUrl}/api/reports/teacher_dsh_homeworks/`,
  },
  assessmentDashboard: {
    studentMonthwiseAssessment: `${msReportsUrl}/api/acad_performance/month-wise-assessment-report/`,
    studentSubjectwiseAssessment: `${msReportsUrl}/api/acad_performance/subject-wise-assessment-report/`,
    studentTestwiseAssessment: `${msReportsUrl}/api/acad_performance/test-wise-assessment-report/`,
    studentTestDetail: `${msReportsUrl}/api/acad_performance/test-detail-report/`,
    assessmentConfig: `${msReportsUrl}/api/acad_performance/get-dashboard-cfg/`,
  },
  doodle: {
    checkDoodle: `/assessment/check-sys-config/`,
    fetchDoodle: `/erp_user/fetch-doodle/`,
    fetchDoodlePayConfig: `/assessment/check-sys-config/?config_key=pay-now`,
  },
  userManagementBlog: {
    getUserLevel: '/erp_user/level_list/',
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
    retrieveUpdateDeleteAnnouncement:'/announcement/retrieve-update-delete-announcement/'
  },
  acadCalendar: {
    monthly: `/period/calendar-v2/`,
    weekly: `/period/calendar/`,
    daily: `/period/calendar/`,
  },
  generalDiary: {
    diaryList: '/academic/general-dairy-messages/',
    diaryListv2: '/academic/v2/general-dairy-messages/',
  },
  createQuestionApis: {
    // topicList: `${baseURLCentral}/assessment/topic/`,
    topicList: `${baseURLCentral}/assessment/topics-list/`,
    questionType: `${baseURLCentral}/assessment/question_type/`,
    createQuestion: `${baseURLCentral}/assessment/create-question/`,
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
    upcomingPeriodData: `${baseURLCentral}/lesson_plan/v2/upcoming-period-data/`,
    centralHomeworkData: `${baseURLCentral}/lesson_plan/lesson/`,
    newDiaryList: '/academic/new/dialy-diary-messages/',
  },

  diaryReport: {
    dashboardDiaryreport: `${msReportsUrl}/api/reports/v2/dashboard/diary/`,
    gradewiseReport: `${msReportsUrl}/api/reports/<version>/diary/grade/view/`,
    sectionwiseReport: `${msReportsUrl}/api/reports/<version>/diary/grade/section/view/`,
    subjectwiseReport: `${msReportsUrl}/api/reports/<version>/diary/grade/section/subject/view/`,
    subjectTeacherReport: `${msReportsUrl}/api/reports/<version>/diary/grade/section/subject/teacher/view/`,
    teacherReport: `${msReportsUrl}/api/reports/v2/diary/grade/section/subject/teacher/data/view/`,
    resources: `${baseURLCentral}/lesson_plan/lesson/`,
  },
  lessonPlan: {
    subjects: 'academic/v2/lesson-plan-subjects/',
    allSubjects: 'academic/v3/lesson-plan-subjects/',
    volumeList: `${baseURLCentral}/lesson_plan/list-volume/`,
    academicYearList: `${baseURLCentral}/lesson_plan/list-session/`,
    chapterList: 'academic/central-chapters-list-v3/',
    keyConceptList: 'academic/get-key-concept-list/',
    questionPaperPreview: `${baseURLCentral}/assessment/<question-paper-id>/qp-questions-list/`,
    bucket: `${CENTRAL_BUCKET}`,
    ibookBucket: IBOOK_BUCKET,
  },
  homework: {
    resourcesFiles: `${CENTRAL_BUCKET}`,
    uploadZip: `${gcloud}/hw_zip_upload_v1`,
    updateImage: '/hw-hub/upload_hw_files/',
  },
  centralizedHomework: {
    docType: 'hw-hub/get_doctype/',
    studentView: 'hw-hub/hw_view/',
    subjectList: 'hw-hub/user-subject-list/',
    rating: '/hw-hub/rating/',
    evaluatorList: '/hw-hub/get_evaluators/',
    checkEvaluator: '/hw-hub/evaluator-check/',
    evaluatorReport: '/hw-hub/evaluator-report/',
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
    activityTypeSubmitEdit: `${newBlogURL}/api/activity_type_edit/`,
    erpSectionmapppingV3: '/erp_user/V3/sectionmapping/',
    erpGradeMappingV3: '/erp_user/V3/grademapping/',

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
    blogRedirectApi: `${newBlogURL}/api/activity_type_count_v1/`,
    checkBMIApi: `${newBlogURL}/api/check_student/`,
    diaryActivities: `${newBlogURL}/api/diary_activities/`,
    getSchoolWallApi: `${newBlogURL}/api/school_wall/`,
    whatsAppChatGetApi: `${baseFinanceURL}/apiV1/whatsup-log/`,
    gradesERP: `/erp_user/grademapping/`,
    showVisualMedia: `${newBlogURL}/api/uploaded_content/`,
    criteriaTitleList: `${newBlogURL}/api/activity_types_criteria`,
    getActivityTypesApi: `${newBlogURL}/api/get_activity_types/`,
    getIndividualActivity: `${newBlogURL}/api/get_ps_activities/`,
    getPublicSpeakingStudents: `${newBlogURL}/api/ps_activity_data/`,
    getPublicSpeakingVideos: `${newBlogURL}/api/participation/`,
    getStudentPublicView: `${newBlogURL}/api/ps_submissions_data/`,
    subjectWiseRatingSchemas: `${newBlogURL}/api/get_all_schema/`,
    createSubjectWiseRatingSchemas: `${newBlogURL}/api/scheme_create/`,
    deleteSubjectWiseRatingSchemas: `${newBlogURL}/api/delete_scheme/`,
    updateSubjectWiseRatingSchemas: `${newBlogURL}/api/activity_scheme_update/`,
    // gradeWiseSubjects: `/academic/v4/lesson-plan-subjects/`,
    getRoundShowHide: `${newBlogURL}/api/check_ps_rounds/`,
    getCategoryOptions: `${newBlogURL}/api/school_wall_activity_types/`,
  },
  fileDrive: {
    fileList: `/schools/school_file_list/`,
    editFileList: `/schools/school_file_details`,
    verifyFile: `/schools/verify_filename`,
    fileCategory: `/schools/school_category`,
  },
  observations: {
    observationList: '/teacher_observation/create-observation/',
    updateObservation: '/teacher_observation/update-observation/',
    observationAreaList: '/teacher_observation/create-observation-area/',
    updateObservationArea: '/teacher_observation/update-observation-area/',
  },
  announcementList: { s3erp: ERP_BUCKET },
  principalSign: `${baseFinanceURL}/apiV1/get-principle-sign/`,

  appVersion: `${baseURLCentral}/central-admin/app-versioning/`,
  schoolDetails: `${baseURLCentral}/central-admin/school_details/`,

  nonAcademicStaff: {
    roles: '/erp_user/roles/',
    createStaff: '/erp_user/add_non_acadamic_user/',
    updateStaff: '/erp_user/update_non_acadamic_user/',
    uploadBulkStaff: '/erp_user/bulk_upload_non_acad/',
    viewStaff: '/erp_user/non_acad_user_data/',
    bulkUpload: '/erp_user/uploaded-users-status/',
  },

  activityManagementDashboard: {
    studentbmiDetails: `${newBlogURL}/api/get_student_bmi/`,
    studentSportsDetails: `${newBlogURL}/api/dashboard_student_activity_get/`,
    studentSportsSubActivityId: `${newBlogURL}/api/physical_activity_subtype_id/`,
  },
  s3: s3BUCKET,
  erpBucket: ERP_BUCKET,
  centralBucket: CENTRAL_BUCKET,
  deleteFromS3: '/academic/delete-file/',
  aolConfirmURL: 'aol.letseduvate.com', //WARNING: Uncomment this code before pushing
  baseURLCentral,

  studentListApis: {
    branchWiseStudentCount: '/academic/school_strength/',
    gradeWiseStudentCount: '/academic/grade_wise_students/',
    downloadBranchWiseStudent2: '/academic/branch_strength_excel_data/',
    downloadExcelAllstudents2: '/academic/all_branch_strength_excel_data/',
  },

  timeTableNewFlow: {
    availableTimeSlots: '/acad-tt/time-set',
    weeklyTimeSlots: '/acad-tt/week-tt',
    periodSlots: '/acad-tt/period-slots',
    weeklyTimeSlotSectionList: '/acad-tt/grade-sec',
    getDateRangeList: '/acad-tt/ttdate',
    dateRangeSectionList: '/acad-tt/tt-view',
    sectionPeriodData: '/acad-tt/periods',
    teacherList: '/acad-tt/teacher-list',
    studentTeacherList: `${baseURL}/acad-tt/stud-teach-list/`,
    studentTimeTableView: '/acad-tt/sview',
    teacherTimeTableView: '/acad-tt/tea-view',
    duplicateTimeTable: '/acad-tt/duplicate',
    activeToggle: '/acad-tt/tt-active',
    studentTeacherList: `/acad-tt/stud-teach-list/`,
    subjectsList: `/erp_user/v2/mapped-subjects-list/`,
    downloadExcel: `/acad-tt/excel/`,
  },
  finance: {
    storeWalletList: `${baseFinanceURL}/apiV1/store-wallet-list/`,
    walletList: `${baseFinanceURL}/apiV1/wallet-list/`,
  },
  FrequentlyAskedQuestions: {
    FaqApi: `${baseURL}/erp_user/faq/`,
  },
  FINANCE_BUCKET,
  popupSetting: {
    checkDueAmount: `${baseFinanceURL}/apiV1/student-acad-fee-tilldate/`,
    popupSetting: `${baseFinanceURL}/apiV1/popup-details/`,
    studentPaymentLink: `${baseFinanceURL}/apiV1/generate-multifee-payment-link/`,
  },
  schoolWall: {
    getPosts: '/social-media/social-media-post/',
    likePost: '/social-media/like/',
    comments: '/social-media/comments/',
  },
  erpBucket2: ERP_BUCKET_2,
  erp_googleapi: erp_googleapi,
};
