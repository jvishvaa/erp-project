import React, { useState, useEffect } from 'react';
import { Spin, Tag, Tooltip } from 'antd';
import { DownOutlined, ReloadOutlined, RightOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import axios from 'v2/config/axios';
import { useSelector } from 'react-redux';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/noAttendanceIcon.svg';
import moment from 'moment';

const AttendanceReportNew = () => {
  const history = useHistory();
  const [todaysAttendance, setTodaysAttendance] = useState();
  const [classwiseAttendanceData, setClasswiseAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const fetchClasswiseAttendanceData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.teacherDashboard.studentsAttendance}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.data.status_code === 200) {
          setTodaysAttendance(response?.data?.result?.todays_attendance);
          setClasswiseAttendanceData(response?.data?.result?.attendance);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedAcademicYear) {
      fetchClasswiseAttendanceData({
        acadsession_id: selectedBranch?.id,
      });
    }
  }, [selectedAcademicYear]);

  return (
    <div className='col-12 px-0 mt-3'>
      <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
        <div className='row justify-content-between'>
          <div className='col-12 pr-0 pr-md-0 th-16 mt-2 th-fw-500 th-black-1'>
            Attendance Overview
          </div>
        </div>
        <div className='row justify-content-between align-items-center mt-3'>
          <div className='col-12 th-black-1'>
            <div className='d-flex justify-content-between py-2 px-2 align-items-center th-bg-grey th-br-8'>
              <div className='th-fw-400 th-12'>Your Today's Attendance</div>
              {!loading && todaysAttendance && (
                <div
                  className='th-fw-400 th-br-5 th-bg-green th-white px-2 py-1 th-12 text-capitalize'
                  style={{
                    backgroundColor:
                      todaysAttendance === 'Holiday'
                        ? '#7cb5ec'
                        : todaysAttendance === 'present'
                        ? '#09a23a'
                        : todaysAttendance === 'absent'
                        ? '#f8222f'
                        : '#c6c6c6',
                  }}
                >
                  {todaysAttendance}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='row mt-2'>
          <div className='col-12 th-12 th-black-2 th-fw-400 pl-4'>
            Today's Attendance of your Classes
          </div>
        </div>
        <div className='col-md-12 pt-2'>
          {loading ? (
            <div
              className='d-flex justify-content-center align-items-center '
              style={{ height: '250px' }}
            >
              <Spin tip='Loading...'></Spin>
            </div>
          ) : classwiseAttendanceData?.length > 0 ? (
            <div
              className=' th-bg-grey th-br-5 th-custom-scrollbar'
              style={{ height: 250, overflowY: 'auto', overflowX: 'hidden' }}
            >
              <div className='row pb-2'>
                {classwiseAttendanceData.map((item, i) => (
                  <div
                    className='col-12 my-2 px-2 py-1'
                    onClick={() =>
                      history.push({
                        pathname: '/sectionwise-attendance',
                        state: {
                          gradeName: item?.grade_name,
                          gradeID: item?.grade_id,
                          sectionName: item?.section_name,
                          sectionID: item?.section_id,
                          date: moment().format('YYYY-MM-DD'),
                        },
                      })
                    }
                  >
                    <div
                      className='row th-bg-white align-items-center py-2 th-br-8 th-pointer'
                      style={{ outline: '1px solid #CAE2FF' }}
                    >
                      <div className='col-7 px-2 text-left text-truncate text-capitalize'>
                        <span
                          className='th-fw-600 th-black-2'
                          title={item?.grade_name + ' ' + item?.section_name?.slice(-1)}
                        >
                          {item?.grade_name + ' ' + item?.section_name?.slice(-1)} (
                          {item?.total_count < 9
                            ? '0' + item?.total_count
                            : item?.total_count}
                          )
                        </span>
                      </div>
                      <div className='col-2 px-1 text-center'>
                        <div className='th-fw-600'>
                          <span
                            className='pb-1 th-green-1'
                            style={{ borderBottom: '3px solid #35C979' }}
                          >
                            {item?.present_count < 9
                              ? '0' + item?.present_count
                              : item?.present_count}
                          </span>
                        </div>
                      </div>
                      <div className='col-2 px-1 text-center'>
                        <div className='th-fw-600'>
                          <span
                            className='pb-1 th-red'
                            style={{ borderBottom: '3px solid #FF4747' }}
                          >
                            {item?.total_count - item?.present_count < 9
                              ? `0${item?.total_count - item?.present_count}`
                              : item?.total_count - item?.present_count}
                          </span>
                        </div>
                      </div>
                      <div className='col-1 pl-0 '>
                        <RightOutlined className='th-12 th-black-2' />
                      </div>
                    </div>
                    {/* <NumberCard data={item} isAttendance={true} /> */}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className='d-flex align-items-center justify-content-center mt-2'
              style={{ height: 240 }}
            >
              <img src={NoDataIcon} />
            </div>
          )}
        </div>
        <div className='col-12 mt-2'>
          <div className='d-flex justify-content-between'>
            <div
              className={`${
                classwiseAttendanceData?.length > 0
                  ? 'd-flex justify-content-around w-50'
                  : 'invisible'
              }`}
            >
              <div className='d-flex align-items-center'>
                <div style={{ height: 10, width: 10, backgroundColor: '#35C979' }}>
                  &nbsp;
                </div>
                <span className='ml-3' style={{ color: '#35C979' }}>
                  Present
                </span>
              </div>
              <div className='d-flex align-items-center ml-2'>
                <div style={{ height: 10, width: 10, backgroundColor: '#FF4747' }}>
                  &nbsp;{' '}
                </div>
                <span className='ml-3' style={{ color: '#FF4747' }}>
                  Absent
                </span>
              </div>
            </div>
            <div className='pr-1'>
              <div
                onClick={() => history.push('./gradewise-attendance')}
                className='th-black-1 th-bg-grey p-2 th-br-8 badge th-pointer'
                style={{ outline: '1px solid #d9d9d9' }}
              >
                View All
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportNew;
