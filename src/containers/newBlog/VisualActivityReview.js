import React, { useState, useRef, useEffect, useContext, createRef } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'containers/Layout';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Tab,
  Box,
  Divider,
  Drawer,
  IconButton
} from '@material-ui/core';
import StarsIcon from '@material-ui/icons/Stars';
import RatingScale from './RatingScale';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Breadcrumb, Button as ButtonAnt, Form, Select, message } from 'antd';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import PendingReview from './PendingReview';
import PhysicalPendingReview from './PhysicalPendingReview';
import PhysicalReviewed from './PhysicalReviews';
import Published from './Published';
import NotSubmitted from './NotSubmitted';
import Reviewed from './Reviewed';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';
import Shortlisted from './Shortlisted_1';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { NavigateNext as NavigateNextIcon } from '@material-ui/icons'
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import Loader from 'components/loader/loader';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { SearchOutlined, DownOutlined } from '@ant-design/icons'
import VisualPendingReview from './VisualPendingReview';
import VisualReviews from './VisualReviews';

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

const VisualActivityReview = () => {
  const boardListData = useSelector((state) => state.commonFilterReducer?.branchList)
  const formRef = createRef();
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState(0);
  const ActivityId = JSON.parse(localStorage.getItem('VisualActivityId')) || {};
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const branch_update_user = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  let dataes = JSON?.parse(localStorage?.getItem('userDetails')) || {};
  const newBranches = JSON?.parse(localStorage?.getItem('ActivityManagementSession')) || {};
  const user_level = dataes?.user_level;
  const [moduleId, setModuleId] = useState();
  const [view, setView] = useState(false);
  const [flag, setFlag] = useState(false);
  const [gradeList, setGradeList] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [academicYear, setAcademicYear] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const goBack = () => {
    history.push('/blog/blogview');
  };
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false)
  const [boardId, setBoardId] = useState();
  // const [boardListData, setBoardListData] = useState([]);
  const { Option } = Select;
  const [gradeId, setGradeId] = useState();
  const [gradeName, setGradeName] = useState();
  const [gradeData, setGradeData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
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
              item.child_name === 'Blog Activity'
              &&
              window.location.pathname === '/visual/activity/review'
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
    transformedData.unshift({
      branch_name: 'Select All',
      id: 'all',
    });
    // setBranchList(transformedData);
  }
  useEffect(() => {

    fetchBranches();
  }, [])

  const handleBranch = (event, value) => {
    setSelectedBranch([])
    setSelectedGrade([])
    if (value?.length) {
      const branchIds = value.map((obj) => obj?.id)
      setSelectedBranch(value);

      if (branchIds) {
        setLoading(true)
        axios
          .get(`${endpoints.newBlog.activityGrade}?branch_ids=${branchIds}`,
            {
              headers: {
                'X-DTS-HOST': X_DTS_HOST,
              },
            })
          .then((response) => {
            setGradeList(response?.data?.result)
            setLoading(false)
          })

      }

    }


  };

  const handleGoBack = () => {
    history.goBack()
  }

  const goSearch = () => {
    setLoading(true)
    if (boardId === undefined) {
      setAlert('error', 'Please Select Branch');
      setLoading(false)
      return
    } else if (gradeId == undefined) {
      setAlert('error', 'Please Select Grade');
      setLoading(false)
      return
    } else if(subjectId == undefined){
      setAlert('error', 'Please Select Section');
      setLoading(false)
      return
    } 
    
    else {
      setFlag(true);
      setLoading(false)
    }

  }
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
      subject: null
    })
    if (value) {
      setBoardId(value?.value);

    }
  };

  const handleGrade = (item) => {
    formRef.current.setFieldsValue({
      subject: null,
      // board: null,
    });
    if (item) {
      setGradeId(item.value);
      setGradeName(item.children);
    }
  };


  useEffect(() => {
    if (moduleId && boardId) {

      fetchGradeData()
    }
  }, [boardId])

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: boardId,
      module_id: moduleId,
    };
    axios
      .get(`${endpoints.academics.grades}`, { params })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeData(res?.data?.data);
          setGradeName(res?.data?.data[0]?.grade__grade_name);
          // }
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    if (gradeId !== "") {
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch_id: boardId,
        module_id: moduleId,
        grade_id: gradeId,
      });

    }
  }, [gradeId])

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

  const handleClearSubject = () => {
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

      })
  }

  const branchOptions = boardListData?.map((each) => {
    return (
      <Option key={each?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  return (
    <div>
      {loading && <Loader />}
      <Layout>
        <Grid
          container
          direction='row'
        >
          <Grid item xs={12} md={6} style={{ marginBottom: 15 }}>
            <div className='col-md-8' style={{ zIndex: 2, display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
              <div>
                <IconButton aria-label="back" onClick={handleGoBack}>
                  <KeyboardBackspaceIcon style={{ fontSize: '20px', color: 'black' }} />
                </IconButton>
              </div>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                  Visual Art
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
            // background: '#F1F4F6',
            width: '96%',
            height: 'auto',
            // marginLeft: '19px',
            paddingBottom: '9px',
            paddingTop: '6px',
          }}
        >
          <div style={{ marginLeft: '22px', marginTop: '9px' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: '16px', fontWeight: '400' }}>
                Topic Name:{' '}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  // background: 'white',
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
                <div className='col-md-2 col-6 pl-0'>
                  <div className='mb-2 text-left'>Branch</div>
                  <Form.Item name='branch'>
                    <Select
                      showSearch
                      placeholder='Select Branch'
                      getPopupContainer={(trigger) => trigger.parentNode}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      placement='bottomRight'
                      suffixIcon={<DownOutlined className='th-grey' />}
                      dropdownMatchSelectWidth={false}
                      onChange={(e, value) => handleBoard(e, value)}
                      allowClear={true}
                      onClear={handleClearBoard}
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                          0
                        );
                      }}
                    >
                      {branchOptions}
                    </Select>
                  </Form.Item>
                </div>
                {/* )} */}
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
                      onClear={handleClearSubject}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={true}
                    >
                      {subjectOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-2 col-6 pr-0 px-0 pl-md-3 pt-3' style={{ display: 'flex', alignItem: 'center' }}>
                  <ButtonAnt type="primary"
                    icon={<SearchOutlined />}
                    onClick={goSearch}
                    size={'medium'}>
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
                  // className={ classes.tabsFont}
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
        {value == 0 && <VisualPendingReview selectedBranch={boardId} setValue={setValue} value={value} handleChange={handleChange} selectedGrade={gradeId} selectedSubject={subjectId} setSubjectName={subjectName} flag={flag} setFlag={setFlag} />}
        {value == 1 && <VisualReviews selectedBranch={boardId} setValue={setValue} value={value} handleChange={handleChange} selectedGrade={gradeId} selectedSubject={subjectId} setSubjectName={subjectName} flag={flag} setFlag={setFlag} />}
      </Layout>
    </div>
  );
};

export default VisualActivityReview;
