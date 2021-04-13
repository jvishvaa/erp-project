import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axiosInstance from '../../../../config/axios';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import './time-table-display.scss';

const DisplayBox = (props) => {
  const [openEditForm, setOpenEditForm] = useState(true);
  const setMobileView = useMediaQuery('(min-width:800px)');
  const [data] = useState(props.dataOpenChange);
  const { role_details: roleDetailes } =
    JSON.parse(localStorage.getItem('navigationData')) || {};
  const [Description, setDescription] = useState(props.dataOpenChange.period_description);
  const [startTime, setStartTime] = useState(
    props.dataOpenChange.period_start_time + ' - ' + props.dataOpenChange.period_end_time
  );
  const [subject, setSubject] = useState(props.dataOpenChange.subject__subject_name);
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
      period_description: Description,
      subject: subject,
      assigned_teacher: ConductedBy,
      required_material: MaterialRequired,
      // period_description: 'New Data',
      // subject: 'Maths',
      // assigned_teacher: 'Alex',
      // required_material: 'ABC,CDE,KBC',
    };
    axiosInstance
      .post('/academic/assign_class_periods/' + data.id + '/', obj)
      .then((responce) => {
        console.log(responce);
      })
      .catch((error) => {
        console.log(error);
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
              label='Duration'
              id='outlined-size-small'
              variant='outlined'
              value={startTime}
              size='small'
              onChange={(e) => setStartTime(e.target.value)}
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
              label='Caption Name'
              value={subject}
              id='outlined-size-small'
              variant='outlined'
              size='small'
              onChange={(e) => setSubject(e.target.value)}
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
