/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  SwipeableDrawer,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import AddIcon from '@material-ui/icons/Add';
import { useSelector } from 'react-redux';
import { CreateclassContext } from './create-class-context/create-class-state';
import FilterStudents from './filter-students';
// import endpoints from '../../../config/endpoints';
import './create-class.scss';

const CreateClassForm = () => {
  const [hosts, setHosts] = useState([{}]);
  const [gradeIds, setGradeIds] = useState([]);
  const [sectionIds, setSectionIds] = useState([]);
  const [sectionSelectorKey, setSectionSelectorKey] = useState(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { subjects = [] } = useSelector((state) => state.academic);
  const {
    listGradesCreateClass,
    listSectionsCreateClass,
    listStudents,
    dispatch,
    grades = [],
    sections = [],
  } = useContext(CreateclassContext);

  useEffect(() => {
    dispatch(listGradesCreateClass());
  }, []);

  const handleGrade = (event, value) => {
    if (value.length) {
      const ids = value.map((el) => el.grade_id);
      setGradeIds(ids);
      dispatch(listSectionsCreateClass(ids));
    } else {
      setGradeIds([]);
    }
    setSectionIds([]);
    setSectionSelectorKey(new Date());
  };

  const handleSection = (event, value) => {
    if (value.length) {
      const ids = value.map((el) => el.section_id);
      setSectionIds(ids);
    } else {
      setSectionIds([]);
    }
  };

  useEffect(() => {
    let listStudentUrl = `branch_id=1`;
    if (gradeIds.length && !sectionIds.length) {
      listStudentUrl += `&grade_id=${gradeIds.join(',')}`;
    } else if (gradeIds.length && sectionIds.length) {
      listStudentUrl += `&grade_id=${gradeIds.join(',')}&section_id=${sectionIds.join(
        ','
      )}`;
    }
    dispatch(listStudents(listStudentUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeIds, sectionIds]);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
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
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            size='small'
            className='create__class-textfield'
            id='class-join-limit'
            label='Join limit'
            variant='outlined'
          />
        </Grid>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid item xs={12} sm={2}>
            <KeyboardDatePicker
              size='small'
              disableToolbar
              variant='inline'
              format='dddd'
              margin='none'
              id='date-picker-inline'
              label='Start date'
              //   value={selectedDate}
              //   onChange={handleDateChange}
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
              //   value={selectedDate}
              //   onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
      <hr />
      <Grid container className='create-class-container' spacing={2}>
        <Grid item xs={12} sm={2}>
          <h2>Assign to</h2>
        </Grid>
        <FormControlLabel
          control={<Checkbox checked name='checkedA' />}
          label='Parents'
        />
        <FormControlLabel
          control={<Checkbox checked name='checkedA' />}
          label='All branches, grades and section'
        />
        <FormControlLabel
          control={<Checkbox checked name='checkedA' />}
          label='Students'
        />
        <FormControlLabel
          control={<Checkbox checked={false} name='checkedA' />}
          label='Mark as optional'
        />
      </Grid>
      <hr />
      <Grid container className='create-class-container' spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            className='create__class-textfield'
            id='class-tutor-email'
            label='Tutor email'
            variant='outlined'
          />
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
          {gradeIds.length ? (
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
        {hosts.map((el) => (
          <Grid item xs={12} sm={12} key={el}>
            <TextField
              id='class-title'
              label='Host name'
              variant='outlined'
              style={{ marginRight: 10 }}
            />
            <TextField id='class-title' label='Host email id' variant='outlined' />
          </Grid>
        ))}
      </Grid>
      <Grid container className='create-class-container' spacing={2}>
        <Button
          onClick={() => {
            setHosts([...hosts, {}]);
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
