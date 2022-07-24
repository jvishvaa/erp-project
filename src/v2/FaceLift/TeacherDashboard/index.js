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
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import endpoints from 'v2/config/endpoints';
import Shortcut from './components/Shortcut';

const TeacherdashboardNew = () => {
  const [todaysAttendance, setTodaysAttendance] = useState([]);
  const time = new Date().getHours();

  const fetchTodaysAttendance = (params = {}) => {
    axios
      .get(`${endpoints.teacherDashboard.todaysAttendance}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setTodaysAttendance(response?.data?.result?.attendence_status);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    fetchTodaysAttendance();
  }, []);

  return (
    <Layout>
      <div className=''>
        <div className='row th-16 py-3 justify-content-between'>
          <div className='col-md-6 th-black-1 th-20 th-fw-400'>
            {' '}
            Good {time < 12 ? 'Morning' : time < 16 ? 'AfterNoon' : 'Evening'}, Teacher
          </div>
          <div className='col-md-6 text-right'>
            <div className='pr-3'>
              <span
                className='th-16 th-fw-500 px-4 py-2 th-bg-white text-capitalize'
                style={{ borderRadius: '6px 0px 0px 6px' }}
              >
                {todaysAttendance ? (
                  <span className='th-green'>{todaysAttendance}</span>
                ) : (
                  <span className='th-red'>unmarked</span>
                )}
              </span>
            </div>
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
