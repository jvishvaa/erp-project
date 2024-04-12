import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  HistoryOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  StopOutlined,
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
  DatePicker,
  Tabs,
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
import FilesView from './filesview';
import moment from 'moment';
import './branchside.scss';

const BranchHomework = () => {
  const history = useHistory();
  const [gradeList, setGradeList] = useState([]);
  const [grade, setGrade] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [section, setSection] = useState('');
  const [status, setStatus] = useState('');

  const { Option } = Select;
  const { TabPane } = Tabs;
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  // const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const loggedUserData = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(15);
  const [loading, setLoading] = useState(false);
  let defaultStartDate = moment().subtract(6, 'days');
  const [showFilterPage, setShowFilter] = useState(false);
  const [subject, setSubject] = useState(null);
  const [subjectList, setSubjectList] = useState([]);
  const [startDate, setStartDate] = useState(defaultStartDate.format('DD-MM-YYYY'));
  const [endDate, setEndDate] = useState(moment().format('DD-MM-YYYY'));
  const [evaluateData, setEvaluateData] = useState([]);
  const [selectedHomework, setSelectedHomework] = useState();
  const formRef = useRef();
  const [count, setCount] = useState(0);
  const [ListPageData, setListPageData] = useState({
    currentPage: 1,
    pageSize: 15,
    totalCount: null,
    totalPage: null,
  });

  const [totalAssesed, setTotalAssesed] = useState(0);
  const [totalunderAssesed, setTotalunderAssesed] = useState(0);
  const [dates, setDates] = useState(null);
  const [showTab, setShowTab] = useState('1');

  const onChange = (key) => {
    setShowTab(key);
    setPageNo(1);
  };

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const { RangePicker } = DatePicker;
  const dateFormat = 'DD-MM-YYYY';

  useEffect(() => {
    fetchGrade(selectedBranch?.branch?.id);
  }, [selectedBranch]);

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
      setListPageData({
        ...ListPageData,
        currentPage: 1,
      });
    } else if (each.length !== 0) {
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
    setSubjectList([]);
    setSubject('');
    setStartDate(defaultStartDate.format('DD-MM-YYYY'));
    setEndDate(moment().format('DD-MM-YYYY'));
    setEvaluateData([]);
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
      Subject: [],
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

  const fetchSubject = async (section) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.centralizedHomework.subjectList}?session_year=${selectedYear.id}&branch=${selectedBranch?.branch?.id}&grade=${grade}&section=${section}`
      );
      if (result.data.status_code === 200) {
        setSubjectList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} value={each.section_id}>
        {each?.sec_name}
      </Option>
    );
  });

  const subjectOptions = subjectList?.map((each) => {
    return (
      <Option key={each?.subject__id} value={each.subject_mapping_id}>
        {each?.sub_name}
      </Option>
    );
  });

  const handleChangeSection = (each) => {
    setPageNo(1);
    if (each.some((item) => item.value === 'all')) {
      const allsections = sectionList?.map((item) => item.section_id).join(',');
      setSection(allsections);
      formRef.current.setFieldsValue({
        section: sectionList?.map((item) => item.section_id),
      });
      fetchSubject(allsections);
      setListPageData({
        ...ListPageData,
        currentPage: 1,
      });
    } else if (each.length !== 0) {
      const singleSection = each.map((item) => item.value).join(',');
      setSection(singleSection);
      fetchSubject(singleSection);
      setListPageData({
        ...ListPageData,
        currentPage: 1,
      });
    } else {
      setSubject('');
      setSubjectList([]);
      setStartDate(defaultStartDate.format('DD-MM-YYYY'));
      setEndDate(moment().format('DD-MM-YYYY'));
      formRef.current.setFieldsValue({
        section: [],
        Subject: [],
      });
      setEvaluateData([]);
    }
  };

  const handleChangeSubject = (each) => {
    setPageNo(1);
    if (each.some((item) => item.value === 'all')) {
      const allsubjects = subjectList?.map((item) => item.id).join(',');
      setSubject(allsubjects);
      formRef.current.setFieldsValue({
        section: subjectList?.map((item) => item.id),
      });
      setListPageData({
        ...ListPageData,
        currentPage: 1,
      });
    } else if (each.length !== 0) {
      const singleSubject = each.map((item) => item.value).join(',');
      setSubject(singleSubject);
    } else {
      setSubject('');
      setEvaluateData([]);
      setStartDate(defaultStartDate.format('DD-MM-YYYY'));
      setEndDate(moment().format('DD-MM-YYYY'));
      formRef.current.setFieldsValue({
        Subject: [],
      });
    }
  };

  const handleClearSection = () => {
    setSection([]);
  };

  const handleClearSubject = () => {
    setSubject(null);
  };

  const handleDateChange = (value) => {
    if (value) {
      setCount((prev) => prev + 1);
      setStartDate(moment(value[0]).format('DD-MM-YYYY'));
      setEndDate(moment(value[1]).format('DD-MM-YYYY'));
      setDates(value);
      setListPageData({
        ...ListPageData,
        currentPage: 1,
      });
    } else {
      setEvaluateData([]);
      setStartDate(null);
      setEndDate(null);
      setDates(null);
    }
  };

  useEffect(() => {
    console.log({ startDate, endDate, subject });
    if (
      startDate &&
      endDate &&
      subject &&
      startDate !== 'Invalid date' &&
      endDate !== 'Invalid date'
    ) {
      handleGetTeacherData();
    }
  }, [endDate, subject, startDate, ListPageData.currentPage, section, count, showTab]);

  const handleGetTeacherData = () => {
    const params = {
      sub_sec_mpng: subject,
      start_date: startDate,
      end_date: endDate,
      // erp_id: loggedUserData?.erp,
      is_assessed: showTab === '1' ? 'True' : 'False',
      page: ListPageData.currentPage,
    };
    axiosInstance
      .get(`${endpoints.homework.teacherData}`, { params })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          message.success('Data Fetched');
          setEvaluateData(result?.data?.result?.results);
          console.log('ssssssssssssssssssss', result?.data?.result?.results[0]?.homework);
          setSelectedHomework(result?.data?.result?.results[0]?.homework);
          // setDiaryListData(result?.data?.result?.results);
          setTotalAssesed(result?.data?.result?.total_assessed);
          setTotalunderAssesed(result?.data?.result?.total_under_assessed);
          setListPageData({
            ...ListPageData,
            totalCount: result?.data?.result?.count,
            totalPage: Math.ceil(result?.data?.result?.count / ListPageData.pageSize),
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error('error', error?.message);
        setLoading(false);
      });
  };

  const onOpenChange = (open) => {
    if (open) {
      setStartDate(null);
      setEndDate(null);
      setDates([null, null]);
      formRef.current.setFieldsValue({
        date: [null, null],
      });
    } else {
      // setStartDate(null);
      // setEndDate(null);
      setDates(null);
    }
  };

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 6;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 6;

    return !!tooEarly || !!tooLate;
  };

  console.log({ selectedHomework });

  return (
    <React.Fragment>
      {/* <Layout>
        <div className='row py-3'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Teacher Homework
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div> */}

      <div className='row'>
        <div className='col-md-12'>
          <div className='row'>
            <Form
              id='filterForm'
              className='mt-3'
              layout={'vertical'}
              ref={formRef}
              style={{ width: '100%' }}
            >
              <div className='row'>
                <div className='col-md-9 row'>
                  <div className='col-xl-3 col-md-4 col-sm-6 col-12 pl-0'>
                    <div className='mb-2 text-left'>Grade</div>
                    <Form.Item name='grade'>
                      <Select
                        mode='multiple'
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={1}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleChangeGrade(value)}
                        onClear={handleClearGrade}
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select Grade'
                      >
                        {gradeOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-xl-3 col-md-4 col-sm-6 col-12 pl-0'>
                    <div className='mb-2 text-left'>Section</div>
                    <Form.Item name='section'>
                      <Select
                        mode='multiple'
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={1}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleChangeSection(value)}
                        onClear={handleClearSection}
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select section'
                      >
                        {sectionOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-xl-3 col-md-4 col-sm-6 col-12 pl-0'>
                    <div className='mb-2 text-left'>Subject</div>
                    <Form.Item name='Subject'>
                      <Select
                        mode='multiple'
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={1}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleChangeSubject(value)}
                        onClear={handleClearSubject}
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select Subject'
                      >
                        {subjectOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-xl-3 col-md-4 col-sm-6 col-12 pl-0'>
                    <div className='mb-2 text-left'>Select Dates</div>
                    <Form.Item name='date'>
                      <RangePicker
                        className='th-width-100 th-br-4'
                        onCalendarChange={(value) => handleDateChange(value)}
                        onOpenChange={onOpenChange}
                        defaultValue={dates || [moment().subtract(6, 'days'), moment()]}
                        value={dates || [moment().subtract(6, 'days'), moment()]}
                        disabledDate={disabledDate}
                        format={dateFormat}
                        separator={'to'}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className='col-md-3 p-0'>
                  <div
                    className='col-md-12 py-2'
                    style={{
                      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                      borderRadius: '10px',
                    }}
                  >
                    <div
                      className='col-md-12 row justify-content-between'
                      style={{ color: 'green' }}
                    >
                      <span className='th-fw-600'>Total Assessed</span>
                      {evaluateData.length && <span>{totalAssesed}</span>}
                    </div>
                    <div
                      className='col-md-12 row justify-content-between'
                      style={{ color: 'red' }}
                    >
                      <span className='th-fw-600'>Total Under Assessed</span>
                      {evaluateData.length && <span>{totalunderAssesed}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>

          <div className='mt-4 '>
            {/* {evaluateData?.length == 0 ? (
              <div className='col-12'>
                <Result
                  status='warning'
                  title={
                    <span className='th-grey'>Please apply filter to view data</span>
                  }
                />
              </div>
            ) : ( */}
            <>
              <div className='mb-3'>
                <div className='th-tabs th-tabs-hw mt-3 th-bg-white'>
                  <Tabs type='card' onChange={onChange} defaultActiveKey={showTab}>
                    <TabPane tab='Assessed' key='1'>
                      <>
                        {evaluateData?.length == 0 ? (
                          <div className='col-12'>
                            <Result
                              status='warning'
                              title={
                                <span className='th-grey'>
                                  Please apply filter to view data
                                </span>
                              }
                            />
                          </div>
                        ) : (
                          <FilesView
                            evaluateData={evaluateData ?? []}
                            selectedHomework={selectedHomework ?? []}
                            setSelectedHomework={setSelectedHomework}
                            setEvaluateData={setEvaluateData}
                            activeTab={showTab}
                          />
                        )}
                      </>
                    </TabPane>
                    <TabPane tab='Under Assessed' key='2'>
                      <>
                        {evaluateData?.length == 0 ? (
                          <div className='col-12'>
                            <Result
                              status='warning'
                              title={
                                <span className='th-grey'>
                                  Please apply filter to view data
                                </span>
                              }
                            />
                          </div>
                        ) : (
                          <FilesView
                            evaluateData={evaluateData ?? []}
                            selectedHomework={selectedHomework}
                            setSelectedHomework={setSelectedHomework}
                            setEvaluateData={setEvaluateData}
                            activeTab={showTab}
                          />
                        )}
                      </>
                    </TabPane>
                  </Tabs>
                </div>
              </div>
              {evaluateData?.length > 0 ? (
                <div className='text-center mt-2'>
                  <Pagination
                    current={ListPageData.currentPage}
                    total={ListPageData.totalCount}
                    pageSize={ListPageData.pageSize}
                    onChange={(value) =>
                      setListPageData({
                        ...ListPageData,
                        currentPage: value,
                      })
                    }
                    showSizeChanger={false}
                    showQuickJumper={false}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`
                    }
                  />
                </div>
              ) : (
                ''
              )}
            </>
            {/* )} */}
          </div>
        </div>
      </div>

      {/* </div> */}
      {/* </Layout> */}
    </React.Fragment>
  );
};

export default BranchHomework;
