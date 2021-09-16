const local = {
  s3: {
    BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
    ERP_BUCKET: 'https://erp-revamp.s3.ap-south-1.amazonaws.com/',
  },
  apiGateway: {
<<<<<<< HEAD
    baseURL: 'https://dev.olvorchidnaigaon.letseduvate.com/qbox',
=======
    // baseURL: 'https://dev.olvorchidnaigaon.letseduvate.com/qbox',
    baseURL: 'https://dev.mit.letseduvate.com/qbox',
>>>>>>> ce5d1fe4f...  context added in dashboard & blog module
    baseURLMPQ: 'https://dev.mpquiz.letseduvate.com',
    // baseURL: 'http://localhost:8000/qbox',
    // baseURL: `${window.location.origin}/qbox`,
    baseURLCentral: 'https://dev.mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
    msOriginUrl: 'https://dev.classes.letseduvate.com',
    msReportsUrl: 'https://dev.reports.letseduvate.com',
  },
};
const dev = {
  s3: {
    BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
    ERP_BUCKET: 'https://erp-revamp.s3.ap-south-1.amazonaws.com/',
  },
  apiGateway: {
    baseURL: `${window.location.origin}/qbox`,
    baseURLMPQ: 'https://dev.mpquiz.letseduvate.com',
    baseURLCentral: 'https://dev.mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
    msOriginUrl : 'https://dev.classes.letseduvate.com',
    msReportsUrl: 'https://dev.reports.letseduvate.com',
  },
};

const qa = {
  s3: {
    BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
    ERP_BUCKET: 'https://erp-revamp.s3.ap-south-1.amazonaws.com/',
  },
  apiGateway: {
    // baseURL: `${window.location.origin}/qbox`,
    baseURL: 'https://qa.olvorchidnaigaon.letseduvate.com/qbox',
    baseURLMPQ: 'https://qa.mpquiz.letseduvate.com',
    baseURLCentral: 'https://qa.mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
    msOriginUrl: 'https://qa.classes.letseduvate.com',
    msReportsUrl: 'https://qa.reports.letseduvate.com',
  },
};

const stage = {
  s3: {
    BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
    ERP_BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com/',
  },
  apiGateway: {
    baseURL: `${window.location.origin}/qbox`,
    baseURLMPQ: 'https://stage.mpquiz.letseduvate.com',
    baseURLCentral: 'https://stage.mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
  },
};

const prod = {
  s3: {
    BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
    ERP_BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com/',
  },
  apiGateway: {
    baseURL: `${window.location.origin}/qbox`,
    baseURLMPQ: 'https://mpquiz.letseduvate.com',
    baseURLCentral: 'https://mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
    msOriginUrl: 'https://classes.letseduvate.com',
    msReportsUrl: 'https://reports.letseduvate.com',
  },
};

const PROD = 'PROD';
const DEV = 'DEV';
const QA = 'QA';
const STAGE = 'STAGE';
const env = { [PROD]: prod, [DEV]: dev, [QA]: qa, [STAGE]: stage };
const config = env[process.env.REACT_APP_UI_ENV] || qa;

export default {
  // Add common config values here
  TINYMCE_API_KEY: 'g8mda2t3wiq0cvb9j0vi993og4lm8rrylzof5e6lml5x8wua',
  MAX_ATTACHMENT_SIZE: 5000000,
  isCentral: false,
  ...config,
};
