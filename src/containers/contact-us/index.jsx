import React, { useState, useEffect, useContext } from 'react';
import Layout from '../Layout/index';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { Grid, makeStyles, AppBar, Box, Typography, Tabs, Tab } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loader from '../../components/loader/loader';
import PropTypes from 'prop-types';
import AddContact from './AddContact';
import UpdateContact from './UpdateContact';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',
    borderRadius: '10px',
    width: '100%',
    margin: '1.5rem -0.1rem',
    // marginLeft:'10px',
    // border:'1px solid black'
  },
  bord: {
    margin: theme.spacing(1),
    border: 'solid lightgrey',
    borderRadius: 10,
  },
  title: {
    fontSize: '1.1rem',
  },

  content: {
    fontSize: '20px',
    marginTop: '2px',
  },
  contentData: {
    fontSize: '12px',
  },
  contentsmall: {
    fontSize: '15px',
  },
  textRight: {
    textAlign: 'right',
  },
  paperSize: {
    width: '300px',
    height: '670px',
    borderRadius: '10px',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ContactUs = () => {
  const history = useHistory();

  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Layout>
      <div style={{ marginTop: '20px', marginLeft: '-10px' }}>
        <CommonBreadcrumbs componentName='Contact Us' />
      </div>
      <Grid container direction='row' className={classes.root} spacing={3}>
        <AppBar position='static' style={{ color: 'white' }}>
          <Tabs value={value} onChange={handleChange} aria-label='simple tabs example'>
            <Tab label='POST CONTACT NUMBER' {...a11yProps(0)} />
            <Tab label='UPDATE CONTACT NUMBER' {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <AddContact />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UpdateContact />
        </TabPanel>
      </Grid>
      {/* {loading && <Loader />} */}
    </Layout>
  );
};

export default ContactUs;
