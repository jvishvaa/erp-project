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
  Modal,
  Popconfirm,
} from 'antd';
import {
  PlusCircleOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  SyncOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import moment from 'moment';
import Layout from 'containers/Layout';
import { useForm } from 'antd/lib/form/Form';
const SectionTable = () => {
  const [formRef] = useForm();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editId, setEditId] = useState();
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
        section_name: search,
      };
    }
    axiosInstance
      .get(`${endpoints.masterManagement.sectionsTable}`, {
        params: params,
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setTableData(response?.data?.data);
        }
      })
      .catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'OOPS! Something went wrong. Please try again'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleCreate = () => {
    const section_name = formRef?.getFieldsValue()?.section_name;
    if (!section_name || section_name?.length === 0) {
      message.error('OOPS! Please enter section name');
      return;
    }
    setModalLoading(true);
    const params = {
      section_name: section_name,
    };
    axiosInstance
      .post(`${endpoints.masterManagement.createSection}`, params)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Section created successfully');
          handleCloseModal();
          if (search?.length > 0) {
            setSearch('');
          } else {
            handleFetchTableData();
          }
        } else {
          message.error('OOPS! This section name is already present');
          return;
        }
      })
      .catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'OOPS! Something went wrong. Please try again'
        );
      })
      .finally(() => {
        setModalLoading(false);
      });
  };
  const handleEdit = () => {
    const section_name = formRef?.getFieldsValue()?.section_name;
    if (!section_name || section_name?.length === 0) {
      message.error('OOPS! Please enter section name');
      return;
    }
    setModalLoading(true);
    const params = {
      section_name: section_name,
    };
    axiosInstance
      .put(`${endpoints.masterManagement.updateSection}${editId}`, params)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Section name updated successfully');
          handleCloseModal();
          fetchTableData();
        }
      })
      .catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'OOPS! Something went wrong. Please try again'
        );
      })
      .finally(() => {
        setModalLoading(false);
      });
  };
  const handleDelete = ({ delId }) => {
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.updateSection}${delId}`)
      .then((response) => {
        if (response?.data?.status_code == 204) {
          message.success('Hurray! Section deleted successfully');
          fetchTableData();
        }
      })
      .catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'OOPS! Something went wrong. Please try again'
        );
        setLoading(false);
      })
      .finally(() => {});
  };
  const handleRestore = ({ restoreId }) => {
    setLoading(true);
    axiosInstance
      .put(`${endpoints.masterManagement.restoreSection}${restoreId}`)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Section restored successfully');
          fetchTableData();
        }
      })
      .catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'OOPS! Something went wrong. Please try again'
        );
        setLoading(false);
      })
      .finally(() => {});
  };
  const handleOpenModal = ({ actionKey, editId, section_name }) => {
    setOpenModal(true);
    if (actionKey === 'edit') {
      formRef.setFieldsValue({
        section_name: section_name,
      });
      setEditId(editId);
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    formRef.resetFields();
    setEditId();
  };
  const columns = [
    {
      title: <span className='th-white th-16 th-fw-700'>Sl No.</span>,
      align: 'center',
      width: '10%',
      render: (data, row, index) => (
        <span className='th-black-1 th-16'>{index + 1}.</span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Section Name</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>{row?.section_name}</span>
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
      title: <span className='th-white th-16 th-fw-700'>Action</span>,
      align: 'center',
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
                  title='Edit'
                  style={{
                    fontSize: 20,
                    margin: 10,
                    cursor: 'pointer',
                    color: '#1B4CCB',
                  }}
                  onClick={() =>
                    handleOpenModal({
                      actionKey: 'edit',
                      editId: row?.id,
                      section_name: row?.section_name,
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
              <Breadcrumb.Item className='th-black-1 th-16'>Section List</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row justify-content-between'>
                <div className='col-lg-4 col-md-6 col-sm-6 col-12 mb-2'>
                  <Input
                    placeholder='Search Section'
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
                      handleOpenModal({
                        actionKey: 'create',
                      })
                    }
                    className='btn-block th-br-4'
                  >
                    Add Section
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
                    loading={loading}
                    columns={columns}
                    rowKey={(record) => record?.id}
                    dataSource={tableData?.results}
                    pagination={false}
                    locale={noDataLocale}
                    scroll={{
                      x: window.innerWidth > 400 ? '100%' : 'max-content',
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
        <Modal
          visible={openModal}
          title={editId ? 'Edit Section' : 'Create Section'}
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
                  icon={
                    modalLoading ? (
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
                  {editId ? 'Edit' : 'Add'}
                </Button>
              </Col>
            </Row>,
          ]}
        >
          {modalLoading ? (
            <div className='d-flex justify-content-center align-items-center'>
              <Spin size='large' />
            </div>
          ) : (
            <>
              <div className='col-lg-12 col-md-12 col-sm-12 col-12 mt-2'>
                <Form
                  id='formRef'
                  form={formRef}
                  onFinish={editId ? handleEdit : handleCreate}
                >
                  <Form.Item
                    name='section_name'
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Section Name',
                      },
                    ]}
                  >
                    <Input
                      placeholder='Enter Section Name'
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      allowClear
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

export default SectionTable;
