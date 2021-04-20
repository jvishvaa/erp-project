import { Button, FormControl, Grid, IconButton, InputLabel, makeStyles, MenuItem, Select, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
// import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import MobileDateRange from './mobileDateRange.jsx';


const GenerateReportForm = (props) => {
    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
    const { setAlert } = useContext(AlertNotificationContext);
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
    const [branch, setBranch] = React.useState('');
    const [grade, setGrade] = React.useState('');
    const [section, setSection] = React.useState('');
    const [branch_list, setBranch_list] = React.useState([]);
    const [grade_list, setGrade_list] = React.useState([]);
    const [section_list, setSection_list] = React.useState([])
   
    const handleDateChange = (name, date) => {
        if (name === 'startDate') setStartDate(date);
        else setEndDate(date);
    };

    const handleBranchChange = (event) => {
        setBranch(event.target.value);
    };

    const handleGradeChange = (event) => {
        setGrade(event.target.value);
        console.log(event.target.value)
    };

    const handleSectionChange = (event) => {
        setSection(event.target.value);
    }


    const getBranches = async() => {
        await axiosInstance.get(endpoints.academics.branches, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if(response.status == 200)
            {
                setBranch_list(response.data.data)
            }
            else{
                setAlert(response.data.message)
            }
        }).catch(error => {
          setAlert('error', error.message)
        })
    }

    const getGrades = () => {
        axiosInstance.get(endpoints.masterManagement.gradesDrop, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if(response.status == 200)
            {
                setGrade_list(response.data.data)
            }
            else{
                setAlert(response.data.message)
            }
        }).catch(error => {
          setAlert('error', error.message)
        })
    }

    const getSection = () => {
        axiosInstance.get(endpoints.grievances.section, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if(response.status == 200)
            {
                setSection_list(response.data.data)
            }
            else{
                setAlert(response.data.message)
            }
        }).catch(error => {
          setAlert('error', error.message)
        })
    }

    const onClickGenerate = async() => {
      axiosInstance.get(endpoints.grievances.downloadTicket, {params : {
        branch_id : branch,
        grade_id : grade,
        section_id : section,
        start_date : startDate,
        end_date : endDate,
      }
      }
      , {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        })
        .then (response => {
          if(response.status == 200)
          {
            setAlert("success", "Download Started")
          }
          else {
            setAlert ('error', response.data.message)
          }
        })
        .catch(error => {
          setAlert('error', error.message)
        })
    }
    function getDaysAfter(date, amount) {
      return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
    }
    function getDaysBefore(date, amount) {
      return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
    }

    const handleStartDateChange = (date) => {
      console.log("startdate:", date.toISOString().split("T")[0])
      // const endDate = getDaysAfter(date.clone(), 6);
      // setEndDate(endDate);
      setStartDate(date.toISOString().split("T")[0]);
      // getTeacherHomeworkDetails(2, date, endDate);
    };
    
  
    const handleEndDateChange = (date) => {

      // console.log("split:",new Date(date._d).toISOString().split('T'))
      // const startDate = getDaysBefore(date.clone(), 6);
      // setStartDate(startDate);
      setEndDate(date.format('YYYY-MM-DD'));
      // getTeacherHomeworkDetails(2, startDate, date);
    };

    useEffect(() => {
       getBranches();
       getGrades();
       getSection();
    }, [])

    return (
        <div style = {{padding : '30px'}}>
           <div style = {{display : 'flex', flexDirection : 'row', justifyContent : 'space-between'}}>
           <div/>
           <Typography style = {{marginTop : '10px'}}>Generate Report</Typography>
            <IconButton color ='primary' style = {{position : 'relative', top : '-25px', left : '20px'}} onClick = {props.close}>
                <CloseIcon />
            </IconButton>
           </div>

           <div style = {{display : 'flex', flexDirection : 'row', justifyContent : 'space-between'}}>
           <MuiPickersUtilsProvider utils={MomentUtils} >

           <MobileDateRange 
            onChange={(date) => handleEndDateChange(date)}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
           />

           {/* <KeyboardDatePicker
              size='small'
              color='primary'
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              id='date-picker-start-date'
              label='Start date'
              value={startDate}
              onChange={(event, date) => {
                handleDateChange('startDate', date);
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              style={{ marginRight : '20px', width : '30%' }}
            />

            <KeyboardDatePicker
              color = 'primary'
              size='small'
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              id='date-picker-end-date'
              name='endDate'
              label='End date'
              value={endDate}
              onChange={(event, date) => {
                handleDateChange('endDate', date);
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              style={{  width : '30%' }}
            /> */}
           </MuiPickersUtilsProvider>
           </div>
           
           <div>
           <FormControl size = "small" variant="outlined" style = {{width : '100%',marginTop : '10px'}}>
            <InputLabel id="branch_dropdown" >Branch</InputLabel>
            <Select
            labelId="brhandleSectionanch_dropdown"
            id="branch_dropdown"
            value={branch}
            onChange={handleBranchChange}
            label="Branch"
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {branch_list?.map (branch => (
                  <MenuItem value={branch?.id}>{branch?.branch_name}</MenuItem>
                ) )}
                </Select>
            </FormControl>
           </div>

           <div>

           <FormControl size = "small" variant="outlined" style = {{width : '100%', marginTop : '10px'}}>
            <InputLabel id="grade_dropdown" >Grade</InputLabel>
            <Select
            labelId="grade_dropdown"
            id="grade_dropdown"
            value={grade}
            onChange={handleGradeChange}
            label="Grade"
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {grade_list.map (grade => (
                  <MenuItem value={grade.id}>{grade.grade_name}</MenuItem>
                ) )}
                </Select>
            </FormControl>

            <FormControl size = "small" variant="outlined" style = {{width : '100%', marginTop : '10px'}}>
            <InputLabel id="Section_dropdown" >Grade</InputLabel>
            <Select
            labelId="Section_dropdown"
            id="Section_dropdown"
            value={section}
            onChange={handleSectionChange}
            label="Section"
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {section_list.map (section => (
                  <MenuItem value={section.id}>{section.section_name}</MenuItem>
                ) )}
                </Select>
            </FormControl>

           </div>
           <Grid container style = {{paddingTop : '30px'}}>
               <Grid item sm/>
               <Grid item sm = {3}>
                    <Button onClick = {onClickGenerate} color = 'primary' style={{textTransform: 'none'}} startIcon={<WbIncandescentIcon style = {{}} />}>Generate</Button>
               </Grid>
               <Grid item sm/>
           </Grid>
            
        </div>
    )
}

export default GenerateReportForm