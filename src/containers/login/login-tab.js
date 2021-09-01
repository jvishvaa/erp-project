import React from 'react';
import { Tabs, Tab, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  loginTab: {
    width: '100%',
    margin: '3% auto',
    borderRadius: '10px 10px 0 0',
    // backgroundColor: 'wheat',
    '& .MuiTabs-scroller': {
      // padding: '5px',
    },
  },
}));

const tabValues = ['Password', 'OTP'];

const LoginTab = ({ tabValue, setTabValue }) => {
  const classes = useStyles();
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

  return (
    <Tabs
      className={classes.loginTab}
      variant='fullWidth'
      value={tabValue}
      onChange={handleChange}
    >
      {tabValues.map((value, index) => (
        <Tab label={value} {...a11yProps(index)} />
      ))}
    </Tabs>
  );
};

export default LoginTab;
