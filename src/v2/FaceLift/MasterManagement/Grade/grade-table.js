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
  Tooltip,
} from 'antd';
import {
  PlusCircleOutlined,
  SearchOutlined,
  EditOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import moment from 'moment';
import Layout from 'containers/Layout';
import { useForm } from 'antd/lib/form/Form';
const GradeTable = () => {
  const [formRef] = useForm();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [drawerTableData, setDrawerTableData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [selectedRows, setSelectedRows] = useState([]);
  const [id, setId] = useState();
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
        grade_name: search,
      };
    }
    axiosInstance
      .get(`${endpoints.masterManagement.grades}`, {
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
        setLoading(false);
      });
  };
  const fetchDrawerTableData = () => {
    setDrawerLoading(true);
    axiosInstance
      .get(`${endpoints.masterManagement.centralGrades}`)
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
    const grade_name = formRef?.getFieldsValue()?.grade_name;
    if (!grade_name || grade_name?.length === 0) {
      message.error('OOPS! Please enter grade name');
      return;
    }
    setModalLoading(true);
    const params = {
      grade_id: id,
      grade_name: grade_name,
    };
    axiosInstance
      .put(`${endpoints.masterManagement.updateGrade}${id}`, params)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Grade name updated successfully');
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
    //   message.error('OOPS! Please select atleast one grade');
    //   return;
    // }
    setDrawerLoading(true);
    const grade = {
      grade_name: value[0]?.grade_name,
      grade_type: value[0]?.grade_name,
      eduvate_grade_id: value[0]?.id,
      description: '',
      is_optional: false,
    };
    // const grades = [];   // for handling multiple subjects add at one go
    // selectedRows.forEach((item) => {
    //   const { id, grade_name } = item;
    //   grades.push({
    //     grade_name: grade_name,
    //     grade_type: grade_name,
    //     eduvate_grade_id: id,
    //     description: '',
    //     is_optional: false,
    //   });
    // });
    axiosInstance
      .post(`${endpoints.masterManagement.createGrade}`, grade)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Grades added successfully');
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
  const handleOpenDrawer = () => {
    setOpenDrawer(true);
    fetchDrawerTableData();
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setDrawerTableData([]);
    setSelectedRowKeys([]);
  };
  const handleOpenModal = ({ id, grade_name }) => {
    setOpenModal(true);
    formRef.setFieldsValue({
      grade_name: grade_name,
    });
    setId(id);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    formRef.resetFields();
    setId();
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
      title: <span className='th-white th-16 th-fw-700'>School Grade Name</span>,
      align: 'left',
      render: (data, row) => (
        <div className='d-flex justify-content-between'>
          <span className='th-black-1 th-16'>
            {extractContent(row?.grade_name).length > 15 ? (
              <Tooltip
                autoAdjustOverflow='false'
                placement='bottomLeft'
                title={extractContent(row?.grade_name)}
                overlayStyle={{ maxWidth: '30%', minWidth: '20%' }}
              >
                {extractContent(row?.grade_name).substring(0, 15) + '...'}
              </Tooltip>
            ) : (
              extractContent(row?.grade_name)
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
                grade_name: row?.grade_name,
              })
            }
          />
        </div>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Eduvate Grade Name</span>,
      align: 'center',
      render: (data, row) => <span className='th-black-1 th-16'>{row?.grade_type}</span>,
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
  ];
  const drawerTablecolumns = [
    {
      title: <span className='th-white th-16 th-fw-700'>Eduvate Grade Name</span>,
      align: 'center',
      render: (data, row) => <span className='th-black-1 th-16'>{row?.grade_name}</span>,
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
              <Breadcrumb.Item className='th-black-1 th-16'>Grade List</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row justify-content-between'>
                <div className='col-lg-4 col-md-6 col-sm-6 col-12 mb-2'>
                  <Input
                    placeholder='Search Grade'
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
                    onClick={() => handleOpenDrawer()}
                    className='btn-block th-br-4'
                  >
                    Add Grade
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
        <Drawer
          title='Add Grade'
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
                  Add Grade
                </Button>
              </Col> */}
            </Row>,
          ]}
          width={drawerWidth}
        >
          <>
            {drawerLoading ? (
              <div className='d-flex justify-content-center align-items-center'>
                <Spin tip='Hold on! Great things take time!' size='large' />
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
                    }}
                  />
                </div>
              </>
            )}
          </>
        </Drawer>
        <Modal
          visible={openModal}
          title='Edit School Grade Name'
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
                  Edit Grade
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
                    name='grade_name'
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Grade Name',
                      },
                    ]}
                  >
                    <Input
                      placeholder='Enter Grade Name'
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
      </Layout>
    </>
  );
};

export default GradeTable;
