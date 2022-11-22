import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import AttendanceReport from './components/AttendanceReport';
import Announcement from './components/Announcement';
import CalendarCard from '../myComponents/CalendarCard';
import ClassWorkReport from './components/ClassworkReport';
import HomeWorkReport from './components/HomeworkReport';
import Blogs from './components/Blogs';
import Discussions from './components/Discussions';
import Assessment from './components/Assessment';
import CurriculumCompletion from './components/CurriculumCompletion';
import Shortcut from './components/Shortcut';
import { getRole } from 'v2/generalAnnouncementFunctions';
import Doodle from 'v2/FaceLift/Doodle/Doodle';
import { message } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import DiaryReport from '../myComponents/DiaryReport';

const TeacherdashboardNew = () => {
  const [todaysAttendance, setTodaysAttendance] = useState([]);
  const [showDoodle, setShowDoodle] = useState(false);
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

  useEffect(() => {
    fetchDoodle();
  }, []);
  return (
    <Layout>
      <div className=''>
        <div className='row th-16 py-3 justify-content-between'>
          <div className='col-md-6 th-black-1 th-20 th-fw-400'>
            {' '}
            Good {time < 12 ? 'Morning' : time < 16 ? 'Afternoon' : 'Evening'},
            <span className='text-capitalize pr-2'>{first_name}</span>
            <span className='th-14'>({getRole(user_level)})</span>
          </div>
        </div>
        {showDoodle && <Doodle />}
        <AttendanceReport />

        <div className='row pt-3'>
          <div className='col-md-4 th-custom-col-padding'>
            <ClassWorkReport />
            <CalendarCard />
            {/* <Blogs /> */}
            {/* <Discussions /> */}
          </div>
          <div className='col-md-4 th-custom-col-padding'>
            <HomeWorkReport />
            <CurriculumCompletion />
            <Shortcut />
            {/* <DiaryReport /> */}
          </div>
          <div className='col-md-4 th-custom-col-padding'>
            <Assessment />
            <Announcement scrollHeight={'420px'} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherdashboardNew;
