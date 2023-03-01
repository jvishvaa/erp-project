import React, { useState, useEffect } from 'react';
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
  FundViewOutlined,
  PieChartOutlined,
  SnippetsOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Table,
  Tag,
  Avatar,
  Tooltip,
  Drawer,
  Modal,
  Space,
  Button,
  message,
} from 'antd';
import moment from 'moment';
import ReactPlayer from 'react-player';
import BMIDetailsImage from '../../assets/images/Body_Mass_Index.jpg';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';

const StudentSidePhysicalActivity = () => {
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const userIdLocal = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  const history = useHistory();
  const activityDetails = history?.location?.state?.activity;
  const [loading, setLoading] = useState(false);
  const [ratingReview, setRatingReview] = useState([]);

  const [activityListData, setActivityListData] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(false);
  const [mediaFiles, setMediaFiles] = useState(false);
  const [showBMIModal, setShowBMIModal] = useState(false);
  const [studentBMIData, setStudentBMIData] = useState([]);

  const handleCloseViewMore = () => {
    setShowDrawer(false);
    setSelectedActivity(null);
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
        console.log('response', response);
        if (response?.data?.status_code === 200) {
          setActivityListData(response?.data?.result);
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
    });
  }, []);
  const handleShowReview = (data) => {
    getRatingView(data?.id);
    fetchMedia(data?.id);
    setShowDrawer(true);
    setSelectedActivity(data);
  };
  const handleViewBMIModal = (data) => {
    fetchBMIData(data?.id);
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
          temp['remarks'] = obj.remarks;
          temp['given_rating'] = obj.given_rating;
          temp['level'] = obj?.level?.rating;
          array.push(temp);
        });
        setRatingReview(array);
      });
  };

  const fetchBMIData = () => {
    const params = {
      student_id: userIdLocal?.id,
    };
    axios
      .get(`${endpoints.newBlog.getStudentBMIApi}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.data?.status_code === 200) {
          setStudentBMIData(response?.data?.result);
          setShowBMIModal(true);
        } else {
          message.error('No BMI record found for the student');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const fetchMedia = (id) => {
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
      .catch((error) => {
        console.log('error', error);
      });
  };
  let roundsArray = [];
  const filterRound = (data) => {
    if (roundsArray.indexOf(data) !== -1) {
      return '';
    } else {
      roundsArray.push(data);
      return data;
    }
  };
  const columns = [
    {
      title: <span className='th-white th-fw-700'>SL No.</span>,
      align: 'center',
      render: (text, row, index) => <span className='th-black-1'>{index + 1}</span>,
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
    {
      title: <span className='th-white th-fw-700'>Overall Score</span>,
      dataIndex: 'creator',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'> {row?.user_reviews?.remarks}</span>
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
  const columnsBMI = [
    {
      title: <span className='th-white th-fw-700 '>Height(in meters)</span>,
      key: 'height',
      align: 'center',
      render: (text, row, index) => <span>{row?.bmi_details?.height}</span>,
    },
    {
      title: <span className='th-white th-fw-700 '>Weight(in kgs)</span>,
      key: 'weight',
      align: 'center',
      render: (text, row, index) => <span>{row?.bmi_details?.weight}</span>,
    },
    {
      title: <span className='th-white th-fw-700 '>Age</span>,
      key: 'age',
      align: 'center',
      render: (text, row, index) => <span>{row?.bmi_details?.age}</span>,
    },
    {
      title: <span className='th-white th-fw-700 '>BMI</span>,
      key: 'bmi',
      align: 'center',
      render: (text, row, index) => <span>{row?.bmi_details?.bmi}</span>,
    },
    {
      title: <span className='th-white th-fw-700 '>Remarks</span>,
      key: 'remarks',
      align: 'center',
      render: (text, row, index) => <span>{row?.bmi_details?.remarks}</span>,
    },
    {
      title: <span className='th-white th-fw-700 '>Date</span>,
      key: 'date',
      align: 'center',
      render: (text, row, index) => (
        <span>{moment(row?.bmi_details?.created_at).format('MMM Do YY')}</span>
      ),
    },
  ];

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
                  {activityDetails?.name}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className='col-md-6 text-right'>
              <Button
                className='th-button-active th-br-6 text-truncate th-pointer'
                icon={<FundViewOutlined />}
                onClick={handleViewBMIModal}
              >
                View BMI
              </Button>
            </div>
          </div>
          <div className='col-12 mt-3  th-br-5 py-3 th-bg-white'>
            <div className='row '>
              <div className='col-12 px-3'>
                <Table
                  columns={columns}
                  dataSource={activityListData}
                  className='th-table'
                  rowClassName={(record, index) =>
                    `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                  }
                  loading={loading}
                  pagination={false}
                  scroll={{
                    x: window.innerWidth > 600 ? '100%' : 'max-content',
                    // y: 600,
                  }}
                />
              </div>
            </div>
          </div>
          <Modal
            title='BMI Details'
            className='th-upload-modal'
            visible={showBMIModal}
            centered
            onOk={() => setShowBMIModal(false)}
            onCancel={() => setShowBMIModal(false)}
            width={'80vw'}
            footer={null}
            zIndex={1000}
          >
            <div className='row d-flex justify-content-end px-3 py-2'>
              <div className='col-md-4 px-0 col-12 d-flex justify-content-end'>
                <a
                  onClick={() => {
                    const fileName = BMIDetailsImage;
                    const fileSrc = BMIDetailsImage;
                    openPreview({
                      currentAttachmentIndex: 0,
                      attachmentsArray: [
                        {
                          src: fileSrc,
                          name: 'BMI Details',
                          extension:
                            '.' + fileName?.split('.')[fileName?.split('.')?.length - 1],
                        },
                      ],
                    });
                  }}
                >
                  <div
                    className=' px-0 col-12 th-primary d-flex'
                    style={{ alignItems: 'center' }}
                  >
                    <span className='th-14 th-black pr-2'>Index : </span>
                    <Tag className='th-14' icon={<EyeOutlined />} color='processing'>
                      Click Here To Check BMI Chart
                    </Tag>
                  </div>
                </a>
              </div>
            </div>
            <div className='row'>
              <div className='col-12' style={{ padding: '1rem 1rem' }}>
                <Table
                  className='th-table'
                  rowClassName={(record, index) =>
                    `th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                  }
                  pagination={false}
                  columns={columnsBMI}
                  dataSource={studentBMIData}
                />
              </div>
            </div>
          </Modal>
          <Drawer
            title={<span className='th-fw-500'>Check Review</span>}
            placement='right'
            onClose={handleCloseViewMore}
            zIndex={1300}
            visible={showDrawer}
            width={
              window.innerWidth < 600 ? '95vw' : mediaFiles?.s3_path ? '70vw' : '35vw'
            }
            closable={false}
            className='th-resources-drawer'
            extra={
              <Space>
                <CloseOutlined onClick={handleCloseViewMore} />
              </Space>
            }
          >
            <div>
              <div className='row'>
                <div className={mediaFiles?.s3_path ? 'col-md-8' : 'd-none'}>
                  {mediaFiles?.file_type === 'image/jpeg' ||
                  mediaFiles?.file_type === 'image/png' ? (
                    <img
                      src={mediaFiles?.s3_path}
                      thumb={mediaFiles?.s3_path}
                      alt={'image'}
                      width='100%'
                      height='95%'
                    />
                  ) : (
                    <ReactPlayer
                      url={mediaFiles?.s3_path}
                      thumb={mediaFiles?.s3_path}
                      // key={index}
                      width='100%'
                      height='100%'
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
                <div
                  className={`${
                    mediaFiles?.s3_path ? 'col-md-4' : 'col-12'
                  } px-0 th-bg-white`}
                >
                  <div className='row'>
                    <div className='col-12 px-1'>
                      <div>
                        <img
                          src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                          alt='image'
                          style={{
                            // width: '100%',
                            height: 130,
                            objectFit: 'fill',
                          }}
                        />
                      </div>
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
                        <div
                          className='px-1 py-2 th-br-5'
                          style={{ outline: '1px solid #d9d9d9' }}
                        >
                          {ratingReview.map(
                            (item, index) =>
                              item?.name !== 'Overall' && (
                                <>
                                  <div className='col-12 pl-1 th-fw-600'>
                                    {filterRound(item?.level)}
                                  </div>
                                  <div className='row py-2 my-2 th-bg-white align-items-center justify-content-around th-br-6'>
                                    <div className='col-12 '>
                                      <div className=' d-flex justify-content-between th-bg-grey p-2 th-br-6'>
                                        <div className='th-fw-500 mr-3'>{item?.name}</div>{' '}
                                        <div>{item?.remarks}</div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )
                          )}
                          {ratingReview
                            .filter((item) => item?.name == 'Overall')
                            .map((item) => (
                              <div className='row th-bg-white th-br-6'>
                                <div className='col-12 py-2 px-0'>
                                  <div
                                    className=' th-fw-600'
                                    style={{ borderBottom: '2px solid #d9d9d9' }}
                                  >
                                    Overall
                                  </div>
                                </div>
                                <div className='col-12 py-1 th-fw-600'>
                                  {item?.remarks}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Drawer>
        </div>
      </Layout>
    </div>
  );
};
export default StudentSidePhysicalActivity;
