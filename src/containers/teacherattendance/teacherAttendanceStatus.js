

import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    absentPadding: {
      paddingLeft:'20px',
    },
    halfdayPadding: {
        paddingLeft:'20px',
      },
      latePadding: {
        paddingLeft:'28px',
      },
      holidayPadding: {
        paddingLeft:'15px',
      },
    
   
  }));
export default function TeacherAttendanceStatus(props) {
    const classes=useStyles();

   
    const [value, setValue] = React.useState('');
    const [attendance, setAttendance] = React.useState(props.attendence_status);

    

    const handleChange = (event) => {
       
        var body = {
            erp_user: props?.user_id,
            attendence_status: event.target.value,
            date:props?.start_date,
            
        }
        setAttendance(event.target.value);


        axiosInstance.post(`${endpoints.academics.teacherAttendanceSent}`, body)
        .then((result) => {
            console.log(result,"abcd")

            //  setValue(event.target.value);

        }
        ).catch((error) => {
            console.log(error)
        })
        
    };
    return (
        // <Grid container direction="row" justifyContent="center">
            <FormControl component="fieldset" name="attendence_status">

                <RadioGroup row={true}  value={attendance} onChange={handleChange}>

                    <Grid item md={2}  padding={10}>
                        <FormControlLabel  value="present" control={<Radio />} label="Present" />
                    </Grid>
                    <Grid item  md={2} className={classes.absentPadding}>

                        <FormControlLabel  value="absent" control={<Radio />} label="Absent" />
                    </Grid>
                    <Grid item  md={2} className={classes.halfdayPadding}>

                        <FormControlLabel  value="halfday" control={<Radio />} label="Half Day" />
                    </Grid>
                    <Grid item  md={2} className={classes.latePadding}>

                        <FormControlLabel  value="late" control={<Radio />} label="Late" />
                    </Grid>
                    <Grid item md={2} className={classes.holidayPadding} >
                        <FormControlLabel  value="holiday" control={<Radio />} label="Holiday" />
                    </Grid>
                </RadioGroup>
            </FormControl>
        // </Grid>
    );

};
