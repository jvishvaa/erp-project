import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  HistoryOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  StopOutlined,
  UpOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Form,
  Pagination,
  Popconfirm,
  Result,
  Select,
  Table,
  message,
} from 'antd';
import { Input, Space } from 'antd';
import endpoints from 'config/endpoints';
import endpointsV2 from 'v2/config/endpoints';
import Layout from 'containers/Layout';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { fetchBranchesForCreateUser } from 'redux/actions';
import axiosInstance from 'v2/config/axios';
import axios from 'axios';
import FileSaver from 'file-saver';
import FilesViewEvaluate from './fileViewEvaluate';
import './index.scss';

const EvaluatorHomework = () => {
  const history = useHistory();
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState('');
  const [userLevelList, setUserLevelList] = useState([]);
  const [userLevel, setUserLevel] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [grade, setGrade] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [section, setSection] = useState('');
  const [status, setStatus] = useState('');

  const { Option } = Select;
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const loggedUserData = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(15);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState('');
  const [searchData, setSearchData] = useState('');
  const [showFilterPage, setShowFilter] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const formRef = useRef();
  const searchRef = useRef();

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const changeFilter = () => {
    if (showFilters) {
      setShowFilters(false);
    } else {
      setShowFilters(true);
    }
  };

  useEffect(() => {
    fetchGrade(selectedBranch?.branch?.id);
  }, [selectedBranch]);

  const fetchUserLevel = async () => {
    try {
      const result = await axios.get(endpoints.userManagement.userLevelList, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      });
      if (result.status === 200) {
        setUserLevelList(result?.data?.result);
      } else {
        message.error(result?.data?.message);
      }
    } catch (error) {
      message.error(error?.message);
    }
  };

  const handleUserBranch = (e) => {
    setPageNo(1);
    if (e) {
      setBranch(e);
      fetchGrade(e);
      setGrade('');
      setSection('');
      setGradeList([]);
      setSectionList([]);
      formRef.current.setFieldsValue({
        grade: [],
        section: [],
      });
    } else {
      setBranch('');
      setGrade('');
      setSection('');
      setGradeList([]);
      setSectionList([]);
      formRef.current.setFieldsValue({
        branch: null,
        grade: [],
        section: [],
      });
    }
  };
  const fetchGrade = async (branch) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedYear.id}&branch_id=${selectedBranch?.branch?.id}`
      );
      if (result.data.status_code === 200) {
        setGradeList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const handleChangeGrade = (each) => {
    setPageNo(1);
    if (each.some((item) => item.value === 'all')) {
      const allGrade = gradeList.map((item) => item.grade_id).join(',');
      setGrade(allGrade);
      fetchSection(allGrade);
      setSection([]);
      formRef.current.setFieldsValue({
        grade: gradeList.map((item) => item.grade_id),
        section: [],
      });
    } else {
      const singleGrade = each.map((item) => item.value).join(',');
      setGrade(singleGrade);
      fetchSection(singleGrade);
      setSection([]);
      formRef.current.setFieldsValue({
        section: [],
      });
    }
  };

  const handleClearGrade = () => {
    setGrade([]);
    setSection('');
    setSectionList([]);
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
    });
  };

  const fetchSection = async (grade) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.academics.sections}?session_year=${selectedYear.id}&branch_id=${selectedBranch?.branch?.id}&grade_id=${grade}`
      );
      if (result.data.status_code === 200) {
        setSectionList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const handleChangeSection = (each) => {
    setPageNo(1);
    if (each.some((item) => item.value === 'all')) {
      const allsections = sectionList?.map((item) => item.id).join(',');
      setSection(allsections);
      formRef.current.setFieldsValue({
        section: sectionList?.map((item) => item.id),
      });
    } else {
      setSection(each.map((item) => item.value).join(','));
    }
  };

  const handleClearSection = () => {
    setSection([]);
  };

  return (
    <React.Fragment>
      <Layout>
        {/* Breadcrumb */}
        <div className='row py-3'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Branch Staff Homework
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              {showFilters ? (
                <div className='row card'>
                  <Form
                    id='filterForm'
                    className='mt-3'
                    layout={'vertical'}
                    ref={formRef}
                    style={{ width: '100%' }}
                  >
                    <div className='row'>
                      <div className='col-md-9 row'>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <Form.Item name='grade'>
                            <Select
                              mode='multiple'
                              getPopupContainer={(trigger) => trigger.parentNode}
                              maxTagCount={1}
                              allowClear={true}
                              suffixIcon={<DownOutlined className='th-grey' />}
                              className='th-grey th-bg-grey th-br-4 w-100 text-left'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleChangeGrade(value)}
                              onClear={handleClearGrade}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select Grade'
                            >
                              {gradeOptions}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <Form.Item name='section'>
                            <Select
                              mode='multiple'
                              getPopupContainer={(trigger) => trigger.parentNode}
                              maxTagCount={1}
                              allowClear={true}
                              suffixIcon={<DownOutlined className='th-grey' />}
                              className='th-grey th-bg-grey th-br-4 w-100 text-left'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleChangeSection(value)}
                              onClear={handleClearSection}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select section'
                            >
                              {sectionOptions}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <Form.Item name='section'>
                            <Select
                              mode='multiple'
                              getPopupContainer={(trigger) => trigger.parentNode}
                              maxTagCount={1}
                              allowClear={true}
                              suffixIcon={<DownOutlined className='th-grey' />}
                              className='th-grey th-bg-grey th-br-4 w-100 text-left'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleChangeSection(value)}
                              onClear={handleClearSection}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select section'
                            >
                              {sectionOptions}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <Form.Item name='section'>
                            <Select
                              mode='multiple'
                              getPopupContainer={(trigger) => trigger.parentNode}
                              maxTagCount={1}
                              allowClear={true}
                              suffixIcon={<DownOutlined className='th-grey' />}
                              className='th-grey th-bg-grey th-br-4 w-100 text-left'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleChangeSection(value)}
                              onClear={handleClearSection}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select section'
                            >
                              {sectionOptions}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <Form.Item name='section'>
                            <Select
                              mode='multiple'
                              getPopupContainer={(trigger) => trigger.parentNode}
                              maxTagCount={1}
                              allowClear={true}
                              suffixIcon={<DownOutlined className='th-grey' />}
                              className='th-grey th-bg-grey th-br-4 w-100 text-left'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleChangeSection(value)}
                              onClear={handleClearSection}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select section'
                            >
                              {sectionOptions}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <Form.Item name='section'>
                            <Select
                              mode='multiple'
                              getPopupContainer={(trigger) => trigger.parentNode}
                              maxTagCount={1}
                              allowClear={true}
                              suffixIcon={<DownOutlined className='th-grey' />}
                              className='th-grey th-bg-grey th-br-4 w-100 text-left'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleChangeSection(value)}
                              onClear={handleClearSection}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select section'
                            >
                              {sectionOptions}
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                      <div className='col-md-3 p-0'>
                        <div
                          className='col-md-12'
                          style={{
                            border: '2px solid black',
                            borderRadius: '10px',
                          }}
                        >
                          <div className='col-md-12 row justify-content-between'>
                            <span>Total Assessed</span>
                            <span>50</span>
                          </div>
                          <div className='col-md-12 row justify-content-between'>
                            <span>Total Under Assessed</span>
                            <span>50</span>
                          </div>
                          <div className='col-md-12 row justify-content-between'>
                            <span>Total Unread Chat</span>
                            <span>10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              ) : (
                ''
              )}
              <div className='row col-md-12 justify-content-end'>
                <div className='card'>
                  {showFilterPage == true ? (
                    <Button
                      icon={<UpOutlined />}
                      className='th-16 p-1'
                      onClick={changeFilter}
                    />
                  ) : (
                    <Button
                      icon={<DownOutlined />}
                      className='th-16 p-1'
                      onClick={changeFilter}
                    />
                  )}
                </div>
              </div>
              <div className='row mt-4 '>
                {showFilterPage ? (
                  <div className='col-12'>
                    <Result
                      status='warning'
                      title={
                        <span className='th-grey'>Please apply filter to view data</span>
                      }
                    />
                  </div>
                ) : (
                  <div className='col-md-12 mb-3'>
                    <FilesViewEvaluate />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* </div> */}
      </Layout>
    </React.Fragment>
  );
};

export default EvaluatorHomework;
