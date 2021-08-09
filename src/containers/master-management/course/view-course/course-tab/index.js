import React from 'react';
import { makeStyles, Paper, Tabs, Tab } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    padding: '0.9rem',
    boxShadow: 'none',
  },
});
export default function CenteredTabs({
  handleCourseList,
  sendGrade,
  setTabValue,
  tabValue,
}) {
  const classes = useStyles();
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    handleCourseList(sendGrade, newValue);
  };
  const tabList = ['All', 'Active', 'Inactive'];
  return (
    <Paper className={classes.root}>
      <Tabs value={tabValue} onChange={handleChange}>
        {tabList.map((tab) => (
          <Tab label={tab} />
        ))}
      </Tabs>
    </Paper>
  );
}
