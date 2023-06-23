import React, { useState, useEffect, createRef } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'containers/Layout';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import PropTypes from 'prop-types';
import PendingReview from './PendingReview';
import Published from './Published';
import Reviewed from './Reviewed';
import { useHistory } from 'react-router-dom';
import Shortlisted from './Shortlisted_1';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import axios from 'axios';
import { Breadcrumb, Form, Select, Button, message, Tabs, Drawer } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const BlogReview = () => {
  const { TabPane } = Tabs;
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
  // const { setAlert } = useContext(AlertNotificationContext);
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
            `${endpoints.newBlog.gradesERP}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranch?.branch?.id}&module_id=${moduleId}`
          )
          .then((response) => {
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
              <div className='col-md-6' style={{ zIndex: 5 }}>
                <Form id='filterForm' ref={formRef} layout={'horizontal'}>
                  <div className='row align-item-center'>
                    <div className='col-6 px-0'>
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
                        loading={flag}
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
    </div>
  );
};

export default BlogReview;
