import React, { Component, useContext } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid, Button, Divider } from '@material-ui/core';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import { withRouter } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Layout from '../Layout';
import { Pagination } from '@material-ui/lab';
import Filter from './filter.jsx';
import GridList from './gridList';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import { getModuleInfo } from '../../utility-functions';
import './viewEbook.css'

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
class ViewEbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionYear: JSON.parse(sessionStorage.getItem('acad_session')),
      data: [],
      central_grade: [],
      tabValue: 0,
      pageNo: 1,
      pageSize: 9,
      moduleId: 112,
      totalEbooks: 0,
      clearFilter: '',
      acadmicYear: '',
      selectedBranch: '',
      selectedGrade: '',
      selectedSubject: '',
      selectedVolume: '',
      central_branchid: '',
    };
  }
  static contextType = AlertNotificationContext;

  componentDidMount() {
    this.handleBranchid();
  }

  handleBranchid = () => {
    axiosInstance
      .get(
        `${endpoints.communication.branches}?session_year=${
          this.state.sessionYear?.id
        }&module_id=${getModuleInfo('Ebook View').id}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          const central_branchid = result?.data?.data?.results[0]?.branch?.id;
          this.handleCentralGradeId(central_branchid);
          console.log('debug', central_branchid);
        } else {
        }
      });
  };

  handleCentralGradeId = (central_branchid) => {
    let token = JSON.parse(localStorage.getItem('userDetails')).token || {};
    axiosInstance
      .get(
        `${endpoints.ebook.getCentralGrade}?session_year=${this.state.sessionYear?.id}&branch_id=${central_branchid}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          this.setState({
            central_grade: result.data.result.login_user_central_grade_list,
          });
        } else {
          console.log(result.data.message);
        }
        this.getEbook();
      })
      .catch((error) => {
        console.log(error.message, 'err');
        if (error.message === 'Request failed with status code 402') {
          this.context.setAlert('error', 'Access Error');
        }
      });
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

  handlePagination = (event, page) => {
    let { tabValue, status } = this.state;
    if (tabValue === 0) {
      this.setState({ pageNo: page }, () => {
        this.getEbook(
          this.state.acadmicYear,
          this.state.selectedBranch,
          this.state.selectedGrade,
          this.state.selectedSubject,
          this.state.selectedVolume
        );
      });
    } else if (tabValue === 1) {
      this.setState({ pageNo: page }, () => {
        this.getEbook(
          this.state.acadmicYear,
          this.state.selectedBranch,
          this.state.selectedGrade,
          this.state.selectedSubject,
          this.state.selectedVolume
        );
      });
    } else if (tabValue === 2) {
      this.setState({ pageNo: page }, () => {
        this.getEbook(
          this.state.acadmicYear,
          this.state.selectedBranch,
          this.state.selectedGrade,
          this.state.selectedSubject,
          this.state.selectedVolume
        );
      });
    } else if (tabValue === 3) {
      this.setState({ pageNo: page }, () => {
        this.getEbook(
          this.state.acadmicYear,
          this.state.selectedBranch,
          this.state.selectedGrade,
          this.state.selectedSubject,
          this.state.selectedVolume
        );
      });
    }
  };

  handleEndDateChange = (date) => {
    const startDate = this.getDaysBefore(date.clone(), 6);
    this.setState({ startDate });
    this.setState({ endDate: date.format('YYYY-MM-DD') });
  };

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue, pageNo: 1, pageSize: 8 });
    if (newValue === 0) {
      this.setState({ tabValue: newValue, data: [] }, () => {
        this.getEbook(
          this.state.acadmicYear,
          this.state.selectedBranch,
          this.state.selectedGrade,
          this.state.selectedSubject,
          this.state.selectedVolume
        );
      });
    } else if (newValue === 1) {
      this.setState({ tabValue: newValue, data: [] }, () => {
        this.getEbook(
          this.state.acadmicYear,
          this.state.selectedBranch,
          this.state.selectedGrade,
          this.state.selectedSubject,
          this.state.selectedVolume
        );
      });
    } else if (newValue === 2) {
      this.setState({ tabValue: newValue, data: [] }, () => {
        this.getEbook(
          this.state.acadmicYear,
          this.state.selectedBranch,
          this.state.selectedGrade,
          this.state.selectedSubject,
          this.state.selectedVolume
        );
      });
    }
  };

  getEbook = (acad, branch, grade, subject, vol, customGrade) => {
    let token = JSON.parse(localStorage.getItem('userDetails')).token || {};
    const { host } = new URL(axiosInstance.defaults.baseURL);
    const hostSplitArray = host.split('.');
    const subDomainLevels = hostSplitArray.length - 2;
    let domain = '';
    let subDomain = '';
    let subSubDomain = '';
    if (hostSplitArray.length > 2) {
      domain = hostSplitArray.slice(hostSplitArray.length - 2).join('');
    }
    if (subDomainLevels === 2) {
      subSubDomain = hostSplitArray[0];
      subDomain = hostSplitArray[1];
    } else if (subDomainLevels === 1) {
      subDomain = hostSplitArray[0];
    }

    const domainTobeSent = subDomain;
    const filterAcad = `${acad ? `&academic_year=${acad?.id}` : ''}`;
    const filterBranch = `${branch ? `&branch=${branch}` : ''}`;
    let filterGrade;
    if (customGrade) {
      filterGrade = `${grade ? `&grade=[${customGrade}]` : ''}`;
    } else {
      filterGrade = `${grade ? `&grade=[${grade?.central_grade}]` : ''}`;
    }

    const filterSubject = `${subject ? `&subject=${subject}` : ''}`;
    const filterVolumes = `${vol ? `&volume=${vol?.id}` : ''}`;
    const { pageNo, pageSize, tabValue, moduleId } = this.state;
    let urlPath = '';

    if (tabValue === 0 || tabValue === 1) {
      if (filterGrade === '') {
        urlPath = `${
          endpoints.ebook.ebook
        }?domain_name=${domainTobeSent}&is_ebook=true&page_number=${pageNo}&page_size=${pageSize}&ebook_type=${
          tabValue + 1
        }&grade=[${this.state.central_grade}]`;
      } else {
        urlPath = `${
          endpoints.ebook.ebook
        }?domain_name=${domainTobeSent}&is_ebook=true&page_number=${pageNo}&page_size=${pageSize}&ebook_type=${
          tabValue + 1
        }${filterAcad}${filterBranch}${filterGrade}${filterSubject}${filterVolumes}`;
      }
    } else if (tabValue === 2) {
      urlPath = `${
        endpoints.ebook.ebook
      }?domain_name=${domainTobeSent}&is_ebook=true&page_number=${pageNo}&page_size=${pageSize}&is_delete=${'True'}${filterAcad}${filterBranch}${filterGrade}${filterSubject}${filterVolumes}`;
    }
    axiosInstance
      .get(urlPath, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          this.setState({
            data:
              result.data &&
              result.data.result &&
              result.data.result.data &&
              result.data.result.data,
            totalEbooks: result.data.result.total_ebooks,
          });
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        this.context.setAlert('error', error?.response?.data?.description);
        if (error.message === 'Request failed with status code 402') {
          this.context.setAlert('error', 'Access Error');
        }
      });
  };

  handleFilter = (acad, branch, grade, sub, vol, customGrade) => {
    this.state.pageNo = 1;
    this.state.acadmicYear = acad;
    this.state.selectedBranch = branch;
    this.state.selectedGrade = grade;
    this.state.selectedSubject = sub.central_subject;
    this.state.selectedVolume = vol;
    this.getEbook(acad, branch, grade, sub.central_subject, vol, customGrade);
  };

  handleClearFilter = () => {
    this.state.acadmicYear = '';
    this.state.selectedBranch = '';
    this.state.selectedGrade = '';
    this.state.selectedSubject = '';
    this.state.selectedVolume = '';
  };

  render() {
    const { classes } = this.props;
    const { tabValue, data, totalEbooks, pageNo, pageSize, startDate, endDate } =
      this.state;

    return (
  
        <Layout className='layout-container'>
        <div className='layout-container-div ebookscroll' style={{
        // background: 'white',
        height: '90vh',
        overflowX: 'hidden',
        overflowY: 'scroll',
      }}>
          <div
            className='message_log_wrapper'
            style={{ backgroundColor: '#F9F9F9' }}
          >
            <div style={{ backgroundColor: '#F9F9F9' }}>
              <div
                className='create_group_filter_container'
               
              >
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} style={{ textAlign: 'left' }}>
                    <CommonBreadcrumbs
                      componentName='Ebook'
                      childComponentName='View Ebook'
                      isAcademicYearVisible={true}
                    />
                  </Grid>
                  <Grid item md={12} xs={12} style={{ margin: '10px 0px' }}>
                    <Filter
                      handleFilter={this.handleFilter}
                      clearFilter={this.state.clearFilter}
                    />
                  </Grid>
                </Grid>
                <div style={{ margin: '20px' }}>
                  <Divider variant='middle' />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12} style={{ textAlign: 'center' }}>
                      <div className={classes.tabRoot}>
                        <Tabs
                          indicatorColor='primary'
                          textColor='primary'
                          value={tabValue}
                          onChange={this.handleTabChange}
                          aria-label='simple tabs example'
                        >
                          <Tab label='General' {...a11yProps(0)} />
                          <Tab label='Curriculum' {...a11yProps(1)} />
                        </Tabs>
                        <TabPanel value={tabValue} index={0}>
                          {data && (
                            <GridList
                              data={data}
                              tabValue={tabValue}
                              totalEbooks={totalEbooks}
                            />
                          )}
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                          {data && (
                            <GridList
                              data={data}
                              tabValue={tabValue}
                              totalEbooks={totalEbooks}
                            />
                          )}
                        </TabPanel>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={12} style={{ textAlign: 'center' }}>
                      {this.state.data.length > 0 && (
                        <Pagination
                          onChange={this.handlePagination}
                          count={Math.ceil(totalEbooks / pageSize)}
                          color='primary'
                          page={pageNo}
                          style={{ paddingLeft: '45%' }}
                        />
                      )}
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
          </div>
        </Layout>
      
    );
  }
}
export default withRouter(withStyles(styles)(ViewEbook));
