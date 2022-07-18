import React, { useState, useRef } from 'react';
import Layout from 'v2/Layout';
import { Breadcrumb, Tabs, Select } from 'antd';
import PeriodView from './PeriodView';
import AnnualPlan from './AnnualPlan';
const { TabPane } = Tabs;

const LessonPlan = () => {
  const [volume, setVolume] = useState('');
  const [showTab, setShowTab] = useState(1);
  const getVolume = (value) => {
    setVolume(value);
  };

  const closeTable = useRef(null);
  const onChange = (key) => {
    setShowTab(key);
    if (key == 1) {
      setVolume('');
      closeTable.current();
    }
  };

  return (
    <React.Fragment>
      <Layout>
        {' '}
        <div className='row th-16 py-3 px-2'>
          <div className='col-md-8' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className={`${volume ? 'th-grey' : 'th-black-1'} th-16`}
                onClick={() => {
                  setVolume('');
                  closeTable.current();
                }}
              >
                Lesson Plan
              </Breadcrumb.Item>
              {volume && showTab == 2 && (
                <Breadcrumb.Item className='th-black-1 th-16'>{volume}</Breadcrumb.Item>
              )}
            </Breadcrumb>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className='card-container th-tabs'>
                <Tabs type='card' onChange={onChange}>
                  <TabPane tab='PERIOD VIEW' key='1'>
                    <PeriodView />
                  </TabPane>
                  <TabPane tab='ANNUAL PLAN' key='2'>
                    <AnnualPlan getVolume={getVolume} closeTable={closeTable} />
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
