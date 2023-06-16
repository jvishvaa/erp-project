import { FileExcelTwoTone, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Select, Upload, message } from 'antd';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const BulkUpload = () => {
  const { Option } = Select;

  const bulkUploadFormRef = useRef();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [selectedFile, setSelectedFile] = useState('');
  //eslint-disable-next-line
  const [fileTypeError, setFileTypeError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  const guidelines = [
    {
      name: '',
      field: "Please Don't Erase or Edit any header in the file format",
    },
    { name: 'Erp Code', field: ' is a mandatory field, Example: 2003970002_OLV' },
    { name: 'Is_lesson_plan', field: ' is a mandatory field' },
    { name: 'Is_online_class', field: ' is a mandatory field' },
    { name: 'Is_ebook', field: ' is a mandatory field' },
    { name: 'Is_ibook', field: ' is a mandatory field' },
    { field: 'To Allow Access to the user, Input value as " 0 ".' },
    { field: 'To Block Access to the user, Input value as " 1 ".' },
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
      if (allowedFiles.includes(type)) {
        setSelectedFile(...file[1]);
        setFileTypeError(false);
      } else {
        message.error(
          'Only excel file is acceptable either with .xls or .xlsx extension'
        );
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
            if (item.child_name === 'Access-Blocker') {
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

  const handleUserBranch = (e) => {
    if (e != undefined) {
      setSelectedBranch(e);
    } else {
      setSelectedBranch('');
    }
  };

  const handleUploadAccessBlocker = () => {
    if (selectedFile === '') {
      message.error('Please select a file to upload');
      return;
    }
    if (selectedBranch === '') {
      message.error('Please select branch');
      return;
    }
    setRequestSent(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('academic_year', selectedYear?.id);
    formData.append('branch', selectedBranch);
    axiosInstance
      .post(`/erp_user/block-user-bulk-upload/`, formData)
      .then((res) => {
        if (res.data.status_code === 200) {
          message.success(res?.data?.message);
          setSelectedBranch('');
          setSelectedFile('');
          bulkUploadFormRef.current.resetFields();
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

  return (
    <React.Fragment>
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
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                showSearch
                getPopupContainer={(trigger) => trigger.parentNode}
                placeholder='Select Branch'
              >
                {branchListOptions}
              </Select>
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
                  href='/assets/download-format/access.xlsx'
                  download='access_blocker.xlsx'
                >
                  Download format
                </a>
              </span>
            </p>
          </div>

          <div className='col-md-2 col-sm-4'>
            <Button
              type='primary'
              className='btn btn-block th-br-5 btn-primary'
              disabled={requestSent}
              onClick={handleUploadAccessBlocker}
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
    </React.Fragment>
  );
};

export default BulkUpload;
