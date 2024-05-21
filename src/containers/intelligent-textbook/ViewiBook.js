import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid, Divider } from '@material-ui/core';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import { withRouter } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../Layout';
import { Pagination } from '@material-ui/lab';
import Filter from './filter.jsx';
import GridList from './gridList';
import axios from 'axios';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import { domain_name } from 'v2/commonDomain';
import { connect } from 'react-redux';
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

const mapStateToProps = (state) => ({
  selectedBranch: state.commonFilterReducder?.selectedBranch,
});

class ViewEbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
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
    };
  }

  componentDidMount() {
    this.getEbook();
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

  handleFilter = (acad, branch, grade, sub, vol) => {
    this.state.pageNo = 1;
    this.state.acadmicYear = acad;
    this.state.selectedBranch = branch;
    this.state.selectedGrade = grade;
    this.state.selectedSubject = sub.central_subject;
    this.state.selectedVolume = vol;
    this.getEbook(acad, branch, grade, sub.central_subject, vol);
  };

  getEbook = (acad, branch, grade, subject, vol) => {
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

    const filterSelectedBranch = `${
      acad
        ? `&acad_session_id=${acad}`
        : `&acad_session_id=${this.props.selectedBranch?.id}`
    }`;
    const filterAcad = `${acad ? `&academic_year=${acad?.id}` : ''}`;
    const filterBranch = `${branch ? `&branch=${branch}` : ''}`;
    const filterGrade = `${grade ? `&grade=${grade?.central_grade}` : ''}`;
    const filterSubject = `${subject ? `&subject=${subject}` : ''}`;
    const filterVolumes = `${vol ? `&volume=${vol?.id}` : ''}`;
    const { pageNo, pageSize, tabValue, moduleId } = this.state;
    let urlPath = '';
    if (tabValue === 0 || tabValue === 1) {
      urlPath = `${
        endpoints.ebook.ebook
      }?domain_name=${domain_name}&is_ebook=true&page_number=${pageNo}&page_size=${pageSize}&ebook_type=${
        tabValue + 1
      }${filterAcad}${filterBranch}${filterGrade}${filterSubject}${filterVolumes}${filterSelectedBranch}`;
    } else if (tabValue === 2) {
      urlPath = `${
        endpoints.ebook.ebook
      }?domain_name=${domain_name}&is_ebook=true&page_number=${pageNo}&page_size=${pageSize}&is_delete=${'True'}${filterAcad}${filterBranch}${filterGrade}${filterSubject}${filterVolumes}${filterSelectedBranch}`;
    }

    axios
      .get(urlPath, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
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
      .catch((error) => {});
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
      <div className='layout-container-div'>
        <Layout className='layout-container'>
          <div className='message_log_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
            <div style={{ backgroundColor: '#F9F9F9' }}>
              <div className='create_group_filter_container'>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} style={{ textAlign: 'left' }}>
                    <CommonBreadcrumbs
                      componentName='Intelligent Book'
                      childComponentName='View IBook'
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
                          <Tab label='All' {...a11yProps(0)} />
                          <Tab label='Activated' {...a11yProps(1)} />
                          <Tab label='Pending' {...a11yProps(2)} />
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
                        <TabPanel value={tabValue} index={2}>
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
                      <Pagination
                        onChange={this.handlePagination}
                        count={Math.ceil(totalEbooks / pageSize)}
                        color='primary'
                        page={pageNo}
                        style={{ paddingLeft: '45%' }}
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
export default withRouter(withStyles(styles)(connect(mapStateToProps)(ViewEbook)));
