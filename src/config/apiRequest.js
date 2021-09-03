import axios from 'axios';

import ENVCONFIG from './config';

const {
    apiGateway : { msOriginUrl, msReportsUrl },
} = ENVCONFIG;

const APIREQUEST =  async (method, path, payload, responseType, isReportsURL )=>{
    return new Promise( async (resolve, reject)=>{
        const user = await localStorage.getItem('userDetails');
        const headers = {
            'Authorization': `Bearer ${JSON.parse(user).token}`,
        };
        isReportsURL ? headers['X-DTS-HOST'] = window.location.host : headers['X-DTS-SCHEMA'] = window.location.host; 
        axios({
            method: method,
            url: `${isReportsURL ? msReportsUrl : msOriginUrl}/api${path}`,
            headers: headers,
            data : payload ? payload : null,
            responseType: responseType || 'json',
        })
        .then((response)=>{
            resolve(response);
        })
        .catch(error => {
            reject(error);
        });
   })
}

export default APIREQUEST;