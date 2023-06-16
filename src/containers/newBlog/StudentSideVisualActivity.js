import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import Layout from 'containers/Layout';
import './styles.scss';
import endpoints from '../../config/endpoints';
import {
  CloseOutlined,
  UserOutlined,
  PlayCircleOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

import {
  Breadcrumb,
  Table,
  Tag,
  Avatar,
  Tooltip,
  Drawer,
  Input,
  Space,
  Button,
  Spin,
} from 'antd';

import moment from 'moment';
import ReactPlayer from 'react-player';

const StudentSideVisualActivity = () => {
  const userIdLocal = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  const history = useHistory();
  const playerRef = useRef(null);
  const activityDetails = history?.location?.state?.activity;
  const [loading, setLoading] = useState(false);
  const [ratingReview, setRatingReview] = useState([]);

  const [activityListData, setActivityListData] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(false);
  const [mediaFiles, setMediaFiles] = useState({});
  const [totalCountAssigned, setTotalCountAssigned] = useState(0);
  const [currentPageAssigned, setCurrentPageAssigned] = useState(1);
  const [limitAssigned, setLimitAssigned] = useState(10);
  const [totalPagesAssigned, setTotalPagesAssigned] = useState(0);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [playVideo, setPlayVideo] = useState(true);
  const handleCloseViewMore = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
    setShowDrawer(false);
    // setPlayVideo(false);
    setSelectedActivity(null);
    setMediaFiles();
  };
  const fetchStudentActivityList = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.studentSideApi}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setActivityListData(response?.data?.result);
          setTotalCountAssigned(response?.data?.count);
          setTotalPagesAssigned(response?.data?.page_size);
          setCurrentPageAssigned(response?.data?.page);
          setLimitAssigned(Number(limitAssigned));
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudentActivityList({
      user_id: userIdLocal?.id,
      activity_type: activityDetails?.id.join(','),
      activity_detail_id: 'null',
      is_reviewed: 'True',
      is_submitted: 'True',
      update: 'True',
      page: currentPageAssigned,
      page_size: limitAssigned,
    });
  }, [currentPageAssigned]);
  const handleShowReview = (data) => {
    setShowDrawer(true);
    getRatingView(data?.id);
    fetchMedia(data?.id);
    setSelectedActivity(data);
  };
  let array = [];
  const getRatingView = (id) => {
    axios
      .get(`${endpoints.newBlog.studentReviewss}?booking_detail_id=${id}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        response.data.map((obj) => {
          let temp = {};
          temp['id'] = obj.id;
          temp['name'] = obj.level.name;
          temp['remarks'] = JSON.parse(obj.remarks);
          temp['given_rating'] = obj.given_rating;
          temp['level'] = obj?.level?.rating;
          array.push(temp);
        });
        setRatingReview(array);
      });
  };

  const fetchMedia = (id) => {
    setLoadingMedia(true);
    axios
      .get(`${endpoints.newBlog.showVisualMedia}${id}/`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.data?.status_code === 200) {
          setMediaFiles(response?.data?.result);
        }
      })
      .finally(() => {
        setLoadingMedia(false);
      });
  };

  const handlePaginationAssign = (page) => {
    setCurrentPageAssigned(page);
  };
  const columns = [
    {
      title: <span className='th-white th-fw-700'>SL No.</span>,
      align: 'center',
      render: (text, row, index) => (
        <span className='th-black-1'>{index + 1 + (currentPageAssigned - 1) * 10}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Topic Name</span>,
      align: 'center',
      render: (text, row, index) => (
        <span className='th-black-1'>{row?.activity_detail?.title}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Submitted On</span>,
      dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>
          {moment(row?.submitted_on).format('DD-MM-YYYY')}
        </span>
      ),
    },
    // {
    //   title: <span className='th-white th-fw-700'>Created By</span>,
    //   dataIndex: 'creator',
    //   align: 'center',
    //   render: (text, row) => <span className='th-black-1'> {row?.creator?.name}</span>,
    // },
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
  return (
    <div>
      <Layout>
        <div className='px-3'>
          <div className='row '>
            <div className='col-md-6 pl-2'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item
                  onClick={() => history.goBack()}
                  className='th-grey th-pointer th-16'
                >
                  Activities Management
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-black th-16'>
                  {activityDetails?.name}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className='col-12 mt-3  th-br-5 py-3 th-bg-white'>
            <div className='row '>
              <div className='col-12 px-0'>
                <Table
                  columns={columns}
                  dataSource={activityListData}
                  className='th-table'
                  rowClassName={(record, index) =>
                    `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                  }
                  loading={loading}
                  pagination={{
                    total: totalCountAssigned,
                    current: Number(currentPageAssigned),
                    pageSize: limitAssigned,
                    showSizeChanger: false,
                    onChange: (e) => {
                      console.log('Paggination', e);
                      handlePaginationAssign(e);
                    },
                  }}
                  scroll={{
                    x: activityListData.length > 0 ? 'max-content' : null,
                    y: 600,
                  }}
                />
              </div>
            </div>
          </div>
          <Drawer
            title={<span className='th-fw-500'>Your Review</span>}
            placement='right'
            onClose={handleCloseViewMore}
            zIndex={1300}
            visible={showDrawer}
            width={window.innerWidth < 600 ? '95vw' : '55vw'}
            closable={false}
            className='th-activity-drawer'
            extra={
              <Space>
                <CloseOutlined onClick={handleCloseViewMore} />
              </Space>
            }
          >
            <div>
              {loadingMedia ? (
                <div className='row'>
                  <div className='col-12 text-center py-5'>
                    <Spin size='large' tip='Loading...' />
                  </div>
                </div>
              ) : (
                <div className='row'>
                  <div className={mediaFiles?.s3_path ? 'col-12' : 'd-none'}>
                    {mediaFiles?.file_type === 'image/jpeg' ||
                    mediaFiles?.file_type === 'image/png' ? (
                      <img
                        src={mediaFiles?.s3_path}
                        thumb={mediaFiles?.s3_path}
                        alt={'image'}
                        width='100%'
                        loading='lazy'
                      />
                    ) : (
                      <ReactPlayer
                        url={mediaFiles?.s3_path}
                        thumb={mediaFiles?.s3_path}
                        // key={index}
                        // playing={playVideo}
                        ref={playerRef}
                        width='100%'
                        height='60vh'
                        playIcon={
                          <Tooltip title='play'>
                            <Button
                              style={{
                                background: 'transparent',
                                border: 'none',
                                height: '30vh',
                                width: '30vw',
                              }}
                              shape='circle'
                              icon={
                                <PlayCircleOutlined
                                  style={{ color: 'white', fontSize: '70px' }}
                                />
                              }
                            />
                          </Tooltip>
                        }
                        alt={'video'}
                        controls={true}
                      />
                    )}
                  </div>

                  <div className={`col-12 th-bg-white`}>
                    <div className='row mt-3'>
                      <div className='col-12 px-1'>
                        <div className='d-flex justify-content-between'>
                          <div className='d-flex align-items-center pr-1'>
                            <Avatar
                              size={50}
                              aria-label='recipe'
                              icon={
                                <UserOutlined
                                  color='#f3f3f3'
                                  style={{ color: '#f3f3f3' }}
                                  twoToneColor='white'
                                />
                              }
                            />
                            <div className='text-left ml-3'>
                              <div className=' th-fw-600 th-16'>
                                {selectedActivity?.booked_user?.name}
                              </div>
                              <div className=' th-fw-500 th-14'>
                                {selectedActivity?.branch?.name}
                              </div>
                              <div className=' th-fw-500 th-12'>
                                {selectedActivity?.grade?.name}
                              </div>
                            </div>
                          </div>
                          <div>
                            <img
                              src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                              alt='image'
                              style={{
                                height: 100,
                                objectFit: 'fill',
                              }}
                            />
                          </div>
                        </div>

                        <div
                          className='p-2 mt-3 th-br-5 th-bg-grey'
                          style={{ outline: '1px solid #d9d9d9' }}
                        >
                          <div>
                            Title :{' '}
                            <span className='th-fw-600'>
                              {selectedActivity?.activity_detail?.title}
                            </span>
                          </div>
                          <div>
                            Instructions :{' '}
                            <span className='th-fw-400'>
                              {selectedActivity?.activity_detail?.description}
                            </span>
                          </div>
                        </div>
                        <div className='mt-3'>
                          <div className='th-fw-500 th-16 mb-2'>Remarks</div>
                          <div className='row align-items-center text-center pb-2 th-fw-600'>
                            <div className='col-6'>Questions</div>
                            <div className='col-6'>Options</div>
                          </div>
                          <div
                            className='px-1 py-2 th-br-5'
                            style={{ outline: '1px solid #d9d9d9' }}
                          >
                            {ratingReview?.map((obj, index) => {
                              return (
                                <div
                                  className='row py-1 text-justify text-center'
                                  style={{
                                    borderBottom:
                                      index == ratingReview.length - 1
                                        ? null
                                        : '1px solid #d9d9d9',
                                  }}
                                >
                                  <div className='col-6 ' key={index}>
                                    {obj?.name}
                                  </div>
                                  <div className='col-6'>
                                    <div
                                      className='th-bg-grey p-2'
                                      title={
                                        obj?.remarks.filter(
                                          (item) => item.status == true
                                        )[0].name
                                      }
                                    >
                                      {
                                        obj?.remarks.filter(
                                          (item) => item.status == true
                                        )[0].name
                                      }
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Drawer>
        </div>
      </Layout>
    </div>
  );
};
export default StudentSideVisualActivity;
