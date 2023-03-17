import React, { useEffect } from 'react';
import { useState } from 'react';
import Layout from '../../Layout';
import CreateclassProvider from './create-class-context/create-class-state';
import CreateClassForm from './create-class-form';
import axios from 'axios';
import GmeetAuth from './gmeetauth';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const CreateClass = () => {

  const [ authReq , setAuthReq ] = useState(false)
  const [ configData , setConfigData ] = useState()

  useEffect(() => {
    CheckGmeetConfig()
  },[])

  const CheckGmeetConfig = () => {
    axiosInstance
    .get(`${endpoints.onlineClass.onlineClassGmeetConfig}`, {
      headers: {
      'X-DTS-SCHEMA': X_DTS_HOST,
      },
      }).then((res) => {
      console.log(res);
      setConfigData(res.data.result)
      if(res.data.result?.is_gmeet_enabled == true && res.data.result?.is_authorized == false){
        setAuthReq(true)
      }else {
        setAuthReq(false)
      }
    })
    .catch((error) => {
    });
  }

  return (
    <div className="wholeCreateContainer" >
      <Layout>
        {authReq == true ?
        <GmeetAuth />
        :
        <CreateclassProvider>
          <CreateClassForm />
        </CreateclassProvider>
        }
      </Layout>
    </div>
  );
};

export default CreateClass;
