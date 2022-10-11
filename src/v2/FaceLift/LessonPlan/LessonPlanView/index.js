import React, { useState, useRef } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Tabs, Select } from 'antd';
import AnnualPlanTableView from './AnnualPlanTableView';
import PeriodListView from './PeriodListView';
import FeeReminder from 'v2/FaceLift/FeeReminder/FeeReminder';
import { useHistory } from 'react-router-dom';
const { TabPane } = Tabs;

const LessonPlanView = () => {
  const history = useHistory();
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [showTab, setShowTab] = useState(history?.location?.state?.showTab);
  const [volumeId, setVolumeId] = useState(history?.location?.state?.volumeID);
  const [volumeName, setVolumeName] = useState(history?.location?.state?.volumeName);
  const onChange = (key) => {
    if (key === '2') {
      setShowTab(key);
    } else {
      history.push({
        pathname: window.location.pathname.includes('teacher-view')
          ? '/lesson-plan/teacher-view'
          : '/lesson-plan/student-view',
      });
    }
  };
  let isStudent = window.location.pathname.includes('student-view');
  return (
    <React.Fragment>
      <Layout>
        {' '}
        <FeeReminder />
        <div className='row py-3 px-2'>
          <div className='col-md-8 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-grey th-18 th-pointer'
                onClick={() => {
                  history.push({
                    pathname: isStudent
                      ? '/lesson-plan/student-view'
                      : '/lesson-plan/teacher-view',
                    state: {
                      showTab,
                      volumeID: volumeId,
                      volumeName,
                    },
                  });
                }}
              >
                Lesson Plan
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-18'>
                {showTab == 1 ? 'Period View' : 'Annual Plan'}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className='th-tabs th-bg-white'>
                <Tabs type='card' onChange={onChange} defaultActiveKey={showTab}>
                  <TabPane tab='PERIOD VIEW' key='1'>
                    <PeriodListView />
                  </TabPane>
                  <TabPane tab='ANNUAL PLAN' key='2'>
                    <AnnualPlanTableView showTab={showTab} />
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
