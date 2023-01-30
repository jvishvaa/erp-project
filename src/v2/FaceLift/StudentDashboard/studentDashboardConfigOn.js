import React, { useState, useEffect } from 'react';
import Announcement from './components/Announcement';
import CalendarCard from '../myComponents/CalendarCard';
import Assessment from './components/AssessmentNew';
import HomeworkReport from './components/HomeworkReport';
import DiaryStats from './components/DiaryStats';
import TodaysClass from './components/TodaysClassNew';
import { getRole } from 'v2/generalAnnouncementFunctions';
import Doodle from 'v2/FaceLift/Doodle/Doodle';
import { message, Button } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useHistory } from 'react-router-dom';
import { UsergroupAddOutlined } from '@ant-design/icons';
import StudentAttendanceNew from './components/StudentAttendanceNew';

const StudentDashboardConfigOn = () => {
  const [showDoodle, setShowDoodle] = useState(false);
  const { first_name, user_level } = JSON.parse(localStorage.getItem('userDetails'));
  const time = new Date().getHours();
  const history = useHistory();
  const [checkOrigin, setCheckOrigin] = useState(false);

  useEffect(() => {
    const origin = window.location.origin;
    if (
      origin.indexOf('orchids.') > -1 ||
      origin.indexOf('dev.') > -1 ||
      origin.indexOf('qa.') > -1 ||
      origin.indexOf('localhost') > -1 ||
      origin.indexOf('ui-revamp1.') > -1
    ) {
      setCheckOrigin(true);
    }
  }, []);

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

  const studentrefer = () => {
    history.push('/studentrefer');
  };

  return (
    <div className=''>
      <div className='row th-16 justify-content-between'>
        <div className='col-md-6 th-black-1 th-20 th-fw-400'>
          Good {time < 12 ? 'Morning' : time < 16 ? 'Afternoon' : 'Evening'},
          <span className='text-capitalize pr-2'>{first_name}</span>
          <span className='th-14'>({getRole(user_level)})</span>
        </div>
        {checkOrigin ? (
          <>
            {user_level === 13 ? (
              <div
                className='col-md-6 th-black-1 th-20 th-fw-400'
                style={{ display: 'flex', flexDirection: 'row-reverse' }}
              >
                <Button onClick={studentrefer}>
                  <UsergroupAddOutlined />
                  Orchids Ambassador Program
                </Button>
              </div>
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}
      </div>
      {showDoodle && <Doodle />}
      <div className='row pt-3'>
        <div className='col-md-8 th-custom-col-padding'>
          <div className='row'>
            <div className='col-12 px-0'>
              <TodaysClass />
            </div>

            <div className='col-md-6 px-0 '>
              <Assessment />
            </div>
            <div className='col-md-6 mt-3 pr-0'>
              <HomeworkReport />
              <div className='mt-3'>
                <StudentAttendanceNew />
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-4 th-custom-col-padding'>
          <DiaryStats />
          <CalendarCard />
          <Announcement scrollHeight={'585px'} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardConfigOn;
