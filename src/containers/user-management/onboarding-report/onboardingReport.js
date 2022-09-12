import React,{useState} from 'react'
import Layout from 'containers/Layout'
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import FileSaver from 'file-saver';
import { Button } from '@material-ui/core';
import Loader from 'components/loader/loader';


const OnboardingReport = () => {
const[loading , setLoading] = useState(false)

    const downloadExcelFile = () => {
        setLoading(true)
        axiosInstance.get(`${endpoints.userManagement.onBoardingReport}`,{
        headers : {
            'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
        },
        responseType: 'arraybuffer',
          
        }
        ).then((res) => {
            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              FileSaver.saveAs(blob, 'report.xls');
              setLoading(false);
        })
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