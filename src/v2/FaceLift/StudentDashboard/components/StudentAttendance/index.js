import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'v2/config/axios';
import { Link, useHistory } from 'react-router-dom';
import endpoints from 'v2/config/endpoints';
import moment from 'moment';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const StudentAttendance = (props) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [monthlyAttendanceData, setMonthlyAttendanceData] = useState([]);

  useEffect(() => {
    fetchStudentAttendance();
  }, []);

  const fetchStudentAttendance = (params = {}) => {
    axios
      .get(`${endpoints.studentDashboard.studentAnnualAttendanceReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setAttendanceData(response?.data.result);
          setMonthlyAttendanceData(response?.data.result?.montly_attendance);
        }
      })
      .catch((error) => console.log(error));
  };

  const options = {
    title: {
      text: 'Last 3 Month Attendance',
      align: 'left',
    },
    series: [
      {
        showInLegend: false,
        data: monthlyAttendanceData?.slice(-3)?.map((item) => {
          return item?.attendance_details?.present;
        }),
        name: 'Attendance %',
      },
    ],
    xAxis: {
      reversed: false,
      title: {
        enabled: false,
      },
      categories: monthlyAttendanceData?.slice(-3)?.map((item) => {
        return moment(item?.month, 'M').format('MMMM');
      }),
    },
    yAxis: {
      title: {
        text: 'Attendance %',
      },
      labels: {
        format: '{value} %',
      },
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <>
      <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
        <div className='row justify-content-between'>
          <div className='col-12 th-16 mt-2 th-fw-500 th-black-1 pr-0'>My Attendance</div>
        </div>
        <div className='col-md-12'>
          <div
            className='d-flex justify-content-between mt-3 p-2 '
            style={{ background: '#F8F8F8', borderRadius: 6 }}
          >
            <div className='th-black-2'>Today's</div>

            <div
              className='th-fw-600 text-capitalize'
              style={{
                color:
                  attendanceData?.today_attendance === 'Holiday'
                    ? '#7cb5ec'
                    : attendanceData?.today_attendance === 'present'
                    ? '#09a23a'
                    : attendanceData?.today_attendance === 'absent'
                    ? '#f8222f'
                    : '#c6c6c6',
              }}
            >
              {attendanceData?.today_attendance}
            </div>
          </div>
        </div>
        <div className='my-2 p-2'>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={{ style: { height: '300px' } }}
          />
        </div>
        <div className='my-2 '>
          <div className='col-md-12 th-16 mt-2 th-fw-500 th-black-1'>
            Total Attendance
          </div>
          <div className='col-md-12'>
            <div
              className='d-flex justify-content-between mt-2 p-2 '
              style={{ background: '#F8F8F8', borderRadius: 6 }}
            >
              <div className='th-black-2'>Overall Attendance</div>
              <div className='th-green th-fw-600'>{attendanceData?.att_ptnge}</div>
              <div className='th-primary th-pointer'>
                <Link to={'/student-attendance-dashboard'}>
                  <u>{'View >'}</u>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentAttendance;
