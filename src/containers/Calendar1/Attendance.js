import React, { useContext, useState, useEffect } from 'react';
import { Autocomplete,Pagination } from '@material-ui/lab/';
import Layout from '../Layout';
import line from '../../assets/images/line.svg';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import ClearIcon from '../../components/icon/ClearIcon';
import moment from 'moment';
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


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      margin: 10,
    },
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
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

const Attendance = () =>{
    const classes = useStyles();
    const [grade, setGrade] = useState();
    const [gradesGet, setGradesGet] = useState();
    const [branch,setBranch]=useState();
    const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'));
    useEffect(() => {
      axiosInstance.get(endpoints.academics.branches).then((res) => {
        console.log("res.data.data : ", res.data.data)
        setBranch(res.data.data)
      })
  
  
    }, [])
    
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
    const handleBranch = (evt, value) => {
      console.log("gradevalue:", value)
      setGrade(value.id)
    }
  
    const dummyData = [
      {
        date:"12 December 2021"

      },
      {
        date:"13 December 2021"
        
      },
      {
        date:"14 December 2021"
        
      },
      {
        date:"15 December 2021"
        
      },
      {
        date:"16 December 2021"
        
      },
      {
        date:"17 December 2021"
        
      },
      {
        date:"18 December 2021"
        
      },
      {
        date:"19 December 2021"
        
      },
    ]

return(
    <Layout>
    <form>
      <div className={classes.root}>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={5} md={3}>
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
              style={{ marginTop: 25}}
              fullWidth
              required
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
            
              
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={2}>
          <Autocomplete
                size='small'
                id='role'
                style={{ width: '100%' }}
                style={{ marginTop: 25 }}
                options={branch}
                name="branch_id"
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
          <Grid item xs={12} sm={5} md={3} lg={2}>
          <Autocomplete
                size='small'
                id='grade'
                style={{ width: '100%' }}
                style={{ marginTop: 25 }}
                options={gradesGet}
                getOptionLabel={(option) => option.grade_name}
                name='grade'
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
          <Grid item xs={12} sm={5} md={3} lg={2}>
          <Autocomplete
                id='section'
                size='small'
                style={{ width: '100%' }}
                style={{ marginTop: 25 }}
                options={[
                  { id: 1, name: 'A' },
                  { id: 2, name: 'B' },
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
          <Grid container spacing={1} style={{ width: '45%', margin: '10px' }}>
          <Grid>
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
        <br />
        <br />
        <br />
        <br />
        <Grid container direction='row'>
                    {/* <Grid item md={1}></Grid> */}
                    
                    <Grid item md={1}>
                      <Typography variant='subtitle2' color="primary">Sarathak Khanna</Typography>

                    </Grid>
                    <Grid item md={1}>
                      <img src={line} className={classes.lines} />
                    </Grid>

                    <Grid item md={1}>
                      <Typography variant='subtitle2' color="primary">12 Dec 2021-19 Dec 2021 </Typography>
                      
                    </Grid>
                    <Grid item md={1}>
                      <img src={line} className={classes.lines} />
                    </Grid>
                    
                    <Grid item md={1}>
                      <Typography variant='subtitle2'><FormControlLabel 
                              control={<Checkbox color="primary"/>}
                              label="Present"/></Typography>
                     
                    </Grid>
                    <Grid item md={1}>
                    <Typography><FormControlLabel 
                              control={<Checkbox color="primary"/>}
                              
                              label="Absent"/></Typography>
                    </Grid>
                    <Grid item md={1}>
                    <Typography><FormControlLabel 
                              control={<Checkbox color="primary"/>}
                              label="1st Half"/></Typography>
                    </Grid>
                    <Grid item md={1}>
                    <Typography><FormControlLabel 
                              control={<Checkbox color="primary"/>}
                              label="2nd Half"/></Typography>
                    </Grid>
                    <Grid>
                    <Button  style={{marginLeft:250}}>
                        Download Excel
                    </Button>
                    </Grid>
                    
                </Grid>
                <Grid container direction="row">
        <Grid item md={12}>
          <Divider />
        </Grid> 
        <br />
        
        </Grid>

        <Grid container direction='row' spacing={1}>
       
       { dummyData.map((data) => {
       return (<Grid item md={2}>
          <Card className={classes.root}>
            <CardMedia
              className={classes.cover}
            />
            <div >
              <CardContent style={{marginLeft:30}}>
                <Grid container direction="row">
                <Grid >
                <h4>{data.date}</h4>
                <Grid><div className="triangle">
                </div></Grid>
                </Grid>
                </Grid>
              </CardContent>
            </div>
          </Card>
          </Grid>)})}
          
          
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

      

        </div>
    </form>
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




























