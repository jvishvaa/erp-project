import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import { IsOrchidsChecker } from 'v2/isOrchidsChecker';
import Endpoint from 'config/endpoints';

const StudentDashboardConfigOn = () => {
  const isOrchids = IsOrchidsChecker();
  const [showDoodle, setShowDoodle] = useState(false);
  const { first_name, user_level } = JSON.parse(localStorage.getItem('userDetails'));
  const time = new Date().getHours();
  const history = useHistory();
  const [doodleData, setDoodleData] = useState([]);
  const [isReferal, setIsReferal] = useState(false);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};

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
  const fetchDoodleData = () => {
    axios
      .get(`${endpoints.doodle.fetchDoodle}`)
      .then((response) => {
        if (response.data.status_code === 200) {
          setDoodleData(response?.data?.data);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const studentConditionReferal = () => {
    const erpCode = userDetails?.erp;
    axios
      .get(`${Endpoint.referral.studentConditionReferal}?erp_id=${erpCode}`)
      .then((response) => {
        if (response.status === 200) {
          // console.log(response.data.result.is_referral, 'response');
          setIsReferal(response.data.result.is_referral);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  useEffect(() => {
    fetchDoodle();
    fetchDoodleData();
    studentConditionReferal();
  }, []);

  const studentrefer = () => {
    history.push('/studentrefer');
  };

  return (
    <div className=''>
      <div className='row th-16 justify-content-between py-2'>
        <div className='col-md-6 th-black-1 th-20 th-fw-400'>
          Good {time < 12 ? 'Morning' : time < 16 ? 'Afternoon' : 'Evening'},
          <span className='text-capitalize pr-2'>{first_name}</span>
          <span className='th-14'>({getRole(user_level)})</span>
        </div>
        {isOrchids && isReferal ? (
          <>
            {user_level === 13 ? (
              <div className='col-md-6 text-right'>
                <Button
                  className='th-br-4 mr-2'
                  onClick={() => history.push('/activity-management-dashboard')}
                >
                  Sports Dashboard
                </Button>
                <Button onClick={studentrefer} className='th-br-4'>
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
      {showDoodle &&
        user_level === 13 &&
        (doodleData?.enable_branches || []).some(
          (branchId) => branchId === selectedBranch?.id
        ) && <Doodle />}
      <div className='row pt-3'>
        <div className='col-lg-8 th-custom-col-padding'>
          <div className='row'>
            <div className='col-12 px-0'>
              <TodaysClass />
            </div>

            <div className='col-md-6 px-0 '>
              <Assessment />
            </div>
            <div className='col-md-6 mt-3 px-0 pl-sm-3'>
              <HomeworkReport />
              <div className='mt-3'>
                <StudentAttendanceNew />
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-4 th-custom-col-padding'>
          <DiaryStats />
          <CalendarCard />
          <Announcement scrollHeight={'585px'} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardConfigOn;
