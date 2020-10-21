/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Grid, TextField, Checkbox, FormControlLabel, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import AddIcon from '@material-ui/icons/Add';
import './create-class.scss';

const CreateClass = () => {
  const [hosts, setHosts] = useState([{}]);
  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
  ];

  return (
    <div>
      <Grid container className='create-class-container' spacing={2}>
        <Grid item xs={12} sm={2}>
          <TextField
            className='create__class-textfield'
            id='class-title'
            label='Title'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Autocomplete
            multiple
            id='tags-outlined'
            options={top100Films}
            getOptionLabel={(option) => option.title}
            // defaultValue={[top100Films[1]]}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
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
            className='create__class-textfield'
            id='class-duration'
            label='Duration (minutes)'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            className='create__class-textfield'
            id='class-join-limit'
            label='Join limit'
            variant='outlined'
          />
        </Grid>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid item xs={12} sm={2}>
            <KeyboardDatePicker
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
        <Grid item xs={12} sm={1}>
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
        <Grid item xs={12} sm={2}>
          <Autocomplete
            multiple
            id='tags-outlined'
            options={top100Films}
            getOptionLabel={(option) => option.title}
            // defaultValue={[top100Films[1]]}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                className='create__class-textfield'
                {...params}
                variant='outlined'
                label='Branch'
                placeholder='Branch'
              />
            )}
          />
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
          color='secondary'
          size='large'
          startIcon={<AddIcon />}
        >
          Add another
        </Button>
      </Grid>
      <Grid container className='create-class-container' spacing={2}>
        <Button
          variant='contained'
          color='secondary'
          size='large'
          startIcon={<AddIcon />}
        >
          Create class
        </Button>
      </Grid>
    </div>
  );
};

export default CreateClass;
