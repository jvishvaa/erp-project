import React, { useContext, useState, useEffect } from 'react';
import { Autocomplete, Pagination } from '@material-ui/lab/';
import Layout from '../Layout';
import line from '../../assets/images/line.svg';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import ClearIcon from '../../components/icon/ClearIcon';
import Loader from '../../components/loader/loader';
import Breadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import moment from 'moment';
import MobileDatepicker from './mobile-datepicker';
import './overallattendance.scss';
import FormGroup from '@material-ui/core/FormGroup';
import { useHistory } from 'react-router';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import {
  Card,
  Grid,
  TextField,
  makeStyles,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  CardContent,
  CardMedia,
  Typography,
  withStyles,
  SvgIcon,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MediaQuery from 'react-responsive';
import unfiltered from '../../assets/images/unfiltered.svg';
import selectfilter from '../../assets/images/selectfilter.svg';
import { id } from 'date-fns/locale';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',
    borderRadius: '10px',
    width: '100%',

    margin: '1.5rem -0.1rem',
  },
  bord: {
    margin: theme.spacing(1),
    border: 'solid lightgrey',
    borderRadius: 10,
  },
}));

const Attendance = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [attendanceType, setAttendanceType] = useState([]);
  const [date, setDate] = useState(new Date());
  const [dateString, setDateString] = useState('');
  const [dateValue, setDateValue] = useState(moment(date).format('YYYY-MM-DD'));
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [secSelectedId, setSecSelectedId] = useState([]);
  const [data, setData] = useState();
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState();
  const history = useHistory();
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [studentName, setStudentName] = useState();
  const [allStudents, setAllStudents] = useState([]);
  const [setSelectedStudent, setSetSelectedStudent] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  const [totalGenre, setTotalGenre] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [studentView, setStudentView] = useState(false);
  const limit = 14;
  //  let path = window.location.pathname;
  //  console.log(path, 'path');

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Calendar & Attendance' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Calendar') {
              setModuleId(item.child_id);
              console.log(item.child_id, 'Chekk');
            }
            if (item.child_name === 'Student Calendar') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
    console.log(history);
    if (history?.location?.state?.payload) {
      console.log('vinod');
    }
  }, []);
  console.log(moduleId, 'MODULE_ID');
  useEffect(() => {
    let path = window.location.pathname;
    console.log(path, 'path');
    console.log(history);
    if (history?.location?.pathname === '/teacher-view/attendance') {
      if (history?.location?.state?.payload) {
        console.log(history?.location?.state?.payload?.academic_year_id?.session_year);
        setSelectedAcadmeicYear(history?.location?.state?.payload?.academic_year_id);
        setSelectedBranch(history?.location?.state?.payload?.branch_id);
        setSelectedGrade(history?.location?.state?.payload?.grade_id);
        setSelectedSection(history?.location?.state?.payload?.section_id);
        setStartDate(history?.location?.state?.payload?.startDate);
        setEndDate(history?.location?.state?.payload?.endDate);
        setStudentName(history?.location?.state?.studentData);
        console.log(history?.location?.state?.payload?.branch_id);
        // console.log(history?.location?.state?.studentData[0]?.student)
        getAllData();
      } else {
        const date = new Date();
        console.log(
          new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'full',
            timeStyle: 'long',
          }).format(date)
        );
        callApi(`${endpoints.userManagement.academicYear}`, 'academicYearList');
      }
    }
    if (history?.location?.pathname === '/student-view/attendance') {
      // setAlert('warning', 'testing');
      getAllStudentsData();
    }
  }, []);

  const getAllData = () => {
    axiosInstance
      .get(
        `${endpoints.academics.singleStudentAttendance}?start_date=${history?.location?.state?.payload?.startDate}&end_date=${history?.location?.state?.payload?.endDate}&erp_id=${history?.location?.state?.studentData[0]?.erp_id}&page=${pageNumber}&page_size=${limit}`
      )
      .then((res) => {
        if (res.status == 200) {
          setTotalGenre(res.data.count);
          console.log(res.data.count);
          console.log(res.data.results, 'single student data');
          setData(res.data.results);
          setAlert('success', 'Data Successfully fetched');
          if (res?.data?.message) {
            // alert(res?.data?.message)
          } else console.log(res.data.message);
        }
        if (res.status == 400) {
          console.log(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
        // setAlert('error', 'something went wrong');
      });
  };

  const getAllStudentsData = () => {
    setStartDate(history?.location?.state?.payload?.startDate);
    setEndDate(history?.location?.state?.payload?.endDate);
    setStudentName(history?.location?.state?.data[0]?.student_name);
    setStudentView(true);
    let userName = JSON.parse(localStorage.getItem('rememberDetails')) || {};
    console.log(userName[0], 'userName');
    axiosInstance
      .get(
        `${endpoints.academics.singleStudentAttendance}?start_date=${history?.location?.state?.payload?.startDate}&end_date=${history?.location?.state?.payload?.endDate}&erp_id=${userName[0]}&page=${pageNumber}&page_size=${limit}`
      )
      // .get(`${endpoints.academics.singleStudentAttendance}?start_date=${d1}&end_date=${d2}&erp_id=${d3}`)
      .then((res) => {
        if (res.status == 200) {
          setTotalGenre(res.data.count);
          console.log(res.data.count);
          console.log(res.data.results, 'single student data');
          setData(res.data.results);
          setAlert('success', 'Data Successfully fetched');
          if (res?.data?.message) {
            // alert(res?.data?.message)
          } else console.log(res.data.message);
        }
        if (res.status == 400) {
          console.log(res.message);
          setAlert('error', res.message);
        }
      })
      .catch((err) => {
        console.log(err);
        // setAlert('error', 'something went wrong');
      });
  };
  const getAllStudents = () => {
    console.log('checking all students');
    axiosInstance
      .get(
        `${endpoints.academics.studentList}?academic_year_id=${selectedAcademicYear.id}&branch_id=${selectedBranch.branch.id}&grade_id=${selectedGrade.grade_id}&section_id=${selectedSection.section_id}`
      )
      .then((res) => console.log(res.data.result))
      .catch((err) => console.log(err));
  };

  const [state, setState] = React.useState({
    present: false,
    absent: false,
    first_half: false,
    second_half: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    console.log(state);
  };

  const handleOpenOnViewDetails = () => {
    if (history?.location?.state?.payload) {
      callApi(`${endpoints.userManagement.academicYear}`, 'academicYearList');
      // console.log("history data is there")
    } else {
    }
  };
  const handleBack = () => {
    const payload = {
      academic_year_id: selectedAcademicYear,
      branch_id: selectedBranch,
      grade_id: selectedGrade,
      section_id: selectedSection,
      startDate: startDate,
      endDate: endDate,
    };
    if (history?.location?.pathname === '/teacher-view/attendance') {
      history.push({
        pathname: '/OverallAttendance',
        state: {
          payload,
          backButtonStatus: true,
        },
      });
    }
    if (history?.location?.pathname === '/student-view/attendance') {
      history.push({
        pathname: '/attendance-calendar/student-view',
        state: {
          payload,
          backButtonStatus: true,
        },
      });
    }
  };
  const handleFilter = () => {
    if (!selectedAcademicYear) {
      setAlert('warning', 'Select Academic Year');
      return;
    }
    console.log(selectedBranch.length, '===============');
    if (selectedBranch.length == 0) {
      console.log(selectedBranch.length, '===============');
      setAlert('warning', 'Select Branch');
      return;
    }
    if (selectedGrade.length == 0) {
      setAlert('warning', 'Select Grade');
      return;
    }
    if (selectedSection.length == 0) {
      setAlert('warning', 'Select Section');
      return;
    }
    // setLoading(true);
    const payload = {
      academic_year_id: selectedAcademicYear.id,
      branch_id: selectedBranch.branch.id,
      grade_id: selectedGrade.grade_id,
      section_id: selectedSection.section_id,
      dateValue: dateValue,
      attendanceType: attendanceType,
    };
    console.log(payload, 'testing');
  };

  const handleDateChange = () => {};

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            console.log(result?.data?.data || []);
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || []);
            setBranchList(result?.data?.data?.results || []);
          }
          if (key === 'gradeList') {
            console.log(result?.data?.data || []);
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            console.log(result?.data?.data || []);
            setSectionList(result.data.data);
          }
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  }
  const handlePagination = (event, page) => {
    console.log(page, 'page number checking');
    if (history?.location?.pathname === '/student-view/attendance') {
      setPageNumber(page);
      setStartDate(history?.location?.state?.payload?.startDate);
      setEndDate(history?.location?.state?.payload?.endDate);
      setStudentName(history?.location?.state?.data[0]?.student_name);
      setStudentView(true);
      let userName = JSON.parse(localStorage.getItem('rememberDetails')) || {};
      console.log(userName[0], 'userName');
      axiosInstance
        .get(
          `${endpoints.academics.singleStudentAttendance}?start_date=${history?.location?.state?.payload?.startDate}&end_date=${history?.location?.state?.payload?.endDate}&erp_id=${userName[0]}&page=${page}&page_size=${limit}`
        )
        // .get(`${endpoints.academics.singleStudentAttendance}?start_date=${d1}&end_date=${d2}&erp_id=${d3}`)
        .then((res) => {
          if (res.status == 200) {
            setTotalGenre(res.data.count);
            console.log(res.data.count);
            console.log(res.data.results, 'single student data');
            setData(res.data.results);
            setAlert('success', 'Data Successfully fetched');
            if (res?.data?.message) {
              // alert(res?.data?.message)
            } else console.log(res.data.message);
          }
          if (res.status == 400) {
            console.log(res.message);
            setAlert('error', res.message);
          }
        })
        .catch((err) => {
          console.log(err);
          // setAlert('error', 'something went wrong');
        });
    }
    if (history?.location?.pathname === '/teacher-view/attendance') {
      setPageNumber(page);
      axiosInstance
        .get(
          `${endpoints.academics.singleStudentAttendance}?start_date=${history?.location?.state?.payload?.startDate}&end_date=${history?.location?.state?.payload?.endDate}&erp_id=${history?.location?.state?.studentData[0]?.erp_id}&page=${page}&page_size=${limit}`
        )
        .then((res) => {
          if (res.status == 200) {
            setTotalGenre(res.data.count);
            console.log(res.data.count);
            console.log(res.data.results, 'single student data');
            setData(res.data.results);
            setAlert('success', 'Data Successfully fetched');
            if (res?.data?.message) {
              // alert(res?.data?.message)
            } else console.log(res.data.message);
          }
          if (res.status == 400) {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
          // setAlert('error', 'something went wrong');
        });
    }
  };
  const handleClearAll = () => {
    setSelectedAcadmeicYear('');
    setSelectedBranch([]);
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    setDateValue(moment(date).format('YYYY-MM-DD'));
    setData([]);
    setTotalGenre(null);
  };

  const StyledClearButton = withStyles({
    root: {
      backgroundColor: '#E2E2E2',
      color: '#8C8C8C',
      borderRadius: '10px',
      // marginLeft: '20px',
      height: '42px',
      marginTop: 'auto',
    },
  })(Button);

  const StyledFilterButton = withStyles({
    root: {
      backgroundColor: '#FF6B6B',
      color: '#FFFFFF',
      height: '42px',
      borderRadius: '10px',
      padding: '12px 40px',
      // marginLeft: '20px',
      padding: '8px 32px',
      marginLeft: 'auto',
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

  const [datePopperOpen, setDatePopperOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().startOf('isoWeek'),
    moment().endOf('week'),
  ]);
  const handleStartDateChange = (e, value) => {
    // console.log('startdate:', date.toISOString().split('T')[0]);
    // const endDate = getDaysAfter(date.clone(), 6);
    console.log('startDate:', value);

    setStartDate(value);
  };

  // const handleEndDateChange = (date) => {
  //   const startDate = getDaysBefore(date.clone(), 6);
  //   setStartDate(startDate);
  //   setEndDate(date.format('YYYY-MM-DD'));
  //   // getTeacherHomeworkDetails(2, startDate, date);
  // };
  const handleEndDateChange = (e, value) => {
    console.log('endDate', value);
    setEndDate(value);
  };

  return (
    <Layout>
      <div className='profile_breadcrumb_wrapper'>
        <CommonBreadcrumbs componentName='Attendance' />
      </div>
      <Grid container direction='row' className={classes.root} spacing={3}>
        <Grid item md={6} xs={12} className='items'>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              size='small'
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              // className='button'
              id='date-picker'
              label='StartDate'
              name='start_date'
              inputVariant='outlined'
              className='arrow'
              onChange={handleStartDateChange}
              // handleStartDateChange={handleStartDateChange}
              // handleEndDateChange={handleEndDateChange}

              value={startDate}
              maxDate={new Date()}
              style={{ background: 'white', width: '50%' }}
              // onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>

          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              size='small'
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              // className='button'
              id='date-picker'
              label='EndDate'
              variant='standard'
              name='end_date'
              inputVariant='outlined'
              className='arrow'
              onChange={handleEndDateChange}
              value={endDate}
              style={{ background: 'white', width: '50%' }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        {!studentView && (
          <>
            <Grid item md={3} xs={12}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onOpen={() => handleOpenOnViewDetails()}
                onChange={(event, value) => {
                  setSelectedAcadmeicYear(value);
                  if (value) {
                    callApi(
                      `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                      'branchList'
                    );
                  }
                  setSelectedGrade([]);
                  setSectionList([]);
                  setSelectedSection([]);
                  setSelectedBranch([]);
                }}
                id='branch_id'
                className='dropdownIcon'
                value={selectedAcademicYear || ''}
                options={academicYear || ''}
                getOptionLabel={(option) => option?.session_year || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Academic Year'
                    placeholder='Academic Year'
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  setSelectedBranch([]);
                  if (value) {
                    // const ids = value.map((el)=>el)
                    const selectedId = value.branch.id;
                    setSelectedBranch(value);
                    callApi(
                      `${endpoints.academics.grades}?session_year=${
                        selectedAcademicYear.id
                      }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                      'gradeList'
                    );
                  }
                  setSelectedGrade([]);
                  setSectionList([]);
                  setSelectedSection([]);
                }}
                id='branch_id'
                className='dropdownIcon'
                value={selectedBranch || ''}
                options={branchList || ''}
                getOptionLabel={(option) => option?.branch?.branch_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Branch'
                    placeholder='Branch'
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  setSelectedGrade([]);
                  if (value) {
                    // const ids = value.map((el)=>el)
                    const selectedId = value.grade_id;
                    // console.log(selectedBranch.branch)
                    const branchId = selectedBranch.branch.id;
                    setSelectedGrade(value);
                    callApi(
                      `${endpoints.academics.sections}?session_year=${selectedAcademicYear.id}&branch_id=${branchId}&grade_id=${selectedId}&module_id=${moduleId}`,
                      'section'
                    );
                  }
                  setSectionList([]);
                  setSelectedSection([]);
                }}
                id='grade_id'
                className='dropdownIcon'
                value={selectedGrade || ''}
                options={gradeList || ''}
                getOptionLabel={(option) => option?.grade__grade_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Grade'
                    placeholder='Grade'
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  setSelectedSection([]);
                  getAllStudents();
                  if (value) {
                    const ids = value.id;
                    const secId = value.section_id;
                    setSelectedSection(value);
                    setSecSelectedId(secId);
                  }
                }}
                id='section_id'
                className='dropdownIcon'
                value={selectedSection || ''}
                options={sectionList || ''}
                getOptionLabel={(option) =>
                  option?.section__section_name || option?.section_name || ''
                }
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Section'
                    placeholder='Section'
                  />
                )}
              />
            </Grid>
          </>
        )}
        {/* <Grid item md={3} xs={12}>
          <Autocomplete
            // multiple
            style={{ width: '100%' }}
            size='small'
            onChange={(event, value) => {
              // setSelectedSection([])
              setSelectedStudent([])
              if (value) {
                const ids = value.user
                const secId = value.section_id
                setSelectedSection(value)
                setSecSelectedId(secId)
              }

            }}
            id='section_id'
            className='dropdownIcon'
            value={selectedSection || ""}
            options={sectionList || ""}
            getOptionLabel={(option) => option?.section__section_name || option?.section_name || ""}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Section'
                placeholder='Section'
              />
            )}
          />
        </Grid> */}
        <Grid item md={11} xs={12}>
          <Divider />
        </Grid>
        <Grid container direction='row' style={{ marginLeft: '1%' }}>
          {/* <Grid item md={2} xs={6}>
            <StyledClearButton
              variant='contained'
              startIcon={<ClearIcon />}
              onClick={handleClearAll}
            >
              Clear all
            </StyledClearButton>
          </Grid> */}
          <Grid item md={2} xs={6}>
            <StyledClearButton variant='contained' onClick={handleBack}>
              back
            </StyledClearButton>
          </Grid>
          {/* <Grid item md={2} xs={6}>
            <StyledFilterButton
              variant='contained'
              color='secondary'
              startIcon={<FilterFilledIcon className={classes.filterIcon} />}
              className={classes.filterButton}
              onClick={handleFilter}
            >
              filter
            </StyledFilterButton>
          </Grid> */}
        </Grid>
      </Grid>
      <MediaQuery minWidth={541}>
        <Grid
          container
          direction='row'
          className={classes.root}
          spacing={3}
          alignItems='center'
          alignContent='center'
        >
          {/* <Grid item md={1}></Grid> */}

          <Grid
            item
            xs={12}
            md={4}
            container
            direction='row'
            alignItems='center'
            alignContent='center'
          >
            <Grid item sm={2} md={3}>
              <Typography variant='subtitle2' color='primary'>
                {!studentView && (
                  <strong>
                    {studentName && studentName[0].student_name.slice(0, 10)}
                  </strong>
                )}
                {studentView && (
                  <strong>
                    {history?.location?.state?.data[0]?.student_name.slice(0, 10)}
                  </strong>
                )}
              </Typography>
            </Grid>
            <Grid item sm={1} md={1}>
              <img src={line} className={classes.lines} />
            </Grid>

            <Grid item sm={2} md={7}>
              <Typography variant='subtitle2' color='primary'>
                {startDate} to {endDate}
              </Typography>
            </Grid>
            <Grid item sm={1} md={1}>
              <img src={line} className={classes.lines} />
            </Grid>
          </Grid>
          <Grid item xs={12} md={5} container direction='row'>
            <FormGroup row className='checkboxStyle'>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.present}
                    onChange={handleChange}
                    name='present'
                    disabled={state.absent || state.first_half || state.second_half}
                    color='primary'
                  />
                }
                label='Present'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.absent}
                    onChange={handleChange}
                    name='absent'
                    color='primary'
                    disabled={state.present || state.first_half || state.second_half}
                  />
                }
                label='Absent'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.first_half}
                    onChange={handleChange}
                    name='first_half'
                    color='primary'
                    disabled={state.present || state.absent || state.second_half}
                  />
                }
                label='1st half'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.second_half}
                    onChange={handleChange}
                    name='second_half'
                    color='primary'
                    disabled={state.present || state.absent || state.first_half}
                  />
                }
                label='2nd half'
              />
            </FormGroup>
          </Grid>
          {/* <Grid item xs={8} sm={2} md={2} lg={2}>
            <Button>Download Excel</Button>
          </Grid> */}
        </Grid>
      </MediaQuery>
      <MediaQuery maxWidth={540}>
        <Grid container direction='row'>
          <Grid item sm={2} md={3}>
            <Typography variant='subtitle2' color='primary'>
              {startDate} to {endDate}
            </Typography>
          </Grid>
        </Grid>
      </MediaQuery>
      <Grid container direction='row'>
        <Grid item xs={12} md={12}>
          <Divider />
        </Grid>
      </Grid>

      <Grid container direction='row' className={classes.root} spacing={3}>
        {data &&
          data
            .sort((a, b) => b.date - a.date)
            .filter((item, index) => {
              if (state.first_half && state.second_half) {
                return item.first_shift && item.second_shift;
              } else if (state.absent) {
                return !item.first_shift && !item.second_shift;
              } else if (state.first_half) {
                return item.first_shift;
              } else if (state.second_half) {
                return item.second_shift;
              } else if (state.present) {
                return item.first_shift && item.second_shift;
              } else {
                return item;
              }
            })
            .map((item) => {
              return (
                <Grid item>
                  <Card className={classes.bord}>
                    <CardMedia className={classes.cover} />
                    <div>
                      <CardContent>
                        <Grid
                          container
                          direction='row'
                          justify='flex-start'
                          align='flex-start'
                        >
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={2}
                            lg={12}
                            // style={{ textAlign: 'start' }}
                          >
                            <h3 style={{ color: '#014B7E', textAlign: 'center' }}>
                              {item.date}
                            </h3>
                            {item.first_shift && item.second_shift && (
                              <Grid>
                                <p class='box3'>
                                  <span class='test1'>1st</span>
                                  <span class='test2'>2nd</span>
                                </p>
                              </Grid>
                            )}
                            {item.first_shift && !item.second_shift && (
                              <Grid>
                                <p class='box5'>
                                  <span class='test1'>1st</span>
                                  <span class='test2'>2nd</span>
                                </p>
                              </Grid>
                            )}
                            {!item.first_shift && item.second_shift && (
                              <Grid>
                                <p class='box1'>
                                  <span class='test1'>1st</span>
                                  <span class='test2'>2nd</span>
                                </p>
                              </Grid>
                            )}
                            {!item.first_shift && !item.second_shift && (
                              <Grid>
                                <p class='box2'>
                                  <span class='test1'>1st</span>
                                  <span class='test2'>2nd</span>
                                </p>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </div>
                  </Card>
                </Grid>
              );
            })}
      </Grid>
      <br />

      {/* </Grid> */}
      {!data && (
        <div style={{ width: '10%', marginLeft: '40%' }}>
          <SvgIcon component={() => <img src={unfiltered} />} />
          <SvgIcon
            component={() => (
              <img
                style={
                  isMobile
                    ? { height: '20px', width: '250px' }
                    : { height: '50px', width: '400px' }
                }
                src={selectfilter}
              />
            )}
          />
        </div>
      )}
      <Grid container justify='center'>
        {data && totalGenre > 14 && (
          <Pagination
            onChange={handlePagination}
            // style={{ paddingLeft: '150px' }}
            count={Math.ceil(totalGenre / limit)}
            color='primary'
            page={pageNumber}
            color='primary'
          />
        )}
      </Grid>
      {loading && <Loader />}
    </Layout>
  );
};

export default Attendance;
