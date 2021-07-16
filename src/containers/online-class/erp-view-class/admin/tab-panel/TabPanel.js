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
const tabValues = ['Today', 'Upcoming', 'Completed', 'Cancelled'];

export default function TabPanel({
  tabValue,
  setTabValue,
  setPage,
  setSelectedViewMore,
}) {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setPage(1);
    setTabValue(newValue);
    setSelectedViewMore('');
    localStorage.removeItem('viewMoreData');
    let data = JSON.parse(localStorage.getItem('filterData')) || '';
    localStorage.setItem('filterData', JSON.stringify({ ...data, tabValue: newValue }));
  };

  return (
    <Paper className={classes.root}>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        indicatorColor={classes.indicatorColor}
        textColor={classes.indicatorColor}
      >
        {tabValues.map((value) => (
          <Tab label={value} />
        ))}
      </Tabs>
    </Paper>
  );
}
