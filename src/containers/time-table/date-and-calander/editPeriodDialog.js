import React, { useEffect, useState, useContext } from 'react';
import { Dialog, Button, DialogActions, DialogTitle, TextField } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from '@material-ui/pickers';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

import MomentUtils from '@date-io/moment';
import moment from 'moment';
import axiosInstance from '../../../config/axios';
import { editPeriod, deletePeriod, getPeriodTypes } from './apis';
import ConfirmPopOver from '../ConfirmPopOver'

const useStyles = makeStyles((theme) => ({
  formTextFields: {
    margin: '8px',
  },
  filter: {
    color: theme.palette.secondary.main,
    fontSize: '11px',
    fontWeight: 600,
    marginRight: '4px',
    cursor: 'pointer',
  },
  addtimetablebtn: {
    backgroundColor:  `${theme.palette.v2Color2.primaryV2} !important`,
    marginTop: '5px',
    marginLeft: '12%',
    '&:hover': {
      backgroundColor:  `${theme.palette.v2Color2.primaryV2} !important`,
    },
  },
  addperiodbutton: {
    marginLeft: '77%',
    color: 'white',
  },
}));

const EditPeriodDialog = (props) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [periodTypeId, setperiodTypeId] = useState();

  const [openPeriod, setopenPeriod] = useState(false);
  const [subjectIdOption, setSubjectIdOption] = useState(null);
  const [gradeID, setGradeID] = useState(props.grade_ID);

  const [selectedStartTime, setselectedStartTime] = useState(new Date());
  const [selectedEndTime, setselectedEndTime] = useState(new Date());
  const [lectureList, setLectureList] = useState(props.lectureList);
  const [subject, setSubject] = useState();
  const [assignedTeacher, setAssignedTeacher] = useState();
  const [assignedTeacherID, setAssignedTeacherID] = useState();
  const [days, setDays] = useState();
  const [periodType, setPeriodType] = useState();
  const [isEdit, setisEdit] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState();
  const [selectedSubject, setSelectedSubject] = useState()
  const [selectedLectureType, setSelectedLectureType] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState();
  const sessionYear = JSON.parse(sessionStorage.getItem('acad_session'))

