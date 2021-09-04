import axios from 'axios';
import endpoints from '../../config/endpoints';
import ENVCONFIG from '../../config/config';

const {
  apiGateway: { msReportsUrl },
} = ENVCONFIG || {};

const {
  dashboard: {
    teacher: {
      listAttendanceReport,
      listClassworkReport,
      listHomeworkReport,
      downloadAttendanceReport,
      downloadClassworkReport,
      downloadHomeworkReport,
    } = {},
  } = {},
} = endpoints || {};

const {
  token: TOKEN,
  user_level = 0,
  is_superuser = false,
} = JSON.parse(localStorage.getItem('userDetails'));

const userLevel = user_level ? user_level : is_superuser ? 1 : '';

const headers = {
  'X-DTS-HOST': window.location.host,
  // 'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com',
  // 'X-DTS-HOST': 'dev.mit.letseduvate.com',
  Authorization: `Bearer ${TOKEN}`,
};

export const reportTypeConstants = {
  attendance: 'attendance',
  classwork: 'classwork',
  homework: 'homework',
};

const apiConfig = {
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
};

export const getReport = (decisionParam, param) => {
  const params = { ...param, level: userLevel };
  const config = { headers, params };
  const url = msReportsUrl + apiConfig[decisionParam]['report'];
  return axios
    .get(url, config)
    .then((response) => {
      const { data: { status_code: status, result } = {} } = response || {};
      return result || [];
    })
    .catch(() => {});
};

export const downloadReport = (decisionParam, param) => {
  const params = { ...param, level: userLevel };
  const config = { headers, params, responseType: 'arraybuffer' };
  const url = msReportsUrl + apiConfig[decisionParam]['download'];
  return axios
    .get(url, config)
    .then((response) => {
      return response || {};
    })
    .catch(() => {});
};
