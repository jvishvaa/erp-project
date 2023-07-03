import React, { useState, useEffect } from 'react';
import Announcement from './components/Announcement';
import CalendarCard from './components/Calendar';
import PendingHomework from './components/PendingHomework';
import Assessment from './components/Assessment';
import TodaysClass from './components/TodaysClass';
import { getRole } from 'v2/generalAnnouncementFunctions';
import Doodle from 'v2/FaceLift/Doodle/Doodle';
import { message, Button } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useHistory } from 'react-router-dom';
import { UsergroupAddOutlined } from '@ant-design/icons';
import StudentAttendance from './components/StudentAttendance';

const StudentDashboardConfigOff = () => {
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

  useEffect(() => {
    fetchDoodle();
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

  const studentrefer = () => {
    history.push('/studentrefer');
  };

  return (
    <div className=''>
      <div className='row th-16 py-3 justify-content-between'>
        <div className='col-md-6 th-black-1 th-20 th-fw-400'>
          Good {time < 12 ? 'Morning' : time < 16 ? 'Afternoon' : 'Evening'},
          <span className='text-capitalize pr-2'>{first_name}</span>
          <span className='th-14'>({getRole(user_level)})</span>
        </div>
        {checkOrigin ? (
          <>
            {user_level === 13 ? (
              <>
                <div className='col-md-3 text-right pr-0'>
                  <Button
                    className='th-br-4'
                    onClick={() => history.push('/activity-management-dashboard')}
                  >
                    Sports Dashboard
                  </Button>
                </div>
                <div
                  className='col-md-3 th-black-1 th-20 th-fw-400'
                  style={{ display: 'flex', flexDirection: 'row-reverse' }}
                >
                  <Button onClick={studentrefer}>
                    <UsergroupAddOutlined />
                    Orchids Ambassador Program
                  </Button>
                </div>
              </>
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
        <div className='col-md-4 th-custom-col-padding'>
          <TodaysClass />
          <CalendarCard />
        </div>
        <div className='col-md-4 th-custom-col-padding'>
          <StudentAttendance />
          <Assessment />
        </div>
        <div className='col-md-4 th-custom-col-padding'>
          <PendingHomework />
          <Announcement scrollHeight={'330px'} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardConfigOff;
