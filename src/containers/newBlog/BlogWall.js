import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './blog.css';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import './styles.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import endpoints from '../../config/endpoints';
import {
  Breadcrumb,
  Comment,
  Select,
  DatePicker,
  Button,
  Modal,
  Tooltip,
  Table,
  Spin,
  Avatar,
  Badge,
  Rate,
  Drawer,
  Input,
  Space,
  message,
} from 'antd';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import commentIcon from 'v2/Assets/dashboardIcons/blogIcons/commentIcon.svg';
import clapIcon from 'v2/Assets/dashboardIcons/blogIcons/clapIcon.svg';
import playIcon from 'v2/Assets/dashboardIcons/blogIcons/playIcon.svg';
import likedIcon from 'v2/Assets/dashboardIcons/blogIcons/likedIcon.svg';
import axios from 'axios';
import moment from 'moment';
import {
  DownOutlined,
  CheckOutlined,
  SearchOutlined,
  FormOutlined,
  CloseOutlined,
  PlayCircleOutlined,
  FileDoneOutlined,
  UserOutlined,
  CommentOutlined,
  RedoOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import BlogWallImage from '../../assets/images/ssss.jpg';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import ReactPlayer from 'react-player';
import { getActivityIcon } from 'v2/generalActivityFunction';

const { Option } = Select;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: <span className='th-white pl-sm-0 th-fw-600'>Criteria</span>,
    align: 'center',
    render: (text, row) => {
      return row?.criterion;
    },
  },
  {
    title: <span className='th-white th-fw-600'>Remarks</span>,
    align: 'center',
    render: (text, row) => row?.levels?.filter((item) => item.status == true)[0].name,
  },
];

