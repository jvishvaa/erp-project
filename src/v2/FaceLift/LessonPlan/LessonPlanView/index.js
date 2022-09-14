import React, { useState, useRef } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Tabs, Select } from 'antd';
import AnnualPlanTableView from '../TableView';
import FeeReminder from 'v2/FaceLift/FeeReminder/FeeReminder';
const { TabPane } = Tabs;

const LessonPlanView = () => {
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  let isStudent = window.location.pathname.includes('student-view');
  return (
    <React.Fragment>
      <Layout>
        {' '}
        <FeeReminder />
        <div className='row py-3 px-2'>
          <div className='col-md-10 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-grey th-18 th-pointer'
                href={
                  isStudent ? '/lesson-plan/student-view' : '/lesson-plan/teacher-view'
                }
              >
                Lesson Plan
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-18'>Annual Plan</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className='th-tabs th-bg-white'>
                <Tabs type='card'>
                  {/* <TabPane tab='PERIOD VIEW' key='1'>
                    <PeriodView />
                  </TabPane> */}
                  <TabPane tab='ANNUAL PLAN' key='1'>
                    <AnnualPlanTableView />
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

export default LessonPlanView;
