/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid, Button, Divider } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import { withRouter } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import { connect } from 'react-redux';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { Pagination } from '@material-ui/lab';

import MobileDatepicker from './datePicker';
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
    // backgroundColor: theme.palette.background.paper,
    // margin: '20px',
  },
});
const statusTypeChoicesOne=[ { label: 'Revision', value: '5' },
  { label: 'Pending Review', value: '8' },

  ] 
const statusTypeChoicesTwo =[ 
{ label: 'Reviewed', value: '3' },
{ label: 'Published', value: '4' }

] 



class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      pageNo: 1,
      pageSize: 6,
      status:[8,5],
      moduleId:112,
      endDate :moment().format('YYYY-MM-DD'),
      startDate: this.getDaysBefore(moment(), 6)

    };

  }

  componentDidMount() {
    let {status} =this.state
    this.getBlog(status);
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
  };
  handlePagination = (event, page) => {
    let {tabValue,status} = this.state

    
    if(tabValue === 0){
      this.setState({status:[8,5],pageNo:page},()=>{
        this.getBlog(status)})
    }
    else if (tabValue === 1){
      this.setState({status:[3,7,6,4],pageNo:page},()=>{
        this.getBlog(status)})
    }
    else if (tabValue === 2){
      
      this.setState({status: [2],pageNo:page},()=>{
        this.getBlog(status)})
    }else if (tabValue === 3){
      this.setState({status:[1],pageNo:page},()=>{
        this.getBlog(status)})
      
    }


   
};

  handleEndDateChange = (date) => {
    const startDate = this.getDaysBefore(date.clone(), 6);
    this.setState({ startDate });
    this.setState({ endDate: date.format('YYYY-MM-DD') });
  };

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue, pageNo:1, pageSize:6});
    if(newValue === 0){
      this.setState({status:[8,5]},()=>{
        this.getBlog(this.state.status);
      })
    }
    else if (newValue === 1){
      this.setState({status:[3,7,6,4]},()=>{
        this.getBlog(this.state.status);
      })
    }
    else if (newValue === 2){
      this.setState({status: [2]},()=>{
        this.getBlog(this.state.status);
      })
    }else if (newValue === 3){
      this.setState({status:[1]},()=>{
        this.getBlog(this.state.status);
      })
      
    }
    
  };

  WriteBlogNav = () => {
    this.props.history.push({
      pathname: '/blog/student/write-blog',
      state: { alert: this.props.alert },
    });
  };

  getBlog = (status) => {
    const { pageNo, pageSize,tabValue,moduleId } = this.state;
   
    axios
      .get(
        `${endpoints.blog.Blog}?page_number=${
          pageNo 
        }&page_size=${pageSize}&status=${status}&module_id=${moduleId}`
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
  handleFilter = () => {
    const { pageNo, pageSize ,tabValue,startDate,endDate,status,moduleId} = this.state;
    let tabStatus= []
    if(tabValue === 0){
      tabStatus= [8,5]
    }
    else if (tabValue === 1){
      tabStatus = [3,6,4]
    }
    else if (tabValue === 2){
      tabStatus = [2]
    }else if (tabValue === 3){
      tabStatus = [1]
    }
    axios
      .get(
        `${endpoints.blog.Blog}?page_number=${
          pageNo 
        }&page_size=${pageSize}&status=${tabStatus}&module_id=${moduleId}&start_date=${startDate}&end_date=${endDate}`
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

  }
  PublishBlogNav = () => {
    this.props.history.push({
      pathname: '/blog/student/publish/view',
      state: { gradeId: 'hello' },
    });
  };
  handleStatusOne = (event, value) => {
    if (value && value.value){
      this.setState({status:value.value}
        ,()=>{
        this.getBlog(this.state.status)
      }
      )
    }
    else{
this.setState({status:[8,5]}
  ,()=>{
  this.getBlog(this.state.status)
}
)
    }
  }
  
    handleStatusTwo = (event, value) => {
      if (value && value.value){
        this.setState({status:value.value}
          ,()=>{
          this.getBlog(this.state.status)
        }
        )
      }
      else{
  this.setState({status:[3,4,7]}
    ,()=>{
    this.getBlog(this.state.status)
  }
  )
      }
    }
  


  render() {
    const { classes } = this.props;
    const { tabValue, data ,totalBlogs ,pageNo,pageSize,startDate,endDate} = this.state;

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
                  <Grid item xs={12} sm={4}  >
                  <div className='blog_input'>
                    {tabValue === 0 ?
                  <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  disableClearable
                  onChange={this.handleStatusOne}
                  id='category'
                  required
                  disableClearable
                  options={statusTypeChoicesOne}
                  getOptionLabel={(option) => option?.label}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Status'
                      placeholder='Status'
                    />
                  )}
                /> : tabValue === 1 ?
                 <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={this.handleStatusTwo}
                id='category'
                required
                disableClearable
                options={statusTypeChoicesTwo}
                getOptionLabel={(option) => option?.label}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Status'
                    placeholder='Status'
                  />
                )}
              /> :'' }
                  
            </div>
          </Grid>
                </Grid>
                <div style={{ margin: '20px' }}>
                  <Grid container>
                    {/* <Grid item>
                      <Button
                        color='primary'
                        style={{ fontSize: 'small', margin: '20px', width: 150 }}
                        size='small'
                        variant='contained'
                      >
                        Clear All
                      </Button>
                    </Grid> */}
                    <Grid item>
                      <Button
                        style={{ fontSize: 'small', margin: '20px', width: 150 }}
                        color='primary'
                        size='small'
                        variant='contained'
                        disabled ={!startDate || !endDate}
                        onClick={this.handleFilter}

                      >
                        Filter
                      </Button>
                    </Grid>
                   
                    <Grid item>
                      <Button
                        color='primary'
                        style={{ fontSize: 'small', margin: '20px', width: 150 }}
                        size='small'
                        variant='contained'
                        onClick={this.PublishBlogNav}

                      >
                        Published Blogs
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        style={{ fontSize: 'small', margin: '20px', width: 150 }}
                        color='primary'
                        size='small'
                        onClick={this.WriteBlogNav}
                      >
                        Create New
                      </Button>
                    </Grid>
                   
                  </Grid>
                  <Divider variant='middle' />
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
                          <Tab label='Pending Review' {...a11yProps(0)} />
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
                            Number of Blogs {totalBlogs}
                          </Typography>
                        </li>
                        {/* </AppBar> */}
                        <TabPanel value={tabValue} index={0}>
                          {data && <GridList data={data} totalBlogs={totalBlogs} tabValue={tabValue}/>}
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                        {data && <GridList data={data} totalBlogs={totalBlogs} tabValue={tabValue}  />}
                        </TabPanel>
                        <TabPanel value={tabValue} index={2}>
                          {data && <GridList data={data} totalBlogs={totalBlogs} tabValue={tabValue}  />}
                        </TabPanel>
                        <TabPanel value={tabValue} index={3}>
                          {data && <GridList data={data}  totalBlogs={totalBlogs} tabValue={tabValue} />}
                        </TabPanel>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                    <Pagination
                    onChange={this.handlePagination}
                    style={{ paddingLeft:'500px' }}
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
export default withRouter(withStyles(styles)(StudentDashboard));
