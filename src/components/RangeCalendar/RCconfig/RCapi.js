import axios from 'axios';

const apiRequest = async (method, path, payload, responseType) => {
  return new Promise(async (resolve, reject) => {
    const user = await localStorage.getItem('userDetails');
    const headers = {
      Authorization: `Bearer ${JSON.parse(user).token}`,
    };
    axios({
      method: method,
      url: `${path}`,
      headers: headers,
      data: payload ? payload : null,
      responseType: responseType || 'json',
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default apiRequest;
