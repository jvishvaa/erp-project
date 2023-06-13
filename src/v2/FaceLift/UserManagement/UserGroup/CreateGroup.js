import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Input, Pagination, Result, Select, Table, message } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';

const CreateGroup = ({ setShowTab, isEdit, editData, handleFetchUserGroup }) => {
  const { Option } = Select;
  const formRef = useRef();

  const [searchedData, setSearchedData] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedBranchName, setSelectedBranchName] = useState('');
  const [gradeList, setGradeList] = useState([]);
  //   const [selectedGrade, setSelectedGrade] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [groupName, setGroupName] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  //eslint-disable-next-line
  const [pageLimit, setPageLimit] = useState(15);
  const [loading, setLoading] = useState(false);
  const [showFilterPage, setShowFilter] = useState(true);
  const [userData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupId, setGroupId] = useState('');

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

  useEffect(() => {
    if (isEdit && moduleId && showFilterPage && selectedUsers) {
      const { group_branch_id, group_branch, group_grade_id } =
        editData?.group_section_mapping[0];
      const { group_users, group_name, id: group_id, group_section_mapping } = editData;
      let sectionIds = group_section_mapping?.map((item) => item.section_mapping_id);

      setSelectedBranch(group_branch_id);
      setSelectedBranchName(group_branch);
      setGroupName(group_name);
      setGroupId(group_id);
      fetchGrade(group_branch_id);
      fetchSection(group_grade_id, group_branch_id);
      fetchStudent(1, sectionIds);
      setShowFilter(true);
      let selectedUsersId = group_users?.map((item) => item.id);
      setTimeout(() => {
        setSelectedUsers(selectedUsersId || []);
        setSelectedSection(sectionIds || []);
      }, 100);
      formRef.current.setFieldsValue({
        branch: group_branch_id,
        grade: group_grade_id,
        section: sectionIds,
        groupname: group_name,
      });
    }
  }, [isEdit, moduleId, showFilterPage]);

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

  const fetchSection = async (selectedGrade, selectedBranch) => {
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

  const fetchStudent = (pageNo, selectedSection) => {
    let sectionParams = selectedSection.length > 0 ? selectedSection : '';
    if (selectedSection == '') {
      message.error('Please select all filter to view data');
      return;
    }

    let params = `?page=${pageNo}&page_size=${pageLimit}&level=13
    ${sectionParams ? `&section_mapping_id=${selectedSection}` : ''}`;

    setShowFilter(false);
    setLoading(true);
    axiosInstance
      .get(`${endpoints.communication.communicationUserList}${params}`)
      .then((res) => {
        const { data, status_code } = res?.data;
        if (status_code === 200) {
          setLoading(false);
          setTotalPage(data?.count);
          setUserData(data?.results);
          setPageNo(data?.current_page);
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

  const branchListOptions = branchList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.branch_name}
      </Option>
    );
  });

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const handleUserBranch = (e, value) => {
    if (e !== undefined) {
      setSelectedBranch(e);
      setSelectedBranchName(value?.children);
      fetchGrade(e);
    } else {
      setSelectedBranch('');
      setSelectedBranchName('');
      //   setSelectedGrade('');
      setSelectedSection('');
      setGradeList([]);
      setSectionList([]);
      setSelectedUsers([]);
      setUserData([]);
      setShowFilter(true);
      formRef.current.setFieldsValue({
        branch: null,
        grade: null,
        section: [],
      });
    }
  };

  const handleGrade = (e) => {
    if (e !== undefined) {
      //   setSelectedGrade(e);
      fetchSection(e, selectedBranch);
    } else {
      //   setSelectedGrade('');
      setSelectedSection('');
      setSectionList([]);
      setSelectedUsers([]);
      setUserData([]);
      setShowFilter(true);
      formRef.current.setFieldsValue({
        grade: null,
        section: [],
      });
    }
  };

  const handleSection = (e) => {
    if (e.length > 0) {
      setSelectedSection(e);
    } else {
      setSelectedSection('');
      setUserData([]);
      formRef.current.setFieldsValue({
        section: [],
      });
    }
  };
  // const handleSelectSection = (each) => {
  //   if (each.value == 'all') {
  //     formRef.current.setFieldsValue({
  //       section: sectionList?.map((item) => item.id),
  //     });
  //     setSelectedSection(sectionList.map((item) => item.id));
  //   } else {
  //     if (!selectedSection.includes(each.value)) {
  //       setSelectedSection([...selectedSection, Number(each.value)]);
  //     }
  //   }
  // };

  // const handleDeSelectSection = (each) => {
  //   if (each.value == 'all') {
  //     setSelectedSection([]);
  //   } else {
  //     const sectionMappingIdIndex = selectedSection.indexOf(each?.value);
  //     const newSectionMappingIdList = selectedSection.slice();
  //     newSectionMappingIdList.splice(sectionMappingIdIndex, 1);
  //     setSelectedSection(newSectionMappingIdList);
  //   }
  // };
  // const handleClearSection = () => {
  //   setSelectedSection([]);
  // };

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Name</span>,
      dataIndex: 'user',
      width: '25%',
      render: (data) => (
        <span className='th-black-1 th-14'>
          {data?.first_name} {data?.last_name}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>ERP Id</span>,
      dataIndex: 'erp_id',
      width: '20%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Branch</span>,
      dataIndex: '',
      width: '20%',
      render: (data) => <span className='th-black-1 th-14'>{selectedBranchName}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Grade</span>,
      dataIndex: 'section_mapping',
      width: '15%',
      align: 'center',
      render: (data) => (
        <span className='th-black-1 th-14'>{data[0]?.grade?.grade_name}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Section</span>,
      dataIndex: 'section_mapping',
      width: '15%',
      align: 'center',
      render: (data) => (
        <span className='th-black-1 th-14'>{data[0]?.section?.section_name}</span>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedUsers,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedUsers(selectedRowKeys);
    },
    preserveSelectedRowKeys: true,
  };

  const handleClearFilter = () => {
    setSearchedData('');
    setSelectedBranch('');
    // setSelectedGrade('');
    setSelectedSection('');
    setGradeList([]);
    setSectionList([]);
    setSelectedUsers([]);
    setShowFilter(true);
    formRef.current.resetFields();
  };

  const handleEditClearFilter = () => {
    setSearchedData('');
    setSelectedSection('');
    formRef.current.setFieldsValue({
      section: [],
    });
  };

  const handleCreateGroup = async () => {
    if (selectedSection.length < 1) {
      message.error('Select section');
      return;
    }
    if (selectedUsers.length < 1) {
      message.error('Select some users');
      return;
    }

    if (groupName === '') {
      message.error('Please enter group name');
      return;
    }

    setLoading(true);
    if (!isEdit) {
      axiosInstance
        .post(`${endpoints.communication.addGroup}`, {
          group_name: groupName,
          section_mapping: selectedSection,
          erpusers: selectedUsers,
        })
        .then((res) => {
          if (res?.data?.status_code === 200) {
            formRef.current.resetFields();
            message.success('Group Created successfully');
            setShowTab('1');
            handleFetchUserGroup(1);
          }
        })
        .catch((err) => {
          console.log('error', err);
          message.error(err?.response?.data?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      axiosInstance
        .put(
          `${endpoints.communication.editGroup}${groupId}/update-retrieve-delete-groups/`,
          {
            group_name: groupName,
            section_mapping: selectedSection,
            erpusers: selectedUsers,
            is_active: editData?.is_active,
          }
        )
        .then((res) => {
          if (res?.data?.status_code === 200) {
            formRef.current.resetFields();
            message.success('Group Updated successfully');
            handleFetchUserGroup(1);
            setShowTab('1');
          }
        })
        .catch((err) => {
          console.log('error', err);
          message.error('Something went wrong update');
          // message.error(err?.response?.data?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <React.Fragment>
      <div className='row mb-3'>
        <div className='col-md-12'>
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
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    disabled={isEdit}
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
                    maxTagCount={5}
                    allowClear={true}
                    suffixIcon={<DownOutlined className='th-grey' />}
                    className='th-grey th-bg-grey th-br-4 w-100 text-left'
                    placement='bottomRight'
                    showArrow={true}
                    onChange={(e, value) => handleGrade(e, value)}
                    dropdownMatchSelectWidth={true}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    disabled={isEdit}
                    showSearch
                    placeholder='Select Grade*'
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
                    onChange={(e, value) => handleSection(e, value)}
                    // onDeselect={(e, value) => {
                    //   handleDeSelectSection(value);
                    // }}
                    // onClear={handleClearSection}
                    dropdownMatchSelectWidth={true}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    showSearch
                    placeholder='Select section*'
                  >
                    {/* {sectionOptions.length > 1 && (
                      <>
                        <Option key={0} value={'all'}>
                          All
                        </Option>
                      </>
                    )} */}
                    {sectionOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-3 col-sm-6 col-12'>
                <Form.Item name='search-input'>
                  <Input
                    prefix={<SearchOutlined className='site-form-item-icon th-grey' />}
                    placeholder='Search'
                    allowClear
                    onChange={(e) => setSearchedData(e.target.value)}
                    // onChange={(e) => handleSearch(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3 col-sm-6 col-12 text-right'>
                <div className='row no-gutters'>
                  <div className='col-md-6 col-sm-6 col-6 pr-2'>
                    <Button
                      type='primary'
                      className='btn-block th-br-4 mb-3'
                      onClick={() => fetchStudent(pageNo, selectedSection)}
                    >
                      Filter
                    </Button>
                  </div>
                  <div className='col-md-6 col-sm-6 col-6 pl-20'>
                    <Button
                      type='secondary'
                      className='btn-block mt-0 th-br-4'
                      onClick={!isEdit ? handleClearFilter : handleEditClearFilter}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
              {(!showFilterPage && selectedUsers.length > 0) || editData.id ? (
                <>
                  <div className='col-md-3 col-sm-6 col-12'>
                    <Form.Item
                      name='groupname'
                      rules={[
                        {
                          pattern: /^[a-zA-Z ]*$/,
                          message: 'Group name should contain only character',
                        },
                        { required: true, message: 'Please Enter Group name' },
                      ]}
                      required={true}
                      validationTrigger='onChange'
                    >
                      <Input
                        placeholder='Group name'
                        onChange={(e) => setGroupName(e.target.value)}
                      />
                    </Form.Item>
                  </div>
                  <div className='col-md-3 col-sm-6 col-12'>
                    <Button
                      type='primary'
                      className='btn-block th-br-4'
                      onClick={handleCreateGroup}
                    >
                      {isEdit ? 'Update Group' : 'Create Group'}
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          </Form>

          <div className='row mt-2'>
            {showFilterPage && !editData?.id ? (
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
                  //   dataSource={userData}
                  preserveSelectedRowKeys={true}
                  dataSource={userData.filter(
                    (item) =>
                      item?.user?.first_name
                        .toLowerCase()
                        .includes(searchedData.toLowerCase()) ||
                      item?.user?.last_name
                        .toLowerCase()
                        .includes(searchedData.toLowerCase()) ||
                      item?.erp_id.toLowerCase().includes(searchedData.toLowerCase())
                  )}
                  pagination={false}
                />

                {userData?.length > 0 && (
                  <div className='pt-3 '>
                    <Pagination
                      current={pageNo}
                      total={totalPage}
                      showSizeChanger={false}
                      pageSize={pageLimit}
                      preserveSelectedRowKeys={true}
                      onChange={(current) => {
                        setPageNo(current);
                        fetchStudent(current, selectedSection);
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
    </React.Fragment>
  );
};

export default CreateGroup;
