/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Checkbox, FormControlLabel, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import AddIcon from '@material-ui/icons/Add';
import { useSelector } from 'react-redux';
import { OnlineclassContext } from '../online-class-context/online-class-state';
import './create-class.scss';

const CreateClass = () => {
  const [hosts, setHosts] = useState([{}]);
  const [gradeIds, setGradeIds] = useState([]);
  const { subjects = [] } = useSelector((state) => state.academic);
  const {
    listGradesCreateClass,
    listSectionsCreateClass,
    dispatch,
    createOnlineClass: { grades = [], sections = [] },
  } = useContext(OnlineclassContext);

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
        <Grid item xs={12} sm={3}>
          <Autocomplete
            multiple
            onChange={handleGrade}
            id='create__class-branch'
            options={grades}
            getOptionLabel={(option) => option.grade__grade_name}
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
        <Grid item xs={12} sm={3}>
          {gradeIds.length ? (
            <Autocomplete
              multiple
              onChange={handleGrade}
              id='create__class-branch'
              options={sections}
              getOptionLabel={(option) => option.section__section_name}
              filterSelectedOptions
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
      </Grid>
      <hr />
      <Grid container className='create-class-container' spacing={2}>
        <h2>Co-Host</h2>
        {hosts.map(() => (
          <Grid item xs={12} sm={12}>
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

export default CreateClass;
