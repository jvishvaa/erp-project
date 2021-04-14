// const baseURLCentral = 'http://13.232.30.169/qbox';
const appBaseURL = window.location.hostname;
const baseURLCentral = (appBaseURL.includes("dev.") || appBaseURL.includes("localhost"))
  ? 'http://dev.mgmt.letseduvate.com/qbox'
  : 'https://mgmt.letseduvate.com/qbox';
// const baseURLCentral = 'http://dev.mgmt.letseduvate.com/qbox'
// const baseURLCentral = 'https://mgmt.letseduvate.com/qbox';

export default {
  auth: {
    login: '/auth/login/',
  },
  academics: {
    subjects: '/erp_user/subject/',
    branches: '/erp_user/branch/',
    grades: '/erp_user/grademapping/',
    sections: '/erp_user/sectionmapping/',
    courses: '/aol/courses/',
    attendance: '/academic/student_attendance_between_date_range/',
    showAttendance: '/academic/show_attendance/',
    createAttendance: '/academic/create_attendance/',
    studentList: '/academic/get_user_details/',
    singleStudentAttendance: '/academic/student_attendance_between_days/',
  },
  profile: {
    userDetails: '/erp_user/user-data/',
  },
  userManagement: {
    bulkUpload: '/erp_user/uploaded-users-status/',
    academicYear: '/erp_user/list-academic_year/',
  },
  communication: {
    roles: '/erp_user/roles/',
    branches: '/erp_user/branch/',
    grades: '/erp_user/grademapping/',
    sections: '/erp_user/sectionmapping/',
    userList: '/communication/erp-user-info/',
    communicationUserList: '/communication/communication-user-list/',
    createGroup: '/communication/communication-group/',
    editGroup: '/communication/',
    getGroups: '/communication/communication-group/',
    groupList: '/communication/groups-list/',
    getMessageTypes: '/communication/message-types/',
    sendMessage: '/communication/send-messages/',
    getSmsCredit: '/communication/sms-credits/',
    assignRole: '/erp_user/assign_role/',
    userStatusChange: '/erp_user/',
    getMessages: '/communication/email-sms-logs/',
  },
  onlineClass: {
    // batchList: '/erp_user/batch-student-list/',
    batchList: '/aol/batch_shuffle/',
    filterStudent: '/erp_user/student_filter/',
    teacherAvailability: '/erp_user/tutor_availability_check/',
    // createClass: '/erp_user/online_class/',
    createClass: '/erp_user/online-recurring/',
    createSpecialClass: '/erp_user/online-erp-class/',
    studentOnlineclasses: '/erp_user/student_online_class/',
    acceptOrJoinClass: '/erp_user/onlineclass_accept_join/',
    managementOnlineClass: '/erp_user/teacher_online_class/',
    cancelClass: '/erp_user/cancel-online-class/',
    attendeeList: '/erp_user/onlineclass_attendeelist/',
    coHostValidation: '/erp_user/co-host-validation/',
    resourceLink: '/erp_user/resource_link/',
    resourceFile: '/erp_user/resource_files/',
    feedback: '/erp_user/onlineclass_attendancecheck/',
    updateTutor: '/erp_user/update_tutor_email/',
  },
  masterManagement: {
    subjects: '/erp_user/subjects-list/',
    grades: '/erp_user/grades-list/',
    sectionsTable: '/erp_user/grades-section-list/',
    fetchSectionMap: '/erp_user/section/',
    sectionsTable: '/erp_user/list-section/',
    branchMappingTable: '/erp_user/branch/',
    sectionMappingTable: '/erp_user/list-section-mapping/',
    subjectMappingTable: '/erp_user/list-subjectmapping/',
    deleteSectionMapping: '/erp_user/delete-section-mapping/',
    deleteSubjectMapping: '/erp_user/delete-subject-mapping/',
    createBranch: '/erp_user/create-branch/',
    deleteBranch: '/erp_user/delete-branch-mapping/',
    createSubject: '/erp_user/create-subject/',
    createSubjectMapping: '/erp_user/create-subject-mapping/',
    createSection: '/erp_user/create-section/',
    listSectionMap: '/erp_user/list-section-map/',
    createSectionMapping: '/erp_user/create-grade-section-mapping',
    createGrade: '/erp_user/create-grade/',
    branchList: '/erp_user/list-all-branch/',
    branchMapping: '/erp_user/create-branch-mapping',
    updateSubject: '/erp_user/update-subject/',
    updateSection: '/erp_user/update-section/',
    updateGrade: '/erp_user/update-grade/',
    updateBranch: '/erp_user/update-branch/',
    gradesDrop: '/erp_user/grade/',
    sections: '/erp_user/sectionmapping/',
    academicYear: '/erp_user/academic-year-list/',
    updateAcademicYear: '/erp_user/update-academic-year/',
    createAcademicYear: '/erp_user/create-academic-year/',
    messageTypeTable: '/communication/communicate-type/',
    updateMessageType: '/communication/',
    chapter: '/academic/chapters/',
    ViewChapter: '/academic/chapters/',
    editChapter: '/academic/',
  },
  gloabSearch: {
    getUsers: '/erp_user/global-search/',
    singleUser: '/erp_user/',
  },
  homework: {
    completeData: '/academic/list_admin_homework/',
    createConfig: '/academic/homework-admin-configuration/',
  },
  homeworkStudent: {
    getStudentSubjects: '/academic/student-homework/',
    getTopPerformer: '/academic/hw-top-performer/',
    getRating: '/academic/student_subject_rating/',
    fileUpload: '/academic/upload-question-file/',
    submitHomework: '/academic/homework-submission/',
  },
  lessonReport: {
    volumes: '/lesson_plan/list-volume/',
    subjects: '/academic/lesson-plan-subjects/',
    lessonList: '/academic/lesson-completed-report/',
    lessonViewMoreData: '/academic/user-chapters-details/',
    teacherList: '/academic/lesson_plan_user_list/',
  },
  studentListApis: {
    branchWiseStudentCount: '/academic/school_strength/',
    gradeWiseStudentCount: '/academic/grade_wise_students/',
    sectionWiseStudentCount: '/academic/grade_wise_students/',
    downloadBranchWiseStudent: '/academic/branch_strength_excel_data/',
    downloadExcelAllstudents: '/academic/all_branch_strength_excel_data/',
  },

  idCards: {
    getIdCardsApi: '/erp_user/get-user-details/',
  },
  signature: {
    createSignatureApi: '/erp_user/principle-signature/',
    updateSignatureApi: '/erp_user/update-destroy-signature/',
    deleteSignatureApi: '/erp_user/update-destroy-signature/',
    getSignatureList: '/erp_user/principle-signature/',
    s3: 'https://erp-revamp.s3.ap-south-1.amazonaws.com/',
  },

  coordinatorTeacherHomeworkApi: {
    getAllTeacherList: '/academic/teachers-list/',
    getTecherPerformance: '/academic/hw-teacher-performance/',
  },
  mappingStudentGrade: {
    branch: '/erp_user/branch/',
    grade: '/erp_user/grademapping/',
    subjects: '/academic/lesson-plan-subjects/',
    central: '/academic/central-grade-subjects/',
    schoolGsMapping: '/academic/school-gs-mapping-details/',
    assign: '/academic/school-subjects-mapping/',
    updateAssign: '/academic',
    delete: '/academic',
    chapter: '/academic/chapters/',
    ViewChapter: '/academic/chapters/',
    editChapter: '/academic/',
    centralGradeSubjects: `${baseURLCentral}/lesson_plan/erp_lesson_mapping/`, //'https://dev.mgmt.letseduvate.com/qbox/lesson_plan/erp_lesson_mapping/?domain_name=olvorchidnaigaon'
  },
  lessonPlan: {
    periodData: `${baseURLCentral}/lesson_plan/chapter-period/`,
    periodCardData: `${baseURLCentral}/lesson_plan/lesson/`,
    academicYearList: `${baseURLCentral}/lesson_plan/list-session/`,
    volumeList: `${baseURLCentral}/lesson_plan/list-volume/`,
    gradeSubjectMappingList: `/academic/lesson-plan-subjects/`,
    chapterList: `/academic/central-chapters-list/`,
    periodCompleted: '/academic/lessonplan-completed-status/',
    periodCompletedStatus: '/academic/lesson-status/',
    bulkDownload: `${baseURLCentral}/lesson_plan/bulk_download/`,
    overviewSynopsis: `${baseURLCentral}/lesson_plan/list-lesson-overview/`,
    s3: 'https://omrsheet.s3.ap-south-1.amazonaws.com/',
  },
  aol: {
    cardData: '/erp_user/teacher_online_class/',
    courseList: '/aol/courses/',
    batchLimitList: '/aol/aol-course-batch/',
    classes: '/erp_user/teacher_online_class/',
    teacherList: '/erp_user/teacher-list/',
    draftBatch: '/aol/mixed-batch-details/',
    assignTeacher: '/aol/teacher-assign/',
    reshuffleBatchList: '/aol/batch_shuffle/',
    studentReshuffle: '/aol/student-shuffle/',
    cancelClass: 'erp_user/cancel-online-class/',
    createCoursePrice: '/aol/course-details/',
    updateCoursePrice: '/aol/course_details_update/',
    updateTeacher: '/aol/update-batch-teacher/',
  },

  attendanceList: {
    list: '/erp_user/onlineclass_attendeelist/',
    updateAttendance: '/erp_user/mark_attendance/',
  },
  blog: {
    genreList: '/academic/genre/',
    Blog: '/academic/blog/',
    BlogLike: '/academic/like_blog/',
    BlogView: '/academic/view_blog/',
    WordCountConfig: '/academic/word_count_config/',
  },

  discussionForum: {
    categoryList: '/academic/categories/',
    branch: '/erp_user/branch/',
    grade: '/erp_user/grademapping/',
    filterCategory: '/academic/posts/',
    postLike: '/academic/posts-like-users/',
    PostCategory: '/academic/create-category/',
    CreateDissusionForum: '/academic/add-post/',
    CreateCommentAndReplay: '/academic/create-answer-replay/',
    AwardListAPI: '/academic/',
    s3: 'https://erp-revamp.s3.ap-south-1.amazonaws.com/',
    deletePost: '/academic/',
  },
  circular: {
    circularList: '/circular/upload-circular/',
    viewMoreCircularData: '/circular/circular-details/',
    fileUpload: '/circular/upload-circular-file/',
    createCircular: '/circular/upload-circular/',
    deleteCircular: '/circular/delete-circular/',
    updateCircular: '/circular/update-circular/',
    deleteFile: '/academic/delete-file/',
  },
  generalDairy: {
    dairyList: '/academic/general-dairy-messages/',
    studentList: '/academic/general-dairy-users/',
    updateDelete: '/academic/',
    SubmitDairy: '/academic/create-dairy/',
    uploadFile: '/academic/dairy-upload/',
  },
  dailyDairy: {
    createDailyDairy: '/academic/create-dairy/',
    branches: '/academic/chapters/',
    updateDelete: '/academic/',
    chapterList: '/academic/logged-in-users-subjects/',
  },
  onlineCourses: {
    createCourse: '/aol/courses/',
    fetchCourseDetails: '/aol/coursetag/',
    fileUpload: '/aol/file-upload/',
    courseList: '/aol/courses/',
    deleteCourse: '/aol/',
    courseDetails: '/aol/courses/',
    categoryList: '/aol/tagging-list/',
    updateCourse: '/aol/',
    studentList: '/erp_user/batch-student-list/',
  },
  attendanceList: {
    list: '/erp_user/onlineclass_attendeelist/',
    updateAttendance: '/erp_user/mark_attendance/',
  },
  blog: {
    genreList: '/academic/genre/',
    Blog: '/academic/blog/',
    BlogLike: '/academic/like_blog/',
    BlogView: '/academic/view_blog/',
    WordCountConfig: '/academic/word_count_config/',
  },
  teacherViewBatches: {
    courseListApi: '/aol/courses/',
    batchSizeList: 'aol/aol-course-batch/',
    getBatchList: '/erp_user/teacher_online_class/',
    cancelBatchApi: '/erp_user/cancel-online-class/',
  },
  studentViewBatchesApi: {
    getBatchesApi: '/erp_user/student_online_class/',
    rejetBatchApi: '/erp_user/mark_attendance/',
  },
  
  eventBat:{
    getPaginatedCategories:"/academic/list_event_categories_p/",  //get
    getListCategories:"/academic/list_event_categories/",  //get
    postCreateEvent:"/academic/create_event_category/",  //post
    patchUpdateEvent:"/academic/update_event_category/",//patch
    deleteEventCategory:"/academic/delete_event_category/", //delete
    filterEventCategory:"/academic/filter_event_categories/" //get 

},

CreateEvent:{
  CreateEvent:'academic/events/',
  getEventCategory:"academic/list_create_event_category/"
},

  assessment: {
    questionPaperList: `/academic/assessment-list/`,
    viewQuestionList: `${baseURLCentral}/assessment/3/qp-questions-list/`,
    userTests: `${baseURLCentral}/assessment/user-tests/`, // ?user=20&subject=1,
    userTestComparisions: `${baseURLCentral}/assessment/student-test-comparison/`, // ?test_1=7&user=20&test_2=10
    userSpecificSubjects: `/academic/users-subjects/`, // ?module_id=112
    userAssessmentQuestionAnalysis: `${baseURLCentral}/assessment/category_analysis_report/`, // ?user=3446&assessment_id=3
    assessmentAnalysisTeacherExcel: `${baseURLCentral}/assessment/teacher-report/`, // ?type=1
    userAssessmentSubmission: `${baseURLCentral}/assessment/user_response/`,
    fetchAssessmentQuestionPapersQuestions: `${baseURLCentral}/assessment/<question-paper-id>/qp-questions-list/`,
    s3: 'https://omrsheet.s3.ap-south-1.amazonaws.com/',
  },
  publish: {
    ebook: `erp_user/publication/`,
    update_delete: `erp_user/update-destroy-publication/`,
  },
  s3: 'https://erp-revamp.s3.ap-south-1.amazonaws.com',
  deleteFromS3: '/academic/delete-file/',
  aolConfirmURL: 'aol.letseduvate.com', //WARNING: Uncomment this code before pushing
  // aolConfirmURL:'localhost:3000', //WARNING: Comment this code before pushing
  baseURLCentral,
};