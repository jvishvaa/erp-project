import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
  root: {
    padding: '0.9rem',
    borderRadius: '10px',
    boxShadow: 'none',
    color: '#014e7b',
  },
});

export default function CenteredTabs({
  setTabValue,
  tabValue,
  setPage
}) {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };
  
  return (
    <Paper className={classes.root}>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        indicatorColor={classes.indicatorColor}
        textColor={classes.indicatorColor}
      >
        <Tab label='All' />
        <Tab label='Draft' />
        <Tab label='Published' />
        <Tab label='For Review' />
      </Tabs>
    </Paper>
  );
}
