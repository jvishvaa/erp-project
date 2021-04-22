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
import Autocomplete from '@material-ui/lab/Autocomplete';

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
      selectedBranch :'',
      selectedGrade:'',
      selectedSection:'',
      branchList:[],
      gradeList:[],
      sectionList:[],
      selectedYear :'',
      AcadYearList:[],

      tabValue: 0,
      pageNo: 1,
      pageSize: 6,
      totalPages:0,
      status :[8],
      moduleId :115,
      endDate :moment().format('YYYY-MM-DD'),
      startDate: this.getDaysBefore(moment(), 6)

    };
  }
  componentDidMount() {
    let {status} =this.state
    this.getBlog(status);
    this.getAcadYear();

  }
  getAcadYear = () =>{
    let {moduleId} =this.state
    axios
      .get(`/erp_user/list-academic_year/?module_id=${moduleId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          this.setState({ AcadYearList: result.data.data });
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
      });
  }
  
  handleFilter = () => {
    const { pageNo, pageSize ,tabValue,status,selectedBranch,selectedGrade,selectedSection,moduleId,startDate,endDate} = this.state
    let urlPath = ''
    if(selectedSection){
      urlPath = `${endpoints.blog.Blog}?page_number=${
              pageNo 
            }&page_size=${pageSize}&status=${status}&module_id=${moduleId}&section_id=${selectedSection.section_id}&start_date=${startDate}&end_date=${endDate}&branch_id=${selectedBranch?.branch.id}&grade_id=${selectedGrade.grade_id}`
    }else if(selectedGrade){
      urlPath = `${endpoints.blog.Blog}?page_number=${
              pageNo 
            }&page_size=${pageSize}&status=${status}&module_id=${moduleId}&grade_id=${selectedGrade.grade_id}&start_date=${startDate}&end_date=${endDate}&branch_id=${selectedBranch?.branch.id}`
    }
    else if(selectedBranch){
      urlPath =`${endpoints.blog.Blog}?page_number=${
              pageNo 
            }&page_size=${pageSize}&status=${status}&module_id=${moduleId}&branch_id=${selectedBranch?.branch.id}&start_date=${startDate}&end_date=${endDate}`
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
  getGrade = () => {
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  
     let {selectedBranch, moduleId,gradeList,selectedYear}=this.state
      axios
        .get(
          
    `${endpoints.communication.grades}?branch_id=${selectedBranch?.branch.id}&module_id=${moduleId}&session_year=${selectedYear.id}`,
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
    
       let {selectedBranch, moduleId,gradeList,selectedGrade,selectedYear}=this.state
        axios
          .get(
            
            `${endpoints.communication.sections}?branch_id=${
              selectedBranch?.branch.id            }&grade_id=${selectedGrade.grade_id}&module_id=${moduleId}&session_year=${selectedYear.id}`,
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
  getBranch = () => {
    let {moduleId,selectedYear} =this.state

    axios
      .get(
        `${endpoints.communication.branches}?module_id=${moduleId}&session_year=${selectedYear.id}`
        )
      .then((result) => {
        if (result.data.status_code === 200) {
          this.setState({ branchList: result.data.data.results});
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
      });
  };
  handleYear = (event, value) => {
    console.log(value,"@@@@@@@@@@@@")
    this.setState({data:[],selectedYear:value,selectedBranch:'',selectedGrade:'',selectedSection:''},()=>{
      this.getBranch()
    })
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
    this.setState({ endDate: date.format('YYYY-MM-DD') });
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
handleBranch = (event, value) => {
  this.setState({data:[],selectedBranch:value,selectedSection:'',selectedGrade:''},()=>{
    this.getGrade()
  })
};

handleGrade = (event, value) => {
  this.setState({data:[],selectedGrade:value,selectedSection:''}, ()=>{
    this.getSection()
  })
};
handleSection = (event,value) =>{

  this.setState({data:[],selectedSection :value})
}
clearSelection = () => {
  let {status}=this.state
  this.setState({ selectedYear:'',  selectedBranch :'',
  selectedGrade:'',
  selectedSection:'',
}
  , () => {
    this.getBlog
    (status)
  }
  )
}

  render() {
    const { classes } = this.props;
    const {startDate,endDate,branchList, tabValue ,data,pageNo,pageSize,totalBlogs,selectedBranch,selectedGrade,gradeList,sectionList,selectedSection,selectedYear,AcadYearList} = this.state;

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
                <Grid xs={12} sm={3} item>
<div className='blog_input'>
      <Autocomplete
        size='small'
        style={{ width: '100%' }}

        onChange={this.handleYear}
        value={selectedYear}
        disableClearable
        id='message_log-branch'
        className='create_group_branch'
        options={AcadYearList || []}
        getOptionLabel={(option) => option?.session_year || ''}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            className='message_log-textfield'
            {...params}
            variant='outlined'
            label='Academic Year'
            placeholder='Academic Year'
          />
        )}
      />
      </div>
      </Grid>      

             
                <Grid xs={12} sm={3} item>
              <div className='blog_input'>
                    <Autocomplete
                      size='small'
                      style={{ width: '100%' }}

                      onChange={this.handleBranch}
                      value={selectedBranch}
                      id='message_log-branch'
                      className='create_group_branch'
                      options={branchList || []}
                      getOptionLabel={(option) => option?.branch?.branch_name || ''}
              
                      disableClearable
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
                       style={{ width: '100%' }}
                       disableClearable
                       onChange={this.handleGrade}
                       value={selectedGrade}
                       id='message_log-branch'
                       className='create_group_branch'
                       options={gradeList || []}
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
                        style={{ width: '100%' }}
 
                        onChange={this.handleSection}
                        value={selectedSection}
                        id='message_log-branch'
                        disableClearable
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
                    <Grid item xs={12} sm={4}>
                    <div className='mobile-date-picker'>
                      <MobileDatepicker
                        onChange={(date) => this.handleEndDateChange(date)}
                        handleStartDateChange={this.handleStartDateChange}
                        handleEndDateChange={this.handleEndDateChange}
                      />
                    </div>
                  </Grid>
                    {/* <Grid item xs={12} sm={3}> */}
                      <Button
          style={{ fontSize: 'small', margin: '20px',width:'100px',height:'30px',marginTop:'30px' }}
          color='primary'
                        size='small'
                        variant='contained'
                        disabled={!startDate ||!endDate}
                        onClick={this.handleFilter}

                      >
                        Filter
                      </Button> 
                      <Grid>
                      <Button
          style={{ fontSize: 'small', margin: '20px',width:'100px',height:'30px',marginTop:'30px' }}
          onClick={this.clearSelection}
          variant='contained'
          color='primary'
                    size='small'
                  >
            Clear
                  </Button>
</Grid>
                    {/* </Grid> */}
                    {/* <Grid item xs={12} sm ={3}> */}
                      <Button
                        color='primary'
                        style={{ fontSize: 'small', margin: '20px',width:'200px',height:'33px',marginTop:'30px' }}
                        size='small'
                        variant='contained'
                        onClick={this.PublishBlogNav}

                      >
                        Published Blogs
                      </Button>
                    {/* </Grid> */}
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
                          <GridList data={data} tabValue={tabValue} totalBlogs={totalBlogs}/>
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                        <GridList data={data}  tabValue={tabValue} totalBlogs={totalBlogs}/>
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
        </Layout>
      </div>
    );
  }
}
export default withRouter(withStyles(styles)(PrincipalBlog));
