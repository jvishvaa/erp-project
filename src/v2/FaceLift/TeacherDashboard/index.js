import React, { useState } from 'react';
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

const TeacherdashboardNew = () => {
  const [todaysAttendance, setTodaysAttendance] = useState([]);
  const { first_name, user_level } = JSON.parse(localStorage.getItem('userDetails'));
  const time = new Date().getHours();

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
