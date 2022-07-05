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
import './teacherattendance.css';

const useStyles = makeStyles((theme) => ({
  absentPadding: {
    paddingLeft: '20px',
  },
  halfdayPadding: {
    paddingLeft: '20px',
  },
  latePadding: {
    paddingLeft: '28px',
  },
  holidayPadding: {
    paddingLeft: '15px',
  },
}));
export default function TeacherAttendanceStatus(props) {
  const classes = useStyles();

  const [value, setValue] = React.useState('');
  const [attendance, setAttendance] = React.useState(props.attendence_status);

  const local = 'localhost:3000'
  const dev = 'dev.olvorchidnaigaon.letseduvate.com'
  const qa = 'qa.olvorchidnaigaon.letseduvate.com'
  const prod = 'orchids.letseduvate.com'

  const handleChange = (event) => {
    var body = {
      erp_user: props?.user_id,
      attendence_status: event.target.value,
      date: props?.start_date,
    };
    setAttendance(event.target.value);

    axiosInstance
      .post(`${endpoints.academics.teacherAttendanceSent}`, body)
      .then((result) => {
        console.log(result, 'abcd');

        //  setValue(event.target.value);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    // <Grid container direction="row" justifyContent="center">
    <FormControl component='fieldset' name='attendence_status' style={{display : 'flex' , justifyContent: 'space-between'}} >
      <RadioGroup row={true} value={attendance} onChange={handleChange} style={{ justifyContent:  props?.isStudentInRole ? 'center' : '' }} >
        <Grid item md={!props.isStudentInRole ? 3 : 4}>
          <FormControlLabel
            value='present'
            control={<Radio />}
            label='Present'
            className='th-font-size-13 th-label'
          />
        </Grid>
        <Grid item md={!props.isStudentInRole ? 2 : 4} className='absentPadding'>
          <FormControlLabel
            value='absent'
            control={<Radio />}
            label='Absent'
            className='th-font-size-13 th-label'
          />
        </Grid>
        {!props.isStudentInRole && (
          <>
            <Grid item md={3} className='halfdayPadding'>
              <FormControlLabel
                value='halfday'
                control={<Radio />}
                label='Half Day'
                className='th-font-size-13 th-label'
              />
            </Grid>
            <Grid item md={2} className='latePadding'>
              <FormControlLabel
                value='late'
                control={<Radio />}
                label='Late'
                className='th-font-size-13 th-label'
              />
            </Grid>
          </>
        )}
        {/* <Grid item md={!props.isStudentInRole ? 2 : 4} className='holidayPadding '>
          <FormControlLabel
            value='holiday'
            control={<Radio />}
            label='Holiday'
            className='th-font-size-13 th-label'
          />
        </Grid>  */}
      </RadioGroup>
    </FormControl>
    // </Grid>
  );
}
