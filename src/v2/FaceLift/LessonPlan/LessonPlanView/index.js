import React, { useState, useRef } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Tabs, Select } from 'antd';
import AnnualPlanTableView from '../TableView';
const { TabPane } = Tabs;

const LessonPlanView = () => {
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  return (
    <React.Fragment>
      <Layout>
        {' '}
        <div className='row py-3 px-2'>
          <div className='col-md-8' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-grey th-18 th-pointer'
                href={
                  user_level == 13
                    ? '/lesson-plan/student-view'
                    : '/lesson-plan/teacher-view'
                }
              >
                Lesson Plan
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-18'>Annual Plan</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className='th-tabs'>
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
