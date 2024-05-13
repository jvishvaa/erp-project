const webUrl = window.location.host;
const hostUrl = webUrl.split('.');
const chechUrl = hostUrl[0] === 'orchids' || hostUrl[0] === 'orchids-prod' ? true : false;

const isPreprod =
  window.location.host == 'orchids.prod.letseduvate.com' ||
  window.location.host == 'b2b.prod.letseduvate.com'
    ? true
    : false;

const local = {
  s3: {
    BUCKET: 'https://d2r9gkgplfhsr2.cloudfront.net',
    ERP_BUCKET: 'https://d3ka3pry54wyko.cloudfront.net/',
    UDAAN_BUCKET: 'https://d3rxnono6u9knq.cloudfront.net',
  },
  apiGateway: {
    baseURL: 'https://dev.olvorchidnaigaon.letseduvate.com/qbox',
    baseURLMPQ: 'https://dev.mpquiz.letseduvate.com',
    baseUdaan: 'https://udanta.dev-k8.letseduvate.com/qbox',
    // baseUdaan: 'https://dev.udaansurelearning.com/qbox',
    baseFinanceURL: 'https://dev.erpfinance.letseduvate.com/qbox',
    // baseURL: 'http://localhost:8000/qbox',
    // baseURL: `${window.location.origin}/qbox`,
    baseURLCentral: 'https://dev.mgmt.letseduvate.com/qbox',
    finance: `https://${hostUrl[0]}.finance.stage-vm.letseduvate.com`,
    xAPIKey: 'vikash@12345#1231',
    msOriginUrl: 'https://dev.classes.letseduvate.com',
    msReportsUrl: 'https://dev.reports.letseduvate.com',
    msReportsUrlNew: 'https://reports.dev-k8.letseduvate.com',
    baseEvent: 'http://dev-et.letseduvate.com/',
    finance: 'https://uidev.erpfinance.letseduvate.com',
    newBlogURL: 'https://activities-ms.dev-k8.letseduvate.com',
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
    baseUdaan: 'https://udanta.dev-k8.letseduvate.com/qbox',
    // baseUdaan: 'https://dev.udaansurelearning.com/qbox',
    baseFinanceURL: 'https://dev.erpfinance.letseduvate.com/qbox',
    baseURLMPQ: 'https://dev.mpquiz.letseduvate.com',
    baseURLCentral: 'https://dev.mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
    msOriginUrl: 'https://dev.classes.letseduvate.com',
    msReportsUrl: 'https://dev.reports.letseduvate.com',
    msReportsUrlNew: 'https://reports.dev-k8.letseduvate.com',
    baseEvent: 'http://dev-et.letseduvate.com/',
    finance: 'https://uidev.erpfinance.letseduvate.com',
    newBlogURL: 'https://activities-ms.dev-k8.letseduvate.com',
  },
};

const qa = {
  s3: {
    BUCKET: 'https://mgmt-cdn-stage.stage-gke.letseduvate.com',
    ERP_BUCKET: 'https://d3ka3pry54wyko.cloudfront.net/',
    //CENTRAL_BUCKET: 'https://d3ka3pry54wyko.cloudfront.net', // ALERT!!! QA & DEV in D3 but PROD in D2
    CENTRAL_BUCKET: 'https://mgmt-cdn-stage.stage-gke.letseduvate.com',
    IBOOK_BUCKET: 'https://d2r9gkgplfhsr2.cloudfront.net',
  },
  apiGateway: {
    baseURL: `${window.location.origin}/qbox`,
    baseURLMPQ: 'https://qa.mpquiz.letseduvate.com',
    baseURLCentral: 'https://mgmt.qa.letseduvate.com/qbox',
    baseUdaan: 'https://udanta.dev-k8.letseduvate.com/qbox',
    baseURLCentral: 'https://mgmt-stage.stage-gke.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
    msOriginUrl: 'https://classes.qa.letseduvate.com',
    msReportsUrl: 'https://reports.qa.letseduvate.com',
    msReportsUrlNew: 'https://reports.qa.letseduvate.com',
    baseEvent: 'http://dev-et.letseduvate.com/',
    finance: `https://${hostUrl[0]}.finance.stage-vm.letseduvate.com`,
    newBlogURL: 'https://activities-ms.qa.letseduvate.com',
    baseFinanceURL: `https://${hostUrl[0]}.finance.stage-vm.letseduvate.com/qbox`,
  },
};

