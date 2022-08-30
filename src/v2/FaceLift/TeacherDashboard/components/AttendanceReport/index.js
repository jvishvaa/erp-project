import React, { useState, useEffect } from 'react';
import NumberCard from 'v2/FaceLift/myComponents/NumberCard';
import { Select, Spin } from 'antd';
import { DownOutlined, ReloadOutlined } from '@ant-design/icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useHistory } from 'react-router-dom';
import axios from 'v2/config/axios';
import { useSelector } from 'react-redux';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4.2,
  slidesToScroll: 1,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3.2,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2.2,
        slidesToScroll: 2,
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
  const [attendanceFilter, setAttendanceFilter] = useState('today');
  const [counter, setCounter] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (value) => {
    setAttendanceFilter(value);
  };
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [classwiseAttendanceData, setClasswiseAttendanceData] = useState([]);

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
        if (response.status === 200) {
          setClasswiseAttendanceData(response?.data?.result);
          setLoading(false);
        }
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
    <div className='col-md-12'>
      <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
        <div className='row justify-content-between'>
          <div className='col-7 pr-0 pr-md-0 th-16 mt-2 th-fw-500 th-black-1'>
            Students Attendance Report
            <span
              className='th-12 pl-2 th-pointer th-primary'
              onClick={() => history.push('/gradewise-attendance')}
            >
              (<u>View All Attendance &gt;</u>)
            </span>
          </div>

          <div className='col-5 px-0 text-right'>
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
          </div>
        </div>
        <div className='col-md-12 ' style={{ height: 140 }}>
          {loading ? (
            <div className='th-width-100 text-center '>
              <Spin tip='Loading...'></Spin>
            </div>
          ) : classwiseAttendanceData?.length > 0 ? (
            <Slider {...settings} className='th-slick pt-3'>
              {classwiseAttendanceData?.map((item, i) => (
                <div className='th-custom-col-padding pr-3 mt-2'>
                  <NumberCard data={item} isAttendance={true} />
                </div>
              ))}
            </Slider>
          ) : (
            <div className='text-center '>
              <img src={NoDataIcon} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
