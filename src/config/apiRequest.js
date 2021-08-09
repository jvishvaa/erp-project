import axios from 'axios';

import ENVCONFIG from './config';

const {
    apiGateway : { msOriginUrl },
} = ENVCONFIG;

const APIREQUEST =  async (method, path, payload, responseType )=>{
    return new Promise( async (resolve, reject)=>{
        const user = await localStorage.getItem('userDetails');
        axios({
            method: method,
            url: `${msOriginUrl}/api${path}`,
            headers: { 
              'X-DTS-SCHEMA': window.location.host,
              'Authorization': `Bearer ${JSON.parse(user).token}`,
            },
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