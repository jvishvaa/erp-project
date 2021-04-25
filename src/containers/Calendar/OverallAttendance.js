import React, { useContext, useState, useEffect } from 'react';
import {
  makeStyles,
  Divider,
  TextField,
  Grid,
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  withStyles,
  SvgIcon,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Loader from '../../components/loader/loader';
import { Autocomplete, Pagination } from '@material-ui/lab';
import MobileDatepicker from './mobile-datepicker';
import Layout from '../Layout';
import line from '../../assets/images/line.svg';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import ClearIcon from '../../components/icon/ClearIcon';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MediaQuery from 'react-responsive';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import './overallattendance.scss';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import '../teacherBatchView/style.scss';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { useHistory } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { fi } from 'date-fns/locale';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import unfiltered from '../../assets/images/unfiltered.svg';
import selectfilter from '../../assets/images/selectfilter.svg';
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

const Attend = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
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
  const history = useHistory();
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(getDaysAfter(moment(), 6));
  const [result, setResult] = useState();
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  console.log(moduleId, 'module id =======================');

  const [totalGenre, setTotalGenre] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const limit = 8;

  useEffect(() => {
    console.log(history);

    if (history?.location?.state?.payload) {
      console.log(history?.location?.state?.payload?.academic_year_id?.session_year);
      setSelectedAcadmeicYear(history?.location?.state?.payload?.academic_year_id);
      setSelectedBranch(history?.location?.state?.payload?.branch_id);
      setSelectedGrade(history?.location?.state?.payload?.grade_id);
      setSelectedSection(history?.location?.state?.payload?.section_id);
      setStartDate(history?.location?.state?.payload?.startDate);
      setEndDate(history?.location?.state?.payload?.endDate);
      setResult(history?.location?.state?.data);
      console.log(
        history?.location?.state?.payload?.section_id?.section_id,
        'section id in OverallAttendance'
      );
      console.log(history?.location?.state?.payload?.branch_id);
      console.log(history?.location?.state?.payload?.grade_id?.grade_id, 'grade_id');
      console.log(history?.location?.state?.data, 'student data');
    } else {
      const date = new Date();
      console.log(
        new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(
          date
        )
      );
      callApi(`${endpoints.userManagement.academicYear}`, 'academicYearList');
    }
  }, []);

  const handleOpenOnViewDetails = () => {
    if (history?.location?.state?.payload) {
      callApi(`${endpoints.userManagement.academicYear}`, 'academicYearList');
      // console.log("history data is there")
    } else {
    }
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

  function getDaysAfter(date, amount) {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  function getDaysBefore(date, amount) {
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  const handleFilter = () => {
    if (!selectedAcademicYear) {
      setAlert('warning', 'Select Academic Year');
      return;
    }
    if (selectedBranch.length == 0) {
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
    setLoading(true);
    const payload = {
      academic_year_id: selectedAcademicYear?.selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      grade_id: selectedGrade?.grade_id,
      section_id: selectedSection?.section_id,
      start_date: startDate,
      end_date: endDate,
    };
    console.log(payload);
    console.log(selectedAcademicYear.length < 0);

    axiosInstance
      .get(
        `${endpoints.academics.multipleStudentsAttendacne}?academic_year=${selectedAcademicYear.id}&branch_id=${selectedBranch.branch.id}&grade_id=${selectedGrade.grade_id}&section_id=${selectedSection.section_id}&start_date=${startDate}&end_date=${endDate}`
      )
      .then((res) => {
        setLoading(false);
        // console.log(res.data.results, 'mutliple student data');
        let present_length = res?.data?.results?.present_list?.length;
        let absent_length = res?.data?.results?.absent_list?.length;
        let present = res?.data?.results?.present_list;
        let absent = res?.data?.results?.absent_list;

        console.log(present);
        console.log(absent);
        let student_list = [];
        console.log(present, 'present list');
        console.log(absent, 'absent list');
        if (present_length > absent_length) {
          console.log('present length');
          for (let i = 0; i < present_length; i++) {
            const student_id = absent.filter(
              (item) => item.student === present[i].student
            );
            console.log(student_id, 'id found');
            const studentDetails = {
              name: present[i].student_name,
              roll_no: present[i].student,
              no_of_absent_days: present[i].student_count,
            };
          }
        }
        if (present_length < absent_length) {
          console.log('absent length');
          for (let i = 0; i < absent_length; i++) {
            const student_id = present.filter(
              (item) => item.student === absent[i].student
            );
            console.log(student_id, 'id found');
            const studentDetails = {
              name: present[i].student_name,
              roll_no: present[i].student,
              no_of_absent_days: present[i].student_count,
            };
          }
        }
        setAlert('success', 'Data Successfully fetched');
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        // setAlert('error', err);
      });
  };

  const handleStartDateChange = (e, value) => {
    console.log('startDate:', value);

    setStartDate(value);
  };

  const handleEndDateChange = (e, value) => {
    console.log('endDate', value);
    setEndDate(value);
  };

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
  const defaultValues = {
    firstName: 'Elon',
    lastName: 'Musk',
    gender: 'male',
  };

  const handleBack = () => {
    history.push({
      pathname: '/attendance-calendar/teacher-view',
    });
  };

  const handleClearAll = () => {
    setSelectedAcadmeicYear('');
    setSelectedBranch([]);
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    setDateValue(moment(date).format('YYYY-MM-DD'));
    setTotalGenre(null);
  };

  const StyledClearButton = withStyles({
    root: {
      backgroundColor: '#E2E2E2',
      color: '#8C8C8C',
      borderRadius: '10px',
      marginLeft: '20px',
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

  const handleDateChange = (event, value) => {
    setDateValue(value);
    console.log('date', value);
  };
  const handlePagination = (event, page) => {
    setPageNumber(page);
    handleFilter();
  };
  // const handleSinlgeStudent = (id) => {
  //   console.log(id);
  //   const studentData = result.filter((item) => item.user_id == id);
  //   console.log(studentData);
  //   const payload = {
  //     academic_year_id: selectedAcademicYear,
  //     branch_id: selectedBranch,
  //     grade_id: selectedGrade,
  //     section_id: selectedSection,
  //     startDate: startDate,
  //     endDate: endDate,
  //   };
  //   history.push({
  //     pathname: '/teacher-view/attendance',
  //     state: {
  //       studentData,
  //       payload,
  //     },
  //   });
  // };

  return (
    <Layout>
      <div className='profile_breadcrumb_wrapper' style={{ marginLeft: '-10px' }}>
        <CommonBreadcrumbs componentName='Overall Attendance' />
      </div>
      <Grid
        container
        direction='row'
        className={classes.root}
        spacing={2}
        style={{ border: '1x solid red' }}
      >
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
              maxDate={new Date()}
              value={startDate}
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
              maxDate={new Date()}
              style={{ background: 'white', width: '50%' }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
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
        <Grid item md={11} xs={12}>
          <Divider />
        </Grid>
      </Grid>
      <Grid container direction='row'>
        <StyledClearButton
          variant='contained'
          startIcon={<ClearIcon />}
          onClick={handleBack}
        >
          Back
        </StyledClearButton>
        <StyledClearButton
          variant='contained'
          startIcon={<ClearIcon />}
          onClick={handleClearAll}
        >
          Clear all
        </StyledClearButton>

        <StyledFilterButton
          variant='contained'
          color='secondary'
          startIcon={<FilterFilledIcon className={classes.filterIcon} />}
          className={classes.filterButton}
          onClick={handleFilter}
        >
          filter
        </StyledFilterButton>
      </Grid>

      <br />
      <br />
      <MediaQuery minWidth={541}>
        <Grid
          container
          direction='row'
          justify='space-between'
          className={classes.root}
          spacing={2}
        >
          <Grid item sm={2} md={3}>
            <Typography color='primary'>
              {startDate && startDate} to {endDate && endDate}{' '}
            </Typography>
          </Grid>

          <Grid item xs={8} sm={2} md={2} lg={2}>
            <Typography variant='subtitle1' color='secondary'>
              Number of students: {(result && result.length) || 0}
            </Typography>
          </Grid>
          {/* <Grid item xs={8} sm={2} md={2} lg={2}>
            <Button>Download Excel</Button>
          </Grid> */}
        </Grid>
      </MediaQuery>
      <MediaQuery maxWidth={540}>
        <Grid container direction='row'></Grid>
      </MediaQuery>
      <Grid container direction='row'>
        <Grid item xs={12} md={12}>
          <Divider />
        </Grid>
        <br />
      </Grid>
      {/* <Grid container direction='row' className={classes.root} spacing={2}>
        {result &&
          result.map((item) => {
            return (
              <Grid item xs={12} sm={6} md={6}>
                <Card
                  className={classes.bord}
                  // onClick={() => handleSinlgeStudent(item.user_id)}
                  style={{ cursor: 'pointer' }}
                >
                  <CardMedia className={classes.cover} />
                  <div>
                    <CardContent>
                      <Grid
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                      >
                        <Grid item xs={1} sm={1} md={1} lg={1} style={{ marginTop: 15 }}>
                          <Avatar>{item?.name?.slice(0, 1)}</Avatar>
                        </Grid>
                        <Grid item>
                          <Typography>{item?.name?.slice(0, 6) || ''}</Typography>
                          <Typography>{item?.roll_no}</Typography>
                        </Grid>
                        <Grid>
                          <p class='box'>
                            <span class='test1'>{item.no_of_present_days}</span>
                            <span class='test'>{item.no_of_absent_days}</span>
                          </p>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </div>
                </Card>
              </Grid>
            );
          })}
      </Grid> */}
      <br />
      {!result && (
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
      {/* <Grid container justify='center'>
        {result && totalGenre > 8 && (
          <Pagination
            onChange={handlePagination}
            // style={{ paddingLeft: '150px' }}
            count={Math.ceil(totalGenre / limit)}
            color='primary'
            page={pageNumber}
            color='primary'
          />
        )}
      </Grid> */}
      {loading && <Loader />}
    </Layout>
  );
};

export default Attend;
