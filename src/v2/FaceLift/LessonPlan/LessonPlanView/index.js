import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Tabs, Select } from 'antd';
import AnnualPlanTableView from './AnnualPlanTableView';
import PeriodListView from './PeriodListView';
import FeeReminder from 'v2/FaceLift/FeeReminder/FeeReminder';
import { useHistory } from 'react-router-dom';
const { TabPane } = Tabs;

const LessonPlanView = (props) => {
  const history = useHistory();
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [showTab, setShowTab] = useState();
  console.log('showTab', showTab, history.location.state);
  const [volumeId, setVolumeId] = useState(history?.location?.state?.volumeID);
  const [volumeName, setVolumeName] = useState(history?.location?.state?.volumeName);
  let isStudent = window.location.pathname.includes('student-view');
  const onChange = (key) => {
    if (key === '2') {
      setShowTab(key);
      history.push({
        pathname: isStudent
          ? '/lesson-plan/student-view/annual-plan/list-view'
          : '/lesson-plan/teacher-view/annual-plan/list-view',
        state: {
          gradeID: history.location.state.gradeID,
          gradeName: history.location.state.gradeName,
          subjectID: history.location.state.subjectID,
          subjectName: history.location.state.subjectName,
          boardID: history.location.state.boardID,
          volumeName: history.location.state.volumeName,
          volumeID: history.location.state.volumeID,
          centralAcademicYearID: history.location.state.centralAcademicYearID,
          showTab: '2',
        },
      });
    } else {
      setShowTab(key);
      history.push({
        pathname: isStudent
          ? '/lesson-plan/student-view/period-view'
          : '/lesson-plan/teacher-view/period-view',
      });
    }
  };
  useEffect(() => {
    if (window.location.pathname.includes('period-view')) {
      setShowTab('1');
    } else {
      setShowTab('2');
    }
  }, [window.location.pathname]);
  return (
    <React.Fragment>
      <Layout>
        {' '}
        <FeeReminder />
        <div className='row py-3 px-2'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-grey th-18 th-pointer'
                onClick={() => {
                  history.push({
                    pathname: isStudent
                      ? window.location.pathname.includes('period-view')
                        ? '/lesson-plan/student-view/period-view'
                        : '/lesson-plan/student-view/annual-plan'
                      : window.location.pathname.includes('period-view')
                      ? '/lesson-plan/teacher-view/period-view'
                      : '/lesson-plan/teacher-view/annual-plan',
                  });
                }}
              >
                Lesson Plan
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-18'>
                {showTab == '1' ? 'Period View' : 'Annual Plan'}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className='th-tabs th-bg-white'>
                <Tabs type='card' onChange={onChange} activeKey={showTab}>
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
