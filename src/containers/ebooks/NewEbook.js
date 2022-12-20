import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Tabs, Select } from 'antd';
import EbookView from './EbooknewView';
import FeeReminder from 'v2/FaceLift/FeeReminder/FeeReminder';
import { useHistory } from 'react-router-dom';
const { TabPane } = Tabs;

const NewEbookView = (props) => {
  const history = useHistory();
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [showTab, setShowTab] = useState('1');

  const onChangeTab = (e) => {
    setShowTab(e)
  }


  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-grey th-16 th-pointer'
              >
                Lesson Plan
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                {showTab == '1' ? 'EBOOK' : 'IBOOK'}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className='th-tabs th-bg-white'>
                <Tabs type='card' onChange={onChangeTab} activeKey={showTab}>
                  <TabPane tab='EBOOK' key='1'>
                    <EbookView showTab={showTab} />
                  </TabPane>
                  <TabPane tab='IBOOK' key='2'>
                    <EbookView showTab={showTab} />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default NewEbookView;
