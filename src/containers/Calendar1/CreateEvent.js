import React, { useEffect, useState } from 'react';

import Calendar from 'react-calendar';
import MobileDatepicker from './mobile-datepicker';
import { DateRangePicker } from 'materialui-daterange-picker';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import Layout from 'containers/Layout';
import Divider from '@material-ui/core/Divider';
import sameera from '../Calendar1/Attend';
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
  const [state, setState] = useState();
  const [branches, setBranches] = useState();
  const [grades, setGrades] = useState();
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(getDaysAfter(moment(), 6));

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: '1rem',
      borderRadius: '10px',
      width: '100%',

      margin: '1.5rem -0.1rem',
    },
  }));

  const handleStartDateChange = (date) => {
    const endDate = getDaysAfter(date.clone(), 6);
    setEndDate(endDate);
    setStartDate(date.format('YYYY-MM-DD'));
    // getTeacherHomeworkDetails(2, date, endDate);
  };

  const handleEndDateChange = (date) => {
    const startDate = getDaysBefore(date.clone(), 6);
    setStartDate(startDate);
    setEndDate(date.format('YYYY-MM-DD'));
    // getTeacherHomeworkDetails(2, startDate, date);
  };
  const handleChange = (event) => {
    console.log(event.target.value);
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('state', state);
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
    axiosInstance.get(endpoints.academics.branches).then((res) => {
      console.log('brnahces', res.data.data);
      setBranches(res.data.data);
    });

    axiosInstance.get(endpoints.masterManagement.grades).then((res) => {
      console.log('grades', res.data.result.results);
      setGrades(res.data.result.results);
    });
  }, []);

  return (
    <>
      <Layout>
        <form>
          <Grid container direction='row'>
            <Grid item md={2} xs={12}>
              <Breadcrumbs componentName='CreateEvent' />
            </Grid>
          </Grid>
          <Grid container direction='row' spacing={2} className={classes.root}>
            <Grid item md={2} xs={12}>
              <Autocomplete
                className='dropdown'
                size='small'
                id='combo-box-demo'
                labelplaceholder='Event Type'
                onChange={handleChange}
                options={branches}
                getOptionLabel={(option) => option.branch_name}
                renderInput={(params) => (
                  <TextField {...params} label='Event Type' variant='outlined' />
                )}
              />
            </Grid>

            <Grid item md={2} xs={12}>
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
          <Grid item md={12} xs={12}>
            <Divider />
          </Grid>
          <Grid container direction='row' spacing={2} className={classes.root}>
            <Grid item md={2} xs={12}>
              <Autocomplete
                size='small'
                className='dropdown'
                id='combo-box-demo'
                name='branch'
                onChange={handleChange}
                options={branches}
                getOptionLabel={(option) => option.branch_name}
                renderInput={(params) => (
                  <TextField {...params} label='Branch' variant='outlined' />
                )}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <Autocomplete
                size='small'
                id='combo-box-demo'
                className='dropdown'
                name='grade'
                options={grades}
                onChange={handleChange}
                getOptionLabel={(option) => option.grade_name}
                renderInput={(params) => (
                  <TextField {...params} label='Grade' variant='outlined' />
                )}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <Autocomplete
                id='combo-box-demo'
                size='small'
                className='dropdown'
                options={grades}
                onChange={handleChange}
                getOptionLabel={(option) => option.grade_name}
                renderInput={(params) => (
                  <TextField {...params} label='Section' variant='outlined' />
                )}
              />
            </Grid>
          </Grid>
          <Grid item md={12} xs={12}>
            <Divider />
          </Grid>
          <Grid container direction='row' spacing={2} className={classes.root}>
            <Grid item md={2} xs={12}>
              {
                <div className='mobile-date-picker'>
                  <MobileDatepicker
                    onChange={(date) => handleEndDateChange(date)}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                  />
                </div>
              }
            </Grid>
            <Grid item md={1} xs={12}>
              <FormControlLabel
                control={<Checkbox onChange={handleChange} />}
                label='All Day'
                variant='outlined'
                labelPlacement='top'
              />
            </Grid>
          </Grid>
          <Grid container direction='row' className={classes.root}>
            <Grid item md={2} xs={12}>
              {
                <div className='mobile-date-picker'>
                  <MobileDatepicker
                    onChange={(date) => handleEndDateChange(date)}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                  />
                </div>
              }
            </Grid>
            <Grid item md={1} xs={3}>
              <FormControlLabel
                value='top'
                control={<Checkbox />}
                label='1st Half'
                labelPlacement='top'
              />
            </Grid>
            <Grid item md={1} xs={3}>
              <FormControlLabel
                value='top'
                control={<Checkbox />}
                label='2nd Half'
                labelPlacement='top'
              />
            </Grid>
          </Grid>

          <Grid item md={12} xs={12}>
            <Divider />
          </Grid>

          <Grid container direction='row' className={classes.root}>
            <Grid item md={6} xs={12}>
              <TextField
                id='outlined-multiline-static'
                label='ADD Event Description'
                labelwidth='170'
                fullWidth
                onChange={handleChange}
                multiline
                rows={5}
                variant='outlined'
              />
            </Grid>
          </Grid>
          <Grid container direction='row' className={classes.root}>
            <Grid item md={2} xs={12}>
              <Button variant='contained'>Clear All</Button>
            </Grid>
            <Grid item md={2} xs={12}>
              <Button variant='contained' color='primary' onClick={handleSubmit}>
                Save Event
              </Button>
            </Grid>
          </Grid>
        </form>

        <sameera />
      </Layout>
    </>
  );
};

export default CreateEvent;
