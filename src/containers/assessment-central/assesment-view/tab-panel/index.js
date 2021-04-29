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
  handlePeriodList,
  tabAcademic,
  tabBranch,
  tabGradeId,
  tabSubjectId,
  tabQpValue,
  setTabValue,
  tabValue,
  setPage,
  setSelectedIndex,
}) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    handlePeriodList(
      tabAcademic,
      tabBranch,
      tabGradeId,
      tabSubjectId,
      tabQpValue,
      newValue
    );
    setValue(newValue);
    setPage(1);
    setSelectedIndex(-1);
  };
  return (
    <Paper className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor={classes.indicatorColor}
        textColor={classes.indicatorColor}
      >
        <Tab label='ALL' />
        <Tab label='Draft' />
        <Tab label='For Review' />
        <Tab label='Published' />
      </Tabs>
    </Paper>
  );
}
