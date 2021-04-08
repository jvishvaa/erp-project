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

import { Autocomplete, Pagination } from '@material-ui/lab';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import Group from '../../assets/images/Group.png';

import ClearIcon from '../../components/icon/ClearIcon';

import { deepOrange, deepPurple } from '@material-ui/core/colors';
import OutlinedFlagRoundedIcon from '@material-ui/icons/OutlinedFlagRounded';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
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
  const [grade, setGrade] = useState();
  const [gradesGet, setGradesGet] = useState();

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
  const [value, setValue] = React.useState([null, null]);

  return (
    <Layout>
      <CommonBreadcrumbs componentName='Attedance+Calender' />
      <Grid container direction='row' className={classes.root} spacing={3}>
        <Grid item md={2} xs={12}>
          <Autocomplete
            id='AcademicYear'
            size='small'
            className='arrow'
            options={[
              { id: 1, name: '2019' },
              { id: 2, name: '2020' },
            ]}
            getOptionLabel={(option) => option.name}
            style={{ background: 'white' }}
            renderInput={(params) => (
              <TextField {...params} label='AcademicYear' variant='outlined' required />
            )}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Autocomplete
            id='branch'
            size='small'
            className='arrow'
            options={[
              { id: 1, name: 'A' },
              { id: 2, name: 'B' },
            ]}
            getOptionLabel={(option) => option.name}
            style={{ background: 'white' }}
            renderInput={(params) => (
              <TextField {...params} label='Branch' variant='outlined' required />
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
            className='arrow'
            style={{ background: 'white' }}
            onChange={handleGrade}
            renderInput={(params) => (
              <TextField {...params} label='Grade' variant='outlined' required />
            )}
          />
        </Grid>

        <Grid item md={2} xs={12}>
          <Autocomplete
            id='section'
            size='small'
            className='arrow'
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
        <Grid item md={6}>
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
        <Grid item md={2}>
          <Paper elevation={3} className={classes.paperSize}>
            <Grid container direction='row' className={classes.root}>
              <Grid item md={6} xs={12}>
                <Typography variant='h6' color='primary'>
                  Attedance
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Button size='small'>
                  <span className={classes.contentData}>MarkAttendance</span>
                </Button>
              </Grid>
              <Grid item md={5}>
                <Typography className={classes.content}>Student</Typography>
              </Grid>
              <KeyboardArrowDownIcon />
            </Grid>

            <img src={Group} width='100%' height=' 504px' />
          </Paper>
        </Grid>
        <Grid item md={1}></Grid>
        <Grid item md={2}>
          <Paper elevation={3} className={[classes.root, classes.paperSize]}>
            <Grid container direction='row'>
              <Grid item md={6} xs={12}>
                <Typography variant='h6' color='primary'>
                  Event
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Button size='small' fullWidth>
                  ADD EVENT
                </Button>
              </Grid>
              <Grid item md={5}>
                <Typography className={classes.contentsmall}>Event Details</Typography>
              </Grid>
              <Grid item md={7}>
                <Typography className={classes.contentsmall}>
                  Updated:1 Day ago
                </Typography>
              </Grid>
            </Grid>

            <Paper elevation={1}>
              <Typography className={[classes.contentsmall, classes.root]}>
                12 December 2020
                <br />
                <Grid container direction='row'>
                  <OutlinedFlagRoundedIcon
                    style={{ background: '#78B5F3', borderRadius: '30px' }}
                  />
                  <Typography> Event Name</Typography>
                </Grid>
                <Grid container direction='row'>
                  <WatchLaterOutlinedIcon color='primary' className={classes.content} />
                  11:20AM
                  <EventOutlinedIcon color='primary' className={classes.content} />
                  11-01-2021
                </Grid>
                <Typography className={classes.contentData}>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                  eirmod tempor invidunt ut labore et dolore magna
                </Typography>
              </Typography>

              <Typography className={[classes.contentsmall, classes.root]}>
                12 December 2020
                <br />
                <Grid container direction='row'>
                  <OutlinedFlagRoundedIcon
                    style={{ background: '#78B5F3', borderRadius: '30px' }}
                  />
                  <Typography> Event Name</Typography>
                </Grid>
                <Grid container direction='row'>
                  <WatchLaterOutlinedIcon color='primary' className={classes.content} />
                  11:20AM
                  <EventOutlinedIcon color='primary' className={classes.content} />
                  11-01-2021
                </Grid>
                <Typography className={classes.contentData}>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                  eirmod tempor invidunt ut labore et dolore magna
                </Typography>
              </Typography>

              <Typography className={[classes.contentsmall, classes.root]}>
                12 December 2020
                <br />
                <Grid container direction='row'>
                  <OutlinedFlagRoundedIcon
                    style={{ background: '#78B5F3', borderRadius: '30px' }}
                  />
                  <Typography> Event Name</Typography>
                </Grid>
                <Grid container direction='row'>
                  <WatchLaterOutlinedIcon color='primary' className={classes.content} />
                  11:20AM
                  <EventOutlinedIcon color='primary' className={classes.content} />
                  11-01-2021
                </Grid>
                <Typography className={classes.contentData}>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                  eirmod tempor invidunt ut labore et dolore magna
                </Typography>
              </Typography>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AttedanceCalender;
