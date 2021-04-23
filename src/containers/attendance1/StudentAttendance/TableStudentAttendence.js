import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Layout from '../../Layout';
import Button from '@material-ui/core/Button';
import line from '../../../assets/images/line.svg';
import FormControl from '@material-ui/core/FormControl';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Pagination from '@material-ui/lab/Pagination';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import './tablestudentattendance.scss';
import {
  
    Card,
    CardContent,
    CardMedia, 
    Typography,
  } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
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

const Cal1 = () =>{
    const classes = useStyles();
    const dummyData = [
      {
        name:"Akash Sharma",
        rollno:"11",
        ERPno:"123456789",


      },
      {
        name:"Akash Sharma",
        rollno:"11",
        ERPno:"123456789",


      },
      {
        name:"Akash Sharma",
        rollno:"11",
        ERPno:"123456789",


      },
      {
        name:"Akash Sharma",
        rollno:"11",
        ERPno:"123456789",


      },
      {
        name:"Akash Sharma",
        rollno:"11",
        ERPno:"123456789",


      },
      {
        name:"Akash Sharma",
        rollno:"11",
        ERPno:"123456789",


      },
      {
        name:"Akash Sharma",
        rollno:"11",
        ERPno:"123456789",


      },
      
    ]

return(
    <Layout>
    <form>
      <div className={classes.root}>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={5} md={3}>
            {/* <FormControl variant='outlined' className={classes.formControl} size='small'>
              <Autocomplete
                size='small'
                id='role'
                style={{ width: '50%' }}
                style={{marginRight:50}}
                // getOptionLabel={(option) => option?.role_name}
                
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Category type'
                    placeholder='role'
                    required
                  />
                )}
              />
            </FormControl> */}
            <TextField
              name='appointment_date'
              label='Date'
              InputLabelProps={{ shrink: true, required: true }}
              type='date'
              variant='outlined'
              fullWidth
              size='small'
            
              style={{ marginTop: 25 }}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={2}>
          <Autocomplete
                size='small'
                id='role'
                style={{ width: '100%' }}
                style={{ marginTop: 25 }}
                
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Branch'
                    placeholder='role'
                    required
                  />
                )}
              />
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={2}>
          <Autocomplete
                size='small'
                id='role'
                style={{ width: '100%' }}
                style={{ marginTop: 25 }}
                
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Grade'
                    placeholder='role'
                    required
                  />
                )}
              />
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={2}>
          <Autocomplete
                size='small'
                id='role'
                style={{ width: '100%' }}
                style={{ marginTop: 25 }}
                
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Section'
                    placeholder='role'
                    required
                  />
                )}
              />
          </Grid>


         
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid container spacing={1} style={{ width: '45%', margin: '10px' }}>
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
         
        >
          <Button
            variant='contained'
            className='custom_button_master labelColor'
            size='medium'
          
            // onClick={handleGoBack}
          >
          Clearall
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={5}
          md={4}
          lg={3}
         
        >
          <Button
            variant='contained'
            style={{ color: 'white' }}
            color='primary'
            className='custom_button_master'
            size='medium'
            type='submit'
          >
            filter
          </Button>
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
                      <Typography  color="primary">12 Dec 2021-19 Dec 2021 </Typography>
                      
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
                    <Grid><Typography variant='subtitle2' color="secondary" style={{marginLeft:400}}>Number of students:33</Typography></Grid>
                    <Grid>
                    <Button  style={{marginLeft:100}}>
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

        <Grid container direction='row' spacing={4}>
       
       { dummyData.map((data) => {
       return (<Grid item md={2}>
          <Card className={classes.root}>
            <CardMedia
              className={classes.cover}
            />
            <div >
              <CardContent>
                <Grid container direction="row">
                  <Grid style={{marginTop:15}}><Avatar>Ak</Avatar></Grid>
                <Grid style={{marginLeft:10}}>
                <Typography>{data.name}</Typography>
                <Typography>{data.rollno}</Typography>
                <Typography>{data.ERPno}</Typography>
                </Grid>
                <Grid style={{marginTop:12}}><div className="triangle">
                </div></Grid>
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

export default Cal1;














































































































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




























