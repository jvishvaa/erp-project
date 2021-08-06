import axios from 'axios';

import ENVCONFIG from './config';

const {
    apiGateway : { msOriginUrl },
} = ENVCONFIG;

const APIREQUEST =  async (method, path, payload)=>{
    return new Promise( async (resolve, reject)=>{
        const user = await localStorage.getItem('userDetails');
        axios({
            method: method,
            url: `${msOriginUrl}/api${path}`,
            headers: { 
              'X-DTS-SCHEMA': window.location.origin,
              'Authorization': `Bearer ${JSON.parse(user).token}`,
            },
            data : payload ? payload : null
        })
        .then((response)=>{
            resolve(response);
        })
        .catch(error => console.log('error', error));
   })
}

export default APIREQUEST;