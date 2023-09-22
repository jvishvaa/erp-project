import ENVCONFIG from '../../../../config/config';

const {
  apiGateway: { baseURLCentral, baseUdaan },
  s3: { BUCKET: s3BUCKET, ERP_BUCKET, CENTRAL_BUCKET: CENTRAL_BUCKET },
} = ENVCONFIG;

console.log('apigateway', ENVCONFIG);
// const baseURLCentral = 'http://13.232.30.169/qbox';
// const appBaseURL = window.location.hostname;
// const baseURLCentral = (appBaseURL.includes("dev.") || appBaseURL.includes("localhost"))
//   ? 'http://dev.mgmt.letseduvate.com/qbox'
//   : 'https://mgmt.letseduvate.com/qbox';
// const baseURLCentral = 'http://dev.mgmt.letseduvate.com/qbox'
// const baseURLCentral = 'https://mgmt.letseduvate.com/qbox';

export default {
  auth: {
    login: '/auth/login/',
  },
  s3: {
    BUCKET: `${CENTRAL_BUCKET}`,
    ERP_BUCKET: ERP_BUCKET,
    Userstories: `${ERP_BUCKET}dev/media/`,
    Audio: ERP_BUCKET,
  },
  dashboard: {
    student: {
      roles: '/erp_user/roles/',
      create: '/announcement/create/',
      update: '/api/reports/v1/announcement_list/',
      assessment: '/assessment/assessment-list/',
      assessments: '/api/reports/v1/assessment_list/',
      certificates: '/certificates/getcertificate/',
      blogdata: '/api/reports/v1/blog_list/',
      nextBlogdata: '/academic/blog_list/?page=',
      commentData: '/academic/posts-like-users/',
      replyToAnswer: '/academic/create-answer-replay/',
      commentReplies: '/academic/comments-list/',
      homeworks: '/api/reports/v1/homework_status/',
      homework: '/academic/homework_status/',
      blogLike: '/academic/like_blog/',
      dicussionLike: '/academic/',
      onlineclasstimestats: '/api/reports/v1/online-class-time-stats/',
      deleteAnnouncement: '/announcement/',
      editAnnouncement: '/announcement/',
      orchadioapi: '/api/reports/v1/orchadio_list/',
      likedsongorchadio: '/academic/',
      calendar: '/api/reports/v1/holiday/',
    },

    // s3: 'https://erp-revamp.s3.ap-south-1.amazonaws.com',
    s3: s3BUCKET,
    deleteFromS3: '/academic/delete-file/',
    aolConfirmURL: 'aol.letseduvate.com', //WARNING: Uncomment this code before pushing
    // aolConfirmURL:'localhost:3000', //WARNING: Comment this code before pushing
    baseURLCentral,
  },
};