const stage = {
  s3: {
    BUCKET: 'https://mgmt-cdn-stage.stage-gke.letseduvate.com',
    ERP_BUCKET: 'https://acad-cdn-stage.stage-vm.letseduvate.com/', // ALERT GCP STAGE CDN
    erp_googleapi: 'https://storage.googleapis.com/erp-academic-stage',
    ERP_BUCKET_2: 'https://acad-cdn-stage.stage-vm.letseduvate.com', // ALERT GCP STAGE CDN
    CENTRAL_BUCKET: 'https://mgmt-cdn-stage.stage-gke.letseduvate.com', // ALERT!!! QA & DEV in D3 but PROD in D2
    IBOOK_BUCKET: 'https://d2r9gkgplfhsr2.cloudfront.net',
    FINANCE_BUCKET: 'https://storage.googleapis.com/letseduvate/prod/media',
  },
  apiGateway: {
    baseURL: `https://orchids-stage.stage-vm.letseduvate.com/qbox`,
    baseURLMPQ: 'https://stage.mpquiz.letseduvate.com',
    baseUdaan: 'https://udanta.dev-k8.letseduvate.com/qbox',
    // baseURLCentral: 'https://mgmt-stage.letseduvate.com/qbox',
    baseURLCentral: 'https://mgmt-stage.stage-gke.letseduvate.com/qbox',
    msOriginUrl: 'https://api-classes-stage.stage-gke.letseduvate.com',
    xAPIKey: 'vikash@12345#1231',
    baseEvent: 'http://events.letseduvate.com/',
    newBlogURL: 'https://activities-stage.stage-gke.letseduvate.com',
    msReportsUrl: 'https://api-reports-stage.stage-gke.letseduvate.com',
    msReportsUrlNew: 'https://reports.qa.letseduvate.com',
    baseFinanceURL: `https://${hostUrl[0]}.finance.stage-vm.letseduvate.com/qbox`,
    finance: `https://${hostUrl[0]}.finance.stage-vm.letseduvate.com`,
    crm: 'https://marketing.stage-gke.letseduvate.com',
    cvbox: 'https://cvbox.stage-gke.letseduvate.com',
    gcloud: 'https://asia-south1-prj-stage-service-k12.cloudfunctions.net',
    timeTracker: 'https://pagetimetracker.stage-gke.letseduvate.com/api/tracker/',
  },
};

const prod = {
  s3: {
    BUCKET: 'https://mgmt-cdn.letseduvate.com',
    ERP_BUCKET: 'https://acad-cdn.letseduvate.com/',
    erp_googleapi: 'https://storage.googleapis.com/erp-revamp',
    ERP_BUCKET_2: 'https://acad-cdn.letseduvate.com',
    CENTRAL_BUCKET: 'https://mgmt-cdn.letseduvate.com', // ALERT!!! QA & DEV in D3 but PROD in D2
    IBOOK_BUCKET: 'https://d2r9gkgplfhsr2.cloudfront.net',
    FINANCE_BUCKET: 'https://storage.googleapis.com/letseduvate/prod/media',
  },
  apiGateway: {
    baseURL: `${window.location.origin}/qbox`,
    baseURLMPQ: 'https://mpquiz.letseduvate.com',
    baseURLCentral: isPreprod
      ? 'https://mgmt.prod.letseduvate.com/qbox'
      : 'https://mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
    msOriginUrl: 'https://classes.letseduvate.com',
    msReportsUrl: isPreprod
      ? 'https://reports.prod.letseduvate.com'
      : 'https://reports.letseduvate.com',
    msReportsUrlNew: isPreprod
      ? 'https://reports.prod.letseduvate.com'
      : 'https://reports.letseduvate.com',
    baseEvent: 'http://events.letseduvate.com/',
    finance: isPreprod
      ? 'https://orchids.finance-prod.letseduvate.com'
      : chechUrl
      ? 'https://orchids.finance.letseduvate.com'
      : `https://${hostUrl[0]}.finance.letseduvate.com`,
    newBlogURL: 'https://activities.letseduvate.com',
    baseFinanceURL: isPreprod
      ? 'https://orchids.finance-prod.letseduvate.com/qbox'
      : chechUrl
      ? 'https://orchids.finance.letseduvate.com/qbox'
      : `https://${hostUrl[0]}.finance.letseduvate.com/qbox`,
    cvbox: 'https://careerbox.letseduvate.com',
    gcloud: 'https://asia-south1-prj-prod-service-k12.cloudfunctions.net',
    timeTracker: 'https://pagetimetracker.letseduvate.com/api/tracker/',
  },
};

const PROD = 'PROD';
const DEV = 'DEV';
const QA = 'QA';
const STAGE = 'STAGE';
const env = { [PROD]: prod, [DEV]: dev, [QA]: qa, [STAGE]: stage };
const config = env[process.env.REACT_APP_UI_ENV] || stage;

export default {
  // Add common config values here
  TINYMCE_API_KEY: 'g8mda2t3wiq0cvb9j0vi993og4lm8rrylzof5e6lml5x8wua',
  MAX_ATTACHMENT_SIZE: 5000000,
  isCentral: false,
  ...config,
};
