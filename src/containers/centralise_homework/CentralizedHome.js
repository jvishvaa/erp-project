import React, { useState, useRef } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Tabs } from 'antd';
import CentralizedHomework from './index';
import HwUpload from './hw_upload/hwUpload';
const { TabPane } = Tabs;

const CenralizedHome = () => {
  const [showTab, setShowTab] = useState(1);
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level;

  const onChange = (key) => {
    setShowTab(key);
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
