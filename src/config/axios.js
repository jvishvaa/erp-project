import axios from 'axios';
import ENVCONFIG from './config';

const {
  apiGateway: { baseURL },
} = ENVCONFIG;

//require('dotenv').config();

const axiosInstance = axios.create({ baseURL });

// ****** enable the following code to attach authorization headers on each request and for logging out when an unauthorize request is send *****//

axiosInstance.interceptors.request.use(async function (config) {
  const user = await localStorage.getItem('userDetails');
  const requestConfig = config;
  if (user) {
    requestConfig.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response?.status === 401) {
      await localStorage.removeItem('userDetails');
      // Show toast message login to continue
    } else {
      // something went wrong
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Upload: document file size
export const FileSize = {
  img_pdf: 1048576,
  audio_video: 52428800
}
