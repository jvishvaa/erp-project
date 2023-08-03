import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'containers/Layout';
import {
  Breadcrumb,
  Button,
  Form,
  Select,
  Table,
  Pagination,
  message,
  Popconfirm,
  Tag,
  Space,
  Modal,
  Empty,
} from 'antd';
import {
  DownOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import UploadSignature from './signature-upload';
import axios from 'axios';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
const { Option } = Select;

const SignatureUploadv2 = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [uploadFlag, setUploadFlag] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 15;
  const [totalCount, setTotalCount] = useState(0);
  const [userLevelList, setUserLevelList] = useState([]);
  const [selectedUserLevels, setSelectedUserLevels] = useState([]);

  const [editFlag, setEditFlag] = useState(false);
  const [editData, setEditData] = useState([]);

  const [imageFlag, setImageFlag] = useState(false);
  const [imageData, setImageData] = useState();

  const [signatures, setSignatures] = useState([]);
  const [filterFlag, setFilterFlag] = useState(false);

  const [moduleId, setModuleId] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Master Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Signature Upload') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  useEffect(() => {
    fetchUserLevels();
    // fetchSignatures(); // first 15 api call will be handled by useEffect [page]
  }, []);
  const fetchUserLevels = () => {
    axios
      .get(endpoints.userManagement.userLevelList, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        setUserLevelList(result?.data?.result);
      })
      .catch((error) => {
        message.error(error.response?.data?.message ?? 'Something Went Wrong !');
      });
  };
  const handleUserLevels = (e, value) => {
    if (value.length) {
      setSelectedUserLevels(value);
    } else {
      setSelectedUserLevels([]);
    }
  };
  useEffect(() => {
    if (selectedUserLevels.length == 0) {
      fetchSignatures();
    }
  }, [selectedUserLevels]);
  const handleFilter = () => {
    if (!selectedUserLevels.length) {
      message.error('Please select user level to filter');
      return;
    }
    // fetchSignatures();
    setPage(1); // data will be feteched from useEffect hook
    setFilterFlag(!filterFlag);
  };
  const fetchSignatures = () => {
    setLoading(true);
    let reqApi = endpoints.signature.getSignatureList;
    reqApi += `?branch_id=${selectedBranch?.branch?.id}`;
    if (selectedUserLevels.length) {
      const selectedUserLevelIds = selectedUserLevels.map((el) => el.key);
      reqApi += `&user_level=${selectedUserLevelIds.toString()}`;
    }
    reqApi += `&page=${page}`;

    axiosInstance
      .get(reqApi)
      .then((result) => {
        if (result.data.status_code > 199 && result.data.status_code < 300) {
          setLoading(false);
          setSignatures(result?.data?.result?.results);
          setTotalCount(result?.data?.result?.count);
        } else {
          setLoading(false);
          message.error(result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.response?.data?.message || error.response?.data?.msg);
      });
  };
  useEffect(() => {
    fetchSignatures(); // fetch another 15 entries to display in table
  }, [page, filterFlag]);
  const handleDelete = (row) => {
    console.log(row, 'row');
    setLoading(true);
    let reqApi = endpoints.signature.deleteSignatureApi;
    reqApi += `?sign_id=${row?.id}`;
    axiosInstance
      .delete(reqApi)
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          fetchSignatures(); // data has to be fetchedAfter deleting an entry
          message.success(result.data.msg || result.data.message);
        } else {
          setLoading(false);
          message.error(result.data.msg || result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.response?.data?.message || error.response?.data?.msg);
      });
  };
  const handleEditing = (row) => {
    setEditData(row);
    setEditFlag(true);
    handleOpenUploadModal(); // open same upload modal with editFlag true and editData filled
  };
  const handleOpenUploadModal = () => {
    setUploadFlag(true);
  };
  const handleCloseUploadModal = () => {
    setPage(1);
    setUploadFlag(false);
    setEditFlag(false);
  };
  const handleUpdateTableData = () => {
    fetchSignatures();
  };
  const handleOpenImageModal = (row) => {
    setImageData(row);
    setImageFlag(true);
  };
  const handleCloseImageModal = () => {
    setImageFlag(false);
  };
  const userLevelOptions = userLevelList.map((each) => {
    return (
      <Option key={each?.id} value={each?.level_name}>
        {each?.level_name}
      </Option>
    );
  });
  const columns = [
    {
      title: <span className='th-white th-fw-700'>User Level</span>,
      width: '15%',
      align: 'left',
      dataIndex: 'userlevel',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {userLevelList[row?.author__user__level__user_level - 1]?.level_name}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Erp Id</span>,
      width: '20%',
      align: 'left',
      dataIndex: 'erp',
      render: (data, row) => (
        <span className='th-black-1 th-16'>{row?.author_id__erp_id}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Name</span>,
      width: '35%',
      align: 'left',
      dataIndex: 'name',
      render: (data, row) => (
        <span className='th-black-1 th-16'>{row?.author_id__name}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Signature</span>,
      width: '20%',
      align: 'center',
      dataIndex: 'signature',
      render: (data, row) => (
        <div>
          <img
            style={{ height: '50px', width: '150px' }}
            src={`${endpoints.signature.s3}${row?.signature}`}
            alt='Signature not found'
            onClick={() => handleOpenImageModal(row)}
          />
        </div>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      width: '20%',
      align: 'center',
      dataIndex: 'erp',
      render: (data, row, index) => (
        <Space>
          <Tag
            icon={<EditOutlined />}
            color='processing'
            onClick={() => handleEditing(row)}
            style={{ cursor: 'pointer' }}
          >
            Edit
          </Tag>

          <Popconfirm title='Sure to delete?' onConfirm={(e) => handleDelete(row)}>
            <Tag icon={<DeleteOutlined />} color='error' style={{ cursor: 'pointer' }}>
              Delete
            </Tag>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const noDataLocale = {
    emptyText: (
      <div className='d-flex justify-content-center mt-5 th-grey'>
        <Empty description={'No signatures have been uploaded for this level yet'} />
      </div>
    ),
  };

  return (
    <React.Fragment>
      <Layout>
        <div className='row pt-3 pb-3'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-black-1 th-16 th-grey'>
                Master Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Signature Upload
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {uploadFlag && (
          <UploadSignature
            setLoading={setLoading}
            handleCloseUploadModal={handleCloseUploadModal}
            handleUpdateTableData={handleUpdateTableData}
            uploadFlag={uploadFlag}
            editFlag={editFlag}
            editData={editData}
            userLevelList={userLevelList}
          />
        )}

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 shadow-sm'>
              <div children='row'>
                <div className='col-md-12'>
                  <Form
                    id='filterForm'
                    ref={formRef}
                    layout={'horizontal'}
                    className='row'
                  >
                    <div className='col-md-2 col-6 px-1'>
                      <Form.Item name='user-level'>
                        <Select
                          allowClear
                          mode='multiple'
                          maxTagCount={2}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          showArrow={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          placeholder={'Select User Level'}
                          showSearch
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(e, value) => handleUserLevels(e, value)}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={false}
                        >
                          {userLevelOptions}
                        </Select>
                      </Form.Item>
                    </div>

                    <div className='col-md-1 col-6 px-1'>
                      <Button
                        className='btn-block th-br-4'
                        type='primary'
                        onClick={handleFilter}
                      >
                        Filter
                      </Button>
                    </div>

                    <div className='justify-content-end col-md-2 col-12 px-1'>
                      <Button
                        className='btn-block th-br-4'
                        type='primary'
                        onClick={handleOpenUploadModal}
                      >
                        <PlusCircleOutlined />
                        Upload Signature
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
              <>
                <div className='mt-2'>
                  <div className='convert col-md-12'>
                    <Table
                      className='th-table'
                      rowClassName={(record, index) =>
                        index % 2 === 0
                          ? 'th-bg-grey th-pointer'
                          : 'th-bg-white th-pointer'
                      }
                      loading={loading}
                      columns={columns}
                      rowKey={(record) => record?.id}
                      dataSource={signatures}
                      pagination={false}
                      locale={noDataLocale}
                      scroll={{ x: window.innerWidth > 400 ? '100%' : 'max-content', y:350}}
                    />
                  </div>

                  <div className='d-flex justify-content-center py-2'>
                    <Pagination
                      current={page}
                      pageSize={15}
                      showSizeChanger={false}
                      onChange={(page) => {
                        setPage(page);
                      }}
                      total={totalCount}
                    />
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
        <Modal
          visible={imageFlag}
          title={
            <div>
              Signature of <b>{imageData?.author_id__name}</b>
            </div>
          }
          onCancel={handleCloseImageModal}
          width={500}
          footer={null}
          centered
        >
          <div className='row justify-content-center py-3'>
            <img
              style={{ height: '300px', width: '300px' }}
              src={`${endpoints.signature.s3}${imageData?.signature}`}
              alt='No Image'
            />
          </div>
        </Modal>
      </Layout>
    </React.Fragment>
  );
};

export default SignatureUploadv2;