useEffect(() => {
  callingSubjectAPI();
  callingTeachersAPI();
  periodTypeList();
},[])


  useEffect(() => {
    setopenPeriod(props.isPeriodOpen);
    setSelectedTeacher({
      user_id: props?.periodDetails?.teacher_id,
      name: props?.periodDetails?.teacher_name,
    });
    setperiodTypeId(props?.periodDetails?.period_type);
    setAssignedTeacherID(props?.periodDetails?.teacher_id);
    setSelectedSubject({
        id : props?.periodDetails?.subject_mapping_id,
        subject_name : props?.periodDetails?.subject_name
    })
    setSubjectIdOption(props?.periodDetails?.subject_mapping_id)
    setDays({
      id: props?.periodDetails?.day,
      name: props?.periodDetails?.day_name,
    });
    setSelectedLectureType({
      id: props?.periodDetails?.period_type,
      type: props?.periodDetails?.period_type_name,
    });

    setselectedStartTime(new Date('2015-03-25T' + props?.periodDetails?.start_time));
    setselectedEndTime(
      `${moment(new Date('2015-03-25T' + props?.periodDetails?.end_time))}`
    );
  }, [props?.periodDetails]);
  const dayNames = [
    { name: 'Sunday', id: 6 },
    { name: 'Monday', id: 0 },
    { name: 'Tuesday', id: 1 },
    { name: 'Wednesday', id: 2 },
    { name: 'Thursday', id: 3 },
    { name: 'Friday', id: 4 },
    { name: 'Saturday', id: 5 },
  ];

  const submitResult = async () => {
    
    let data = await deletePeriod(props?.periodDetails?.id);
    if (data.status_code == 200) {
      setAlert('success', 'period Deleted Successfully');
      handleClosePeriod();
    }
  };

  const periodTypeList = async () => {
    const data = await getPeriodTypes();
    setLectureList(data?.result);
  };
  const handleSubmit = async () => {
     if(!periodTypeId){
        setAlert('Warning', 'Please Select Period Type');
    } else if(!days){
        setAlert('Warning', 'Please Select Day');
    }else {
      let obj = {
        period_type_id: periodTypeId,
        start_time: `${moment(selectedStartTime).format('HH:mm:00')}`,
        end_time: `${moment(selectedEndTime).format('HH:mm:00')}`,
        day: days.id,
        teacher_id: assignedTeacherID,
        subject_mapping_id: subjectIdOption,
        tt_id: props.ttId,
      };

      let data = await editPeriod(props?.periodDetails?.id, obj);
      if (data.status_code === 200) {
        setAlert('success', data.message);
        handleClosePeriod();
      }else {
        setAlert('warning', data?.response?.data?.developer_msg)
      }
    }
  };
  const callingSubjectAPI = () => {
    axiosInstance
      .get(`/erp_user/v2/mapped-subjects-list/?section_mapping=${props?.section_mappingId}`, {
        params: {
          session_year: sessionYear?.id,
        },
      })
      .then((res) => {
        setSubject(res.data.result);
      })
      .catch((error) => {
        setAlert('error', "can't fetch subjects");
      });
  };
  const callingTeachersAPI = () => {
    axiosInstance
      .get(`/academic/teachers-list/?section_mapping=${props?.section_mappingId}`, {
        params: {
          session_year: sessionYear?.id,
        },
      })
      .then((res) => {
        setAssignedTeacher(res.data.result);
      })
      .catch((error) => {
        setAlert('error', "can't fetch teachers list");
      });
  };

  const calendarBtnHideFix = () => {
    setTimeout(() => {
      document
        .querySelectorAll('.MuiPickersModal-dialogRoot .MuiDialogActions-root button')
        .forEach((elem) => {
          elem.classList.remove('MuiButton-textPrimary');
          elem.classList.add('MuiButton-containedPrimary');
        });
    }, 1000);
  };
  //   const handleChangeMultipleDays = (event, value) => {
  //     if (value?.length) {
  //       setDays(value);
  //     }
  //     console.log(days, 'selected days');
  //   };

  const handleClosePeriod = () => {
    setopenPeriod(false);
    props.handleperiodclose();
  };

  const handlePeriodType = (e, value) => {
    setSelectedLectureType(value);
    setperiodTypeId(value?.id);
  };
