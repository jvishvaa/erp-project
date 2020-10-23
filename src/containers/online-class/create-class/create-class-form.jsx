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
import { useSelector } from 'react-redux';
import moment from 'moment';

import { CreateclassContext } from './create-class-context/create-class-state';
import FilterStudents from './filter-students';
import './create-class.scss';
import { emailRegExp } from './utils';

const CreateClassForm = () => {
  const [onlineClass, setOnlineClass] = useState({
    title: '',
    subject: '',
    duration: '',
    joinLimit: '',
    startDate: '',
    startTime: '',
    tutorEmail: '',
    gradeIds: [],
    sectionIds: [],
    selectedDate: moment(new Date()).format('YYYY-MM-DD'),
    selectedTime: new Date(),
    coHosts: [{}],
  });
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
  } = useContext(CreateclassContext);

  useEffect(() => {
    dispatch(listGradesCreateClass());
  }, []);

  const handleGrade = (event, value) => {
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
    if (value.length) {
      const ids = value.map((el) => el.section_id);
      setOnlineClass((prevState) => ({ ...prevState, sectionIds: ids }));
    } else {
      setOnlineClass((prevState) => ({ ...prevState, sectionIds: [] }));
    }
  };

  useEffect(() => {
    let listStudentUrl = `branch_id=1&page_number=1&page_size=5`;
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
      window.alert('Invalid email address');
    } else {
      const { tutorEmail, selectedDate, selectedTime, duration } = onlineClass;
      verifyTutorEmail(tutorEmail, selectedDate, selectedTime, duration);
    }
  };

  const handleDateChange = (event, value) => {
    dispatch(clearTutorEmailValidation());
    setOnlineClass((prevState) => ({
      ...prevState,
      selectedDate: value,
      tutorEmail: '',
    }));
  };
  const handleTimeChange = (event) => {
    const time = new Date(event);
    dispatch(clearTutorEmailValidation());
    setOnlineClass((prevState) => ({ ...prevState, selectedTime: time, tutorEmail: '' }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'duration') {
      dispatch(clearTutorEmailValidation());
      setOnlineClass((prevState) => ({ ...prevState, [name]: value, tutorEmail: '' }));
    }
    setOnlineClass((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className='create__class'>
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
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Autocomplete
            size='small'
            id='create__class-subject'
            options={subjects}
            getOptionLabel={(option) => option.subject_name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                size='small'
                className='create__class-textfield'
                {...params}
                variant='outlined'
                label='Subject'
                placeholder='Subject'
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
            onChange={handleChange}
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
              id='date-picker-inline'
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
              getOptionLabel={(option) => option.section__section_name}
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
        <h2>Co-Host</h2>
        {onlineClass.coHosts.map((el) => (
          <Grid item xs={12} sm={12} key={el}>
            <TextField
              id='class-cohost-name'
              label='Host name'
              variant='outlined'
              style={{ marginRight: 10 }}
              size='small'
            />
            <TextField
              size='small'
              id='class-cohost-email'
              label='Host email id'
              variant='outlined'
            />
          </Grid>
        ))}
      </Grid>
      <Grid container className='create-class-container' spacing={2}>
        <Button
          onClick={() => {
            setOnlineClass((prevState) => ({
              ...prevState,
              coHosts: [...prevState.coHosts, {}],
            }));
          }}
          variant='outlined'
          color='primary'
          size='large'
          startIcon={<AddIcon />}
        >
          Add another
        </Button>
      </Grid>
      <Grid container className='create-class-container' spacing={2}>
        <Button variant='contained' color='primary' size='large' startIcon={<AddIcon />}>
          Create class
        </Button>
      </Grid>
    </div>
  );
};

export default CreateClassForm;
