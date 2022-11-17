const webUrl = window.location.host;
const hostUrl = webUrl.split('.');
const chechUrl = hostUrl[0] === 'orchids' ? true : false;

const local = {
  s3: {
    BUCKET: 'https://d2r9gkgplfhsr2.cloudfront.net',
    ERP_BUCKET: 'https://d3ka3pry54wyko.cloudfront.net/',
    UDAAN_BUCKET: 'https://d3rxnono6u9knq.cloudfront.net',
  },
  apiGateway: {
    baseURL: 'https://dev.olvorchidnaigaon.letseduvate.com/qbox',
    baseURLMPQ: 'https://dev.mpquiz.letseduvate.com',
    baseUdaan: 'https://dev.udaansurelearning.com/qbox',
    baseFinanceURL: 'https://dev.erpfinance.letseduvate.com/qbox',
    // baseURL: 'http://localhost:8000/qbox',
    // baseURL: `${window.location.origin}/qbox`,
    baseURLCentral: 'https://dev.mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
    msOriginUrl: 'https://dev.classes.letseduvate.com',
    msReportsUrl: 'https://dev.reports.letseduvate.com',
    msReportsUrlNew: 'https://reports.dev-k8.letseduvate.com',
    baseEvent: 'http://dev-et.letseduvate.com/',
    finance: 'https://uidev.erpfinance.letseduvate.com',
  },
};
const dev = {
  s3: {
    BUCKET: 'https://d2r9gkgplfhsr2.cloudfront.net',
    ERP_BUCKET: 'https://d3ka3pry54wyko.cloudfront.net/',
    // BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
    // ERP_BUCKET: 'https://erp-revamp.s3.ap-south-1.amazonaws.com/',
    CENTRAL_BUCKET: 'https://d3ka3pry54wyko.cloudfront.net', // ALERT!!! QA & DEV in D3 but PROD in D2
  },
  apiGateway: {
    baseURL: 'https://dev.olvorchidnaigaon.letseduvate.com/qbox',
    baseUdaan: 'https://dev.udaansurelearning.com/qbox',
    baseFinanceURL: 'https://dev.erpfinance.letseduvate.com/qbox',
    baseURLMPQ: 'https://dev.mpquiz.letseduvate.com',
    baseURLCentral: 'https://dev.mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
    msOriginUrl: 'https://dev.classes.letseduvate.com',
    msReportsUrl: 'https://dev.reports.letseduvate.com',
    msReportsUrlNew: 'https://reports.dev-k8.letseduvate.com',
    baseEvent: 'http://dev-et.letseduvate.com/',
    finance: 'https://uidev.erpfinance.letseduvate.com',
  },
};

const qa = {
  s3: {
    BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
    ERP_BUCKET: 'https://erp-revamp.s3.ap-south-1.amazonaws.com/',
    //CENTRAL_BUCKET: 'https://d3ka3pry54wyko.cloudfront.net', // ALERT!!! QA & DEV in D3 but PROD in D2
    CENTRAL_BUCKET: 'https://d2r9gkgplfhsr2.cloudfront.net',
  },
  apiGateway: {
    // baseURL: `${window.location.origin}/qbox`,
    baseURL: 'https://qa.olvorchidnaigaon.letseduvate.com/qbox',
    baseURLMPQ: 'https://qa.mpquiz.letseduvate.com',
    baseURLCentral: 'https://qa.mgmt.letseduvate.com/qbox',
    baseFinanceURL: 'https://qafinance.school.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
    msOriginUrl: 'https://classes.qa.letseduvate.com',
    msReportsUrl: 'https://reports.qa.letseduvate.com',
    msReportsUrlNew: 'https://qa.reports.letseduvate.com',
    baseEvent: 'http://dev-et.letseduvate.com/',
    finance: 'https://uidev.erpfinance.letseduvate.com',
  },
};

const stage = {
  s3: {
    BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
    ERP_BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com/',
    CENTRAL_BUCKET: 'https://d2r9gkgplfhsr2.cloudfront.net', // ALERT!!! QA & DEV in D3 but PROD in D2
  },
  apiGateway: {
    baseURL: `${window.location.origin}/qbox`,
    baseURLMPQ: 'https://stage.mpquiz.letseduvate.com',
    baseURLCentral: 'https://stage.mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
    baseEvent: 'http://events.letseduvate.com/',
  },
};

const prod = {
  s3: {
    BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
    ERP_BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com/',
    CENTRAL_BUCKET: 'https://d2r9gkgplfhsr2.cloudfront.net', // ALERT!!! QA & DEV in D3 but PROD in D2
  },
  apiGateway: {
    baseURL: `${window.location.origin}/qbox`,
    baseURLMPQ: 'https://mpquiz.letseduvate.com',
    baseURLCentral: 'https://mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
    msOriginUrl: 'https://classes.letseduvate.com',
    msReportsUrl: 'https://reports.letseduvate.com',
    msReportsUrlNew: 'https://reports.letseduvate.com',
    baseEvent: 'http://events.letseduvate.com/',
    finance: `https://${hostUrl[0]}.finance.letseduvate.com`,
    baseFinanceURL: chechUrl
      ? 'https://orchids.finance.letseduvate.com/qbox'
      : `https://${hostUrl[0]}.finance.letseduvate.com/qbox`,
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
