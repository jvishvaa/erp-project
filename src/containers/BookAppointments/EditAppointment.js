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
  inputLabel: {
    marginLeft: 20,
    width: '70%',
  },
  margin: {
    margin: 40,
  },
  formControl: {
    marginTop: 24,
    width: '100%',
  },
}));

const EditAppointment = ({
  id,
  role,
  date,
  time,
  booking_mode,
  message,
  handleGoBack,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);

  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [data, setData] = useState([]);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [roles, setRole] = useState([]);
  const [rolename, setRolename] = useState('');
  const [editdata, setEditData] = useState();

  useEffect(() => {
    axiosInstance.get(endpoints.communication.roles).then((response) => {
      console.log(response.data.result);

      setRole(response.data.result);
    });
  }, []);

  const handleRole = (evt, value) => {
    console.log('handelrole', value.id);
    setRolename(value.id);
  };

  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  const handleChange = (e) => {
    console.log('event::', e.target.value);
    setEditData({ ...editdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // setLoading(true);

    console.log('editeddata', editdata);
    console.log('id', id);
    axiosInstance
      .put(`academic/${id}/${endpoints.Appointments.updateAppointment}`, {
        message: editdata.message,
        appointment_time: editdata.appointment_time,
        appointment_date: editdata.appointment_date,
        booking_mode: editdata.booking_mode,
        role: editdata.role,
      })

      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.root}>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={5} md={3}>
            {/* <FormControl variant='outlined' className={classes.formControl} size='small'>
              <Autocomplete
                size='small'
                onChange={handleRole}
                id='role'
                style={{ width: '100%' }}
                options={roles}
                initialValue={editdata.role?.id}
                getOptionLabel={(option) => option?.role_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Appointment with'
                    placeholder='role'
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )}
              />
            </FormControl> */}

            <FormControl variant='outlined' className={classes.formControl} size='small'>
              <InputLabel id='demo-simple-select-outlined-label'>
                Appointment With
              </InputLabel>
              <Select
                labelId='demo-simple-select-outlined-label'
                id='demo-simple-select-outlined'
                name='role'
                onChange={handleChange}
                labelWidth={170}
                defaultValue={role?.id}
              >
                {roles &&
                  roles.map((role) => {
                    return (
                      <MenuItem value={role.id} key={role.id}>
                        {role.role_name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={2}>
            <TextField
              name='appointment_date'
              label='Appointment Date'
              InputLabelProps={{ shrink: true, required: true }}
              type='date'
              variant='outlined'
              fullWidth
              size='small'
              // onChange={handleDateChange}
              onChange={handleChange}
              style={{ marginTop: 25 }}
              defaultValue={date}
            />
          </Grid>

          <Grid item xs={12} sm={5} md={3} lg={2}>
            <TextField
              name='appointment_time'
              label='Appointment Time'
              InputLabelProps={{ shrink: true, required: true }}
              type='time'
              format='12'
              variant='outlined'
              size='small'
              fullWidth
              onChange={handleChange}
              style={{ marginTop: 25 }}
              defaultValue={time}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={5} md={3}>
            <FormControl variant='outlined' className={classes.formControl} size='small'>
              <InputLabel id='demo-simple-select-outlined-label'>
                Appointment medium
              </InputLabel>
              <Select
                labelId='demo-simple-select-outlined-label'
                id='demo-simple-select-outlined'
                name='booking_mode'
                onChange={handleChange}
                labelWidth={170}
                defaultValue={booking_mode}
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
          className={classes.inputLabel}
          variant='outlined'
          onChange={handleChange}
        >
          <InputLabel htmlFor='outlined-adornment-amount'>
            Reason for Appointment
          </InputLabel>
          <OutlinedInput
            id='outlined-adornment-amount'
            onChange={handleChange}
            fullWidth
            labelWidth={200}
            name='message'
            style={{ height: 100 }}
            defaultValue={message}
          />
        </FormControl>
      </Grid>
      {/*  */}

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

export default EditAppointment;
