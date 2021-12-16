import axios from 'axios';
import ENVCONFIG from '../../../../config/config';

const {
    apiGateway: { msOriginUrl, msReportsUrl, baseURL },
    // baseURL: { baseURL }
} = ENVCONFIG;

const apiRequest = async (method, path, payload, responseType, isReportsURL, timeout = 5000) => {
    return new Promise(async (resolve, reject) => {
        const user = await localStorage.getItem('userDetails');
        const headers = {
            'Authorization': `Bearer ${JSON.parse(user).token}`,
        };
        if (isReportsURL) {
            // headers['X-DTS-HOST'] = window.location.host;
            headers['X-DTS-HOST'] = "dev.olvorchidnaigaon.letseduvate.com";
        }
        axios({
            method: method,
            url: `${isReportsURL ? msReportsUrl : baseURL}${path}`,
            headers: headers,
            data: payload ? payload : null,
            responseType: responseType || 'json',
            timeout: timeout
        })
            .then((response) => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    })
}

export default apiRequest;