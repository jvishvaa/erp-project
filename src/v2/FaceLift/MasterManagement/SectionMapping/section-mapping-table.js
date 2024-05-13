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
const SectionMappingTable = () => {
  const { Option } = Select;
  const [filterForm] = useForm();
  const [formRef] = useForm();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [sessionYearList, setSessionYearList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  // for side drawer
  const [branchListDrawer, setBranchListDrawer] = useState([]);
  const [allGradeListDrawer, setAllGradeListDrawer] = useState([]);
  const [allSectionListDrawer, setAllSectionListDrawer] = useState([]);
  const [drawerWidth, setDrawerWidth] = useState(
    window.innerWidth <= 768 ? '90%' : window.innerWidth <= 992 ? '50%' : '30%'
  );
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
    const session_year = filterForm.getFieldsValue()?.session_year;
    const branch_id = filterForm.getFieldsValue()?.branch_id;
    const grade_id = filterForm.getFieldsValue()?.grade_id;
    setLoading(true);
    let url = endpoints.masterManagement.sectionMapsAll;
    url += `?page=${currentPage}`;
    url += `&page_size=${pageSize}`;
    if (session_year) {
      url += `&session_year=${session_year}`;
    }
    if (branch_id) {
      url += `&branch_id=${branch_id}`;
    }
    if (grade_id?.length) {
      url += `&grade_id=${grade_id}`;
    }
    if (search?.length > 0) {
      url += `&section_name=${search}`;
    }
    axiosInstance
      .get(`${url}`)
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
  const handleDelete = ({ delId }) => {
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.deleteSectionMapping}${delId}`)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          message.success('Hurray! Mapping deleted successfully');
          fetchTableData();
        }
      })
      .catch((error) => {
        message.error('OOPS! Users are mapped to it or Something went wrong.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleRestore = ({ restoreId }) => {
    setLoading(true);
    axiosInstance
      .put(`${endpoints.masterManagement.restoreSectionMapping}${restoreId}`)
      .then((response) => {
        if (response?.data?.status_code == 200) {
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
  const fetchBranchList = () => {
    const session_year = filterForm.getFieldsValue()?.session_year;
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.masterManagement.branchMappingTable}?session_year=${session_year}`
      )
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setBranchList(response?.data?.data?.results);
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchGradeList = () => {
    const session_year = filterForm.getFieldsValue()?.session_year;
    const branch_id = filterForm.getFieldsValue()?.branch_id;
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.masterManagement.gradeMapping}?session_year=${session_year}&branch_id=${branch_id}`
      )
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setGradeList(response?.data?.data);
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleSessionYearChange = () => {
    const session_year = filterForm.getFieldsValue()?.session_year;
    if (session_year) {
      fetchBranchList();
    }
    filterForm.setFieldsValue({
      branch_id: null,
      grade_id: [],
    });
    setBranchList([]);
    setGradeList([]);
  };
  const handleBranchChange = () => {
    const branch_id = filterForm.getFieldsValue()?.branch_id;
    if (branch_id) {
      fetchGradeList();
    }
    filterForm.setFieldsValue({
      grade_id: [],
    });
    setGradeList([]);
  };
  const handleClearAll = () => {
    filterForm.resetFields();
    if (search?.length > 0) {
      setSearch();
    } else {
      handleFetchTableData();
    }
    setBranchList([]);
    setGradeList([]);
  };
  // for side drawer
  const handleOpenDrawer = () => {
    setOpenDrawer(true);
    fetchAllGradeListDrawer();
    fetchAllSectionListDrawer();
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    formRef.resetFields();
    setBranchListDrawer([]);
  };
  const handleSessionYearChangeDrawer = () => {
    const session_year = formRef.getFieldsValue()?.session_year;
    if (session_year) {
      fetchBranchListDrawer();
    }
    formRef.setFieldsValue({
      branch_id: null,
    });
    setBranchListDrawer([]);
  };
  const fetchBranchListDrawer = () => {
    const session_year = formRef.getFieldsValue()?.session_year;
    setDrawerLoading(true);
    axiosInstance
      .get(
        `${endpoints.masterManagement.branchMappingTable}?session_year=${session_year}`
      )
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setBranchListDrawer(response?.data?.data?.results);
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };
  const fetchAllGradeListDrawer = () => {
    setDrawerLoading(true);
    axiosInstance
      .get(`${endpoints.masterManagement.grades}`)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setAllGradeListDrawer(response?.data?.result?.results);
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };
  const fetchAllSectionListDrawer = () => {
    setDrawerLoading(true);
    axiosInstance
      .get(`${endpoints.masterManagement.fetchSectionMap}`)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setAllSectionListDrawer(response?.data?.data);
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };
  const handleAddMapping = () => {
    const values = formRef?.getFieldsValue();
    const params = {
      session_year: [values?.session_year],
      branch_id: [values?.branch_id],
      grade_id: values?.grade_id,
      section_id: values?.section_id,
    };
    setDrawerLoading(true);
    axiosInstance
      .post(`${endpoints.masterManagement.createSectionMapping}`, params)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          message.success('Hurray! Mapping created successfully');
          handleCloseDrawer();
          handleClearAll();
        }
      })
      .catch((error) => {
        message.error('OOPS! Seems mapping already exists');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
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
      title: <span className='th-white th-16 th-fw-700'>ID</span>,
      align: 'center',
      render: (data, row) => <span className='th-black-1 th-16'>{row?.id}</span>,
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Session Year</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {row?.acad_session?.session_year?.session_year}
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Branch</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>{row?.acad_session?.branch?.branch_name}</span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Grade</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>{row?.grade?.grade_name}</span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Section</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>{row?.section?.section_name}</span>
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
  const branchOptions = branchList?.map((each) => (
    <Option key={each?.branch?.id} value={each?.branch?.id}>
      {each?.branch?.branch_name}
    </Option>
  ));
  const gradeOptions = gradeList?.map((each) => (
    <Option key={each?.grade_id} value={each?.grade_id}>
      {each?.grade_name}
    </Option>
  ));
  // for side drawer
  const branchOptionsDrawer = branchListDrawer?.map((each) => (
    <Option key={each?.branch?.id} value={each?.branch?.id}>
      {each?.branch?.branch_name}
    </Option>
  ));
  const allGradeOptionsDrawer = allGradeListDrawer?.map((each) => (
    <Option key={each?.id} value={each?.id}>
      {each?.grade_name}
    </Option>
  ));
  const allSectionOptionsDrawer = allSectionListDrawer?.map((each) => (
    <Option key={each?.id} value={each?.id}>
      {each?.section_name}
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
                Section Mapping List
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
                    placeholder='Search Section'
                    suffix={<SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                    className='w-100 text-left th-black-1 th-br-4'
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    allowClear
                  />
                </div>
                <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                  <Form.Item name='session_year'>
                    <Select
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showArrow={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      placeholder='Select Session Year'
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
                  <Form.Item name='branch_id'>
                    <Select
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showArrow={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      placeholder='Select Branch'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={handleBranchChange}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    >
                      {branchOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                  <Form.Item name='grade_id'>
                    <Select
                      mode='multiple'
                      maxTagCount={2}
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showArrow={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      placeholder='Select Grade'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    >
                      {gradeOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='row justify-content-end'>
                  <div className='row col-lg-3 col-md-6 col-sm-6 col-12'>
                    <div className='col-lg-6 col-md-6 col-sm-6 col-6'>
                      <Form.Item>
                        <Button
                          type='secondary'
                          onClick={() => handleClearAll()}
                          className='btn-block th-br-4'
                        >
                          Clear
                        </Button>
                      </Form.Item>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6 col-6'>
                      <Form.Item>
                        <Button
                          type='primary'
                          onClick={() => handleFetchTableData()}
                          className='btn-block th-br-4'
                        >
                          Filter
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                  <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                    <Form.Item>
                      <Button
                        type='primary'
                        icon={<PlusCircleOutlined />}
                        onClick={() => handleOpenDrawer()}
                        className='btn-block th-br-4'
                      >
                        Add Section Mapping
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </Form>
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
          title='Create Section Mapping'
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
                    name='session_year'
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
                      onChange={handleSessionYearChangeDrawer}
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
                      {branchOptionsDrawer}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name='grade_id'
                    label='Select Grade'
                    rules={[
                      {
                        required: true,
                        message: 'This is a required field',
                      },
                    ]}
                  >
                    <Select
                      mode='multiple'
                      maxTagCount={2}
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showArrow={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      placeholder='Select Grade*'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    >
                      {allGradeOptionsDrawer}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name='section_id'
                    label='Select Section'
                    rules={[
                      {
                        required: true,
                        message: 'This is a required field',
                      },
                    ]}
                  >
                    <Select
                      mode='multiple'
                      maxTagCount={2}
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showArrow={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      placeholder='Select Section*'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    >
                      {allSectionOptionsDrawer}
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

export default SectionMappingTable;
