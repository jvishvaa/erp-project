import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Table, Breadcrumb } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import moment from 'moment';

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5.2,
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

const StudentAttendanceDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [monthlyAttendanceData, setMonthlyAttendanceData] = useState([]);
  const [dailyAttendanceData, setDailyAttendanceData] = useState([]);
  const [upcomingHoliday, setUpcomingHoliday] = useState([]);

  const { role_details, erp } = JSON.parse(localStorage.getItem('userDetails'));

  useEffect(() => {
    fetchStudentAttendance();
    fetchStudentHoliday();
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
          setSelectedMonth(response?.data.result?.montly_attendance[0]?.month);
          fetchStudentMonthlyAttendance({
            year: response?.data.result?.montly_attendance[0]?.year,
            month: response?.data.result?.montly_attendance[0]?.month,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchStudentMonthlyAttendance = (params = {}) => {
    axios
      .get(`${endpoints.studentDashboard.studentMonthlyAttendanceReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setDailyAttendanceData(response?.data.result);
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchStudentHoliday = (params = {}) => {
    axios
      .get(`${endpoints.studentDashboard.studentUpcomingHolidays}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUpcomingHoliday(response?.data.result);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleSelectMonth = (eachMonth) => {
    setSelectedMonth(eachMonth?.month);
    fetchStudentMonthlyAttendance({
      year: eachMonth?.year,
      month: eachMonth?.month,
    });
  };

  const options = {
    chart: {
      backgroundColor: '#f8f8f8',
    },
    title: {
      text: '',
    },

    series: [
      {
        showInLegend: false,
        data: monthlyAttendanceData?.map((item) => {
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
      categories: monthlyAttendanceData?.map((item) => {
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
  };
  const optionsPie = {
    chart: {
      type: 'pie',
    },

    title: {
      verticalAlign: 'middle',
      floating: true,
      text: attendanceData?.att_ptnge,
      y: 18,
    },
    colors: ['#09a23a', '#f8222f', '#c6c6c6', '#7cb5ec'],

    plotOptions: {
      pie: {
        shadow: false,
      },
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.point.name + '</b>: ' + this.y + ' %';
      },
    },
    series: [
      {
        data: [
          ['Present', attendanceData?.present_percentage],
          ['Absents', attendanceData?.absent_percentage],
          ['Unmarked', attendanceData?.unmarked_ptnge],
          ['Holiday', attendanceData?.holidays_percentage],
        ],
        size: '100%',
        innerSize: '50%',
        showInLegend: false,
        dataLabels: {
          enabled: false,
        },
      },
    ],
  };
  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>S.No.</span>,

      width: '5%',
      align: 'left',
      render: (text, record, index) => <span className='pl-4'>{index + 1}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Date</span>,
      width: '80%',
      align: 'center',
      render: (data) => <span className='th-black-1 th-16'>{data?.date}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Status</span>,
      dataIndex: 'att_status',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
  ];

  console.log(upcomingHoliday, 'upcomingHoliday');
  return (
    <Layout>
      <div className=''>
        <div className='row pt-3'>
          <div className='col-md-12'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-pointer'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1'>Attendance</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='col-md-12 mt-3'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row justify-content-between'>
                <div className='col-8 col-md-6 th-16 th-fw-500 th-black-1 d-flex flex-column flex-md-row align-items-md-center'>
                  Attendance Report{' '}
                  <div className='th-12 pl-0 pl-md-3 th-pointer th-primary'></div>
                </div>
              </div>
              <div className='row pt-2'>
                <div className='col-md-3'>
                  <div className='py-2'>Name: {role_details?.name} </div>
                  <div className='py-2'>ERP: {erp}</div>
                  <div className='py-2'>
                    Grade: {role_details?.grades[0]?.grade__grade_name}{' '}
                  </div>

                  <div
                    className='th-br-6 px-2 py-2 th-pointer th-white mt-2'
                    style={{
                      backgroundColor:
                        attendanceData?.today_attendance === 'Holiday'
                          ? '#7cb5ec'
                          : attendanceData?.today_attendance === 'present'
                          ? '#09a23a'
                          : attendanceData?.today_attendance === 'absent'
                          ? '#f8222f'
                          : '#c6c6c6',
                    }}
                  >
                    <div className='row justify-content-between align-items-center'>
                      <div className='col-md-6 th-fw-600'>Todays</div>
                      <div className='col-md-6 th-fw-600 text-right text-capitalize'>
                        {attendanceData?.today_attendance}
                      </div>
                    </div>
                  </div>

                  <div className='py-2 px-2 mt-2 th-br-6 th-bg-grey'>
                    <div className='pb-2 pt-2 th-16 th-fw-500 th-black-1'>
                      Upcoming Holidays
                    </div>
                    <div>
                      {upcomingHoliday?.slice(0, 5)?.map((eachHoliday) => {
                        return (
                          <div className='row text-capitalize justify-content-between py-1'>
                            <div> {eachHoliday?.title} </div>
                            <div className='th-14'>
                              {moment(eachHoliday?.start_date).format('Do MMM YY')} to{' '}
                              {moment(eachHoliday?.end_date).format('Do MMM YY')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className='col-md-9 th-bg-grey '>
                  <div className='th-16 th-fw-500 th-black-1 pt-2'>Overview</div>
                  <div className='row align-items-center'>
                    <div
                      className='col-md-3 th-br-6 px-2 py-3 th-pointer text-center'
                      style={{ minHeight: '150px' }}
                    >
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={optionsPie}
                        containerProps={{ style: { height: '300px' } }}
                      />
                    </div>
                    <div
                      className=' col-md-9 th-br-6 px-2 py-3 th-pointer'
                      style={{ minHeight: '150px' }}
                    >
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                        containerProps={{ style: { height: '200px' } }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-12 pt-3'>
          <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
            <div className='col-md-12 '>
              <Slider {...settings} className='th-slick'>
                {monthlyAttendanceData?.map((eachMonth) => {
                  return (
                    <div
                      className='th-custom-col-padding pr-3'
                      onClick={() => handleSelectMonth(eachMonth)}
                    >
                      <div className='th-bg-grey th-br-6 px-2 py-2 th-pointer'>
                        <div className='row justify-content-between align-items-center'>
                          <div className='col-6 th-fw-600'>
                            {moment(eachMonth?.month, 'M').format('MMMM')}
                          </div>
                          <div className='col-6 text-center'>
                            <div className='th-14'>Overall</div>
                            <div className='py-1 th-20 th-fw-600'>
                              {eachMonth?.attendance_details?.present_percentage}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>{' '}
        </div>

        {/* Table */}
        <div className='col-md-12 pt-3'>
          <div className='row justify-content-between'>
            <div className='py-2 th-16 th-fw-600 col-md-5 col-12 pl-0'>
              {moment(selectedMonth, 'M').format('MMMM')} 2022 Monthly Attendance Details{' '}
            </div>
            <div className='py-2 th-16 th-fw-600 col-md-7 col-12 text-right'>
              Total Present:{' '}
              <span className='th-green pr-3'>
                {
                  monthlyAttendanceData?.filter((item) => {
                    return item.month === selectedMonth;
                  })[0]?.attendance_details?.present
                }
              </span>
              Total Absent:{' '}
              <span className='th-red pr-3'>
                {
                  monthlyAttendanceData?.filter((item) => {
                    return item.month === selectedMonth;
                  })[0]?.attendance_details?.absent
                }
              </span>
              Total Unmarked:{' '}
              <span className=''>
                {
                  monthlyAttendanceData?.filter((item) => {
                    return item.month === selectedMonth;
                  })[0]?.attendance_details?.unmarked
                }
              </span>
            </div>
          </div>
          <Table
            className='th-table'
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
            }
            // loading={loading}
            columns={columns}
            dataSource={dailyAttendanceData}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default StudentAttendanceDashboard;
