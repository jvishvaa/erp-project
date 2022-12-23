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
  const [ changeRecent , setChangeRecent ] = useState(false)

  const onChangeTab = (e) => {
  setShowTab(e)
  }

  const handleRecent = () => {
    if(changeRecent == true){
      setChangeRecent(false)
    }else if(changeRecent == false){
      setChangeRecent(true)
    }
  }


  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
              onClick={handleRecent}
                className='th-grey th-16 th-pointer'
              >
                Online Books
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
                    <EbookView showTab={showTab} changeRecent={changeRecent} />
                  </TabPane>
                  <TabPane tab='IBOOK' key='2'>
                    <EbookView showTab={showTab} changeRecent={changeRecent} />
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
