import ENVCONFIG from '../../../config/config';

const {
  apiGateway: { baseURL },
} = ENVCONFIG;

const getBaseUrl = (type) => {
  switch (type) {
    case 1:
      return baseURL;
    default:
      return baseURL;
  }
};

export default {
  RANGECALENDAR: {
    getHolidayList: `${getBaseUrl(1)}/academic/holiday/`,
  },
};
