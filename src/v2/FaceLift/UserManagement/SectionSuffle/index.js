import { FileExcelTwoTone, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Form, Modal, Table, Upload, message } from 'antd';
import Layout from 'containers/Layout';
import React, { useRef, useState } from 'react';
import './style.scss';
import axiosInstance from 'config/axios';
import { CSVLink } from 'react-csv';

const SectionSuffle = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  //eslint-disable-next-line
  const [fileTypeError, setFileTypeError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [failedModal, setFailedModal] = useState(false);
  const [failedData, setFailedData] = useState([]);
  const guidelines = [
    {
      name: '',
      field: "Please don't remove or manipulate any header in the file format",
    },
    { name: 'Erp Code', field: ' is a mandatory field, Example: 2003970002_OLV' },
    { name: 'Current Grade', field: ' is a mandatory field, Example: [3,7]' },
    { name: 'Current Section Mapping', field: ' is a mandatory field, Example: [3,7]' },
    { name: 'Change Grade', field: ' is a mandatory field, Example: [24,25]' },
    { name: 'Change Section Mapping', field: ' s a mandatory field, Example: [700]' },
    { name: 'Change Subject', field: ' is a required field, Example: [6,9]' },
  ];

  const formRef = useRef();

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
        setFileTypeError(true);
      }

      return false;
    },
    selectedFile,
  };

  const handleSectionSuffle = () => {
    if (!selectedFile) {
      message.error('Please select a file to upload');
      return;
    }
    setRequestSent(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    axiosInstance
      .put(`/erp_user/update_bulk_users_grade/`, formData)
      .then((res) => {
        if (res.data.status_code === 200) {
          message.success(res?.data?.message);

          if (res.data.data.length > 0) {
            let data = res.data.data;
            let mappedData = data.map((item) => ({
              erp_id: Object.keys(item),
              erp_message: Object.values(item),
            }));

            setFailedData(mappedData);
            setFailedModal(true);
          }
          //   history.push('/user-management/bulk-upload');
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

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>ERP Code </span>,
      label: 'ERP Code',
      key: 'erp_id',
      dataIndex: 'erp_id',
      width: '30%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Error Message</span>,
      dataIndex: 'erp_message',
      key: 'erp_message',
      label: 'Error',
      width: '70%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  const handleCloaseErrorLogs = () => {
    setSelectedFile(null);
    setFailedModal(false);
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
                Section Shuffle
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row mb-3'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <Form ref={formRef} id='excelUploadForm' layout={'vertical'}>
                <div className='row mt-3'>
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
                          href='/assets/download-format/Sections_Shuffle.xlsx'
                          download='Sections_Shuffle.xlsx'
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
                      onClick={handleSectionSuffle}
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
            </div>
          </div>
          <Modal
            centered
            open={failedModal}
            visible={failedModal}
            width={'50%'}
            onCancel={handleCloaseErrorLogs}
            footer={[
              <Button key='back' onClick={handleCloaseErrorLogs}>
                Close
              </Button>,
              <Button key='submit' type='primary'>
                <CSVLink data={failedData} headers={columns} filename={'error_list.xls'}>
                  Download Error Logs
                </CSVLink>
              </Button>,
            ]}
          >
            <div className='th-g-white p-3'>
              <h6>Error: Failed records</h6>
              <p className='text-right'></p>
              <Table
                className='th-table'
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                }
                columns={columns}
                rowKey={(record) => record?.id}
                dataSource={failedData}
                pagination={false}
                scroll={{
                  x: window.innerWidth < 600 ? 'max-content' : null,
                  y: 'calc(60vh - 220px)',
                }}
              />
            </div>
          </Modal>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default SectionSuffle;
