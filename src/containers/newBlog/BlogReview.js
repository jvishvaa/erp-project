import React, { useState, useRef, useEffect, useContext, createRef } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'containers/Layout';
import {
  Grid,
  Typography,
  TextField,
  // Button,
  Box,
  Divider,
  Breadcrumbs,
} from '@material-ui/core';
import StarsIcon from '@material-ui/icons/Stars';
import RatingScale from './RatingScale';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import PendingReview from './PendingReview';
import Published from './Published';
import NotSubmitted from './NotSubmitted';
import Reviewed from './Reviewed';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';
import Shortlisted from './Shortlisted_1';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { NavigateNext as NavigateNextIcon } from '@material-ui/icons';
import axios from 'axios';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import Loader from 'components/loader/loader';
import { Breadcrumb, Form, Select, Button, message, Tabs, Drawer } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const DEFAULT_RATING = 0;

const useStyles = makeStyles((theme) => ({
  branch: {
    fontSize: '12px',
    marginLeft: '20px',
    color: 'gray',
  },
  home: {
    marginLeft: '5px',
    marginTop: '-2px',
    marginBottom: '15px',
    fontSize: '15px',
  },
  selected1: {
    background: `${theme.palette.primary.main} !important`,
    color: 'white !important',
    borderRadius: '4px',
  },
  selected2: {
    background: `${theme.palette.primary.main} !important`,
    color: 'white !important',
    borderRadius: '4px',
  },
  tabsFont: {
    '& .MuiTab-wrapper': {
      color: 'white',
      fontWeight: 'bold',
    },
  },
  tabsFont1: {
    '& .MuiTab-wrapper': {
      color: 'black',
      fontWeight: 'bold',
    },
  },
  topic: {
    marginLeft: '20px',
    background: '#F1F4F6',
  },
  topicName: {
    color: '#173260',
  },
  grade: {
    color: '#1B689A',
  },
}));

