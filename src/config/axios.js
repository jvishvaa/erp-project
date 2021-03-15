import axios from 'axios';

const axiosInstance = axios.create({
  //  baseURL: `${window.location.origin}/qbox`,
  // baseURL:'https://revamperp.letseduvate.com/qbox',
  // baseURL: 'https://erpnew.letseduvate.com/qbox',
  // baseURL: 'https://aol.letseduvate.com/qbox',
  // baseURL: 'http://olvorchidnaigaon.letseduvate.com/qbox',
  // baseURL: 'http://13.234.252.195:443',
  baseURL: 'http://192.168.0.96:8000/qbox',
  // baseURL:'http://192.168.0.96/qbox'
});

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
      console.log('user logged out');
      await localStorage.removeItem('userDetails');
      // Show toast message login to continue
    } else {
      // something went wrong
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
