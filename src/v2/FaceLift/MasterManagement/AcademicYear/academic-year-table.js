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
  Tag,
  Tooltip,
} from 'antd';
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SyncOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import Layout from 'containers/Layout';
import { useForm } from 'antd/lib/form/Form';
import { UserMappedErrorMsg } from '../UserMappedErrorMsg';
const AcademicYearTable = () => {
  const [formRef] = useForm();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [openModal, setOpenModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editId, setEditId] = useState();
  useEffect(() => {
    fetchTableData();
  }, [currentPage]);
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
    axiosInstance
      .get(`${endpoints.masterManagement.academicYearsAll}`, {
        params: params,
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setTableData(response?.data?.result);
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
    const session_year = formRef?.getFieldsValue()?.session_year;
    if (!session_year || session_year?.length === 0) {
      message.error('OOPS! Please enter academic year');
      return;
    }
    setModalLoading(true);
    const params = {
      session_year: session_year,
    };
    axiosInstance
      .post(`${endpoints.masterManagement.createAcademicYear}`, params)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Academic year created successfully');
          handleCloseModal();
          handleFetchTableData();
        }
      })
      .catch((error) => {
        message.error(
          error?.response?.data?.msg ?? 'OOPS! Something went wrong. Please try again'
        );
      })
      .finally(() => {
        setModalLoading(false);
      });
  };
  const handleEdit = () => {
    const session_year = formRef?.getFieldsValue()?.session_year;
    if (!session_year || session_year?.length === 0) {
      message.error('OOPS! Please enter academic year');
      return;
    }
    setModalLoading(true);
    const params = {
      academic_year_id: editId,
      session_year: session_year,
    };
    axiosInstance
      .put(`${endpoints.masterManagement.updateAcademicYear}${editId}`, params)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          message.success('Hurray! Academic year updated successfully');
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
  const handleDelete = ({ delId }) => {
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.updateAcademicYear}${delId}`)
      .then((response) => {
        if (response?.data?.status_code == 204) {
          message.success('Hurray! Academic year deleted successfully');
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
      .put(`${endpoints.masterManagement.restoreAcademicYear}${restoreId}`)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Academic year restored successfully');
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
  const handleMakeDefault = ({ defaultId }) => {
    const params = {
      is_current_session: true,
    };
    setLoading(true);
    axiosInstance
      .put(
        `${endpoints.masterManagement.defaultAcademicYear}?session_year_id=${defaultId}`,
        params
      )
      .then((response) => {
        if (response?.data === 'success') {
          message.success('Hurray! Default academic year updated successfully');
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
  const handleOpenModal = ({ actionKey, editId, session_year }) => {
    setOpenModal(true);
    if (actionKey === 'edit') {
      formRef.setFieldsValue({
        session_year: session_year,
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
      title: <span className='th-white th-16 th-fw-700'>Session Year</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>{row?.session_year}</span>
      ),
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
                <Tag
                  icon={<RedoOutlined />}
                  color='#00A000'
                  style={{ cursor: 'pointer', borderRadius: '4px' }}
                >
                  Restore
                </Tag>
              </Popconfirm>
            ) : (
              <>
                {!row?.is_current_session && (
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
                        handleOpenModal({
                          actionKey: 'edit',
                          editId: row?.id,
                          session_year: row?.session_year,
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
                {row?.is_current_session ? (
                  <Tooltip title='This is a default session year'>
                    <Tag>Default Year</Tag>
                  </Tooltip>
                ) : (
                  <Popconfirm
                    title='Sure to make it default?'
                    onConfirm={() =>
                      handleMakeDefault({
                        defaultId: row?.id,
                      })
                    }
                  >
                    <Tag
                      color='#1b4ccb'
                      style={{ cursor: 'pointer', borderRadius: '4px' }}
                    >
                      Default Year
                    </Tag>
                  </Popconfirm>
                )}
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
              <Breadcrumb.Item className='th-black-1 th-16'>
                Academic Year List
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row justify-content-end'>
                <div className='col-lg-3 col-md-3 col-sm-3 col-12'>
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
                    Add Academic Year
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
        <Modal
          visible={openModal}
          title={editId ? 'Update Academic Year' : 'Create Academic Year'}
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
                  {editId ? 'Update' : 'Add'}
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
                <Form
                  id='formRef'
                  form={formRef}
                  onFinish={editId ? handleEdit : handleCreate}
                >
                  <Form.Item
                    name='session_year'
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Academic Year',
                      },
                      {
                        pattern: /^(\d{4})-(\d{2})$/,
                        message: 'Please enter the academic year in the format YYYY-YY',
                      },
                    ]}
                  >
                    <Input
                      placeholder='Enter Academic Year'
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

export default AcademicYearTable;
