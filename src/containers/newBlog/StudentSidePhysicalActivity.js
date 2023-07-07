import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import Layout from 'containers/Layout';
import './styles.scss';
import endpoints from '../../config/endpoints';
import { Switch } from '@material-ui/core';
import {
  CloseOutlined,
  UserOutlined,
  PlayCircleOutlined,
  FundViewOutlined,
  PieChartOutlined,
  DownOutlined,
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
  Form,
  Spin,
  Select,
  Tabs,
} from 'antd';
import moment from 'moment';
import ReactPlayer from 'react-player';
import BMIDetailsImage from '../../assets/images/Body_Mass_Index.jpg';

const { Option } = Select;
const { TabPane } = Tabs;

const StudentSidePhysicalActivity = () => {
  const formRef = useRef();
  const history = useHistory();
  const userIdLocal =
    JSON.parse(localStorage.getItem('ActivityManagement'))?.id ||
    history?.location?.state?.activity?.student_id;
  const activityDetails = history?.location?.state?.activity;
  const [loading, setLoading] = useState(false);
  const [ratingReview, setRatingReview] = useState([]);
  const playerRef = useRef(null);
  const [activityListData, setActivityListData] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(false);
  const [mediaFiles, setMediaFiles] = useState({});
  // const [showBMIModal, setShowBMIModal] = useState(false);
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
  const [loadingBMI, setLoadingBMI] = useState(false);
  const [playVideo, setPlayVideo] = useState(true);
  // const [physicalActivityToggle, setPhysicalActivityToggle] = useState(false);
  const [subActivityListData, setSubActivityListData] = useState([]);
  const [subActivityID, setSubActivityID] = useState();

  const [showActivityTab, setShowActivityTab] = useState('1');

  const onActivityTabChange = (key) => {
    setCurrentPageAssigned(1);
    setShowActivityTab(key);
    if (key === '3') {
      handleViewBMI();
    }
  };

  const handleCloseViewMore = () => {
    setShowDrawer(false);
    setSelectedActivity(null);
  };

  const handleCloseSideViewMore = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
    setShowSideDrawer(false);
    setMediaFiles({});
    setSelectedActivity(null);
  };

  const fetchStudentActivityList = (params = {}) => {
    setActivityListData([]);
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
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
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

  const handleShowReview = async (data) => {
    setLoadingMedia(true);
    setIsRoundAvailable(showActivityTab === '1' ? false : true);
    getRatingView(data?.id, showActivityTab === '1' ? false : true);
    fetchMedia(data?.id);
    setSelectedActivity(data);
  };
  const handleViewBMI = (data) => {
    setLoadingBMI(true);
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
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const fetchBMIData = () => {
    const params = {
      student_id: userIdLocal,
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
          // setShowBMIModal(true);
        } else {
          message.error('No BMI record found for the student');
        }
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => {
        setLoadingBMI(false);
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
      .finally(() => {
        setLoadingMedia(false);
      });
  };
  const fetchSubActivityListData = (params = {}) => {
    axios
      .get(`${endpoints.newBlog.subActivityListApi}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSubActivityListData(res?.data?.result);
          if (history?.location?.state?.activity?.activity_sub_type_name) {
            let subActivity = history?.location?.state?.activity?.activity_sub_type_name;
            let currentSubActivity = res?.data?.result.filter(
              (el) => el?.sub_type == subActivity
            );
            // if (currentSubActivity.length > 0) {
            //   setSubActivityID(currentSubActivity[0]?.id);
            //   formRef.current.setFieldsValue({
            //     sub_activity: subActivity,
            //   });
            // }
          }
          //  else {
          //   setSubActivityID(res?.data?.result[0]?.id);
          //   formRef.current.setFieldsValue({
          //     sub_activity: res?.data?.result[0]?.sub_type,
          //   });
          // }
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const columnsOld = [
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
            onClick={() => {
              if (showActivityTab === '2') {
                setShowDrawer(true);
              } else if (showActivityTab === '1') {
                setShowSideDrawer(true);
              }
              handleShowReview(row);
            }}
          >
            <span className='th-fw-500 th-14'>Check Review</span>
          </Tag>
        </div>
      ),
    },
  ];

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
    {
      title: <span className='th-white th-fw-700'>Criteria Name</span>,
      dataIndex: 'name',
      align: 'center',
      render: (text, row) => {
        let currentRemarks = row?.reviews_data?.filter((el) => el.name !== 'Overall')[0]
          ?.name;
        return (
          <div className='d-flex justify-content-center'>
            <div className='text-justify'>{currentRemarks ? currentRemarks : 'N/A'}</div>
          </div>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Attempt 1</span>,
      dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => {
        let currentRemarks = row?.reviews_data?.filter((el) => el.name !== 'Overall')[0]
          ?.remarks;
        return (
          <div className='d-flex justify-content-center'>
            <div className='text-justify'>{currentRemarks ? currentRemarks : 'N/A'}</div>
          </div>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Attempt 2</span>,
      dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => {
        let currentRemarks = row?.reviews_data?.filter((el) => el.name !== 'Overall')[1]
          ?.remarks;
        return (
          <div className='d-flex justify-content-center'>
            <div className='text-justify'>{currentRemarks ? currentRemarks : 'N/A'}</div>
          </div>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Attempt 3</span>,
      dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => {
        let currentRemarks = row?.reviews_data?.filter((el) => el.name !== 'Overall')[2]
          ?.remarks;
        return (
          <div className='d-flex justify-content-center'>
            <div className='text-justify'>{currentRemarks ? currentRemarks : 'N/A'}</div>
          </div>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Overall</span>,
      dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => {
        return (
          <div className='d-flex justify-content-center'>
            <div className='text-justify'>
              {row?.reviews_data?.filter((el) => el.name === 'Overall')[0]?.remarks}
            </div>
          </div>
        );
      },
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

  // const handlePhysicalActivityToggle = (event) => {
  //   setCurrentPageAssigned(1);
  //   setPhysicalActivityToggle(event.target.checked);
  // };

  const subActivityOption = subActivityListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.sub_type}
      </Option>
    );
  });

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
  const handleSubActivity = (e) => {
    setSubActivityID(e);
  };

  useEffect(() => {
    fetchSubActivityListData({
      type_id: activityDetails?.id?.toString(),
      is_type: true,
    });
    setSubActivityID(activityDetails?.id[0]);
  }, [window.location.hostname]);

  useEffect(() => {
    formRef.current.setFieldsValue({
      sub_activity: subActivityID ? subActivityID : activityDetails?.id[0],
      miniolympic_sub_activity: subActivityID ? subActivityID : activityDetails?.id[0],
    });

    if (subActivityID) {
      fetchStudentActivityList({
        user_id: userIdLocal,
        activity_type: subActivityID,
        activity_detail_id: 'null',
        is_reviewed: 'True',
        is_submitted: 'True',
        page: currentPageAssigned,
        page_size: limitAssigned,
        activity_name: 'Physical Activity',
        is_round_available: showActivityTab === '1' ? false : true,
      });
    }
  }, [currentPageAssigned, showActivityTab, subActivityID]);

  return (
    <div>
      <Layout>
        <div className='row pt-3 pb-3'>
          <div className='col-md-6 pl-2' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                onClick={() => history.push('/blog/wall/redirect')}
                className='th-grey th-pointer th-16'
              >
                Activities Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black th-16'>
                {activityDetails?.name}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          {/* <div className='col-md-6 text-right'>
            <Button
              className='th-button-active th-br-6 text-truncate th-pointer'
              icon={<FundViewOutlined />}
              loading={loadingBMI}
              onClick={handleViewBMI}
            >
              View BMI
            </Button>
          </div> */}
        </div>

        <div className='row mb-3'>
          <div className='col-12'>
            <div className='th-tabs th-bg-white'>
              <Tabs
                type='card'
                onChange={onActivityTabChange}
                activeKey={showActivityTab}
              >
                <TabPane tab='Sports Activities' key='1'>
                  <Form id='filterForm' ref={formRef} layout={'vertical'}>
                    <div className='row align-items-end'>
                      <div className='col-md-2 col-6'>
                        <Form.Item name='sub_activity' label='Sub-Activity Type'>
                          <Select
                            placeholder='Select Sub-Activity'
                            showSearch
                            suffixIcon={<DownOutlined className='th-grey' />}
                            optionFilterProp='children'
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            onChange={(e) => {
                              handleSubActivity(e);
                            }}
                            className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                            bordered={true}
                          >
                            {subActivityOption}
                          </Select>
                        </Form.Item>
                      </div>
                      {/* <div className='col-md-6'>
                        <div className='d-flex align-items-center pb-2'>
                          <span className='th-fw-600'>
                            Question and Answer(Enable or Disable)
                          </span>
                          <span className='ml-3'>
                            <Switch
                              onChange={handlePhysicalActivityToggle}
                              checked={physicalActivityToggle}
                            />
                          </span>
                        </div>
                      </div> */}
                    </div>
                  </Form>

                  <div className='row pb-3'>
                    <div className='col-12'>
                      <Table
                        columns={columnsOld}
                        dataSource={activityListData}
                        className='th-table'
                        rowClassName={(record, index) =>
                          `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                        }
                        loading={loading}
                        pagination={{
                          position: ['bottomCenter'],
                          total: totalCountAssigned,
                          current: Number(currentPageAssigned),
                          pageSize: limitAssigned,
                          showSizeChanger: false,
                          onChange: (e) => {
                            handlePaginationAssign(e);
                          },
                        }}
                        scroll={{
                          y: 300,
                          x: window.innerWidth > 600 ? null : 'max-content',
                        }}
                      />
                    </div>
                  </div>
                </TabPane>
                <TabPane tab='Mini Olympics' key='2'>
                  <Form id='filterForm' ref={formRef} layout={'vertical'}>
                    <div className='row align-items-end'>
                      <div className='col-md-2 col-6'>
                        <Form.Item
                          name='miniolympic_sub_activity'
                          label='Sub-Activity Type'
                        >
                          <Select
                            placeholder='Select Sub-Activity'
                            showSearch
                            suffixIcon={<DownOutlined className='th-grey' />}
                            optionFilterProp='children'
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            onChange={(e) => {
                              handleSubActivity(e);
                            }}
                            className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                            bordered={true}
                          >
                            {subActivityOption}
                          </Select>
                        </Form.Item>
                      </div>
                      {/* <div className='col-md-6'>
                        <div className='d-flex align-items-center pb-2'>
                          <span className='th-fw-600'>
                            Question and Answer(Enable or Disable)
                          </span>
                          <span className='ml-3'>
                            <Switch
                              onChange={handlePhysicalActivityToggle}
                              checked={physicalActivityToggle}
                            />
                          </span>
                        </div>
                      </div> */}
                    </div>
                  </Form>

                  <div className='row pb-3'>
                    <div className='col-12'>
                      <Table
                        columns={columns}
                        dataSource={activityListData}
                        className='th-table'
                        rowClassName={(record, index) =>
                          `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                        }
                        loading={loading}
                        pagination={{
                          position: ['bottomCenter'],
                          total: totalCountAssigned,
                          current: Number(currentPageAssigned),
                          pageSize: limitAssigned,
                          showSizeChanger: false,
                          onChange: (e) => {
                            handlePaginationAssign(e);
                          },
                        }}
                        scroll={{
                          y: 300,
                          x: window.innerWidth > 600 ? null : 'max-content',
                        }}
                      />
                    </div>
                  </div>
                </TabPane>
                <TabPane tab='Peak Test' key='3'>
                  <div className='row d-flex px-3 py-2'>
                    <div className='col-md-4 px-0 col-12 d-flex'>
                      <div
                        className='col-12 th-primary d-flex align-item-center px-0 '
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
                        loading={loadingBMI}
                        scroll={{
                          y: 300,
                          x: window.innerWidth > 600 ? null : 'max-content',
                        }}
                      />
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>

            {/* <Modal
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
              {loadingBMI ? (
                <div className='row'>
                  <div className='col-12 py-5 text-center'>
                    <Spin tip='Loading..' size='large' />
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
            </Modal> */}

            <Drawer
              title={
                <div className='th-fw-500 d-flex justify-content-between'>
                  <span>Your Review</span>
                </div>
              }
              placement='right'
              onClose={handleCloseSideViewMore}
              zIndex={1300}
              visible={showSideDrawer}
              width={window.innerWidth < 600 ? '95vw' : '55vw'}
              closable={false}
              className='th-activity-drawer'
              extra={
                <Space>
                  <CloseOutlined onClick={handleCloseSideViewMore} />
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
                          ref={playerRef}
                          width='100%'
                          height='60vh'
                          objectFit='fill'
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
                            <div className='pr-3'>
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
                            className='p-2 mt-3 th-br-5 th-bg-grey '
                            style={{ outline: '1px solid #d9d9d9' }}
                          >
                            <div>
                              Title :{' '}
                              <span className='th-fw-600'>
                                {selectedActivity?.activity_detail?.title}
                              </span>
                            </div>
                            <div className='text-justify'>
                              Description :{' '}
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
                              className='px-1 py-2 th-br-4'
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
                                    <div className='col-6' key={index}>
                                      {obj?.level?.name}
                                    </div>
                                    <div className='col-6 '>
                                      {!isRoundAvailable ? (
                                        <div
                                          className='p-2 th-bg-grey'
                                          title={funRemarks(obj)}
                                        >
                                          {funRemarks(obj)}
                                        </div>
                                      ) : null}
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
                    <div className=' th-fw-500 th-14'>
                      {selectedActivity?.branch?.name}
                    </div>
                    <div className=' th-fw-500 th-12'>
                      {selectedActivity?.grade?.name}
                    </div>
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
                      style={{
                        background: '#4800c9',
                        textAlign: 'center',
                        color: 'white',
                      }}
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
                            style={{
                              fontWeight: 500,
                              padding: '2px',
                              textAlign: 'center',
                            }}
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
        </div>
      </Layout>
    </div>
  );
};
export default StudentSidePhysicalActivity;
