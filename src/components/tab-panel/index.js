import React from 'react';
import { Tabs, Tab } from '@material-ui/core';

const TabPanel = ({ tabValue, setTabValue, tabValues, fullWidth = false, style }) => {
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
      style={style}
      variant={fullWidth ? 'fullWidth' : ''}
      value={tabValue}
      onChange={handleChange}
    >
      {tabValues.map((value, index) => (
        <Tab label={value} {...a11yProps(index)} />
      ))}
    </Tabs>
  );
};

export default TabPanel;
