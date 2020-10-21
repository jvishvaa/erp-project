import React from 'react';
import { Tabs, Tab, Typography, Grid } from '@material-ui/core';
import ViewClassStudent from './view-class-student';

const ViewClassStudentCollection = () => {
  return (
    <div className='viewclass__student-collection'>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Tabs
            value={0}
            //   onChange={handleChange}
            variant='fullWidth'
            indicatorColor='primary'
            textColor='primary'
            aria-label='icon label tabs example'
          >
            <Tab label={<Typography variant='h6'>Upcoming</Typography>} />
            <Tab label={<Typography variant='h6'>Completed</Typography>} />
          </Tabs>
        </Grid>
      </Grid>

      <ViewClassStudent />
      <ViewClassStudent />
      <ViewClassStudent />
      <ViewClassStudent />
      <ViewClassStudent />
    </div>
  );
};

export default ViewClassStudentCollection;
