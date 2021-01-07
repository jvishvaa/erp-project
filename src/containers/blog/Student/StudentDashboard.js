/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid, Button, Divider } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import MobileDatepicker from './datePicker';
import PendingReview from './PendingReview';
import GridList from '../Components/gridList';

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
const styles = (theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  tabRoot: {
    width: '100%',
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
    // margin: '20px',
  },
});
class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
    };
  }

  getDaysAfter = (date, amount) => {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  };

  getDaysBefore = (date, amount) => {
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  };

  handleStartDateChange = (date) => {
    const endDate = this.getDaysAfter(date.clone(), 6);
    this.setState({ endDate });
    this.setState({ startDate: date.format('YYYY-MM-DD') });
    // getTeacherHomeworkDetails(2, date, endDate);
  };

  handleEndDateChange = (date) => {
    const startDate = this.getDaysBefore(date.clone(), 6);
    this.setState({ startDate });
    this.setState({ endData: date.format('YYYY-MM-DD') });
    // getTeacherHomeworkDetails(2, startDate, date);
  };

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  render() {
    const { classes } = this.props;
    const { tabValue } = this.state;
    const arr = [
      {
        title: 'Title 1',
        Data: '25.12.1997',
      },
      {
        title: 'Title 2',
        Data: '03.12.1997',
      },
      {
        title: 'Messi = Goat',
        Data: '03.12.1997',
      },
      {
        title: 'Title 4',
        Data: '25.12.1997',
      },
      {
        title: 'Title 6',
        Data: '03.12.1997',
      },
      {
        title: 'Messi is Goat',
        Data: '03.12.1997',
      },
    ];
    return (
      <div className='layout-container-div'>
        <Layout className='layout-container'>
          <div className='message_log_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
            <div
              className='message_log_breadcrumb_wrapper'
              style={{ backgroundColor: '#F9F9F9' }}
            >
              <CommonBreadcrumbs componentName='Blog' />
              <div className='create_group_filter_container'>
                <Grid container>
                  <Grid item xs={12} sm={4}>
                    <div className='mobile-date-picker'>
                      <MobileDatepicker
                        onChange={(date) => this.handleEndDateChange(date)}
                        handleStartDateChange={this.handleStartDateChange}
                        handleEndDateChange={this.handleEndDateChange}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <div className='blog_input'>
                      <TextField
                        id='outlined-full-width'
                        label='Blog Name'
                        size='small'
                        placeholder='Placeholder'
                        helperText='Full width!'
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant='outlined'
                      />
                    </div>
                  </Grid>
                </Grid>
                <div style={{ margin: '20px' }}>
                  <Grid container>
                    <Grid item>
                      <Button
                        color='primary'
                        style={{ fontSize: 'small', margin: '20px', width: 150 }}
                        size='small'
                        variant='contained'
                      >
                        Clear All
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        style={{ fontSize: 'small', margin: '20px', width: 150 }}
                        color='primary'
                        size='small'
                        variant='contained'
                      >
                        Filter
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        style={{ fontSize: 'small', margin: '20px', width: 150 }}
                        color='primary'
                        size='small'
                        variant='contained'
                      >
                        Published Blogs
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div className={classes.tabRoot}>
                        {/* <AppBar position='static'> */}
                        <Tabs
                          indicatorColor='primary'
                          textColor='primary'
                          value={tabValue}
                          onChange={this.handleTabChange}
                          aria-label='simple tabs example'
                        >
                          <Tab label='Published' {...a11yProps(0)} />
                          <Tab label='Reviewed' {...a11yProps(1)} />
                          <Tab label='Drafted' {...a11yProps(2)} />
                          <Tab label='Deleted' {...a11yProps(3)} />
                        </Tabs>
                        <Divider variant='middle' />
                        <li style={{ listStyleType: 'none' }}>
                          <Typography
                            align='right'
                            className={classes.dividerInset}
                            style={{ font: '#014b7e', fontWeight: 600 }}
                            display='block'
                            variant='caption'
                          >
                            Number of Blogs
                          </Typography>
                        </li>
                        {/* </AppBar> */}
                        <TabPanel value={tabValue} index={0}>
                          <GridList arr={arr} />
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                          Item Two
                        </TabPanel>
                        <TabPanel value={tabValue} index={2}>
                          Item Three
                        </TabPanel>
                        <TabPanel value={tabValue} index={3}>
                          Item Four
                        </TabPanel>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}
export default withStyles(styles)(StudentDashboard);