const BlogReview = () => {
  const { TabPane } = Tabs;
  const classes = useStyles();
  const formRef = createRef();
  const { Option } = Select;
  const history = useHistory();
  const [value, setValue] = React.useState(0);
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const branch_update_user =
    JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  let dataes = JSON?.parse(localStorage?.getItem('userDetails')) || {};
  const newBranches =
    JSON?.parse(localStorage?.getItem('ActivityManagementSession')) || {};
  const user_level = dataes?.user_level;
  const [moduleId, setModuleId] = useState();
  const [view, setView] = useState(false);
  const [flag, setFlag] = useState(false);
  const [gradeList, setGradeList] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  console.log(selectedBranch, 'wt');
  const { setAlert } = useContext(AlertNotificationContext);
  const [academicYear, setAcademicYear] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const goBack = () => {
    history.push('/blog/blogview');
  };
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (moduleId) {
      setLoading(true);
      axios
        .get(
          `${endpoints.newBlog.activityBranch}?branch_ids=${selectedBranch?.branch?.id}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          if (response?.data?.status_code === 200) {
            setBranchList(response?.data?.result || []);
            setLoading(false);
          }
        });
    }
  }, [window.location.pathname, moduleId]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Activity Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              item.child_name === 'Blog Activity' &&
              window.location.pathname === '/blog/activityreview'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  function callApi(api, key) {
    setLoading(true);
    axiosInstance.get(api).then((result) => {
      if (result.status === 200) {
        if (key === 'academicYearList') {
          setAcademicYear(result?.data?.data || []);
          const viewMoreData = JSON.parse(localStorage.getItem('viewMoreData'));
          if (
            window.location.pathname !== '/erp-online-class-student-view' &&
            !viewMoreData?.academic
          )
            callApi(
              `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
              'branchList'
            );
        }
        if (key === 'branchList') {
          setBranchList(result?.data?.data?.results || []);
        }
        if (key === 'gradeList') {
          const gradeData = result?.data?.data || [];
          gradeData.unshift({
            grade_grade_name: 'Select All',
            grade_id: 'all',
            id: 'all',
          });
          // setGradeList(gradeData);
        }
      }
      setLoading(false);
    });
  }

  const fetchBranches = () => {
    const transformedData = newBranches?.branches?.map((obj) => ({
      id: obj.id,
      branch_name: obj.name,
    }));
    transformedData.unshift({
      branch_name: 'Select All',
      id: 'all',
    });
  };
  useEffect(() => {
    if (moduleId && selectedBranch) {
      fetchBranches();
      fetchGrade();
    }
  }, [moduleId, selectedBranch]);

  const fetchGrade = (event, value) => {
    setSelectedGrade([]);
    if (selectedBranch && moduleId?.length !== 0) {
      if (selectedBranch) {
        setLoading(true);
        axiosInstance
          .get(
            `${endpoints.newBlog.gradesERP}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranch?.branch?.id}&module_id=${moduleId}`,
            {
              headers: {
                'X-DTS-HOST': X_DTS_HOST,
              },
            }
          )
          .then((response) => {
            // debugger
            setGradeList(response?.data?.data);
            setLoading(false);
          });
      }
    }
  };

  const handleGrade = (event, value) => {
    setSelectedGrade([]);
    if (value) {
      setSelectedGrade(value?.value);
    }
  };

  const handleClearGrade = () => {
    setSelectedGrade('');
  };

  const goSearch = () => {
    setLoading(true);
    if (selectedGrade?.length == 0) {
      message.error('Please Select Grade');
      setLoading(false);
      return;
    } else {
      setFlag(true);
      setLoading(false);
      return;
    }
  };

  const gradeOption = gradeList?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  return (
    <div>
      <Layout>
        <div className='px-3'>
          <div className='row'>
            <div className='col-md-6 pl-2'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item
                  href='wall/central/redirect'
                  className='th-grey th-pointer th-16'
                >
                  Activity Management
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  href='/blog/blogview'
                  className='th-grey th-pointer th-16'
                >
                  Blog Activity
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-black th-16'>
                  {ActivityId?.title}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className='py-3 th-bg-white mx-3 mt-3 th-br-5'>
            <div className='row'>
              <div className='col-12'>
                <span className='th-14'> Title : &nbsp;</span>
                <span className='th-fw-500 th-16'>{ActivityId?.title} </span>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-md-4' style={{ zIndex: 5 }}>
                <Form id='filterForm' ref={formRef} layout={'horizontal'}>
                  <div className='row align-item-center'>
                    <div className='col-md-4 col-6 px-0'>
                      <div className='mb-2 text-left'>Grade</div>
                      <Form.Item name='grade'>
                        <Select
                          allowClear
                          placeholder='Select Grade'
                          showSearch
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onClear={handleClearGrade}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                          onChange={(event, value) => {
                            handleGrade(event, value);
                          }}
                        >
                          {gradeOption}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-3 col-6 pt-4 th-15 mt-1'>
                      <Button
                        className='th-button-active th-br-6 text-truncate th-pointer'
                        icon={<SearchOutlined />}
                        onClick={goSearch}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <div className='th-tabs th-activity-tabs th-bg-white'>
                  <Tabs type='card' onChange={handleChange} defaultActiveKey={value}>
                    <TabPane tab='PENDING REVIEW' key='0'>
                      <PendingReview
                        selectedBranch={selectedBranch?.branch}
                        setValue={setValue}
                        value={value}
                        // handleChange={handleChange}
                        selectedGrade={selectedGrade}
                        flag={flag}
                        setFlag={setFlag}
                      />
                    </TabPane>
                    <TabPane tab='NOT SUBMITTED' key='1'>
                      <NotSubmitted
                        selectedBranch={selectedBranch?.branch}
                        setValue={setValue}
                        value={value}
                        // handleChange={handleChange}
                        selectedGrade={selectedGrade}
                        flag={flag}
                        setFlag={setFlag}
                      />
                    </TabPane>
                    <TabPane tab='REVIEWED' key='2'>
                      <Reviewed
                        selectedBranch={selectedBranch?.branch}
                        setValue={setValue}
                        value={value}
                        // handleChange={handleChange}
                        selectedGrade={selectedGrade}
                        flag={flag}
                        setFlag={setFlag}
                      />
                    </TabPane>
                    <TabPane tab='SHORTLISTED' key='3'>
                      <Shortlisted
                        selectedBranch={selectedBranch?.branch}
                        setValue={setValue}
                        value={value}
                        // handleChange={handleChange}
                        selectedGrade={selectedGrade}
                        flag={flag}
                        setFlag={setFlag}
                      />
                    </TabPane>
                    <TabPane tab='PUBLISHED' key='4'>
                      <Published
                        selectedBranch={selectedBranch?.branch}
                        setValue={setValue}
                        value={value}
                        // handleChange={handleChange}
                        selectedGrade={selectedGrade}
                        flag={flag}
                        setFlag={setFlag}
                      />
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      {/* {loading && <Loader />}
      <Layout>
        <Grid
          container
          direction='row'
          style={{ paddingLeft: '22px', paddingRight: '10px' }}
        >
          <Grid item xs={12} md={6} style={{ marginBottom: 15 }}>
            <Breadcrumbs
              style={{ width: '70vw' }}
              separator={<NavigateNextIcon fontSize='small' style={{ color: 'black' }} />}
              aria-label='breadcrumb'
            >
              <Typography color='textPrimary' style={{ fontSize: '18px' }}>
                <strong>Activity Management</strong>
              </Typography>
              <Typography
                color='textPrimary'
                style={{ fontSize: '18px', fontWeight: 'bold' }}
              >
                Activity
              </Typography>
              <Typography
                color='textPrimary'
                style={{ fontSize: '18px', fontWeight: 'bold' }}
              >
                {ActivityId?.title}
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <div
          style={{
            width: '96%',
            height: 'auto',
            paddingBottom: '9px',
            paddingTop: '6px',
          }}
        >
          <div style={{ marginLeft: '22px', marginTop: '9px' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: '16px', fontWeight: '400' }}>Topic Name: </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '91%',
                  paddingLeft: '12px',
                  fontWeight: '500',
                  color: '#1C4FA8',
                }}
              >
                {ActivityId?.title}{' '}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', padding: '20px' }}>
          <div style={{ width: '21%', paddingLeft: '42px' }}>
            <Autocomplete
              fullWidth
              limitTags={1}
              size='small'
              className='filter-student meeting-form-input'
              options={gradeList || []}
              getOptionLabel={(option) => option?.name || ''}
              filterSelectedOptions
              value={selectedGrade || []}
              onChange={(event, value) => {
                handleGrade(event, value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  fullWidth
                  variant='outlined'
                  label='Grade'
                />
              )}
            />
          </div>
          <div style={{ paddingLeft: '39px' }}>
            <Button
              variant='contained'
              color='primary'
              style={{ width: '112px', backgroundColor: 'primary' }}
              onClick={goSearch}
            >
              Search
            </Button>
          </div>
          <div style={{ paddingLeft: '39px' }}>
            <Button
              variant='contained'
              color='primary'
              onClick={goBack}
              style={{ width: '112px' }}
            >
              Back
            </Button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Grid container style={{ paddingLeft: '21px' }}>
              <Grid item md={12} xs={12} className={classes.tabStatic}>
                <Tabs
                  onChange={handleChange}
                  textColor='primary'
                  indicatorColor='primary'
                  value={value}
                >
                  <Tab
                    label='Pending Review'
                    classes={{
                      selected: classes.selected2,
                    }}
                    className={value === 0 ? classes.tabsFont : classes.tabsFont1}
                  />
                  <Tab
                    label='Not Submitted'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 1 ? classes.tabsFont : classes.tabsFont1}
                  />
                  <Tab
                    label='Reviewed'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 2 ? classes.tabsFont : classes.tabsFont1}
                  />
                  <Tab
                    label='Shortlisted'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 3 ? classes.tabsFont : classes.tabsFont1}
                  />

                  {dataes?.user_level == '11' || dataes?.user_level == '8' ? (
                    ''
                  ) : (
                    <Tab
                      label='Published'
                      classes={{
                        selected: classes.selected1,
                      }}
                      className={value === 4 ? classes.tabsFont : classes.tabsFont1}
                    />
                  )}
                </Tabs>
              </Grid>
            </Grid>
          </div>
          <div>
            {value == 2 && (
              <div style={{ marginRight: '49px' }}>
                <BookmarksIcon style={{ color: 'gray' }} /> Shortlisted
              </div>
            )}
          </div>
        </div>
        {value == 0 && (
          <PendingReview
            selectedBranch={selectedBranch?.branch}
            setValue={setValue}
            value={value}
            handleChange={handleChange}
            selectedGrade={selectedGrade}
            flag={flag}
            setFlag={setFlag}
          />
        )}
        {value == 1 && (
          <NotSubmitted
            selectedBranch={selectedBranch?.branch}
            setValue={setValue}
            value={value}
            handleChange={handleChange}
            selectedGrade={selectedGrade}
            flag={flag}
            setFlag={setFlag}
          />
        )}
        {value == 2 && (
          <Reviewed
            selectedBranch={selectedBranch?.branch}
            setValue={setValue}
            value={value}
            handleChange={handleChange}
            selectedGrade={selectedGrade}
            flag={flag}
            setFlag={setFlag}
          />
        )}
        {value == 3 && (
          <Shortlisted
            selectedBranch={selectedBranch?.branch}
            setValue={setValue}
            value={value}
            handleChange={handleChange}
            selectedGrade={selectedGrade}
            flag={flag}
            setFlag={setFlag}
          />
        )}
        {value == 4 && (
          <Published
            selectedBranch={selectedBranch?.branch}
            setValue={setValue}
            value={value}
            handleChange={handleChange}
            selectedGrade={selectedGrade}
            flag={flag}
            setFlag={setFlag}
          />
        )}
      </Layout> */}
    </div>
  );
};

export default BlogReview;
