import React, { useState, useEffect } from 'react';
import Announcement from './components/Announcement';
import TodaysClass from './components/TodaysClass';
import CalendarCard from '../myComponents/CalendarCard';
import HomeWorkReport from './components/HomeworkReportNew';
import AttendanceReportNew from './components/AttendanceReportNew';
import { getRole } from 'v2/generalAnnouncementFunctions';
import Doodle from 'v2/FaceLift/Doodle/Doodle';
import { Button, message } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import CurriculumTracker from './components/CurriculumCompletionNew';
import TeacherDiaryStats from './components/TeacherDiaryStats';
import Activity from './components/Activity';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const TeacherdashboardNew = ({ newTimeTable }) => {
  const [showDoodle, setShowDoodle] = useState(false);
  const history = useHistory();
  const { first_name, user_level } = JSON.parse(localStorage.getItem('userDetails'));
  const time = new Date().getHours();
  const fetchDoodle = () => {
    axios
      .get(`${endpoints.doodle.checkDoodle}?config_key=doodle_availability`)
      .then((response) => {
        if (response?.data?.result[0] === 'True') {
          setShowDoodle(true);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const studentrefer = () => {
    history.push('/teacher-refer');
  };

  useEffect(() => {
    fetchDoodle();
  }, []);

  const teacherrefer = () => {
    history.push('/teacher-refer');
  };
  return (
    <div className=''>
      <div className='row th-16 py-3 justify-content-between'>
        <div className='col-lg-6 th-black-1 th-20 th-fw-400'>
          {' '}
          Good {time < 12 ? 'Morning' : time < 16 ? 'Afternoon' : 'Evening'},
          <span className='text-capitalize pr-2'>{first_name}</span>
          <span className='th-14'>({getRole(user_level)})</span>
        </div>
        <>
          {user_level === 11 ? (
            <div className='col-md-6 text-right'>
              {/* <Button
                className='th-br-4 mr-2'
                onClick={() => history.push('/activity-management-dashboard')}
              >
                Sports Dashboard
              </Button> */}
              <Button className='th-br-4' onClick={teacherrefer}>
                <UsergroupAddOutlined />
                Teacher's Referral Programme
              </Button>
            </div>
          ) : (
            ''
          )}
        </>
      </div>
      {/* {showDoodle && <Doodle />} */}
      <div className='row pt-1 pb-3'>
        <div className='col-lg-8 th-custom-col-padding'>
          <div className='row'>
            <div className='col-12 px-0'>
              <TodaysClass newTimeTable={newTimeTable} />
            </div>

            <div className='col-lg-6 px-0 '>
              <AttendanceReportNew />
              <div className='mt-3'>
                <CurriculumTracker />
              </div>
            </div>
            <div className='col-lg-6 mt-3 px-0 pl-lg-3'>
              <HomeWorkReport />
              <div className='mt-3'>
                <Activity />
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-4 th-custom-col-padding'>
          <TeacherDiaryStats newTimeTable={newTimeTable} />
          <CalendarCard />
          <Announcement scrollHeight={'640px'} />
        </div>
      </div>
    </div>
  );
};

export default TeacherdashboardNew;
