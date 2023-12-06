import React, { useState } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Tabs, Select } from 'antd';
import SetTimeTable from './SetTimeTable';
import WeeklyTimeTable from './WeeklyTimeTable';
import CreateTimeTable from './CreateTimeTable';
const { TabPane } = Tabs;
const { Option } = Select;

const PrincipalTimeTable = () => {
  const [showTab, setShowTab] = useState('1');
  const onChange = (key) => {
    setShowTab(key.toString());
  };
  return (
    <>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-4 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>TimeTable</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className='col-12'>
            <div className='th-tabs th-bg-white'>
              <Tabs type='card' onChange={onChange} activeKey={showTab}>
                <TabPane tab={<div>SET TIMESLOT</div>} key='1'>
                  <SetTimeTable showTab={showTab} />
                </TabPane>
                <TabPane tab={<div>WEEKLY TIMETABLE</div>} key='2'>
                  <WeeklyTimeTable showTab={showTab} />
                </TabPane>
                <TabPane tab={<div>CREATE TIMETABLE</div>} key='3'>
                  <CreateTimeTable showTab={showTab} />
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
