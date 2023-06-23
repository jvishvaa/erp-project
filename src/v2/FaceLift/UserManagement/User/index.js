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

const User = () => {
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
  const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const loggedUserData = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  //eslint-disable-next-line
  const [pageLimit, setPageLimit] = useState(15);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState('');
  const [searchData, setSearchData] = useState('');
  const [showFilterPage, setShowFilter] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const formRef = useRef();
  const searchRef = useRef();

  const isOrchids =
    window.location.host.split('.')[0] === 'orchids' ||
    window.location.host.split('.')[0] === 'qa' ||
    window.location.host.split('.')[0] === 'mcollege' ||
    window.location.host.split('.')[0] === 'dps'
      ? true
      : false;

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Name</span>,
      dataIndex: 'user',
      render: (data) => (
        <span className='th-black-1 th-14'>
          {data?.first_name} {data?.last_name}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>ERP Id</span>,
      dataIndex: 'erp_id',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Email</span>,
      key: 'user',
      dataIndex: 'user',
      render: (data, record, index) => (
        <span className='th-black-1 th-14'>
          {data?.email.includes('*') ? (
            <span
              style={data?.email.includes('@') ? {} : { cursor: 'pointer' }}
              onClick={() => showContactInfo(data?.username, index, data?.email)}
            >
              ******@mail.com
            </span>
          ) : (
            <span
              style={data?.email.includes('@') ? {} : { cursor: 'pointer' }}
              onClick={() => showContactInfo(data?.username, index, data?.email)}
            >
              {data?.email}
            </span>
          )}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Role</span>,
      key: 'roles',
      dataIndex: 'roles',
      render: (data) => <span className='th-black-1 th-14'>{data?.role_name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Status</span>,
      align: 'center',
      key: 'status',
      render: (data) => {
        return (
          <span>
            {data.status === 'active' ? (
              <div style={{ color: 'green' }}>Activated</div>
            ) : data.status === 'deleted' ? (
              <div style={{ color: 'red' }}>Deleted</div>
            ) : (
              <div style={{ color: 'red' }}>Deactivated</div>
            )}
          </span>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      align: 'center',
      key: 'actiom',
      render: (data) => {
        return (
          <>
            {data && data.status === 'deleted' ? (
              <Popconfirm
                title='Sure to restore?'
                onConfirm={(e) => handleRestoreUser(data.id, '1')}
              >
                <HistoryOutlined
                  rotate={180}
                  title='Restore'
                  style={{ color: '#1B4CCB' }}
                />
              </Popconfirm>
            ) : data.status === 'active' ? (
              isOrchids && data?.level == 13 ? null : (
                <Space>
                  <Popconfirm
                    title='Sure to deactivate?'
                    onConfirm={(e) => handleStatusChange(data.id, '2')}
                  >
                    <StopOutlined
                      title='Deactivate'
                      style={{ margin: 10, cursor: 'pointer', color: '#1B4CCB' }}
                    />
                  </Popconfirm>
                </Space>
              )
            ) : isOrchids && data?.level == 13 ? null : (
              <Popconfirm
                title='Sure to activate?'
                onConfirm={(e) => handleStatusChange(data.id, '1')}
              >
                <button
                  type='submit'
                  title='Activate'
                  style={{
                    borderRadius: '50%',
                    backgroundColor: 'green',
                    border: 0,
                    width: '30px',
                    height: '30px',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  A
                </button>
              </Popconfirm>
            )}

            {data && data.status !== 'deleted' ? (
              <>
                {isOrchids && data?.level == 13 ? null : (
                  <Popconfirm
                    title='Sure to delete?'
                    onConfirm={(e) => handleDeleteUser(data.id)}
                  >
                    <DeleteOutlined
                      title='Delete'
                      style={{ margin: 10, cursor: 'pointer', color: '#1B4CCB' }}
                    />
                  </Popconfirm>
                )}

                <Link to={`/user-management/edit-user/${data.id}`}>
                  <EditOutlined
                    title='Edit'
                    style={{ margin: 10, cursor: 'pointer', color: '#1B4CCB' }}
                  />
                </Link>
              </>
            ) : (
              ''
            )}
          </>
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
            if (item.child_name === 'View User') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    fetchUserLevel();
    fetchBranches();
  }, []);

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

  const userLevelOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });

  const handleUserLevel = (e) => {
    setPageNo(1);
    if (e != undefined) {
      setUserLevel(e);
    } else {
      setUserLevel('');
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
        `${endpoints.academics.sections}?session_year=${selectedYear.id}&branch_id=${branch}&grade_id=${grade}&module_id=${moduleId}`
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

  const statusOptions = [
    { value: 0, label: 'All' },
    { value: 1, label: 'Active' },
    { value: 2, label: 'Inactive' },
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
    setUserLevel('');
    setStatus('');
    setShowFilter(false);
    if (value) {
      let params = `?page=${pageNo}&page_size=${pageLimit}&module_id=${moduleId}&session_year=${selectedYear?.id}&search=${value}`;
      axiosInstance
        .get(`${endpoints.communication.viewUser}${params}`)
        .then((res) => {
          if (res?.status === 200) {
            setUserData(res?.data?.results);
            setTotalPage(res?.data?.count);
            setPageNo(res?.data?.current_page ? res?.data?.current_page : 1);
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
    } else {
      setUserData([]);
      setTotalPage(0);
      setPageNo(1);
      setLoading(false);
    }
  };

  const filterData = (pageNo, branch, userLevel, grade, section, status) => {
    setSearchData('');
    searchRef.current.resetFields();

    let userLevelParams = userLevel || '';
    let branchParams = branch || '';
    let gradeParams = grade || '';
    let sectionParams = section || '';
    let statusparams = status || '';

    if (userLevel == '' && branch == '' && grade == '' && section == '' && status == '') {
      message.error('Please select atleast one filter to view data');
      return;
    }

    setShowFilter(false);

    let params = `?page=${pageNo}&page_size=${pageLimit}&module_id=${moduleId}&session_year=${
      selectedYear?.id
    }${branchParams ? `&branch=${branch}` : ''}${
      userLevelParams.length > 0 ? `&user_level=${userLevel}` : ''
    }${gradeParams.length > 0 ? `&grade=${grade}` : ''}${
      sectionParams.length > 0 ? `&section_mapping_id=${section}` : ''
    }${statusparams ? `&status=${statusparams}` : ''}`;

    setLoading(true);
    axiosInstance
      .get(`${endpoints.communication.viewUser}${params}`)
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

  const handleExcel = () => {
    setLoading(true);

    let statusparams = status || '';
    if (!loggedUserData?.is_superuser) {
      if (
        userLevel == '' &&
        branch == '' &&
        grade == '' &&
        section == '' &&
        status == ''
      ) {
        message.error('Please select atleast one filter');
        return;
      }
    }
    setDownloadLoading(true);
    let paramsObj = {};
    paramsObj.module_id = moduleId;
    paramsObj.session_year = selectedYear.id;
    if (branch) {
      paramsObj.branch = branch ? branch : '';
    }
    if (userLevel) {
      paramsObj.user_level = userLevel;
    }
    if (grade) {
      paramsObj.grade = grade;
    }
    if (section) {
      paramsObj.section_mapping_id = section;
    }
    if (statusparams) {
      paramsObj.status = statusparams;
    }

    axiosInstance
      .get(endpointsV2.userManagement.downloadUserData, {
        params: { ...paramsObj },
        responseType: 'arraybuffer',
      })
      .then((res) => {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'user_list.xls');
        setDownloadLoading(false);
        setLoading(false);
      })
      .catch((error) => {
        message.error('Something Wrong!');
        setDownloadLoading(false);
      });
  };

  const showContactInfo = async (id, index, mail) => {
    if (mail.includes('@')) {
      return;
    }
    setLoading(true);
    try {
      const statusChange = await axiosInstance.get(
        `${endpoints.communication.fetchContactInfoByErp}?erp_id=${id}`
      );
      if (statusChange.status === 200) {
        const tempGroupData = JSON.parse(JSON.stringify(userData));
        const email = statusChange?.data?.data?.email;
        tempGroupData[index].user.email = email;
        setUserData(tempGroupData);
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

  const handleStatusChange = async (id, status) => {
    try {
      const statusChange = await axiosInstance.put(
        `${endpoints.communication.userStatusChange}${id}/update-user-status/`,
        { status }
      );
      if (statusChange.status === 200) {
        if (
          userLevel == '' &&
          branch == '' &&
          grade == '' &&
          section == '' &&
          status == ''
        ) {
          onChangeSearch(pageNo, searchData);
        } else {
          filterData(pageNo, branch, userLevel, grade, section, status);
        }
        message.success(statusChange.data.message);
      } else {
        message.error(statusChange.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const statusChange = await axiosInstance.delete(
        `${endpoints.communication.userStatusChange}${id}/delete-user/`
      );
      if (statusChange.status === 200) {
        if (
          userLevel == '' &&
          branch == '' &&
          grade == '' &&
          section == '' &&
          status == ''
        ) {
          onChangeSearch(pageNo, searchData);
        } else {
          filterData(pageNo, branch, userLevel, grade, section, status);
        }
        message.success(statusChange.data.message);
      } else {
        message.error(statusChange.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleRestoreUser = async (id, status) => {
    try {
      const statusChange = await axiosInstance.put(
        `${endpoints.communication.userStatusChange}${id}/restore-user/`,
        { status }
      );
      if (statusChange.status === 200) {
        if (
          userLevel == '' &&
          branch == '' &&
          grade == '' &&
          section == '' &&
          status == ''
        ) {
          onChangeSearch(pageNo, searchData);
        } else {
          filterData(pageNo, branch, userLevel, grade, section, status);
        }
        message.success(statusChange.data.message);
      } else {
        message.error(statusChange.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleClearFilter = () => {
    setUserLevel('');
    setBranch('');
    setGrade('');
    setSection('');
    setStatus('');
    setSearchData('');
    setGradeList([]);
    setSectionList([]);
    setUserData([]);
    setShowFilter(true);
    formRef.current.resetFields();
    searchRef.current.resetFields();
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
              <Breadcrumb.Item
                href='/user-management/view-users'
                className='th-grey th-16'
              >
                User Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>View User</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row'>
                <Form
                  id='filterForm'
                  className='mt-3'
                  layout={'vertical'}
                  ref={formRef}
                  style={{ width: '100%' }}
                >
                  <div className='row'>
                    <div className='col-md-3 col-sm-6 col-12'>
                      <Form.Item name='userlevel'>
                        <Select
                          mode='multiple'
                          getPopupContainer={(trigger) => trigger.parentNode}
                          maxTagCount={1}
                          allowClear={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          className='th-grey th-bg-grey th-br-4 w-100 text-left'
                          placement='bottomRight'
                          showArrow={true}
                          onChange={(e, value) => handleUserLevel(e, value)}
                          dropdownMatchSelectWidth={false}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
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
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
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
                      <Form.Item name='status'>
                        <Select
                          defaultValue={0}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          maxTagCount={1}
                          allowClear={false}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          className='th-grey th-bg-grey th-br-4 w-100 text-left'
                          placement='bottomRight'
                          showArrow={true}
                          onChange={(e, value) => handleStatus(e, value)}
                          dropdownMatchSelectWidth={false}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          showSearch
                          placeholder='Select Status'
                        >
                          {statusOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-3 col-sm-6 col-12'>
                      <Form ref={searchRef}>
                        <Form.Item name='search-input'>
                          <Input
                            placeholder='Search'
                            prefix={
                              <SearchOutlined className='site-form-item-icon th-grey' />
                            }
                            allowClear
                            onChange={(e) => onChangeSearch(pageNo, e.target.value)}
                          />
                        </Form.Item>
                      </Form>
                    </div>
                    <div className='col-md-3 col-sm-6 col-12 mb-3'>
                      <div className='row no-gutters'>
                        <div className='col-md-6 col-sm-6 col-6 pr-1'>
                          <Button
                            type='primary'
                            className='btn-block th-br-4 th-12'
                            onClick={() =>
                              filterData(
                                pageNo,
                                branch,
                                userLevel,
                                grade,
                                section,
                                status
                              )
                            }
                          >
                            View
                          </Button>
                        </div>
                        <div className='col-md-6 col-sm-6 col-6 pl-1'>
                          <Button
                            type='secondary'
                            className='btn-block mt-0 th-br-4 th-12'
                            onClick={handleClearFilter}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className='col-md-3 col-sm-6 col-12 mb-3'>
                      <div className='row no-gutters'>
                        <div className='col-md-6 col-sm-6 col-6 pr-1'>
                          <Button
                            loading={downloadLoading}
                            type='primary'
                            className='btn-block th-br-4 th-12'
                            onClick={handleExcel}
                          >
                            Download
                          </Button>
                        </div>
                        <div className='col-md-6 col-sm-6 col-12 pl-1'>
                          <Button
                            onClick={() => history.push(`/user-management/create-user`)}
                            className='btn-block th-br-4 th-12'
                            type='primary'
                            // icon={<PlusCircleOutlined style={{ color: '#fffff' }} />}
                          >
                            Create User
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
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
                    <Table
                      className='th-table'
                      rowClassName={(record, index) =>
                        index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                      }
                      loading={loading}
                      columns={columns}
                      rowKey={(record) => record?.id}
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
                            if (
                              userLevel == '' &&
                              branch == '' &&
                              grade == '' &&
                              section == '' &&
                              status == ''
                            ) {
                              onChangeSearch(current, searchData);
                            } else {
                              filterData(
                                current,
                                branch,
                                userLevel,
                                grade,
                                section,
                                status
                              );
                            }
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

        {/* </div> */}
      </Layout>
    </React.Fragment>
  );
};

export default User;
