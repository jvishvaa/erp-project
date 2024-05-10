import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Input,
  Table,
  message,
  Pagination,
  Empty,
  Drawer,
  Row,
  Col,
  Spin,
  Form,
  Modal,
  Popconfirm,
  Tooltip,
  Switch,
} from 'antd';
import {
  PlusCircleOutlined,
  SearchOutlined,
  EditOutlined,
  SyncOutlined,
  DeleteOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import moment from 'moment';
import Layout from 'containers/Layout';
import { useForm } from 'antd/lib/form/Form';
const SubjectTable = () => {
  const { TextArea } = Input;
  const [formRef] = useForm();
  const [formRef1] = useForm();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modal1Loading, setModal1Loading] = useState(false);
  const [drawerTableData, setDrawerTableData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [selectedRows, setSelectedRows] = useState([]);
  const [id, setId] = useState();
  const [editId, setEditId] = useState();
  const [isChecked, setIsChecked] = useState(false);
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
    setLoading(true);
    let params = {
      page: currentPage,
      page_size: pageSize,
    };
    if (search?.length > 0) {
      params = {
        ...params,
        subject_name: search,
      };
    }
    axiosInstance
      .get(`${endpoints.masterManagement.subjects}`, {
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
        setLoading(false);
      });
  };
  const fetchDrawerTableData = () => {
    setDrawerLoading(true);
    axiosInstance
      .get(`${endpoints.masterManagement.centralSubjects}`)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setDrawerTableData(response?.data?.result);
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };
  const handleModalSubmit = () => {
    const subject_name = formRef?.getFieldsValue()?.subject_name;
    if (!subject_name || subject_name?.length === 0) {
      message.error('OOPS! Please enter subject name');
      return;
    }
    setModalLoading(true);
    const params = {
      subject_name: subject_name,
    };
    axiosInstance
      .put(`${endpoints.masterManagement.updateSubject}${id}`, params)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Subject name updated successfully');
          handleCloseModal();
          fetchTableData();
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setModalLoading(false);
      });
  };
  const handleDrawerSubmit = (value) => {
    // if (selectedRows?.length === 0) {
    //   message.error('OOPS! Please select atleast one subject');
    //   return;
    // }
    const subject = {
      eduvate_subject_id: value[0]?.id,
      subject_name: value[0]?.subject_name,
      description: '',
      is_optional: false,
    };
    // const subjects = [];       // for handling multiple subjects add at one go
    // selectedRows.forEach((item) => {
    //   const { id, grade_name } = item;
    //   subjects.push({
    //     subject_name: subject_name,
    //     eduvate_grade_id: id,
    //     is_optional: false,
    //     description: '',
    //   });
    // });
    setDrawerLoading(true);
    axiosInstance
      .post(`${endpoints.masterManagement.createSubject}`, subject)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Subjects added successfully');
          handleCloseDrawer();
          if (search?.length > 0) {
            setSearch('');
          } else {
            handleFetchTableData();
          }
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };
  const handleCreate = () => {
    const subject_name = formRef1?.getFieldsValue()?.subject_name;
    const description = formRef1?.getFieldsValue()?.description;
    const is_optional = isChecked;
    if (!subject_name || subject_name?.length === 0) {
      message.error('OOPS! Please enter subject name');
      return;
    }
    setModal1Loading(true);
    const params = {
      description: description,
      eduvate_subject_id: null,
      is_optional: is_optional,
      subject_name: subject_name,
    };
    axiosInstance
      .post(`${endpoints.masterManagement.createSubject}`, params)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Subject created successfully');
          handleCloseModal1();
          if (search?.length > 0) {
            setSearch('');
          } else {
            handleFetchTableData();
          }
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setModal1Loading(false);
      });
  };
  const handleEdit = () => {
    const subject_name = formRef1?.getFieldsValue()?.subject_name;
    const description = formRef1?.getFieldsValue()?.description;
    const is_optional = isChecked;
    if (!subject_name || subject_name?.length === 0) {
      message.error('OOPS! Please enter subject name');
      return;
    }
    setModal1Loading(true);
    const params = {
      subject_description: description,
      eduvate_subject_id: null,
      is_optional: is_optional,
      subject_name: subject_name,
    };
    axiosInstance
      .put(`${endpoints.masterManagement.updateSubject}${editId}`, params)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Subject updated successfully');
          handleCloseModal1();
          fetchTableData();
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setModal1Loading(false);
      });
  };
  const handleDelete = ({ delId }) => {
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.updateSubject}${delId}`)
      .then((response) => {
        if (response?.data?.status_code == 204) {
          message.success('Hurray! Subject deleted successfully');
          fetchTableData();
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleRestore = ({ restoreId }) => {
    setLoading(true);
    axiosInstance
      .put(`${endpoints.masterManagement.restoreSubject}${restoreId}`)
      .then((response) => {
        if (response?.data?.status_code == 204) {
          message.success('Hurray! Subject restored successfully');
          fetchTableData();
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleOpenDrawer = () => {
    setOpenDrawer(true);
    fetchDrawerTableData();
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setDrawerTableData([]);
    setSelectedRowKeys([]);
  };
  const handleOpenModal = ({ id, subject_name }) => {
    setOpenModal(true);
    formRef.setFieldsValue({
      subject_name: subject_name,
    });
    setId(id);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    formRef.resetFields();
    setId();
  };
  const handleOpenModal1 = ({ actionKey, editId, rowData }) => {
    setOpenModal1(true);
    if (actionKey === 'edit') {
      formRef1.setFieldsValue({
        subject_name: rowData?.subject_name,
        description: rowData?.subject_description,
      });
      setEditId(editId);
      setIsChecked(rowData?.is_optional);
    }
  };
  const handleCloseModal1 = () => {
    setOpenModal1(false);
    formRef1.resetFields();
    setEditId();
  };
  const columns = [
    // {
    //   title: <span className='th-white th-16 th-fw-700'>SNo</span>,
    //   align: 'center',
    //   width: '5%',
    //   render: (data, row, index) => (
    //     <span className='th-black-1 th-16'>{index + 1}.</span>
    //   ),
    // },
    {
      title: <span className='th-white th-16 th-fw-700'>School Subject Name</span>,
      align: 'left',
      width: '20%',
      render: (data, row) => (
        <div className='d-flex justify-content-between'>
          <span className='th-black-1 th-16'>
            {' '}
            {extractContent(row?.subject_name).length > 15 ? (
              <Tooltip
                autoAdjustOverflow='false'
                placement='bottomLeft'
                title={extractContent(row?.subject_name)}
                overlayStyle={{ maxWidth: '30%', minWidth: '20%' }}
              >
                {extractContent(row?.subject_name).substring(0, 15) + '...'}
              </Tooltip>
            ) : (
              extractContent(row?.subject_name)
            )}
          </span>
          <EditOutlined
            title='Edit School Grade Name'
            style={{
              fontSize: 20,
              cursor: 'pointer',
              color: '#1B4CCB',
            }}
            onClick={() =>
              handleOpenModal({
                id: row?.id,
                subject_name: row?.subject_name,
              })
            }
          />
        </div>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Eduvate Subject Name</span>,
      align: 'center',
      width: '20%',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {row?.eduvate_subject_id ? row?.subject_slag : '-'}
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Created At</span>,
      align: 'center',
      width: '15%',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {row?.created_at ? moment(row.created_at).format('DD-MM-YYYY') : ' '}
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Created By</span>,
      align: 'center',
      width: '15%',
      render: (data, row) => <span className='th-black-1 th-16'>{row?.created_by}</span>,
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Description</span>,
      align: 'center',
      width: '10%',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {extractContent(row?.subject_description).length > 20 ? (
            <Tooltip
              autoAdjustOverflow='false'
              placement='bottomLeft'
              title={extractContent(row?.subject_description)}
              overlayStyle={{ maxWidth: '30%', minWidth: '20%' }}
            >
              {extractContent(row?.subject_description).substring(0, 20) + '...'}
            </Tooltip>
          ) : (
            extractContent(row?.subject_description)
          )}
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Optional</span>,
      align: 'center',
      width: '10%',
      render: (data, row) => (
        <span className='th-black-1 th-16'>{row?.is_optional ? 'Yes' : 'No'}</span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Action</span>,
      align: 'center',
      key: 'action',
      width: '10%',
      render: (data, row) => {
        return (
          <>
            {row?.eduvate_subject_id === null ? (
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
                      title='Edit'
                      style={{
                        fontSize: 20,
                        margin: 10,
                        cursor: 'pointer',
                        color: '#1B4CCB',
                      }}
                      onClick={() =>
                        handleOpenModal1({
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
            ) : (
              <Tooltip
                autoAdjustOverflow='false'
                placement='bottomRight'
                title='Eduvate subject cannot be deleted'
              >
                <i>Not allowed</i>
              </Tooltip>
            )}
          </>
        );
      },
    },
  ];
  const drawerTablecolumns = [
    {
      title: <span className='th-white th-16 th-fw-700'>Eduvate Subject Name</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>{row?.subject_name}</span>
      ),
    },
  ];
  const onSelectChange = (newSelectedRowKeys, value) => {
    setSelectedRowKeys(newSelectedRowKeys);
    handleDrawerSubmit(value);
    // setSelectedRows(value);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.is_check === true,
    }),
    hideSelectAll: true,
  };
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
              <Breadcrumb.Item className='th-black-1 th-16'>Subject List</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row'>
                <div className='col-lg-4 col-md-4 col-sm-6 col-12 mb-2'>
                  <Input
                    placeholder='Search Subject'
                    suffix={<SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    allowClear
                  />
                </div>
                <div className='row col-lg-8 col-md-8 col-sm-6 col-12 justify-content-end'>
                  <div className='col-lg-3 col-md-6 col-sm-12 col-12 mb-2'>
                    <Button
                      type='primary'
                      icon={<PlusCircleOutlined />}
                      onClick={() =>
                        handleOpenModal1({
                          actionKey: 'create',
                        })
                      }
                      className='btn-block th-br-4'
                    >
                      Add Subject
                    </Button>
                  </div>
                  <div className='col-lg-3 col-md-6 col-sm-12 col-12'>
                    <Button
                      type='primary'
                      icon={<PlusCircleOutlined />}
                      onClick={() => handleOpenDrawer()}
                      className='btn-block th-br-4'
                    >
                      Add Eduvate Subject
                    </Button>
                  </div>
                </div>
              </div>
              <div className='mt-2'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                  <Table
                    className='th-table'
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                    }
                    loading={loading}
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
          title='Add Subject'
          visible={openDrawer}
          onClose={handleCloseDrawer}
          footer={[
            <Row justify='space-around'>
              <Col>
                <Button type='default' onClick={handleCloseDrawer}>
                  Cancel
                </Button>
              </Col>
              {/* <Col>
                <Button
                  type='primary'
                  icon={drawerLoading ? <SyncOutlined spin /> : <PlusCircleOutlined />}
                  className='btn-block th-br-4'
                  onClick={() => handleDrawerSubmit()}
                >
                  Add Subject
                </Button>
              </Col> */}
            </Row>,
          ]}
          width={drawerWidth}
        >
          <>
            {drawerLoading ? (
              <div className='d-flex justify-content-center align-items-center'>
                <Spin size='large' />
              </div>
            ) : (
              <>
                <div className='tableSubjectAdd'>
                  <Table
                    className='th-table'
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                    }
                    rowSelection={rowSelection}
                    loading={loading}
                    columns={drawerTablecolumns}
                    rowKey={(record) => record?.id}
                    dataSource={drawerTableData}
                    pagination={false}
                    scroll={{
                      x: window.innerWidth > 400 ? '100%' : 'max-content',
                      y: '100vh',
                    }}
                  />
                </div>
              </>
            )}
          </>
        </Drawer>
        <Modal
          visible={openModal}
          title='Edit School Subject Name'
          onCancel={handleCloseModal}
          footer={[
            <Row justify='space-around'>
              <Col>
                <Button type='default' onClick={handleCloseModal}>
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  type='primary'
                  icon={modalLoading ? <SyncOutlined spin /> : <EditOutlined />}
                  className='btn-block th-br-4'
                  form='formRef'
                  htmlType='submit'
                >
                  Edit Subject
                </Button>
              </Col>
            </Row>,
          ]}
        >
          {modalLoading ? (
            <div className='d-flex justify-content-center align-items-center'>
              <Spin tip='Hold on! Great things take time!' size='large' />
            </div>
          ) : (
            <>
              <div className='col-lg-12 col-md-12 col-sm-12 col-12 mt-2'>
                <Form id='formRef' form={formRef} onFinish={handleModalSubmit}>
                  <Form.Item
                    name='subject_name'
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Subject Name',
                      },
                    ]}
                  >
                    <Input
                      placeholder='Enter Subject Name'
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      allowClear
                      maxLength={100}
                    />
                  </Form.Item>
                </Form>
              </div>
            </>
          )}
        </Modal>
        <Modal
          visible={openModal1}
          title={editId ? 'Edit Subject' : 'Create Subject'}
          onCancel={handleCloseModal1}
          footer={[
            <Row justify='space-around'>
              <Col>
                <Button type='default' onClick={handleCloseModal1}>
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  type='primary'
                  icon={
                    modal1Loading ? (
                      <SyncOutlined spin />
                    ) : editId ? (
                      <EditOutlined />
                    ) : (
                      <PlusCircleOutlined />
                    )
                  }
                  className='btn-block th-br-4'
                  form='formRef1'
                  htmlType='submit'
                >
                  {editId ? 'Edit' : 'Add'}
                </Button>
              </Col>
            </Row>,
          ]}
        >
          {modal1Loading ? (
            <div className='d-flex justify-content-center align-items-center'>
              <Spin tip='Hold on! Great things take time!' size='large' />
            </div>
          ) : (
            <>
              <div className='col-lg-12 col-md-12 col-sm-12 col-12 mt-2'>
                <Form
                  id='formRef1'
                  form={formRef1}
                  onFinish={editId ? handleEdit : handleCreate}
                  layout='vertical'
                >
                  <Form.Item
                    name='subject_name'
                    label='Subject Name'
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Subject Name',
                      },
                    ]}
                  >
                    <Input
                      placeholder='Enter Subject Name*'
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      allowClear
                      maxLength={100}
                    />
                  </Form.Item>
                  <Form.Item name='description' label='Description (max 100 characters)'>
                    <TextArea
                      placeholder='Enter Description'
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      maxLength={100}
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item name='is_optional' label='Optional'>
                    <Switch
                      checked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                    />
                  </Form.Item>
                </Form>
              </div>
            </>
          )}
        </Modal>
      </Layout>
    </>
  );
};

export default SubjectTable;
