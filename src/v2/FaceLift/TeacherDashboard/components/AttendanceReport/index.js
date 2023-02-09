import React, { useState, useEffect } from 'react';
import NumberCard from 'v2/FaceLift/myComponents/NumberCard';
import { Select, Spin, Tag } from 'antd';
import { DownOutlined, ReloadOutlined, RightOutlined } from '@ant-design/icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useHistory } from 'react-router-dom';
import axios from 'v2/config/axios';
import { useSelector } from 'react-redux';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import moment from 'moment';

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 2,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1.2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2.2,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1.2,
        slidesToScroll: 1,
      },
    },
  ],
};

const { Option } = Select;

const AttendanceReport = () => {
  const history = useHistory();
  const [attendanceFilter, setAttendanceFilter] = useState('month');
  const [counter, setCounter] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (value) => {
    setAttendanceFilter(value);
  };
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [classwiseAttendanceData, setClasswiseAttendanceData] = useState();

  const fetchClasswiseAttendanceData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.teacherDashboard.classwiseAttendance}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.data.status_code === 200) {
          setClasswiseAttendanceData(response?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getAttendanceData = () => {
    if (selectedAcademicYear) {
      fetchClasswiseAttendanceData({
        session_year: selectedAcademicYear?.id,
        date_range: attendanceFilter,
      });
    }
  };

  useEffect(() => {
    getAttendanceData();
  }, [attendanceFilter]);

  return (
    <div className='col-lg-4 pr-lg-0'>
      <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
        <div className='row justify-content-between'>
          <div className='col-9 pr-0 pr-md-0 th-16 mt-2 th-fw-500 th-black-1'>
            Attendance Overview
            {/* <span
              className='th-12 pl-2 th-pointer th-primary'
              onClick={() => history.push('/gradewise-attendance')}
            >
              (<u>View All Attendance &gt;</u>)
            </span> */}
          </div>

          {/* <div className='col-3 px-0 text-right'>
            <Select
              value={attendanceFilter}
              className='th-primary th-bg-grey th-br-4 th-select'
              bordered={false}
              placement='bottomRight'
              suffixIcon={<DownOutlined className='th-primary' />}
              dropdownMatchSelectWidth={false}
              onChange={handleChange}
            >
              <Option value={'today'}>Today</Option>
              <Option value={'week'}>Last Week</Option>
              <Option value={'month'}>Last Month</Option>
            </Select>
          </div> */}
        </div>
        <div className='col-12 th-14 th-fw-400 th-black-1'>
          <span className=''>Attendance of your Classess</span>
        </div>
        <div className='col-md-12 '>
          {loading ? (
            <div
              className='d-flex justify-content-center align-items-center'
              style={{ height: '145px' }}
            >
              <Spin tip='Loading...'></Spin>
            </div>
          ) : classwiseAttendanceData?.length > 0 ? (
            <div
              className='row mt-2'
              style={{ maxHeight: 145, overflowY: 'auto', overflowX: 'hidden' }}
            >
              {classwiseAttendanceData?.slice(0, 4).map((item, i) => (
                <div
                  className={`${
                    i % 2 == 0 ? 'pl-sm-0' : 'pl-sm-2'
                  } col-sm-6 px-1 py-2 pr-sm-1`}
                  // onClick={() =>
                  //   history.push({
                  //     pathname: '/sectionwise-attendance',
                  //     state: {
                  //       gradeName: item?.grade_name,
                  //       gradeID: item?.grade_id,
                  //       sectionName: item?.section_name,
                  //       sectionID: item?.section_id,
                  //       date: moment().format('YYYY-MM-DD'),
                  //     },
                  //   })
                  // }
                >
                  <div className='row th-bg-grey shadow-sm align-items-center py-2 th-br-8 th-pointer'>
                    <div className='col-5 px-1 text-center th-truncate-2 text-capitalize'>
                      <span className='th-fw-500'>{item?.grade_section}</span>
                    </div>
                    <div className='col-3 px-1 text-center'>
                      <Tag color='green' className='th-br-5'>
                        <span className='th-fw-600'>
                          {item?.present_count < 9
                            ? '0' + item?.present_count
                            : item?.present_count}
                        </span>
                      </Tag>
                    </div>
                    <div className='col-2 px-1 text-center'>
                      <Tag color='red' className='th-br-5'>
                        {' '}
                        <span className='th-fw-600'>
                          {' '}
                          {item?.absent_count < 9
                            ? '0' + item?.absent_count
                            : item?.absent_count}
                        </span>
                      </Tag>
                    </div>
                    <div className='col-2 pr-0 '>
                      <RightOutlined className='th-12' />
                    </div>
                  </div>
                  {/* <NumberCard data={item} isAttendance={true} /> */}
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center '>
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
                  : ''
              }`}
            >
              <div className='d-flex align-items-center'>
                <div style={{ height: 10, width: 10, backgroundColor: 'green' }}>
                  &nbsp;
                </div>
                <span className='th-green ml-3'>Present</span>
              </div>
              <div className='d-flex align-items-center'>
                <div style={{ height: 10, width: 10, backgroundColor: 'red' }}>
                  &nbsp;{' '}
                </div>
                <span className='th-red ml-3'>Absent</span>
              </div>
            </div>
            <div>
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

export default AttendanceReport;
