import React, { useContext, useState, useEffect } from 'react';
import {
  makeStyles,
  Divider,
  TextField,
  Grid,
  Avatar,
  Checkbox,
  Button,
  FormControlLabel,
  Card,
  CardContent,
  CardMedia,
  Typography,
  withStyles,
} from '@material-ui/core';
import Breadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { Autocomplete, Pagination } from '@material-ui/lab';
import Layout from '../Layout';
import line from '../../assets/images/line.svg';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import ClearIcon from '../../components/icon/ClearIcon';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MediaQuery from 'react-responsive';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import './overallattendance.scss';

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
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const Attend = () => {
  const classes = useStyles();
  const [grade, setGrade] = useState();
  const [gradesGet, setGradesGet] = useState();
  const [branch, setBranch] = useState();
  const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'));

  useEffect(() => {
    axiosInstance.get(endpoints.masterManagement.gradesDrop).then((res) => {
      console.log('res', res.data.data);
      setGradesGet(res.data.data);
    });
  }, []);
  useEffect(() => {
    axiosInstance.get(endpoints.academics.branches).then((res) => {
      console.log('res.data.data : ', res.data.data);
      setBranch(res.data.data);
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
  const dummyData = [
    {
      name: 'Akash',
      rollno: '11',
      ERPno: '123456789',
    },
    {
      name: 'Sharma',
      rollno: '12',
      ERPno: '123456789',
    },
    {
      name: 'Akash',
      rollno: '13',
      ERPno: '123456789',
    },
    {
      name: 'Sharma',
      rollno: '14',
      ERPno: '123456789',
    },
    {
      name: 'Akash',
      rollno: '15',
      ERPno: '123456789',
    },
    {
      name: 'Sharma',
      rollno: '16',
      ERPno: '123456789',
    },
    {
      name: 'Akash',
      rollno: '17',
      ERPno: '123456789',
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
              size='small'
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              id='date-picker'
              label='Date'
              className='button'
              maxDate={new Date()}
              inputVariant='outlined'
              value={dateValue}
              style={{ background: 'white' }}
              style={{ marginTop: 25 }}
              fullWidth
              required
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12} sm={5} md={2} lg={2}>
          <Autocomplete
            size='small'
            id='role'
            style={{ width: '100%' }}
            style={{ marginTop: 25 }}
            // options={branch}
            // onChange={handleBranch}
            name='Academic_year'
            className='arrow'
            // getOptionLabel={(option) => option.branch_name}
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
            className='arrow'
            name='branch_id'
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
            id='role'
            style={{ width: '100%' }}
            style={{ marginTop: 25 }}
            options={gradesGet}
            className='arrow'
            getOptionLabel={(option) => option.grade_name}
            name='grade'
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
            size='small'
            id='role'
            style={{ width: '100%' }}
            style={{ marginTop: 25 }}
            className='arrow'
            options={[
              { id: 1, name: 'A' },
              { id: 2, name: 'B' },
              { id: 3, name: 'C' },
            ]}
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
              href={`/markattedance`}
            >
              Clear all
            </StyledClearButton>
          </Grid>
          <Grid item xs={6} sm={3} md={2} lg={1}>
            <StyledFilterButton
              variant='contained'
              color='secondary'
              startIcon={<FilterFilledIcon />}
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
            <Typography color='primary'>12 Dec 2021-19 Dec 2021 </Typography>
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
            <Typography variant='subtitle2' color='secondary'>
              Number of students:33
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

          <Grid item xs={10} sm={4} md={2}>
            <Typography color='primary' variant='subtitle1'>
              12 Dec 2021-19 Dec 2021{' '}
            </Typography>
          </Grid>
          {/* </Grid>
                    <Grid item sm={1} md={1}>
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
                    </Grid>
                    <Grid item xs={8} sm={2} md={2} lg={2}><Typography variant='subtitle2' color="secondary" >Number of students:33</Typography></Grid> */}
          {/* <Grid item xs={8} sm={2} md={2} lg={2}>
                    <Button  >
                        Download Excel
                    </Button>
                    </Grid>    */}
        </Grid>
      </MediaQuery>
      <Grid container direction='row'>
        <Grid item xs={12} md={12}>
          <Divider />
        </Grid>
        <br />
      </Grid>
      <Grid container spacing={2} direction='row'>
        {dummyData.map((data) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card className={classes.bord}>
                <CardMedia className={classes.cover} />
                <div>
                  <CardContent>
                    <Grid container direction='row'>
                      <Grid item xs={1} sm={1} md={1} lg={1} style={{ marginTop: 15 }}>
                        <Avatar>Ak</Avatar>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        style={{ marginLeft: 30, textAlign: 'start' }}
                      >
                        <Typography>{data.name}</Typography>
                        <Typography>{data.rollno}</Typography>
                        <Typography>{data.ERPno}</Typography>
                      </Grid>
                      {/* <Grid item xs={2} sm={1} md={1} lg={1} style={{ marginTop: 12 }}>
                        <div className='triangle'>
                          <span className='corner span'>2nd</span>
                        </div>
                      </Grid> */}

                      <p class='box'>
                        <span class='content1'>1st</span>
                        <span class='content'>2nd</span>
                      </p>
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

export default Attend;

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
