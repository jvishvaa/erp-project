import React, { useContext, useState, useEffect } from 'react';
import Layout from '../Layout';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import 'date-fns';
import { Grid, useTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Paper from '@material-ui/core/Paper';
import './Styles.scss';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
// import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
// import moment from 'moment';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 20,
  },
  cardsPagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: '1rem',
    backgroundColor: '#ffffff',
    zIndex: 100,
    color: '#ffffff',
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  cardsContainer: {
    width: '95%',
    margin: '0 auto',
  },
  tablePaginationCaption: {
    fontWeight: '600 !important',
  },

  margin: {
    margin: 40,
  },
  formControl: {
    marginTop: 24,
    width: '100%',
  },
}));

const BookAppointment = ({ setLoading, handleGoBack }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [date, setDate] = useState(new Date());
  const [dateValue, setDateValue] = useState(moment(date).format('YYYY-MM-DD'));
  const [timeChange, setTimeChange] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState(moment(date).format('YYYY-MM-DD'));
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(15);
  const [data, setData] = useState([]);
  const [startTime, setStartTime] = useState();
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [roles, setRole] = useState([]);
  const [rolename, setRolename] = useState('');
  const [appointmentStatus, setAppointmentstatus] = useState(1);
  const history = useHistory();
  const CHARACTER_LIMIT = 50;

  // console.log('userbranch:', localStorage.getItem('userDetails'));
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.communicationRoles.roles}`)
      .then((res) => {
        // console.log(res, 'checking data');
        setLoading(false);
        setRole(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        setAlert('error', err?.message);
      });
  }, []);

  const handleRole = (evt, value) => {
    // console.log(value?.id);
    setRolename(value?.id);
  };

  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };
  const handleDateChange = (event, value) => {
    // console.log('date', date.target.value);
    setDateValue(value);
  };

  // const handleTimeChange = (start_time) => {
  //   console.log('sameeraaaaaaaaaaa');
  //   // console.log('time', event.target.value);
  //   const time = start_time.toString().slice(16, 21);
  //   console.log(time, 'time ======>>');
  //   setTimeChange(time);
  //   console.log(timeChange, '===============>>>>>>>');
  // };
  const handleStartTimeChange = (start_time) => {
    console.log('time', start_time.toString().slice(16, 21));
    const time = start_time.toString().slice(16, 21);
    setSelectedStartTime(start_time);
    setStartTime(time);
    console.log(startTime, '===========>>>>');
  };

  // const handleTimeChange = (start_time) => {
  //   console.log('time', start_time.toString().slice(16, 21));
  //   const time = start_time.toString().slice(16, 21);
  //   setSelectedStartTime(start_time);
  //   setStartTime(time);
  // };

  const handleChange = (e) => {
    // console.log('event:', e.target.value);
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log('subarao');
    console.log('data', data);
    axiosInstance
      .post(
        endpoints.Appointments.bookAppointment,

        {
          role: rolename,
          booking_mode: data.booking_mode,

          appointment_date: dateValue,

          appointment_time: startTime,
          message: data.message,
          branch: JSON.parse(localStorage.getItem('userDetails')).role_details.branch[0],
        }
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setAlert('success', result.data.message);
          // history.push({
          //   pathname: '/appointments',
          // });
          handleGoBack();
        } else {
          setLoading(false);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.root}>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={5} md={3}>
            <FormControl variant='outlined' className={classes.formControl} size='small'>
              <Autocomplete
                size='small'
                onChange={handleRole}
                id='role'
                // className='arrow  '
                className='dropdownIcon'
                // value={selectedGrade}
                style={{ width: '100%' }}
                options={roles}
                getOptionLabel={(option) => option?.role_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Appointment with'
                    placeholder='role'
                    required
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={2}>
            {/* <TextField
              name='appointment_date'
              label='Appointment Date'
              InputLabelProps={{ shrink: true, required: true }}
              type='date'
              minDate={new Date()}
              variant='outlined'
              required
              fullWidth
              // className='button'
              className='dropdownIcon'
              size='small'
              onChange={handleChange}
              style={{ marginTop: 25 }}

              // defaultValue={values.someDate}
            /> */}
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                size='small'
                variant='dialog'
                format='YYYY-MM-DD'
                margin='none'
                // className='button'
                id='date-picker'
                label='Appointment Date'
                minDate={new Date()}
                inputVariant='outlined'
                fullWidth
                className='dropdownIcon'
                value={dateValue}
                onChange={handleDateChange}
                style={{ width: '100%', marginTop: '9%' }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={12} sm={5} md={3} lg={2}>
            {/* <TextField
              name='appointment_time'
              label='Appointment Time'
              required
              InputLabelProps={{ shrink: true, required: true }}
              type='time'
              // className='button'
              className='dropdownIcon'
              variant='outlined'
              size='small'
              fullWidth
              onChange={handleChange}
              style={{ marginTop: 25 }}
            /> */}
            {/* <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardTimePicker
                size='small'
                variant='dialog'
                margin='none'
                id='time-picker'
                name='start_time'
                className='button'
                label='Appointment Time'
                value={timeChange}
                inputVariant='outlined'
                fullWidth
                onChange={handleTimeChange}
                style={{ width: '100%', marginTop: '9%' }}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </MuiPickersUtilsProvider> */}
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardTimePicker
                size='small'
                // style={{ width: '50%', marginTop: '-5%' }}
                // className='arrow conte'
                className='dropdownIcon'
                variant='dialog'
                id='time-picker'
                label='Appointment Time'
                inputVariant='outlined'
                name='start_time'
                value={selectedStartTime}
                onChange={handleStartTimeChange}
                style={{ width: '100%', marginTop: '9%' }}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={5} md={3}>
            <FormControl
              variant='outlined'
              style={{ marginTop: 24, width: '100%' }}
              size='small'
              className='dropdownIcon'
            >
              <InputLabel id='demo-simple-select-outlined-label'>
                Appointment medium
              </InputLabel>
              <Select
                labelId='demo-simple-select-outlined-label'
                id='demo-simple-select-outlined'
                name='booking_mode'
                style={{ marginTop: '0px' }}
                onChange={handleChange}
                labelWidth={170}
                // className='arrow'
              >
                <MenuItem value={1}>Zoom Meeting</MenuItem>
                <MenuItem value={2}>Telephonic</MenuItem>
                <MenuItem value={3}>Visit</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <Grid item xs={12} md={6} sm={12} style={{ margin: 20 }}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={10} sm={12}>
        <FormControl
          style={{ marginLeft: 20, width: '70%' }}
          variant='outlined'
          className='dropdownIcon'
          onChange={handleChange}
          required
        >
          <InputLabel htmlFor='outlined-textarea' required>
            Reason for Appointment
          </InputLabel>
          <OutlinedInput
            id='outlined-textarea'
            // value={values.amount}
            // onChange={handleChange('amount')}
            fullWidth
            placeholder='Allowed upto 50 Charecters '
            helperText='Allowed 50 Charecters only'
            labelWidth={200}
            name='message'
            multiline
            required
            style={{ height: 100 }}
            inputProps={{
              maxlength: CHARACTER_LIMIT,
            }}
          />
          {/* <TextField
            id='outlined-textarea'
            label=' Reason for Appointment'
            placeholder='Allowed 20 Charecters only'
            multiline
            margin='normal'
            onChange={handleChange}
            fullWidth
            labelWidth={100}
            name='message'
            style={{ height: 100 }}
            // defaultValue={message}
            variant='outlined'
            inputProps={{
              maxlength: CHARACTER_LIMIT,
            }}
          /> */}
        </FormControl>
      </Grid>
      <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '10px' }}>
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          className={isMobile ? '' : 'addEditButtonsPadding'}
        >
          <Button
            variant='contained'
            style={{ width: '100%' }}
            className='cancelButton labelColor'
            size='medium'
            onClick={handleGoBack}
          >
            Back
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={5}
          md={4}
          lg={3}
          className={isMobile ? '' : 'addEditButtonsPadding'}
        >
          <Button
            variant='contained'
            style={{color:'white', width: '100%' }}
            color='primary'
            size='medium'
            type='submit'
          >
            Book Appointment
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
export default BookAppointment;
