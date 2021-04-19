import React, { useContext,useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axiosInstance from '../../../../config/axios';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import './time-table-display.scss';

const DisplayBox = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [openEditForm, setOpenEditForm] = useState(true);
  const setMobileView = useMediaQuery('(min-width:800px)');
  const [data] = useState(props.dataOpenChange);
  const { role_details: roleDetailes } =
    JSON.parse(localStorage.getItem('navigationData')) || {};
  const [Description, setDescription] = useState(props.dataOpenChange.period_description);
  const [startTime, setStartTime] = useState(props.dataOpenChange.period_start_time);
  const [endTime, setEndTime] = useState(props.dataOpenChange.period_end_time);
  const [teacherDetails, setTeacherDetails] = useState(data.teacher_name.name);
  const [assignedTeacherName, setAssignedTeacherName] = useState(
    props.dataOpenChange.teacher_name.name
  );
  const [assignedTeacherID, setAssignedTeacherID] = useState();
  const [subjectID, setSubjectID] = useState(props.dataOpenChange.subject_id);
  const [captionName, setCaptionName] = useState(props.dataOpenChange.period_name);
  const [ConductedBy, setConductedBy] = useState(
    props.dataOpenChange.teacher_name?.name
  );
  const [MaterialRequired, setMaterialRequired] = useState(
    props.dataOpenChange.required_material
  );

  useEffect(() => {}, [props.dataOpenChange, openEditForm]);
  const sendUpdatedData = () => {
    setOpenEditForm(true);
    if (!setMobileView) {
      props.handleOpenChangeMobile(data, false);
    }
    let obj = {
      period_start_time: startTime,
      period_end_time: endTime,
      period_description: Description,
      subject: subjectID,
      assigned_teacher: assignedTeacherID,
      required_material: MaterialRequired,
      period_name: captionName,
    };
    axiosInstance
      .post('/academic/assign_class_periods/' + data.id + '/', obj)
      .then((responce) => {
        if(responce.status===200){
          setAlert('success', 'Period Edited');
        }
      })
      .catch((error) => {
        
        setAlert('error', "can't edit list");
      });
  };
  return (
    <>
      {openEditForm ? (
        <>
          <div className={'display-box-mobile'}>
            <div className='display-top-container'>
              <div className='display-heading-container'>
                <div className='yellow-header-mobile'>
                  {data.period_start_time.slice(0, 5)}-{data.period_end_time.slice(0, 5)}
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
                {data.teacher_name?.name}
              </h4>
            </div>
            <div className='display-bottom-container'>
              <div className='yellow-header-mobile'>Short description about class</div>
              <p>{data.period_description}</p>
              <div className='yellow-header-mobile'>Material Required</div>
              <p>{data.required_material}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='field-container'>
            <TextField
              fullWidth
              label='Start Time'
              id='outlined-size-small'
              variant='outlined'
              value={startTime}
              size='small'
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className='field-container'>
            <TextField
              fullWidth
              label='End Time'
              id='outlined-size-small'
              variant='outlined'
              value={endTime}
              size='small'
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          {/* <div className='field-container'>
            <TextField
              label='Caption Name'
              id='outlined-size-small'
              variant='outlined'
              size='small'
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div> */}
          <div className='field-container'>
            <TextField
              label='description'
              value={Description}
              id='outlined-size-small'
              variant='outlined'
              size='small'
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className='field-container'>
            <TextField
              fullWidth
              key='Caption Name'
              label='Caption Name'
              value={captionName}
              id='outlined-size-small'
              variant='outlined'
              size='small'
              onChange={(e) => setCaptionName(e.target.value)}
            />
          </div>
          <div className='field-container'>
            <TextField
              label='Conducted by'
              value={ConductedBy}
              id='outlined-size-small'
              variant='outlined'
              size='small'
              onChange={(e) => setConductedBy(e.target.value)}
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
              label='Material required'
              id='outlined-size-small'
              value={MaterialRequired}
              variant='outlined'
              size='small'
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
