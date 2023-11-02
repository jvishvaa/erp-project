import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Tabs, Select } from 'antd';
import SetTimeTable from './SetTimeTable';
import WeeklyTimeTable from './WeeklyTimeTable';
import CreateTimeTable from './CreateTimeTable';
const { TabPane } = Tabs;
const { Option } = Select;

const PrincipalTimeTable = () => {
  const [showTab, setShowTab] = useState('2');
  const onChange = (key) => {
    setShowTab(key.toString());
  };
  return (
    <>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>TimeTable</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row px-3'>
          <div className='col-12 th-bg-white'>
            <div className='th-bg-white th-tabs'>
              <Tabs type='card' onChange={onChange} activeKey={showTab}>
                <TabPane tab={<div>SET TIMETABLE</div>} key='1'>
                  <SetTimeTable />
                </TabPane>
                <TabPane tab={<div>WEEKLY TIMETABLE</div>} key='2'>
                  <WeeklyTimeTable />
                </TabPane>
                <TabPane tab={<div>CREATE TIMETABLE</div>} key='3'>
                  <CreateTimeTable />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default PrincipalTimeTable;
