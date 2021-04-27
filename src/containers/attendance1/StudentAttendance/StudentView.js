import React, {useEffect,useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Layout from 'containers/Layout';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Attendence from './Attendence';
import { makeStyles } from '@material-ui/core/styles';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import './studentview.scss';







const StudentView = () => {
  const [dateState, setDateState] = useState(new Date());
  const [spacing, setSpacing] = React.useState(2);
  const [getDatastudent,setGetDatastudent] = React.useState();
  const [getData,setGetData] = React.useState([]);
  const [flag,setFlag]=React.useState(false)
  const changeDate = (e) => {
    setDateState(e);
  };
  const useStyles = makeStyles((theme) => ({
    margin: theme.spacing(2),
  }));
  const classes = useStyles();
  
  React.useEffect(()=>{    
    axiosInstance(endpoints.Calendar_attendance.Monthly_attendance).then((res)=>{
      console.log("response",res.data.result.students_list)
      setGetData(res.data.result.students_list)
    })

  },[])
  useEffect(()=>{
    
    axiosInstance(endpoints.Calendar_attendance.Student_calender).then((res)=>{
      console.log("response1",res.data.result.events)
      setGetDatastudent(res.data.result.events)
    })

  },[])
  
const handleClickAttendence=(e)=>{
  e.preventDefault()
  console.log("open sheet")
  setFlag(true)

}

const handleClickEventsHolidays=(e)=>{
    e.preventDefault()
    console.log("open sheet")
    setFlag(true)
  
  }

  return (
  <>
    <Layout>
      {/* <Grid item md={2} style={{marginLeft:"22%" }}> */}
      <Grid className="Gsview1">
        {/* <h1 style={{backgroundColor: 'lightgrey',border:"1px solid lightgrey ",margin:" 0% 5%" }}>StudentView</h1> */}
        <h1 className="Hs1">StudentView</h1>
      </Grid>
      {/* <Grid container direction="row" spacing={2}style={{ marginTop: '2%'}} > */}
      <Grid container direction="row" spacing={2} className="Gsview2">
        {/* <Grid item md={2} style={{ marginLeft:'35%' }}> */}
        <Grid className="Gsview3">
          {/* <Button style={{backgroundColor: 'white',color:'black',border:"3px solid black"}} onClick={handleClickAttendence}>Attendence</Button> */}
          <Button className="Bs1" onClick={handleClickAttendence}>Attendence</Button>
        </Grid>
        <Grid className="Gsview4" >
          <Button style={{backgroundColor: 'white',color:'black',border:"3px solid black",marginLeft:"20%"}} onClick={handleClickEventsHolidays}>Events/Holidays</Button>
          {/* <Button className="Bs2" onClick={handleClickEventsHolidays}>Events/Holidays</Button> */}
        </Grid>
        {/* <Grid item md={1} style={{ marginRight:'4%' }}>  */}
        <Grid className="Gsview5"> 
        </Grid>
        <Autocomplete
          size="small"
          style={{width:150}}
          id="combo-box-demo"
          options={getDatastudent}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Month" variant="outlined" />}
        />
      </Grid>
      <Grid container direction="row" >
        <Grid container direction="row" >
          <Grid item md={2} style={{marginTop:"2%" }}>
            <Calendar value={dateState} onChange={changeDate} />
          </Grid>
          {flag?<Grid md={9}> <Attendence/></Grid>:""}
        </Grid>
      </Grid>
    </Layout>
  </>
  );
};

export default StudentView;