import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axiosInstance from '../../../config/axios';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import moment from 'moment';
import '../timetable.scss';
const useStyles = makeStyles(() => ({
  multilineColor: {
    background: 'white',
    color: '#014B7E',
    fontSize: '15px',
  },
}));
const DisplayBox = (props) => {
  const classes = useStyles();
  const [openEditForm, setOpenEditForm] = useState(true);
  const setMobileView = useMediaQuery('(min-width:800px)');
  const currDate = moment('08:09:00').format(' h:mm: a');
  const [data] = useState(props.dataOpenChange);
  const [Description, setDescription] = useState(props.dataOpenChange.period_description);
  const [startTime, setStartTime] = useState(
    props.dataOpenChange.period_start_time + ' - ' + props.dataOpenChange.period_end_time
  );
  const [teacherDetails, setTeacherDetails] = useState(data.teacher_name.name);
  const [assignedTeacherID, setAssignTeacherID] = useState(props.dataOpenChange.assigned_teacher_id);
  const [subject, setSubject] = useState(props.dataOpenChange.period_name);
  const [subjectID, setSubjectID] = useState(props.dataOpenChange.subject_id); 
  const [MaterialRequired, setMaterialRequired] = useState(
    props.dataOpenChange.required_material
  );

  // useEffect(() => {
  //   // axiosInstance
  //   //   .get('/erp_user/user-data/', {
  //   //     params: {
  //   //       erp_user_id: data.teacher_name.name,
  //   //     },
  //   //   })
  //   //   .then((response) => {
  //   //     if (response.status === 200) {
  //   //       console.log(response, 'ydyd');
  //   //       setTeacherDetails(response.data.result.name);
  //   //     }
  //   //   })
  //   //   .catch((error) => {
  //   //     console.log(error);
  //   //   });
  // }, [props.dataOpenChange, openEditForm]);

  console.log(currDate, 'datatae');
  const sendUpdatedData = () => {
    setOpenEditForm(true);
    if (!setMobileView) {
      props.handleOpenChangeMobile(data, false);
    }
    console.log('updateDAta');
    let obj = {
      period_description: Description,
      subject: subjectID,
      assigned_teacher: assignedTeacherID,
      required_material: MaterialRequired,
    };
    axiosInstance
      .post('/academic/assign_class_periods/' + data.id + '/', obj)
      .then((response) => {
        console.log(response);
        props.callGetAPI();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      {openEditForm ? (
        <>
          <div className='display-heading-container'>
            <div className='yellow-header'>
              {data.period_start_time.slice(0, 5)}-{data.period_end_time.slice(0, 5)}AM
            </div>
            {props.teacherView ? (
              <div className='edit-button' onClick={() => setOpenEditForm(false)}>
                <EditTwoToneIcon size='small' /> Edit
              </div>
            ) : (
              <></>
            )}
          </div>
          <h3>{data.period_name}</h3>
          <h4>
            {data.teacher_name.name}
            {/* {data.assigned_teacher__first_name} {data.assigned_teacher__last_name} */}
          </h4>
          <div className='yellow-header'>Short description about class</div>
          <p>{data.period_description}</p>
          <div className='yellow-header'>Material Required</div>
          <p>{data.required_material}</p>
        </>
      ) : (
        <>
          <div className='field-container'>
            <TextField
            fullWidth
              label='Duration'
              id='outlined-size-small'
              variant='outlined'
              value={startTime}
              size='small'
              InputProps={{
                className: classes.multilineColor,
              }}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className='field-container'>
            <TextField
            fullWidth
              label='Conducted By'
              id='outlined-size-small'
              variant='outlined'
              size='small'
              InputProps={{
                className: classes.multilineColor,
              }}
              value={teacherDetails}
              onChange={(e) => setTeacherDetails(e.target.value)}
            />
          </div>
          <div className='field-container'>
            <TextField
            fullWidth
              label='description'
              value={Description}
              id='outlined-size-small'
              variant='outlined'
              size='small'
              InputProps={{
                className: classes.multilineColor,
              }}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/* <div className='field-container'>
            <TextField
              label='Subject'
              value={subject}
              id='outlined-size-small'
              variant='outlined'
              size='small'
              onChange={(e) => setSubject(e.target.value)}
            />
          </div> */}
          <div className='field-container'>
            <TextField
            fullWidth
              label='Caption Name'
              value={subject}
              id='outlined-size-small'
              variant='outlined'
              size='small'
              InputProps={{
                className: classes.multilineColor,
              }}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          {/* <div className='field-container'>
            <TextareaAutosize
              label='Description'
              rowsMax={4}
              aria-label='maximum height'
              placeholder='description'
            />
          </div> */}
          <div className='field-container'>
            <TextField
            fullWidth
              label='Material required'
              id='outlined-size-small'
              value={MaterialRequired}
              variant='outlined'
              size='small'
              InputProps={{
                className: classes.multilineColor,
              }}
              onChange={(e) => setMaterialRequired(e.target.value)}
            />
          </div>
          <div
            className='field-container-button'
            onClick={() => {
              sendUpdatedData();
            }}
          >
            Save
          </div>
        </>
      )}
    </>
  );
};

export default DisplayBox;
