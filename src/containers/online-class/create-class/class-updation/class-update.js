import React, { useState, useContext, useRef, useEffect } from 'react';
import { CreateclassContext } from '../create-class-context/create-class-state';
import { Modal, TextField, Grid, Box, CircularProgress, makeStyles, Button, withStyles } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../../config/axios';
import { emailRegExp, getFormatedTime,
  initialFormStructure,
  isBetweenNonSchedulingTime, } from '../utils';
const useStyles = makeStyles({
  card: {
    padding: '8px',
    border: '1px solid #F9D474',
    borderRadius: '10px',
    backgroundColor: '#FFFADF',
    cursor: 'pointer',
    minHeight: '165px',
  },
  activeCard: {
    padding: '8px',
    border: '1px solid #F9D474',
    borderRadius: '10px',
    backgroundColor: '#F9D474',
    height: 'auto',
    minHeight: '165px',
  },
  classTitle: {
    display: 'inline-block',
    color: '#001495',
    fontSize: '18px',
    fontFamily: 'Poppins',
    lineHeight: '27px',
  },
  classTime: {
    display: 'inline-block',
    color: '#001495',
    fontSize: '16px',
    fontFamily: 'Poppins',
    lineHeight: '25px',
    float: 'right',
  },
  classSchedule: {
    color: '#014B7E',
    fontSize: '16px',
    fontFamily: 'Poppins',
    lineHeight: '25px',
  }
})

const StyledButton = withStyles({
  root: {
    height: '26px',
    width: '112px',
    fontSize: '15px',
    fontFamily: 'Open Sans',
    color: '#FFFFFF',
    backgroundColor: '#344ADE',
    borderRadius: '5px',
    marginRight: '4px',
    float: 'right',
  }
})(Button);



const ClassUpdate = (props) => {
  const tutorEmailRef = useRef(null);
  const classes = useStyles({});
  const [onlineClass, setOnlineClass] = useState({})
  const [tutorNotAvailableMsg, setTutorNotAvailableMessage] = useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const {
    verifyTutorEmail,
    isTutorEmailValid,
    tutorEmails: tutorEmailList,
    tutorEmailsLoading,
    listTutorEmails,
  } = useContext(CreateclassContext);
  
  
  
    
    // const classData = props.classData.zoom_meeting ? props.classData.zoom_meeting : props.classData;
    const checkTutorAvailability = async (email) => {
      const { selectedDate, selectedTime, duration } = onlineClass;
  
      const startTime = `${selectedDate.toString().includes(' ') ? selectedDate.toISOString().split('T')[0] : selectedDate} ${getFormatedTime(selectedTime)}`;
  
      try {
        const { data } = await axiosInstance.get(
          `/erp_user/check-tutor-time/?tutor_email=${onlineClass.tutorEmail.email}&start_time=${startTime}&duration=${duration}`
        );
        if (data.status_code === '200') {
          if (data.message === 'Tutor is available') {
            setTutorNotAvailableMessage('');
          } else {
            setTutorNotAvailableMessage('Selected tutor is not available. Select another');
          }
        }
      } catch (error) {
        setTutorNotAvailableMessage('Selected tutor is not available. Select another');
      }
    };
    const handleBlur = (e) => {
      const isValidEmail = e.target.value.match(emailRegExp);
      if (!isValidEmail || onlineClass.tutorEmail === '') {
        setAlert('error', 'Invalid email address');
      } else {
        const { tutorEmail, selectedDate, selectedTime, duration } = onlineClass;
        const data = {
          // branchId: branch.join(','),
          gradeId: onlineClass.gradeIds.join(','),
          sectionIds: onlineClass.sectionIds.join(','),
          subjectId: onlineClass.subject,
        };
        verifyTutorEmail(tutorEmail, selectedDate, selectedTime, duration, data);
      }
    };
    const fetchTutorEmails = () => {
      const data = {
        // branchIds: selectedClassType.id===0?branch.join(','):onlineClass.branchIds.join(','),
        // gradeIds: onlineClass.gradeIds.join(','),
        gradeIds: 24
      };
      listTutorEmails(data);
    };
    const handleTutorEmail = (event, value) => {

    }
    useEffect(()=>{ fetchTutorEmails() }, [])
    // useEffect(() => {
    //   if (
    //     onlineClass.duration &&
    //     onlineClass.subject &&
    //     onlineClass.gradeIds.length &&
    //     onlineClass.selectedDate &&
    //     onlineClass.selectedTime &&
    //     onlineClass.tutorEmail
    //   ) {
    //     // fetchTutorEmails();
    //     checkTutorAvailability();
    //   }
    // }, [
    //   onlineClass.duration,
    //   onlineClass.subject,
    //   onlineClass.gradeIds.length,
    //   onlineClass.selectedDate,
    //   onlineClass.selectedTime,
    //   onlineClass.tutorEmail,
    // ]);
    //console.log(classData);
    return (      
            <Grid
                container
                // className='create-class-container'
                style={{ paddingBottom: 5 }}
                spacing={2}
            >
            <Grid item xs={11} sm={6} md={4}>
              <Autocomplete
                size='small'
                id='create__class-tutor-email'
                options={tutorEmailList}
                getOptionLabel={(option) => option.email}
                filterSelectedOptions
                value={onlineClass.tutorEmail}
                onChange={handleTutorEmail}
                // onBlur={handleBlur}
                disabled={tutorEmailsLoading}
                ref={tutorEmailRef}
                renderInput={(params) => (
                  <TextField
                    size='small'
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Tutor Email'
                    placeholder='Tutor Email'
                    required
                  />
                )}
              />

              <span className='alert__email'>{tutorNotAvailableMsg}</span>
              
            </Grid>
            <Grid item xs={1} sm={6} md={4}>
              {isTutorEmailValid ? (
                <CheckCircleIcon style={{ fill: 'green', marginTop: 8 }} />
              ) : (
                  ''
                )}
              {tutorEmailsLoading ? <CircularProgress color='secondary' /> : ''}
            </Grid>
            <Grid item>
              <Button>Submit</Button>
            </Grid>
          </Grid>
  )
}

export default ClassUpdate;