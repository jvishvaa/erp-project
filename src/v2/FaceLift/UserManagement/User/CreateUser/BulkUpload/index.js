import { DownOutlined, FileExcelTwoTone, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Form, Select, Table, Upload, message } from 'antd';
import axios from 'axios';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Layout from 'containers/Layout';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const BulkUpload = () => {
  const { Option } = Select;

  const bulkUploadFormRef = useRef();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedBranchCode, setSelectedBranchCode] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [selectedFile, setSelectedFile] = useState('');
  const [acadId, setAcadId] = useState('');
  //eslint-disable-next-line
  const [fileTypeError, setFileTypeError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [userLevelList, setUserLevelList] = useState([]);
  const [userDesignationList, setUserDesignationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gradeList, setGradeList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const history = useHistory();
  const guidelines = [
    {
      name: '',
      field: "Please don't remove or manipulate any header in the file format",
    },
    { name: 'user_first_name', field: ' is a required field, Example: Vikash' },
    { name: 'user_middle_name', field: ' is a non-required field, Example: Kumar' },
    { name: 'user_last_name', field: ' is a required field, Example: Singh' },
    {
      name: 'date_of_birth',
      field: ' is a mandatory field with following format (YYYY-MM-DD)',
    },
    { name: 'contact', field: ' is a mandatory field, Example: 996565xxxx' },
    { name: 'email', field: ' is a mandatory field, Example: john.doe@gmail.com' },
    { name: 'address', field: ' is a mandatory field, Example: Next to Brookfield Mall' },
    {
      name: 'gender',
      field:
        ' is a mandatory field in which ID has to be passed for Male, Female and Others as 0, 1, 2 respectively',
    },
    {
      name: 'Single_Parent',
      field:
        'is a  field in which ID has to be passed for Mother, Father and Guardian as 1, 2, 3 respectively and should be left if no single parent',
    },
    {
      name: 'How to use Suggestions ?',
      field:
        " From the following dropdowns select grade & section and use the respective Id's for user creation",
    },
  ];

  const qualificationList = [
    {
      key: 1,
      label: 'School Pass Out',
      value: 'school_pass_out',
    },
    {
      key: 2,
      label: 'Graduate',
      value: 'graduate',
    },
    {
      key: 3,
      label: 'Post Graduate',
      value: 'post_graduate',
    },
    {
      key: 4,
      label: 'Doctorate',
      value: 'doctorate',
    },
  ];

  const allowedFiles = ['.xls', '.xlsx'];
  const draggerProps = {
    showUploadList: false,
    disabled: false,
    accept: allowedFiles.join(),
    // '.xls,.xlsx',
    multiple: false,
    onRemove: () => {
      setSelectedFile(null);
    },
    onDrop: (e) => {
      const file = e.dataTransfer.files;
      setSelectedFile(null);
      const type = '.' + file[0]?.name.split('.')[file[0]?.name.split('.').length - 1];
      console.log(type, allowedFiles);
      if (allowedFiles.includes(type)) {
        setSelectedFile(...file);
        setFileTypeError(false);
      } else {
        message.error('Only .xls, .xlsx files are allowed!');
        setFileTypeError(true);
      }

      return false;
    },
    beforeUpload: (...file) => {
      setSelectedFile(null);
      const type = '.' + file[0]?.name.split('.')[file[0]?.name.split('.').length - 1];
      if (allowedFiles.includes(type)) {
        setSelectedFile(...file[1]);
        setFileTypeError(false);
      } else {
        message.error('Only .xls, .xlsx files are allowed!');
        setFileTypeError(true);
      }

      return false;
    },

    selectedFile,
  };

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
    fetchUserLevel();
    fetchUserRoles();
  }, []);

  useEffect(() => {
    if (moduleId && selectedYear) {
      fetchBranches(selectedYear?.id);
    }
  }, [moduleId, selectedYear]);
  const fetchUserRoles = async () => {
    axiosInstance
      .get(`${endpoints.communication.roles}`)
      .then((response) => {
        setRoleList(response?.data?.result);
      })
      .catch((error) => {
        message.error(error.response.message.data ?? 'Something went!');
      });
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
      <Option
        key={each?.id}
        value={each.id}
        branchId={each?.branch?.id}
        branchCode={each?.branch?.branch_code}
        acadId={each?.id}
      >
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const handleUserBranch = (e, value) => {
    if (e) {
      setSelectedBranch(value?.branchId);
      setAcadId(value?.acadId);
      setSelectedBranchCode(value?.branchCode);
      fetchGrade(value?.branchId);
      setShowSuggestion(true);
    } else {
      setSelectedBranch('');
      setAcadId('');
      setSelectedBranchCode('');
      setGradeList([]);
      setShowSuggestion(false);
    }
  };

  const handleGrade = (e) => {
    if (e) {
      fetchSection(e, selectedBranch);
      setSelectedGrade(e);
    } else {
      setSectionList([]);
      setSelectedGrade('');
    }
  };

  const handleSection = (e, value) => {
    if (e) {
      fetchSubject(value?.sectionId);
    } else {
      setSubjectList([]);
    }
  };

  const handleUploadUser = () => {
    if (selectedBranch === '') {
      message.error('Please select branch');
      return;
    }
    if (selectedFile === '') {
      message.error('Please select a file to upload');
      return;
    }
    setRequestSent(true);
    const formData = new FormData();
    formData.append('branch', selectedBranch);
    formData.append('branch_code', selectedBranchCode);
    formData.append('academic_year_value', selectedYear?.session_year);
    formData.append('academic_year', acadId);
    formData.append('file', selectedFile);

    axiosInstance
      .post(`/erp_user/upload_bulk_user/`, formData)
      .then((res) => {
        if (res.data.status_code === 200) {
          message.success(res?.data?.message);
          setSelectedBranch('');
          setSelectedBranchCode('');
          setSelectedFile('');
          setAcadId('');
          bulkUploadFormRef.current.resetFields();
          history.push(`/user-management/bulk-upload`);
        } else {
          message.error('Uploaded format is incorrect');
        }
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setRequestSent(false);
      });
  };

  const fetchUserLevel = () => {
    axios
      .get(`${endpoints.userManagement.userLevelList}`, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setUserLevelList(res?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUserDesignation = (value) => {
    setLoading(true);
    axios
      .get(`${endpoints.lessonPlan.designation}?user_level=${value}`, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setUserDesignationList(res?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
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

  const fetchSubject = (section) => {
    axiosInstance
      .get(
        `${endpoints.academics.subjects}?session_year=${selectedYear?.id}&branch=${selectedBranch}&grade=${selectedGrade}&section=${section}&module_id=${moduleId}`
      )
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setSubjectList(response?.data?.data);
        }
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
        setSubjectList([]);
      });
  };

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id} sectionId={each.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const handleUserLevel = (e) => {
    if (e != undefined) {
      fetchUserDesignation(e);
    } else {
      setUserDesignationList([]);
    }
  };

  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });

  const userLevelColumns = [
    {
      title: <span className='th-white th-fw-700 '>ID</span>,
      dataIndex: 'id',
      width: '20%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>User Level</span>,
      dataIndex: 'level_name',
      width: '80%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  const designationColumns = [
    {
      title: <span className='th-white th-fw-700 '>ID</span>,
      dataIndex: 'id',
      width: '20%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Designation</span>,
      dataIndex: 'designation',
      width: '80%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  const gradeColumns = [
    {
      title: <span className='th-white th-fw-700 '>ID</span>,
      dataIndex: 'grade_id',
      width: '20%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Grade</span>,
      dataIndex: 'grade__grade_name',
      width: '80%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  const sectionColumns = [
    {
      title: <span className='th-white th-fw-700 '>Mapping ID</span>,
      dataIndex: 'id',
      width: '40%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Section</span>,
      dataIndex: 'section__section_name',
      width: '60%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  const subjectColumns = [
    {
      title: <span className='th-white th-fw-700 '>Mapping ID</span>,
      dataIndex: 'subject__id',
      width: '40%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Subject</span>,
      dataIndex: 'subject__subject_name',
      width: '60%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  const roleColumns = [
    {
      title: <span className='th-white th-fw-700 '>ID</span>,
      dataIndex: 'id',
      width: '20%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Role Name</span>,
      dataIndex: 'role_name',
      width: '60%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  const qualificationColumns = [
    {
      title: <span className='th-white th-fw-700 '>Value</span>,
      dataIndex: 'value',
      width: '50%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Qualification</span>,
      dataIndex: 'label',
      width: '50%',
      className: 'text-center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  return (
    <React.Fragment>
      <>
        <div className='row mb-3'>
          <div className='col-md-12'>
            <div className='th-br-5 py-3 px-2'>
              <Form ref={bulkUploadFormRef} id='bulkUploadForm' layout={'vertical'}>
                <div className='row mt-1'>
                  <div className='col-md-3 col-sm-4 col-12'>
                    <Form.Item name='uploadbranch'>
                      <Select
                        allowClear={true}
                        className='th-grey th-bg-white  w-100 text-left'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleUserBranch(e, value)}
                        dropdownMatchSelectWidth={true}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        getPopupContainer={(trigger) => trigger.parentNode}
                        placeholder='Select Branch*'
                      >
                        {branchListOptions}
                      </Select>
                      <small className='mt-2'>
                        <b>Note :</b> After selecting branch, You'll get suggestion box.
                      </small>
                    </Form.Item>
                  </div>
                  <div className='col-md-3 col-sm-4 col-12 th-upload-input'>
                    <Upload {...draggerProps}>
                      <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                    {selectedFile && (
                      <span className='th-fw-300 th-13'>
                        <FileExcelTwoTone className='pr-2' />
                        {selectedFile?.name}
                      </span>
                    )}
                    <br />
                    <p>
                      <span className='text-muted'>
                        <a
                          style={{ cursor: 'pointer' }}
                          href='/assets/download-format/bulk_user_upload_v2.xlsx'
                          download='bulk_user_upload_v2.xlsx'
                        >
                          Download format
                        </a>
                      </span>
                    </p>
                  </div>

                  <div className='col-md-2 col-sm-4'>
                    <Button
                      type='primary'
                      className='ant-btn btn-block th-br-4 ant-btn-primary '
                      disabled={requestSent}
                      onClick={handleUploadUser}
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              </Form>

              <div className='row'>
                <div className='col-12 mt-2'>
                  <h5>Guidelines</h5>

                  <ol className='ml-3'>
                    {Array.isArray(guidelines) &&
                      guidelines.length > 0 &&
                      guidelines?.map((item, index) => (
                        <li className='mt-2' key={index}>
                          <b>{item.name}</b> {item.field}
                        </li>
                      ))}
                  </ol>
                </div>
              </div>

              {showSuggestion && (
                <>
                  <div className='row mb-3'>
                    <div className='col-md-12 mt-1'>
                      <h4>Suggestions</h4>
                    </div>
                    <div className='col-md-4'>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={1}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleUserLevel(e, value)}
                        dropdownMatchSelectWidth={false}
                        showSearch
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        placeholder='Select User Level'
                      >
                        {userLevelListOptions}
                      </Select>

                      <small className='mt-2'>
                        <b>Note :</b> After selecting User Level, You'll get User
                        Designation.
                      </small>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-md-4'>
                      <Table
                        className='th-table'
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                        }
                        columns={roleColumns}
                        rowKey={(record) => record?.id}
                        dataSource={roleList}
                        pagination={false}
                        style={{ minHeight: '270px' }}
                        scroll={{
                          y: 200,
                        }}
                      />
                    </div>
                    <div className='col-md-4'>
                      <Table
                        className='th-table'
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                        }
                        columns={userLevelColumns}
                        rowKey={(record) => record?.id}
                        dataSource={userLevelList}
                        style={{ minHeight: '270px' }}
                        pagination={false}
                        scroll={{
                          y: 200,
                        }}
                      />
                    </div>
                    <div className='col-md-4'>
                      <Table
                        className='th-table'
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                        }
                        loading={loading}
                        columns={designationColumns}
                        rowKey={(record) => record?.id}
                        dataSource={userDesignationList}
                        style={{ minHeight: '270px' }}
                        pagination={false}
                        scroll={{
                          x: window.innerWidth < 600 ? 'max-content' : null,
                          y: 200,
                        }}
                      />
                    </div>
                  </div>

                  <div className='row my-3'>
                    <div className='col-md-4'>
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
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select Grade*'
                      >
                        {gradeOptions}
                      </Select>

                      <small className='mt-2'>
                        <b>Note :</b> After selecting Grade, You'll get Section.
                      </small>
                    </div>
                    <div className='col-md-4'>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={1}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleSection(e, value)}
                        dropdownMatchSelectWidth={true}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select section*'
                      >
                        {sectionOptions}
                      </Select>
                      <small className='mt-2'>
                        <b>Note :</b> After selecting Section, You'll get Subject.
                      </small>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-md-4'>
                      <Table
                        className='th-table'
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                        }
                        columns={gradeColumns}
                        rowKey={(record) => record?.id}
                        dataSource={gradeList}
                        style={{ minHeight: '270px' }}
                        pagination={false}
                        scroll={{
                          x: window.innerWidth < 600 ? 'max-content' : null,
                          y: 200,
                        }}
                      />
                    </div>

                    <div className='col-md-4'>
                      <Table
                        className='th-table'
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                        }
                        columns={sectionColumns}
                        rowKey={(record) => record?.id}
                        dataSource={sectionList}
                        style={{ minHeight: '270px' }}
                        pagination={false}
                        scroll={{
                          x: window.innerWidth < 600 ? 'max-content' : null,
                          y: 200,
                        }}
                      />
                    </div>

                    <div className='col-md-4'>
                      <Table
                        className='th-table'
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                        }
                        columns={subjectColumns}
                        rowKey={(record) => record?.id}
                        dataSource={subjectList}
                        style={{ minHeight: '270px' }}
                        pagination={false}
                        scroll={{
                          x: window.innerWidth < 600 ? 'max-content' : null,
                          y: 200,
                        }}
                      />
                    </div>
                    <div className='col-md-4'>
                      <Table
                        className='th-table mt-3'
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                        }
                        columns={qualificationColumns}
                        rowKey={(record) => record?.id}
                        dataSource={qualificationList}
                        style={{ minHeight: '270px' }}
                        pagination={false}
                        scroll={{
                          x: window.innerWidth < 600 ? 'max-content' : null,
                          y: 200,
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    </React.Fragment>
  );
};

export default BulkUpload;
