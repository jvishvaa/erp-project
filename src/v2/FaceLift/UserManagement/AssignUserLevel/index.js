import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Form,
  Select,
  message,
  Input,
  Pagination,
  Table,
  Button,
  Result,
} from 'antd';
import axios from 'axios';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Layout from 'containers/Layout';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';

const AssignUserLevel = () => {
  const { Option } = Select;

  const formRef = useRef();
  const [userLevelList, setUserLevelList] = useState([]);
  const [userLevel, setUserLevel] = useState('');
  const [searchedData, setSearchedData] = useState('');

  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  //eslint-disable-next-line
  const [pageLimit, setPageLimit] = useState(15);
  const [loading, setLoading] = useState(false);
  const [showFilterPage, setShowFilter] = useState(true);
  const [userData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignUserLevel, setAssignUserLevel] = useState('');

  const isOrchids = ['localhost:3000', 'dev', 'qa', 'orchids'].includes(
    window.location.host.split('.')[0]
  );

  useEffect(() => {
    fetchUserLevel();
  }, []);

  const handleSearch = (e) => {
    setPageNo(1);
    setSearchedData(e || '');
  };

  const fetchUserLevel = async () => {
    try {
      const response = await axios.get(endpoints.userManagement.userLevelList, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      });
      const { status, data } = response;
      if (status === 200) {
        setUserLevelList(data?.result);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      message.error(error?.message);
    }
  };

  const userLevelOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });

  const handleUserLevel = (e) => {
    setPageNo(1);
    setUserLevel(e !== undefined ? e : '');
    setSelectedUsers([]);
  };

  const filterData = (pageNo, searchedData, userLevel) => {
    let userLevelParams = userLevel || '';
    let searchParams = searchedData || '';

    if (userLevel == '' && searchedData == '') {
      message.error('Please select user level to view data');
      return;
    }

    let params = `?page_num=${pageNo}&page_size=${pageLimit}${
      userLevelParams ? `&user_level=${userLevel}` : ''
    }${searchParams ? `&search=${searchedData}` : ''}`;

    setShowFilter(false);
    setLoading(true);
    axiosInstance
      .get(`${endpoints.userManagement.getUserLevel}${params}`)
      .then((res) => {
        if (res?.status === 200) {
          setLoading(false);
          setTotalPage(res?.data?.result?.count);
          setUserData(res?.data?.result?.results);
          setPageNo(res?.data?.result?.current_page);
        } else {
          setLoading(false);
          setTotalPage(0);
          setUserData([]);
          setPageNo(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Name</span>,
      dataIndex: 'name',
      width: '35%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ERP Id</span>,
      dataIndex: 'erp_id',
      width: '25%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>User Level</span>,
      dataIndex: 'level',
      width: '20%',
      render: (data) => (
        <span className='th-black-1 th-14'>
          {userLevelList.filter((item) => item?.id == data)[0]?.level_name}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>User Level ID</span>,
      dataIndex: 'level',
      width: '20%',
      align: 'center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  const handleClearFilter = () => {
    setUserLevel('');
    setSearchedData('');
    setShowFilter(true);
    formRef.current.resetFields();
  };

  const rowSelection = {
    selectedRowKeys: selectedUsers,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedUsers(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.level == 13 && isOrchids,
    }),
  };

  const handleAssignUserLevel = (e) => {
    setAssignUserLevel(e !== undefined ? e : '');
  };

  const handleAssignNewUserLevel = async () => {
    if (!assignUserLevel) {
      message.error('Select user level to assign');
      return;
    }
    if (selectedUsers.length < 1) {
      message.error('Select some users');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('user_level', assignUserLevel);
      formData.append('user', selectedUsers.toString());

      const res = await axiosInstance.post(
        endpoints.userManagement.assignLevel,
        formData
      );

      if (res?.data?.status_code === 201) {
        message.success('User level assigned successfully');
        setSelectedUsers([]);
        setAssignUserLevel('');
        filterData(1, searchedData, userLevel);
        formRef.current.setFieldsValue({
          assignlevel: null,
        });
      }
    } catch (err) {
      console.log('error', err);
    } finally {
      setLoading(false);
    }
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
                Assign User Level
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <Form id='filterForm' className='mt-3' layout={'vertical'} ref={formRef}>
                <div className='row'>
                  <div className='col-md-3 col-sm-6 col-12'>
                    <Form.Item name='userlevel'>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={1}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleUserLevel(e, value)}
                        dropdownMatchSelectWidth={true}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select User Level'
                      >
                        {userLevelOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-md-3 col-sm-6 col-12'>
                    <Form.Item name='search-input'>
                      <Input
                        placeholder='Search input'
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
                          onClick={() => filterData(pageNo, searchedData, userLevel)}
                        >
                          Filter
                        </Button>
                      </div>
                      <div className='col-md-6 col-sm-6 col-6 pl-2'>
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

                {!showFilterPage && selectedUsers.length > 0 && (
                  <div className='row'>
                    <div className='col-md-3 col-sm-6 col-6'>
                      <Form.Item name='assignlevel'>
                        <Select
                          getPopupContainer={(trigger) => trigger.parentNode}
                          maxTagCount={1}
                          allowClear={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          className='th-grey th-bg-grey th-br-4 w-100 text-left'
                          placement='bottomRight'
                          showArrow={true}
                          onChange={(e, value) => handleAssignUserLevel(e, value)}
                          dropdownMatchSelectWidth={true}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          showSearch
                          placeholder='Assign User Level'
                        >
                          {userLevelOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-3 col-sm-6 col-'>
                      <Button
                        type='primary'
                        className='btn-block th-br-4'
                        onClick={handleAssignNewUserLevel}
                      >
                        Assign User Level
                      </Button>
                    </div>
                  </div>
                )}
              </Form>

              <div className='row mt-4'>
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
                    <Table
                      className='th-table'
                      rowClassName={(record, index) =>
                        index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                      }
                      loading={loading}
                      columns={columns}
                      rowKey={(record) => record?.user_id}
                      rowSelection={{ ...rowSelection }}
                      dataSource={userData}
                      pagination={false}
                      // scroll={{
                      //   x: window.innerWidth < 600 ? 'max-content' : null,
                      //   y: 'calc(80vh - 220px)',
                      // }}
                    />

                    {userData?.length > 0 && (
                      <div className='pt-3 '>
                        <Pagination
                          current={pageNo}
                          total={totalPage}
                          showSizeChanger={false}
                          pageSize={pageLimit}
                          onChange={(current) => {
                            setPageNo(current);
                            filterData(current, searchedData, userLevel);
                          }}
                          className='text-center'
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default AssignUserLevel;
