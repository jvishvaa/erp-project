import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import Layout from 'containers/Layout';
import endpoints from '../../config/endpoints';
import { CloseOutlined, PieChartOutlined } from '@ant-design/icons';
import { Breadcrumb, Table, Tag, Drawer, Space } from 'antd';
import moment from 'moment';

const StudentSidePublicSpeaking = () => {
  const userIdLocal = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [publicSpeakingList, setPublicSpeakingList] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(false);
  const [permissionState, setPermissionState] = useState('');
  const [mediaFiles, setMediaFiles] = useState(null);
  const [totalCountAssigned, setTotalCountAssigned] = useState(0);
  const [currentPageAssigned, setCurrentPageAssigned] = useState(1);
  const [totalPagesAssigned, setTotalPagesAssigned] = useState(0);
  const [limitAssigned, setLimitAssigned] = useState(10);
  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedActivity(null);
    setMediaFiles(null);
  };
  const fetchPublicSpeakingList = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.studentPublicSpeakingApi}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        console.log('response', response);
        if (response?.data?.status_code === 200) {
          setTotalCountAssigned(response?.data?.total);
          setTotalPagesAssigned(response?.data?.page_size);
          setCurrentPageAssigned(response?.data?.page);
          setLimitAssigned(Number(limitAssigned));

          setPublicSpeakingList(response?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPublicSpeakingList({
      user_id: userIdLocal?.id,
      // page: currentPageAssigned,
      // page_size: limitAssigned
    });
  }, []);
  const handleShowReview = (data) => {
    let rating = JSON.parse(data?.grading?.grade_scheme_markings);
    fetchMedia({ asset_id: data?.asset?.id });
    setPermissionState(data?.state);
    setShowDrawer(true);
    setSelectedActivity(rating);
  };

  const fetchMedia = (params = {}) => {
    axios
      .get(`${endpoints.newBlog.studentPSContentApi}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.data?.status_code === 200) {
          setMediaFiles(response?.data?.result);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const columns = [
    {
      title: <span className='th-white th-fw-700'>SL No.</span>,
      align: 'center',
      render: (text, row, index) => <span className='th-black-1'>{index + 1}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Title</span>,
      align: 'center',
      render: (text, row, index) => (
        <span className='th-black-1'>{row?.group?.activity?.name}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Submitted On</span>,
      dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>
          {moment(row?.scheduled_time).format('DD-MM-YYYY')}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      dataIndex: '',
      align: 'center',
      width: '25%',
      render: (text, row) => (
        <div className='th-black-1 d-flex justify-content-around'>
          <Tag
            icon={<PieChartOutlined className='th-14' />}
            color='geekblue'
            className='th-br-5 th-pointer py-1'
            onClick={() => handleShowReview(row)}
          >
            <span className='th-fw-500 th-14'>Check Review</span>
          </Tag>
        </div>
      ),
    },
  ];
  const columnMarks = [
    {
      title: <span className='th-white pl-sm-0 pl-4 th-fw-600 '>Criteria</span>,
      align: 'left',
      render: (text, row) => {
        return row.criterion;
      },
    },
    {
      title: <span className='th-white th-fw-600'>Remarks</span>,
      align: 'center',
      render: (text, row) => row?.levels?.filter((item) => item.status == true)[0].name,
    },
  ];

  const handlePaginationAssign = (page) => {
    setCurrentPageAssigned(page);
  };

  return (
    <div>
      <Layout>
        <div className='px-3'>
          <div className='row align-items-center'>
            <div className='col-md-6 pl-2'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item
                  onClick={() => history.goBack()}
                  className='th-grey th-pointer th-16'
                >
                  Activities Management
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-black th-16'>
                  Public Speaking
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className='col-12 mt-3  th-br-5 py-3 th-bg-white'>
            <div className='row '>
              <div className='col-12 px-0'>
                <Table
                  columns={columns}
                  dataSource={publicSpeakingList}
                  className='th-table'
                  rowClassName={(record, index) =>
                    `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                  }
                  loading={loading}
                  pagination={false}
                  // pagination={{
                  //   total: totalCountAssigned,
                  //   current: Number(currentPageAssigned),
                  //   pageSize: limitAssigned,
                  //   showSizeChanger: false,
                  //   onChange: (e) => {
                  //     handlePaginationAssign(e);
                  //   },
                  // }}
                  scroll={{
                    x: window.innerWidth > 600 ? '100%' : 'max-content',
                    // y: 600,
                  }}
                />
              </div>
            </div>
          </div>

          <Drawer
            title={<span className='th-fw-500'>Check Review</span>}
            placement='right'
            onClose={handleCloseDrawer}
            zIndex={1300}
            destroyOnClose={true}
            visible={showDrawer}
            width={
              window.innerWidth < 600 ? '95vw' : mediaFiles?.signed_URL ? '70vw' : '35vw'
            }
            closable={false}
            className='th-activity-drawer'
            extra={
              <Space>
                <CloseOutlined onClick={handleCloseDrawer} />
              </Space>
            }
          >
            <div>
              <div className='row'>
                <div className={mediaFiles?.signed_URL ? 'col-md-7' : 'd-none'}>
                  <video
                    src={mediaFiles?.signed_URL}
                    controls
                    alt={'image'}
                    width='100%'
                    height='95%'
                  />
                </div>
                {permissionState === 'graded' ? (
                  <div
                    className={`${
                      mediaFiles?.signed_URL ? 'col-md-5' : 'col-12'
                    } px-0 th-bg-white`}
                  >
                    <div className='row'>
                      <div className='col-12 px-1'>
                        <div className='mt-3'>
                          <div className='th-fw-500 th-16 mb-2'>Remarks</div>
                          <div
                            className='px-1 py-2 th-br-5'
                            style={{ outline: '1px solid #d9d9d9' }}
                          >
                            <Table
                              className='th-table'
                              columns={columnMarks}
                              loading={loading}
                              dataSource={selectedActivity}
                              pagination={false}
                              rowClassName={(record, index) =>
                                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                              }
                              scroll={{ x: 'max-content' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='col-md-5 d-flex justify-content-center align-items-center h4'> No Remarks Found</div>
                )}
              </div>
            </div>
          </Drawer>
        </div>
      </Layout>
    </div>
  );
};
export default StudentSidePublicSpeaking;
