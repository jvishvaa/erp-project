import React from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import GetAppIcon from '@material-ui/icons/GetApp';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

const ViewClassManagementFilters = () => {
  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
  ];

  return (
    <div className='filters__container'>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Autocomplete
            multiple
            id='tags-outlined'
            options={top100Films}
            getOptionLabel={(option) => option.title}
            // defaultValue={[top100Films[1]]}
            filterSelectedOptions
            size='small'
            renderInput={(params) => (
              <TextField
                className='create__class-textfield'
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...params}
                variant='outlined'
                label='Subject'
                placeholder='Subject'
                color='primary'
              />
            )}
          />
        </Grid>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid item xs={12} sm={2}>
            <KeyboardDatePicker
              size='small'
              color='primary'
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
        </MuiPickersUtilsProvider>
        <Grid item xs={12} sm={2}>
          <Button className='viewclass__management-btn' variant='contained' disabled>
            Clear all
          </Button>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            className='viewclass__management-btn'
            variant='contained'
            color='primary'
          >
            get classes
          </Button>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            className='viewclass__management-btn'
            startIcon={<GetAppIcon />}
            variant='outlined'
            color='primary'
          >
            bulk excel
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewClassManagementFilters;
