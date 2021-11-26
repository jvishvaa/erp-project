

import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';


export default function TeacherAttendanceStatus(props) {
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
    console.log(props, "props");
    return (
        // <Grid container direction="row" justifyContent="center">
            <FormControl component="fieldset" name="attendence_status">

                <RadioGroup row={true}  value={attendance} onChange={handleChange}>

                    <Grid item md={2}  padding={10}>
                        <FormControlLabel  value="present" control={<Radio />} label="Present" />
                    </Grid>
                    <Grid item  md={2} padding={10}>

                        <FormControlLabel  value="absent" control={<Radio />} label="Absent" />
                    </Grid>
                    <Grid item  md={2} padding={10}>

                        <FormControlLabel  value="halfday" control={<Radio />} label="Half Day" />
                    </Grid>
                    <Grid item  md={2}  padding={10}>

                        <FormControlLabel  value="late" control={<Radio />} label="Late" />
                    </Grid>
                    <Grid item md={2}  padding={10}>
                        <FormControlLabel  value="holiday" control={<Radio />} label="Holiday" />
                    </Grid>
                </RadioGroup>
            </FormControl>
        // </Grid>
    );

};
