import React, { useState, useEffect, useRef } from 'react';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import endpoints from 'v2/config/endpoints';
import { message, Spin, Timeline, Tag, Avatar, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useSelector } from 'react-redux';
import NoClassIcon from 'v2/Assets/dashboardIcons/studentDashboardIcons/noclass.png';

const TodaysClass = ({ newTimeTable }) => {
  const myRef = useRef();
  let periodNumber = 0;
  const [todaysClassData, setTodaysClassData] = useState([]);
  const [todaysAttendance, setTodaysAttendance] = useState();
  const [loading, setLoading] = useState(false);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const fetchTodaysClassData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.studentDashboard.todaysTimeTable}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setTodaysAttendance(response?.data?.result?.todays_attendance);
          setTodaysClassData(response?.data?.result?.classes);
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };
  const getPeriodStatus = (period) => {
    const format = 'HH:mm:ss';
    const time = moment(moment(), format);
    const start_time = moment(period?.start_time, format);
    const end_time = moment(period?.end_time, format);
    if (time.isSameOrAfter(end_time)) {
      return 'completed';
    } else if (time.isBetween(start_time, end_time)) {
      return 'ongoing';
    } else {
      return 'upcoming';
    }
  };
  const executeScroll = () => {
    myRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
      alignToTop: 'true',
    });
  };

  useEffect(() => {
    if (!newTimeTable) {
      fetchTodaysClassData({
        date: moment().format('YYYY-MM-DD'),
        session_id: selectedAcademicYear?.id,
      });
    }
  }, []);
  useEffect(() => {
    if (myRef.current) executeScroll();
  }, [myRef.current]);

  return (
    <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm' style={{ height: 365 }}>
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>
          <div className='d-flex align-items-center'>
            <div>Today's Class </div>
          </div>
          <div className='row align-items-center justify-content-between py-2'>
            <div>
              <span className='th-black-1 th-14 th-fw-600'>
                {moment().format('dddd')}
              </span>
              <span className='th-12 th-grey ml-2'>
                {moment().format('Do MMM  YYYY')}
              </span>
            </div>
            {!loading && todaysAttendance && todaysAttendance !== 'N/A' ? (
              <div className='d-flex align-item-center align-items-center th-12 ml-2 '>
                <span className='mr-2'>Today's Attendance :</span>
                <div
                  className='th-fw-600 th-br-8 text-capitalize th-white px-2 py-1'
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
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className='py-3 mt-2 th-timeline'
        style={{ height: 265, overflowY: 'auto', overflowX: 'hidden' }}
      >
        {newTimeTable ? (
          <div className='d-flex w-100 justify-content-center align-items-center pt-5'>
            <span className='th-grey th-30'>Timetable coming soon !</span>
          </div>
        ) : loading ? (
          <div className='th-width-100 d-flex align-items-center justify-content-center'>
            <Spin tip='Loading...'></Spin>
          </div>
        ) : todaysClassData?.length > 0 ? (
          <>
            <Timeline mode='left' style={{ width: '100%' }}>
              {todaysClassData?.map((item, index) => {
                if (item.type !== 'Break') {
                  periodNumber += 1;
                }
                return (
                  <Timeline.Item
                    label={
                      <div
                        className={`${
                          getPeriodStatus(item) == 'ongoing' ? 'th-primary' : 'th-grey'
                        } th-fw-500 mt-2 mt-md-0`}
                        style={{ fontSize: window.innerWidth < 768 ? '8px' : '12px' }}
                      >
                        {moment(item?.start_time, 'hh:mm A').format('hh:mm A')} <br /> to
                        <br />
                        {moment(item?.end_time, 'hh:mm A').format('hh:mm A')}{' '}
                      </div>
                    }
                    color={
                      item?.type == 'Break'
                        ? 'blue'
                        : getPeriodStatus(item) == 'completed'
                        ? 'red'
                        : getPeriodStatus(item) == 'upcoming'
                        ? 'yellow'
                        : 'green'
                    }
                  >
                    <div
                      className={`${
                        getPeriodStatus(item) == 'ongoing'
                          ? 'th-bg-blue-1 shadow-sm'
                          : 'th-bg-grey'
                      } row th-br-8 `}
                      style={{ fontSize: window.innerWidth < 768 ? '12px' : '14px' }}
                      ref={getPeriodStatus(item) == 'ongoing' ? myRef : null}
                    >
                      {item?.type == 'Break' ? (
                        <div className='row th-16 text-center'>
                          <div className=' col-8 my-4 my-md-3 th-fw-600 text-uppercase'>
                            <div className='pl-4'>{item?.type}</div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className='p-md-2 col-md-2 col-3 p-0 d-flex align-items-center'>
                            <div
                              className='d-flex align-items-center pl-2 h-100'
                              style={{
                                borderLeft:
                                  getPeriodStatus(item) == 'ongoing'
                                    ? '3px solid #1b4ccb '
                                    : null,
                              }}
                            >
                              Period {periodNumber}
                            </div>
                          </div>
                          <div className={`col-9 col-md-10 px-0 pr-1 th-br-8`}>
                            <div className='row'>
                              <div className='d-none d-sm-block px-0 px-md-2 col-md-2 py-1'>
                                <span className='th-grey'>Subject</span>
                              </div>
                              <div className='col-7 col-sm-8 px-1 px-md-2 py-1'>
                                <div className='th-black-1 th-fw-600 text-truncate'>
                                  <Tooltip title={item?.subject_name}>
                                    {item?.subject_name}
                                  </Tooltip>
                                </div>
                              </div>
                              <div
                                className={`col-5 col-sm-4 col-md-2 px-0 text-md-right`}
                              >
                                <Tag
                                  color={
                                    getPeriodStatus(item) == 'ongoing'
                                      ? 'blue'
                                      : getPeriodStatus(item) == 'completed'
                                      ? 'success'
                                      : 'warning'
                                  }
                                >
                                  <span className='text-capitalize'>
                                    {getPeriodStatus(item)}
                                  </span>
                                </Tag>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-12'>
                                <hr className='my-1' />
                              </div>
                            </div>
                            <div className='row'>
                              <div className='d-none d-sm-block px-0 col-md-2 px-md-2 py-1'>
                                <span className='th-grey'>Type</span>
                              </div>
                              <div className='col-5 col-md-3 px-1 px-md-2 py-1 text-truncate'>
                                <span className='th-black-1 th-fw-600'>{item?.type}</span>
                              </div>
                              <div className='col-7 pb-1 px-0 px-md-2 d-flex justify-content-end align-items-center'>
                                <div className='mr-2'>
                                  {window.location.href.includes('localhost') ||
                                  window.location.href.includes('ui-revamp1') ||
                                  window.location.href.includes('qa') ? (
                                    <>
                                      <Avatar
                                        // size={40}
                                        src={`${endpoints.announcementList.s3erp}dev/media/${item?.profile}`}
                                        icon={<UserOutlined />}
                                      />
                                    </>
                                  ) : (
                                    <Avatar
                                      // size={40}
                                      src={`${endpoints.announcementList.s3erp}prod/media/${item?.profile}`}
                                      icon={<UserOutlined />}
                                    />
                                  )}
                                </div>
                                <div className='text-truncate'>
                                  <Tooltip
                                    title={item?.teacher_name}
                                    placement='bottomRight'
                                  >
                                    {item?.teacher_name}
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </>
        ) : (
          <div className='d-flex w-100 justify-content-center align-items-center pt-5'>
            <img src={NoClassIcon} style={{ height: '100px', objectFit: 'cover' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysClass;
