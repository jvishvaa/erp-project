export default {
  auth: {
    login: '/auth/login/',
  },
  academics: {
    subjects: '/erp_user/subject/',
    branches: '/erp_user/branch/',
    grades: '/erp_user/grademapping/',
    sections: '/erp_user/sectionmapping/',
  },
  profile: {
    userDetails: '/erp_user/user-data/',
  },
  userManagement: {
    bulkUpload: '/erp_user/uploaded-users-status/',
    academicYear: '/erp_user/list-academic_year/'
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
    createClass: '/erp_user/online_class/',
    studentOnlineclasses: '/erp_user/student_online_class/',
    acceptOrJoinClass: '/erp_user/onlineclass_accept_join/',
    managementOnlineClass: '/erp_user/teacher_online_class/',
    cancelClass: '/erp_user/cancel-online-class/',
    attendeeList: '/erp_user/onlineclass_attendeelist/',
    coHostValidation: '/erp_user/co-host-validation/',
    resourceLink: '/erp_user/resource_link/',
    resourceFile: '/erp_user/resource_files/',
    feedback: '/erp_user/onlineclass_attendancecheck/',
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
    getStudentSubjects: '/academic/student-homework/?module_id=1',
    getTopPerformer: '/academic/hw-top-performer/',
    getRating: '/academic/student_subject_rating/',
    fileUpload: '/academic/upload-question-file/',
    submitHomework: '/academic/homework-submission/',
  },
  s3: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
};
