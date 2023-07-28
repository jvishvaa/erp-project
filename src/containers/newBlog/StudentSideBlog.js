import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.scss';
import Layout from 'containers/Layout';
import './images.css';
import './styles.scss';
import endpoints from '../../config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import moment from 'moment';
import {
  Breadcrumb,
  Button,
  Tabs,
  Rate,
  Drawer,
  Space,
  Input,
  Avatar,
  Spin,
  Pagination,
} from 'antd';
import { SketchOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const { TabPane } = Tabs;

const StudentSideBlog = () => {
  const history = useHistory();
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const UserData = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  const [imageData, setImageData] = useState('');
  const [tabValue, setTabValue] = useState('0');
  const [loading, setLoading] = useState(true);
  const [blogsList, setBlogsList] = useState([]);
  const [showBlogDetailsDrawer, setShowBlogDetailsDrawer] = useState(false);
  const [blogDrawerData, setBlogDrawerData] = useState(null);
  const [ratingReview, setRatingReview] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const activityId = localStorage.getItem('BlogActivityId')
    ? JSON.parse(localStorage.getItem('BlogActivityId'))
    : {};

  const handleTab = (newValue) => {
    setBlogsList([]);
    setTabValue(newValue);
  };

  let array = [];
  const getRatingView = (data) => {
    axios
      .get(`${endpoints.newBlog.studentReviewss}?booking_detail_id=${data}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        response.data.map((obj, index) => {
          let temp = {};
          temp['id'] = obj?.id;
          temp['name'] = obj?.level.name;
          temp['remarks'] = obj?.remarks;
          temp['given_rating'] = obj?.given_rating;
          temp['level'] = obj?.level?.rating;
          array.push(temp);
        });
        setRatingReview(array);
      })
      .catch((err) => {});
  };

  const EditActivity = (blogData) => {
    history.push({
      pathname: '/blog/activityedit',
      state: {
        blogData,
      },
    });
  };

  const fetchBlogsList = (params = {}) => {
    setLoading(true);
    let url =
      tabValue == '0'
        ? `${endpoints.newBlog.unAssign}`
        : `${endpoints.newBlog.studentSideApi}`;
    axios
      .get(url, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setBlogsList(response?.data?.result);
          setTotalPages(
            response?.data?.total ? response?.data?.total : response?.data?.count
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const handleShowBlogDetailsDrawer = (blogData) => {
    setShowBlogDetailsDrawer(true);
    setImageData(JSON.parse(blogData?.template?.html_file));
    setBlogDrawerData(blogData);
    getRatingView(blogData?.id);
  };
  const showContent = () => {
    if (tabValue == '0') {
      return loading ? (
        <div className='d-flex w-100 py-5 justify-content-center align-items-center'>
          <Spin tip='Loading...' size='large' />
        </div>
      ) : blogsList.length > 0 ? (
        blogsList?.map((each) => (
          <>
            <div className='col-md-4 col-sm-6 mb-3'>
              <div className='row shadow-sm th-bg-grey th-br-5 wall_card'>
                <div className='col-12 py-2'>
                  <span className='th-16 th-fw-600'>{each?.title}</span>
                </div>
                <div className='col-12 py-1'>
                  <div className='d-flex justify-content-between th-12 th-primary'>
                    <div>
                      Assigned On : {moment(each?.issue_date).format('MMM Do, YYYY')}
                    </div>
                    <div>
                      Due Date : {moment(each?.submission_date).format('MMM Do, YYYY')}
                    </div>
                  </div>
                </div>
                <div
                  className={`col-12 py-2 ${
                    moment().diff(moment(each?.submission_date), 'hours') > 24
                      ? ''
                      : 'th-pointer'
                  }`}
                >
                  <img
                    src={each?.template?.template_path}
                    loading='lazy'
                    style={{
                      width: '100%',
                      height: '240px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <div className='col-12 py-2 text-center'>
                  {moment().diff(moment(each?.submission_date), 'hours') > 24 ? (
                    <Button type='dashed' danger style={{ cursor: 'text' }}>
                      Expired
                    </Button>
                  ) : (
                    <Button
                      onClick={() => EditActivity(each)}
                      className='th-button-active th-br-5 '
                    >
                      Start Writing
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        ))
      ) : (
        <div className='d-flex justify-content-center py-5 w-100'>
          <img src={NoDataIcon} />
        </div>
      );
    } else {
      return loading ? (
        <div className='d-flex w-100 py-5 justify-content-center align-items-center'>
          <Spin tip='Loading...' size='large' />
        </div>
      ) : blogsList.length > 0 ? (
        blogsList?.map((each) => (
          <div className='col-md-4 col-sm-6 mb-3'>
            <div
              className='row shadow-sm th-bg-grey th-br-5 wall_card'
              onClick={() => handleShowBlogDetailsDrawer(each)}
            >
              <div className='col-12 py-2'>
                <span className='th-16 th-fw-600'>{each?.activity_detail?.title}</span>
              </div>
              <div className='col-12 py-1'>
                <div className='d-flex justify-content-between th-12 th-primary'>
                  <div>
                    Assigned On :{' '}
                    {moment(each?.activity_detail?.issue_date).format('MMM Do, YYYY')}
                  </div>
                  <div>
                    Due Date :{' '}
                    {moment(each?.activity_detail?.submission_date).format(
                      'MMM Do, YYYY'
                    )}
                  </div>
                </div>
              </div>
              <div className='col-12 py-2 th-pointer'>
                <img
                  src={each?.template?.template_path}
                  loading='lazy'
                  style={{
                    width: '100%',
                    height: '240px',
                    objectFit: 'contain',
                  }}
                />
              </div>
              {/* <div className='col-12 py-2 '>
                {tabValue == '1' ? null : (
                  <Rate
                    disabled
                    allowHalf
                    value={each?.user_reviews?.given_rating}
                    count={Number(each?.user_reviews?.level?.rating)}
                  />
                )}
              </div> */}
            </div>
          </div>
        ))
      ) : (
        <div className='d-flex justify-content-center py-5 w-100'>
          <img src={NoDataIcon} />
        </div>
      );
    }
  };
  useEffect(() => {
    if (tabValue == '0') {
      fetchBlogsList({
        section_ids: 'null',
        user_id: UserData.id,
        is_draft: 'false',
        activity_type: activityId.join(','),
        page_size: 12,
        page: page,
      });
    } else if (tabValue == '1') {
      fetchBlogsList({
        section_ids: 'null',
        user_id: UserData.id,
        activity_detail_id: 'null',
        is_reviewed: 'False',
        is_submitted: 'True',
        activity_type: activityId.join(','),
        page_size: 12,
        page: page,
      });
    } else if (tabValue == '2') {
      fetchBlogsList({
        section_ids: 'null',
        user_id: UserData.id,
        activity_detail_id: 'null',
        is_reviewed: 'True',
        activity_type: activityId.join(','),
        page_size: 12,
        page: page,
      });
    } else if (tabValue == '3') {
      fetchBlogsList({
        section_ids: 'null',
        user_id: UserData.id,
        activity_detail_id: 'null',
        is_published: 'True',
        activity_type: activityId.join(','),
        page_size: 10,
        page: page,
      });
    }
  }, [tabValue, page]);

  useEffect(() => {
    setPage(1);
  }, [tabValue]);
  const handlePageChange = (page, pageSize) => {
    setPage(page);
  };

  let schoolDetails = JSON.parse(localStorage.getItem('schoolDetails'));
  const { school_logo } = schoolDetails;
  
  return (
    <div>
      <Layout>
        <div className='px-2'>
          <div className='row'>
            <div className='col-6' style={{ zIndex: 2 }}>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item href='/blog/wall/redirect' className='th-grey th-16'>
                  Activities Management
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-black-1 th-16'>
                  Blog Activity
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className='row pb-3 th-br-5'>
            <div className='col-12'>
              <div className='th-tabs th-bg-white'>
                <Tabs type='card' onChange={handleTab} defaultActiveKeys={tabValue}>
                  <TabPane tab='ASSIGNED' key='0'>
                    <div className='row pt-3'>{showContent()}</div>
                    <div className='d-flex justify-content-center py-2'>
                      <Pagination
                        defaultCurrent={page}
                        current={page}
                        total={totalPages}
                        defaultPageSize={12}
                        size='default'
                        showSizeChanger={false}
                        onChange={handlePageChange}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab='TOTAL SUBMITTED' key='1'>
                    <div className='row pt-3'>{showContent()}</div>
                    <div className='d-flex justify-content-center py-2'>
                      <Pagination
                        defaultCurrent={page}
                        current={page}
                        defaultPageSize={12}
                        total={totalPages}
                        showSizeChanger={false}
                        onChange={handlePageChange}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab='REVIEWED' key='2'>
                    <div className='row pt-3'>{showContent()}</div>
                    <div className='d-flex justify-content-center py-2'>
                      <Pagination
                        defaultCurrent={page}
                        current={page}
                        defaultPageSize={12}
                        total={totalPages}
                        showSizeChanger={false}
                        onChange={handlePageChange}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab='PUBLISHED' key='3'>
                    <div className='row pt-3'>{showContent()}</div>
                    <div className='d-flex justify-content-center py-2'>
                      <Pagination
                        defaultCurrent={page}
                        current={page}
                        defaultPageSize={10}
                        total={totalPages}
                        showSizeChanger={false}
                        onChange={handlePageChange}
                      />
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
          <div
            style={{ position: 'fixed', bottom: '5%', right: '2%' }}
            className='th-bg-primary th-white th-br-6 px-4 py-3 th-fw-600 th-pointer'
            onClick={() => history.push('/blog/wall')}
          >
            <span className='d-flex align-items-center'>
              <SketchOutlined size='small' className='mr-2' />
              School Wall
            </span>
          </div>
        </div>
        <Drawer
          placement='right'
          className='th-activity-drawer'
          zIndex={1300}
          title={<div className=''>Blog Details</div>}
          onClose={() => setShowBlogDetailsDrawer(false)}
          visible={showBlogDetailsDrawer}
          closable={false}
          extra={
            <Space>
              <CloseOutlined onClick={() => setShowBlogDetailsDrawer(false)} />
            </Space>
          }
          width={window.innerWidth < 768 ? '90vw' : '70vw'}
        >
          <div className='row'>
            <div className='col-7'>
              <div className='row th-br-8' style={{ outline: '2px solid #d9d9d9' }}>
                <div className='col-12 py-1'>
                  <img src={school_logo} width='130' alt='image' />
                </div>
                <div className='col-12 py-2'>
                  <div
                    style={{
                      backgroundImage: `url(${blogDrawerData?.template?.template_path})`,
                      height: '75vh',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div className=''>
                      <div
                        className='text-center th-white th-br-4 px-1 py-1'
                        style={{
                          background: `rgba(0,0,0,0.45)`,
                          maxWidth: `${imageData[0]?.width}px`,
                          maxHeight: `${imageData[0]?.height}px`,
                          overflowY: 'auto',
                        }}
                      >
                        <span className='p-2 th-12'>
                          {blogDrawerData?.submitted_work?.html_text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-5'>
              <div className='row justify-content-between'>
                <div className='col-12 py-2 px-0'>
                  <div className='d-flex align-items-center'>
                    <Avatar size={50} icon={<UserOutlined />} />
                    <div className='d-flex flex-column ml-2'>
                      <div
                        className='text-truncate th-black-1 th-fw-500'
                        title={blogDrawerData?.name}
                      >
                        {blogDrawerData?.name}
                      </div>
                      <div>
                        <span className='th-12 th-fw-500 th-black-2'>
                          {blogDrawerData?.branch?.name}
                        </span>
                      </div>
                      <div>
                        <span className='th-12 th-fw-500 th-black-2'>
                          {blogDrawerData?.section?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-12 px-0'>
                  <div
                    className='th-bg-grey py-3 px-2 th-br-8'
                    style={{ outline: '1px solid #d9d9d9' }}
                  >
                    <div className=' th-12 th-black-2'>
                      Title :{' '}
                      <span className='th-16 th-fw-500 th-black-1'>
                        {blogDrawerData?.activity_detail?.title}
                      </span>
                    </div>
                    <div
                      className='mt-2'
                      style={{ overflowY: 'auto', maxHeight: '25vh' }}
                    >
                      <span className='th-12 th-black-2'>Description :&nbsp;</span>
                      <span className='th-16 th-fw-400 th-black-1'>
                        {blogDrawerData?.activity_detail?.description}
                      </span>
                    </div>
                  </div>
                </div>
                {tabValue !== '1' && (
                  <div className='col-12 py-2 px-0'>
                    <div className='py-2 th-fw-600'>Review</div>
                    <div
                      className='p-2 th-bg-grey th-br-8'
                      style={{ outline: '1px solid #d9d9d9' }}
                    >
                      {ratingReview?.map((obj, index) => {
                        return (
                          <div key={index}>
                            <div className='row justify-content-between align-items-center'>
                              {' '}
                              <div className='th-fw-500'>{obj?.name}</div>
                              <Rate
                                disabled
                                defaultValue={obj?.given_rating}
                                count={parseInt(obj?.level)}
                              />
                            </div>
                            <div>
                              <Input
                                disabled
                                value={obj?.remarks}
                                className='th-bg-white th-black- w-100 th-br-5'
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Drawer>
      </Layout>
    </div>
  );
};
export default StudentSideBlog;
