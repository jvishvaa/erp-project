import React from 'react';
import Box  from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';


const DefaultDashboard = () => {
  const schoolDetails = JSON.parse(localStorage.getItem('schoolDetails'));
  return (
    <Box pt={5} style={{width: '75%'}}>
      <Typography variant="h4">
        Welcome to
      </Typography>
      <Typography variant="h3" color="secondary">
        {schoolDetails?.school_name}
      </Typography>
      <Typography variant="h6">
        A one stop information management system for {schoolDetails?.school_name} to manage all teacher and student activities and resources.
      </Typography>
    </Box>
  );
};

export default DefaultDashboard;