const BlogWall = () => {
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const user_level = data?.user_level;
  const isStudent = user_level == 13;
  const token = data?.token;
  const history = useHistory();
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [loading, setLoading] = useState(false);
  const [gradeList, setGradeList] = useState([]);
  const [showTab, setShowTab] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [branchIds, setBranchIds] = useState('');
  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem('ActivityManagementSession'))?.user_id
  );

  const [branchList, setBranchList] = useState([]);
  const [selectedGradeId, setSelectedGradeIds] = useState('');
  const [blogList, setBlogList] = useState([]);
  const [selectedBlogListId, setSelectedBlogListId] = useState('');
  const [imageData, setImageData] = useState('');
  const [ratingReview, setRatingReview] = useState([]);
  const [postWallList, setPostWallList] = useState([]);
  const [categoriesFilter, setCategoriesFilter] = useState('All');
  const [openAttachment, setOpenAttachment] = useState(false);
  const [attachmentDetails, setAttachmentDetails] = useState([]);
  const [chatDetails, setChatDetails] = useState([]);
  const [reloadData, setReloadData] = useState([]);
  const [publicSpeakingrating, setPublicSpeakingrating] = useState([]);
  const levels = [
    'All',
    'Intra Orchids',
    'Branch',
    'Grade',
    'Section',
    'Blog of the Month',
  ];
  const options = [
    { id: 1, value: 'All' },
    { id: 2, value: 'Blogs' },
    { id: 3, value: 'Dance', visible: isStudent },
    { id: 4, value: 'Music', visible: isStudent },
    { id: 5, value: 'Posts' },
    { id: 6, value: 'Public Speaking', visible: isStudent },
    { id: 7, value: 'Theatre', visible: isStudent },
    { id: 8, value: 'Visual Art', visible: isStudent },
  ].filter((item) => item?.visible !== false);
  const [showBlogDetailsDrawer, setShowBlogDetailsDrawer] = useState(false);
  const [blogDrawerData, setBlogDrawerData] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(null);
  const [showPostDetailsModal, setShowPostDetailsModal] = useState(false);
  const [showOtherActivityModal, setShowOtherActivityModal] = useState(false);
  const [selectedOtherActivity, setSelectedOtherActivity] = useState(null);
  const [postModalContentData, setPostModalContentData] = useState(null);
  const [selectedPostData, setSelectedPostData] = useState();
  const [currentComment, setCurrentComment] = useState(null);
  const [commentsList, setCommentsList] = useState([]);
  const branchOptions = branchList?.map((each) => {
    return (
      <Option value={each?.id} key={each?.id}>
        {each?.name}
      </Option>
    );
  });

  const categoryOptions = options?.map((each) => {
    return (
      <Option value={each?.value} key={each?.value}>
        {each?.value}
      </Option>
    );
  });

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id} title={each?.name}>
        {each?.name}
      </Option>
    );
  });

  const blogListOptions = blogList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.title}
      </Option>
    );
  });
  const submitComment = ({ type }) => {
    let payload = {
      user_id: userId,
      post_id: selectedPostData?.id,
    };

    if (type == 'comment') {
      if (!currentComment?.trim().length) {
        message.error('Please add some comment first');
        return;
      } else {
        payload['comment'] = currentComment;
      }
    } else if (type == 'like') {
      payload['is_liked'] = true;
    }
    axios
      .post(`${endpoints.newBlog.submitReaction}`, payload, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setCurrentComment(null);
          fetchCurrentComments({ post_id: selectedPostData?.id, user_id: userId });
        }
      });
  };

  const getActivitySession = () => {
    setLoading(true);
    axios
      .post(
        `${endpoints.newBlog.activitySessionLogin}`,
        {},
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
            Authorization: `${token}`,
          },
        }
      )
      .then((response) => {
        localStorage.setItem(
          'ActivityManagementSession',
          JSON.stringify(response?.data?.result)
        );
        setUserId(response?.data?.result?.user_id);
        setLoading(false);
        setShowTab('1');
      });
  };

  useEffect(() => {
    if (localStorage.getItem('ActivityManagementSession') == null) ActvityLocalStorage();
  }, [window.location.pathname]);
  const ActvityLocalStorage = () => {
    setLoading(true);
    axios
      .post(
        `${endpoints.newBlog.activityWebLogin}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        localStorage.setItem(
          'ActivityManagement',
          JSON.stringify(response?.data?.result)
        );
        getActivitySession();
        setLoading(false);
      });
  };

  const fetchGradeData = () => {
    setLoading(true);
    axios
      .get(
        `${endpoints.newBlog.activityGrade}?branch_ids=${selectedBranch?.branch?.id}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        setGradeList(response?.data?.result);
        setLoading(false);
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false);
      });
  };

  const handleBranchChange = (item) => {
    const branches = item?.map((i) => i.value).join(',');
    setBranchIds(branches);
    // fetchGradeData(branches);
  };

  useEffect(() => {
    if (selectedBranch) {
      fetchGradeData();
    }
  }, [selectedBranch]);

  const blogListApiCall = () => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.blogListDropApi}`, {
        params: {
          ...(selectedBranch ? { branch_ids: selectedBranch?.branch?.id } : {}),
          ...(selectedGradeId ? { grade_ids: selectedGradeId } : {}),
        },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setBlogList(response?.data?.result);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleGradeChange = (e) => {
    console.log('grade', e);
    if (e) {
      setSelectedGradeIds(e?.value);
    } else {
      setSelectedGradeIds('');
    }
  };

  const handleBlogListChange = (e, value) => {
    if (e) {
      setSelectedBlogListId(value?.value);
    } else {
      setSelectedBlogListId('');
    }
  };

  const fetchPostWall = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.getSchoolWallApi}`, {
        params: {
          ...params,
          ...(startDate ? { start_date: startDate } : {}),
          ...(endDate ? { end_date: endDate } : {}),
          ...(selectedBlogListId ? { activity_detail_id: selectedBlogListId } : {}),
          ...(selectedGradeId ? { grade_ids: selectedGradeId } : {}),
          ...(categoriesFilter ? { category: categoriesFilter } : {}),
        },

        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setPostWallList(response?.data?.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    blogListApiCall();
  }, [branchIds, selectedGradeId]);

  useEffect(() => {
    if (userId) handleSearch();
  }, [showTab, categoriesFilter, userId]);

  const handleSearch = () => {
    if (showTab == 1) {
      fetchPostWall({
        user_id: userId,
      });
    } else if (showTab == 2) {
      fetchPostWall({
        publish_level: 'Intra Orchids Level',
        user_id: userId,
      });
    } else if (showTab == 3) {
      fetchPostWall({
        publish_level: 'Branch Level',
        user_id: userId,
        branch_ids: selectedBranch?.branch?.id,
      });
    } else if (showTab == 4) {
      fetchPostWall({
        publish_level: 'Grade Level',
        branch_ids: selectedBranch?.branch?.id,
        user_id: userId,
      });
    } else if (showTab == 5) {
      fetchPostWall({
        is_best_blog: 'true',
        user_id: userId,
        branch_ids: selectedBranch?.branch?.id,
      });
    } else if (showTab == 6) {
      fetchPostWall({
        publish_level: 'Section Level',
        branch_ids: selectedBranch?.branch?.id,
        user_id: userId,
      });
    }
  };
  const fetchCurrentComments = (params = {}) => {
    axios
      .get(`${endpoints.newBlog.getComments}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        console.log('comments', response?.data);
        setCommentsList(response?.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const fetchPostDetails = (data) => {
    //  setLoading(true);
    axios
      .get(`${endpoints.newBlog.postActivityViewMoreAPI}${data?.id}/`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setPostModalContentData(response?.data?.result);
        fetchCurrentComments({ post_id: data?.id, user_id: userId });
        //  setLoading(false);
        //  setOpenModal(true);
      });
  };
  const getWhatsAppDetails = (prop) => {
    setLoading(true);
    if (prop !== null) {
      setReloadData(prop);
    }
    axios
      .get(
        `${endpoints.newBlog.whatsAppChatGetApi}?erp_id=${
          data?.erp
        }&created_at__date__gte=${
          prop !== null ? prop?.created_at__date__gte : reloadData?.created_at__date__gte
        }&created_at__date__lte=${
          prop !== null ? prop?.created_at__date__lte : reloadData?.created_at__date__lte
        }&activity_id=${prop !== null ? prop?.activity : reloadData?.activity}`,
        {
          headers: {
            HOST: X_DTS_HOST,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setChatDetails(response?.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  let array = [];
  const getRatingView = ({ data, otherActvity }) => {
    console.log('params', data, otherActvity);
    setDetailsLoading(true);
    axios
      .get(`${endpoints.newBlog.studentReviewss}?booking_detail_id=${data}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        response.data.map((obj) => {
          let temp = {};
          temp['id'] = obj?.id;
          temp['name'] = obj?.level.name;
          temp['remarks'] = otherActvity ? JSON.parse(obj.remarks) : obj?.remarks;
          temp['given_rating'] = obj?.given_rating;
          temp['level'] = obj?.level?.rating;
          array.push(temp);
        });
        setRatingReview(array);
        setDetailsLoading(false);
      })
      .catch(() => {
        setDetailsLoading(false);
      });
  };

  const onChangeTab = (key) => {
    setPostWallList([]);
    setShowTab(key.toString());
  };

  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
    }
  };

  const customRenderThumb = (props, state) => {
    let thumbList = props.map((product, index) =>
      product?.props?.children?.props?.alt === 'image' ? (
        <picture key={index}>
          <source data-srcSet={product?.props?.children?.props?.thumb} type='image/jpg' />

          <img
            key={product?.props?.children?.key}
            src={product?.props?.children?.props?.thumb}
            alt={product?.props?.children?.props?.alt}
            height='70'
          />
        </picture>
      ) : (
        <video key={index} controls style={{ width: '70px', height: '40px' }}>
          <source
            data-srcSet={product?.props?.children?.props?.thumb}
            type='video/mp4'
            width='70px'
            height='40px'
          />
        </video>
      )
    );
    return thumbList;
  };

  const handleChange = (value) => {
    setCategoriesFilter(value);
  };

  const viewMoreAttachment = (item) => {
    setAttachmentDetails(item);
    setOpenAttachment(true);
  };

  const reloadButton = (clickedData) => {
    getWhatsAppDetails(null);
  };
  const handleShowBlogDetailsDrawer = (blogData) => {
    setShowBlogDetailsDrawer(true);
    setImageData(JSON.parse(blogData?.template?.html_file));
    setBlogDrawerData(blogData);
    getRatingView({ data: blogData?.booking_id, otherActvity: false });
  };
  const handleShowPostDetailsModal = (postData) => {
    setSelectedPostData(postData);
    setShowPostDetailsModal(true);
    fetchPostDetails(postData);
  };
  const handleShowOtherActivityModal = (data) => {
    if (data?.type == 'Public Speaking') {
      let ratings = JSON.parse(data?.grading?.grade_scheme_markings);
      setPublicSpeakingrating(ratings);
    } else {
      getRatingView({ data: data?.booking_detail?.id, otherActvity: true });
    }
    setSelectedOtherActivity(data);
    setShowOtherActivityModal(true);
    // fetchPostDetails(data);
  };
  console.log(showOtherActivityModal, 'showOtherActivityModalshowOtherActivityModal');
  const PostContent = () => {
    return (
      <>
        <div className='row mb-md-0 mt-3'>
          {!(user_level == '13' || user_level == '10') && (
            <div className='col-12 px-0'>
              <div className='row align-items-end'>
                <div className='col-md-2 col-5 px-0 px-md-2'>
                  <div className='mb-2 text-left'>Grade</div>
                  <Select
                    className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
                    bordered={true}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    // value={selectedCategoryName}
                    placement='bottomRight'
                    placeholder='Select Grade'
                    suffixIcon={<DownOutlined className='th-black-1' />}
                    dropdownMatchSelectWidth={false}
                    onChange={(e, val) => handleGradeChange(val)}
                    allowClear
                    menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
                  >
                    {gradeOptions}
                  </Select>
                </div>{' '}
                <div className='col-md-2 col-5 px-0 px-md-2'>
                  <div className='mb-2 text-left'>Blog List</div>
                  <Select
                    className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
                    bordered={true}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    // value={selectedCategoryName}
                    placement='bottomRight'
                    placeholder='Select Blog List'
                    suffixIcon={<DownOutlined className='th-black-1' />}
                    dropdownMatchSelectWidth={false}
                    onChange={(e, val) => handleBlogListChange(e, val)}
                    allowClear
                    menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
                  >
                    {blogListOptions}
                  </Select>
                </div>{' '}
                <div className='col-md-3 col-7 px-2 th-br-4'>
                  <div className='mb-2 text-left'>Date</div>
                  <RangePicker
                    allowClear={false}
                    bordered={true}
                    placement='bottomRight'
                    showToday={false}
                    suffixIcon={<DownOutlined />}
                    onChange={(value) => handleDateChange(value)}
                    className='th-range-picker th-br-4 w-80'
                    separator={'to'}
                    format={'DD/MM/YYYY'}
                  />
                </div>
                <div className='col-md-2 col-7 px-2 th-br-4'>
                  <Button
                    className='th-button-active th-br-6 text-truncate th-pointer'
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div
            className='th-width-100'
            style={{
              height: window.innerWidth < 600 ? '50vh' : '100%',
              overflowY: window.innerWidth < 600 ? 'auto' : 'none',
            }}
          >
            <div className='col-12 px-0 mt-3'>
              {loading ? (
                <div className='d-flex justify-content-center py-5'>
                  <Spin size='large' tip='Loading...' />{' '}
                </div>
              ) : postWallList?.length > 0 ? (
                <div className='row'>
                  {postWallList?.map((item, index) =>
                    item?.type === 'post' ? (
                      <div
                        className='col-12 col-sm-6 col-lg-4 my-2'
                        style={{ height: 360 }}
                      >
                        <Badge.Ribbon
                          text={<span className='th-white'>{item?.type}</span>}
                          className='text-capitalize th-white'
                        >
                          <div
                            className='shadow-sm th-bg-white th-br-8 py-2 th-pointer wall_card'
                            style={{ outline: '1px solid #d9d9d9' }}
                            onClick={() => handleShowPostDetailsModal(item)}
                          >
                            <div className='row justify-content-between'>
                              <div className='col-12'>
                                <div className='d-flex align-items-center'>
                                  <Avatar size={40} icon={<UserOutlined />} />
                                  <div className='d-flex flex-column ml-2 th-width-80'>
                                    <div
                                      className='text-truncate th-black-1 th-fw-500 th-width-75'
                                      title={item?.name}
                                    >
                                      {item?.name}
                                    </div>
                                    <div>
                                      <span className='px-2 th-br-8 th-bg-grey'>
                                        <span className='th-12 th-fw-500 th-primary'>
                                          {item?.user_role}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className='col-12 py-2'>
                                <div style={{ height: '200px' }}>
                                  {item?.content?.file_type === 'video/mp4' ? (
                                    <>
                                      <video
                                        preload='auto'
                                        src={item?.content?.s3_url}
                                        width='100%'
                                        height='200px'
                                        objectFit={'cover'}
                                        className='th-br-5'
                                        // poster={item?.content?.thumbnail_url}
                                      />
                                    </>
                                  ) : (
                                    <img
                                      src={item?.content?.s3_url}
                                      width='100%'
                                      height='200px'
                                      objectFit={'cover'}
                                      alt='content_image'
                                      className='th-br-5'
                                      loading='lazy'
                                    />
                                  )}
                                </div>
                                <div
                                  className=''
                                  style={{ position: 'absolute', top: '5%', right: '5%' }}
                                >
                                  <span className='th-bg-primary th-white th-br-4 px-1 py-1 th-12'>
                                    {item?.view_level}
                                  </span>
                                </div>
                                {item?.content_count > 1 && (
                                  <div
                                    className=''
                                    style={{
                                      position: 'absolute',
                                      bottom: '10%',
                                      right: '5%',
                                    }}
                                  >
                                    <span className='th-bg-grey th-primary th-br-2 px-1 py-1 th-12'>
                                      <FileDoneOutlined />
                                      {item?.content_count - 1} more
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className='col-12 py-1 text-truncate'>
                                <span className='th-16 th-fw-500 th-black-1'>
                                  {item?.branch?.name}
                                </span>
                              </div>
                              <div className='col-12 py-1'>
                                <div
                                  className='d-flex justify-content-between pt-3 align-items-center'
                                  style={{ borderTop: '1px solid #d9d9d9' }}
                                >
                                  <div className='th-fw-500 th-14 th-grey'>
                                    {moment(item?.created_at).format('MMM Do,YYYY')}
                                  </div>
                                  <div className=''>
                                    <span
                                      className='px-3 py-2 th-br-20 mr-2'
                                      style={{ border: '1px solid #d9d9d9' }}
                                    >
                                      <span className='mr-2 th-14 th-fw-700 th-grey'>
                                        {item?.comment_count}
                                      </span>
                                      <span>
                                        <img src={commentIcon} height={20} />
                                      </span>
                                    </span>
                                    <span
                                      className='px-3 py-2 th-br-20'
                                      style={{ border: '1px solid #d9d9d9' }}
                                    >
                                      <span className='mr-2 th-14 th-fw-700 th-grey'>
                                        {item?.like_count}
                                      </span>
                                      <span>
                                        <img src={clapIcon} height={20} />
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Badge.Ribbon>
                      </div>
                    ) : item?.type === 'blog' ? (
                      <div
                        className='col-12 col-sm-6 col-lg-4 my-2'
                        style={{ height: 360 }}
                      >
                        <Badge.Ribbon
                          text={<span className='th-white'>{item?.type}</span>}
                          color='#7E55D4'
                          className='text-capitalize th-white'
                        >
                          <div
                            className='shadow-sm th-bg-white th-br-8 py-2 th-pointer wall_card'
                            style={{ outline: '1px solid #d9d9d9' }}
                            onClick={() => handleShowBlogDetailsDrawer(item)}
                          >
                            <div className='row justify-content-between'>
                              <div className='col-12'>
                                <div className='d-flex align-items-center'>
                                  <Avatar size={40} icon={<UserOutlined />} />
                                  <div className='d-flex flex-column ml-2 th-width-80'>
                                    <div
                                      className='text-truncate th-black-1 th-fw-500 th-width-75'
                                      title={item?.name}
                                    >
                                      {item?.name}
                                    </div>
                                    <div>
                                      <span className='px-2 th-br-8 th-bg-grey'>
                                        <span className='th-12 th-fw-500 th-primary'>
                                          {item?.user_role}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className='col-12 py-2'>
                                <div style={{ height: '200px', position: 'relative' }}>
                                  <img
                                    src={item?.template?.template_path}
                                    alt='content_image'
                                    className='th-br-5 th-pointer'
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'fill',
                                    }}
                                    loading='lazy'
                                  />
                                </div>
                                <div
                                  className=''
                                  style={{ position: 'absolute', top: '5%', right: '5%' }}
                                >
                                  <span className='th-bg-primary th-white th-br-4 px-1 py-1 th-12'>
                                    {item?.publish_level}
                                  </span>
                                </div>
                                <div
                                  className=''
                                  style={{
                                    width: '80%',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: `translate(-50%, -50%)`,
                                  }}
                                >
                                  <div
                                    className='text-center th-white th-br-4 px-1 py-1 th-truncate-4'
                                    style={{ background: `rgba(0,0,0,0.45)` }}
                                  >
                                    <span className='p-2 th-12'>{item?.content}</span>
                                  </div>
                                </div>
                              </div>
                              <div className='col-12 py-1 text-truncate'>
                                <span className='th-16 th-fw-500 th-black-1'>
                                  {item?.branch?.name}
                                </span>
                              </div>
                              <div className='col-12 py-1'>
                                <div
                                  className='d-flex justify-content-between pt-3 align-items-center'
                                  style={{ borderTop: '1px solid #d9d9d9' }}
                                >
                                  <div className='th-fw-500 th-14 th-grey'>
                                    {moment(item?.created_at).format('MMM Do,YYYY')}
                                  </div>
                                  <div className=''>
                                    <Rate disabled defaultValue={2} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Badge.Ribbon>
                      </div>
                    ) : (
                      <div
                        className='col-12 col-sm-6 col-lg-4 my-2'
                        style={{ height: 360 }}
                      >
                        <Badge.Ribbon
                          text={<span className='th-white'>{item?.type}</span>}
                          color={item?.type == 'Public Speaking' ? '#29894A' : '#7E55D4'}
                          className='text-capitalize'
                        >
                          <div
                            className='shadow-sm th-bg-white th-br-8 py-2 th-pointer wall_card'
                            style={{ outline: '1px solid #d9d9d9' }}
                            onClick={() => handleShowOtherActivityModal(item)}
                          >
                            <div className='row justify-content-between'>
                              <div className='col-12'>
                                <div className='d-flex align-items-center'>
                                  <Avatar size={40} icon={<UserOutlined />} />
                                  <div className='d-flex flex-column ml-2 th-width-80'>
                                    <div
                                      className='text-truncate th-black-1 th-fw-500 th-width-75'
                                      title={item?.name}
                                    >
                                      {item?.type == 'Public Speaking'
                                        ? ` ${data?.first_name} ${data?.last_name}`
                                        : item?.name}
                                    </div>
                                    <div>
                                      <span className='px-2 th-br-8 th-bg-grey'>
                                        <span className='th-12 th-fw-500 th-primary'>
                                          {item?.type == 'Public Speaking'
                                            ? item?.grade
                                            : item?.section?.name}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className='col-12 py-2'>
                                <div style={{ height: '200px', position: 'relative' }}>
                                  {item?.type == 'Public Speaking' ? (
                                    <>
                                      <div className='videoOverlay'>
                                        <img src={playIcon} />
                                      </div>
                                      <video
                                        preload='auto'
                                        src={item?.asset?.signed_URL}
                                        className='th-br-5'
                                        style={{
                                          height: '200px',
                                          width: '100%',
                                          objectFit: 'fill',
                                        }}
                                      />
                                    </>
                                  ) : (
                                    <img
                                      src={
                                        item?.content?.s3_path
                                          ? item?.content?.s3_path
                                          : getActivityIcon(item?.type)
                                      }
                                      alt='content_image'
                                      className='th-br-5 th-pointer'
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'fill',
                                      }}
                                      loading='lazy'
                                    />
                                  )}
                                </div>
                              </div>
                              <div
                                className='col-12 py-1 text-truncate'
                                title={
                                  item?.type == 'Public Speaking'
                                    ? item?.group?.activity?.name
                                    : item?.activity_detail?.title
                                }
                              >
                                <span className='th-16 th-fw-500 th-black-1 '>
                                  {item?.type == 'Public Speaking'
                                    ? item?.group?.activity?.name
                                    : item?.activity_detail?.title}
                                </span>
                              </div>
                              <div className='col-12 py-1'>
                                <div
                                  className='d-flex justify-content-between pt-3 align-items-center'
                                  style={{ borderTop: '1px solid #d9d9d9' }}
                                >
                                  <div className='th-fw-500 th-14 th-grey'>
                                    {moment(item?.created_at).format('MMM Do,YYYY')}
                                  </div>
                                  {item?.type == 'Public Speaking' && (
                                    <div className=''>
                                      <span
                                        className='px-3 py-2 th-br-20 mr-2'
                                        style={{ border: '1px solid #d9d9d9' }}
                                      >
                                        <span className='mr-2 th-14 th-fw-700 th-grey'>
                                          {item?.comment_count}
                                        </span>
                                        <span>
                                          <img src={commentIcon} height={20} />
                                        </span>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Badge.Ribbon>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className='d-flex justify-content-center mt-5'>
                  <img src={NoDataIcon} />
                </div>
              )}
            </div>
          </div>
        </div>
        {showBlogDetailsDrawer && (
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
                    <img
                      src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                      width='130'
                      alt='image'
                    />
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
                          <span className='p-2 th-12'>{blogDrawerData?.content}</span>
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
                          {blogDrawerData?.content}
                        </span>
                      </div>
                    </div>
                  </div>
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
                </div>
              </div>
            </div>
          </Drawer>
        )}
        {showPostDetailsModal && (
          <Modal
            title='Post Details'
            className='th-upload-modal'
            centered
            visible={showPostDetailsModal}
            destroyOnClose={true}
            onOk={() => setShowPostDetailsModal(false)}
            onCancel={() => {
              setShowPostDetailsModal(false);
              setCurrentComment(null);
              handleSearch();
            }}
            width={'80vw'}
            footer={null}
            closeIcon={<CloseOutlined />}
          >
            <div className='row'>
              <div className='col-8 carousel-global'>
                <Carousel
                  infiniteLoop={true}
                  showArrows={true}
                  showThumbs={true}
                  showStatus={false}
                  emulateTouch={true}
                  renderThumbs={customRenderThumb}
                >
                  {postModalContentData?.content?.map((item, index) => {
                    return (
                      <div className='image'>
                        {item.file_type === 'image/png' ||
                        item.file_type === 'image/jpeg' ? (
                          <img
                            src={item?.s3_url}
                            alt={'image'}
                            thumb={item?.s3_url}
                            key={index}
                            width='100%'
                            loading='lazy'
                          />
                        ) : (
                          <ReactPlayer
                            url={item?.s3_url}
                            thumb={item?.s3_url}
                            key={index}
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

                      //  </div>
                    );
                  })}
                </Carousel>
              </div>
              <div className='col-4'>
                <div className='d-flex flex-column align-items-end'>
                  <div className='row justify-content-between'>
                    <div className='col-12 py-2 px-0'>
                      <div className='d-flex align-items-center'>
                        <Avatar size={40} icon={<UserOutlined />} />
                        <div className='d-flex flex-column ml-2'>
                          <div
                            className='text-truncate th-black-1 th-fw-500'
                            title={selectedPostData?.name}
                          >
                            {selectedPostData?.name}
                          </div>
                          <div>
                            <span className='th-12 th-fw-500 th-black-2'>
                              {selectedPostData?.section?.name}
                            </span>
                          </div>
                          <div>
                            <span className='th-12 th-fw-500 th-black-2'>
                              {selectedPostData?.branch?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-12 px-0'>
                      <div
                        className=' py-1 mb-1'
                        style={{
                          borderTop: '1px solid #d9d9d9',
                          borderBottom: '1px solid #d9d9d9',
                        }}
                      >
                        <div
                          className='mt-2 th-12 th-grey-1'
                          style={{ overflowY: 'auto', maxHeight: '10vh' }}
                        >
                          {selectedPostData?.description}
                        </div>
                      </div>
                      <div
                        className='py-2'
                        style={{
                          borderBottom: '1px solid #d9d9d9',
                        }}
                      >
                        <div className='d-flex justify-content-between'>
                          <div className='th-16 th-fw-600 th-black-1'>
                            Comments
                            {commentsList?.data?.length > 0
                              ? `(${commentsList?.data?.length})`
                              : null}
                          </div>
                          <div>
                            {' '}
                            <span
                              className='px-3 py-2 th-br-20'
                              style={{ border: '1px solid #d9d9d9' }}
                            >
                              <span className='mr-2 th-12 th-fw-700 th-grey'>
                                {commentsList?.like_count}
                              </span>
                              <span>
                                <img
                                  src={commentsList?.is_post_liked ? likedIcon : clapIcon}
                                  height={20}
                                  className='th-pointer'
                                  onClick={() =>
                                    !commentsList?.is_post_liked
                                      ? submitComment({ type: 'like' })
                                      : null
                                  }
                                />
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className='mt-2' style={{ height: 250, overflowY: 'auto' }}>
                          {commentsList?.data?.length > 0 ? (
                            commentsList?.data?.map((each) => {
                              return (
                                <div className='my-1'>
                                  <Comment
                                    author={
                                      <div className='th-fw-500 th-16'>
                                        {each?.view_stats?.viewer?.name}
                                      </div>
                                    }
                                    avatar={<Avatar size={40} icon={<UserOutlined />} />}
                                    content={<p>{each?.comment}</p>}
                                    datetime={
                                      <Tooltip
                                        title={moment(each?.created_on).format(
                                          'MMM Do,YYYY'
                                        )}
                                      >
                                        <div>
                                          {moment(each?.created_on).format('MMM Do,YYYY')}
                                        </div>
                                      </Tooltip>
                                    }
                                  />
                                </div>
                              );
                            })
                          ) : (
                            <div>No Comments yet. Be the first one.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row mt-1'>
                    <div className='col-12 px-0 my-2'>
                      <Input.TextArea
                        className='th-br-8'
                        autoSize={{
                          minRows: 2,
                          maxRows: 4,
                        }}
                        value={currentComment}
                        placeholder='write something'
                        onChange={(e) => setCurrentComment(e.target.value)}
                      />
                    </div>
                    <div className='col-12 px-0 text-right'>
                      <span
                        className='th-button-active mt-2 th-width-40 th-br-8 p-1 th-12 text-center th-pointer'
                        onClick={() => submitComment({ type: 'comment' })}
                      >
                        <span>Add Comment </span>
                        {/* <span className='ml-2'>
                        <SendOutlined />
                      </span> */}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
        {showOtherActivityModal && (
          <Modal
            title={selectedOtherActivity?.type}
            className='th-upload-modal'
            centered
            visible={showOtherActivityModal}
            destroyOnClose={true}
            onOk={() => setShowOtherActivityModal(false)}
            onCancel={() => {
              setShowOtherActivityModal(false);
            }}
            width={'80vw'}
            footer={null}
            closeIcon={<CloseOutlined />}
          >
            <div className='row p-3'>
              <div className='col-7 '>
                {selectedOtherActivity?.type == 'Public Speaking' ? (
                  <video
                    preload='auto'
                    controls
                    src={selectedOtherActivity?.asset?.signed_URL}
                    className='th-br-5'
                    style={{
                      height: '500px',
                      width: '100%',
                      objectFit: 'fill',
                    }}
                  />
                ) : selectedOtherActivity?.content?.file_type === 'image/png' ||
                  selectedOtherActivity?.content?.file_type === 'image/jpeg' ? (
                  <img
                    src={
                      selectedOtherActivity?.content?.s3_path
                        ? selectedOtherActivity?.content?.s3_path
                        : getActivityIcon(selectedOtherActivity?.type)
                    }
                    alt={'image'}
                    width='100%'
                    loading='lazy'
                  />
                ) : (
                  <video
                    preload='auto'
                    controls
                    src={selectedOtherActivity?.content?.s3_path}
                    className='th-br-5'
                    style={{
                      height: '500px',
                      width: '100%',
                      objectFit: 'fill',
                    }}
                  />
                )}
              </div>
              <div className='col-5 '>
                <div className='row justify-content-between'>
                  <div className='col-12 py-2 px-0'>
                    <div className='d-flex align-items-center'>
                      <Avatar size={40} icon={<UserOutlined />} />
                      <div className='d-flex flex-column ml-2'>
                        <div className=' th-black-1 th-fw-500'>
                          {selectedOtherActivity?.type == 'Public Speaking'
                            ? selectedOtherActivity?.group?.activity?.name
                            : selectedOtherActivity?.activity_detail?.title}
                        </div>
                        <div>
                          <span className='th-12 th-fw-500 th-black-2'>
                            {selectedOtherActivity?.type == 'Public Speaking'
                              ? selectedOtherActivity?.grade
                              : selectedOtherActivity?.grade?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-12 py-2 px-0'>
                    {selectedOtherActivity?.type == 'Public Speaking' ? (
                      <Table
                        className='th-table'
                        columns={columns}
                        loading={loading}
                        dataSource={
                          selectedOtherActivity?.type == 'Public Speaking'
                            ? publicSpeakingrating
                            : null
                        }
                        pagination={false}
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                        }
                        scroll={{ x: 'max-content' }}
                      />
                    ) : (
                      <>
                        <div
                          className='th-bg-grey py-3 px-2 th-br-8'
                          style={{ outline: '1px solid #d9d9d9' }}
                        >
                          <div className=' th-12 th-black-2'>
                            Title :{' '}
                            <span className='th-16 th-fw-500 th-black-1'>
                              {selectedOtherActivity?.activity_detail?.title}
                            </span>
                          </div>
                          <div
                            className='mt-2'
                            style={{ overflowY: 'auto', maxHeight: '25vh' }}
                          >
                            <span className='th-12 th-black-2'>Description :&nbsp;</span>
                            <span className='th-16 th-fw-400 th-black-1'>
                              {selectedOtherActivity?.activity_detail?.description}
                            </span>
                          </div>
                        </div>
                        <div
                          className='p-2 mt-2 th-br-8'
                          style={{ outline: '1px solid #d9d9d9' }}
                        >
                          {ratingReview?.map((obj, index) => {
                            return (
                              <div className='row py-1 align-items-center'>
                                <div className='col-6 pl-1' key={index}>
                                  {obj?.name}
                                </div>
                                <div className='col-6 pr-1'>
                                  <Input
                                    disabled
                                    value={
                                      obj?.remarks?.filter(
                                        (item) => item.status == true
                                      )[0]?.name
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {selectedOtherActivity?.type == 'Public Speaking' && (
                  <div className='col-12'>
                    <div
                      className='col-12'
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                      }}
                    >
                      <div className='col-6'>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {' '}
                          <CommentOutlined
                            style={{
                              color: 'blue',
                              fontSize: '20px',
                              paddingRight: '0.5rem',
                            }}
                          />
                          Comments
                        </span>
                      </div>
                      <div
                        className='col-6'
                        style={{ display: 'flex', justifyContent: 'end' }}
                      >
                        <span>
                          {' '}
                          <Button
                            shape='circle'
                            size='small'
                            onClick={() => reloadButton()}
                            icon={<RedoOutlined />}
                          />
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '10px',
                        margin: '0.5rem 0rem',
                      }}
                    >
                      {chatDetails.length !== 0 ? (
                        <>
                          {chatDetails.map((item, index) => {
                            if (item?.is_reply == true) {
                              return (
                                <div className=' col-12 comment-header'>
                                  <div
                                    className='col-2'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItem: 'center',
                                    }}
                                  >
                                    {' '}
                                    <UserOutlined
                                      style={{
                                        fontSize: '18px',
                                        color: 'white',
                                        borderRadius: '20px',
                                        padding: '0.5rem',
                                        background: '#4800c9',
                                      }}
                                    />{' '}
                                  </div>
                                  <div
                                    className='col-8'
                                    style={{
                                      color: 'black',
                                      padding: '0.5rem',
                                      background: '#f2f2f2',
                                      wordWrap: 'break-word',
                                      borderRadius: '0px 15px 15px 15px',
                                      float: 'left',
                                    }}
                                  >
                                    <span
                                      style={{ fontWeight: 'bold', fontSize: '13px' }}
                                    >
                                      {item?.name}
                                    </span>
                                    <p
                                      style={{ margin: '0px', fontSize: '12px' }}
                                      key={item?.index}
                                    >
                                      {item.message}
                                    </p>
                                  </div>
                                  <div className='col-2'>
                                    {item?.media_link !== null ? (
                                      <span>
                                        <Button
                                          onClick={() => viewMoreAttachment(item)}
                                          type='primary'
                                          size='small'
                                          shape='circle'
                                          icon={<FileImageOutlined />}
                                        />
                                      </span>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItem: 'center',
                            fontSize: '16px',
                            fontWeight: 400,
                          }}
                        >
                          No Comments Submitted
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  };
  return (
    <React.Fragment>
      <Layout>
        {''}
        <div className='row th-16 align-items-center px-2'>
          <div className='col-md-8'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-black-1 th-16'>School Wall</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          {user_level == '13' || user_level == '10' ? (
            ''
          ) : (
            <div className='col-md-4 text-right'>
              <Button
                icon={<FormOutlined />}
                className='th-button-active th-br-6 text-truncate th-pointer'
                onClick={() => history.push(`/create-post-activity`)}
              >
                Create Post Activity
              </Button>
            </div>
          )}
          <div className='col-12 my-2'>
            <img src={BlogWallImage} alt='icon' className='post-redirect-card' />
          </div>

          <div className='row mt-3'>
            <div className='col-12 '>
              <div className='d-flex align-items-center justify-content-between flex-wrap'>
                <div className='d-flex justify-content-start align-items-center flex-wrap'>
                  <div className=' th-black-2 th-fw-500 mr-2'>Select Level</div>
                  <div className=''>
                    <div className='d-flex justify-content-between align-items-center flex-wrap'>
                      {levels?.map((item, index) => (
                        <div className='mx-1'>
                          <Button
                            onClick={() => onChangeTab(index + 1)}
                            className={`${
                              showTab == index + 1 ? 'th-button-active' : 'th-button'
                            } th-br-5 mb-2 mb-sm-0`}
                          >
                            {item}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='d-flex my-2 my-md-2'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className=' th-black-2 th-fw-500 mr-2'>Categories</div>
                    <div>
                      <Select
                        defaultValue='All'
                        getPopupContainer={(trigger) => trigger.parentNode}
                        dropdownMatchSelectWidth={false}
                        onChange={handleChange}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        placement='bottomRight'
                      >
                        {categoryOptions}
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-12 px-0 px-sm-2'>{PostContent()}</div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};
export default BlogWall;
