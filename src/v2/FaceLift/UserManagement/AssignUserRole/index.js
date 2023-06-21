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
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Layout from 'containers/Layout';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const AssignUserRole = () => {
  const { Option } = Select;

  const formRef = useRef();
  const [userRoleList, setUserRoleList] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [searchedData, setSearchedData] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  //eslint-disable-next-line
  const [pageLimit, setPageLimit] = useState(15);
  const [loading, setLoading] = useState(false);
  const [showFilterPage, setShowFilter] = useState(true);
  const [userData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignUserRole, setAssignUserRole] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const selectedAcadBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const isOrchids =
    window.location.host.split('.')[0] === 'qa' ||
    window.location.host.split('.')[0] === 'orchids'
      ? true
      : false;

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Assign Role') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (moduleId && selectedYear) {
      fetchGrade(selectedAcadBranch?.branch?.id);
      filterData(
        pageNo,
        searchedData,
        selectedRole,
        selectedAcadBranch?.branch?.id,
        selectedGrade,
        selectedSection
      );
    }

    fetchUserRole();
  }, [moduleId, selectedYear]);

  const handleSearch = (e) => {
    setPageNo(1);
    if (e !== '' || e !== undefined) {
      setSearchedData(e);
    } else {
      setSearchedData('');
    }
  };

  const fetchUserRole = async () => {
    try {
      const result = await axiosInstance.get(`${endpoints.communication.roles}`);
      if (result.status === 200) {
        setUserRoleList(result?.data?.result);
      } else {
        message.error(result?.data?.message);
      }
    } catch (error) {
      message.error(error?.message);
    }
  };

  const userRoleOptions = userRoleList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.role_name}
      </Option>
    );
  });

  const handleChangeRole = (each) => {
    setPageNo(1);
    if (each.some((item) => item.value === 'all')) {
      const allRole = userRoleList.map((item) => item.grade_id).join(',');
      setSelectedRole(allRole);
      formRef.current.setFieldsValue({
        userrole: userRoleList.map((item) => item.grade_id),
      });
    } else {
      const singleRole = each.map((item) => item.value).join(',');
      setSelectedRole(singleRole);
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
        `${endpoints.academics.sections}?session_year=${selectedYear.id}&branch_id=${selectedAcadBranch?.branch?.id}&grade_id=${selectedGrade}&module_id=${moduleId}`
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

  const filterData = (
    pageNo,
    searchedData,
    selectedRole,
    selectedBranch,
    selectedGrade,
    selectedSection
  ) => {
    let userRoleParams = selectedRole || '';
    let branchParams = selectedBranch || '';
    let gradeParams = selectedGrade.length > 0 ? selectedGrade : '';
    let sectionParams = selectedSection.length > 0 ? selectedSection : '';
    let searchParams = searchedData || '';
    let sessionyearparams = selectedYear ? selectedYear?.id : '';
    if (
      selectedRole == '' &&
      searchedData == '' &&
      selectedBranch == '' &&
      selectedGrade == '' &&
      selectedSection == ''
    ) {
      message.error('Please select atleast one filter to view data');
      return;
    }

    let params = `?page=${pageNo}&page_size=${pageLimit}&module_id=${moduleId}
    ${sessionyearparams ? `&session_year=${selectedYear?.id}` : ''}
    ${userRoleParams ? `&role=${selectedRole}` : ''}
    ${branchParams ? `&branch=${selectedBranch}` : ''}
    ${gradeParams ? `&grade=${selectedGrade}` : ''}
    ${sectionParams ? `&section_mapping_id=${selectedSection}` : ''}
    ${searchParams ? `&search=${searchedData}` : ''}`;

    setShowFilter(false);
    setLoading(true);
    axiosInstance
      .get(`${endpoints.communication.userList}${params}`)
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

  const showContactInfo = async (id, index, mail, type) => {
    if (mail.includes('@')) {
      return;
    }
    setLoading(true);
    try {
      const statusChange = await axiosInstance.get(
        `${endpoints.communication.fetchContactInfoByErp}?erp_id=${id}`
      );
      if (statusChange.status === 200) {
        if (type === 'email') {
          const tempGroupData = JSON.parse(JSON.stringify(userData));
          const email = statusChange?.data?.data?.email;
          tempGroupData[index].user.email = email;
          setUserData(tempGroupData);
        } else {
          const tempGroupData = JSON.parse(JSON.stringify(userData));
          const contact = statusChange?.data?.data?.contact;
          tempGroupData[index].contact = contact;
          setUserData(tempGroupData);
        }
        message.success(statusChange.data.message);
      } else {
        message.error(statusChange.data.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Name</span>,
      dataIndex: 'user',
      width: '15%',
      render: (data) => (
        <span className='th-black-1 th-14 text-break'>
          {data?.first_name} {data?.last_name}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700 '>Email</span>,
      dataIndex: 'user',
      width: '20%',
      render: (data, record, index) => (
        <span className='th-black-1 th-14 text-break '>
          {data?.email.includes('X') ? (
            <span
              style={data?.email.includes('@') ? {} : { cursor: 'pointer' }}
              onClick={() => showContactInfo(data?.username, index, data?.email, 'email')}
            >
              ******@mail.com
            </span>
          ) : (
            <span
              style={data?.email.includes('@') ? {} : { cursor: 'pointer' }}
              onClick={() => showContactInfo(data?.username, index, data?.email, 'email')}
            >
              {data?.email}
            </span>
          )}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>ERP Id</span>,
      dataIndex: 'erp_id',
      width: '20%',
      render: (data) => <span className='th-black-1 th-14 text-break'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Gender</span>,
      dataIndex: 'gender',
      width: '10%',
      render: (data) => <span className='th-black-1 th-14 text-break'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Contact</span>,
      dataIndex: 'contact',
      width: '15%',
      render: (data, record, index) => (
        <span
          className='th-black-1 th-14 text-break'
          style={{ cursor: 'pointer' }}
          onClick={() =>
            showContactInfo(record?.erp_id, index, record?.contact, 'contact')
          }
        >
          {record?.contact}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Role</span>,
      dataIndex: 'roles',
      width: '15%',
      render: (data) => (
        <span className='th-black-1 th-14 text-break'>{data?.role_name}</span>
      ),
    },
  ];

  const handleClearFilter = () => {
    setSearchedData('');
    setSelectedRole('');
    setSelectedGrade('');
    setSelectedSection('');
    setSelectedUsers([]);
    setShowFilter(true);
    filterData(1, '', '', selectedAcadBranch?.branch?.id, '', '');
    formRef.current.resetFields();
  };

  const rowSelection = {
    selectedRowKeys: selectedUsers,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedUsers(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled:
        (record?.roles?.role_name == 'Student' ||
          record?.roles?.role_name == 'student' ||
          record?.roles?.role_name == 'Anvesh_Student') &&
        isOrchids,
    }),
  };

  const handleAssignUserRole = (e) => {
    if (e != undefined) {
      setAssignUserRole(e);
    } else {
      setAssignUserRole('');
    }
  };

  const handleAssignNewUserRole = async () => {
    if (assignUserRole == '' || assignUserRole == undefined) {
      message.error('Select user role to assign');
      return;
    }
    if (selectedUsers.length < 1) {
      message.error('Select some users');
      return;
    }
    setLoading(true);
    axiosInstance
      .post(`${endpoints.communication.assignRole}`, {
        role_id: assignUserRole,
        user_id: selectedUsers,
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          message.success('User role assigned successfully');
          setSelectedUsers([]);
          setAssignUserRole('');
          filterData(
            1,
            searchedData,
            selectedRole,
            selectedAcadBranch?.branch?.id,
            selectedGrade,
            selectedSection
          );
          formRef.current.setFieldsValue({
            assignrole: null,
          });
        }
      })
      .catch((err) => {
        console.log('error', err);
      })
      .finally(() => {
        setLoading(false);
      });
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
                Assign User Role
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row mb-3'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <Form id='filterForm' className='mt-3' layout={'vertical'} ref={formRef}>
                <div className='row'>
                  <div className='col-md-3 col-sm-6 col-12'>
                    <Form.Item name='userrole'>
                      <Select
                        mode='multiple'
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={1}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleChangeRole(value)}
                        dropdownMatchSelectWidth={true}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select User Role'
                      >
                        {userRoleOptions}
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
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
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
                        onChange={(e, value) => {
                          handleChangeSection(value);
                        }}
                        onClear={handleClearSection}
                        dropdownMatchSelectWidth={true}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
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
                            filterData(
                              pageNo,
                              searchedData,
                              selectedRole,
                              selectedAcadBranch?.branch?.id,
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

                  {!showFilterPage && selectedUsers.length > 0 && (
                    <>
                      <div className='col-md-3 col-sm-3 col-6'>
                        <Form.Item name='assignrole'>
                          <Select
                            getPopupContainer={(trigger) => trigger.parentNode}
                            maxTagCount={1}
                            allowClear={true}
                            suffixIcon={<DownOutlined className='th-grey' />}
                            className='th-grey th-bg-grey th-br-4 w-100 text-left'
                            placement='bottomRight'
                            showArrow={true}
                            onChange={(e, value) => handleAssignUserRole(e, value)}
                            dropdownMatchSelectWidth={true}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            showSearch
                            placeholder='Assign User Role'
                          >
                            {userRoleOptions}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className='col-md-3 col-sm-6 col-12'>
                        <Button
                          type='primary'
                          className='btn-block th-br-4'
                          onClick={handleAssignNewUserRole}
                        >
                          Assign User Role
                        </Button>
                      </div>
                    </>
                  )}
                </div>
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
                      rowKey={(record) => record?.id}
                      rowSelection={{ ...rowSelection }}
                      dataSource={userData}
                      pagination={false}
                      scroll={{ y: '300px' }}
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
                            filterData(
                              current,
                              searchedData,
                              selectedRole,
                              selectedAcadBranch?.branch?.id,
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
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default AssignUserRole;
