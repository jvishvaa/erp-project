import React, { useState } from 'react';
import Layout from 'containers/Layout';
import Announcement from './components/Announcement';
import CalendarCard from '../myComponents/CalendarCard';
import PendingClasswork from './components/PendingClasswork';
import PendingHomework from './components/PendingHomework';
import Blogs from './components/Blogs';
import Discussions from './components/Discussions';
import Assessment from './components/Assessment';
import TodaysClass from './components/TodaysClass';
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
            Good {time < 12 ? 'Morning' : time < 16 ? 'Afternoon' : 'Evening'},
            <span className='text-capitalize pr-2'>{first_name}</span>
            <span className='th-14'>({getRole(user_level)})</span>
          </div>
        </div>

        <div className='row pt-3'>
          <div className='col-md-4 th-custom-col-padding'>
            <TodaysClass />
            {/* <Blogs /> */}
            {/* <Discussions /> */}
            <CalendarCard />
          </div>
          <div className='col-md-4 th-custom-col-padding'>
            <PendingClasswork />
            <Assessment />
          </div>
          <div className='col-md-4 th-custom-col-padding'>
            <PendingHomework />
            <Announcement scrollHeight={'330px'} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherdashboardNew;
