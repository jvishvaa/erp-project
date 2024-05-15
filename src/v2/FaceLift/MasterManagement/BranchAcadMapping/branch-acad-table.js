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
  Select,
} from 'antd';
import {
  PlusCircleOutlined,
  SearchOutlined,
  DeleteOutlined,
  SyncOutlined,
  RedoOutlined,
  DownOutlined,
} from '@ant-design/icons';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import Layout from 'containers/Layout';
import { useForm } from 'antd/lib/form/Form';
import { UserMappedErrorMsg } from '../UserMappedErrorMsg';
const BranchAcadTable = () => {
  const { Option } = Select;
  const [filterForm] = useForm();
  const [formRef] = useForm();
  const session_year = JSON.parse(sessionStorage.getItem('acad_session'));
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [sessionYearList, setSessionYearList] = useState([]);
  const [allBranchList, setAllBranchList] = useState([]);
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
    fetchSessionYearList();
    filterForm.setFieldsValue({
      session_year: session_year?.id,
    });
  }, []);
  useEffect(() => {
    fetchTableData();
  }, [currentPage]);
  useEffect(() => {
    const session_year = filterForm.getFieldsValue()?.session_year;
    if (!session_year) {
      message.error('OOPS! Please select session year');
      return;
    }
    const timeout = setTimeout(() => {
      handleFetchTableData();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);
  const fetchSessionYearList = () => {
    // setLoading(true);
    axiosInstance
      .get(`${endpoints.masterManagement.academicYear}`)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setSessionYearList(response?.data?.result?.results);
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        // setLoading(false);
      });
  };
  const handleFetchTableData = () => {
    if (currentPage == 1) {
      fetchTableData();
    } else {
      setCurrentPage(1);
    }
  };
  const fetchTableData = () => {
    const values = filterForm.getFieldsValue();
    setTableLoading(true);
    let params = {
      page: currentPage,
      page_size: pageSize,
      session_year: values?.session_year,
    };
    if (search?.length > 0) {
      params = {
        ...params,
        branch_name: search,
      };
    }
    axiosInstance
      .get(`${endpoints.masterManagement.branchAcadMapsAll}`, {
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
  const handleAddMapping = () => {
    const values = formRef?.getFieldsValue();
    const params = {
      branch_id: values?.branch_id,
      session_year_id: [values?.session_year_id],
    };
    setDrawerLoading(true);
    axiosInstance
      .post(`${endpoints.masterManagement.branchMapping}`, params)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Mapping created successfully');
          handleCloseDrawer();
          if (search?.length > 0) {
            setSearch('');
          } else {
            handleFetchTableData();
          }
        }
      })
      .catch((error) => {
        message.error('OOPS! Seems mapping already exists');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };
  const handleDelete = ({ delId }) => {
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.deleteBranch}${delId}`)
      .then((response) => {
        if (response?.data?.status_code == 204) {
          message.success('Hurray! Mapping deleted successfully');
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
      .put(`${endpoints.masterManagement.restoreBranchMapping}${restoreId}`)
      .then((response) => {
        if (response?.data?.status_code == 204) {
          message.success('Hurray! Mapping restored successfully');
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
  const fetchAllBranches = () => {
    setDrawerLoading(true);
    axiosInstance
      .get(`${endpoints.masterManagement.branchList}`)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setAllBranchList(response?.data?.data);
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
    fetchAllBranches();
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    formRef.resetFields();
  };

  const handleSessionYearChange = () => {
    const session_year = filterForm.getFieldsValue()?.session_year;
    if (session_year) {
      handleFetchTableData();
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
      title: <span className='th-white th-16 th-fw-700'>Session Year</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>{row?.session_year?.session_year}</span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Branch Code</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>{row?.branch?.branch_code}</span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Branch Name</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>{row?.branch?.branch_name}</span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Branch Logo</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          <Image width={50} src={row?.branch?.logo} />
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Address</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {extractContent(row?.branch?.address).length > 25 ? (
            <Tooltip
              autoAdjustOverflow='false'
              placement='bottomRight'
              title={extractContent(row?.branch?.address)}
              overlayStyle={{ maxWidth: '30%', minWidth: '20%' }}
            >
              {extractContent(row?.branch?.address).substring(0, 25) + '...'}
            </Tooltip>
          ) : (
            extractContent(row?.branch?.address)
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
  const sessionYearOptions = sessionYearList?.map((each) => (
    <Option key={each?.id} value={each?.id}>
      {each?.session_year}
    </Option>
  ));
  const allBranchOptions = allBranchList?.map((each) => (
    <Option key={each?.id} value={each?.id}>
      {each?.branch_name}
    </Option>
  ));
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
                Branch Acad Mapping List
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <Form
                form={filterForm}
                className='row col-lg-12 col-md-12 col-sm-12 col-12'
              >
                <div className='col-lg-3 col-md-6 col-sm-6 col-12 mb-2'>
                  <Input
                    placeholder='Search Branch'
                    suffix={<SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                    className='w-100 text-left th-black-1 th-br-4'
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    allowClear
                  />
                </div>
                <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                  <Form.Item
                    name='session_year'
                    rules={[
                      {
                        required: true,
                        message: 'This is a required field',
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showArrow={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      placeholder='Select Session Year*'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={handleSessionYearChange}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    >
                      {sessionYearOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                  <Button
                    type='primary'
                    icon={<PlusCircleOutlined />}
                    onClick={() => handleOpenDrawer()}
                    className='btn-block th-br-4'
                  >
                    Add Branch Acad Mapping
                  </Button>
                </div>
              </Form>
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
          title='Create Branch Acad Mapping'
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
                  icon={drawerLoading ? <SyncOutlined spin /> : <PlusCircleOutlined />}
                  className='btn-block th-br-4'
                  form='formRef'
                  htmlType='submit'
                >
                  Add Mapping
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
                  onFinish={handleAddMapping}
                  layout='vertical'
                >
                  <Form.Item
                    name='session_year_id'
                    label='Select Session Year'
                    rules={[
                      {
                        required: true,
                        message: 'This is a required field',
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showArrow={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      placeholder='Select Session Year*'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    >
                      {sessionYearOptions}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name='branch_id'
                    label='Select Branch'
                    rules={[
                      {
                        required: true,
                        message: 'This is a required field',
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showArrow={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      placeholder='Select Branch*'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    >
                      {allBranchOptions}
                    </Select>
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

export default BranchAcadTable;
