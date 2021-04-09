import React, { useState, useEffect } from 'react';
import Layout from '../Layout/index';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import {
  Button,
  Divider,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core';
import RangeCalender from './calender.jsx';
import { Autocomplete, Pagination } from '@material-ui/lab';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import Group from '../../assets/images/Group.png';
import Avatar from '@material-ui/core/Avatar';
import ClearIcon from '../../components/icon/ClearIcon';
import Chip from '@material-ui/core/Chip';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import OutlinedFlagRoundedIcon from '@material-ui/icons/OutlinedFlagRounded';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AcademicYear from 'components/icon/AcademicYear';
import moment from 'moment';
import './AttendanceCalender.scss';
import { student } from 'containers/Finance/src/_reducers/student.reducer';
// import { StaticDateRangePicker, LocalizationProvider } from '@material-ui/lab';
// import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
// import Box from '@material-ui/core/Box';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',

    width: '100%',

    margin: '1.5rem -0.1rem',
  },

  title: {
    fontSize: '1.1rem',
  },

  content: {
    fontSize: '20px',
    marginTop: '2px',
  },
  contentData: {
    fontSize: '12px',
  },
  contentsmall: {
    fontSize: '15px',
  },
  textRight: {
    textAlign: 'right',
  },

  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  paperSize: {
    width: '300px',
    height: '670px',
    borderRadius: '10px',
  },
}));

