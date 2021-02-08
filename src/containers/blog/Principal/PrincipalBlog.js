/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid, Button ,Divider } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import PropTypes from 'prop-types';
import moment from 'moment';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Pagination } from '@material-ui/lab';

// import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import MobileDatepicker from '../Teacher/datePicker';
// import PendingReview from './PendingReview';
import GridList from './gridList';
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
class PrincipalBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      pageNo: 1,
      pageSize: 6,
      totalPages:0,
      startDate :moment().format('YYYY-MM-DD'),
      status :[8]
    };
  }
  componentDidMount() {
    let {status} =this.state
    this.getBlog(status);
  }
  getBlog = (status) => {
    const { pageNo, pageSize,tabValue } = this.state;
    
    axios
      .get(
        `${endpoints.blog.Blog}?page_number=${
          pageNo 
        }&page_size=${pageSize}&status=${status}&module_id=115`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          this.setState({ data: result.data.result.data ,totalBlogs:result.data.result.total_blogs});
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
      });
  };
  getDaysAfter = (date, amount) => {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  };
  
  PublishBlogNav = () => {
    this.props.history.push({
      pathname: '/blog/principal/publish/view',
      state: { gradeId: 'hello' },
    });
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
    this.setState({ endData: date.format('YYYY-MM-DD') });
  };

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue ,data:[], pageNo:1, pageSize:6});
    if(newValue === 0){
      this.setState({tabValue: newValue ,data:[], pageNo:1, pageSize:6,status: 8 }, ()=>{
        this.getBlog(this.state.status);

      })
    }
    else{
      this.setState({tabValue: newValue ,data:[], pageNo:1, pageSize:6,status: [3,5,7,6] }, ()=>{
        this.getBlog(this.state.status);

      })
    }
  };
  handlePagination = (event, page) => {
    let {tabValue} = this.state
    if (tabValue === 0){
      this.setState({data:[], pageNo:page, pageSize:6,status: 8 }, ()=>{
        this.getBlog(this.state.status);

      })
    }else{
      this.setState({data:[], pageNo:page, pageSize:6,status: [3,5,6,7] }, ()=>{
        this.getBlog(this.state.status);

      })

    }
};


  render() {
    const { classes } = this.props;
    const { tabValue ,data,pageNo,pageSize,totalBlogs} = this.state;
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
                  {/* <Grid item xs={12} sm={4}>
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
                  </Grid> */}
                </Grid>
                <div style={{ margin: '20px' }}>
                  <Grid container>
                    <Grid item>
                      <Button
                        color='primary'
                        style={{ fontSize: 'small', margin: '20px' }}
                        size='small'
                        variant='contained'
                      >
                        Clear All
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        style={{ fontSize: 'small', margin: '20px' }}
                        color='primary'
                        size='small'
                        variant='contained'
                      >
                        Filter
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button
                        color='primary'
                        style={{ fontSize: 'small', margin: '20px' }}
                        size='small'
                        variant='contained'
                        onClick={this.PublishBlogNav}

                      >
                        Published Blogs
                      </Button>
                    </Grid>

                    {/* <Grid item>
                      <Button
                        style={{ fontSize: 'small', margin: '20px' }}
                        color='primary'
                        size='small'
                        variant='contained'
                      >
                        Blog Dashboard
                      </Button>
                    </Grid> */}
                  </Grid>
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
                          <Tab label='Pending Review' {...a11yProps(0)} />
                          <Tab label='Reviewed' {...a11yProps(1)} />
                        </Tabs> <Divider variant='middle' />
                        <li style={{ listStyleType: 'none' }}>
                          <Typography
                            align='right'
                            className={classes.dividerInset}
                            style={{ font: '#014b7e', fontWeight: 600 }}
                            display='block'
                            variant='caption'
                          >
                            Number of Blogs {totalBlogs}
                          </Typography>
                        </li>
                        <TabPanel value={tabValue} index={0}>
                          <GridList data={data} tabValue={tabValue}/>
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                        <GridList data={data}  tabValue={tabValue}/>
                        </TabPanel>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                    <Pagination
                    onChange={this.handlePagination}
                    style={{ paddingLeft:'390px' }}
                    count={Math.ceil(totalBlogs / pageSize)}
                    color='primary'
                    page={pageNo}
                            />
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
export default withRouter(withStyles(styles)(PrincipalBlog));
