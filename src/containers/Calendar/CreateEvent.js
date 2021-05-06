import React, { useEffect, useState } from 'react';
import MediaQuery from 'react-responsive';
import Calendar from 'react-calendar';
import DatePicker from 'react-datepicker';
import MobileDatepicker from './mobile-datepicker';
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
function getDaysAfter(date, amount) {
  return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
}
function getDaysBefore(date, amount) {
  return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
}

const CreateEvent = () => {
  // const [dateState, setDateState] = useState(new Date());
  // const [spacing, setSpacing] = useState(2);
  // const [getDatastudent, setGetDatastudent] = useState();
  // const [getData, setGetData] = useState([]);
  // const [flag, setFlag] = useState(false);
  // const [open, setOpen] = useState(false);
  const [allday, setAllDay] = useState(true);
  const [firsthalf, setFirstHalf] = useState(false);
  const [secondhalf, setSecondHalf] = useState(false);
  const [isconfirm, setIsConfirm] = useState(false);
  const [valuetime, onChange] = useState('10:00');
  const [state, setState] = useState();
  const [time, setTime] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [branches, setBranches] = useState();
  const [sections, setSections] = useState();
  const [grades, setGrades] = useState();
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(getDaysAfter(moment(), 6));
  const [evnetcategoryType, setEventcategoryType] = useState();
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [gradeID, setGradeID] = useState();
  const [sectionID, setSectionID] = useState();
  const [branchID, setBranchID] = useState();

  const handleGrade = (e, value) => {
    if (value) {
      e.preventDefault();
      console.log('ID', value.id);
      setGradeID(value.id);
    } else {
      setGradeID('');
    }
  };
  const handleBranch = (e, value) => {
    if (value) {
      e.preventDefault();
      console.log('ID', value.id);
      setBranchID(value.id);
    } else {
      setBranchID('');
    }
  };

  const handleSection = (e, value) => {
    if (value) {
      e.preventDefault();
      console.log('ID', value.id);
      setSectionID(value.id);
    } else {
      setSectionID('');
    }
  };

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
  }));

  const handleStartDateChange = (date) => {
    console.log('startdate:', date.toISOString().split('T')[0]);
    const endDate = getDaysAfter(date.clone(), 6);
    setEndDate(endDate);
    setStartDate(date.toISOString().split('T')[0]);
    // getTeacherHomeworkDetails(2, date, endDate);
  };
  const returnFunction = (time) => {
    console.log('timeeeee:', time);
  };

  const handleEndDateChange = (date) => {
    console.log('dateeee:', date);
    console.log('convert', date._d.toISOString());
    // console.log("split:",new Date(date._d).toISOString().split('T'))
    const startDate = getDaysBefore(date.clone(), 6);
    setStartDate(startDate);
    setEndDate(date.format('YYYY-MM-DD'));
    // getTeacherHomeworkDetails(2, startDate, date);
  };
  const [value, setValue] = useState();

  const handleChange = (event) => {
    setValue(event.target.value);
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
    axiosInstance
      .post(endpoints.CreateEvent.CreateEvent, {
        event_name: state.event_name,
        description: state.description,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        grade: gradeID,
        // section:sectionID,

        branch: branchID,
      })
      .then((res) => {
        console.log('data posted');
      })
      .catch((error) => {
        console.log(error);
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

  useEffect(() => {
    axiosInstance.get(endpoints.masterManagement.grades).then((res) => {
      console.log('grades', res.data.result?.results);
      setGrades(res.data.result?.results);
    });
    axiosInstance.get(endpoints.academics.branches).then((res) => {
      console.log('Branches:', res.data.data);
      setBranches(res.data.data);
    });

    axiosInstance.get(endpoints.academics.sections).then((res) => {
      console.log('section', res.data?.data);
      setSections(res);
    });
    console.log('iuhiuhi');
    axiosInstance.get(endpoints.CreateEvent.getEventCategory).then((res) => {
      console.log('iuhiuhi');
      console.log('eventcateory:-', res.data);
      setEventcategoryType(res.data);
    });
    console.log('iuhiuhisfsdfdsfsafsdfsdfdf');
  }, []);

  const handleEventTypeChange = (e, value) => {
    if (value) {
      e.preventDefault();
      console.log('eventttttype:', value.id);
    } else {
    }
  };

  return (
    <>
      <Layout>
        <form>
          <MediaQuery minWidth={785}>
            <Grid container direction='row'>
              <Grid item md={4} lg={2} sm={6} xs={12}>
                <Breadcrumbs componentName='CreateEvent' />
              </Grid>
            </Grid>
            <Grid container direction='row' spacing={2} className={classes.root}>
              <Grid item md={4} lg={2} sm={6} xs={12}>
                <Autocomplete
                  className='arrow'
                  size='small'
                  id='combo-box-demo'
                  labelplaceholder='Event Type'
                  // onChange={handleEventTypeChange}
                  options={evnetcategoryType}
                  getOptionLabel={(option) => option.event_category_type}
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
              <Grid item md={4} lg={2} sm={4} xs={12}>
                <Autocomplete
                  size='small'
                  className='arrow'
                  id='combo-box-demo'
                  name='branch'
                  onChange={handleBranch}
                  options={branches}
                  getOptionLabel={(option) => option.branch_name}
                  renderInput={(params) => (
                    <TextField {...params} label='Branch' variant='outlined' />
                  )}
                />
              </Grid>
              <Grid item md={4} lg={2} sm={4} xs={12}>
                <Autocomplete
                  size='small'
                  id='combo-box-demo'
                  className='arrow'
                  name='grade'
                  options={grades}
                  onChange={handleGrade}
                  getOptionLabel={(option) => option.grade_name}
                  renderInput={(params) => (
                    <TextField {...params} label='Grade' variant='outlined' />
                  )}
                />
              </Grid>
              <Grid item md={4} lg={2} sm={4} xs={12}>
                <Autocomplete
                  id='combo-box-demo'
                  size='small'
                  className='arrow'
                  options={grades}
                  onChange={handleSection}
                  getOptionLabel={(option) => option.grade_name}
                  renderInput={(params) => (
                    <TextField {...params} label='Section' variant='outlined' />
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
              <Grid item md={4} lg={3} sm={5} xs={10}>
                <MobileDatepicker
                  onChange={(date) => handleEndDateChange(date)}
                  handleStartDateChange={handleStartDateChange}
                  handleEndDateChange={handleEndDateChange}
                />
              </Grid>
              <Grid item md={1} sm={1}>
                <img src={LineAtt} />
              </Grid>
              <Grid item lg={1} md={1} sm={1}>
                <FormControlLabel
                  control={<Checkbox onChange={handleChange} />}
                  label='All Day'
                  variant='outlined'
                  labelPlacement='top'
                  // oncheck={}
                />
              </Grid>
            </Grid>
            <Grid container direction='row' spacing={2} className={classes.root}>
              <Grid item md={2} lg={3} sm={5} xs={10}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardTimePicker
                    size='small'
                    // margin="normal"

                    style={{ width: '30%' }}
                    className='helperText'
                    id='time-picker'
                    label='Start Time'
                    name='start_time'
                    value={selectedStartTime}
                    onChange={handleStartTimeChange}
                    // helperText={helperTextMsg}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardTimePicker
                    size='small'
                    // margin="normal"
                    style={{ width: '30%' }}
                    className='helperText'
                    id='time-picker'
                    label='End Time'
                    name='end_time'
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
                <img src={LineAtt} />
              </Grid>
              <Grid item md={1} sm={2}>
                <FormControlLabel
                  value='top'
                  control={<Checkbox onChange={handleChange} />}
                  label='1st Half'
                  labelPlacement='top'
                  // oncheck={}g351
                />
              </Grid>
              <Grid item md={1} sm={2}>
                <FormControlLabel
                  value='top'
                  control={<Checkbox onChange={handleChange} />}
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
              <Grid item md={3} lg={2} xs={12}>
                <Button variant='contained'>CLEAR ALL</Button>
              </Grid>
              <Grid item md={3} lg={2} xs={12}>
                <Button
                  variant='contained'
                  type='submit'
                  value='Submit'
                  color='primary'
                  onClick={handleSubmit}
                >
                  SAVE EVENT
                </Button>
              </Grid>
            </Grid>
          </MediaQuery>
          <MediaQuery maxWidth={784}>
            <Grid container direction='row'>
              <Grid item md={4} lg={2} sm={6} xs={12}>
                <Breadcrumbs componentName='CreateEvent' />
              </Grid>
            </Grid>
            <Grid container direction='row' spacing={2} className={classes.root}>
              <Grid item md={4} lg={2} sm={6} xs={12}>
                <Autocomplete
                  className='arrow'
                  size='small'
                  id='combo-box-demo'
                  labelplaceholder='Event Type'
                  onChange={handleChange}
                  options={branches}
                  getOptionLabel={(option) => option.branch.branch_name}
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
                  labelplaceholder='Event Type'
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
              <Grid item md={4} lg={2} sm={4} xs={12}>
                <Autocomplete
                  size='small'
                  className='arrow'
                  id='combo-box-demo'
                  name='branch'
                  onChange={handleChange}
                  options={branches}
                  getOptionLabel={(option) => option.branch.branch_name}
                  renderInput={(params) => (
                    <TextField {...params} label='Branch' variant='outlined' />
                  )}
                />
              </Grid>
              <Grid item md={4} lg={2} sm={4} xs={12}>
                <Autocomplete
                  size='small'
                  id='combo-box-demo'
                  className='arrow'
                  name='grade'
                  options={grades}
                  onChange={handleChange}
                  getOptionLabel={(option) => option.grade_name}
                  renderInput={(params) => (
                    <TextField {...params} label='Grade' variant='outlined' />
                  )}
                />
              </Grid>
              <Grid item md={4} lg={2} sm={4} xs={12}>
                <Autocomplete
                  id='combo-box-demo'
                  size='small'
                  className='arrow'
                  options={grades}
                  onChange={handleChange}
                  getOptionLabel={(option) => option.grade_name}
                  renderInput={(params) => (
                    <TextField {...params} label='Section' variant='outlined' />
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
              <Grid item md={4} lg={3} sm={10} xs={11}>
                <MobileDatepicker
                  onChange={(date) => handleEndDateChange(date)}
                  handleStartDateChange={handleStartDateChange}
                  handleEndDateChange={handleEndDateChange}
                />
              </Grid>
            </Grid>
            <Grid
              container
              direction='row'
              // spacing={1}
              // justify='flex-start'
              // alignItems='flex-start'
            >
              <Grid item md={1} sm={3}>
                <FormControlLabel
                  value='top'
                  control={<Checkbox onChange={handleChange} />}
                  label='1st Half'
                  labelPlacement='top'
                />
              </Grid>
              <Grid item md={1} sm={3}>
                <FormControlLabel
                  value='top'
                  control={<Checkbox onChange={handleChange} />}
                  label='2nd Half'
                  labelPlacement='top'
                />
              </Grid>
            </Grid>
            <Grid container direction='row' spacing={2} className={classes.root}>
              <Grid item md={3} lg={2} xs={12}>
                <Button
                  variant='contained'
                  type='submit'
                  value='Submit'
                  color='primary'
                  onClick={handleSubmit}
                >
                  SAVE EVENT
                </Button>
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
                  fullWidth
                  name='description'
                  onChange={handleChange}
                  multiline
                  rows={5}
                  variant='outlined'
                />
              </Grid>
            </Grid>
          </MediaQuery>
        </form>
      </Layout>
    </>
  );
};

export default CreateEvent;
