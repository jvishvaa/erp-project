import React, {useEffect,useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Schedules from '../Schedules';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import Paper from '@material-ui/core/Paper';
import './attendance1.scss';





const Attendence = () => {
  const [dateState, setDateState] = useState(new Date());
  const [spacing, setSpacing] = React.useState(2);
  const [getDatastudent,setGetDatastudent] = React.useState();
  const [getData,setGetData] = React.useState([]);
  const changeDate = (e) => {
    setDateState(e);
  };
  const useStyles = makeStyles((theme) => ({
    margin: theme.spacing(2),
  }));
  const classes = useStyles();
  
  React.useEffect(()=>{
    axiosInstance(endpoints.Calendar_attendance.Monthly_attendance).then((res)=>{
      console.log("response",res.data.result)
      setGetData(res.data.result.students_list)
    })

  },[])
  useEffect(()=>{
   
    
    axiosInstance(endpoints.Calendar_attendance.Student_calender).then((res)=>{
      console.log("response1",res.data.result.events)
      setGetDatastudent(res.data.result.events)
    })

  },[])
  

  return (
    <>
      {/* <Grid container direction="row"style={{ paddingLeft: "10%"}} > */}
      <Grid container direction="row"className="Gview1">
          <Grid item md={12} >
              <Schedules/>
                {/* <Grid container direction="row" style={{ paddingLeft: "10%"}}> */}
                <Grid container direction="row" className="Gview2">
                  <Grid item md={2} >
                      {/* <Paper style={{ width: "1px",border: "15px solid lightgrey ",padding: "px" }}></Paper><h3>Holiday</h3> */}
                      <Paper className="P1"></Paper><h3>Holiday</h3>
                  </Grid>
                  <Grid item md={2} >
                    {/* <Paper style={{ width: "1px",border: "15px solid lightgreen",padding: "px"}}></Paper><h3>Present</h3> */}
                    <Paper className="P2"></Paper><h3>Present</h3>
                  </Grid>
                  <Grid item md={2} >
                    {/* <Paper style={{ width: "1px",border: "15px solid pink",padding: "px"}}></Paper><h3>Absent</h3> */}
                    <Paper className="P3"></Paper><h3>Absent</h3>
                  </Grid>
                </Grid>
        </Grid>
      </Grid>
     </>
  );
};

export default Attendence;