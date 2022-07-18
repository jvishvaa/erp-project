import React, { useState, useEffect } from 'react';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import endpoints from 'v2/config/endpoints';
import { message } from 'antd';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const TodaysClass = () => {
  const history = useHistory();
  const { role_details } = JSON.parse(localStorage.getItem('userDetails')) || '';
  const [todaysClassData, setTodaysClassData] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Ebook' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Ebook View') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);
  const upcomingClasses = () => {
    let count = 0;
    {
      todaysClassData.length > 0 &&
        todaysClassData.map((item) => {
          if (moment(item?.online_class?.start_time).isAfter(moment())) {
            count++;
          }
        });
    }
    return count;
  };

  const upcomingClassesCount = upcomingClasses();
  const fetchTodaysClassData = (params = {}) => {
    axios
      .get(`${endpoints.studentDashboard.todaysClasses}`, {
        params: { ...params },
        headers: {
          'X-DTS-SCHEMA': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setTodaysClassData(response?.data?.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    fetchTodaysClassData({
      user_id: role_details.erp_user_id,
      page_number: 1,
      page_size: 20,
      class_type: 0,
      class_status: 2,
      module_id: moduleId,
    });
  }, []);

  return (
    <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm' style={{ minHeight: 240 }}>
      <div className='row justify-content-between'>
        <div className='col-6 th-16 mt-2 th-fw-400 th-black-1'>Today's Class</div>
        <div className='col-6 mt-2 px-1 text-right'>
          {upcomingClassesCount > 0 ? (
            <span className='th-green th-bg-grey th-br-4 p-1 th-12'>
              {upcomingClassesCount} Upcoming Classes
            </span>
          ) : null}
        </div>
      </div>
      <div className=''>
        <div className='th-custom-col-padding'>
          {todaysClassData?.length > 1 ? (
            <div
              className='mt-2'
              style={{ overflowY: 'auto', overflowX: 'hidden', height: 130 }}
            >
              {todaysClassData?.map((item, i) => {
                const start_time = moment(item?.online_class?.start_time).format(
                  'hh:mm A'
                );
                const end_time = moment(item?.online_class?.end_time).format('hh:mm A');
                return (
                  <div
                    className='th-bg-grey mb-2 th-br-6 th-pointer'
                    onClick={() => history.push('./erp-online-class-student-view')}
                  >
                    <div className='row justify-content-between py-3 th-br-6 align-items-center'>
                      <div className='col-7 th-black-2 th-14 th-fw-400 text-left'>
                        <span>
                          {start_time} - {end_time}
                        </span>
                      </div>
                      <div className='col-5 th-primary th-14 th-fw-400 text-right text-truncate'>
                        {item?.online_class?.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='d-flex justify-content-center mt-5'>
              <img src={NoDataIcon} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodaysClass;