const handleSubject = (e,value) => {
    setSelectedSubject(value)
    setSubjectIdOption(value?.id)
}

  const handleEdit = () => {
    setisEdit(false);
  };

  const handleTeacher = (e, value) => {
    setSelectedTeacher(value);
    setAssignedTeacherID(value?.user_id);
  };
  return (
    <div>
      <Dialog
        open={openPeriod}
        onClose={handleClosePeriod}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='add-new-dialog-title'>{'Period Details'}</DialogTitle>
        <div className={classes.periodDialog}>
        <div className={classes.formTextFields}>
            <Autocomplete
              fullWidth
              id='combo-box-demo'
              value={selectedLectureType}
              options={lectureList || []}
              getOptionLabel={(option) => option?.type}
              onChange={handlePeriodType}
              disabled={isEdit}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  fullWidth
                  label='Period Type'
                  variant='outlined'
                />
              )}
            />
          </div>
          { (selectedLectureType?.type === "Lecture" || selectedLectureType?.type === "Examination") &&<div className={classes.formTextFields}>
            <Autocomplete
              fullWidth
              id='combo-box-demo'
              value={selectedSubject}
              options={subject || []}
              getOptionLabel={(option) => option?.subject_name}
            //   onChange={(event, option) => setSubjectIdOption(option?.id)}
            onChange={handleSubject}
            filterSelectedOptions
              disabled={isEdit}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  fullWidth
                  label='Subject'
                  variant='outlined'
                />
              )}
            />
          </div>}
          <div style={{ display: 'flex' }}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div className={classes.formTextFields}>
                {/* <Grid item xs={6} sm={6} md={6}> */}
                <TimePicker
                  onOpen={() => {
                    calendarBtnHideFix();
                  }}
                  style={{ width: 250 }}
                  autoOk
                  disabled={isEdit}
                  format='hh:mm A'
                  label='Starting Time'
                  value={selectedStartTime}
                  onChange={setselectedStartTime}
                />
                {/* </Grid> */}
              </div>
              <div className={classes.formTextFields}>
                {/* <Grid item xs={6} sm={6} md={6}> */}
                <TimePicker
                  onOpen={() => {
                    calendarBtnHideFix();
                  }}
                  autoOk
                  disabled={isEdit}
                  format='hh:mm A'
                  label='Ending Time'
                  value={selectedEndTime}
                  onChange={setselectedEndTime}
                />
                {/* </Grid> */}
              </div>
            </MuiPickersUtilsProvider>
          </div>
          { (selectedLectureType?.type === "Lecture" || selectedLectureType?.type === "Examination" || selectedLectureType?.type === "Competitions" || selectedLectureType?.type ==="Miscellaneous Event") &&<div className={classes.formTextFields}>
            <Autocomplete
              fullWidth
              id='combo-box-demo'
              value={selectedTeacher}
              options={assignedTeacher || []}
              getOptionLabel={(option) => option?.name}
              filterSelectedOptions
              disabled={isEdit}
              // onChange={(event, option) => setAssignedTeacherID(option?.user_id)}
              onChange={handleTeacher}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  fullWidth
                  label='Assigned Teacher'
                  variant='outlined'
                />
              )}
            />
          </div>}
          {/* <FormControl
                fullWidth
                  variant='outlined'
                  // size='small'
                  id='select-day'
                  className={classes.formTextFields}
                > */}
          <div className={classes.formTextFields}>
            <Autocomplete
              fullWidth
              //   multiple
              // size='small'
              // style={{ width: '100%' }}
              value={days}
              id='day'
              options={dayNames || []}
              getOptionLabel={(option) => option.name || ''}
              onChange={(e, value) => setDays(value)}
              disabled={isEdit}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  fullWidth
                  size='small'
                  label='Day'
                />
              )}
            />
          </div>
          {/* {/* </FormControl> */}
        </div>
        <DialogActions>
          <Button
            className='cancelButton labelColor'
            onClick={handleClosePeriod}
            color='primary'
          >
            Close
          </Button>
          {isEdit && props?.selectedTableId === 1 && (props?.user_level === 1 || props?.user_level === 8 ||props?.user_level === 10 || props?.is_superuser) && props?.teacherView && (
            <Button
              onClick={handleEdit}
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              autoFocus
            >
              Edit
            </Button>
          )}
          {!isEdit  && props?.selectedTableId === 1 && (
            <Button
              onClick={handleSubmit}
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              autoFocus
            >
              Save
            </Button>
          )}
          {props?.selectedTableId == 1 && (props?.user_level === 1 || props?.user_level === 8 ||props?.user_level === 10 || props?.is_superuser) && props?.teacherView && <Button
            onClick={() => {
              setConfirmMessage('delete');
              setOpenModal(true);
            }}
            color='primary'
            variant='contained'
            style={{ color: 'white' }}
            autoFocus
          >
            Delete
          </Button>}
        </DialogActions>
      </Dialog>

      {
        openModal && (
          <ConfirmPopOver
            submit={() => submitResult()}
            openModal={openModal}
            setOpenModal={setOpenModal}
            operation={confirmMessage}
          />
        )
      }
    </div>
  );
};

export default EditPeriodDialog;
