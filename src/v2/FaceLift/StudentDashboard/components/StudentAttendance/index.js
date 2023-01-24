import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'v2/config/axios';
import { useHistory } from 'react-router-dom';
import endpoints from 'v2/config/endpoints';
import { Progress } from 'antd';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const StudentAttendance = (props) => {
  const history = useHistory();
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
    chart: {
      type: 'column',
      style: {
        fontFamily: 'Inter, sans-serif',
      },
    },
    title: {
      text: '',
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      series: {
        stacking: 'normal',
      },
      column: {
        dataLabels: {
          enabled: true,
          inside: false,
          // overflow: 'none',
        },
      },
    },
    series: [
      {
        showInLegend: false,
        data: monthlyAttendanceData?.slice(-3)?.map((item) => {
          return item?.attendance_details?.present_percentage;
        }),
        name: 'Attendance %',
        color: '#20c51c',
        dataLabels: {
          format: '{point.y:.1f} %',
          enabled: true,
          align: 'center',
          style: {
            fontSize: '8px',
            color: '#20c51c',
          },
        },
        // pointWidth: 20,
      },

      {
        showInLegend: false,
        data: monthlyAttendanceData?.slice(-3)?.map((item) => {
          return item?.attendance_details?.present_percentage - 100;
        }),
        name: 'Absent %',
        color: '#F32D2D',
        dataLabels: {
          format: '{point.y:.1f} %',
          enabled: true,
          align: 'center',
          style: {
            fontSize: '8px',
            color: '#F32D2D',
            textShadow: null,
          },
        },
        // pointWidth: 20,
      },
    ],
    xAxis: {
      reversed: false,
      title: {
        enabled: false,
      },
      categories: monthlyAttendanceData?.slice(-3)?.map((item) => {
        return item?.month_name + ' ' + item?.year;
      }),
    },
    yAxis: {
      min: -100,
      max: 100,
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
    scales: {
      xAxes: [
        {
          stacked: true,
          gridLines: {
            display: false,
          },
          barPercentage: 0.2,
        },
      ],
    },
    maintainAspectRatio: false,
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
            // style={{ background: '#F8F8F8', borderRadius: 6 }}
          >
            <div className='th-black-2'>Last 3 Months Attendance</div>
          </div>
        </div>
        <div className='my-2 p-2'>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={{
              style: { height: '300px' },
            }}
          />
        </div>
        <div className='my-2 '>
          <div className='col-md-12 th-14 mt-2 th-black-1'>Total Attendance</div>
          <div className='col-md-12'>
            <div
              className='d-flex justify-content-between align-items-center p-2 '
              style={{ background: '#F8F8F8', borderRadius: 6 }}
            >
              <div className='th-black-2'>Overall Attendance</div>
              <div className='th-green th-fw-600'>
                <Progress
                  type='circle'
                  percent={attendanceData?.present_percentage}
                  strokeColor='#20c51c'
                  width={40}
                  format={() => (
                    <span className='th-8 th-green'>{attendanceData?.att_ptnge}</span>
                  )}
                />
              </div>
              <div
                className='th-black-1 th-bg-grey p-2 th-br-8 badge th-pointer'
                style={{ outline: '1px solid #d9d9d9' }}
                onClick={() => history.push('/student-attendance-dashboard')}
              >
                View Details
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentAttendance;
