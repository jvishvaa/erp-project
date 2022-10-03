import React, { useState, useRef } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Tabs, Select } from 'antd';
import PeriodView from './PeriodView';
import AnnualPlan from './AnnualPlan';
import FeeReminder from 'v2/FaceLift/FeeReminder/FeeReminder';
import { useHistory } from 'react-router-dom';
const { TabPane } = Tabs;

const LessonPlan = () => {
  const history = useHistory();
  const [volume, setVolume] = useState('');
  const [showTab, setShowTab] = useState(history?.location?.state?.showTab || '1');
  const getVolume = (value) => {
    setVolume(value);
  };

  const closeTable = useRef(null);
  const onChange = (key) => {
    setShowTab(key);
  };

  return (
    <React.Fragment>
      <Layout>
        <FeeReminder />{' '}
        <div className='row py-3 px-2'>
          <div className='col-md-8 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-black-1 th-18'>Lesson Plan</Breadcrumb.Item>
              {/* {volume && showTab == 1 && (
                <Breadcrumb.Item className='th-black-1 th-16'>{volume}</Breadcrumb.Item>
              )} */}
            </Breadcrumb>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className='th-tabs th-bg-white'>
                <Tabs type='card' onChange={onChange} defaultActiveKey={showTab}>
                  <TabPane tab='PERIOD VIEW' key='1'>
                    <PeriodView />
                  </TabPane>
                  <TabPane tab='ANNUAL PLAN' key='2'>
                    <AnnualPlan getVolume={getVolume} />
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

export default LessonPlan;
