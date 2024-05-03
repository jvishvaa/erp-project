import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import { isMsAPI } from 'utility-functions';
import './styles.scss';
import { Row, Col, Card, Avatar, message, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import LetsEduvateLogo from '../../assets/images/logo.png';
import axios from 'axios';
import endpointsV2 from 'v2/config/endpoints';

const UserProfiles = () => {
  const history = useHistory();
  const { profileData, isERPLogin, token } = history.location.state;
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState();

  var splitedUrlAddress = window.location.origin.split('.');
  const subDomain = splitedUrlAddress[0]?.split('//')[1];

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
            return checkData;
          }
        }
      });
    return result;
  };

  const fetchSchoolDetails = () => {
    axios
      .get(`${endpointsV2.schoolDetails}?sub_domain=${subDomain}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((response) => {
        setSchoolInfo(response?.data);
      })
      .catch((err) => console.log(err));
  };

  const profileLogin = (item, showMessage = true) => {
    setLoading(true);
    localStorage.setItem('selectProfileDetails', JSON.stringify(item));
    const phone_number = JSON.parse(localStorage?.getItem('profileNumber')) || {};
    if (phone_number && item) {
      let payload = {
        contact: phone_number,
        erp_id: item?.erp_id,
        hmac: item?.hmac,
      };
      let requestHeader = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axiosInstance
        .post(
          isERPLogin ? endpoints.auth.siblingLogin : endpoints.auth.mobileLogin,
          payload,
          token && requestHeader
        )
        .then((result) => {
          if (result.status === 200) {
            setLoading(false);
            localStorage.setItem('mobileLoginDetails', JSON.stringify(result));
            localStorage.setItem(
              'userDetails',
              JSON.stringify(result.data?.login_response?.result?.user_details)
            );
            localStorage.setItem(
              'navigationData',
              JSON.stringify(result.data?.login_response?.result?.navigation_data)
            );
            localStorage.setItem(
              'apps',
              JSON.stringify(result?.data?.login_response?.result?.apps)
            );
            {
              showMessage && setAlert('success', result.data.message);
            }
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
                  history.push('/profile');
                }
              } else if (res === false) {
                erpConfig = res;
                history.push('/profile');
              } else {
                erpConfig = res;
                history.push('/profile');
              }
              userData['erp_config'] = erpConfig;
              localStorage.setItem('userDetails', JSON.stringify(userData));
              window.location.reload();
            });
          } else {
            setAlert('error', result.data.message);
            setLoading(false);
            // setDisableLogin(false)
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
        });
    }
  };

  useEffect(() => {
    fetchSchoolDetails();
  }, []);

  useEffect(() => {
    if (profileData?.profile_data?.data?.length === 1) {
      message.success('Loginng you in, please wait');
      profileLogin(profileData?.profile_data?.data?.[0], false);
    }
  }, [profileData]);

  return (
    <>
      <div
        style={{
          padding: window.innerWidth < 576 ? '2%' : '5%',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <Card className='shadow th-br-24'>
          <Spin spinning={loading}>
            <div className='d-flex pb-4 align-items-center flex-column'>
              <img
                src={schoolInfo?.school_logo ? schoolInfo?.school_logo : LetsEduvateLogo}
                alt='image'
                style={{
                  height: schoolInfo?.school_logo ? 80 : 50,
                  objectFit: 'fill',
                  mixBlendMode: 'darken',
                }}
              />
              <div className='th-black-1 th-fw-600 my-4 th-24 '>
                Please select the profile to explore account{' '}
              </div>
              <Row
                gutter={[16, 16]}
                className='w-100'
                justify='center'
                // style={{ maxHeight: 500, overflowY: 'auto' }}
              >
                {profileData?.profile_data?.data?.map((item, i) => {
                  let imageLink = `${endpoints.profile.Profilestories}${
                    ['orchids-stage.stage-vm', 'localhost']?.includes(
                      window.location.hostname
                    )
                      ? 'dev'
                      : 'prod'
                  }/media/${item?.profile}`;
                  return (
                    <Col
                      xs={24}
                      sm={12}
                      md={6}
                      className='d-flex justify-content-center mb-2'
                    >
                      <div
                        className='d-flex flex-column justify-content-between th-profile-card'
                        onClick={() => profileLogin(item)}
                        style={{ position: 'relative' }}
                      >
                        <div className='d-flex flex-column align-items-center justify-content-around pt-2 h-100'>
                          <Avatar
                            size={84}
                            src={imageLink}
                            icon={item?.profile === '' ? <UserOutlined /> : null}
                          />
                          <div className='th-truncate-2 text-center th-18 th-fw-600'>
                            {item?.name}
                          </div>
                          <div className='th-bg-grey px-2 py-1 th-br-8'>
                            <span className='th-primary'>{item?.erp_id}</span>
                          </div>
                          <div className='th-grey th-18 '>
                            {item?.grade_name} {item?.section_name}
                          </div>
                        </div>
                        <div
                          className='th-grey th-fw-500 th-16 w-100 p-2 text-center mt-2 th-truncate-2'
                          style={{ borderTop: '1px solid #d9d9d9', height: 60 }}
                        >
                          {item?.branch_name}
                        </div>
                        {item?.is_my_account && (
                          <div className='th-bg-primary px-2 py-1 th-profile-card-ribbon'>
                            {item?.roles__role_name}
                          </div>
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Spin>
        </Card>
      </div>
    </>
  );
};
export default UserProfiles;
