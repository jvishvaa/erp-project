import {
  Breadcrumb,
  Pagination,
  Table,
  message,
  Select,
  Form,
  Input,
  Button,
  Tabs,
  Result,
} from 'antd';
import Layout from 'containers/Layout';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import {
  CheckCircleOutlined,
  DownOutlined,
  SearchOutlined,
  StopOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import './style.scss';
import BulkUpload from './BulkUpload';

const AccessBlocker = () => {
  const { Option } = Select;
  const formRef = useRef();

  const [showTab, setShowTab] = useState('1');
  const { TabPane } = Tabs;
  const onTabChange = (key) => {
    setShowTab(key);
    setSelectedBranch('');
    setSearchedData('');
    setSelectedSection('');
    setSelectedGrade('');
    if (key === '1') {
      setShowFilter(true);
      formRef.current.resetFields();
    }
  };

  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchedData, setSearchedData] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  //eslint-disable-next-line
  const [pageLimit, setPageLimit] = useState(10);
  const [blockList, setBlockList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilterPage, setShowFilter] = useState(true);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Access-Blocker') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (moduleId && selectedYear) {
      fetchBranches(selectedYear?.id);
    }
  }, [moduleId, selectedYear]);

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>ERP Id</span>,
      dataIndex: 'erp_user',
      width: '25%',
      render: (data) => <span className='th-black-1 th-14'>{data?.erp_id}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Name</span>,
      dataIndex: 'erp_user',
      width: '25%',
      render: (data) => <span className='th-black-1 th-14'>{data?.name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Modules</span>,
      dataIndex: '',
      width: '50%',
      align: 'center',
      render: (data) => (
        <span className='th-black-1 th-14 p-0'>
          <div className='row'>
            <div className='col-12'>
              <div className='th-br-6 th-bg-white py-1 px-2 shadow-sm'>
                <div className='row py-1'>
                  <div className='col-3 text-center'>
                    <div className='th-12 pb-1'>Lesson Plan</div>
                    <div
                      className={`text-center th-12 ${
                        data?.is_lesson_plan ? 'th-bg-green' : 'th-bg-red'
                      } th-white d-inline-block p-1 th-br-6`}
                      style={{ width: '60px', cursor: 'pointer' }}
                      onClick={() => changeStatus(data, 'is_lesson_plan')}
                    >
                      {data?.is_lesson_plan ? (
                        <>
                          <CheckCircleOutlined className='th-14 pt-1' /> <br />
                          <span>Unblock</span>
                        </>
                      ) : (
                        <>
                          <StopOutlined className='th-14 pt-1' /> <br />
                          <span>Block</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className='col-3 text-center'>
                    <div className='th-12 pb-1'>Online Class</div>
                    <div
                      className={`text-center th-12 ${
                        data?.is_online_class ? 'th-bg-green' : 'th-bg-red'
                      } th-white d-inline-block p-1 th-br-6`}
                      style={{ width: '60px', cursor: 'pointer' }}
                      onClick={() => changeStatus(data, 'is_online_class')}
                    >
                      {data?.is_online_class ? (
                        <>
                          <CheckCircleOutlined className='th-14 pt-1' /> <br />
                          <span>Unblock</span>
                        </>
                      ) : (
                        <>
                          <StopOutlined className='th-14 pt-1' /> <br />
                          <span>Block</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className='col-3 text-center'>
                    <div className='th-12 pb-1'>Ebook</div>
                    <div
                      className={`text-center th-12 ${
                        data?.is_ebook ? 'th-bg-green' : 'th-bg-red'
                      } th-white d-inline-block p-1 th-br-6`}
                      style={{ width: '60px', cursor: 'pointer' }}
                      onClick={() => changeStatus(data, 'is_ebook')}
                    >
                      {data?.is_ebook ? (
                        <>
                          <CheckCircleOutlined className='th-14 pt-1' /> <br />
                          <span>Unblock</span>
                        </>
                      ) : (
                        <>
                          <StopOutlined className='th-14 pt-1' /> <br />
                          <span>Block</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className='col-3 text-center th-vertical-line'>
                    <div className='th-12 pb-1'>Unblock All</div>
                    <div
                      className={`text-center th-12 th-bg-primary th-white d-inline-block p-1 th-br-6`}
                      style={{ width: '60px', cursor: 'pointer' }}
                      onClick={() => changeStatus(data, 'all')}
                    >
                      <UnlockOutlined className='th-35 pt-1' /> <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </span>
      ),
    },
  ];

  const handleSearch = (e) => {
    setPageNo(1);

    if (e !== '' || e !== undefined) {
      setSearchedData(e);
    } else {
      setSearchedData('');
    }
  };

  const fetchBranches = async () => {
    if (selectedYear) {
      try {
        const result = await axiosInstance.get(
          `${endpoints.masterManagement.branchList}?session_year=${selectedYear.id}&module_id=${moduleId}`
        );
        if (result.data.status_code === 200) {
          setBranchList(result?.data?.data);
        } else {
          message.error(result?.data?.message);
        }
      } catch (error) {
        message.error(error.message);
      }
    }
  };

  const branchListOptions = branchList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.branch_name}
      </Option>
    );
  });

  const handleUserBranch = (e) => {
    setPageNo(1);
    if (e) {
      setSelectedBranch(e);
      fetchGrade(e);
      setSelectedGrade('');
      setSelectedSection('');
      setGradeList([]);
      setSectionList([]);
      formRef.current.setFieldsValue({
        grade: [],
        section: [],
      });
    } else {
      setSelectedBranch('');
      setSelectedGrade('');
      setSelectedSection('');
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
        `${endpoints.communication.grades}?session_year=${selectedYear.id}&branch_id=${branch}&module_id=${moduleId}`
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
      setSelectedGrade(allGrade);
      fetchSection(allGrade);
      setSelectedSection([]);
      formRef.current.setFieldsValue({
        grade: gradeList.map((item) => item.grade_id),
        section: [],
      });
    } else {
      const singleGrade = each.map((item) => item.value).join(',');
      setSelectedGrade(singleGrade);
      fetchSection(singleGrade);
      setSelectedSection([]);
      formRef.current.setFieldsValue({
        section: [],
      });
    }
  };

  const handleClearGrade = () => {
    setSelectedGrade([]);
    setSelectedSection('');
    setSectionList([]);
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
    });
  };

  const fetchSection = async (selectedGrade) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.academics.sections}?session_year=${selectedYear.id}&branch_id=${selectedBranch}&grade_id=${selectedGrade}&module_id=${moduleId}`
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
      const allsections = sectionList.map((item) => item.id).join(',');
      setSelectedSection(allsections);
      formRef.current.setFieldsValue({
        section: sectionList.map((item) => item.id),
      });
    } else {
      setSelectedSection(each.map((item) => item.value).join(','));
    }
  };

  const handleClearSection = () => {
    setSelectedSection([]);
  };

  const fetchBlockList = async (
    pageNo,
    searchedData,
    selectedBranch,
    selectedGrade,
    selectedSection
  ) => {
    let branchParams = selectedBranch || '';
    let gradeParams = selectedGrade.length > 0 ? selectedGrade : '';
    let sectionParams = selectedSection.length > 0 ? selectedSection : '';
    let searchParams = searchedData || '';
    let sessionyearparams = selectedYear ? selectedYear?.id : '';
    if (
      searchedData == '' &&
      selectedBranch == '' &&
      selectedGrade == '' &&
      selectedSection == ''
    ) {
      message.error('Please select atleast one filter to view data');
      return;
    }

    let params = `?page=${pageNo}&page_size=${pageLimit}&module_id=${moduleId}${
      sessionyearparams ? `&academic_year=${selectedYear?.id}` : ''
    }${branchParams ? `&branch=${selectedBranch}` : ''}${
      gradeParams ? `&grade=${selectedGrade}` : ''
    }${sectionParams ? `&section=${selectedSection}` : ''}${
      searchParams ? `&search=${searchedData}` : ''
    }`;
    setShowFilter(false);
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `erp_user/user-access-block-list/${params}`
      );
      const { status, data } = response;
      if (status === 200) {
        setBlockList(data?.result?.results);
        setTotalPage(data?.result?.count);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      message.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (data, module) => {
    let lessonPlanStatus;
    let onlineClassStatus;
    let ebookStatus;
    if (module === 'is_lesson_plan') {
      if (data.is_lesson_plan === true) {
        lessonPlanStatus = false;
      } else {
        lessonPlanStatus = true;
      }
    } else {
      lessonPlanStatus = data.is_lesson_plan;
    }

    if (module === 'is_online_class') {
      if (data.is_online_class === true) {
        onlineClassStatus = false;
      } else {
        onlineClassStatus = true;
      }
    } else {
      onlineClassStatus = data.is_online_class;
    }

    if (module === 'is_ebook') {
      if (data.is_ebook === true) {
        ebookStatus = false;
      } else {
        ebookStatus = true;
      }
    } else {
      ebookStatus = data.is_ebook;
    }

    if (module === 'all') {
      lessonPlanStatus = false;
      onlineClassStatus = false;
      ebookStatus = false;
    }

    let reqObj = {
      is_lesson_plan: lessonPlanStatus,
      is_ebook: ebookStatus,
      is_online_class: onlineClassStatus,
      erp_id: data?.erp_user?.erp_id,
      erp_user_id: data?.erp_user?.id,
    };
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `erp_user/user-access-block-list/`,
        reqObj
      );
      const { status, data } = response;
      if (status === 200) {
        message.success(data?.message);
        fetchBlockList(
          pageNo,
          searchedData,
          selectedBranch,
          selectedGrade,
          selectedSection
        );
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      message.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = () => {
    setSearchedData('');
    setSelectedBranch('');
    setSelectedGrade('');
    setSelectedSection('');
    setBlockList([]);
    setShowFilter(true);
    formRef.current.resetFields();
  };

  return (
    <React.Fragment>
      <Layout>
        <div className='row pt-3 pb-3'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                href='/user-management/view-users'
                className='th-black-1 th-16 th-grey'
              >
                User Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Access Blocker
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-tabs th-bg-white mb-3'>
              <Tabs type='card' onChange={onTabChange} defaultActiveKey={showTab}>
                <TabPane tab='Access Blocker' key='1'>
                  <div className='pb-3'>
                    <Form
                      id='filterForm'
                      className='mt-1'
                      layout={'vertical'}
                      ref={formRef}
                    >
                      <div className='row'>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <Form.Item name='branch'>
                            <Select
                              allowClear={true}
                              className='th-grey th-bg-white  w-100 text-left'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleUserBranch(e, value)}
                              dropdownMatchSelectWidth={true}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              getPopupContainer={(trigger) => trigger.parentNode}
                              placeholder='Select Branch*'
                            >
                              {branchListOptions}
                            </Select>
                          </Form.Item>
                        </div>
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
                              dropdownMatchSelectWidth={true}
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
                              {gradeList.length > 1 && (
                                <>
                                  <Option key={0} value={'all'}>
                                    Select All
                                  </Option>
                                </>
                              )}
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
                              dropdownMatchSelectWidth={true}
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
                              {sectionList.length > 1 && (
                                <>
                                  <Option key={0} value={'all'}>
                                    Select All
                                  </Option>
                                </>
                              )}
                              {sectionOptions}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <Form.Item name='search-input'>
                            <Input
                              placeholder='Search'
                              prefix={
                                <SearchOutlined className='site-form-item-icon th-grey' />
                              }
                              allowClear
                              onChange={(e) => handleSearch(e.target.value)}
                            />
                          </Form.Item>
                        </div>
                        <div className='col-md-3 col-sm-6 col-12 text-right'>
                          <div className='row no-gutters'>
                            <div className='col-md-6 col-sm-6 col-6 pr-2'>
                              <Button
                                type='primary'
                                className='btn-block th-br-4'
                                onClick={() =>
                                  fetchBlockList(
                                    pageNo,
                                    searchedData,
                                    selectedBranch,
                                    selectedGrade,
                                    selectedSection
                                  )
                                }
                              >
                                Filter
                              </Button>
                            </div>
                            <div className='col-md-6 col-sm-6 col-6 pl-20'>
                              <Button
                                type='secondary'
                                className='btn-block mt-0 th-br-4'
                                onClick={handleClearFilter}
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form>

                    <div className='row mt-4'>
                      {showFilterPage ? (
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
                        <div className='col-md-12'>
                          <Table
                            className='th-table'
                            rowClassName={(record, index) =>
                              index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                            }
                            loading={loading}
                            columns={columns}
                            dataSource={blockList}
                            pagination={false}
                            scroll={{ y: '300px' }}
                          />

                          {blockList?.length > 0 && (
                            <div className='pt-3 '>
                              <Pagination
                                current={pageNo}
                                total={totalPage}
                                showSizeChanger={false}
                                pageSize={pageLimit}
                                onChange={(current) => {
                                  setPageNo(current);
                                  fetchBlockList(
                                    current,
                                    searchedData,
                                    selectedBranch,
                                    selectedGrade,
                                    selectedSection
                                  );
                                }}
                                className='text-center'
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </TabPane>
                <TabPane tab='Bulk Upload' key='2'>
                  <BulkUpload />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default AccessBlocker;
