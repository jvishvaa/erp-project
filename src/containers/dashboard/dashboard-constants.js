import endpoints from '../../config/endpoints';

const {
  dashboard: {
    teacher: {
      listAttendanceReport,
      listClassworkReport,
      listHomeworkReport,
      listBlogReport,
      downloadAttendanceReport,
      downloadClassworkReport,
      downloadHomeworkReport,
    } = {},
  } = {},
} = endpoints || {};

export const reportTypeConstants = {
  attendance: 'attendance',
  classwork: 'classwork',
  homework: 'homework',
  blog: 'blog',
};

export const apiConfig = {
  attendance: {
    report: listAttendanceReport,
    download: downloadAttendanceReport,
  },
  classwork: {
    report: listClassworkReport,
    download: downloadClassworkReport,
  },
  homework: {
    report: listHomeworkReport,
    download: downloadHomeworkReport,
  },
  blog: {
    report: listBlogReport,
  },
};

export const responseConverters = {
  attendanceResponse: {
    assigned_to_me: 'Assigned to me',
    total_classes: 'Total Classes',
  },
  classworkResponse: {
    assigned_to_me: 'Assigned to me',
    total_classes: 'Total Classwork',
  },
  homeworkResponse: {
    total_hw_given: 'Total Homework',
    total_hw_given_by_me: 'Given By Me',
  },
  blogResponse: {
    published: 'Published',
    reviewed: 'Reviewed',
    submitted: 'Submitted',
    total_post: 'Total Post',
    total_students: 'Total Students',
    un_submitted: 'Unsubmitted',
  },
};
