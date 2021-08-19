/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Pagination } from '@material-ui/lab';

import Box from '@material-ui/core/Box';
import { withRouter } from 'react-router-dom';
// import { connect } from 'react-redux';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import MobileDatepicker from '../Teacher/datePicker';

// import PendingReview from './PendingReview';
import GridListPublish from './gridListPublish';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';

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
  },
});
class PrincipalPublishBlogView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      pageNo: 1,
      pageSize: 6,
      status: [4],
      moduleId: 115,
      endDate: moment().format('YYYY-MM-DD'),
      startDate: this.getDaysBefore(moment(), 6),
    };
  }
  componentDidMount() {
    let { status } = this.state;
    this.getBlog(status);
  }
  getBlog = (status) => {
    // const { pageNo, pageSize ,tabValue,moduleId} = this.state;
    const { pageNo, pageSize, tabValue, startDate, endDate, moduleId } = this.state;
    axios
      .get(
        `${
          endpoints.blog.Blog
        }?page_number=${pageNo}&page_size=${pageSize}&status=${status}&module_id=${moduleId}&published_level=${
          tabValue + 1
        }&start_date=${startDate}&end_date=${endDate}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          this.setState({
            data: result.data.result.data,
            totalBlogs: result.data.result.total_blogs,
          });
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {});
  };
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
  };

  handleEndDateChange = (date) => {
    const startDate = this.getDaysBefore(date.clone(), 6);
    this.setState({ startDate });
    this.setState({ endDate: date.format('YYYY-MM-DD') });
  };

  handleTabChange = (event, newValue) => {
    let { status } = this.state;
    this.setState({ tabValue: newValue, data: [] }, () => {
      this.getBlog(status);
    });
  };
  handlePagination = (event, page) => {
    let { tabValue, status } = this.state;
    this.setState({ pageNo: page }, () => {
      this.getBlog(status);
    });
  };
  handleFilter = () => {
    const { pageNo, pageSize, tabValue, startDate, endDate, status, moduleId } =
      this.state;
    axios
      .get(
        `${
          endpoints.blog.Blog
        }?page_number=${pageNo}&page_size=${pageSize}&status=${status}&module_id=${moduleId}&published_level=${
          tabValue + 1
        }&start_date=${startDate}&end_date=${endDate}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          this.setState({
            data: result.data.result.data,
            totalBlogs: result.data.result.total_blogs,
          });
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {});
  };

  render() {
    const { classes } = this.props;
    const { tabValue, data, pageSize, pageNo, totalBlogs, startDate, endDate } =
      this.state;
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
                  <Grid item>
                    <Button
                      style={{ color: 'white', margin: '20px' }}
                      color='primary'
                      size='medium'
                      variant='contained'
                      disabled={!startDate || !endDate}
                      onClick={this.handleFilter}
                    >
                      Filter
                    </Button>
                    <Button
                      style={{ margin: '20px' }}
                      onClick={() => window.history.back()}
                      className='labelColor cancelButton'
                      size='medium'
                      variant='contained'
                    >
                      Back
                    </Button>
                  </Grid>
                </Grid>
                <Grid container spacing={2}></Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <div className={classes.tabRoot}>
                      <Tabs
                        indicatorColor='primary'
                        textColor='primary'
                        value={tabValue}
                        onChange={this.handleTabChange}
                        aria-label='simple tabs example'
                      >
                        <Tab label='Orchids' {...a11yProps(0)} />
                        <Tab label='Branch' {...a11yProps(1)} />
                        <Tab label='Grade' {...a11yProps(2)} />
                        <Tab label='Section' {...a11yProps(3)} />
                      </Tabs>
                      <li style={{ listStyleType: 'none' }}>
                        <Typography
                          align='right'
                          color = "secondary"
                          className={classes.dividerInset}
                          style={{ fontWeight: 600 }}
                          display='block'
                          variant='caption'
                        >
                          Number of Blogs {totalBlogs}
                        </Typography>
                      </li>
                      <TabPanel value={tabValue} index={0}>
                        <GridListPublish
                          data={data}
                          tabValue={tabValue}
                          totalBlogs={totalBlogs}
                        />
                      </TabPanel>
                      <TabPanel value={tabValue} index={1}>
                        <GridListPublish
                          data={data}
                          tabValue={tabValue}
                          totalBlogs={totalBlogs}
                        />
                      </TabPanel>
                      <TabPanel value={tabValue} index={2}>
                        <GridListPublish
                          data={data}
                          tabValue={tabValue}
                          totalBlogs={totalBlogs}
                        />
                      </TabPanel>
                      <TabPanel value={tabValue} index={3}>
                        <GridListPublish
                          data={data}
                          tabValue={tabValue}
                          totalBlogs={totalBlogs}
                        />
                      </TabPanel>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <Pagination
                      onChange={this.handlePagination}
                      style={{ paddingLeft: '500px' }}
                      count={Math.ceil(totalBlogs / pageSize)}
                      color='primary'
                      page={pageNo}
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}
export default withRouter(withStyles(styles)(PrincipalPublishBlogView));
