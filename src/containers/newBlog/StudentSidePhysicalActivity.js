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
  FundViewOutlined,
  PieChartOutlined,
  SnippetsOutlined,
  EyeOutlined,
  CaretRightOutlined,
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
  Input,
  Spin,
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
  const playerRef = useRef(null);
  const [activityListData, setActivityListData] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(false);
  const [mediaFiles, setMediaFiles] = useState({});
  const [showBMIModal, setShowBMIModal] = useState(false);
  const [studentBMIData, setStudentBMIData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [customRatingReview, setCustomRatingReview] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);
  const [overallData, setOverAllData] = useState([]);
  const [totalCountAssigned, setTotalCountAssigned] = useState(0);
  const [currentPageAssigned, setCurrentPageAssigned] = useState(1);
  const [limitAssigned, setLimitAssigned] = useState(10);
  const [totalPagesAssigned, setTotalPagesAssigned] = useState(0);
  const [isRoundAvailable, setIsRoundAvailable] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [playVideo, setPlayVideo] = useState(true);

  const handleCloseViewMore = () => {
    // playerRef.current.seekTo(0);
    setShowDrawer(false);
    // setPlayVideo(false);
    setSelectedActivity(null);
  };

  const handleCloseSideViewMore = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
    setShowSideDrawer(false);
    setSelectedActivity(null);
    setMediaFiles({});
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
        setLoading(false);
      });
  };

  const isJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  let funRemarks = (obj) => {
    try {
      if (isJSON(obj?.remarks)) {
        return JSON.parse(obj?.remarks).filter((item) => item?.status == true)[0].name;
      } else {
        return obj?.remarks.toString();
      }
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    fetchStudentActivityList({
      user_id: userIdLocal?.id,
      activity_type: activityDetails?.id.join(','),
      activity_detail_id: 'null',
      is_reviewed: 'True',
      is_submitted: 'True',
      page: currentPageAssigned,
      page_size: limitAssigned,
    });
  }, [currentPageAssigned]);

  const handleShowReview = async (data) => {
    setIsRoundAvailable(data?.is_round_available);
    getRatingView(data?.id, data?.is_round_available);
    fetchMedia(data?.id);
    // if(isvalue){
    //   setShowDrawer(true);
    //   setShowSideDrawer(false);
    // }else {
    //   setShowDrawer(false);
    //   setShowSideDrawer(true);
    // }
    //setSelectedActivity(data);
  };
  const handleViewBMIModal = (data) => {
    fetchBMIData(data?.id);
  };

  let array = [];
  const getRatingView = (id, is_round_available) => {
    axios
      .get(
        `${
          endpoints.newBlog.studentReviewss
        }?booking_detail_id=${id}&response_is_change=${true}&is_round_available=${is_round_available}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        response.data.map((obj) => {
          let temp = {};
          temp['id'] = obj.id;
          temp['name'] = obj.level.name;
          if (is_round_available) {
            temp['remarks'] = obj.remarks;
          } else {
            temp['remarks'] = JSON.parse(obj.remarks);
          }
          temp['given_rating'] = obj.given_rating;
          temp['level'] = obj?.level?.rating;
          array.push(temp);
        });
        setRatingReview(response.data);
        fetchMedia(response.data?.id);
        if (is_round_available) {
          setShowDrawer(true);
        } else {
          setShowSideDrawer(true);
        }
        setSelectedActivity(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
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
      .catch((error) => {});
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
    //   title: <span className='th-white th-fw-700'>Overall Score</span>,
    //   dataIndex: 'creator',
    //   align: 'center',
    //   render: (text, row) => (
    //     <span className='th-black-1'> {row?.user_reviews?.remarks}</span>
    //   ),
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
  const columnsBMI = [
    {
      title: <span className='th-white th-fw-700 '>Height(in cm)</span>,
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

  useEffect(() => {
    if (ratingReview.length > 0) {
      transformTable(ratingReview);
    }
  }, [ratingReview]);

  let rounds;
  function transformTable(arr) {
    let headersData = arr
      .filter((item) => item?.name !== 'Overall')
      .map((item) => item)
      .reduce((acc, curr) => {
        let obj = acc.find((item) => item?.name === curr?.name);
        if (obj) {
          return acc;
        } else {
          return acc.concat([curr]);
        }
      }, []);

    let overValueAllData = arr
      .filter((item) => item?.name?.toLowerCase() === 'overall')
      .map((item) => item);
    setOverAllData(overValueAllData);
    setTableHeader(headersData);

    rounds = arr
      .filter((item) => item.name !== 'Overall')
      .reduce((initial, data) => {
        let key = data.level;
        if (!initial[key]) {
          initial[key] = [];
        }
        initial[key].push(data);
        return initial;
      }, {});
    setCustomRatingReview(rounds);
  }
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
                  pagination={{
                    total: totalCountAssigned,
                    current: Number(currentPageAssigned),
                    pageSize: limitAssigned,
                    showSizeChanger: false,
                    onChange: (e) => {
                      handlePaginationAssign(e);
                    },
                  }}
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
                <div
                  className='col-12 th-primary d-flex align-item-center px-0  justify-content-end'
                  style={{ alignItems: 'center' }}
                >
                  <span className='th-14 th-black pr-2'>Index : </span>
                  <Button
                    icon={<EyeOutlined />}
                    type='primary'
                    onClick={() => setVisible(true)}
                  >
                    Click Here To Check BMI Chart
                  </Button>
                </div>
                <Modal
                  title='BMI Chart'
                  centered
                  visible={visible}
                  open={visible}
                  footer={false}
                  onCancel={() => setVisible(false)}
                  width={1000}
                >
                  <img
                    src={BMIDetailsImage}
                    style={{
                      height: '100%',
                      width: '100%',
                      objectFit: '-webkit-fill-available',
                    }}
                  />
                </Modal>
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
            title={<span className='th-fw-500'>Your Review</span>}
            placement='right'
            onClose={handleCloseSideViewMore}
            zIndex={1300}
            visible={showSideDrawer}
            width={
              window.innerWidth < 600 ? '95vw' : mediaFiles?.s3_path ? '70vw' : '35vw'
            }
            closable={false}
            className='th-resources-drawer'
            extra={
              <Space>
                <CloseOutlined onClick={handleCloseSideViewMore} />
              </Space>
            }
          >
            <div>
              <div className='row'>
                {loadingMedia ? (
                  <div className='col-8 text-center mt-5'>
                    <Spin tip='Loading...' size='large' />
                  </div>
                ) : (
                  <div className={mediaFiles?.s3_path ? 'col-md-8' : 'd-none'}>
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
                        // playing={playVideo}
                        ref={playerRef}
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
                )}
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
                          {ratingReview?.map((obj, index) => {
                            return (
                              <div className='row py-1 align-items-center'>
                                <div className='col-6 pl-1' key={index}>
                                  {obj?.level?.name}
                                </div>
                                <div className='col-6 pr-1'>
                                  {!isRoundAvailable ? (
                                    <Input
                                      disabled
                                      title={funRemarks(obj)}
                                      value={funRemarks(obj)}
                                    />
                                  ) : (
                                    <div></div>
                                  )}
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
            </div>
          </Drawer>
          <Modal
            centered
            visible={showDrawer}
            onCancel={handleCloseViewMore}
            footer={false}
            width={1000}
            className='th-upload-modal'
            title={`Submit Review`}
          >
            <div className='col-12 p-2 d-flex align-items-center justify-content-between'>
              <div className='d-flex align-items-center pr-1'>
                <Avatar
                  size={50}
                  aria-label='recipe'
                  icon={
                    <UserOutlined
                      color='#F3F3F3'
                      style={{ color: '#F3F3F3' }}
                      twoToneColor='white'
                    />
                  }
                />
                <div className='text-left ml-3'>
                  <div className=' th-fw-600 th-16'>
                    {selectedActivity?.booked_user?.name}
                  </div>
                  <div className=' th-fw-500 th-14'>{selectedActivity?.branch?.name}</div>
                  <div className=' th-fw-500 th-12'>{selectedActivity?.grade?.name}</div>
                </div>
              </div>

              <div className='pr-1'>
                <img
                  src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                  alt='image'
                  style={{
                    height: 60,
                    width: 150,
                    objectFit: 'fill',
                  }}
                />
              </div>
            </div>
            <div className='col-12 d-flex justify-content-center align-items-center, p-2'>
              <table className='w-100' style={{ background: '#eee' }}>
                <thead>
                  <tr
                    style={{ background: '#4800c9', textAlign: 'center', color: 'white' }}
                  >
                    <th> Rounds </th>
                    {tableHeader?.map((item, i) => (
                      <th>{item?.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(customRatingReview)?.length > 0 &&
                    Object.keys(customRatingReview).map((item, index) => (
                      <tr className='th-html-table'>
                        <td
                          style={{ fontWeight: 500, padding: '2px', textAlign: 'center' }}
                        >
                          {item}
                        </td>
                        {tableHeader?.map((each, i) => {
                          let remarks = customRatingReview[item].filter(
                            (round) => round.name === each.name
                          )[0].remarks;
                          return (
                            <td style={{ padding: '5px' }}>
                              <div className='text-center'>{remarks}</div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className='col-12 px-0'>
              <div className='p-2 d-flex justify-content-start'>
                {overallData.length > 0 &&
                  overallData.map((item, index) => {
                    return (
                      <div className='col-6 pl-4 p-2 d-flex align-items-center justify-content-start'>
                        <span
                          style={{
                            fontWeight: 500,
                            marginRight: '5px',
                            fontSize: '15px',
                          }}
                        >
                          Overall {<CaretRightOutlined />}
                        </span>
                        <div
                          className='text-center'
                          style={{ fontSize: '15px', fontWeight: 600, color: 'blue' }}
                        >
                          {/* <Tag color='green'> */}
                          {item?.remarks}
                          {/* </Tag> */}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Modal>
        </div>
      </Layout>
    </div>
  );
};
export default StudentSidePhysicalActivity;
