import {
  CloseCircleOutlined,
  DownOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Card,
  Collapse,
  Form,
  Pagination,
  Popconfirm,
  Select,
  Switch,
  Table,
  Tag,
  message,
} from 'antd';
import { Input, Space } from 'antd';
import Layout from 'containers/Layout';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchBranchesForCreateUser } from 'redux/actions';
import axiosInstance from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';

const NonAcademicStaff = () => {
  const { Search } = Input;
  const { Panel } = Collapse;
  const history = useHistory();
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState('');
  const [userRole, setUserRole] = useState('');
  const [status, setStatus] = useState('');
  const { Option } = Select;
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(15);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState('');
  const [searchData, setSearchData] = useState('');
  const [showFilterPage, setShowFilter] = useState(true);

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Name</span>,
      dataIndex: 'name',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ERP Id</span>,
      dataIndex: 'erp_id',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Contact</span>,
      key: 'contact',
      dataIndex: 'contact',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Role</span>,
      key: 'role',
      dataIndex: 'role',
      render: (data) => <span className='th-black-1 th-14'>{data?.role_name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Status</span>,
      align: 'center',
      key: 'status',
      render: (data) => {
        return (
          <Switch
            checked={data.status === '1' ? true : false}
            onChange={() => handleUpdateStatus(data.id, data)}
          />
        );
      },
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      align: 'center',
      key: 'actiom',
      render: (data) => {
        return (
          <Space>
            <Tag
              icon={<EditOutlined />}
              className='th-br-6 th-bg-primary th-white'
              style={{ cursor: 'pointer' }}
              onClick={() =>
                history.push(`/user-management/edit-non-academic-staff/${data.id}`)
              }
            >
              Edit
            </Tag>
            <Popconfirm title='Sure to delete?' onConfirm={(e) => handleDelete(data.id)}>
              <Tag
                icon={<CloseCircleOutlined />}
                color='error'
                style={{ cursor: 'pointer' }}
              >
                Delete
              </Tag>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const deletedColumns = [
    {
      title: <span className='th-white th-fw-700 '>Name</span>,
      dataIndex: 'name',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ERP Id</span>,
      dataIndex: 'erp_id',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Contact</span>,
      key: 'contact',
      dataIndex: 'contact',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Role</span>,
      key: 'role',
      dataIndex: 'role',
      render: (data) => <span className='th-black-1 th-14'>{data?.role_name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Status</span>,
      align: 'center',
      key: 'status',
      render: (data) => {
        return <Switch checked={data.status === '1' ? true : false} />;
      },
    },
  ];

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create User') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);
  useEffect(() => {
    fetchRole();
    fetchBranches();
  }, []);

  const fetchRole = () => {
    axiosInstance
      .get(`${endpoints.nonAcademicStaff.roles}`)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setRoles(res?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const rolesOptions = roles?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.role_name}
      </Option>
    );
  });

  const handleUserRole = (e) => {
    setPageNo(1);
    if (e != undefined) {
      setUserRole(e);
    } else {
      setUserRole('');
    }
  };

  const fetchBranches = () => {
    if (selectedYear) {
      fetchBranchesForCreateUser(selectedYear?.id, moduleId).then((data) => {
        const transformedData = data?.map((obj) => ({
          id: obj.id,
          branch_name: obj.branch_name,
          branch_code: obj.branch_code,
        }));
        setBranches(transformedData);
      });
    }
  };

  const branchListOptions = branches?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.branch_name}
      </Option>
    );
  });

  const handleUserBranch = (e) => {
    setPageNo(1);
    if (e != undefined) {
      setBranch(e);
    } else {
      setBranch('');
    }
  };

  const statusOptions = [
    { value: 1, label: 'Active' },
    { value: 2, label: 'Deactive' },
    { value: 3, label: 'Deleted' },
  ].map((each) => (
    <Option key={each?.value} value={each?.value}>
      {each?.label}
    </Option>
  ));

  const handleStatus = (e) => {
    setPageNo(1);
    if (e != undefined) {
      setStatus(e);
    } else {
      setStatus('');
    }
  };

  const onChangeSearch = (pageNo, value) => {
    setLoading(true);
    setSearchData(value);
    setBranch('');
    setUserRole('');
    setStatus('');
    setShowFilter(false);
    let params = `?page=${pageNo}&page_size=${pageLimit}&session_year=${selectedYear?.id}&search=${value}`;
    axiosInstance
      .get(`${endpoints.nonAcademicStaff.createStaff}${params}`)
      .then((res) => {
        if (res?.status === 200) {
          setUserData(res?.data?.results);
          setTotalPage(res?.data?.count);
          setPageNo(res?.data?.current_page);
          setLoading(false);
          formRef.current.resetFields();
        } else {
          setUserData([]);
          setTotalPage(0);
          setPageNo(1);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const filterData = (pageNo, branch, userRole, status) => {
    if (branch === '' || branch === undefined) {
      message.error('Please Select Branch');
      return;
    }
    // if (userRole === '' || userRole === undefined) {
    //   message.error('Please Select Role');
    //   return;
    // }
    // if (status === '' || status === undefined) {
    //   message.error('Please Select Status');
    //   return;
    // }
    setSearchData('');
    setShowFilter(false);
    searchRef.current.resetFields();
    let statusparams = status !== undefined || status !== '' ? status : '';
    let roleParams = userRole !== undefined || userRole !== '' ? userRole : '';

    let params = `?page=${pageNo}&page_size=${pageLimit}&session_year=${
      selectedYear?.id
    } ${roleParams !== '' ? `&role=${userRole}` : ''} &branch_id=${branch}${
      statusparams !== '' ? `&status=${statusparams}` : ''
    }`;
    // let params = `?page=1&page_size=${pageLimit}&session_year=2&role=207&branch_id=83&status=2`;
    setLoading(true);
    axiosInstance
      .get(`${endpoints.nonAcademicStaff.createStaff}${params}`)
      .then((res) => {
        if (res?.status === 200) {
          setLoading(false);
          setTotalPage(res?.data?.count);
          setUserData(res?.data?.results);
          setPageNo(res?.data?.current_page);
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

  const formRef = useRef();
  const searchRef = useRef();

  const handleClearFilter = () => {
    setBranch('');
    setUserRole('');
    setStatus('');
    setUserData([]);
    setShowFilter(true);
    formRef.current.resetFields();
    searchRef.current.resetFields();
  };

  const handleUpdateStatus = (id, data) => {
    let body = {
      status: data?.status === '1' ? '2' : '1',
    };
    axiosInstance
      .put(`/erp_user/${id}/add_non_acadamic_user/`, body)
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setStatus('');
          if (branch !== '') {
            filterData(pageNo, branch, userRole, '');
            formRef.current.setFieldsValue({
              status: null,
            });
          } else {
            onChangeSearch(pageNo, searchData);
          }
          message.success('status updated Successfully');
        }
      })
      .catch((error) => {
        message.error('status updation failed');
        // console.log(error);
      });
  };

  const handleDelete = (id) => {
    axiosInstance
      .delete(`/erp_user/${id}/add_non_acadamic_user/`)
      .then((res) => {
        if (res?.data?.status_code == 200) {
          message.success('User Deleted Successfully');
          setStatus('');
          if (branch !== '') {
            filterData(pageNo, branch, userRole, '');
            formRef.current.setFieldsValue({
              status: null,
            });
          } else {
            onChangeSearch(pageNo, searchData);
          }
        }
      })
      .catch((error) => {
        message.error('Deletion failed');
        // console.log(error);
      });
  };

  return (
    <React.Fragment>
      <Layout>
        {/* Breadcrumb */}
        <div className='row py-3 px-3'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                href='/user-management/non-academic-staff'
                className='th-grey th-16'
              >
                User Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Non Academic Staff
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* <div className='bg-white th-br-8 mx-3 py-3'> */}
        <div className='row my-3 px-3 justify-content-center'>
          <div className='col-md-12'>
            <Card className='th-br-8'>
              <div className='row justify-content-center'>
                <div className='col-md-10 pl-0'>
                  <Form ref={searchRef}>
                    <Form.Item name='search-input'>
                      <Search
                        placeholder='Search'
                        allowClear
                        onChange={(e) => onChangeSearch(pageNo, e.target.value)}
                      />
                    </Form.Item>
                  </Form>
                </div>
                <div className='col-md-2 pr-0'>
                  <Button
                    onClick={() =>
                      history.push(`/user-management/create-non-academic-staff`)
                    }
                    className='btn-block th-br-4'
                    type='primary'
                    icon={<PlusCircleOutlined style={{ color: '#fffff' }} />}
                  >
                    Create Staff
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div
          className='row my-3 px-3 justify-content-center'
          style={{ alignItems: 'center' }}
        >
          {/* <div className='col-md-2'>
            <Button
              onClick={() => history.push(`/user-management/create-non-academic-staff`)}
              className='btn btn-block'
              type='primary'
            >
              Create Staff
            </Button>
          </div> */}
          <div className='col-md-12'>
            {/* <Collapse style={{ backgroundColor: 'white' }}>*/}
            <Card className='th-br-8'>
              <h6 className='card-content'>Filter</h6>
              <Form id='filterForm' className='mt-3' layout={'vertical'} ref={formRef}>
                <div className='row justify-content-center'>
                  <div className='col-md-3 pl-0'>
                    <Form.Item name='branch'>
                      <Select
                        allowClear={true}
                        className='th-grey th-bg-white  w-100 text-left'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleUserBranch(e, value)}
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        getPopupContainer={(trigger) => trigger.parentNode}
                        placeholder='Select Branch'
                      >
                        {branchListOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-md-3'>
                    <Form.Item name='role'>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={5}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleUserRole(e, value)}
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select User Role'
                      >
                        {rolesOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-md-3'>
                    <Form.Item name='status'>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={5}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleStatus(e, value)}
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select Status'
                      >
                        {statusOptions}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className='col-md-3 pr-0'>
                    <div className='d-flex'>
                      <Button
                        type='primary'
                        className='btn-block mx-2 th-br-4'
                        onClick={() => filterData(pageNo, branch, userRole, status)}
                      >
                        View
                      </Button>

                      <Button
                        type='secondary'
                        className='btn-block mx-2 mt-0 th-br-4'
                        onClick={handleClearFilter}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  {/* <div className='col-md-2 mt-3'></div> */}
                </div>
              </Form>
            </Card>
            {/* </Collapse> */}
          </div>
        </div>

        <div className='row mt-4 px-3'>
          {showFilterPage ? (
            <div className='col-12'>
              <Card
                className='bg-white th-br-8 mb-3'
                style={{
                  minHeight: '40vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <h4>Please apply filter to show data.</h4>
              </Card>
            </div>
          ) : (
            <div className='col-md-12 mb-3'>
              <Table
                className='th-table'
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                }
                loading={loading}
                columns={status === 3 ? deletedColumns : columns}
                rowKey={(record) => record?.id}
                dataSource={userData}
                pagination={false}
                scroll={{
                  x: window.innerWidth < 600 ? 'max-content' : null,
                  y: 'calc(100vh - 220px)',
                }}
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
                      if (branch !== '') {
                        filterData(current, branch, userRole, '');
                        formRef.current.setFieldsValue({
                          status: null,
                        });
                      } else {
                        onChangeSearch(current, searchData);
                      }
                    }}
                    className='text-center'
                  />
                </div>
              )}
            </div>
          )}
        </div>
        {/* </div> */}
      </Layout>
    </React.Fragment>
  );
};

export default NonAcademicStaff;
