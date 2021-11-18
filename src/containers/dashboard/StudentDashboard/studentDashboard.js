import React from 'react';
import Grid from '@material-ui/core/Grid';
import StudentLeftDashboard from './StudentLeftDashboard/StudentLeftDashboard';
import StudentRightDashboard from './StudentRightDashboard/StudentRightDashboard';
import Quote from './StudentLeftDashboard/Quote';

export default function studentDashboard() {
  return (
    <React.Fragment>
      <Grid container spacing={1} >
        <Grid item xs={12} sm={8} md={8}>
          <StudentLeftDashboard />
        </Grid>
        <Grid item sm={4} md={4}>
          <StudentRightDashboard />
        </Grid>
      </Grid>
    </React.Fragment >
  );
}
