import React, { useState, useEffect, useContext, createRef } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'containers/Layout';
import { Grid, Tab, IconButton } from '@material-ui/core';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Breadcrumb, Button as ButtonAnt, Form, Select, message, Tabs,} from 'antd';
// import Tabs from '@material-ui/core/Tabs';
import PhysicalPendingReview from './PhysicalPendingReview';
import PhysicalReviewed from './PhysicalReviews';
import { makeStyles } from '@material-ui/core/styles';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import { useHistory } from 'react-router-dom';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import Loader from 'components/loader/loader';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { SearchOutlined } from '@ant-design/icons';
import zIndex from '@material-ui/core/styles/zIndex';

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

const PhysicalActivityReview = () => {
  const {TabPane} = Tabs;
  const boardListData = useSelector((state) => state.commonFilterReducer?.branchList);
  const formRef = createRef();
  const classes = useStyles();
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
  // const { setAlert } = useContext(AlertNotificationContext);
  const [academicYear, setAcademicYear] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const goBack = () => {
    history.push('/blog/blogview');
  };
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [boardId, setBoardId] = useState();
  const { Option } = Select;
  const [gradeId, setGradeId] = useState();
  const [gradeName, setGradeName] = useState();
  const [gradeData, setGradeData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [subjectId, setSubjectId] = useState();
  const [subjectName, setSubjectName] = useState();

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
              window.location.pathname === '/physical/activity/review'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const fetchBranches = () => {
    const transformedData = newBranches?.branches?.map((obj) => ({
      id: obj.id,
      branch_name: obj.name,
    }));
    try{
    transformedData.unshift({
      branch_name: 'Select All',
      id: 'all',
    });
    } catch{
      return false
    }
  };
  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      setLoading(true);
      axios
        .get(
          `${endpoints.newBlog.activityGrade}?branch_ids=${selectedBranch?.branch?.id}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          console.log(response?.data?.result);
          setGradeList(response?.data?.result);
          setLoading(false);
        });
    }
  }, [selectedBranch]);

  const handleGoBack = () => {
    history.goBack();
  };

  const goSearch = () => {
    setLoading(true);
    if (gradeId == undefined) {
      message.error('Please Select Grade')
      setLoading(false);
      return;
    } else if (subjectId == undefined) {
      message.error('Please Select Section')
      setLoading(false);
      return;
    } else {
      setFlag(true);
      setLoading(false);
    }
  };

  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'dev.olvorchidnaigaon.letseduvate.com',
    'ui-revamp1.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com',
  ];

  const handleClearBoard = () => {
    setBoardId('');
  };

  const boardOptions = boardListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.board_name}
      </Option>
    );
  });

  const handleBoard = (e, value) => {
    formRef.current.setFieldsValue({
      grade: null,
      subject: null,
    });
    if (value) {
      setBoardId(value?.value);
    }
  };

  const handleGrade = (item) => {
    formRef.current.setFieldsValue({
      subject: null,
    });
    if (item) {
      setGradeId(item.value);
      setGradeName(item.children);
    }
  };

  useEffect(() => {
    if (moduleId && selectedBranch) {
      fetchGradeData();
    }
  }, [selectedBranch, moduleId]);

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: moduleId,
    };
    axios
      .get(`${endpoints.academics.grades}`, { params })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeData(res?.data?.data);
          setGradeName(res?.data?.data[0]?.grade__grade_name);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    if (gradeId !== '') {
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
        grade_id: gradeId,
      });
    }
  }, [gradeId]);

  const fetchSubjectData = (params = {}) => {
    if (gradeId) {
      axios
        .get(`${endpoints.academics.sections}`, {
          params: { ...params },
        })
        .then((res) => {
          if (res.data.status_code === 200) {
            setSubjectData(res?.data?.data);
          }
        })
        .catch((error) => {
          message.error(error.message);
        });
    }
  };

  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });

  const handleClearGrade = () => {
    setGradeId('');
  };

  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option key={each?.id} value={each?.section_id} mappingId={each?.id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const handleSubject = (item) => {
    if (item) {
      // setSubjectId(item.value);
      setSubjectId(item.value);
      setSubjectName(item?.mappingId);
    }
  };

  const erpData = () => {
    axios
      .get(`${endpoints.userManagementBlog.getUserLevel}`, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((res) => {
        console.log(res, 'PP');
      });
  };

  const branchOptions = boardListData?.map((each) => {
    return (
      <Option key={each?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  return (
    <div>
      <Layout>
        <div className='px-3'>
          <div className='row'>
            <div className='col-md-12 pl-2'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item
                  href='/blog/wall/central/redirect'
                  className='th-grey th-400 th-16'
                >
                  Activity Management
                </Breadcrumb.Item>
                <Breadcrumb.Item href='/physical/activity' className='th-grey th-400 th-16'>
                  Physical Activity
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-grey th-400 th-16'>
                  Physical Review
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-black th-400 th-16'>
                  {ActivityId?.title}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className='col-12 mt-3 th-br-5 py-3 th-bg-white'>
            <div className='row'>
              <div className='col-12'>
                <span className='th-black th-400 th-bold'>
                  Topic Name : <b className='th-blue'>{ActivityId?.title}</b>{' '}
                </span>
              </div>
            </div>
            <div className='row mt-4'>
              <div className='col-8' style={{zIndex:2}}>
                <Form id='filterForm' ref={formRef} layout={'horizontal'}>
                  <div className='row align-items-center'>
                    <div className='col-md-4 col-6 px-0'>
                      <div className='mb-2 text-left'>Grade</div>
                      <Form.Item name='grade'>
                        <Select
                          allowClear
                          placeholder='Select Name'
                          showSearch
                          disabled={user_level == 13}
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(e, value) => {
                            handleGrade(value);
                          }}
                          onClear={handleClearGrade}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {gradeOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-4 col-6 pr-0 px-0 pl-md-3'>
                      <div className='mb-2 text-left'>Section</div>
                      <Form.Item name='subject'>
                        <Select
                          placeholder='Select Section'
                          showSearch
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(e, value) => {
                            handleSubject(value);
                          }}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {subjectOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div
                      className='col-md-2 col-6 pr-0 px-0 pl-md-3 pt-3'
                      style={{ display: 'flex', alignItem: 'center' }}
                    >
                      <ButtonAnt
                        type='primary'
                        icon={<SearchOutlined />}
                        onClick={goSearch}
                        size={'medium'}
                      >
                        Search
                      </ButtonAnt>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <div className='th-tabs th-activity-tabs th-bg-white'>
                  <Tabs type='card' onChange={handleChange} defaultActiveKey={value}>
                    <TabPane tab='PENDING' key='0'>
                      <PhysicalPendingReview
                        selectedBranch={selectedBranch?.branch?.id}
                        setValue={setValue}
                        value={value}
                        handleChange={handleChange}
                        selectedGrade={gradeId}
                        selectedSubject={subjectId}
                        setSubjectName={subjectName}
                        flag={flag}
                        setFlag={setFlag}
                      />
                    </TabPane>
                    <TabPane tab='REVIEWED' key='1'>
                      <PhysicalReviewed
                        selectedBranch={selectedBranch?.branch?.id}
                        setValue={setValue}
                        value={value}
                        handleChange={handleChange}
                        selectedGrade={gradeId}
                        selectedSubject={subjectId}
                        setSubjectName={subjectName}
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
        <Grid container direction='row'>
          <Grid item xs={12} md={6} style={{ marginBottom: 15 }}>
            <div
              className='col-md-8'
              style={{
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
              }}
            >
              <div>
                <IconButton aria-label='back' onClick={handleGoBack}>
                  <KeyboardBackspaceIcon style={{ fontSize: '20px', color: 'black' }} />
                </IconButton>
              </div>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                  Physical Activities
                </Breadcrumb.Item>
                <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                  Review
                </Breadcrumb.Item>
                <Breadcrumb.Item href='' className='th-grey th-16'>
                  {ActivityId?.title}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
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

        <div className='row' style={{ padding: '0.5rem' }}>
          <div className='col-12'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row align-items-center'>
                <div className='col-md-2 col-6 px-0'>
                  <div className='mb-2 text-left'>Grade</div>
                  <Form.Item name='grade'>
                    <Select
                      allowClear
                      placeholder='Select Name'
                      showSearch
                      disabled={user_level == 13}
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleGrade(value);
                      }}
                      onClear={handleClearGrade}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={true}
                    >
                      {gradeOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                  <div className='mb-2 text-left'>Section</div>
                  <Form.Item name='subject'>
                    <Select
                      placeholder='Select Section'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleSubject(value);
                      }}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={true}
                    >
                      {subjectOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div
                  className='col-md-2 col-6 pr-0 px-0 pl-md-3 pt-3'
                  style={{ display: 'flex', alignItem: 'center' }}
                >
                  <ButtonAnt
                    type='primary'
                    icon={<SearchOutlined />}
                    onClick={goSearch}
                    size={'medium'}
                  >
                    Search
                  </ButtonAnt>
                </div>
              </div>
            </Form>
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
                    label='Reviewed'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 1 ? classes.tabsFont : classes.tabsFont1}
                  />
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
          <PhysicalPendingReview
            selectedBranch={selectedBranch?.branch?.id}
            setValue={setValue}
            value={value}
            handleChange={handleChange}
            selectedGrade={gradeId}
            selectedSubject={subjectId}
            setSubjectName={subjectName}
            flag={flag}
            setFlag={setFlag}
          />
        )}
        {value == 1 && (
          <PhysicalReviewed
            selectedBranch={selectedBranch?.branch?.id}
            setValue={setValue}
            value={value}
            handleChange={handleChange}
            selectedGrade={gradeId}
            selectedSubject={subjectId}
            setSubjectName={subjectName}
            flag={flag}
            setFlag={setFlag}
          />
        )}
      </Layout> */}
    </div>
  );
};

export default PhysicalActivityReview;
