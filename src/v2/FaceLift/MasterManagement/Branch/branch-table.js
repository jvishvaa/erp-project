import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Input,
  Table,
  message,
  Pagination,
  Empty,
  Row,
  Col,
  Spin,
  Form,
  Drawer,
  Popconfirm,
  Tooltip,
  Image,
  Tag,
} from 'antd';
import {
  PlusCircleOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  SyncOutlined,
  RedoOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import moment from 'moment';
import Layout from 'containers/Layout';
import { useForm } from 'antd/lib/form/Form';
import { UserMappedErrorMsg } from '../UserMappedErrorMsg';
const BranchTable = () => {
  const { TextArea } = Input;
  const [formRef] = useForm();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [editId, setEditId] = useState();
  const [file, setFile] = useState();
  const [fileLink, setFileLink] = useState();
  const [fileError, setFileError] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(
    window.innerWidth <= 768 ? '90%' : window.innerWidth <= 992 ? '50%' : '30%'
  );
  const extractContent = (s) => {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };
  useEffect(() => {
    const handleResize = () => {
      setDrawerWidth(
        window.innerWidth <= 768 ? '90%' : window.innerWidth <= 992 ? '50%' : '30%'
      );
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    fetchTableData();
  }, [currentPage]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleFetchTableData();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);
  const handleFetchTableData = () => {
    if (currentPage == 1) {
      fetchTableData();
    } else {
      setCurrentPage(1);
    }
  };
  const fetchTableData = () => {
    setTableLoading(true);
    let params = {
      page: currentPage,
      page_size: pageSize,
    };
    if (search?.length > 0) {
      params = {
        ...params,
        branch_name: search,
      };
    }
    axiosInstance
      .get(`${endpoints.masterManagement.branchesAll}`, {
        params: params,
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setTableData(response?.data?.data);
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setTableLoading(false);
      });
  };
  const handleCreate = () => {
    const values = formRef?.getFieldsValue();
    let legal_name = {
      legalName: values?.legalName,
      legalContact: values?.legalContact,
      legalEmail: values?.legalEmail,
    };
    const formData = new FormData();
    formData.append('branch_name', values?.branch_name);
    formData.append('branch_code', values?.branch_code);
    formData.append('address', values?.address);
    formData.append('legal_name', JSON.stringify(legal_name));
    if (file) {
      formData.append('logo', file);
    }
    setDrawerLoading(true);
    axiosInstance
      .post(`${endpoints.masterManagement.createBranch}`, formData)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          message.success('Hurray! Branch created successfully');
          handleCloseDrawer();
          if (search?.length > 0) {
            setSearch('');
          } else {
            handleFetchTableData();
          }
        } else {
          message.error('OOPS! This branch code is already present');
          return;
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };
  const handleEdit = () => {
    const values = formRef?.getFieldsValue();
    let legal_name = {
      legalName: values?.legalName,
      legalContact: values?.legalContact,
      legalEmail: values?.legalEmail,
    };
    const formData = new FormData();
    formData.append('branch_id', editId);
    formData.append('branch_name', values?.branch_name);
    formData.append('branch_code', values?.branch_code);
    formData.append('address', values?.address);
    formData.append('legal_name', JSON.stringify(legal_name));
    if (file) {
      formData.append('logo', file);
    }
    setDrawerLoading(true);
    axiosInstance
      .put(`${endpoints.masterManagement.updateBranch}${editId}`, formData)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          message.success('Hurray! Branch updated successfully');
          handleCloseDrawer();
          fetchTableData();
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };
  const handleDelete = ({ delId }) => {
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.updateBranch}${delId}`)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          message.success('Hurray! Branch deleted successfully');
          fetchTableData();
        }
      })
      .catch((error) => {
        message.error(`${UserMappedErrorMsg}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleRestore = ({ restoreId }) => {
    setLoading(true);
    axiosInstance
      .put(`${endpoints.masterManagement.restoreBranch}${restoreId}`)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          message.success('Hurray! Branch restored successfully');
          fetchTableData();
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleOpenDrawer = ({ actionKey, editId, rowData }) => {
    setOpenDrawer(true);
    if (actionKey === 'edit') {
      formRef.setFieldsValue({
        branch_name: rowData?.branch_name,
        branch_code: rowData?.branch_code,
        branch_name: rowData?.branch_name,
        address: rowData?.address,
        legalName: rowData?.legal_name?.legalName,
        legalContact: rowData?.legal_name?.legalContact,
        legalEmail: rowData?.legal_name?.legalEmail,
      });
      setEditId(editId);
      setFileLink(rowData?.logo);
    }
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    formRef.resetFields();
    setEditId();
    setFileLink();
    setFile();
  };
  const handleFile = (e) => {
    console.log(e.target.files[0], 'filel');
    if (e.target.files[0]) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png'];
      const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
      if (!allowedExtensions?.includes(`.${fileExtension}`)) {
        message.error('Only JPG / JPEG / PNG formats are allowed');
        e.target.files = null;
        setFileError(true);
        return;
      }
      if (e.target.files[0].size > 5242880) {
        message.error('OOPS! File size exceeded the maxmimum limit');
        e.target.files = null;
        setFileError(true);
        return;
      } else {
        setFile(e.target.files[0]);
        setFileError(false);
      }
    } else {
      setFile();
    }
  };
  const columns = [
    // {
    //   title: <span className='th-white th-16 th-fw-700'>Sl No.</span>,
    //   align: 'center',
    //   width: '10%',
    //   render: (data, row, index) => (
    //     <span className='th-black-1 th-16'>{index + 1}.</span>
    //   ),
    // },
    {
      title: <span className='th-white th-16 th-fw-700'>Code</span>,
      align: 'center',
      render: (data, row) => <span className='th-black-1 th-16'>{row?.branch_code}</span>,
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Branch Name</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {' '}
          {extractContent(row?.branch_name).length > 15 ? (
            <Tooltip
              autoAdjustOverflow='false'
              placement='bottomRight'
              title={extractContent(row?.branch_name)}
              overlayStyle={{ maxWidth: '30%', minWidth: '20%' }}
            >
              {extractContent(row?.branch_name).substring(0, 15) + '...'}
            </Tooltip>
          ) : (
            extractContent(row?.branch_name)
          )}
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Logo</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          <Image width={50} src={row?.logo} />
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Created At</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {row?.created_at ? moment(row.created_at).format('DD-MM-YYYY') : ' '}
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Created By</span>,
      align: 'center',
      render: (data, row) => <span className='th-black-1 th-16'>{row?.created_by}</span>,
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Address</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {extractContent(row?.address).length > 25 ? (
            <Tooltip
              autoAdjustOverflow='false'
              placement='bottomRight'
              title={extractContent(row?.address)}
              overlayStyle={{ maxWidth: '30%', minWidth: '20%' }}
            >
              {extractContent(row?.address).substring(0, 25) + '...'}
            </Tooltip>
          ) : (
            extractContent(row?.address)
          )}
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Action</span>,
      align: 'center',
      width: '10%',
      key: 'action',
      render: (data, row) => {
        return (
          <>
            {row?.is_delete ? (
              <Popconfirm
                title='Sure to restore?'
                onConfirm={() =>
                  handleRestore({
                    restoreId: row?.id,
                  })
                }
              >
                <RedoOutlined
                  title='Restore'
                  style={{
                    fontSize: 20,
                    margin: 10,
                    cursor: 'pointer',
                    color: '#00A000',
                  }}
                />
              </Popconfirm>
            ) : (
              <>
                <EditOutlined
                  title='Update'
                  style={{
                    fontSize: 20,
                    margin: 10,
                    cursor: 'pointer',
                    color: '#1B4CCB',
                  }}
                  onClick={() =>
                    handleOpenDrawer({
                      actionKey: 'edit',
                      editId: row?.id,
                      rowData: row,
                    })
                  }
                />
                <Popconfirm
                  title='Sure to delete?'
                  onConfirm={() =>
                    handleDelete({
                      delId: row?.id,
                    })
                  }
                >
                  <DeleteOutlined
                    title='Delete'
                    style={{
                      fontSize: 20,
                      margin: 10,
                      cursor: 'pointer',
                      color: '#FF0000',
                    }}
                  />
                </Popconfirm>
              </>
            )}
          </>
        );
      },
    },
  ];
  const noDataLocale = {
    emptyText: (
      <div className='d-flex justify-content-center mt-5 th-grey'>
        <Empty
          description={
            <div>
              No data found. <br />
              Please try again.
            </div>
          }
        />
      </div>
    ),
  };
  return (
    <>
      <Layout>
        <div className='row py-3'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-grey th-16'>
                Master Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>Branch List</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row justify-content-between'>
                <div className='col-lg-4 col-md-6 col-sm-6 col-12 mb-2'>
                  <Input
                    placeholder='Search Branch'
                    suffix={<SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    allowClear
                  />
                </div>
                <div className='col-lg-2 col-md-3 col-sm-3 col-12'>
                  <Button
                    type='primary'
                    icon={<PlusCircleOutlined />}
                    onClick={() =>
                      handleOpenDrawer({
                        actionKey: 'create',
                      })
                    }
                    className='btn-block th-br-4'
                  >
                    Add Branch
                  </Button>
                </div>
              </div>
              <div className='mt-2'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                  <Table
                    className='th-table'
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                    }
                    loading={loading || tableLoading}
                    columns={columns}
                    rowKey={(record) => record?.id}
                    dataSource={tableData?.results}
                    pagination={false}
                    locale={noDataLocale}
                    scroll={{
                      x: 'max-content',
                      y: '100vh',
                    }}
                  />
                </div>
                <div className='d-flex justify-content-center py-2'>
                  <Pagination
                    current={currentPage}
                    pageSize={15}
                    showSizeChanger={false}
                    onChange={(page) => {
                      setCurrentPage(page);
                    }}
                    total={tableData?.count}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Drawer
          title={editId ? 'Update Branch' : 'Create Branch'}
          visible={openDrawer}
          onClose={handleCloseDrawer}
          footer={[
            <Row justify='space-around'>
              <Col>
                <Button type='default' onClick={handleCloseDrawer}>
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  type='primary'
                  icon={
                    drawerLoading ? (
                      <SyncOutlined spin />
                    ) : editId ? (
                      <EditOutlined />
                    ) : (
                      <PlusCircleOutlined />
                    )
                  }
                  className='btn-block th-br-4'
                  form='formRef'
                  htmlType='submit'
                >
                  {editId ? 'Update' : 'Add'}
                </Button>
              </Col>
            </Row>,
          ]}
          width={drawerWidth}
        >
          {drawerLoading ? (
            <div className='d-flex justify-content-center align-items-center'>
              <Spin tip='Hold on! Great things take time!' size='large' />
            </div>
          ) : (
            <>
              <div className='col-lg-12 col-md-12 col-sm-12 col-12 mt-2'>
                <Form
                  id='formRef'
                  form={formRef}
                  onFinish={editId ? handleEdit : handleCreate}
                  layout='vertical'
                >
                  <Form.Item
                    name='branch_name'
                    label='Branch Name'
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Branch Name',
                      },
                    ]}
                  >
                    <Input
                      placeholder='Enter Branch Name'
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      allowClear
                      maxLength={100}
                    />
                  </Form.Item>
                  <Form.Item
                    name='branch_code'
                    label='Branch Code'
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter a Three-digit Branch Code',
                        pattern: /^[0-9]{1,3}$/,
                      },
                    ]}
                  >
                    <Input
                      placeholder='Enter Branch Code'
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      allowClear
                      disabled={editId}
                    />
                  </Form.Item>
                  <Form.Item
                    name='address'
                    label='Branch Address'
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Branch Address',
                      },
                    ]}
                  >
                    <TextArea
                      placeholder='Enter Branch Address'
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      allowClear
                      maxLength={500}
                    />
                  </Form.Item>
                  <Form.Item
                    name='legalName'
                    label='Legal Name'
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Legal Name',
                      },
                    ]}
                  >
                    <Input
                      placeholder='Enter Legal Name'
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      allowClear
                      maxLength={100}
                    />
                  </Form.Item>
                  <Form.Item
                    name='legalContact'
                    label='Legal Contact'
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter a 10-digit Contact Number',
                        pattern: /^[0-9]{10}$/,
                      },
                    ]}
                  >
                    <Input
                      placeholder='Enter Legal Contact'
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item
                    name='legalEmail'
                    label='Legal Email'
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter a Valid Email Address',
                        type: 'email',
                      },
                    ]}
                  >
                    <Input
                      placeholder='Enter Legal Email'
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      allowClear
                      maxLength={100}
                    />
                  </Form.Item>
                  <Form.Item
                    name='branch_logo'
                    label='Branch Logo (max 5MB, jpg / jpeg / png)'
                  >
                    <label htmlFor='file-upload'>
                      <Tag
                        icon={<UploadOutlined />}
                        className='th-white th-br-4'
                        style={{ backgroundColor: '#1b4ccb', cursor: 'pointer' }}
                      >
                        Browse
                      </Tag>
                    </label>
                    <Input
                      type='file'
                      id='file-upload'
                      accept='.jpg, .jpeg, .png'
                      onChange={(e) => handleFile(e)}
                      style={{ display: 'none' }}
                    />
                    <div className='pt-1'>
                      {fileError && (
                        <div className='th-red'>
                          FILE FORMAT ERROR <br /> (max size 5MB, jpg/jpeg/png)
                        </div>
                      )}
                    </div>
                    <div className='pt-1'>
                      {file && (
                        <div className='row'>
                          <div className='px-1'>{file?.name}</div>
                          <div className='px-1'>
                            <DeleteOutlined
                              className='th-red th-pointer th-20'
                              onClick={() => setFile()}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {editId && !file && (
                      <img
                        style={{ width: '100%' }}
                        src={fileLink}
                        alt='Logo is missing'
                      />
                    )}
                  </Form.Item>
                </Form>
              </div>
            </>
          )}
        </Drawer>
      </Layout>
    </>
  );
};

export default BranchTable;
