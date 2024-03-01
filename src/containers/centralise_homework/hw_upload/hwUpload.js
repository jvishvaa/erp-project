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
import UploadTable from './uploadtable';
import '../BranchStaffSide/branchside.scss';

const HwUpload = () => {
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
  // const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const loggedUserData = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  //eslint-disable-next-line
  const [pageLimit, setPageLimit] = useState(15);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState('');
  const [searchData, setSearchData] = useState('');
  const [showFilterPage, setShowFilter] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const formRef = useRef();
  const searchRef = useRef();

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  // const isOrchidsbachu =
  //   window.location.host.split('.')[0] === 'orchids' ||
  //   window.location.host.split('.')[0] === 'localhost:3000'
  //     ? true
  //     : false;

  const isOrchids =
    window.location.host.split('.')[0] === 'orchids' ||
    window.location.host.split('.')[0] === 'qa' ||
    window.location.host.split('.')[0] === 'mcollege' ||
    window.location.host.split('.')[0] === 'dps' ||
    window.location.host.split('.')[0] === 'orchids-stage' ||
    window.location.host.split('.')[0] === 'orchids-prod'
      ? true
      : false;

  // useEffect(() => {
  //   if (NavData && NavData.length) {
  //     NavData.forEach((item) => {
  //       if (
  //         item.parent_modules === 'User Management' &&
  //         item.child_module &&
  //         item.child_module.length > 0
  //       ) {
  //         item.child_module.forEach((item) => {
  //           if (item.child_name === 'View User') {
  //             setModuleId(item.child_id);
  //           }
  //         });
  //       }
  //     });
  //   }
  // }, []);

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
      fetchBranchesForCreateUser(selectedYear?.id).then((data) => {
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
      let params = `?page=${pageNo}&page_size=${pageLimit}&session_year=${selectedYear?.id}&search=${value}`;
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

  const filterData = (pageNo, branch, userLevel, grade, section, status, search) => {
    let userLevelParams = userLevel || '';
    let branchParams = branch || '';
    let gradeParams = grade || '';
    let sectionParams = section || '';
    let statusparams = status || '';
    let searchParams = search || '';

    if (
      userLevel == '' &&
      branch == '' &&
      grade == '' &&
      section == '' &&
      status == '' &&
      searchData == '' &&
      search === ''
    ) {
      message.error('Please select atleast one filter to view data');
      return;
    }

    setShowFilter(false);

    let params = `?page=${pageNo}&page_size=${pageLimit}&session_year=${
      selectedYear?.id
    }${branchParams ? `&branch=${branch}` : ''}${
      userLevelParams.length > 0 ? `&user_level=${userLevel}` : ''
    }${gradeParams.length > 0 ? `&grade=${grade}` : ''}${
      sectionParams.length > 0 ? `&section_mapping_id=${section}` : ''
    }${statusparams ? `&status=${statusparams}` : ''}${
      searchParams ? `&search=${searchParams}` : ''
    }`;

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
    // paramsObj.module_id = moduleId;
    paramsObj.session_year = selectedYear.id;
    if (branch) {
      paramsObj.branch = branch ? branch : '';
    }
    if (userLevel) {
      paramsObj.user_level = userLevel.toString();
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

  const handleUploadPage = () => {
    history.push('/centralised-homework/homework-upload');
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
                Wokrsheet & Classwork
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm mb-3'>
              <div className='row'>
                <Form
                  id='filterForm'
                  className='mt-3'
                  layout={'vertical'}
                  ref={formRef}
                  style={{ width: '100%' }}
                >
                  <div className='row'>
                    <div className='col-md-12 row'>
                      <div className='col-md-2 col-sm-6 col-12'>
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
                      <div className='col-md-2 col-sm-6 col-12'>
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
                      <div className='col-md-2 col-sm-6 col-12'>
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
                      <div className='col-md-2 col-sm-6 col-12'>
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
                      <div className='col-md-2 col-sm-6 col-12'>
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
                      <div className='col-md-2 col-sm-6 col-12'>
                        <Button
                          className='w-100 th-br-4'
                          type='primary'
                          onClick={handleUploadPage}
                        >
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>

              <div className='row '>
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
                  <div className='my-3'>
                    <UploadTable />
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

export default HwUpload;
