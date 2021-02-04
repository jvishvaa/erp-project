const baseURLCentral = 'http://13.232.30.169/qbox';
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
    updateTutor: '/erp_user/update_tutor_email',
  },
  masterManagement: {
    subjects: '/erp_user/subjects-list/',
    grades: '/erp_user/grades-list/',
    sectionsTable: '/erp_user/grades-section-list/',
    createSubject: '/erp_user/create-subject/',
    createSection: '/erp_user/create-section/',
    createGrade: '/erp_user/create-grade/',
    updateSubject: '/erp_user/update-subject/',
    updateSection: '/erp_user/update-section/',
    updateGrade: '/erp_user/update-grade/',
    gradesDrop: '/erp_user/grade/',
    sections: '/erp_user/sectionmapping/',
    academicYear: '/erp_user/academic-year-list/',
    updateAcademicYear: '/erp_user/update-academic-year/',
    createAcademicYear: '/erp_user/create-academic-year/',
    messageTypeTable: '/communication/communicate-type/',
    updateMessageType: '/communication/',
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
    teacherList:'/academic/lesson_plan_user_list/',
  },


  coordinatorTeacherHomeworkApi:{
    getAllTeacherList:'/academic/teachers-list/',
    getTecherPerformance:'/academic/hw-teacher-performance/'
  },
  mappingStudentGrade: {
    branch: '/erp_user/branch/',
    grade: '/erp_user/grademapping/',
    subjects: '/academic/lesson-plan-subjects/',
    central: '/academic/central-grade-subjects/',
    schoolGsMapping: '/academic/school-gs-mapping-details/',
    assign: '/academic/school-subjects-mapping/',
    updateAssign: '/academic',
    delete: '/academic'
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
  discussionForum:{
   categoryList: '/academic/categories/',
   branch: '/erp_user/branch/',
   grade:'/erp_user/grademapping/',
   filterCategory: '/academic/posts/',
   postLike: '/academic/posts-like-users/',
   PostCategory : '/academic/create-category/',
   CreateDissusionForum: '/academic/add-post/',
   CreateCommentAndReplay: '/academic/create-answer-replay/',
   AwardListAPI: '/academic/',
   s3: 'https://erp-revamp.s3.ap-south-1.amazonaws.com/',
   deletePost: '/academic/'
  },
  circular:{
    circularList:'/circular/upload-circular/',
    viewMoreCircularData:'/circular/circular-details/',
    fileUpload:'/circular/upload-circular-file/',
    createCircular:'/circular/upload-circular/',
    deleteCircular:'/circular/delete-circular/',
    updateCircular:'/circular/update-circular/'
  },
  generalDairy:{
    dairyList:'/academic/general-dairy-messages/',
    studentList:'/academic/general-dairy-users/',

  },
  dailyDairy:{
    createDailyDairy:'/academic/create-dairy/',
    branches:'/academic/chapters/'
  },
  onlineCourses:{
    createCourse:'/aol/courses/',
    fileUpload:'/aol/file-upload/',
    courseList:'/aol/courses/',
    deleteCourse:'/aol/',
    courseDetails:'/aol/courses/',
  },
  blog: {
    genreList: '/academic/genre/',
    Blog: '/academic/blog/',
    BlogLike:'/academic/like_blog/',
    BlogView:'/academic/view_blog/'

    
  },

    
  s3: 'https://erp-revamp.s3.ap-south-1.amazonaws.com',
  deleteFromS3: '/academic/delete-file/',
};
