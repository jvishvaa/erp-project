import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { makeStyles } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
// import MyCalendar from 'containers/academicCalendar/fullcalendar/monthly';
import FullCalendar, { filterEventStoreDefs } from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import './AttendanceOverview.scss';
import Layout from 'containers/Layout';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { withRouter, useHistory } from 'react-router-dom';
import moment from 'moment';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
const userToken = JSON.parse(localStorage.getItem('userDetails'))?.token;

const useStyles = makeStyles((theme) => ({
  parent: {
    padding: '0px 0px 10px 0px',
    marginTop: '-2%',
  },
  root: {
    padding: '20px 40px 20px 40px',
    // display: 'flex',
    // flexWrap: 'wrap',
    // '& > *': {
    //   margin: theme.spacing(1),
    // //   width: theme.spacing(16),
    // //   height: theme.spacing(16),
    // },
  },
  highchart: {
    height: '50%',
    padding: '10px',
    marginTop: '14px',
    marginBottom: '14px',
    // backgroundColor: '#F5F5F5',
    //   padding: '10px 20px 10px 20px',
  },
  paperMargin: {
    marginTop: '14px',
    marginBottom: '14px',
    padding: '20px',
  },
}));

const AttendanceOverview = withRouter(({ history, ...props }) => {
  const dashBoard = () => {
    history.push({
      pathname: `/dashboard`,
      counter:2,
    })
  };
  const classes = useStyles();
  const [yearlyAttendance, setYearlyAttendance] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [yearlyPresent, setYearlyPresent] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [yearlyAbsent, setYearlyAbsent] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const filterAttendance = (data) => {
    let present = [];
    let absent = [];

    let data1 = data.sort(function(a, b) { 
      return a.month_name - b.month_name
    });

    data1.forEach((element) => {
      present.push(element.present);
      absent.push(element.absent);
    });
    setYearlyPresent(present);
    setYearlyAbsent(absent);
  };

  const yearlyGraph = () => {
    axiosInstance
      .get(`${endpoints.teacherDashboardTwo.yearlyAttendance}?session_year=2021-22`, {
        headers: {
          // 'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com', ///hatana hai..............
          'X-DTS-HOST': window.location.host,
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200 || result?.data?.status_code === 201) {
          setYearlyAttendance(result.data.result);
          filterAttendance(result.data.result);
        }
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };

  const organiseEvents = (data) => {
    setMonthlyAttendance(
      data.map((element) => {
        let setColor =
          element?.attendence_status === 'present'
            ? '#4EC692'
            : element?.attendence_status === 'absent'
            ? '#FF5D41'
            : element?.attendence_status === 'halfday'
            ? 'paleyellow'
            : element?.attendence_status === 'holiday'
            ? '#DAB5FF'
            : 'orange';

        let setTitle =
          element?.attendence_status === 'present'
            ? 'P'
            : element?.attendence_status === 'absent'
            ? 'A'
            : element?.attendence_status === 'halfday'
            ? 'HD'
            : element?.attendence_status === 'holiday'
            ? 'H'
            : 'L';
        return {
          title: setTitle,
          start: element?.date,
          color: setColor,
        };
      })
    );
  };

  const monthlyAttendanceOverview = () => {
    axiosInstance
      .get(
        `${endpoints.teacherDashboardTwo.monthlyAttendance}?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            // 'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com', ///hatana hai..............
            'X-DTS-HOST': window.location.host,
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((result) => {
        if (result?.data?.status_code === 200 || result?.data?.status_code === 201) {
          // setMonthlyAttendance(result.data.result);
          organiseEvents(result.data.result);
          // filterAttendance(result.data.result);
        }
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };

  const configObj = {
    chart: {
      type: 'column',
      height: 250,
      animation: {
        duration: 10,
      },
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'April',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yAxis: {
      min: 0,
      title: {
        text: null,
      },
    },
    tooltip: {
      pointFormat:
        '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
      shared: true,
    },
    plotOptions: {
      column: {
        stacking: 'percent',
      },
    },
    series: [
      {
        color: 'rgb(78, 198, 146)',
        name: 'Present',
        data: yearlyPresent,
        // data: [yearlyAttendance[0]?.present || 0, 3, 4, 7, 2, 2, 6, 5, 6, 3, 5, 0],
      },
      {
        color: 'rgb(255, 0, 0)',
        name: 'Absent',
        data: yearlyAbsent,
      },
    ],
  };

  let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
  const initial_events = [
    {
      id: 2,
      title: 'A',
      start: todayStr + 'T12:00:00',
    },
  ];
  //***********Today attendance log TimeLine***************
  // useEffect(() => {
  //   let start = 8;
  //   let end1 = 10;
  //   let p1start = 8;
  //   let p1end = 10;
  //   let attendanceDiv = document.getElementById('outertodayAttendance');
  //   // let TotalDivLength = attendanceDiv.clientWidth
  //   let TotalDivLength = 100;
  //   let oneHourLength = TotalDivLength / (end1 - start);
  //   let PeriodLength = oneHourLength * (p1end - p1start);
  //   let newDiv = document.createElement('div');
  //   newDiv.style.width = `${PeriodLength}%`;
  //   newDiv.style.height = '5px';
  //   newDiv.style.backgroundColor = 'red';
  //   // newDiv.style.margin = 'auto';
  //   attendanceDiv.appendChild(newDiv);
  // }, []);
  //***********Today attendance log TimeLine***************

  const TodayAttendance = () => {
    let attendanceDetail = props?.location?.state?.attendanceDetail;
    let statusTag = document.getElementById('statusTag');
    let status = document.getElementById('status');

    if (attendanceDetail?.attendence_status === "present") {
      status.style.color = 'green';
      statusTag.style.backgroundColor = 'green';
      status.innerHTML = '<b>Present</b>';
    } else if (attendanceDetail?.attendence_status === 'absent'){
      status.style.color = 'red';
      statusTag.style.backgroundColor = 'red';
      status.innerHTML = '<b>Absent</b>';
    } else {
      status.style.color = 'black';
      statusTag.style.backgroundColor = 'grey';
      status.innerHTML = '<b>Not Available</b>';
    }
  };

  useEffect(() => {
    TodayAttendance();
    yearlyGraph();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      monthlyAttendanceOverview();
    }
  }, [endDate]);

  return (
    <Layout>
      <div style={{ padding: '15px', marginTop: '-3%' }}>
        <div style={{ marginTop: '2%' }}>
          <ArrowBackIcon style={{ cursor: 'pointer' }} onClick={dashBoard} />
        </div>
        <div style={{ marginLeft: '-2.5%', marginTop:"-2%" }}>
          <CommonBreadcrumbs componentName='Dashboard' childComponentName='Attendance' />
        </div>
        <div className={classes.parent}>
          {/* <b style={{ fontSize: 'large' }}>Attendance Overview</b> */}
        </div>
        <Paper elevation={1} className={classes.root}>
          <div>
            <b style={{ fontSize: 'large', marginRight: '20px' }}>Today's Attendance</b>
          </div>
          <Paper elevation={1} className={classes.paperMargin}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px brown',
                // justifyContent: 'center',
                // textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  minWidth: '275px',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  id='statusTag'
                  style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    background: 'green',
                    // minWidth: '200px',
                    alignItems: 'center',
                  }}
                ></div>
                <b id='status' style={{ color: 'green' }}></b>
                <b>{moment(new Date()).format('dddd, MMMM Do YYYY')}</b>
                {/* <div>
                  <b>Mon,15/03/2022</b>
                </div>
                <div>
                  <b>Logged in: 56 min Ago.</b>
                </div> */}
              </div>
              {/* ***********Today attendance log TimeLine*************** */}
              {/* <div style={{ width: '90%', backgroundColor: '#F5F5F5' }}>
                <div
                  id='outertodayAttendance'
                  style={{
                    width: '90%',
                    height: '40px',
                    // border: 'solid',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                </div>
                <div
                  // id='outertodayAttendance'
                  style={{
                    width: '90%',
                    height: '25px',
                    // border: 'solid',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>08:00AM</div>
                  <div>09:00AM</div>
                  <div>10:00AM</div>
                </div>
              </div> */}
              {/* ***********Today attendance log TimeLine*************** */}
            </div>
          </Paper>

          <b style={{ fontSize: 'large', marginRight: '20px' }}>Monthly Overview</b>
          <span style={{ fontSize: 'larger' }}>Attendance Logs</span>
          <Paper id='calenderChart' elevstion={1} className={classes.highchart}>
            <HighchartsReact highcharts={Highcharts} options={configObj} />
            <div
              style={{
                borderTop: '40px solid #F2F2F1',
                borderLeft: '40px solid #F2F2F1',
                borderBottom: '20px solid #F2F2F1',
                borderRight: '20px solid #F2F2F1',
              }}
            >
              <FullCalendar
                plugins={[
                  dayGridPlugin,
                  // interactionPlugin,
                  // timeGridPlugin,
                  // listPlugin,
                  // CustomViewConfig,
                ]}
                initialView='dayGridMonth'
                contentHeight='500'
                // initialView= 'timeGridWeek'
                defaultView='timeGridWeek'
                height='400px'
                events={monthlyAttendance}
                eventDisplay='block'
                //   displayEventTime={true}
                //   eventTimeFormat={{
                //     // like '14:30:00'
                //     hour: '2-digit',
                //     minute: '2-digit',
                //     meridiem: true,
                //   }}
                // eventContent={renderEventContent}
                //   dateClick={handleDateClick}
                //   ref={calendarRef}
                // eventContent={RenderEventContent}
                //   eventClick={handleClickOpenMonth}
                datesSet={(dateInfo) => {
                  setStartDate(moment(dateInfo.start).format('YYYY-MM-DD'));
                  setEndDate(
                    moment(dateInfo.end).subtract(1, 'days').format('YYYY-MM-DD')
                  );
                }}
                headerToolbar={{
                  left: 'prev',
                  center: 'title',
                  right: 'next',
                }}
                dayHeaderFormat={{ weekday: 'long' }}
                //   counter={counter}
                //   customButtons={{
                //     myCustomButton: {
                //       text: 'Calendar',
                //       click: function () {
                //         setOpen(true);
                //         setCalRef(calendarRef.current.getApi());
                //       },
                //       // icon: "far fa-calendar",
                //     },
                //   }}
                // viewDisplay={getView}
                //   datesSet={(dateInfo) => {
                //     setStartDate(moment(dateInfo.start).format('YYYY-MM-DD'));
                //     setEndDate(moment(dateInfo.end).subtract(1, 'days').format('YYYY-MM-DD'));
                //   }}
                //   viewDidMount={getView}
                //   dayMaxEventRows={4}
                //   extendedProps={filterData}
                //   content={filterData}
              />
              <div>
                <Card style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div
                    className='colorArea'
                    style={{
                      width: '50%',
                      flexWrap: 'wrap',
                      padding: '1% 2%',
                      display: 'flex',
                      margin: 5,
                      justifyContent: 'space-around',
                      marginLeft: '70%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        className='colorDiv'
                        style={{
                          background: '#4EC692',
                          marginRight: '1%',
                          height: '20px',
                          width: '20px',
                        }}
                      ></div>
                      <p> Present </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        className='colorDiv'
                        style={{
                          background: '#FF5D41',
                          marginRight: '1%',
                          height: '20px',
                          width: '20px',
                        }}
                      ></div>
                      <p> Absent </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        className='colorDiv'
                        style={{
                          background: '#DAB5FF',
                          marginRight: '1%',
                          height: '20px',
                          width: '20px',
                        }}
                      ></div>
                      <p> Holidays </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Paper>
        </Paper>
      </div>
    </Layout>
  );
});
export default AttendanceOverview;
