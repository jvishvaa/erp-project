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
import IdayDoodle from 'v2/Assets/images/iDay2.jpg';
import { Popover, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';

const StudentDashboardNew = () => {
  const [showDoodle, setShowDoodle] = useState(false);
  const { first_name, user_level } = JSON.parse(localStorage.getItem('userDetails'));
  const time = new Date().getHours();
  let title = 'Happy 76th Independence Day';
  let description =
    "This 15th August marks the 75 years of Independence in India. The Government of India decided to celebrate the 75 years of Independence of India, with great excitement and tribute to freedom fighters. So, they decided to do various programs and the government named the celebration as 'Azadi Ka Amrit Mahotsav'. Amrit Mahotsav meaning Nectar of grand celebration which signifies the 75 years of India's independence from British Raj.The government of India also started a campaign 'Har Ghar Tiranga' where it will provide the National flag to every household. While the government had promised to supply the flag made of polyester to every homes it has not reached the supply.";

  const doodleInfo = () => {
    return (
      <div className='row p-2 flex-column'>
        <div className='th-20 th-fw-600 th-black-1'>{title}</div>
        <div
          className='th-14 th-fw-400 th-black-2 py-3'
          style={{ height: 200, width: '75vw', overflowY: 'auto' }}
        >
          {description}
        </div>
      </div>
    );
  };

  const fetchDoodle = () => {
    axios
      .get(`${endpoints.doodle.checkDoodle}`)
      .then((response) => {
        if (response?.data[0]?.config_value[0] == 1) {
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
        {showDoodle && (
          <div className='row px-3 '>
            <div className='col-md-4 th-bg-grey shadow-sm d-none d-md-block'>
              <div className='row pt-3 th-primary th-18 th-fw-600'>{title}</div>
              <div
                className='row py-3 th-black-2 pr-2 mt-1 text-wrap text-justify'
                style={{ height: '220px', overflowY: 'scroll' }}
              >
                {description}
              </div>
            </div>
            <div className='col-md-8 shadow-sm px-0 '>
              <Popover
                placement='bottomLeft'
                content={doodleInfo}
                trigger='click'
                className='d-md-none'
              >
                <div
                  className='th-bg-grey th-br-6 p-2 th-pointer'
                  style={{ border: '1px solid #d9d9d9', position: 'absolute', top: '5%' }}
                >
                  <InfoCircleOutlined height={20} />
                </div>
              </Popover>
              <img
                src={IdayDoodle}
                className='th-br-6'
                style={{ height: '300px', width: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        )}
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
