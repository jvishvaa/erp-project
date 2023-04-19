import { FileExcelTwoTone, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Select, Upload } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchBranchesForCreateUser } from 'redux/actions';

const UploadExcel = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const { Option } = Select;
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTypeError, setFileTypeError] = useState(null);

  const formRef = useRef();

  console.log({ selectedYear });

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
        }));
        // if (transformedData?.length > 1) {
        //   transformedData.unshift({
        //     id: 'all',
        //     branch_name: 'Select All',
        //     branch_code: 'all',
        //   });
        // }
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
      console.log({ type }, { file });
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
      console.log({ type }, { file });
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

  const handleBranch = (e) => {
    setSelectedBranch(e.join(','));
  }

  const clearAll = () => {
    setSelectedFile(null)
    setSelectedBranch()
    formRef.current.resetFields()
  }

  console.log({selectedBranch});

  return (
    <>
      <Form ref={formRef} id='excelUploadForm' layout={'vertical'}>
        <div className='row'>
          <div className='col-md-4 col-sm-6 col-12'>
            <Form.Item
              name='branch'
              // label='Select Branch'
              rules={[{ required: true, message: 'Please select Branch' }]}
            >
              <Select
                mode='multiple'
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
                  href='/assets/download-format/erp_user.xlsx'
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
                <Button type='secondary' className='btn btn-block' onClick={clearAll}>Clear All</Button>
            </div>
            <div className='col-md-2 col-sm-4'>
                <Button type='primary' className='btn btn-block btn-primary'>Upload</Button>
            </div>
        </div>
      </Form>

      <div className='row mb-3'>
        <div className='col-md-12'>
          <hr />
          <h4>Guidelines</h4>

          <Card bordered={false} style={{ width: '100%' }} className='pl-3 th-br-8'>
            <ol>
              <li className='mt-2'>
                Please don't remove or manipulate any header in the file format
              </li>
              <li className='mt-2'>
                <b className='text-primary'>user_first_name</b> is a required field,
                Example: Vikash
              </li>
              <li className='mt-2'>
                <b className='text-primary'>user_middle_name</b> is a required field,
                Example: Kumar
              </li>
              <li className='mt-2'>
                <b className='text-primary'>user_last_name</b> is a required field,
                Example: Singh
              </li>
              <li className='mt-2'>
                <b className='text-primary'>date_of_birth</b> is a mandatory field with
                following format (YYYY-MM-DD)
              </li>
              <li className='mt-2'>
                <b className='text-primary'>contact</b> is a mandatory field, Example:
                996565xxxx
              </li>
              <li className='mt-2'>
                <b className='text-primary'>email</b> is a mandatory field, Example:
                john.doe@gmail.com
              </li>
              <li className='mt-2'>
                <b className='text-primary'>address</b> is a mandatory field, Example:
                Next to Brookfield Mall
              </li>
              <li className='mt-2'>
                <b className='text-primary'>gender</b> is a mandatory field in which ID
                has to be passed for Male, Female and Others as 0, 1, 2 respectively
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UploadExcel;
