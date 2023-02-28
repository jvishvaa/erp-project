import React, { useEffect, useState } from 'react';
import Layout from 'containers/Layout';
import Google from 'assets/images/google.png'
import { Divider, Button } from 'antd';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';

const GmeetAuth = () => {
    const [authLink, setAuthLink] = useState()

    useEffect(() => {
        getAuthUrl({
            tutor_id: '4093',
        })
    }, [])

    const getAuthUrl = (params = {}) => {
        axiosInstance
            .get(`${endpoints.onlineClass.gmeetAuth}`, {
                params: { ...params },
            })
            .then((res) => {
                console.log(res);
                setAuthLink(res?.data?.result?.link)
            })
            .catch((error) => {
            });
    }

    const openAuthWindow = () => {
        
        var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
        window.open(authLink, '_blank', "left=500,top=300,width=520,height=520")
    }


    return (
        <div className="w-100" >
            <Layout>
                <div className='w-100 d-flex justify-content-center' >
                    <div className='th-br-10 card d-flex align-items-center'  >
                        <p className='th-25 th-fw-600 m-3'>Authentication Required</p>
                        <p className='th-14 m-1' style={{ textDecoration: 'underline' }} >Google Meet Authentication Required to Create Class</p>
                        <div className='d-flex justify-content-center my-3' >
                            <img src={Google} alt='Google Meet' className='w-25' />
                        </div>
                        <p className='th-14 my-2'>Please Click on the Button Below to Authenticate</p>
                        <div className='d-flex justify-content-center my-4' >
                            <Button type='primary' onClick={openAuthWindow} >Authenticate</Button>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    );
};

export default GmeetAuth;
