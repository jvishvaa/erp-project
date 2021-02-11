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
import Autocomplete from '@material-ui/lab/Autocomplete';

// import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
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
  },
});
class TeacherBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      pageNo: 1,
      pageSize: 6,
      totalPages:0,
      startDate :moment().format('YYYY-MM-DD'),
      status:[8],
      selectedBranch :'',
      selectedGrade:'',
      selectedSection:'',
      branchList:[],
      gradeList:[],
      sectionList:[],
      moduleId :113,
    };
  }
  componentDidMount() {
    let {status} =this.state
    this.getBlog(status);
    this.getBranch();
  }
  getBlog = (status) => {
    const { pageNo, pageSize,tabValue ,moduleId} = this.state;
    
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
  getDaysAfter = (date, amount) => {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  };
  
  PublishBlogNav = () => {
    this.props.history.push({
      pathname: '/blog/teacher/publish/view',
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
    this.setState({ endDate: date.format('YYYY-MM-DD') });
  };

  handleTabChange = (event, newValue) => {
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
      this.setState({data:[], pageNo:page, pageSize:6,status: [3,5,7,6] }, ()=>{
        this.getBlog(this.state.status);

      })

    }
    
};
handleFilter = () => {
  const { pageNo, pageSize ,tabValue,status,selectedBranch,selectedGrade,selectedSection,moduleId,startDate,endDate} = this.state
  let urlPath = ''
  if(selectedSection){
    urlPath = `${endpoints.blog.Blog}?page_number=${
            pageNo 
          }&page_size=${pageSize}&status=${status}&module_id=${moduleId}&section_id=${selectedSection.section_id}&start_date=${startDate}&end_date=${endDate}`
  }else if(selectedGrade){
    urlPath = `${endpoints.blog.Blog}?page_number=${
            pageNo 
          }&page_size=${pageSize}&status=${status}&module_id=${moduleId}&grade_id=${selectedGrade.grade_id}&start_date=${startDate}&end_date=${endDate}`
  }
  else if(selectedBranch){
    urlPath =`${endpoints.blog.Blog}?page_number=${
            pageNo 
          }&page_size=${pageSize}&status=${status}&module_id=${moduleId}&barnch_id=${selectedBranch.id}&start_date=${startDate}&end_date=${endDate}`
  }
  axios
    .get(
      urlPath
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
getBranch = () => {
   
  axios
    .get(
      `${endpoints.communication.branches}`
    )
    .then((result) => {
      if (result.data.status_code === 200) {
        this.setState({ branchList: result.data.data });
      } else {
        console.log(result.data.message);
      }
    })
    .catch((error) => {
    });
};

getGrade = () => {
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

   let {selectedBranch, moduleId,gradeList}=this.state
    axios
      .get(
        
  `${endpoints.communication.grades}?branch_id=${selectedBranch.id}&module_id=${moduleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          this.setState({ gradeList: result.data.data });
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
      });
  };

getSection = () => {
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

   let {selectedBranch, moduleId,gradeList,selectedGrade}=this.state
    axios
      .get(
        
        `${endpoints.communication.sections}?branch_id=${
          selectedBranch.id
        }&grade_id=${selectedGrade.grade_id}&module_id=${moduleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          this.setState({ sectionList: result.data.data });
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
      });
  };
handleBranch = (event, value) => {
  this.setState({data:[],selectedBranch:value},()=>{
    this.getGrade()
  })
};

handleGrade = (event, value) => {
  this.setState({data:[],selectedGrade:value}, ()=>{
    this.getSection()
  })
};
handleSection = (event,value) =>{

  this.setState({data:[],selectedSection :value})
}

  render() {
    const { classes } = this.props;
    const {startDate,endDate, tabValue ,data,pageNo,pageSize,totalBlogs,selectedBranch,selectedGrade,gradeList,sectionList,selectedSection,branchList} = this.state;
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
              <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                    <div className='mobile-date-picker'>
                      <MobileDatepicker
                        onChange={(date) => this.handleEndDateChange(date)}
                        handleStartDateChange={this.handleStartDateChange}
                        handleEndDateChange={this.handleEndDateChange}
                      />
                    </div>
                  </Grid>
<Grid xs={12} sm={3} item>
<div className='blog_input'>
      <Autocomplete
        size='small'
        // style={{ width: '100%' }}

        onChange={this.handleBranch}
        value={selectedBranch}
        id='message_log-branch'
        className='create_group_branch'
        options={branchList}
        getOptionLabel={(option) => option?.branch_name}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            className='message_log-textfield'
            {...params}
            variant='outlined'
            label='Branch'
            placeholder='Branch'
          />
        )}
      />
      </div>
      </Grid>
      <Grid xs={12} sm={3} item>
      {/* {selectedBranch && gradeList.length ? (  */}
        <div className='blog_input'>
         <Autocomplete
         size='small'
        //  style={{ width: '100%' }}

         onChange={this.handleGrade}
         value={selectedGrade}
         id='message_log-branch'
         className='create_group_branch'
         options={gradeList}
         getOptionLabel={(option) => option?.grade__grade_name}
         filterSelectedOptions
         renderInput={(params) => (
           <TextField
             className='message_log-textfield'
             {...params}
             variant='outlined'
             label='Grade'
             placeholder='Grade'
           />
         )}
       />
       </div>
        {/* ) : null } */}
      </Grid>
      <Grid xs={12} sm={3} item>
        {/* {selectedGrade && sectionList.length ? ( */}
          <div className='blog_input'>
          <Autocomplete
          size='small'
          // style={{ width: '100%' }}

          onChange={this.handleSection}
          value={selectedSection}
          id='message_log-branch'
          className='create_group_branch'
          options={sectionList}
          getOptionLabel={(option) => option?.section__section_name}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              className='message_log-textfield'
              {...params}
              variant='outlined'
              label='Section'
              placeholder='Section'
            />
          )}
        />
        </div>
        {/* ) : null} */}
       
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          style={{ fontSize: 'small', margin: '20px' }}
          color='primary'
          size='small'
          variant='contained'
          disabled={!startDate|| !endDate}
          onClick={this.handleFilter}

        >
          Filter
        </Button> 
      </Grid>
      
      </Grid>
                <div style={{ margin: '20px' }}>
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
                        <TabPanel value={tabValue} index={0}>
                          <GridList data={data} tabValue={tabValue} totalBlogs={totalBlogs}/>
                        </TabPanel>
                        <TabPanel value={tabValue}  index={1}>
                        <GridList data={data} totalBlogs={totalBlogs}  tabValue={tabValue} />
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
export default withRouter(withStyles(styles)(TeacherBlog));