const AttedanceCalender = () => {
  const classes = useStyles();
  const [callapi, setCallApi] = useState(1);
  const [gradeID, setGradeID] = useState();
  const [academicYear, setAcademicYear] = useState();
  const [academicYearID, setAcademicYearID] = useState();
  const [branchData, setBranchData] = useState();
  const [branchID, setBranchID] = useState();
  const [gradeData, setGradeData] = useState();
  const [sectionData, setSectionData] = useState();
  const [sectionID, setSectionID] = useState();
  const [studentData, setStudentData] = useState(null);
  const [student, setStudent] = useState([]);
  const [counter, setCounter] = useState(2);
  const [todayDate, setTodayDate] = useState();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    // axiosInstance.get(endpoints.masterManagement.gradesDrop).then((res) => {
    //   console.log('res', res.data.data);
    //   setGradesGet(res.data.data);

    // });
    if (callapi === 1) {
      callingAcadamicAPI();
      setCallApi(2);
    }
    if (callapi === 2) {
      callingBranchAPI();
      setCallApi(3);
    }
    if (callapi === 3) {
      callingGradeAPI();
      setCallApi(4);
    }
    if (callapi === 4) {
      callingSectionAPI();
    }
    // if(callapi === 2){

    // }
  }, [academicYearID, branchID, gradeID]);

  useEffect(() => {
    getToday();
  },[])
  const StyledClearButton = withStyles({
    root: {
      backgroundColor: '#E2E2E2',
      color: '#8C8C8C',
      height: '42px',
      marginTop: 'auto',
    },
  })(Button);
  // const handleGrade = (e, value) => {
  //   console.log('The value of grade', e.target.value);
  //   if (value) {
  //     console.log('grade:', value.id);
  //     setGrade(e.target.value);
  //   } else {
  //     setGrade('');
  //   }
  // };
  const handleCallGrade = (event, id) => {
    console.log(id, 'branch id');
    setBranchID(id);
  };
  const callingAcadamicAPI = () => {
    axiosInstance
      .get(`/erp_user/list-academic_year/`, {})
      .then((res) => {
        console.log(res, 'Academic');
        setAcademicYear(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const callingGradeAPI = () => {
    axiosInstance
      .get(`/erp_user/grademapping/?session_year=${academicYearID}&branch_id=${branchID}`)
      .then((res) => {
        console.log(res, 'grade');
        setGradeData(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const callingBranchAPI = () => {
    axiosInstance
      .get(`/erp_user/branch/?session_year=${academicYearID}`)
      .then((res) => {
        if (res.status === 200) {
          // console.log(res);
          setBranchData(res.data.data.results);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const callingSectionAPI = () => {
    axiosInstance
      .get(
        `/erp_user/sectionmapping/?session_year=${academicYearID}&branch_id=${branchID}&grade_id=${gradeID}`
      )
      .then((res) => {
        console.log(res, 'setion');
        if (res.status === 200) {
          setSectionData(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const setDate = () => {
    var date = new Date();
    var formatDate = moment(date).format('YYYY-MM-DD');
    console.log(formatDate, 'format date');
    var day = date.getDay();
    let currentDay;
    setCounter(1);
    if (day === 0) {
      currentDay = 'Sunday';
    }
    if (day === 1) {
      currentDay = 'Monday';
    }
    if (day === 2) {
      currentDay = 'Tuesday';
    }
    if (day === 3) {
      currentDay = 'Wednesday';
    }
    if (day === 4) {
      currentDay = 'Thursday';
    }
    if (day === 5) {
      currentDay = 'Friday';
    }
    if (day === 6) {
      currentDay = 'Saturday';
    }
    setTodayDate(currentDay + ' ' + moment(date).format('DD-MM-YYYY'));
    console.log(currentDay, 'todays Date');

    // axiosInstance
    //   .get(`academic/events_list/?date=${formatDate}`)
    //   .then((res) => {
    //     console.log(res, 'setion');
    //     setCurrentEvent(res);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const getToday = () => {
    var date = new Date();
    var formatDate = moment(date).format('YYYY-MM-DD');
    console.log(formatDate, 'format date');
    axiosInstance
    .get(`academic/events_list/?date=${formatDate}`)
    .then((res) => {
      console.log(res, 'setion');
      setCurrentEvent(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  const handlePassData = (endDate, startDate) => {
    console.log(endDate, 'got date');
    console.log(startDate, 'startDate');
    setStartDate(startDate);
    setEndDate(endDate);
    axiosInstance
      .get(`academic/student_attendance_between_date_range/`, {

        params: {
          start_date: startDate,
          end_date: endDate,
          branch_id: branchID,
          grade_id: gradeID,
          grade_id: 2,

          // section_id: sectionID,
          section_id: 2,
          academic_year: academicYearID,
        },
      })
      .then((res) => {
        console.log(res.data.absent_list, 'respond student');
        setStudentData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const StyledFilterButton = withStyles({
    root: {
      backgroundColor: '#FF6B6B',
      color: '#FFFFFF',
      height: '42px',
      borderRadius: '10px',
      padding: '12px 40px',
      marginLeft: '20px',
      marginTop: 'auto',
      '&:hover': {
        backgroundColor: '#FF6B6B',
      },
    },

    startIcon: {
      fill: '#FFFFFF',
      stroke: '#FFFFFF',
    },
  })(Button);
  const [value, setValue] = React.useState([null, null]);

  return (
    <Layout>
      <CommonBreadcrumbs componentName='Attedance+Calender' />
      <Grid container direction='row' className={classes.root} spacing={3}>
        <Grid item md={2} xs={12}>
          <Autocomplete
            id='academic_year'
            size='small'
            options={academicYear}
            getOptionLabel={(option) => option?.session_year}
            style={{ background: 'white' }}
            onChange={(event, option) => setAcademicYearID(option?.id)}
            renderInput={(params) => (
              <TextField {...params} label='Academic' variant='outlined' required />
            )}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Autocomplete
            id='attedancetype'
            size='small'
            options={branchData}
            getOptionLabel={(option) => option?.branch?.branch_name}
            style={{ background: 'white' }}
            onChange={(event, option) => handleCallGrade(event, option?.id)}
            renderInput={(params) => (
              <TextField {...params} label='Branch' variant='outlined' required />
            )}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Autocomplete
            id='grade'
            size='small'
            options={gradeData}
            getOptionLabel={(option) => option?.grade_name}
            name='grade'
            style={{ background: 'white' }}
            onChange={(event, option) => setGradeID(option?.id)}
            renderInput={(params) => (
              <TextField {...params} label='grades' variant='outlined' required />
            )}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Autocomplete
            id='section'
            size='small'
            options={sectionData}
            getOptionLabel={(option) => option?.section_name}
            onChange={(event, option) => setSectionID(option?.id)}
            style={{ background: 'white' }}
            renderInput={(params) => (
              <TextField {...params} label='Section' variant='outlined' required />
            )}
          />
        </Grid>
        <Grid item md={11} xs={12}>
          <Divider />
        </Grid>
        <Grid item md={1} xs={12}></Grid>
        <br />
        <br />
        <Grid>
          <StyledClearButton
            variant='contained'
            startIcon={<ClearIcon />}
            href={`/markattedance`}
          >
            Clear all
          </StyledClearButton>

          <StyledFilterButton
            variant='contained'
            color='secondary'
            startIcon={<FilterFilledIcon className={classes.filterIcon} />}
            className={classes.filterButton}
          >
            filter
          </StyledFilterButton>
        </Grid>
      </Grid>

      <Grid
        container
        direction='row'
        className={classes.root}
        spacing={3}
        style={{ background: 'white' }}
      >
        <Grid className='calenderGrid'>
          <div className='buttonContainer'>
            <div className='today'>
              <Button
                variant='outlined'
                size='small'
                color='secondary'
                className='viewDetails'
                onClick={() => setDate()}
              >
                {/* <p className='btnLabel'>Secondary</p> */}
                Today
              </Button>
            </div>
            <div className='today'>
              <Button
                variant='outlined'
                size='small'
                color='secondary'
                className='viewDetails'
                onClick={() => setCounter(2)}
              >
                {/* <p className='btnLabel'>Secondary</p> */}
                Weekly
              </Button>
            </div>
            <div className='today'>
              <Button
                variant='outlined'
                size='small'
                color='secondary'
                className='viewDetails'
                onClick={() => setCounter(3)}
              >
                {/* <p className='btnLabel'>Secondary</p> */}
                Monthly
              </Button>
            </div>
          </div>
          {counter === 2 ? (
            <RangeCalender
              gradeID={gradeID}
              branchID={branchID}
              sectionID={sectionID}
              academicYearID={academicYearID}
              handlePassData={handlePassData}
            />
          ) : counter === 1 ? (
            <div className='todayEventContainer'>
              <div className='showDate'>
                <p className='dateToday'> {todayDate} </p>
              </div>
              {currentEvent && currentEvent != null ? (
                <>
                  <hr className='dividerEvent'></hr>

                  {currentEvent &&
                    currentEvent.map((data) => (
                      <div className='eventRow'>
                        <div className='event-data'>{data?.start_time.slice(11,16)}</div>
                        <div className='event-name'>
                          <OutlinedFlagRoundedIcon
                            style={{ background: '#FF6B6B', borderRadius: '30px' }}
                          />
                          {data?.event_name}
                        </div>
                      </div>
                    ))}
                  
                </>
              ) : (
                <img src={Group} width='100%' height=' 504px' />
              )}
            </div>
          ) : counter === 3 ? (
            <div> month </div>
          ) : (
            <></>
          )}
          {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDateRangePicker
              displayStaticWrapperAs='desktop'
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField {...startProps} variant='standard' />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} variant='standard' />
                </React.Fragment>
              )}
            />
          </LocalizationProvider> */}
        </Grid>
        <Grid item md={2} className='topGrid'>
          <div className='startDate'>{startDate}</div>
          <Paper elevation={3} className={classes.paperSize} id="attendanceContainer" >
            <Grid container direction='row' className={classes.root} id="attendanceGrid" >
              <Grid item md={6} xs={12}>
                <Typography variant='h6' color='primary' className="attendancePara" >
                  Attedance
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Button size='small'>
                  <span className={classes.contentData}>MarkAttendance</span>
                </Button>
              </Grid>
              <Grid item md={3}>
                <Typography className={classes.content} id="studentPara" >Student</Typography>
              </Grid>
              <KeyboardArrowDownIcon />
            </Grid>
            {studentData != null ? (
              <>
                <div className='absentContainer'>
                  <div className='absentHeader'>
                    <p>Absent List</p>
                    <p>Absent Duration</p>
                  </div>
                  <Divider />
                  {studentData.absent_list &&
                    studentData.absent_list.map((data) => (
                      <div className='absentList'>
                        <div className="eachAbsent">
                        <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
                        <div className='studentName'>
                          <p className='absentName'>{data.student_first_name} {data.student_last_name} </p>
                          {/* <p className='absentName'>{data.student_last_name}</p> */}
                        {/* <Chip  className='chipDays' > {data.absent_count}  </Chip> */}
                        <div className="absentCount" >
                      <p className="absentChip" > {data.absent_count} Days </p>
                      </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className='btnArea'>
                    <Button variant='outlined' color='secondary' className='viewDetails'>
                      <p className='btnLabel'>View Details</p>
                    </Button>
                  </div>
                </div>
                <div className='presentContainer'>
                  <div className='presentHeader'>
                    <p>Present List</p>
                  </div>
                  <Divider />
                  {studentData.present_list &&
                    studentData.present_list.map((data) => (
                      <div className='presentList'>
                        <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
                        <div className="presentStudent" >
                        <p className='presentFName'>{data.student_first_name} {data.student_last_name}</p>
                        {/* <p className='presentLName'> {data.student_last_name}</p> */}
                        </div>
                       
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <img src={Group} width='100%' height=' 504px' className="noDataImg" />
            )}
          </Paper>
        </Grid>
        <Grid item md={1}></Grid>
        <Grid item md={2} className='topGrid' >
        <div className='startDate'>{endDate}</div>
          <Paper elevation={3} className={[classes.root, classes.paperSize]} id="eventContainer" >
            <Grid container direction='row' className="eventContainer" >
              <Grid item md={6} xs={12}>
                <Typography variant='h6' color='primary' className="eventPara" >
                  Event
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Button size='small' fullWidth>
                  {/* ADD EVENT */}
                  <span className={classes.contentData}>Add Event</span>

                </Button>
              </Grid>
              <Grid item md={5}>
                <Typography className={classes.contentsmall}>Event Details</Typography>
              </Grid>
              <Grid item md={7}>
                <Typography className={classes.contentsmall} id="updated" >
                  Updated:1 Day ago
                </Typography>
              </Grid>
            </Grid>
            {studentData != null ? (
              <Paper elevation={1} className="eventGrid">
                {studentData.events &&
                  studentData.events.map((data) => (
                    <Typography className={[classes.contentsmall, classes.root]} id="eventData" >
                      {data.start_time.slice(0,10)}
                      <br />
                      <Grid container direction='row' >
                        <OutlinedFlagRoundedIcon
                          style={{ background: '#78B5F3', borderRadius: '30px' }}
                        />
                        <Typography> {data.event_name} </Typography>
                      </Grid>
                      <Grid container direction='row' className="dateTimeEvent" >
                        <div className="timeEvent">
                        <WatchLaterOutlinedIcon
                          color='primary'
                          className={classes.content}
                        />
                        {data.start_time.slice(11,16)}
                        </div>
                        <div className="dateEvent">
                        <EventOutlinedIcon color='primary' className={classes.content} />
                        {data.start_time.slice(0,10)}
                        </div>
                      </Grid>
                      <Typography className={classes.contentData}>
                        {data.description}
                      </Typography>
                    </Typography>
                  ))}
              </Paper>
            ) : (
              <img src={Group} width='100%' height=' 504px' className="noEventImg" />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AttedanceCalender;
