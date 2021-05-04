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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(15);
  const [data, setData] = useState([]);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [roles, setRole] = useState([]);
  const [rolename, setRolename] = useState('');
  const [appointmentStatus, setAppointmentstatus] = useState(1);
  const history = useHistory();

  console.log('userbranch:', localStorage.getItem('userDetails'));
  useEffect(() => {
    axiosInstance.get(`${endpoints.communicationRoles.roles}`).then((res) => {
      console.log(res, 'checking data');
      setRole(res.data.data);
    });
  }, []);

  const handleRole = (evt, value) => {
    console.log(value?.id);
    setRolename(value?.id);
  };

  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  const handleDateChange = (date) => {
    console.log('date', date.target.value);
    // setSelectedDate(date);
  };

  const handleChange = (e) => {
    console.log('event:', e.target.value);
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // setLoading(true);
    console.log('subarao');
    console.log('data', data);
    axiosInstance
      .post(
        endpoints.Appointments.bookAppointment,

        {
          role: rolename,
          booking_mode: data.booking_mode,

          appointment_date: data.appointment_date,
          appointment_time: data.appointment_time,
          message: data.message,
          branch: JSON.parse(localStorage.getItem('userDetails')).role_details.branch[0],
        }
      )

      .then((result) => {
        if (result.data.status_code === 200) {
          // setLoading(false);
          setAlert('success', result.data.message);
          // history.push({
          //   pathname: '/appointments',
          // });
          handleGoBack();
        } else {
          // setLoading(false);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        // setLoading(false);
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
                    // required
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={2}>
            <TextField
              name='appointment_date'
              label='Appointment Date'
              InputLabelProps={{ shrink: true, required: true }}
              type='date'
              variant='outlined'
              required
              fullWidth
              // className='button'
              className='dropdownIcon'
              size='small'
              onChange={handleChange}
              style={{ marginTop: 25 }}

              // defaultValue={values.someDate}
            />
            {/* <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                size='small'
                variant='dialog'
                format='YYYY-MM-DD'
                margin='none'
                className='button'
                id='date-picker'
                label='Appointment Date'
                maxDate={new Date()}
                inputVariant='outlined'
                fullWidth
                value={dateValue}
                onChange={handleDateChange}
                // className='dropdown'
                style={{ width: '100%', marginTop: '9%' }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider> */}
          </Grid>

          <Grid item xs={12} sm={5} md={3} lg={2}>
            <TextField
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
            />
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
        >
          <InputLabel htmlFor='outlined-adornment-amount'>
            Reason for Appointment
          </InputLabel>
          <OutlinedInput
            id='outlined-adornment-amount'
            // value={values.amount}
            // onChange={handleChange('amount')}
            fullWidth
            labelWidth={200}
            name='message'
            style={{ height: 100 }}
          />
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
            className='custom_button_master labelColor'
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
            style={{ color: 'white' }}
            color='primary'
            className='custom_button_master'
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
