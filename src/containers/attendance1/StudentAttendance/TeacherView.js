import React, {useEffect,useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Layout from 'containers/Layout';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import MarkAttendence from './MarkAttendence';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox'
import './teacherview.scss'






const TeacherView = () => {
  const [dateState, setDateState] = useState(new Date());
  const [spacing, setSpacing] = React.useState(2);
  const [getDatastudent,setGetDatastudent] = React.useState();
  const [getData,setGetData] = React.useState([]);
  const [flag,setFlag]=React.useState(false)
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState();

  const changeDate = (e) => {
    setDateState(e);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (event) => {
      setState({ ...state, [event.target.name]: event.target.checked });
    };

  const useStyles = makeStyles((theme) => ({
    margin: theme.spacing(2),
  }));

  const styles = {
    crossButton: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: 0,
    },
  };
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
      <Grid item md={2} className="Gtview1">
        {/* <h1 style={{backgroundColor: 'lightgrey',border:"1px solid lightgrey ",margin:" 0% 5%" }}>TeacherView</h1> */}
        <h1 className="Ht1">TeacherView</h1>
      </Grid>
      {/* <Grid container direction="row" spacing={2}style={{ marginTop: '2%'}} > */}
      <Grid container direction="row" spacing={2} className="Gtview2">
        <Grid item className="Gtview3">
          <Autocomplete
            size="small"
            style={{width:150}}
            id="combo-box-demo"
            options={getDatastudent}
            getOptionLabel={(option) => option.grade_id }
            renderInput={(params) => <TextField {...params} label="Grade" variant="outlined" />}
         />
        </Grid>
        <Grid item className="Gtview4" md={2}> 
          <Autocomplete
            size="small"
            style={{width:150}}
            id="combo-box-demo"
            options={getDatastudent}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Section" variant="outlined" />}
          />
        </Grid>
        <Grid item md={2} >
          {/* <Button style={{backgroundColor: 'white',color:'black',border:"3px solid black"}} onClick={handleClick}>MarkAttendance</Button> */}
          <Button className="Bt1" onClick={handleClick}>MarkAttendance</Button>
        </Grid>
        {/* <Grid item md={2} style={{ paddingLeft: "8%"}}> */}
        <Grid item md={2} className="Gtview5">  
          <Autocomplete
            size="small"
            style={{width:150}}
            id="combo-box-demo"
            options={getDatastudent}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Month" variant="outlined" />}
          />
        </Grid>
      </Grid>
      <Grid container direction="row" >
        <Grid container direction="row" >
          {/* <Grid item md={2} style={{marginTop:"2%" }}> */}
          <Grid item md={2} className="Gtview6">
          <Button variant='contained' color='secondary' onClick={handleClickOpen} style={{marginBottom:"20%" }} >
              Add Event/Activity
          </Button>
          <Dialog open={open} onClose={handleClose} startIcon={<CloseIcon />} fullWidth>
            <div style={styles.crossButton}>
             <DialogContent>
              
                <form>
                    <Grid container direction = "row">
                        <Grid md={12}>
                          <TextField  label="Title" variant="outlined" fullWidth helperText/> 
                          <TextField  
                              label=""
                              type="date"
                              variant="outlined"
                              style={{width:"50%"}}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              helperText
                              />
                          <TextField  label=""
                              type="date"
                              variant="outlined"
                              style ={{paddingLeft:"1%" , width:"50%"}}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              helperText
                              /> 
                          <TextField
                                label=""
                                type="time"
                                variant="outlined"
                                style={{width:"50%"}}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              
                              />
                          <TextField  
                              label=""
                              type="time"
                              variant="outlined"
                              style ={{paddingLeft:"1%" , width:"50%"}}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              helperText
                              /> 
                          <TextareaAutosize 
                            variant="outlined"
                            rowsMin={10} 
                            placeholder="Description"
                            style={{width:"100%"}}
                            helperText
                          />
                          <Grid container direction ="row">
                             <Grid item md={3}>
                              <FormControlLabel 
                              control={<Checkbox/>}
                              label="All Day"/>
                            </Grid>
                          <Grid item md={3}>
                          <FormControlLabel 
                          control={<Checkbox/>}
                          label="First Half"
                        />
                          </Grid>
                          <Grid item md={3}>
                          <FormControlLabel 
                          control={<Checkbox/>}
                          label="Second Half"
                        />
                          </Grid>
                          <Grid item md={3}>
                          <FormControlLabel 
                          control={<Checkbox/>}
                          label="Holiday"/>
                          </Grid>
                          <Grid container direction="row"  >
                            <Grid item md={2}>
                                <Autocomplete
                                size="small"
                                style={{width:150}}
                              id="combo-box-demo"
                              // options={getDatastudent}
                              // getOptionLabel={(option) => option.grade_id }
                              renderInput={(params) => <TextField {...params} label="Grade" variant="outlined" />}
                                />
                            </Grid>
                          <Grid item md={2} style={{paddingLeft:"15%"}}> 
                          {/* <Grid className="Gview7">  */}
                            <Autocomplete
                            size="small"
                            style={{width:150}}
                              id="combo-box-demo"
                              // options={getDatastudent}
                              // getOptionLabel={(option) => option.name}
                              renderInput={(params) => <TextField {...params} label="Section" variant="outlined" />}
                                />
                              
                          </Grid>
                         {/* <Button style={{backgroundColor: 'lightgrey',color:'black',marginLeft:"50%"}}>Save</Button> */}
                         <Button className="Bt2">Save</Button>
                        </Grid>
                       </Grid>
                      </Grid>
                    </Grid>
              </form>
            </DialogContent>
        </div>
      </Dialog>
      <Calendar value={dateState} onChange={changeDate} />
    </Grid>
      {flag?<Grid item md={9}><MarkAttendence/></Grid>:""}
  </Grid>
</Grid>
</Layout>
</>
  );
};

export default TeacherView;














{/* <Dialog open={open} onClose={handleClose} startIcon={<CloseIcon />} fullWidth>
              <div style={styles.crossButton}>
                <DialogContent>
                  <Button variant='contained' style={{ marginRight: '70%' }}>
                    Event
                  </Button>
                  <Button>Save</Button>
                  <Grid>
                    <form>
                      <TextField id='standard-basic' label='Add Title' />
                  <form className={classes.root}>
                 <input type="date"/>
                  <TextField label='' />
                  <TextField label='' />
                  <input type="date"/>


                </form>
                <FormControlLabel 
                    control={<Checkbox  onChange={handleChange}  />}
                    label="All Day"style={{ marginRight: '30%' }} />
                              
              </form>

              <TextareaAutosize
                variant='filled'
                rowsMin={10}
                placeholder='Add Description'
                fullWidth
              />
            </Grid>
            <Grid container direction='row'>
              <Grid item md={5}>
              
                <Button variant='contained' color='secondary'>
                  Grade
                </Button>
              </Grid>

              <Grid item md={5}>
                <Button variant='contained' color='secondary'>
                  Section
                </Button>
              </Grid>
            </Grid>
            <Grid container direction='row'>
              <Grid item md={5}>
            <TextField
            defaultValue="Is Holiday"
            variant="outlined"
            size="small"
          />
          
          </Grid>
           </Grid>
          </DialogContent>
        </div>
      </Dialog>
          </Grid> */}