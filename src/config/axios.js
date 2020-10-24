import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
});

// ****** enable the following code to attach authorization headers on each request and for logging out when an unauthorize request is send *****//

// axiosInstance.interceptors.request.use(async function (config) {
//   const user = await localStorage.getItem('user');
//   const requestConfig = config;
//   if (user) {
//     requestConfig.headers.Authorization = `JWT ${JSON.parse(user).token}`;
//   }
//   return config;
// });
// axiosInstance.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   async function (error) {
// if (error.response?.status === 401) {
//   console.log('user logged out');
//   await localStorage.removeItem('user');
//   // Show toast message login to continue
// } else {
//   // something went wrong
// }
// return Promise.reject(error);
//   }
// );

export default axiosInstance;
