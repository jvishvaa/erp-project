import React, { useState, useRef, useEffect } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Tabs, message } from 'antd';
import CentralizedHomework from './index';
import HwUpload from './hw_upload/hwUpload';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';

const { TabPane } = Tabs;

const CenralizedHome = () => {
  const history = useHistory();
  const [showTab, setShowTab] = useState(history?.location?.state?.key || 1);
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level;
  const [isAuditor, setIsAuditor] = useState();
  const [loading, setLoading] = useState(true);

  const onChange = (key) => {
    setShowTab(key);
  };

  useEffect(() => {
    checkEvaluator();
  }, []);

  const checkEvaluator = async (params = {}) => {
    setLoading(true);
    await axiosInstance
      .get(`${endpoints.centralizedHomework.checkEvaluator}`)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setIsAuditor(!res?.data?.result?.is_evaluator);
        } else {
          message.error(res?.data?.message);
        }
        console.log({ res });
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className='th-grey th-16'
                onClick={() => {
                  history.push('/homework/centralized-eval-reports');
                }}
              >
                Centralized Report
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Centralized Homework
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className='th-tabs th-bg-white'>
                <Tabs type='card' onChange={onChange} defaultActiveKey={showTab}>
                  <TabPane tab='HOMEWORK' key='1'>
                    <CentralizedHomework />
                  </TabPane>
                  {userLevel === 34 ||
                  userLevel === 8 ||
                  userLevel === 11 ||
                  userLevel === 10 ? (
                    <TabPane tab='UPLOAD' key='2'>
                      <HwUpload />
                    </TabPane>
                  ) : null}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default CenralizedHome;
