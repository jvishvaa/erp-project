import {
  Breadcrumb,
  Select,
  Table,
  Tabs,
  message,
  Input,
  Form,
  Button,
  Pagination,
  Result,
} from 'antd';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Layout from 'containers/Layout';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import BulkUpload from './BulkUpload';
import { SearchOutlined } from '@ant-design/icons';

const VirtualSchool = () => {
  const [showTab, setShowTab] = useState('1');
  const { TabPane } = Tabs;
  const onTabChange = (key) => {
    setShowTab(key);
    setSelectedActualBranch('');
    setSelectedVirtualBranch('');
    setSearchedData('');
  };

  const { Option } = Select;
  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [showFilterPage, setShowFilter] = useState(true);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [pageNo, setPageNo] = useState(1);
  //eslint-disable-next-line
  const [pageLimit, setPageLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [searchedData, setSearchedData] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedAtualBranch, setSelectedActualBranch] = useState('');
  const [selectedVirtualBranch, setSelectedVirtualBranch] = useState('');
  const [virtualSchoolList, setVirtualSchoolList] = useState([]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Virtual School') {
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
      dataIndex: 'erp_user__erp_id',
      width: '15%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Name</span>,
      dataIndex: 'erp_user__name',
      width: '25%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Actual Branch</span>,
      dataIndex: 'actual_branch__branch_name',
      width: '30%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Virtual Branch</span>,
      dataIndex: 'virtual_branch__branch_name',
      width: '30%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
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

  const handleActualBranch = (e) => {
    setPageNo(1);
    if (e != undefined) {
      setSelectedActualBranch(e);
    } else {
      setSelectedActualBranch('');
      formRef.current.setFieldsValue({
        selectedAtualBranch: null,
      });
    }
  };

  const handleVirtualBranch = (e) => {
    setPageNo(1);
    if (e != undefined) {
      setSelectedVirtualBranch(e);
    } else {
      setSelectedVirtualBranch('');
      formRef.current.setFieldsValue({
        selectedVirtualBranch: null,
      });
    }
  };

  const fetchVirtualSchool = async (
    pageNo,
    searchedData,
    selectedAtualBranch,
    selectedVirtualBranch
  ) => {
    let actualBranchParams = selectedAtualBranch || '';
    let virtualBranchParams = selectedVirtualBranch || '';
    let searchParams = searchedData || '';
    if (searchedData == '' && selectedAtualBranch == '' && selectedVirtualBranch == '') {
      message.error('Please select atleast one filter to view data');
      return;
    }

    let params = `?page=${pageNo}&page_size=${pageLimit}
    ${actualBranchParams ? `&actual_branch=${selectedAtualBranch}` : ''}
    ${virtualBranchParams ? `&virtual_branch=${selectedVirtualBranch}` : ''}
    ${searchParams ? `&search=${searchedData}` : ''}`;
    setShowFilter(false);
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/erp_user/virtual-school-details/${params}`
      );
      const { status, data } = response;
      if (status === 200) {
        setVirtualSchoolList(data?.result?.results);
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

  const handleClearFilter = () => {
    setSearchedData('');
    setSelectedActualBranch('');
    setSelectedVirtualBranch('');
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
                Virtual School
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-tabs th-bg-white'>
              <Tabs type='card' onChange={onTabChange} defaultActiveKey={showTab}>
                <TabPane tab='Virtual School' key='1'>
                  <div className=''>
                    <Form
                      id='filterForm'
                      className='mt-1'
                      layout={'vertical'}
                      ref={formRef}
                    >
                      <div className='row'>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <Form.Item name='actualbranch'>
                            <Select
                              allowClear={true}
                              className='th-grey th-bg-white  w-100 text-left'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleActualBranch(e, value)}
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
                              placeholder='Select Actual Branch'
                            >
                              {branchListOptions}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <Form.Item name='virtualbranch'>
                            <Select
                              allowClear={true}
                              className='th-grey th-bg-white  w-100 text-left'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleVirtualBranch(e, value)}
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
                              placeholder='Select Virtual Branch'
                            >
                              {branchListOptions}
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
                                  fetchVirtualSchool(
                                    pageNo,
                                    searchedData,
                                    selectedAtualBranch,
                                    selectedVirtualBranch
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

                    <div className='row mt-3'>
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
                            dataSource={virtualSchoolList}
                            pagination={false}
                            // scroll={{
                            //   x: window.innerWidth < 600 ? 'max-content' : null,
                            //   y: 'calc(80vh - 220px)',
                            // }}
                          />

                          {virtualSchoolList?.length > 0 && (
                            <div className='py-3 '>
                              <Pagination
                                current={pageNo}
                                total={totalPage}
                                showSizeChanger={false}
                                pageSize={pageLimit}
                                onChange={(current) => {
                                  setPageNo(current);
                                  fetchVirtualSchool(
                                    current,
                                    searchedData,
                                    selectedAtualBranch,
                                    selectedVirtualBranch
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

export default VirtualSchool;
