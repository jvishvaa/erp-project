const local = {
  s3: {
    BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
  },
  apiGateway: {
    baseURL:'http://dev.olvorchidnaigaon.letseduvate.com/qbox',
    // baseURL: 'http://localhost:8000/qbox',
    // baseURL: 'https://orchids.letseduvate.com/qbox',
    // baseURL: 'http://localhost:8000' + '/qbox',
    // baseURL: `http://dev.olvorchidnaigaon.letseduvate.com/qbox`,
    baseURLCentral: 'https://dev.mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
  },
};
const dev = {
  s3: {
    BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
  },
  apiGateway: {
    baseURL: `${window.location.origin}/qbox`,
    baseURLCentral: 'https://dev.mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
  },
};

const prod = {
  s3: {
    BUCKET: 'https://omrsheet.s3.ap-south-1.amazonaws.com',
  },
  apiGateway: {
    baseURL: `${window.location.origin}/qbox`,
    baseURLCentral: 'https://mgmt.letseduvate.com/qbox',
    xAPIKey: 'vikash@12345#1231',
  },
};

const PROD = 'PROD';
const DEV = 'DEV';
const env = { [PROD]: prod, [DEV]: dev };
const config = env[process.env.REACT_APP_UI_ENV] || local;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  isCentral: false,
  ...config,
};
