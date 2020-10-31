export default {
  auth: {
    login: '/auth/login/',
  },
  academics: {
    subjects: '/erp_user/subject/',
  },
  communication: {
    roles: '/erp_user/roles/',
    branches: '/erp_user/branch/',
    grades: '/erp_user/grademapping/',
    sections: '/erp_user/sectionmapping/',
    userList: '/communication/erp-user-info/',
    createGroup: '/communication/communication-group/',
    editGroup: '/communication/',
    getGroups: '/communication/communication-group/',
    groupList: '/communication/groups-list/',
    getMessageTypes: '/communication/message-types/',
    sendMessage: '/communication/send-messages/',
    getSmsCredit: '/communication/sms-credits/',
    assignRole: '/erp_user/assign_role/',
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
  },
};
