import React, { useState, useContext, useEffect } from 'react';
import { Card, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import { isMsAPI } from 'utility-functions';
import './styles.scss';
import { Grid } from '@material-ui/core';
import Loader from 'components/loader/loader';
import { green } from '@material-ui/core/colors';
import ENVCONFIG from 'config/config.js'



const UserProfiles = () => {
  const history = useHistory();
  const { profileData } = history.location.state;
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const tabStyle = {
    width: '100%',
    margin: '3% auto',
    borderRadius: '10px 10px 0 0',
  };

  const fetchERPSystemConfig = async (status) => {
    let data = (await JSON.parse(localStorage.getItem('userDetails'))) || {};
    const branch = data?.role_details?.branch;
    let payload = [];
    const result = axiosInstance
      .get(endpoints.checkAcademicView.isAcademicView)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          if (res?.data?.result[0] == 'True') {
            return true;
          } else if (res?.data?.result[0] == 'False') {
            return false;
          } else if (res?.data?.result[0]) {
            let resData = res?.data?.result[0];
            const selectedId = branch?.map((el) => el?.id);
            let checkData = resData?.some((item) => selectedId.includes(Number(item)));
            console.log(checkData, 'check');
            return checkData;
          }
        }
      });
    return result;
  };

  const profileLogin = (item) => {
    setLoading(true)
    localStorage.setItem('selectProfileDetails', JSON.stringify(item));
    const phone_number = JSON.parse(localStorage?.getItem('profileNumber')) || {};
    if (phone_number && item) {
      let payload = {
        contact: phone_number,
        erp_id: item?.erp_id,
        hmac: item?.hmac,
      };
      axiosInstance
        .post(endpoints.auth.mobileLogin, payload)
        .then((result) => {
          if (result.status === 200) {
            setLoading(false)
            localStorage.setItem('mobileLoginDetails', JSON.stringify(result));
            localStorage.setItem(
              'userDetails',
              JSON.stringify(result.data?.login_response?.result?.user_details)
            );
            localStorage.setItem(
              'navigationData',
              JSON.stringify(result.data?.login_response?.result?.navigation_data)
            );
            setAlert('success', result.data.message);
            isMsAPI();
            fetchERPSystemConfig(profileData?.isLogin).then((res) => {
              let erpConfig;
              let userData = JSON.parse(localStorage.getItem('userDetails'));
              if (res === true || res.length > 0) {
                erpConfig = res;
                let refURL = localStorage.getItem('refURL');
                if (refURL) {
                  localStorage.removeItem('refURL');
                  window.location.href = refURL;
                } else if (userData?.user_level !== 4) {
                  history.push('/acad-calendar');
                  console.log(userData?.user_level, 'level');
                } else {
                  history.push('/dashboard');
                }
              } else if (res === false) {
                erpConfig = res;
                history.push('/dashboard');
              } else {
                erpConfig = res;
                history.push('/dashboard');
              }
              userData['erp_config'] = erpConfig;
              localStorage.setItem('userDetails', JSON.stringify(userData));
              window.location.reload();
            });
          } else {
            setAlert('error', result.data.message);
            setLoading(false)
            // setDisableLogin(false)
          }
        })
        .catch((error) => {
          setLoading(false)
          setAlert('error', error.message);
        });
    }
  };

  return (
    <>
      <div style={{ margin: '50px' }}>
        {loading ? (
          <Loader/>
        ): (
          <>
          <Grid container spacing={2}>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={12} style={{marginLeft:'25px'}}>
            <p style={{ fontWeight: '600', fontSize: '30px' }}>Welcome,</p>
            <p style={{ fontSize: '20px' }}>Select Profile to explore account</p>
            </Grid>

            <Grid item
              md={12}
              className='card_container'
            >
              {profileData?.profile_data?.data?.map((item, i) => (
                <Card
                  size='small'
                  title={item?.branch_name}
                  headStyle={{ backgroundColor: '#e0e0e0', color: 'black', width:400 }}
                  style={{
                    width: 400,
                    height: 150,
                  }}
                  className='card_style'
                  onClick={() => profileLogin(item)}

                >
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Avatar
                      size={64}
                      src = {`${ENVCONFIG?.s3?.ERP_BUCKET}${item?.profile}`}   
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: 'inherit',
                      }}
                    >
                      <p
                        style={{ marginLeft: '10px', fontWeight: '800', fontSize: '18px', margin: '0px 10px' }}
                      >
                        {item?.name}
                      </p>
                      <p style={{ marginLeft: '10px', fontSize: '12px', color:'green', fontWeight:'bolder',margin:'0px 10px'}}>{item?.erp_id}</p>
                      <div style={{display:"flex", color:'green', margin:'2px 10px'}}>
                      <p style={{ fontSize: '12px', fontWeight:'bolder' }}>{item?.grade_name}</p>
                      <p style={{fontSize:'12px', marginLeft:'10px'}}> | </p>
                      <p style={{ marginLeft: '10px', fontSize: '12px', fontWeight:'bolder' }}>{item?.section_name}</p>

                      </div>

                    </div>
                  </div>
                  {/* <p>{item?.grade_name}</p> */}
                </Card>
              ))}
            </Grid>

            {/* </Grid> */}
          </Grid>
          
          </>
          
        )}

      </div>
    </>
  );
};
export default UserProfiles;
