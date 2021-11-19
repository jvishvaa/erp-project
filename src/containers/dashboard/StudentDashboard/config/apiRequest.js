import axios from 'axios';
import ENVCONFIG from '../../../../config/config';
// import ENVCONFIG from './config';

const {
    apiGateway: { msOriginUrl, msReportsUrl, baseURL },
    // baseURL: { baseURL }
} = ENVCONFIG;

console.log("api12", baseURL)
console.log("api12", msReportsUrl)
console.log("ENVCONFIG")
// const baseURL: 'https://dev.olvorchidnaigaon.letseduvate.com/qbox'

const apiRequest = async (method, path, payload, responseType, isReportsURL) => {
    return new Promise(async (resolve, reject) => {
        const user = await localStorage.getItem('userDetails');
        const headers = {
            'Authorization': `Bearer ${JSON.parse(user).token}`,
        };
        isReportsURL ? headers['X-DTS-HOST'] = window.location.host : headers['X-DTS-SCHEMA'] = window.location.host;
        axios({
            method: method,
            url: `${isReportsURL ? msReportsUrl : baseURL}${path}`,
            headers: headers,
            data: payload ? payload : null,
            responseType: responseType || 'json',
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