import React,{useState,useContext} from 'react'
import Layout from 'containers/Layout'
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import FileSaver from 'file-saver';
import { Button } from '@material-ui/core';
import Loader from 'components/loader/loader';
import {AlertNotificationContext} from 'context-api/alert-context/alert-state'


const OnboardingReport = () => {
const[loading , setLoading] = useState(false)
const {user_level} = JSON.parse(localStorage.getItem('userDetails')) || {};
const { setAlert } = useContext(AlertNotificationContext);



    const downloadExcelFile = () => {
      if(user_level === 26){
        setLoading(true)
        axiosInstance.get(`${endpoints.userManagement.onBoardingReport}`,{
        headers : {
            'X-DTS-HOST': `${window.location.host}`,
            // 'X-DTS-HOST': `qa.olvorchidnaigaon.letseduvate.com/`,

        },
        responseType: 'arraybuffer',
          
        }
        ).then((res) => {
            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              FileSaver.saveAs(blob, 'report.xls');
              setLoading(false);
        }).catch((error) => {
          setLoading(false)
          setAlert('error', error.response.data.message || error.response.data.msg || 'Download Failed !');
        })
      }else{
        setAlert('error',`Access Denied !`)
      }

       
      };

  return (
    <Layout>
        {loading && <Loader />}
<div style={{display:'flex',justifyContent : 'center'}}>    
<Button variant='contained' color='primary' onClick={downloadExcelFile}>Onboarding Report</Button>
</div>

    </Layout>
  )
}

export default OnboardingReport