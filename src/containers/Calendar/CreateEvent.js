import React, { useEffect, useState, useContext } from 'react';
import MediaQuery from 'react-responsive';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loader from '../../components/loader/loader';
import Calendar from 'react-calendar';
import DatePicker from 'react-datepicker';
import MobileDatepicker from './mobile-datepicker';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { DateRangePicker } from 'materialui-daterange-picker';
import 'react-calendar/dist/Calendar.css';
import TimeRange from 'react-time-range';
import moment from 'moment';
import Layout from 'containers/Layout';
import Divider from '@material-ui/core/Divider';
import MomentUtils from '@date-io/moment';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { addDays } from 'date-fns';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Breadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import './Styles.css';
import { setModulePermissionsRequestData } from 'redux/actions';
import LineAtt from '../../assets/images/LineAtt.svg';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { dateFormat } from 'highcharts';
import { useHistory } from 'react-router';
import { size } from 'lodash';
function getDaysAfter(date, amount) {
  return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
}
function getDaysBefore(date, amount) {
  return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
}

const CreateEvent = () => {
  const [allDay, setAllDay] = useState(true);
  const [firstHalf, setFirstHalf] = useState(false);
  const [secondHalf, setSecondHalf] = useState(false);
  const [isconfirm, setIsConfirm] = useState(false);
  const [valuetime, onChange] = useState('10:00');
  const [state, setState] = useState();
  const [time, setTime] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [DateEnd, setDateEnd] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(getDaysAfter(moment(), 6));
  const [evnetcategoryType, setEventcategoryType] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(1);
  const [discripValue, setdiscripValue] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  const handleStartTimeChange = (start_time) => {
    console.log('time', start_time.toString().slice(16, 21));
    const time = start_time.toString().slice(16, 21);
    setSelectedStartTime(start_time);
    setStartTime(time);
  };
  const handleEndTimeChange = (end_time) => {
    // let x=date._d
    // console.log(x.split(" "))
    console.log('end_time:;', end_time.toString().slice(16, 21));
    setSelectedEndTime(end_time);
    setEndTime(end_time.toString().slice(16, 21));
  };
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
    button: {
      display: 'flex',
      justifyContent: 'space-evenly',
      width: '40%',
    },
  }));

  const handleStartDateChange = (e, value) => {
    // console.log('startdate:', date.toISOString().split('T')[0]);
    // const endDate = getDaysAfter(date.clone(), 6);
    console.log('startDate:', value);

    setStartDate(value);
  };
  const returnFunction = (time) => {
    console.log('timeeeee:', time);
  };

  const handleEndDateChange = (e, value) => {
    console.log('endDate', value);
    setEndDate(value);
  };

  const handleChange = (event) => {
    setdiscripValue(event.target.value);
    console.log(event.target.value);

    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('state', state);
    console.log('Startdate:', startDate);
    console.log('EndDate:', endDate);
    console.log('Starttime:', startTime);
    console.log('Endtime:', endTime);
    console.log('evne:', eventType);
    console.log('branch:', selectedBranch.id);
    console.log('grade:', selectedGrade.id);
    console.log('sect:', selectedSection.id);

    console.log('testing1branch', selectedBranch);
    console.log('testing2grade', selectedGrade);
    console.log('testing3grade', selectedSection);
    if (!eventType) {
      setAlert('warning', 'select event type');
      return;
    }
    if (!evnetcategoryType) {
      setAlert('warning', 'select event category');
      return;
    }
    console.log(state);
    if (state === undefined) {
      setAlert('warning', 'please give event name');
      return;
    }
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
    axiosInstance
      .post(endpoints.CreateEvent.CreateEvent, {
        event_name: state.event_name,
        description: state.description,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        event_category: eventType,

        academic_year: selectedAcademicYear.id,
        branch: selectedBranch.branch.id,
        grade: selectedGrade.grade_id,
        section: selectedSection.section_id,

        is_full_day: allDay,
        is_first_half: firstHalf,
        is_second_half: secondHalf,
      })
      .then((result) => {
        setAlert('success', result.data.message);

        history.push({
          pathname: '/attendance-calendar/teacher-view',
        });
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', 'something went wrong');
        console.log(error);
      });
  };
  const handleBackButtonClick = (e) => {
    history.push({
      pathname: '/attendance-calendar/teacher-view',
    });
  };

  const styles = {
    crossButton: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: 0,
    },
  };

  const classes = useStyles();
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [secSelectedId, setSecSelectedId] = useState([]);
  const [eventType, seteventType] = useState();
  const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'));

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
            }
          });
        }
      });
    }
  }, [window.location.pathname]);
  console.log(moduleId, 'MODULE_ID');

  useEffect(() => {
    callApi(
      `${endpoints.userManagement.academicYear}?module_id=${moduleId}`,
      'academicYearList'
    );

    console.log('iuhiuhi');
    axiosInstance.get(endpoints.CreateEvent.getEventCategory).then((res) => {
      console.log('iuhiuhi');
      console.log('eventcateory:-', res?.data);
      setEventcategoryType(res?.data);
    });
    console.log('iuhiuhisfsdfdsfsafsdfsdfdf');
  }, [counter]);

  const handleEventTypeChange = (e, value) => {
    e.preventDefault();

    console.log('eventttttype:', value.id);
    seteventType(value.id);
  };
  const is_full_day = (e, value) => {
    e.preventDefault();
    if (value % 2) {
      console.log('is_full_day:', 'true');
      setAllDay('true');
    } else {
      console.log('is_full_day:', 'false');
      setAllDay('false');
    }
  };
  const is_first_half = (e, value) => {
    e.preventDefault();
    if (value % 2) {
      console.log('is_first_half:', 'true');
      setFirstHalf('true');
    } else {
      console.log('is_first_half:', 'false');
      setFirstHalf('false');
    }
  };
  const is_second_half = (e, value) => {
    e.preventDefault();
    if (value % 2) {
      console.log('is_second_half:', 'true');
      setSecondHalf('true');
    } else {
      console.log('is_second_half:', 'false');
      setSecondHalf('false');
    }
  };

  const onunHandleClearAll = (e) => {
    e.preventDefault();

    document.getElementById('outlined-multiline-static').value = '';
    document.getElementById('eventname').value = '';
    // document.getElementById("coustom-date");
  };

  return (
    <>
      <Layout>
        <div className='profile_breadcrumb_wrapper'>
          <CommonBreadcrumbs componentName='Create Event' />
        </div>
        <form>
          <MediaQuery minWidth={785}>
            <Grid container direction='row'>
              {/* <Grid item md={4} lg={3} sm={6} xs={12}>
                <Breadcrumbs componentName='CreateEvent' />
              </Grid> */}
            </Grid>
            <Grid container direction='row' spacing={2} className={classes.root}>
              <Grid item md={4} lg={2} sm={6} xs={12}>
                <Autocomplete
                  className='arrow'
                  size='small'
                  id='combo-box-demo'
                  name='event_category'
                  labelplaceholder='Event_Type'
                  onChange={handleEventTypeChange}
                  options={evnetcategoryType || ''}
                  getOptionLabel={(option) => option.event_category_name || ''}
                  renderInput={(params) => (
                    <TextField {...params} label='Event Type' variant='outlined' />
                  )}
                />
              </Grid>

              <Grid item md={4} lg={2} sm={6} xs={12}>
                <TextField
                  name='event_name'
                  variant='outlined'
                  size='small'
                  id='eventname'
                  label='Event Name'
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Grid container direction='row'>
              <Grid item md={12} xs={12}>
                <Divider />
              </Grid>
            </Grid>
            <Grid container direction='row' spacing={2} className={classes.root}>
              <Grid item md={2} xs={12}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={(event, value) => {
                    console.log('moduleIdDDD', moduleId);
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
                      name='Academic'
                      placeholder='Academic Year'
                    />
                  )}
                />
              </Grid>
              <Grid item md={2} xs={12}>
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
                        `${endpoints.academics.grades}?session_year=${selectedAcademicYear.id}&branch_id=${selectedId}&module_id=${moduleId}`,
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
                      name='branch'
                      placeholder='Branch'
                    />
                  )}
                />
              </Grid>
              <Grid item md={2} xs={12}>
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
                      console.log('the grade', value.grade_id);
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
                      name='grade'
                      placeholder='Grade'
                    />
                  )}
                />
              </Grid>
              <Grid item md={2} xs={12}>
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
                      name='section'
                      placeholder='Section'
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container direction='row'>
              <Grid item md={12} xs={12}>
                <Divider />
              </Grid>
            </Grid>
            <Grid
              container
              direction='row'
              spacing={2}
              className={classes.root}
              alignItems='center'
            >
              <Grid item xs={12} md={2} className='arrow-1'>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    size='small'
                    variant='dialog'
                    format='YYYY-MM-DD'
                    margin='none'
                    // className='button'
                    id='date-picker'
                    label='StartDate'
                    minDate={new Date()}
                    name='start_date'
                    inputVariant='outlined'
                    // className='arrow conte'
                    onChange={handleStartDateChange}
                    // handleStartDateChange={handleStartDateChange}
                    // handleEndDateChange={handleEndDateChange}

                    value={startDate}
                    className='dropdownIcon'
                    // style={{ background: 'white', width: '50%' }}
                    // onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} md={2}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    size='small'
                    variant='dialog'
                    format='YYYY-MM-DD'
                    margin='none'
                    // className='button'
                    id='date-picker'
                    label='EndDate'
                    minDate={new Date()}
                    variant='standard'
                    name='end_date'
                    inputVariant='outlined'
                    // className='arrow conte'
                    className='dropdownIcon'
                    onChange={handleEndDateChange}
                    value={endDate}
                    // style={{ background: 'white', width: '50%' }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item md={1} sm={1}>
                <img src={LineAtt} className='im' />
              </Grid>
              <Grid item lg={1} md={1} sm={1}>
                <FormControlLabel
                  style={{ marginLeft: '-110%', marginTop: '-20%' }}
                  name
                  control={<Checkbox onChange={is_full_day} />}
                  label='All Day'
                  variant='outlined'
                  labelPlacement='top'
                />
              </Grid>
            </Grid>
            <Grid
              container
              direction='row'
              spacing={2}
              className={classes.root}
              alignItems='center'
            >
              <Grid item xs={12} md={2}>
                {/* <div className='time-ranger-border'> */}
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardTimePicker
                    size='small'
                    // style={{ width: '50%', marginTop: '-5%' }}
                    // className='arrow conte'
                    className='dropdownIcon'
                    id='time-picker'
                    label='Start Time'
                    inputVariant='outlined'
                    name='start_time'
                    value={selectedStartTime}
                    onChange={handleStartTimeChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </MuiPickersUtilsProvider>
                {/* </div> */}
              </Grid>
              <Grid item xs={12} md={2}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardTimePicker
                    size='small'
                    // margin="normal"
                    // style={{ width: '50%', marginTop: '-5%' }}
                    className='helperText'
                    className='arrow conte'
                    className='dropdownIcon'
                    id='time-picker'
                    label='End Time'
                    name='end_time'
                    inputVariant='outlined'
                    value={selectedEndTime}
                    onChange={handleEndTimeChange}
                    // helperText={helperTextMsg}

                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item md={1} sm={1}>
                <img src={LineAtt} className='im' style={{ marginTop: '-60px' }} />
              </Grid>
              <Grid item md={1} sm={2}>
                <FormControlLabel
                  style={{ marginLeft: '-110%', marginTop: '-35%' }}
                  value='top'
                  control={<Checkbox onChange={is_first_half} />}
                  label='1st Half'
                  labelPlacement='top'
                  // oncheck={}g351
                />
              </Grid>
              <Grid item md={1} sm={2}>
                <FormControlLabel
                  style={{ marginLeft: '-125%', marginTop: '-35%' }}
                  value='top'
                  control={<Checkbox onChange={is_second_half} />}
                  label='2nd Half'
                  labelPlacement='top'
                  // oncheck={}
                />
              </Grid>
            </Grid>
            <Grid container direction='row'>
              <Grid item md={12} xs={12}>
                <Divider />
              </Grid>
            </Grid>
            <Grid container direction='row' className={classes.root}>
              <Grid item md={6} xs={12}>
                <TextField
                  id='outlined-multiline-static'
                  label='ADD Event Description'
                  labelwidth='170'
                  name='description'
                  fullWidth
                  onChange={handleChange}
                  multiline
                  rows={5}
                  variant='outlined'
                />
              </Grid>
            </Grid>
            <Grid container direction='row' className={classes.root}>
              {/* <Grid item md={1} lg={1} xs={12}> */}
              <div className={classes.button}>
                <Button variant='contained' onClick={onunHandleClearAll}>
                  Clear All
                </Button>
                {/* </Grid> */}
                {/* <Grid item md={2} lg={1} xs={12}> */}
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleBackButtonClick}
                  style={{ marginLeft: '5%' }}
                >
                  Go Back
                </Button>
                {/* </Grid> */}
                {/* <Grid item md={1} lg={1} xs={12}> */}
                <Button
                  variant='contained'
                  type='submit'
                  value='Submit'
                  color='primary'
                  onClick={handleSubmit}
                >
                  SAVE EVENT
                </Button>
                {/* </Grid> */}
              </div>
            </Grid>
          </MediaQuery>
          <MediaQuery maxWidth={784}>
            <Grid container direction='row' spacing={2} className={classes.root}>
              <Grid item md={4} lg={2} sm={6} xs={12}>
                <Autocomplete
                  className='arrow'
                  size='small'
                  id='combo-box-demo'
                  name='event_category'
                  labelplaceholder='Event_Type'
                  onChange={handleEventTypeChange}
                  options={evnetcategoryType || ''}
                  getOptionLabel={(option) => option.event_category_name || ''}
                  renderInput={(params) => (
                    <TextField {...params} label='Event Type' variant='outlined' />
                  )}
                />
              </Grid>

              <Grid item md={4} lg={2} sm={6} xs={12}>
                <TextField
                  name='event_name'
                  variant='outlined'
                  size='small'
                  id='eventname'
                  label='Event Name'
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Grid container direction='row' className={classes.root}>
              <Grid item md={12} xs={12}>
                <Divider />
              </Grid>
            </Grid>
            <Grid container direction='row' spacing={2} className={classes.root}>
              <Grid item md={3} xs={12}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
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
                        `${endpoints.academics.grades}?session_year=${selectedAcademicYear.id}&branch_id=${selectedId}&module_id=${moduleId}`,
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
            </Grid>
            <Grid container direction='row'>
              <Grid item md={12} xs={12}>
                <Divider />
              </Grid>
            </Grid>
            <Grid container direction='row' spacing={2} className={classes.root}>
              <Grid item md={2} lg={3} sm={12} xs={12}>
                <div className='time-ranger-border'>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      size='small'
                      // variant='dialog'
                      format='YYYY-MM-DD'
                      margin='none'
                      // className='button'
                      id='date-picker'
                      label='StartDate'
                      minDate={new Date()}
                      name='start_date'
                      inputVariant='outlined'
                      className='arrow conte'
                      onChange={handleStartDateChange}
                      // handleStartDateChange={handleStartDateChange}
                      // handleEndDateChange={handleEndDateChange}

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
                      minDate={new Date()}
                      variant='standard'
                      name='end_date'
                      inputVariant='outlined'
                      className='arrow conte'
                      onChange={handleEndDateChange}
                      value={endDate}
                      style={{ background: 'white', width: '50%' }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </Grid>
            </Grid>
            <Grid container direction='row' className={classes.root}>
              <Grid item md={1} sm={3} className='responsesecond'>
                <FormControlLabel
                  value='top'
                  control={<Checkbox onChange={is_first_half} />}
                  label='1st Half'
                  labelPlacement='top'
                />
              </Grid>
              <Grid item md={1} sm={3} className='response '>
                <FormControlLabel
                  value='top'
                  control={<Checkbox onChange={is_second_half} />}
                  label='2nd Half'
                  labelPlacement='top'
                />
              </Grid>
              <Grid item md={2} lg={3} sm={12} xs={12}>
                <div className='time-ranger-border'>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardTimePicker
                      size='small'
                      style={{ width: '50%' }}
                      className='arrow conte'
                      id='time-picker'
                      label='Start Time'
                      inputVariant='outlined'
                      name='start_time'
                      value={selectedStartTime}
                      onChange={handleStartTimeChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change time',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardTimePicker
                      size='small'
                      // margin="normal"
                      style={{ width: '50%' }}
                      className='helperText'
                      className='arrow conte'
                      id='time-picker'
                      label='End Time'
                      name='end_time'
                      inputVariant='outlined'
                      value={selectedEndTime}
                      onChange={handleEndTimeChange}
                      // helperText={helperTextMsg}

                      KeyboardButtonProps={{
                        'aria-label': 'change time',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </Grid>
            </Grid>
            <Grid container direction='row' spacing={2} className={classes.root}></Grid>
            <Grid container direction='row'>
              <Grid item md={12} xs={12}>
                <Divider />
              </Grid>
            </Grid>
            <Grid container direction='row' className={classes.root}>
              {/* <div className={classes.button}> */}
              <Grid item md={6} xs={12}>
                <TextField
                  id='outlined-multiline-static'
                  label='ADD Event Description'
                  labelwidth='170'
                  name='description'
                  fullWidth
                  onChange={handleChange}
                  multiline
                  rows={5}
                  variant='outlined'
                />
              </Grid>
              <Grid item md={3} lg={2} xs={12}>
                <Button
                  variant='contained'
                  type='submit'
                  value='Submit'
                  size='large'
                  onClick={handleSubmit}
                  style={{ marginLeft: '25%', marginTop: '7%' }}
                >
                  SAVE EVENT
                </Button>
              </Grid>
              <Grid item md={3} lg={2} xs={12}>
                <Button
                  onClick={handleBackButtonClick}
                  style={{
                    marginLeft: '25%',
                    marginTop: '7%',
                    paddingLeft: '11%',
                    paddingRight: '11%',
                  }}
                  size='large'
                >
                  Go Back
                </Button>
              </Grid>
              {/* </div> */}
            </Grid>
          </MediaQuery>
        </form>
        {loading && <Loader />}
      </Layout>
    </>
  );
};

export default CreateEvent;
