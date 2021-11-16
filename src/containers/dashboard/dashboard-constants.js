import endpoints from '../../config/endpoints';

const {
  dashboard: {
    teacher: {
      downloadAttendanceReport,
      downloadClassworkReport,
      downloadHomeworkReport,
      downloadBlogReport,
      downloadDiscussionReport,
      downloadRefferalReport,
      listAttendanceReport,
      listClassworkReport,
      listHomeworkReport,
      listBlogReport,
      listDiscussionReport,
      listLoginReport,
      listRoleReport,
      listRefferalReport,
    } = {},
  } = {},
} = endpoints || {};

export const reportTypeConstants = {
  attendance: 'attendance',
  classwork: 'classwork',
  homework: 'homework',
  blog: 'blog',
  discussion: 'discussion',
  login: 'login',
  role: 'role',
  referral: 'referral',
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
    download: downloadBlogReport,
  },
  discussion: {
    report: listDiscussionReport,
    download: downloadDiscussionReport,
  },
  login: {
    report: listLoginReport,
    download: downloadDiscussionReport,
  },
  role: {
    report: listRoleReport,
    download: downloadDiscussionReport,
  },
  referral: {
    report: listRefferalReport,
    download: downloadRefferalReport,
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
  discussionResponse: {
    today_total_posts: "Today's Posts",
    last_24hrs_posts: 'Last 24 Hours Posts',
    last_7days_posts: 'Last 7 days Posts',
  },
};
