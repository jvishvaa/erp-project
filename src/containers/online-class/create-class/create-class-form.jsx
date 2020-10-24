/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  SwipeableDrawer,
  CircularProgress,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import AddIcon from '@material-ui/icons/Add';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { CreateclassContext } from './create-class-context/create-class-state';
import FilterStudents from './filter-students';
import {
  emailRegExp,
  getFormatedTime,
  initialFormStructure,
  isBetweenNonSchedulingTime,
} from './utils';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './create-class.scss';

const CreateClassForm = () => {
  const [onlineClass, setOnlineClass] = useState(initialFormStructure);
  const [formKey, setFormKey] = useState(new Date());
  const [sectionSelectorKey, setSectionSelectorKey] = useState(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { subjects = [] } = useSelector((state) => state.academic);
  const {
    listGradesCreateClass,
    listSectionsCreateClass,
    listStudents,
    dispatch,
    verifyTutorEmail,
    clearTutorEmailValidation,
    isTutorEmailValid,
    isValidatingTutorEmail,
    grades = [],
    sections = [],
    clearFilteredStudents,
    filteredStudents,
    createNewOnlineClass,
    creatingOnlineClass,
    isCreated,
    resetContext,
  } = useContext(CreateclassContext);
  const { setAlert } = useContext(AlertNotificationContext);

  useEffect(() => {
    dispatch(listGradesCreateClass());
  }, []);

  useEffect(() => {
    if (isCreated) {
      setFormKey(new Date());
      setAlert('success', 'Successfully created the class');
      setOnlineClass((prevState) => ({
        ...prevState,
        ...initialFormStructure,
        coHosts: [{ email: '' }],
      }));
      dispatch(resetContext());
      dispatch(listGradesCreateClass());
    }
  }, [isCreated]);

  const handleGrade = (event, value) => {
    dispatch(clearFilteredStudents());

    if (value.length) {
      const ids = value.map((el) => el.grade_id);
      setOnlineClass((prevState) => ({ ...prevState, gradeIds: ids }));
      dispatch(listSectionsCreateClass(ids));
    } else {
      setOnlineClass((prevState) => ({ ...prevState, gradeIds: [] }));
    }
    setOnlineClass((prevState) => ({ ...prevState, sectionIds: [] }));

    setSectionSelectorKey(new Date());
  };

  const handleSection = (event, value) => {
    dispatch(clearFilteredStudents());
    if (value.length) {
      const ids = value.map((el) => el.id);
      setOnlineClass((prevState) => ({ ...prevState, sectionIds: ids }));
    } else {
      setOnlineClass((prevState) => ({ ...prevState, sectionIds: [] }));
    }
  };

  const handleSubject = (event, value) => {
    if (value) setOnlineClass((prevState) => ({ ...prevState, subject: value.id }));
  };

  useEffect(() => {
    let listStudentUrl = `branch_id=1`;
    const { gradeIds, sectionIds } = onlineClass;
    if (gradeIds.length && !sectionIds.length) {
      listStudentUrl += `&grade_id=${gradeIds.join(',')}`;
    } else if (gradeIds.length && sectionIds.length) {
      listStudentUrl += `&grade_id=${gradeIds.join(',')}&section_id=${sectionIds.join(
        ','
      )}`;
    }
    dispatch(listStudents(listStudentUrl));
  }, [onlineClass.gradeIds, onlineClass.sectionIds]);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  const handleTutorEmail = (event) => {
    const { value } = event.target;
    setOnlineClass((prevState) => ({ ...prevState, tutorEmail: value }));
  };

  const handleBlur = (e) => {
    const isValidEmail = e.target.value.match(emailRegExp);
    if (!isValidEmail || onlineClass.tutorEmail === '') {
      setAlert('error', 'Invalid email address');
    } else {
      const { tutorEmail, selectedDate, selectedTime, duration } = onlineClass;
      verifyTutorEmail(tutorEmail, selectedDate, selectedTime, duration);
    }
  };

  const handleDateChange = (event, value) => {
    const isFutureTime = onlineClass.selectedTime > new Date();
    if (!isFutureTime) {
      setOnlineClass((prevState) => ({ ...prevState, selectedTime: new Date() }));
    }
    dispatch(clearTutorEmailValidation());
    setOnlineClass((prevState) => ({
      ...prevState,
      selectedDate: value,
      tutorEmail: '',
    }));
  };
  const handleTimeChange = (event) => {
    const { selectedDate } = onlineClass;
    const time = new Date(event);
    // selected time should not be between 9pm and 6am
    if (isBetweenNonSchedulingTime(time)) {
      setAlert(
        'error',
        'Classes cannot be scheduled between 9PM and 6AM. Please check the Start Time.'
      );
      return;
    }

    // if the selected date is today. Selected time should always be future time
    const isFuture = new Date(event) > new Date();
    if (selectedDate === moment(new Date()).format('YYYY-MM-DD') && !isFuture) {
      setAlert(
        'error',
        'You cannot create a class for the time that has passed. Please select a future time',
        5000
      );
      return;
    }

    dispatch(clearTutorEmailValidation());
    setOnlineClass((prevState) => ({ ...prevState, selectedTime: time, tutorEmail: '' }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'duration') {
      dispatch(clearTutorEmailValidation());
      setOnlineClass((prevState) => ({ ...prevState, [name]: value, tutorEmail: '' }));
      return;
    }
    if (name === 'joinLimit' && Number(value) > 300) {
      return;
    }
    setOnlineClass((prevState) => ({ ...prevState, [name]: value }));
  };

  const removeCohost = (index) => {
    const stateCopy = onlineClass;
    const filteredItems = stateCopy.coHosts.filter((host, ind) => index !== ind);
    setOnlineClass((prevState) => ({ ...prevState, coHosts: filteredItems }));
  };

  const handleAddCohosts = () => {
    setOnlineClass((prevState) => ({
      ...prevState,
      coHosts: [...prevState.coHosts, { email: '' }],
    }));
  };

  const handleCohostEmail = (event, index) => {
    const { value } = event.target;
    const stateCopy = onlineClass;
    const hosts = stateCopy.coHosts;
    hosts[index].email = value;
    setOnlineClass((prevState) => ({ ...prevState, coHosts: hosts }));
  };

  const validateForm = (e) => {
    e.preventDefault();
    const {
      title,
      subject,
      duration,
      joinLimit,
      tutorEmail,
      gradeIds,
      sectionIds,
      selectedDate,
      selectedTime,
      coHosts,
    } = onlineClass;

    if (isBetweenNonSchedulingTime(selectedTime)) {
      setAlert(
        'error',
        'Classes cannot be scheduled between 9PM and 6AM. Please check the Start Time.'
      );
      return;
    }
    if (!isTutorEmailValid) {
      setAlert('error', 'Tutor email is not valid');
      return;
    }
    const startTime = `${selectedDate} ${getFormatedTime(selectedTime)}`;
    const tutorEmails = [tutorEmail, ...coHosts.map((el) => el.email)];

    const formdata = new FormData();
    formdata.append('title', title);
    formdata.append('duration', duration);
    formdata.append('subject_id', subject);
    formdata.append('join_limit', joinLimit);
    formdata.append('tutor_emails', tutorEmails.join(','));
    formdata.append('role', 'Student');
    formdata.append('start_time', startTime);

    // conditional appends
    if (sectionIds.length) formdata.append('section_mapping_ids', sectionIds);
    else if (gradeIds.length) {
      formdata.append('grade_ids', gradeIds);
      formdata.append('branch_ids', 1);
    } else formdata.append('branch_ids', 1);

    if (filteredStudents.length)
      formdata.append('student_ids', filteredStudents.join(','));

    dispatch(createNewOnlineClass(formdata));
  };

  return (
    <div className='create__class' key={formKey}>
      <form autoComplete='off' onSubmit={validateForm} key={formKey}>
        <Grid container className='create-class-container' spacing={2}>
          <Grid item xs={12} sm={2}>
            <TextField
              className='create__class-textfield'
              id='class-title'
              label='Title'
              variant='outlined'
              size='small'
              name='title'
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Autocomplete
              size='small'
              id='create__class-subject'
              options={subjects}
              getOptionLabel={(option) => option.subject_name}
              filterSelectedOptions
              onChange={handleSubject}
              renderInput={(params) => (
                <TextField
                  size='small'
                  className='create__class-textfield'
                  {...params}
                  variant='outlined'
                  label='Subject'
                  placeholder='Subject'
                  required
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              size='small'
              className='create__class-textfield'
              id='class-duration'
              label='Duration (minutes)'
              variant='outlined'
              type='number'
              name='duration'
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              size='small'
              className='create__class-textfield'
              id='class-join-limit'
              label='Join limit'
              variant='outlined'
              type='number'
              name='joinLimit'
              value={onlineClass.joinLimit}
              onChange={handleChange}
              placeholder='Maximum 300'
              required
            />
          </Grid>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid item xs={12} sm={2}>
              <KeyboardDatePicker
                size='small'
                disableToolbar
                variant='inline'
                format='YYYY-MM-DD'
                margin='none'
                id='date-picker'
                label='Start date'
                value={onlineClass.selectedDate}
                minDate={new Date()}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <KeyboardTimePicker
                size='small'
                margin='none'
                id='time-picker'
                label='Start time'
                value={onlineClass.selectedTime}
                onChange={handleTimeChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
        <hr />
        <Grid container className='create-class-container' spacing={2}>
          <Grid item xs={11} sm={7} md={4}>
            <TextField
              className='create__class-textfield'
              id='class-tutor-email'
              label='Tutor email'
              variant='outlined'
              size='small'
              onChange={handleTutorEmail}
              onBlur={handleBlur}
              disabled={!onlineClass.duration}
              value={onlineClass.tutorEmail}
              required
            />
            {onlineClass.tutorEmail && !onlineClass.tutorEmail.match(emailRegExp) ? (
              <span className='alert__email'>Please enter a valid email</span>
            ) : (
              ''
            )}
          </Grid>
          <Grid item xs={1} sm={4}>
            {isTutorEmailValid ? (
              <CheckCircleIcon style={{ fill: 'green', marginTop: 8 }} />
            ) : (
              ''
            )}
            {isValidatingTutorEmail ? <CircularProgress color='secondary' /> : ''}
          </Grid>
        </Grid>
        <Grid container className='create-class-container' spacing={2}>
          <Grid item>
            <Autocomplete
              multiple
              size='small'
              onChange={handleGrade}
              id='create__class-branch'
              options={grades}
              getOptionLabel={(option) => option?.grade__grade_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  className='create__class-textfield'
                  {...params}
                  variant='outlined'
                  label='Grades'
                  placeholder='Grades'
                />
              )}
            />
          </Grid>
          <Grid item>
            {onlineClass.gradeIds.length ? (
              <Autocomplete
                key={sectionSelectorKey}
                size='small'
                multiple
                onChange={handleSection}
                id='create__class-section'
                options={sections}
                getOptionLabel={(option) =>
                  `${option.grade__grade_name} ${option.section__section_name}`}
                filterSelectedOptions
                // value={[]}
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Sections'
                    placeholder='Sections'
                  />
                )}
              />
            ) : (
              ''
            )}
          </Grid>
          <Grid item>
            <Button variant='contained' color='primary' onClick={toggleDrawer}>
              Filter students
            </Button>
          </Grid>
        </Grid>
        <Grid container>
          <SwipeableDrawer
            anchor='right'
            open={isDrawerOpen}
            onClose={toggleDrawer}
            onOpen={toggleDrawer}
          >
            <FilterStudents />
          </SwipeableDrawer>
        </Grid>
        <hr />
        <Grid container className='create-class-container' spacing={2}>
          <Grid item xs={12}>
            <h2 className='co_host-title'>Co-Host</h2>
          </Grid>
          {onlineClass.coHosts.map((el, index) => (
            <>
              <Grid item xs={11} sm={5} key={el}>
                <TextField
                  size='small'
                  id='class-cohost-email'
                  label='Cohost email address'
                  variant='outlined'
                  value={el.email}
                  onChange={(event) => {
                    handleCohostEmail(event, index);
                  }}
                />
              </Grid>
              <Grid item xs={1} key={el}>
                <RemoveCircleIcon
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    removeCohost(index);
                  }}
                />
              </Grid>
            </>
          ))}
        </Grid>
        <Grid container>
          <Button
            onClick={handleAddCohosts}
            className='btn-addmore'
            variant='outlined'
            color='primary'
            size='small'
            startIcon={<AddIcon />}
          >
            Add another
          </Button>
        </Grid>
        <Grid container className='create-class-container' spacing={2}>
          <Button variant='contained' color='primary' size='large' type='submit'>
            {creatingOnlineClass ? 'Please wait.Creating new class' : 'Create class'}
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default CreateClassForm;
