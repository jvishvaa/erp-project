import React, { useEffect, useState } from 'react';
import Layout from '../Layout/index';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import {
  Button,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Switch,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Autocomplete, Pagination } from '@material-ui/lab';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';

import ClearIcon from '../../components/icon/ClearIcon';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',
    borderRadius: '10px',
    width: '100%',

    margin: '1.5rem -0.1rem',
  },
  paperStyle: {
    margin: '10px',
  },
  title: {
    fontSize: '1.1rem',
  },
  avtarSize: {
    width: '34px',
    height: '34px',
  },
  content: {
    fontSize: '18px',
  },
  contentList: {
    fontSize: '15px',
  },
  contentsmall: {
    fontSize: '0.8rem',
  },
  textRight: {
    textAlign: 'right',
  },
  paperSize: {
    width: '255px',
    height: '185px',
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

const MarkAttedance = () => {
  const classes = useStyles();
  const [grade, setGrade] = useState();
  const [gradesGet, setGradesGet] = useState();
  const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'));

  useEffect(() => {
    axiosInstance.get(endpoints.masterManagement.gradesDrop).then((res) => {
      console.log('res', res.data.data);
      setGradesGet(res.data.data);
    });
  }, []);
  const StyledClearButton = withStyles({
    root: {
      backgroundColor: '#E2E2E2',
      color: '#8C8C8C',
      height: '42px',
      marginTop: 'auto',
    },
  })(Button);
  const handleGrade = (e, value) => {
    console.log('The value of grade', e.target.value);
    if (value) {
      console.log('grade:', value.id);
      setGrade(e.target.value);
    } else {
      setGrade('');
    }
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
  const handleDateChange = (event, value) => {
    setDateValue(value);
    console.log('date', value);
  };
  const dummyData = [
    { name: 'Sankalp Khanna' },
    { name: 'Hari Das' },
    { name: 'Mani Pal' },
    { name: 'Manish' },
    { name: 'Nagendra' },
  ];

  return (
    <Layout>
      <CommonBreadcrumbs componentName='MarkAttedance' />

      <Grid container direction='row' className={classes.root} spacing={3}>
        <Grid item md={12} xs={12}>
          <Typography>Today's attedance</Typography>
        </Grid>
        <Grid item md={2} xs={12}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              size='small'
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              id='date-picker'
              label='Date'
              maxDate={new Date()}
              inputVariant='outlined'
              value={dateValue}
              style={{ background: 'white' }}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid item md={2} xs={12}>
          <Autocomplete
            id='attedancetype'
            size='small'
            options={[
              { id: 1, name: 'Student' },
              { id: 2, name: 'Staff' },
            ]}
            getOptionLabel={(option) => option.name}
            style={{ background: 'white' }}
            renderInput={(params) => (
              <TextField {...params} label='Attedance Type' variant='outlined' required />
            )}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Autocomplete
            id='grade'
            size='small'
            options={gradesGet}
            getOptionLabel={(option) => option.grade_name}
            name='grade'
            style={{ background: 'white' }}
            onChange={handleGrade}
            renderInput={(params) => (
              <TextField {...params} label='grades' variant='outlined' required />
            )}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Autocomplete
            id='section'
            size='small'
            options={[
              { id: 1, name: 'A' },
              { id: 2, name: 'B' },
            ]}
            getOptionLabel={(option) => option.name}
            style={{ background: 'white' }}
            renderInput={(params) => (
              <TextField {...params} label='Section' variant='outlined' required />
            )}
          />
        </Grid>
        <Grid item md={11} xs={12}>
          <Divider />
        </Grid>
        <Grid container direction='row' className={classes.root}>
          <Grid>
            {' '}
            <StyledClearButton
              variant='contained'
              startIcon={<ClearIcon />}
              href={`/markattedance`}
            >
              Clear all
            </StyledClearButton>
          </Grid>
          <Grid>
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
      </Grid>

      <Grid
        container
        direction='row'
        className={classes.root}
        spacing={3}
        style={{ color: 'red', background: 'white' }}
      >
        <Grid>
          <ArrowBackIosIcon />
        </Grid>
        <Grid>
          <Typography variant='h5'>10 December 2020</Typography>
        </Grid>
        <Grid>
          <ArrowForwardIosIcon />
        </Grid>
        <Grid item md={6}></Grid>
        <Typography>Number of Students:33</Typography>
        <Grid item md={10}>
          <Divider />
        </Grid>

        <Grid container direction='row' className={classes.root} spacing={3}>
          {dummyData.map((options) => {
            return (
              <div value={options.id} key={options.id}>
                {' '}
                <Grid item md={2} xs={12} className={classes.root}>
                  <Paper elevation={3} className={classes.paperSize}>
                    <Grid container direction='row'>
                      {' '}
                      <Avatar className={[classes.orange, classes.paperStyle]}>
                        {options.name.slice(0, 1)}
                      </Avatar>
                      <Typography
                        className={[classes.content, classes.paperStyle]}
                        style={{ marginTop: '10%' }}
                      >
                        {options.name}
                      </Typography>
                      <Typography
                        className={classes.contentsmall}
                        style={{ marginLeft: '60%' }}
                      >
                        Mark Present
                      </Typography>
                    </Grid>
                    <Divider />
                    <Grid container direction='row'>
                      <Typography className={[classes.contentList, classes.paperStyle]}>
                        1stHalf
                      </Typography>

                      <Grid style={{ marginLeft: '40%' }}>
                        <Switch color='primary' />
                      </Grid>
                    </Grid>
                    <Divider />

                    <Grid container direction='row'>
                      <Typography className={[classes.contentList, classes.paperStyle]}>
                        2stHalf
                      </Typography>

                      <Grid style={{ marginLeft: '40%' }}>
                        <Switch color='primary' />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </div>
            );
          })}
        </Grid>

        <Grid item md={2} xs={12}></Grid>
        <Grid container justify='center'>
          {' '}
          <Pagination count={3} color='primary' />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default MarkAttedance;
