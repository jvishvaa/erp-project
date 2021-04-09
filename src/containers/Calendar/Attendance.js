import React, { useContext, useState, useEffect } from 'react';
import { Autocomplete, Pagination } from '@material-ui/lab/';
import Layout from '../Layout';
import line from '../../assets/images/line.svg';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import ClearIcon from '../../components/icon/ClearIcon';
import Breadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import moment from 'moment';
import MobileDatepicker from './mobile-datepicker';
import './attendance.scss';
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
} from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MediaQuery from 'react-responsive';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 10,
    padding: '1rem',
    borderRadius: '10px',
    width: '100%',
    margin: '1.5rem -0.1rem',
  },

  bord: {
    margin: theme.spacing(1),
    border: 'solid lightgrey',
    borderRadius: 10,
    flexGrow: 1,
    margin: 10,
  },
  root1: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const Attendance = () => {
  const classes = useStyles();
  const [grade, setGrade] = useState();
  const [gradesGet, setGradesGet] = useState();
  const [branch, setBranch] = useState();
  const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'));

  useEffect(() => {
    axiosInstance.get(endpoints.academics.branches).then((res) => {
      console.log('res.data.data : ', res.data.data);
      setBranch(res.data.data);
    });
  }, []);

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
      borderRadius: '10px',
      // marginLeft: '20px',
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
  const handleDateChange = (event, value) => {
    setDateValue(value);
    console.log('date', value);
  };
  const handleBranch = (evt, value) => {
    console.log('gradevalue:', value);
    setGrade(value.id);
  };
  const [datePopperOpen, setDatePopperOpen] = useState(false);
  // const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  // const [endDate, setEndDate] = useState(getDaysAfter(moment(), 7));
  const [dateRange, setDateRange] = useState([
    moment().startOf('isoWeek'),
    moment().endOf('week'),
  ]);

  const dummyData = [
    {
      date: '12 December 2021',
    },
    {
      date: '13 December 2021',
    },
    {
      date: '14 December 2021',
    },
    {
      date: '15 December 2021',
    },
    {
      date: '16 December 2021',
    },
    {
      date: '17 December 2021',
    },
    {
      date: '18 December 2021',
    },
    {
      date: '19 December 2021',
    },
  ];

  return (
    <Layout>
      <Grid container direction='row'>
        <Grid item md={2} xs={12}>
          <Breadcrumbs componentName='Attendance' />
        </Grid>
      </Grid>

      <Grid container spacing={3} direction='row' className={classes.root}>
        <Grid item xs={12} sm={5} md={2} lg={2}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              className='mdb-date-picker .md-form label.active'
              size='small'
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              className='button'
              id='date-picker'
              label='Date'
              maxDate={new Date()}
              inputVariant='outlined'
              value={dateValue}
              // style={{ background: 'white' }}
              style={{ marginTop: 25 }}
              required
              fullWidth
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>

          {/* {
                <div className='mobile-date-picker'>
                  <MobileDatepicker
                    onChange={(date) => handleEndDateChange(date)}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                  />
                </div>
              } */}
        </Grid>
        <Grid item xs={12} sm={5} md={2} lg={2}>
          <Autocomplete
            size='small'
            id='role'
            style={{ width: '100%' }}
            style={{ marginTop: 25 }}
            options={[
              { id: 1, Year: '2021-2022' },
              { id: 2, Year: '2022-2023' },
            ]}
            name='Academic_year'
            className='arrow'
            getOptionLabel={(option) => option.Year}
            renderInput={(params) => (
              <TextField
                className='create__class-textfield'
                {...params}
                variant='outlined'
                label='Academic_Year'
                placeholder='Academic_Year'
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={5} md={2} lg={2}>
          <Autocomplete
            size='small'
            id='role'
            style={{ width: '100%' }}
            style={{ marginTop: 25 }}
            options={branch}
            name='branch_id'
            className='arrow'
            getOptionLabel={(option) => option.branch_name}
            renderInput={(params) => (
              <TextField
                className='create__class-textfield'
                {...params}
                variant='outlined'
                label='Branch'
                placeholder='Branch'
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={5} md={2} lg={2}>
          <Autocomplete
            size='small'
            id='grade'
            style={{ width: '100%' }}
            style={{ marginTop: 25 }}
            options={gradesGet}
            getOptionLabel={(option) => option.grade_name}
            name='grade'
            className='arrow'
            onChange={handleGrade}
            renderInput={(params) => (
              <TextField
                className='create__class-textfield'
                {...params}
                variant='outlined'
                label='Grade'
                placeholder='Grade'
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={5} md={2} lg={2}>
          <Autocomplete
            id='section'
            size='small'
            style={{ width: '100%' }}
            style={{ marginTop: 25 }}
            options={[
              { id: 1, name: 'A' },
              { id: 2, name: 'B' },
            ]}
            className='arrow'
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                className='create__class-textfield'
                {...params}
                variant='outlined'
                label='Section'
                placeholder='Section'
                required
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid
          container
          spacing={1}
          direction='row'
          justify='flex-start'
          align='flex-start'
        >
          <Grid item xs={6} sm={4} md={2} lg={2}>
            <StyledClearButton
              variant='contained'
              startIcon={<ClearIcon />}
              href={`/attendance`}
            >
              Clear all
            </StyledClearButton>
          </Grid>
          <Grid item xs={6} sm={3} md={2} lg={1}>
            <StyledFilterButton
              variant='contained'
              color='secondary'
              startIcon={<FilterFilledIcon />}
              // className={classes.filterButton}
              className={classes.root}
            >
              filter
            </StyledFilterButton>
          </Grid>
        </Grid>
      </Grid>
      <br />
      <br />

      <MediaQuery minWidth={541}>
        <Grid container direction='row'>
          {/* <Grid item md={1}></Grid> */}

          <Grid item sm={2} md={2}>
            <Typography variant='subtitle2' color='primary'>
              Sarathak Khanna
            </Typography>
          </Grid>
          <Grid item sm={1} md={1}>
            <img src={line} className={classes.lines} />
          </Grid>

          <Grid item sm={2} md={2}>
            <Typography variant='subtitle2' color='primary'>
              12 Dec 2021-19 Dec 2021{' '}
            </Typography>
          </Grid>
          <Grid item sm={1} md={1}>
            <img src={line} className={classes.lines} />
          </Grid>

          <Grid item sm={1} md={1}>
            <Typography variant='subtitle2'>
              <FormControlLabel control={<Checkbox color='primary' />} label='Present' />
            </Typography>
          </Grid>
          <Grid item sm={1} md={1}>
            <Typography>
              <FormControlLabel control={<Checkbox color='primary' />} label='Absent' />
            </Typography>
          </Grid>
          <Grid item sm={1} md={1}>
            <Typography>
              <FormControlLabel control={<Checkbox color='primary' />} label='1st Half' />
            </Typography>
          </Grid>
          <Grid item sm={1} md={1}>
            <Typography>
              <FormControlLabel control={<Checkbox color='primary' />} label='2nd Half' />
            </Typography>
          </Grid>
          <Grid item xs={8} sm={2} md={2} lg={2}>
            <Button>Download Excel</Button>
          </Grid>
        </Grid>
      </MediaQuery>
      <MediaQuery maxWidth={540}>
        <Grid container direction='row'>
          {/* <Grid item md={1}></Grid> */}

          <Grid item sm={1} md={3}>
            <Typography variant='subtitle2' color='primary'>
              Sarathak Khanna
            </Typography>
          </Grid>
          {/* <Grid item sm={1} md={1}>
                      <img src={line} className={classes.lines} />
                    </Grid> */}

          <Grid item sm={2} md={2}>
            <Typography variant='subtitle2' color='primary'>
              12 Dec 2021-19 Dec 2021{' '}
            </Typography>
          </Grid>
          {/* <Grid item sm={1} md={1}>
                      <img src={line} className={classes.lines} />
                    </Grid>
                    
                    <Grid item sm={1} md={1}>
                      <Typography variant='subtitle2'><FormControlLabel 
                              control={<Checkbox color="primary"/>}
                              label="Present"/></Typography>
                     
                    </Grid>
                    <Grid item sm={1} md={1}>
                    <Typography><FormControlLabel 
                              control={<Checkbox color="primary"/>}
                              
                              label="Absent"/></Typography>
                    </Grid>
                    <Grid item sm={1} md={1}>
                    <Typography><FormControlLabel 
                              control={<Checkbox color="primary"/>}
                              label="1st Half"/></Typography>
                    </Grid>
                    <Grid item sm={1} md={1}>
                    <Typography><FormControlLabel 
                              control={<Checkbox color="primary"/>}
                              label="2nd Half"/></Typography>
                    </Grid> */}
          {/* <Grid item xs={8} sm={2} md={2} lg={2}>
                    <Button style={{margin}} >
                        Download Excel
                    </Button>
                    </Grid> */}
        </Grid>
      </MediaQuery>
      <Grid container direction='row'>
        <Grid item xs={12} md={12}>
          <Divider />
        </Grid>
        <br />
      </Grid>

      <Grid container direction='row' spacing={2}>
        {dummyData.map((data) => {
          return (
            <Grid item xs={12} sm={6} md={2} lg={2}>
              <Card className={classes.bord}>
                <CardMedia className={classes.cover} />
                <div>
                  <CardContent style={{ marginLeft: 55 }}>
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
                        <h3>{data.date}</h3>
                        <Grid
                          item
                          xs={11}
                          sm={1}
                          md={1}
                          lg={2}
                          style={{ marginLeft: 15 }}
                        >
                          {/* <div className='triangle'>
                            <div className='shifts'>
                              <span className='shifts'>1st</span>
                              <br />
                              <br />
                              <br />
                              <span className='shifts'>2nd</span>
                            </div>
                          </div> */}

                          <p class='box'>
                            <span class='content1'>1st</span>
                            <span class='content'>2nd</span>
                          </p>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </div>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* <Grid container justify='center'>
        <Grid item md={8}>
          <Divider />
        </Grid> */}
      <br />

      {/* </Grid> */}
      <Grid container justify='center'>
        {' '}
        <Pagination count={3} color='primary' />
      </Grid>
    </Layout>
  );
};

export default Attendance;

// import React, {useEffect,useState } from 'react';
// import 'react-calendar/dist/Calendar.css';
// import Layout from 'containers/Layout';
// import { makeStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import Grid from '@material-ui/core/Grid';
// import axiosInstance from '../../../config/axios';
// import endpoints from '../../../config/endpoints';
// import AttendenceTable from './AttendenceTable';
// import './tablestudentattendance.scss';

// const Admin = () => {
// const [dateState, setDateState] = useState(new Date());
// const [spacing, setSpacing] = React.useState(2);
// const [getDatastudent,setGetDatastudent] = React.useState();
// const [getData,setGetData] = React.useState([]);
// const [flag,setFlag]=React.useState(false)
// const changeDate = (e) => {
// setDateState(e);
// };
// const useStyles = makeStyles((theme) => ({
// margin: theme.spacing(2),
// }));
// const classes = useStyles();
// React.useEffect(()=>{
// axiosInstance(endpoints.Calendar_attendance.Monthly_attendance).then((res)=>{
// console.log("response",res.data.result.students_list)
// setGetData(res.data.result.students_list)
// })

// },[])
// useEffect(()=>{
// axiosInstance(endpoints.Calendar_attendance.Student_calender).then((res)=>{
// console.log("response1",res.data.result.events)
// setGetDatastudent(res.data.result.events)
// })

// },[])
// const handleClick=(e)=>{
// e.preventDefault()
// console.log("open sheet")
// setFlag(true)

// }
// return (
// <>
//   <Layout>
//     {/* <Grid container direction="row" spacing={2} style={{ marginTop: '2%',marginLeft: '20px'}} > */}
//     <Grid container direction="row" spacing={2} className="Gview1" >
//       <Grid item md={2} xs={12}>
//         <Autocomplete
//           style={{width:250}}
//           id="combo-box-demo"
//           options={getDatastudent}
//           getOptionLabel={(option) => option.grade_id }
//           renderInput={(params) => <TextField {...params} label="Academic" variant="outlined" />}
//         />
//       </Grid>
//       <Grid item md={2} xs={12} >
//         <Autocomplete
//           style={{width:250}}
//           id="combo-box-demo"
//           options={getDatastudent}
//           getOptionLabel={(option) => option.name}
//           renderInput={(params) => <TextField {...params} label="Branch" variant="outlined" />}
//         />
//       </Grid>
//       <Grid item md={2} xs={12}>
//         <Autocomplete
//           fullWidth
//           style={{width:250}}
//           id="combo-box-demo"
//           options={getDatastudent}
//           getOptionLabel={(option) => option.name}
//           renderInput={(params) => <TextField {...params} label="Grade" variant="outlined" />}
//         />
//       </Grid>
//       <Grid item md={2} xs={12}>
//         <Autocomplete
//           fullWidth
//           style={{width:250}}
//           id="combo-box-demo"
//           options={getDatastudent}
//           getOptionLabel={(option) => option.name}
//           renderInput={(params) => <TextField {...params} label="Section" variant="outlined" />}
//         />
//       </Grid>
//     </Grid>
//     {/* <Grid container direction="row" spacing={2}style={{ marginTop: '20px',marginLeft: '10px'}} > */}
//     <Grid container direction="row" spacing={2} className="Gview2">
//       <AttendenceTable/>
//     </Grid>
//   </Layout>
// </>
// );
// };

// export default Admin;
