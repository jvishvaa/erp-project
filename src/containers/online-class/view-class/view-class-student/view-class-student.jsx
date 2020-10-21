import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import './view-class-student.scss';

const ViewClassStudent = () => {
  return (
    <div className='viewclass__student-container'>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={8}>
          {/*  */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant='h5' gutterBottom color='primary'>
                Bedtime Stories For Kids.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant='h6'
                gutterBottom
                color='secondary'
                className='responsive__align'
              >
                Starts In: 0d 0h 30m 17s
              </Typography>
            </Grid>
          </Grid>
          {/*  */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant='h6' gutterBottom color='secondary'>
                English
              </Typography>
              <Typography variant='h6' gutterBottom color='secondary'>
                24 may 2020 07:00 Am
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant='h6'
                gutterBottom
                color='secondary'
                className='responsive__align'
              >
                Join limit
              </Typography>
              <Typography
                variant='h6'
                gutterBottom
                color='secondary'
                className='responsive__align'
              >
                33
              </Typography>
            </Grid>
          </Grid>
          {/*  */}
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography variant='h5' gutterBottom color='secondary'>
                Class For parents
              </Typography>
              <Typography variant='subtitle1' gutterBottom color='secondary'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
                quibusdam eligendi incidunt aliquid.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Button
                className='viewclass__student-btn'
                variant='outlined'
                color='primary'
              >
                Set reminder
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                className='viewclass__student-btn'
                variant='contained'
                color='primary'
                disabled
              >
                Join Class
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                className='viewclass__student-btn'
                variant='contained'
                color='primary'
              >
                Resources
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                className='viewclass__student-btn'
                variant='outlined'
                color='primary'
              >
                Homework
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewClassStudent;
