import React, { useEffect, useContext, useState } from 'react';
import Layout from '../Layout';
import axiosInstance from '../../config/axios';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import './style.scss';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import UploadDialogBox from '../online-class/erp-view-class/admin/UploadDialogBox';
import APIREQUEST from "../../config/apiRequest";
const ClassWork = (props) => {
  const [responseData, setResponseData] = useState([]);
  const [classWorkDialog, setDialogClassWorkBox] = useState(false);
  const [displayImages, setDisplayImages] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  useEffect(() => {
    callingClassWorkAPI();
  }, []);

  const msApicallingClassWorkAPI = (paramOne, paramTwo, paramThree)=>{
    APIREQUEST("get", `/oncls/v1/classwork-submitted-list/?zoom_id=${paramTwo}&date=${paramThree}&online_class_id=${paramOne}`)
    .then((res) => {
      setResponseData(res.data);
      console.log(res.data, 'show responce');
    })
    .catch((error) => {
      console.log(error, 'error responce');
    });
  }

  const callingClassWorkAPI = () => {
    let paramOne = props.match.params.param1;
    let paramTwo = props.match.params.param2;
    let paramThree = props.match.params.param3;
    // let dateString = moment().format('YYYY-MM-DD');
    if(JSON.parse(localStorage.getItem('isMsAPI'))){
      msApicallingClassWorkAPI(paramOne, paramTwo, paramThree);
      return;
    }
    axiosInstance
      .get(
        `/academic/classwork-submitted-list/?zoom_id=${paramTwo}&date=${paramThree}&online_class_id=${paramOne}`,
        {}
      )
      .then((res) => {
        setResponseData(res.data);
        console.log(res.data, 'show responce');
      })
      .catch((error) => {
        console.log(error, 'error responce');
      });
  };

  const handleOpenClassWorkDialogBox = (value) => {
    setDialogClassWorkBox(value);
  };

  const handleDisplayClasswork = (index = 0) => {
    if (responseData?.length > 0) {
      const list = [...responseData] || [];
      const imageList = list[index]?.submitted_files || [];
      if (imageList?.length > 0) {
        setDisplayImages(imageList);
        setDialogClassWorkBox(true);
      } else {
        setAlert('error', 'Classwork not submitted.');
      }
    }
  };

  return (
    <Layout>
      <div className='class-work-module'>
        <div style={{ width: '95%', margin: '20px auto' }}>
          <CommonBreadcrumbs componentName='ClassWork' />
        </div>

        <Grid container spacing={3} className='folder-container'>
          {responseData &&
            responseData.map((data, index) => (
              <Grid item
                xs={6}
                sm={2}
                md={2}
                lg={2}
                onClick={() => handleDisplayClasswork(index)}
              >
                <div className='outer-box' key={index}>
                  <div className='inner-box'></div>
                  <div className='lower-box'>
                    <div className='folder-student-name'>{data?.student_name}</div>
                    <div className='folder-student-erp'>{data?.erp_id}</div>{' '}
                  </div>
                </div>
              </Grid>
            ))}
        </Grid>

        {classWorkDialog &&
          <UploadDialogBox
            imageList={[...displayImages]}
            isTeacher={true}
            classWorkDialog={classWorkDialog}
            OpenDialogBox={handleOpenClassWorkDialogBox}
          />
        }
      </div>
    </Layout>
  );
};

export default ClassWork;
