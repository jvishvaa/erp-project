import {
  Breadcrumb,
  Button,
  Form,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Table,
  Tooltip,
  message,
} from 'antd';
import Layout from 'containers/Layout';
import React, { createRef, useEffect, useRef, useState } from 'react';
import { AccessKey } from '../../v2/cvboxAccesskey';
import axios from 'axios';
import {
  CopyOutlined,
  DownOutlined,
  EditOutlined,
  InfoCircleTwoTone,
} from '@ant-design/icons';
import endpoints from 'config/endpoints';
import endpointsV2 from 'v2/config/endpoints';
import Loader from 'components/loader/loader';
import axiosInstance from 'config/axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DeleteOutlineOutlined } from '@material-ui/icons';

const { Option } = Select;

const VideoObservation = () => {
  const [branchList, setBranchList] = useState([]);
  const [userLevelList, setUserLevelList] = useState([]);
  const [userNameList, setUserNameList] = useState([]);
  const [load, setLoad] = useState(false);

  const [userLevel, setUserLevel] = useState(null);
  const [branch, setBranch] = useState(null);
  const [userName, setUserName] = useState(null);
  const [acadSession, setAcadSession] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const formRef = createRef();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const inputRef = useRef(null);

  const [refferListPageData, setRefferListPageData] = useState({
    currentPage: 1,
    pageSize: 15,
    totalCount: null,
    totalPage: null,
  });
  const columns = [
    {
      title: (
        <span style={{ textAlign: 'center' }} className='th-white th-fw-700'>
          Sl No.
        </span>
      ),
      dataIndex: 'slNo',
      key: 'slNo',
      render: (text, record, index) =>
        (refferListPageData.currentPage - 1) * refferListPageData.pageSize + index + 1,
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Date</span>,
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Observee</span>,
      dataIndex: 'name',
      key: 'observee',
      render: (text, record) => (
        <div>
          <span>{record.name?.user_name}</span>
          <br />
          <span>({record.name?.user_role})</span>
        </div>
      ),
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Observer</span>,
      key: 'observer',
      render: (text, record) => (
        <div>
          <span>
            {record.observer?.first_name} {record.observer?.last_name}
          </span>
          <br />
          <span>({record.name?.obs_role})</span>
        </div>
      ),
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      key: 'action',
      render: (text, record) => (
        <span style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          {!record?.evaluated && (
            <Tooltip title='Edit' placement='top'>
              <EditOutlined
                style={{
                  fontSize: 20,
                  margin: 10,
                  cursor: 'pointer',
                  color: '#1B4CCB',
                }}
                onClick={() => {
                  history.push({
                    pathname: '/add-video-observation',
                    state: {
                      record,
                    },
                  });
                }}
              />
            </Tooltip>
          )}
          <Tooltip title='Copy' placement='top'>
            <CopyOutlined
              style={{
                fontSize: 20,
                margin: 10,
                cursor: 'pointer',
                color: '#1B4CCB',
              }}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          {!record?.evaluated && (
            <Popconfirm
              title='Sure to Delete ?'
              open={open}
              onConfirm={() => {
                handleDelete(record?.id);
              }}
              onCancel={() => setOpen(false)}
              getPopupContainer={(trigger) => trigger.parentNode}
              overlayClassName='custom-popconfirm'
            >
              <Tooltip title='Delete' placement='top'>
                <DeleteOutlineOutlined
                  style={{
                    fontSize: 20,
                    margin: 10,
                    cursor: 'pointer',
                    color: '#FF0000',
                  }}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </span>
      ),
      align: 'center',
    },
  ];

  const getBranches = () => {
    setLoad(true);
    axiosInstance
      .get(`erp_user/branch/?session_year=${selectedAcademicYear?.id}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoad(false);
          setBranchList(result?.data?.data?.results);
        }
      })
      .catch((error) => {
        setLoad(false);
        console.log(error);
      });
  };
  const fetchUserLevel = () => {
    setLoad(true);
    axios
      .get(`${endpointsV2.userManagement.userLevelList}`, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setLoad(false);
          setUserLevelList(result?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoad(false);
      });
  };
  const fetchUserName = (branch, userLevel) => {
    setLoad(true);
    axiosInstance
      .get(
        `${endpoints?.signature?.getErpList}?session_year=${selectedAcademicYear?.id}&branch_id=${branch}&user_level=${userLevel}`
      )
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setLoad(false);
          setUserNameList(result?.data?.data);
        }
      })
      .catch((error) => {
        setLoad(false);
        console.log(error);
      });
  };

  const fetchTableData = () => {
    const params = {
      acad_sess: acadSession,
      role: userLevel,
      name: userName,
    };

    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value != undefined && value != null) {
        acc[key] = value;
      }
      return acc;
    }, {});
    setLoad(true);
    axiosInstance
      .get(
        `${endpointsV2?.assignVideoObservation?.videoReview}?page=${refferListPageData.currentPage}`,
        {
          params: filteredParams,
        }
      )
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setRefferListPageData({
            ...refferListPageData,
            totalCount: result?.data?.result?.count,
            totalPage: Math.ceil(
              result?.data?.result?.count / refferListPageData.pageSize
            ),
          });
          setLoad(false);
          setTableData(result?.data?.result?.results);
        }
      })
      .catch((error) => {
        setLoad(false);
        console.log(error);
      });
  };

  const copyReport = () => {
    if (inputRef.current) {
      inputRef.current.value = 'hello';
      inputRef.current.select();

      try {
        document.execCommand('copy');
        message.success('success', 'Report copied!');
      } catch (err) {
        console.error('Unable to copy text: ', err);
        message.error('error', `Unable to copy text, ${err}`);
      }
    }
  };

  const BranchListOptions = branchList?.map((each) => (
    <Select.Option
      key={each?.branch?.id}
      value={JSON.stringify({ value: each?.branch?.id, acad_session: each?.id })}
      acad_session={each?.id}
    >
      {each?.branch?.branch_name}
    </Select.Option>
  ));

  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });

  const userNameListOption = userNameList?.map((each) => (
    <Select.Option key={each?.id} value={each?.name}>
      {each?.name}
    </Select.Option>
  ));

  const handleDelete = (id) => {
    const recordId = id;
    const baseUrl = endpointsV2?.assignVideoObservation?.videoReview.replace(/\/$/, '');
    const url = `${baseUrl.split('/video-review')[0]}/${recordId}/video-review/`;
    axiosInstance
      .delete(url)
      .then((res) => {
        fetchTableData();
        message.success('Deleted Successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBranch = (e) => {
    if (e) {
      const value = JSON.parse(e);
      setBranch(value?.value);
      setAcadSession(value?.acad_session);
    } else {
      setBranch(null);
      setUserLevel(null);
      setUserNameList([]);
      setUserName(null);
      formRef.current.setFieldsValue({
        user_name: null,
      });
      setTableData([]);
    }
  };

  const handleUserLevel = (e) => {
    if (e && e?.length != 0) {
      setUserLevel(e);
      if (branch) {
        fetchUserName(branch, e);
      }
    } else {
      setUserLevel(null);
      setUserNameList([]);
      setUserName(null);
      formRef.current.setFieldsValue({
        user_name: null,
      });
      setTableData([]);
    }
  };

  const handleUserName = (e) => {
    if (e) {
      setUserName(e);
    } else {
      setUserName(null);
    }
  };

  const handleFilter = () => {
    if (branch == null) {
      return message.error('Please Select All The Filters');
    } else {
      fetchTableData();
      setRefferListPageData({
        ...refferListPageData,
        currentPage: 1,
      });
    }
  };

  const handleCopy = (record) => {
    const parsedDate = new Date(record?.created_at);

    const formattedDate = parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const copiedText = `Date - ${formattedDate}\n\n${record?.name?.user_name} / ${record?.name?.user_role}\n\nVideo Link: ${record?.video_link}\n\nObserver Name: ${record?.observer?.first_name} ${record?.observer?.last_name} (${record?.observer?.role?.role_name})`;

    navigator.clipboard
      .writeText(copiedText)
      .then(() => {
        message.success('Text copied to clipboard:');
      })
      .catch((error) => {
        message.error('Error copying text:', error);
      });
  };

  useEffect(() => {
    getBranches();
    fetchUserLevel();
  }, []);

  useEffect(() => {
    fetchTableData();
  }, [refferListPageData.currentPage]);

  return (
    <div className='row py-3 px-2'>
      <Layout>
        <div className='row pt-3 pb-3'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-black-1 th-16 th-grey'>
                Assign Video Observation
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 shadow-sm'>
              <div>
                <Form ref={formRef} className='d-flex align-items-center' direction='row'>
                  <div className='col-md-2'>
                    <span className='th-grey th-14'>Branch*</span>
                    <Form.Item name='branch'>
                      <Select
                        allowClear
                        placeholder='Select Branch'
                        showSearch
                        optionFilterProp='children'
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        className='w-100 text-left th-black-1 th-bg-white th-br-4'
                        getPopupContainer={(trigger) => trigger.parentNode}
                        onChange={(e) => handleBranch(e)}
                      >
                        {BranchListOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-md-2'>
                    <span className='th-grey th-14'>Level*</span>
                    <Form.Item name='role'>
                      <Select
                        allowClear
                        placeholder='Select User Level'
                        suffixIcon={<DownOutlined className='th-grey' />}
                        showSearch
                        optionFilterProp='children'
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        className='w-100 text-left th-black-1 th-bg-white th-br-4'
                        onChange={(e) => handleUserLevel(e)}
                        getPopupContainer={(trigger) => trigger.parentNode}
                      >
                        {userLevelListOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-md-2'>
                    <span className='th-grey th-14'>Name</span>
                    <Form.Item name='user_name'>
                      <Select
                        allowClear
                        placeholder='Select User Name'
                        showSearch
                        optionFilterProp='children'
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        className='w-100 text-left th-black-1 th-bg-white th-br-4'
                        getPopupContainer={(trigger) => trigger.parentNode}
                        onChange={(e) => handleUserName(e)}
                      >
                        {userNameListOption}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-md-2 mt-2'>
                    <Button
                      type='primary'
                      className='Buttons'
                      onClick={() => handleFilter()}
                      class='mt-3'
                    >
                      Filter
                    </Button>
                  </div>
                  <div className='col-md-3 mt-2'>
                    <Button
                      type='primary'
                      className='Buttons'
                      onClick={() => history.push('/add-video-observation')}
                      class='mt-3'
                    >
                      Add Video Observation
                    </Button>
                  </div>
                </Form>
                <div className='table'>
                  <span className='border p-1' style={{ borderColor: '#d9d9d9' }}>
                    <InfoCircleTwoTone className='pr-2' />
                    <i className='th-grey'>Please Select Branch And Role For User Name</i>
                  </span>
                  <Table
                    dataSource={tableData}
                    columns={columns}
                    className='text-center mt-2'
                    pagination={false}
                  />
                </div>
                {tableData?.length > 0 && (
                  <div className='text-center mt-2'>
                    <Pagination
                      current={refferListPageData.currentPage}
                      total={refferListPageData.totalCount}
                      pageSize={refferListPageData.pageSize}
                      onChange={(value) =>
                        setRefferListPageData({
                          ...refferListPageData,
                          currentPage: value,
                        })
                      }
                      showSizeChanger={false}
                      showQuickJumper={false}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {load && <Loader />}
      </Layout>
    </div>
  );
};

export default VideoObservation;
