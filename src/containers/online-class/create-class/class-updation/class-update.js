import React, { useState, useContext, useEffect } from 'react';
import { TextField, Grid, CircularProgress, Button } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CreateclassContext } from '../create-class-context/create-class-state';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';

const ClassUpdate = (props) => {
  // const tutorEmailRef = useRef(null);
  const { classData = {}, handleClose = () => {} } = props || {};
  const {
    online_class: {
      grade: classGrades = [],
      start_time: startTime,
      end_time: endTime,
      // duration
    } = {},
    tutor: tutors = [],
    id: zoomMeetingId,
    // meeting_id: meetingId,
  } = classData || {};

  const [tutorObjFromProps] = tutors || [];
  const { user: tutorUserObjFromProps } = tutorObjFromProps || {};

  const formattedStartTime = (startTime || []).split('T').join(' ');
  const durationDiffInMilliS = new Date(endTime || '') - new Date(startTime || '');
  const diffDurationInMins = durationDiffInMilliS / 1000 / 60;

  // const { email: tutorEmail } = tutorObjFromProps || {}

  const [tutorObj, setTutorObjFromProps] = useState(tutorUserObjFromProps || {});

  // const [onlineClass, setOnlineClass] = useState({})
  const { setAlert } = useContext(AlertNotificationContext);

  const {
    // verifyTutorEmail,
    // isTutorEmailValid,
    tutorEmails: tutorEmailList,
    tutorEmailsLoading,
    listTutorEmails,
  } = useContext(CreateclassContext);

  const [tutorNotAvailableMsg, setTutorNotAvailableMessage] = useState(undefined);
  const [isTutorAvailable, setIsTutorAvailable] = useState();

  // const classData = props.classData.zoom_meeting ? props.classData.zoom_meeting : props.classData;
  const checkTutorAvailability = async (email) => {
    // const { selectedDate, selectedTime, duration } = onlineClass;
    /*
        class creation payload:
            {
              class_type: 0
              duration: "10"
              is_recurring: 0
              join_limit: "10"
              role: "Student"
              section_mapping_ids: "75"
              start_time: "2021-02-04 11:04:00"
              subject_id: "115"
              title: "mk"
              tutor_emails: "creativeone@gmail.com,hjshs@k.com"
              user_id: 1
              week_days: "TH"
            }
      */
    /*
      Payload format
        tutor_email: creativeone@gmail.com
        start_time: 2021-02-04 11:04:00
        duration: 10
      */
    try {
      const { data } = await axiosInstance.get(
        `/erp_user/check-tutor-time/?tutor_email=${email}&start_time=${formattedStartTime}&duration=${diffDurationInMins}`
      );
      if (Number(data.status_code) === 200) {
        if (data.message === 'Tutor is available') {
          setTutorNotAvailableMessage(undefined);
          setIsTutorAvailable(true);
        } else {
          setTutorNotAvailableMessage('Selected tutor is not available. Select another');
        }
      }
    } catch (error) {
      setTutorNotAvailableMessage('Selected tutor is not available. Select another');
    }
  };

  const fetchTutorEmails = () => {
    if (classGrades && Array.isArray(classGrades) && classGrades.length) {
      const data = {
        // branchIds: selectedClassType.id===0?branch.join(','):onlineClass.branchIds.join(','),
        // gradeIds: onlineClass.gradeIds.join(','),
        gradeIds: (classGrades || []).join(''),
      };
      listTutorEmails(data);
    } else {
      setAlert('error', 'No grades are assigned.');
    }
  };
  const handleTutorEmail = (event, valueObj) => {
    setIsTutorAvailable(false);
    setTutorObjFromProps(valueObj || {});
    if (valueObj?.email) {
      checkTutorAvailability(valueObj.email);
    }
  };
  useEffect(() => {
    fetchTutorEmails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line consistent-return
  const handleSubmit = async () => {
    if (!isTutorAvailable || tutorNotAvailableMsg) {
      setAlert('error', 'Tutor not available for the time slot.');
      return null;
    }
    try {
      /*
          payload formta 
          {
            "zoom_meeting_id":23,
            "tutor_email":"dbjh@xcm.bcd",
            "start_time":"date time",
            "grade_id":1,
            "duration":"20"
            "section_id":"23,22",
            "subject_id":"20,23"
          }
        */
      const payload = {
        zoom_meeting_id: zoomMeetingId,
        tutor_email: tutorObj.email,
        start_time: formattedStartTime,
        grade_id: (classGrades || []).join(','),
        duration: diffDurationInMins,
        // "subject_id":"20,23"
      };
      const { data } = await axiosInstance.put(
        endpoints.onlineClass.updateTutor,
        payload
      );
      if (Number(data.status_code) === 201) {
        setAlert('success', `${data.message}`);
        handleClose();
      } else {
        setAlert('error', `${data.message}`);
      }
    } catch (error) {
      setAlert('error', `${error.message}`);
    }
  };
  return (
    <Grid container justify='center' style={{ paddingBottom: 5 }} spacing={2}>
      <Grid item xs={11} sm={6} md={4}>
        <Autocomplete
          size='small'
          id='create__class-tutor-email'
          options={tutorEmailList}
          getOptionLabel={(option) => option.email}
          filterSelectedOptions
          value={tutorObj || tutorUserObjFromProps}
          onChange={handleTutorEmail}
          disabled={tutorEmailsLoading}
          // ref={tutorEmailRef}
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
        {tutorNotAvailableMsg ? (
          <span className='alert__email'>{tutorNotAvailableMsg}</span>
        ) : null}
      </Grid>

      <Grid item xs={1} sm={2}>
        {isTutorAvailable ? (
          <CheckCircleIcon style={{ fill: 'green', marginTop: 8 }} />
        ) : null}
        {tutorEmailsLoading ? <CircularProgress color='secondary' /> : ''}
      </Grid>

      <Grid item>
        <Button
          disabled={!isTutorAvailable || tutorNotAvailableMsg || !tutorObj.email}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default ClassUpdate;
