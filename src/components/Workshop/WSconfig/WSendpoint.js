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
  WORKSHOP: {
    branch: `${getBaseUrl(1)}/erp_user/branch/`,
    grades: `${getBaseUrl(1)}/erp_user/grades-list/`,
    courses: `${getBaseUrl(1)}/aol/courses/`,
    tutorList: `${getBaseUrl(1)}/workshop/teacher-list/`,
    tutoravailability: `${getBaseUrl(1)}/workshop/tutor-availability/`,
    createworkshop: `${getBaseUrl(1)}/workshop/create-workshop/`,
    retrieveworkshop: `${getBaseUrl(1)}/workshop/retrieve-workshop-class/`,
    userWorkShop: `${getBaseUrl(1)}/workshop/create-user-workshop/`,
    cancleworkShop: `${getBaseUrl(1)}/workshop/workshop-cancel/`,
  },
};
