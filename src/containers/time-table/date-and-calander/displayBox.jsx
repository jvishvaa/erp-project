import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axiosInstance from '../../../config/axios';
import CloseIcon from '@material-ui/icons/Close';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import '../timetable.scss';
import { Button, Popover, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/node_modules/@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
const useStyles = makeStyles(() => ({
  multilineColor: {
    background: 'white',
    color: '#014B7E',
    fontSize: '15px',
  },
  autoCompColor: {
    background: 'white',
    color: '#014B7E',
  },
}));



const DisplayBox = (props) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [openEditForm, setOpenEditForm] = useState(true);
  const setMobileView = useMediaQuery('(min-width:800px)');
  const currDate = moment('08:09:00').format(' h:mm: a');
  const [data] = useState(props.dataOpenChange);
  const [assignedTeacherID, setAssignedTeacherID] = useState(
    props.dataOpenChange.assigned_teacher_id
  );
  const [Description, setDescription] = useState(props.dataOpenChange.period_description);
  const [startTime, setStartTime] = useState(
    props.dataOpenChange.period_start_time.slice(0, 5)
  );
  const [endTime, setEndTime] = useState(
    props.dataOpenChange.period_end_time.slice(0, 5)
  );
  const [teacherDetails, setTeacherDetails] = useState(data.teacher_name.name);
  const [assignedTeacherName, setAssignedTeacherName] = useState(
    props.dataOpenChange.teacher_name.name
  );
  const [subjetName, setSubjectName] = useState(
    props.dataOpenChange.subject_details.subject_name
  );
  const [captionName, setCaptionName] = useState(props.dataOpenChange.period_name);
  const [subjectID, setSubjectID] = useState();
  const [MaterialRequired, setMaterialRequired] = useState(
    props.dataOpenChange.required_material
  );
  const handleCloseBox = () => {
    try {
      props.handleClosePass();
    } catch (e) {
      props.handleChangeDisplayView();
    }
  };
  const sendUpdatedData = () => {
    setOpenEditForm(true);
    if (!setMobileView) {
      props.handleOpenChangeMobile(data, false);
    }
    props.handleChangeDisplayView();
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
      .put('/academic/assign_class_periods/' + data.id + '/', obj)
      .then((responce) => {
        if (responce.status === 200) {
          setAlert('success', 'Period Edited');
        }
        props.callGetAPI();
      })
      .catch((error) => {
        setAlert('error', "can't edit list");
      });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePopup = (event) => {
    setAnchorEl(true);
  }

  const handleDelete = () =>{
    axiosInstance
      .delete('/academic/delete_time_table/' + data.id + '/')
      .then((responce) => {
        if(responce.status===200){
          handleCloseBox();
          setAlert('success', 'Deleted Successfully');
        }
        props.callGetAPI();
      })
      .catch((error) => {
        setAlert('error', "can't delete");
      });
  }
  // const handleCloseBox = () =>{
  //   props.handleChangeDisplayView();
  // };
  return (
    <>
      {openEditForm ? (
        <>
          <div className='display-heading-container'>
            <div className='yellow-header'>
              {data.period_start_time.slice(0, 5)} - {data.period_end_time.slice(0, 5)}
            </div>           
            <div style={{ display: 'flex' }}></div>
            {props.teacherView ? (
              <>
                <div className='edit-button' onClick={() => setOpenEditForm(false)}>
                  <EditTwoToneIcon size='small' /> Edit
                </div>
                <div className='edit-button' onClick={() => handleDeletePopup()}>
                  <EditTwoToneIcon size='small' /> Delete
                </div>
              </>
            ) : (
              <></>
            )}
            <Dialog id={id} open={open} onClose={handleClose} anchorEl={anchorEl}>
          <DialogTitle
            id='draggable-dialog-title'
          >
            Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={(e) => handleClose()} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={handleDelete}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>      
           <div style={{color:'#ff6b6b'}}></div>
            <CloseIcon color='primary' fontSize='large' onClick={() => handleCloseBox()} />
          </div>
          <div style={{ display: 'flex' }}>
            <div className='yellow-header'>Period Name:</div>
            <h3>{data.period_name}</h3>
          </div>

          <h4>
            {data.teacher_name.name}
            {/* {data.assigned_teacher__first_name} {data.assigned_teacher__last_name} */}
          </h4>
          <div className='yellow-header'>Short description about class</div>
          <p style={{wordWrap: "break-word"}}>{data.period_description}</p>
          <div className='yellow-header'>Material Required</div>
          <p>{data.required_material}</p>
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
              InputProps={{
                className: classes.multilineColor,
              }}
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
              InputProps={{
                className: classes.multilineColor,
              }}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div className='field-container'>
            {/* <Autocomplete
              id='combo-box-demo'
              size='samll'
              fullWidth
              // item={assignedTeacherName}
              options={props.assignedTeacher}
              // getItemValue={(item) => item?.name}
              value={props.dataOpenChange.teacher_name.name || assignedTeacherName}
              // defaultValue={
              //   props.assignedTeacher &&
              //   props.assignedTeacher.find(assignedTeacherName)
              // }
              getOptionLabel={(option) => option?.name}
              style={{ width: '100%' }}
              onChange={(event, option) => setAssignedTeacherID(option?.user_id)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  fullWidth
                  label='Conducted By'
                  // label={assignedTeacherName}
                  variant='outlined'
                />
              )}
            /> */}
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={(event, option) => setAssignedTeacherID(option?.user_id)}
              id='grade'
              className='dropdownIconsession_year}'
              value={props.dataOpenChange.teacher_name}
              options={props.assignedTeacher}
              getOptionLabel={(option) => option?.name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Conducted By'
                  // style={{ width: '100%', color: '#014B7E' }}
                  placeholder='Conducted By'
                />
              )}
            />
          </div>
          <div className='field-container'>
            <Autocomplete
              id='combo-box-demo'
              size='samll'
              fullWidth
              value={props.dataOpenChange.subject_details}
              options={props.subject}
              InputProps={{
                className: classes.autoCompColor,
              }}
              getOptionLabel={(option) => option?.subject_name}
              style={{ width: '100%', color: '#014B7E' }}
              onChange={(event, option) => setSubjectID(option?.id)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  fullWidth
                  label='Subject'
                  style={{ width: '100%', color: '#014B7E' }}
                  // InputProps={{
                  //   className: classes.multilineColor,
                  // }}
                  // label={assignedTeacherName}
                  variant='outlined'
                />
              )}
            />
          </div>
          <div className='field-container'>
            <TextField
              fullWidth
              label='Description'
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
              key='Caption Name'
              label='Caption Name'
              value={captionName}
              id='outlined-size-small'
              variant='outlined'
              size='small'
              InputProps={{
                className: classes.multilineColor,
              }}
              onChange={(e) => setCaptionName(e.target.value)}
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
          <div
            className='field-container-button'
            onClick={() => {
              handleCloseBox();
            }}
          >
            <CloseIcon size='small' />
            Cancel
          </div>
        </>
      )}
    </>
  );
};

export default DisplayBox;