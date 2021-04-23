import React, {useEffect,useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Schedules from '../Schedules';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import Paper from '@material-ui/core/Paper';
import './adminview.scss';




const AdminView = () => {
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
      {/* <Grid container direction="row" spacing={2} style={{ paddingTop:"5%",paddingRight: "30%"}}> */}
      <Grid container direction="row" spacing={2} className="Gview1">  
        <Grid item md={1} lg={2} >
          <Autocomplete
            size="small"
            style={{width:250}}
            id="combo-box-demo"
            options={getData}
            getOptionLabel={(getData) => getData}
            renderInput={(params) => <TextField {...params} label="view" variant="outlined" />}
          />              
        </Grid>
        <Grid item md={1} lg={3}style={{ paddingLeft: "15%"}}>
          <Autocomplete
            size="small"
            style={{width:150}}
            id="combo-box-demo"
            options={getDatastudent}
            getOptionLabel={(option) => option.grade_id }
            renderInput={(params) => <TextField {...params} label="Grade" variant="outlined" />}
          />
        </Grid>
        <Grid item md={1} lg={3} style={{ paddingLeft: "10%"}}> 
          <Autocomplete
            size="small"
            style={{width:150}}
            id="combo-box-demo"
            options={getDatastudent}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Section" variant="outlined" />}
          />             
        </Grid>
        <Grid item md={2}  lg={3}style={{ paddingLeft: "5%"}}>
          <Autocomplete
            id="combo-box-demo"
            size="small"
            style={{width:150}}
            options={getDatastudent}
            getOptionLabel={(option) => option.fullday_present}
            renderInput={(params) => <TextField {...params} label="Shift" variant="outlined" />}
          />
        </Grid>
      </Grid>
      {/* <Grid container direction="row"style={{ paddingLeft: "10%"}} > */}
      <Grid container direction="row"className="Gview2" >
        <Grid item md={12} >
          <Schedules/>
            {/* <Grid container direction="row" style={{ paddingLeft: "10%"}}> */}
            <Grid container direction="row" spacing={2}className="Gview3">
              <Grid item md={2}>
                {/* <Paper style={{ width: "1px",border: "15px solid lightgrey ",padding: "px" }}></Paper><h3>Holiday</h3> */}
                <Paper  className="P1"></Paper><h3>Holiday</h3>
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

export default AdminView;