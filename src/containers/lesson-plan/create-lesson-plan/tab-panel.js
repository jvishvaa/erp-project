import React from 'react';
import { Box, Typography } from '@material-ui/core';

function TabPanel(props) {
  const { children, name, value, activeTab, ...other } = props;
  console.log('name ', name, value);
  return (
    <div
      role='tabpanel'
      hidden={name !== value}
      id={`simple-tabpanel-${name}`}
      aria-labelledby={`simple-tab-${name}`}
      {...other}
      style={{ paddingTop: '20px', backgroundColor: '#fafafa' }}
    >
      {name === value && <div className='tab-panel-content-container'>{children}</div>}
    </div>
  );
}

export default TabPanel;
