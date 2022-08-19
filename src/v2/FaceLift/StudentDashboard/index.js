import React, { useState, useEffect } from 'react';
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
import Doodle from 'v2/FaceLift/Doodle/Doodle';
import { Popover, message } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';

const StudentDashboardNew = () => {
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
            Good {time < 12 ? 'Morning' : time < 16 ? 'Afternoon' : 'Evening'},
            <span className='text-capitalize pr-2'>{first_name}</span>
            <span className='th-14'>({getRole(user_level)})</span>
          </div>
        </div>
        {showDoodle && <Doodle />}
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

export default StudentDashboardNew;
