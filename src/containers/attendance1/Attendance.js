import React, {useEffect,useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Layout from 'containers/Layout';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DayWise from './DayWise'
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import AdminView from './StudentAttendance/AdminView';
import './attendance.scss';



const Admin = () => {
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
  
const handleClick=(e)=>{
  e.preventDefault()
  console.log("open sheet")
  setFlag(true)

}
  return (
<>
  <Layout>
    {/* <Grid item md={2} style={{marginLeft:"22%" }}> */}
    <Grid item className="Gaview1"md={2}>
      {/* <h1 style={{backgroundColor: 'lightgrey',border:"1px solid lightgrey ",margin:" 0% 5%" }}>AdminView</h1> */}
      <h1 className="Adminview">AdminView</h1>
    </Grid>
    {/* <Grid container direction="row" spacing={2}style={{ marginTop: '2%'}} > */}
    <Grid container direction="row" className="Gaview2">
      {/* <Grid item md={2} style={{ paddingLeft:'45%' }}> */}
      <Grid item className="Gaview3" md={2} >
        {/* <Button style={{backgroundColor: 'white',color:'black',border:"3px solid black"}}>Events/Holidays</Button> */}
        <Button className="Ba1">Events/Holidays</Button>
      </Grid>
      {/* <Grid item md={2} style={{ paddingLeft: '12%' }}> */}
      <Grid item className="Gaview4" md={2}>
        {/* <Button style={{backgroundColor: 'white',color:'black',border:"3px solid black"}} onClick={handleClick}>studentattendance</Button> */}
         <Button className="Ba2" onClick={handleClick}>studentattendance</Button>
      </Grid>
      {/* <Grid item md={2} style={{ paddingLeft: '8%' }}> */}
      <Grid item className="Gaview5"   > 
        {/* <Button style={{backgroundColor: 'white',color:'black' }}>from<input type="date"/></Button> */}
        <Button className="Ba3">from<input type="date"/></Button>
      </Grid>
      {/* <Grid item md={2} > */}
      <Grid item className="Gaview6"  >
        {/* <Button style={{backgroundColor: 'white',color:'black'}}>To<input type="date"/></Button> */}
        <Button className="Ba4">To<input type="date"/></Button>
      </Grid>
    </Grid>
    <Grid container direction="row" >
      <Grid item md={2} style={{marginTop:"6%" }}>
        <Calendar value={dateState} onChange={changeDate} />
      </Grid>
      {
      flag? 
      <Grid item md={9} ><AdminView/></Grid>
      :
      <>
      <Grid item md={9} ><DayWise/></Grid>
      <></>
      </>
      }
      </Grid>
      {/* <TeacherView/> */}
  </Layout>
</>
  );
};

export default Admin;