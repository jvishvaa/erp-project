import React, { useState, useEffect, useContext, createRef } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'containers/Layout';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Breadcrumb, Button as ButtonAnt, Form, Select, message, Tabs } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import { SearchOutlined } from '@ant-design/icons';
import VisualPendingReview from './VisualPendingReview';
import VisualReviews from './VisualReviews';

const DEFAULT_RATING = 0;
const { TabPane } = Tabs;
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
  const boardListData = useSelector((state) => state.commonFilterReducer?.branchList);
  const formRef = createRef();
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState(0);
  const localActivityData = JSON.parse(localStorage.getItem('ActivityData')) || {};
  const subLocalActivityData = localStorage.getItem('VisualActivityId') ? JSON.parse(localStorage.getItem('VisualActivityId')) : "";
  const [selectedBranch, setSelectedBranch] = useState([]);
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
  const { setAlert } = useContext(AlertNotificationContext);
  const [academicYear, setAcademicYear] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const handleChange = (newValue) => {
    console.log('handleChange', newValue);
    setValue(newValue);
  };
  const goBack = () => {
    history.push('/blog/blogview');
  };
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
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

  const selectedBranchGlobal = useSelector((state) => state.commonFilterReducer?.selectedBranch)
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
  };


  useEffect(() =>{
    fetchGrades()
  },[])

  const fetchGrades = () => {
    setSelectedBranch([]);
    setSelectedGrade([]);
    if (value?.length) {
      const branchIds = value.map((obj) => obj?.id);
      setSelectedBranch(value);

      if (branchIds) {
        setLoading(true);
        axios
          .get(
            `${endpoints.newBlog.activityGrade}?branch_ids=${selectedBranchGlobal?.branch?.id}`,
            {
              headers: {
                'X-DTS-HOST': X_DTS_HOST,
              },
            }
          )
          .then((response) => {
            setGradeList(response?.data?.result);
            setLoading(false);
          });
      }
    }
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const goSearch = () => {
    setLoading(true);
    if (gradeId == undefined) {
      setAlert('error', 'Please Select Grade');
      setLoading(false);
      return;
    } else if (subjectId == undefined) {
      setAlert('error', 'Please Select Section');
      setLoading(false);
      return;
    } else {
      setFlag(true);
      setLoading(false);
    }
  };
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
    setFlag(false);
    if (value) {
      setBoardId(value?.value);
    }
  };

  const handleGrade = (item) => {
    formRef.current.setFieldsValue({
      subject: null,
      // board: null,
    });
    setFlag(false);
    if (item) {
      setGradeId(item.value);
      setGradeName(item.children);
    }
  };

  useEffect(() => {
    if (moduleId && selectedBranchGlobal) {
      fetchGradeData();
    }
  }, [selectedBranchGlobal, moduleId]);

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranchGlobal?.branch?.id,
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
    if (gradeId !== '') {
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranchGlobal?.branch?.id,
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

  const handleClearSubject = () => {};

  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option key={each?.id} value={each?.section_id} mappingId={each?.id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const handleSubject = (item) => {
    setFlag(false);
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
      .then((res) => {});
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
      {/* {loading && <Loader />} */}
      <Layout>
        <div className='px-2 '>
          <div className='row'>
            <div className='col-8'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item
                  href='/blog/wall/central/redirect'
                  className='th-grey-1 th-16'
                >
                  Activity Management
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  onClick={() => history.goBack()}
                  className='th-black-1 th-16'
                >
                    {localActivityData?.name}
                </Breadcrumb.Item>
                <Breadcrumb.Item href='' className='th-grey th-16'>
                  {subLocalActivityData?.title}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className='py-3 th-bg-white mx-3 mt-3 th-br-5'>
            <div className='row'>
              <div className='col-12'>
                <span className='th-14'>Title : &nbsp;</span>
                <span className='th-fw-500 th-16'> {subLocalActivityData?.title}</span>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-md-9' style={{ zIndex: 5 }}>
                <Form id='filterForm' ref={formRef} layout={'horizontal'}>
                  <div className='row align-items-center'>
                    <div className='col-md-3 col-6 px-0'>
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
                    <div className='col-md-3 col-6 pr-0 px-0 pl-md-3'>
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
                          onClear={handleClearSubject}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {subjectOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-3 col-6 pt-3'>
                      <ButtonAnt
                        className='th-button-active th-br-6 text-truncate th-pointer'
                        icon={<SearchOutlined />}
                        onClick={goSearch}
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
                      <VisualPendingReview
                        selectedBranch={selectedBranchGlobal?.branch?.id}
                        setValue={setValue}
                        value={value}
                        // handleChange={handleChange}
                        selectedGrade={gradeId}
                        selectedSubject={subjectId}
                        setSubjectName={subjectName}
                        flag={flag}
                        setFlag={setFlag}
                      />
                    </TabPane>
                    <TabPane tab='REVIEWED' key='1'>
                      <VisualReviews
                        selectedBranch={selectedBranchGlobal?.branch?.id}
                        setValue={setValue}
                        value={value}
                        // handleChange={handleChange}
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
    </div>
  );
};

export default VisualActivityReview;
