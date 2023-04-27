import { DownOutlined, FileExcelTwoTone, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Select, Table, Upload, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchBranchesForCreateUser } from 'redux/actions';
import axiosInstance from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const UploadExcel = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
  const [selectedBranchCode, setSelectedBranchCode] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const { Option } = Select;
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTypeError, setFileTypeError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [acadId, setAcadId] = useState('');

  const [userLevelList, setUserLevelList] = useState([]);
  const [userDesignationList, setUserDesignationList] = useState([]);
  const [userRoleList, setUserRoleList] = useState([]);
  const [loading, setLoading] = useState(false);

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
      .get(`${endpoints.userManagement.userDesignation}?user_level=${value}`, {
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

  const formRef = useRef();

  const history = useHistory();

  useEffect(() => {
    fetchUserLevel();
    fetchUserRole();
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
    if (moduleId && selectedYear) {
      fetchBranches(selectedYear?.id);
    }
  }, [moduleId, selectedYear]);

  const fetchBranches = () => {
    if (selectedYear) {
      fetchBranchesForCreateUser(selectedYear?.id, moduleId).then((data) => {
        const transformedData = data?.map((obj) => ({
          id: obj.id,
          branch_name: obj.branch_name,
          branch_code: obj.branch_code,
          acadId: obj.acadId,
        }));
        setBranches(transformedData);
      });
    }
  };

  const branchListOptions = branches?.map((each) => {
    return (
      <Option
        key={each?.id}
        value={each.id}
        branch_code={each?.branch_code}
        acadId={each?.acadId}
      >
        {each?.branch_name}
      </Option>
    );
  });

  const fetchUserRole = () => {
    axiosInstance
      .get(`${endpoints.nonAcademicStaff.roles}`)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setUserRoleList(res?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      // console.log({ type }, { file });
      if (allowedFiles.includes(type)) {
        setSelectedFile(...file);
        setFileTypeError(false);
      } else {
        setFileTypeError(true);
      }

      return false;
    },
    beforeUpload: (...file) => {
      setSelectedFile(null);
      const type = '.' + file[0]?.name.split('.')[file[0]?.name.split('.').length - 1];
      // console.log({ type }, { file });
      if (allowedFiles.includes(type)) {
        setSelectedFile(...file[1]);
        setFileTypeError(false);
      } else {
        setFileTypeError(true);
      }

      return false;
    },
    selectedFile,
  };

  const handleBranch = (e, data) => {
    setSelectedBranch(e);
    setSelectedBranchCode(data?.branch_code);
    setAcadId(data?.acadId);
  };

  const clearAll = () => {
    setSelectedFile(null);
    setSelectedBranch();
    setSelectedBranchCode('');
    formRef.current.resetFields();
  };

  const handleFileUpload = () => {
    if (selectedBranch === '' || selectedBranch === undefined) {
      message.error('Please Select Branch');
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
      .post(`${endpoints.nonAcademicStaff.uploadBulkStaff}`, formData)
      .then((res) => {
        if (res.data.status_code === 200) {
          message.success(res?.data?.message);
          history.push('/user-management/bulk-upload-status');
        } else {
          message.error('Uploaded format is incorrect');
        }
      })
      .catch((error) => {
        message.error(error.message);
        // console.log('error');
      })
      .finally(() => {
        setRequestSent(false);
      });
  };

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
      name: 'designation',
      field: ' is a required field, Example: 1',
    },
    {
      name: 'user_level',
      field: 'is a required field, Example: 15',
    },
    {
      name: 'role',
      field: 'is a required field, Example: 207',
    },
    {
      name: 'How to use Suggestions ?',
      field:
        " From the following dropdowns select User Level to get User Designation details and use the respective Id's for user creation",
    },
  ];

  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
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

  const userLevelColumns = [
    {
      title: <span className='th-white th-fw-700 '>ID</span>,
      dataIndex: 'id',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>User Level</span>,
      dataIndex: 'level_name',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  const designationColumns = [
    {
      title: <span className='th-white th-fw-700 '>ID</span>,
      dataIndex: 'id',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Designation</span>,
      dataIndex: 'designation',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  const roleColumns = [
    {
      title: <span className='th-white th-fw-700 '>ID</span>,
      dataIndex: 'id',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Role</span>,
      dataIndex: 'role_name',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  return (
    <>
      <Form ref={formRef} id='excelUploadForm' layout={'vertical'}>
        <div className='row mt-3'>
          <div className='col-md-4 col-sm-6 col-12'>
            <Form.Item
              name='branch'
              // label='Select Branch'
              rules={[{ required: true, message: 'Please select Branch' }]}
            >
              <Select
                allowClear={true}
                className='th-grey th-bg-white  w-100 text-left'
                placement='bottomRight'
                showArrow={true}
                dropdownMatchSelectWidth={false}
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                getPopupContainer={(trigger) => trigger.parentNode}
                placeholder='Select Branch'
                onChange={(e, value) => handleBranch(e, value)}
              >
                {branchListOptions}
              </Select>
            </Form.Item>
          </div>
          <div className='col-md-6 col-sm-6 col-12'>
            <Upload {...draggerProps}>
              <Button icon={<UploadOutlined />}>Upload Excel File</Button>
            </Upload>
            {selectedFile && (
              <span className='th-fw-300 th-13 ml-2'>
                <FileExcelTwoTone className='pr-2' />
                {selectedFile?.name}
              </span>
            )}
            <br />
            <p>
              <span className='text-muted'>
                Download format :
                <a
                  style={{ cursor: 'pointer' }}
                  href='/assets/download-format/bulk_user_upload_tesing.xlsx'
                  download='format.xlsx'
                >
                  Download format
                </a>
              </span>
            </p>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-2 col-sm-4'>
            <Button type='secondary' className='btn btn-block' onClick={clearAll}>
              Clear All
            </Button>
          </div>
          <div className='col-md-2 col-sm-4'>
            <Button
              type='primary'
              className='btn btn-block btn-primary'
              onClick={handleFileUpload}
              disabled={requestSent}
            >
              Upload
            </Button>
          </div>
        </div>
      </Form>

      <div className='row mb-3'>
        <div className='col-md-12'>
          <hr />
          <h4>Guidelines</h4>

          <Card bordered={false} style={{ width: '100%' }} className='pl-3 th-br-8'>
            <ol>
              {Array.isArray(guidelines) &&
                guidelines.length > 0 &&
                guidelines?.map((item, index) => (
                  <li className='mt-2' key={index}>
                    <b className='text-primary'>{item.name}</b> {item.field}
                  </li>
                ))}
            </ol>
          </Card>
        </div>
      </div>

      <div className='row'>
        <div className='col-md-12 mt-1 mb-3'>
          <h4>Suggestions</h4>
        </div>
        <div className='col-md-4'>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            maxTagCount={5}
            allowClear={true}
            suffixIcon={<DownOutlined className='th-grey' />}
            className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
            placement='bottomRight'
            showArrow={true}
            onChange={(e, value) => handleUserLevel(e, value)}
            dropdownMatchSelectWidth={false}
            showSearch
            filterOption={(input, options) => {
              return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
            placeholder='Select User Level'
          >
            {userLevelListOptions}
          </Select>

          <small className='mt-2'>
            <b>Note :</b> After selecting User Level, You'll get User Designation.
          </small>
        </div>
      </div>

      <div className='row my-3 academic-staff '>
        <div className='col-md-4'>
          <Table
            className='th-table mt-3'
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
            }
            loading={loading}
            columns={userLevelColumns}
            rowKey={(record) => record?.id}
            dataSource={userLevelList}
            pagination={false}
            scroll={{
              x: window.innerWidth < 600 ? 'max-content' : null,
              y: 'calc(300px)',
            }}
          />
        </div>
        <div className='col-md-4'>
          {/* {userDesignationList?.length > 0 && ( */}
          <Table
            className='th-table mt-3'
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
            }
            loading={loading}
            columns={designationColumns}
            rowKey={(record) => record?.id}
            dataSource={userDesignationList}
            pagination={false}
            scroll={{
              x: window.innerWidth < 600 ? 'max-content' : null,
              y: 'calc(300px)',
            }}
          />
          {/* )} */}
        </div>

        <div className='col-md-4'>
          {userRoleList?.length > 0 && (
            <Table
              className='th-table mt-3'
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              loading={loading}
              columns={roleColumns}
              rowKey={(record) => record?.id}
              dataSource={userRoleList}
              pagination={false}
              scroll={{
                x: window.innerWidth < 600 ? 'max-content' : null,
                y: 'calc(300px)',
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UploadExcel;
