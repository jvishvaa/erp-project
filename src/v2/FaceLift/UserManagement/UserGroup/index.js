import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Input,
  message,
  Form,
  Tabs,
  Result,
} from 'antd';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Layout from 'containers/Layout';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import CreateGroup from './CreateGroup';

const UserGroup = () => {
  const { Option } = Select;
  const { TabPane } = Tabs;

  const formRef = useRef();
  const [searchedData, setSearchedData] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  //eslint-disable-next-line
  const [pageLimit, setPageLimit] = useState(15);
  const [loading, setLoading] = useState(false);
  const [showFilterPage, setShowFilter] = useState(true);
  const [userGroupData, setUserGroupData] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [showTab, setShowTab] = useState('1');
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState('');

  const onTabChange = (key) => {
    setShowTab(key);
    if (key === '1') {
      setIsEdit(false);
      setEditData([]);
    }
  };

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Group Name</span>,
      dataIndex: 'group_name',
      width: '18%',
      render: (data) => <span className='th-black-1 th-14 text-break'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700 '>Branch</span>,
      dataIndex: 'group_section_mapping',
      width: '18%',
      render: (data) => (
        <span className='th-black-1 th-14 text-break'>{data[0]?.group_branch}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Grades</span>,
      dataIndex: 'group_section_mapping',
      width: '18%',
      render: (data) => (
        <span className='th-black-1 th-14 text-break'>{data[0]?.group_grade}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Status</span>,
      dataIndex: 'is_active',
      width: '18%',
      render: (data) => (
        <span className={`th-black-1 ${data ? 'th-green' : 'th-red'}  th-14 text-break`}>
          {data ? 'Activated' : 'Deactivated'}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      align: 'center',
      key: 'actiom',
      width: '28%',
      render: (data) => {
        return (
          <Space>
            <Tag
              icon={<EditOutlined />}
              color='processing'
              onClick={() => handleEdit(data)}
              style={{ cursor: 'pointer' }}
            >
              Edit
            </Tag>
            <Popconfirm
              title={`Sure to ${data?.is_active ? 'deactivate' : 'activate'} ?`}
              onConfirm={(e) =>
                handleStatusChange(data.id, data?.is_active ? false : true)
              }
            >
              <Tag
                icon={data?.is_active ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                color={data?.is_active ? 'warning' : 'success'}
                style={{ cursor: 'pointer' }}
              >
                {data?.is_active ? 'Deactivate' : 'Activate'}
              </Tag>
            </Popconfirm>

            <Popconfirm
              title='Sure to delete?'
              onConfirm={(e) => handleDeleteUserGroup(data.id)}
            >
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

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'User Groups') {
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
        const response = await axiosInstance.get(
          `${endpoints.academics.branches}?session_year=${selectedYear.id}&module_id=${moduleId}`
        );
        if (response.data.status_code === 200) {
          setBranchList(response?.data?.data?.results);
        } else {
          message.error(response?.data?.message);
        }
      } catch (error) {
        message.error(error.message);
      }
    }
  };

  const branchListOptions = branchList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id} branchId={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const handleUserBranch = (e, value) => {
    setPageNo(1);
    if (e) {
      setSelectedBranch(e);
      fetchGrade(value?.branchId);
      setSelectedGrade('');
      setUserGroupData([]);
      formRef.current.setFieldsValue({
        grade: null,
      });
    } else {
      setSelectedBranch('');
      setSelectedGrade('');
      setGradeList([]);
      setUserGroupData([]);
      formRef.current.setFieldsValue({
        branch: null,
        grade: null,
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

  const handleGrade = (e) => {
    setPageNo(1);
    if (e != undefined) {
      setSelectedGrade(e);
      setUserGroupData([]);
    } else {
      setSelectedGrade('');
      setUserGroupData([]);
      formRef.current.setFieldsValue({
        grade: null,
      });
    }
  };

  const fetchUserGroup = (pageNo, searchedData, selectedBranch, selectedGrade) => {
    let branchParams = selectedBranch || '';
    let gradeParams = selectedGrade || '';
    let searchParams = searchedData || '';

    if (selectedBranch == '') {
      message.error('Please select branch');
      return;
    }

    if (selectedGrade == '') {
      message.error('Please select Grade');
      return;
    }

    let params = `?page=${pageNo}&page_size=${pageLimit}
    ${branchParams ? `&acad_session=${selectedBranch}` : ''}
    ${gradeParams ? `&grade=${selectedGrade}` : ''}
    ${searchParams ? `&search=${searchedData}` : ''}`;

    setShowFilter(false);
    setLoading(true);
    axiosInstance
      .get(`${endpoints.communication.userGroups}${params}`)
      .then((res) => {
        if (res?.status === 200) {
          setLoading(false);
          setTotalPage(res?.data?.count);
          setUserGroupData(res?.data?.results);
          setPageNo(res?.data?.current_page);
        } else {
          setLoading(false);
          setTotalPage(0);
          setUserGroupData([]);
          setPageNo(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClearFilter = () => {
    setPageNo(1);
    setSearchedData('');
    setSelectedBranch('');
    setSelectedGrade('');
    setShowFilter(true);
    formRef.current.resetFields();
  };

  const handleStatusChange = async (id, status) => {
    try {
      const statusChange = await axiosInstance.put(
        `${endpoints.communication.editGroup}${id}/update-retrieve-delete-groups/`,
        { is_active: status }
      );
      if (statusChange.status === 200) {
        fetchUserGroup(pageNo, searchedData, selectedBranch, selectedGrade);
        message.success(statusChange.data.message);
      } else {
        message.error(statusChange.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDeleteUserGroup = async (id) => {
    try {
      const deleteGroup = await axiosInstance.delete(
        `${endpoints.communication.editGroup}${id}/update-retrieve-delete-groups/`
      );
      if (deleteGroup.status === 200) {
        fetchUserGroup(pageNo, searchedData, selectedBranch, selectedGrade);
        message.success(deleteGroup.data.message);
      } else {
        message.error(deleteGroup.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleEdit = (data) => {
    setIsEdit(true);
    setShowTab('2');
    setEditData(data);
  };

  const handleFetchUserGroup = (page) => {
    if (page && selectedBranch && selectedGrade) {
      fetchUserGroup(1, searchedData, selectedBranch, selectedGrade);
      onTabChange('1');
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
              <Breadcrumb.Item className='th-black-1 th-16'>User Group</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row mb-3'>
          <div className='col-md-12'>
            <div className='th-tabs th-bg-white'>
              <Tabs type='card' onChange={onTabChange} activeKey={showTab}>
                <TabPane tab='User Group' key='1'>
                  <Form id='filterForm' layout={'vertical'} ref={formRef}>
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
                            getPopupContainer={(trigger) => trigger.parentNode}
                            maxTagCount={1}
                            allowClear={true}
                            suffixIcon={<DownOutlined className='th-grey' />}
                            className='th-grey th-bg-grey th-br-4 w-100 text-left'
                            placement='bottomRight'
                            showArrow={true}
                            onChange={(e, value) => handleGrade(e, value)}
                            dropdownMatchSelectWidth={true}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            showSearch
                            placeholder='Select Grade*'
                          >
                            {gradeOptions}
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
                                fetchUserGroup(
                                  pageNo,
                                  searchedData,
                                  selectedBranch,
                                  selectedGrade
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
                      <div className='col-md-12 mb-3'>
                        <Table
                          className='th-table'
                          rowClassName={(record, index) =>
                            index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                          }
                          loading={loading}
                          columns={columns}
                          rowKey={(record) => record?.user_id}
                          dataSource={userGroupData}
                          pagination={false}
                          scroll={{ y: '300px' }}
                        />

                        {userGroupData?.length > 0 && (
                          <div className='pt-3 '>
                            <Pagination
                              current={pageNo}
                              total={totalPage}
                              showSizeChanger={false}
                              pageSize={pageLimit}
                              onChange={(current) => {
                                setPageNo(current);
                                fetchUserGroup(
                                  current,
                                  searchedData,
                                  selectedBranch,
                                  selectedGrade
                                );
                              }}
                              className='text-center'
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabPane>
                <TabPane tab={`${isEdit ? 'Edit Group' : 'Create Group'}`} key='2'>
                  {showTab === '2' && (
                    <CreateGroup
                      showTab={showTab}
                      setShowTab={setShowTab}
                      isEdit={isEdit}
                      editData={editData}
                      setShowFilter={setShowFilter}
                      showFilterPage={showFilterPage}
                      handleFetchUserGroup={handleFetchUserGroup}
                    />
                  )}
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default UserGroup;
