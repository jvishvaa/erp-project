import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  notification,
  Tag,
  Spin,
  Card,
  Checkbox,
  Tooltip,
  Row,
  Col,
  Modal,
  Pagination,
  Skeleton,
  Empty,
  Drawer,
  Badge,
  Image,
  Divider,
  Popconfirm,
} from 'antd';
import {
  EyeOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  CloudDownloadOutlined,
  FileOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  CommentOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import Layout from 'containers/Layout';
import './PostsModeration.scss';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import MediaDisplay from './PostsModerationMediaDisplay';
import Slider from 'react-slick';
import { saveAs } from 'file-saver';
import endpointsV2 from 'v2/config/endpoints';
import TextCollapse from './TextCollapse';
import dayjs from 'dayjs';
const dummyProfilePic =
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg';

const PostsModeration = () => {
  const history = useHistory();
  const branch = sessionStorage.getItem('selected_branch')
    ? JSON.parse(sessionStorage.getItem('selected_branch'))
    : '';
  const session_year = sessionStorage.getItem('acad_session')
    ? JSON.parse(sessionStorage.getItem('acad_session'))?.id
    : '';
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(24);
  const [currentCommentsPage, setCurrentCommentsPage] = useState(1);
  const [commentsPageSize] = useState(32);
  const [commentsTabValue, setCommentsTabValue] = useState('1');
  const [gradeList, setGradeList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [tabValue, setTabValue] = useState('1');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isBulk, setIsBulk] = useState(false);
  const [postId, setPostId] = useState();
  const [postIds, setPostIds] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [flag, setFlag] = useState('');
  const [flagLoading, setFlagLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [tileView, setTileView] = useState('4');
  const [allCheckBox, setAllCheckBox] = useState(false);
  const [commentsDrawerLoading, setCommentsDrawerLoading] = useState(false);
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);
  const [commentsPostData, setCommentsPostData] = useState([]);
  const [selectedCommentIds, setSelectedCommentIds] = useState([]);
  const [feedId, setFeedId] = useState();
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [drawerWidth, setDrawerWidth] = useState(
    window.innerWidth <= 768 ? '90%' : window.innerWidth <= 992 ? '90%' : '90%'
  );
  useEffect(() => {
    const handleResize = () => {
      setDrawerWidth(
        window.innerWidth <= 768 ? '90%' : window.innerWidth <= 992 ? '90%' : '90%'
      );
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    fetchGradeList();
  }, []);
  useEffect(() => {
    fetchPostsData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    if (commentsDrawerOpen) {
      fetchCommentsData({ feedId: feedId });
    }
  }, [currentCommentsPage]);
  useEffect(() => {
    handleFetchCommentsData();
  }, [commentsTabValue]);
  useEffect(() => {
    if (selectedGrade) {
      fetchSectionList();
    } else {
      setSectionList([]);
    }
    setSelectedSection();
  }, [selectedGrade]);
  useEffect(() => {
    handleFetchPostsData();
  }, [tabValue, selectedSection, selectedGrade]);

  const handleFetchPostsData = () => {
    if (currentPage === 1) {
      fetchPostsData();
    } else {
      setCurrentPage(1);
    }
  };
  const fetchPostsData = () => {
    let params = {
      acad_session: branch?.id,
      grades: selectedGrade?.grade_id,
      section_mapping: selectedSection?.id,
      post_status: tabValue,
      page: currentPage,
      page_size: pageSize,
    };
    setDataLoading(true);
    axiosInstance
      .get(`${endpointsV2.studentPosts.studentPostsApi}`, {
        params: params,
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setPostsData(response?.data?.result);
        }
      })
      .catch((error) => {
        notification.error({
          message: 'OOPS! Failed',
          description: 'Something went wrong. Please try again!',
        });
      })
      .finally(() => {
        setDataLoading(false);
      });
  };
  const handleFetchCommentsData = () => {
    if (currentCommentsPage === 1) {
      fetchCommentsData({ feedId: feedId });
    } else {
      setCurrentCommentsPage(1);
    }
  };
  const fetchCommentsData = ({ feedId }) => {
    let params = {
      feed_id: feedId,
      comments_status: commentsTabValue,
      page: currentCommentsPage,
      page_size: commentsPageSize,
    };
    setCommentsDrawerLoading(true);
    axiosInstance
      .get(`${endpointsV2.studentPosts.commentsApi}`, {
        params: params,
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setCommentsPostData(response?.data?.result);
          let data = response?.data?.result?.results;
          let ids = data?.map((each) => each?.id) || [];
          setSelectedCommentIds(ids);
        }
      })
      .catch((error) => {
        notification.error({
          message: 'OOPS! Failed',
          description: 'Something went wrong. Please try again!',
        });
      })
      .finally(() => {
        setCommentsDrawerLoading(false);
      });
  };

  const fetchGradeList = () => {
    setDataLoading(true);
    axiosInstance
      .get(
        `${endpoints.academics.grades}?session_year=${session_year}&branch_id=${branch?.branch?.id}`
      )
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setGradeList(response?.data?.data);
        }
      })
      .catch((error) => {
        notification.error({
          message: 'OOPS! Failed',
          description: 'Something went wrong. Please try again!',
        });
      })
      .finally(() => {
        setDataLoading(false);
      });
  };
  const fetchSectionList = () => {
    setDataLoading(true);
    axiosInstance
      .get(
        `${endpoints.academics.sections}?session_year=${session_year}&branch_id=${branch?.branch?.id}&grade_id=${selectedGrade?.grade_id}`
      )
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setSectionList(response?.data?.data);
        }
      })
      .catch((error) => {
        notification.error({
          message: 'OOPS! Failed',
          description: 'Something went wrong. Please try again!',
        });
      })
      .finally(() => {});
  };
  const handleCheckBox = (id) => {
    const updatedIds = [...postIds];
    const index = updatedIds.indexOf(id);
    if (index === -1) {
      updatedIds.push(id);
    } else {
      updatedIds.splice(index, 1);
    }
    setPostIds(updatedIds);
    setAllCheckBox(false);
  };
  const handleAllCheckBox = () => {
    if (allCheckBox) {
      setPostIds([]);
      setAllCheckBox(false);
    } else {
      let allIds = postsData?.results?.map((each) => each?.feed?.id);
      setPostIds(allIds);
      setAllCheckBox(true);
    }
  };
  const handleCommentsCheckBox = (id) => {
    const updatedIds = [...selectedCommentIds];
    const index = updatedIds.indexOf(id);
    if (index === -1) {
      updatedIds.push(id);
    } else {
      updatedIds.splice(index, 1);
    }
    setSelectedCommentIds(updatedIds);
  };

  const handleTabChange = (val) => {
    if (val !== tabValue) {
      setDataLoading(true);
    }
    setTabValue(val);
  };
  const handleCommentsTabChage = (val) => {
    if (val !== commentsTabValue) {
      setCommentsDrawerLoading(true);
    }
    setCommentsTabValue(val);
  };
  const handleUpdatePosts = () => {
    let postStatus;
    if (flag == 'approve') {
      postStatus = '2';
    } else if (flag === 'reject') {
      postStatus = '3';
    } else if (flag === 'cancel') {
      postStatus = '4';
    } else if (flag === 'restore') {
      postStatus = '1';
    }
    let data = [];
    if (isBulk) {
      postIds.forEach((id) => {
        data.push({
          id: id,
          post_status: postStatus,
        });
      });
    } else {
      data.push({
        id: postId,
        post_status: postStatus,
      });
    }
    setFlagLoading(true);
    axiosInstance
      .put(`${endpointsV2.studentPosts.studentPostsApi}`, {
        instances: data,
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          notification.success({
            message: 'Hurray! Success',
            description: 'Posts status updated',
          });
          closeModal();
          setPostIds([]);
          setAllCheckBox(false);
          fetchPostsData();
        }
      })
      .catch((error) => {
        notification.error({
          message: 'OOPS! Failed',
          description: 'Something went wrong. Please try again!',
        });
      })
      .finally(() => {
        setFlagLoading(false);
      });
  };
  const handleUpdateComments = ({ comment_id, key }) => {
    let commentsStatus;
    if (key == 'approve') {
      commentsStatus = '2';
    } else if (key === 'reject') {
      commentsStatus = '3';
    } else if (key === 'cancel') {
      commentsStatus = '4';
    } else if (key === 'restore') {
      commentsStatus = '1';
    }
    let data = [];
    if (key === 'approve') {
      selectedCommentIds.forEach((id) => {
        data.push({
          id: id,
          comments_status: commentsStatus,
        });
      });
    } else {
      data.push({
        id: comment_id,
        comments_status: commentsStatus,
      });
    }
    setCommentsDrawerLoading(true);
    axiosInstance
      .put(`${endpointsV2.studentPosts.commentsApi}`, {
        instances: data,
        feed_id: feedId,
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          notification.success({
            message: 'Hurray! Success',
            description: 'Comments status updated',
          });
          setSelectedCommentIds([]);
          fetchCommentsData({ feedId: feedId });
        }
      })
      .catch((error) => {
        notification.error({
          message: 'OOPS! Failed',
          description: 'Something went wrong. Please try again!',
        });
      })
      .finally(() => {
        setCommentsDrawerLoading(false);
      });
  };
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleDownloadAll = async (files) => {
    for (const item of files) {
      const data = item?.split('/').pop();
      const data1 = data?.split('.')[0].split('_');
      const fullName = data1.pop();
      await downloadFile(`${endpointsV2?.erp_googleapi}/${item}`, fullName);
    }
  };
  const downloadFile = async (url, fullName) => {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, fullName);
  };
  const openModal = ({ key, id }) => {
    setFlag(key);
    setModalOpen(true);
    setPostId(id);
  };
  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setFlag('');
    }, 500);
    setPostId();
  };
  const openCommentsDrawer = ({ postData }) => {
    fetchCommentsData({ feedId: postData?.id });
    setFeedId(postData?.id);
    setCommentsDrawerOpen(true);
  };
  const closeCommentsDrawer = () => {
    setCommentsDrawerOpen(false);
    setTimeout(() => {
      setSelectedCommentIds([]);
      setCommentsPostData([]);
    }, 500);
    fetchPostsData();
    setCommentsTabValue('1');
  };
  const openViewModal = ({ data }) => {
    setViewData(data);
    setViewModal(true);
  };
  const closeViewModal = () => {
    setViewModal(false);
    setViewData([]);
  };
  const getFullName = (data) => {
    let fullName = [
      data?.first_name ?? '',
      data?.middle_name ?? '',
      data?.last_name ?? '',
    ]
      .filter((namePart) => namePart !== '')
      .join(' ');
    return fullName;
  };
  return (
    <>
      <Layout>
        <div className='my-posts'>
          <div className='row pt-1 pb-1 px-3'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
              <div className='d-flex justify-content-between'>
                <Breadcrumb>
                  <Breadcrumb.Item className='th-black-1 th-16'>
                    Posts Moderation
                  </Breadcrumb.Item>
                </Breadcrumb>
                <Button
                  size='small'
                  className='th-secondary-button'
                  onClick={() => history.push('/school-wall')}
                >
                  Go to School Wall
                </Button>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
              <div className='th-bg-white th-br-4 py-1 shadow-sm'>
                <>
                  <div className='col-12 d-md-flex align-items-center justify-content-between mb-2'>
                    <div className='th-info-text mb-2'>
                      {tabValue === '1' &&
                        (isBulk
                          ? 'Please select posts to approve or reject'
                          : 'To approve or reject multiple posts at a time, please enable bulk action!')}
                    </div>
                    <div className='d-flex align-items-center'>
                      <Button
                        size='small'
                        icon={<EyeOutlined />}
                        onClick={() => {
                          if (tileView === '4') {
                            setTileView('1');
                          } else if (tileView === '1') {
                            setTileView('2');
                          } else {
                            setTileView('4');
                          }
                        }}
                        className='th-secondary-button'
                        style={{
                          marginRight: '0.5rem',
                        }}
                      >
                        {tileView === '4'
                          ? '1-Card'
                          : tileView === '1'
                          ? '2-Card'
                          : '4-Card'}
                        View
                      </Button>
                      {!selectedGrade && !selectedSection ? (
                        <div className='d-flex align-items-center'>
                          <Button
                            size='small'
                            icon={<FilterOutlined />}
                            onClick={() => {
                              setShowFilters((prevState) => !prevState);
                            }}
                            className='th-secondary-button'
                          >
                            {showFilters ? 'Hide' : 'Show'} Filters
                          </Button>
                        </div>
                      ) : (
                        <div className='d-flex align-items-center'>
                          <Button
                            size='small'
                            icon={<ClearOutlined />}
                            onClick={() => {
                              setSelectedGrade(null);
                              setSelectedSection(null);
                            }}
                            className='th-secondary-button'
                          >
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {showFilters && (
                    <>
                      <div className='col-12'>
                        {gradeList &&
                          gradeList.length > 0 &&
                          gradeList.map((each) => (
                            <Tag
                              key={each.id}
                              className={`custom-tag ${
                                selectedGrade?.grade_id === each.grade_id
                                  ? 'th-tag-active'
                                  : 'th-tag'
                              }`}
                              onClick={() =>
                                selectedGrade?.grade_id === each?.grade_id
                                  ? setSelectedGrade(null)
                                  : setSelectedGrade(each)
                              }
                            >
                              {each.grade_name}
                            </Tag>
                          ))}
                      </div>
                      <div className='col-12'>
                        {sectionList &&
                          sectionList.length > 0 &&
                          sectionList.map((each) => (
                            <Tag
                              key={each.id}
                              className={`custom-tag ${
                                selectedSection?.id === each.id
                                  ? 'th-tag-active'
                                  : 'th-tag'
                              }`}
                              onClick={() =>
                                selectedSection?.id === each.id
                                  ? setSelectedSection(null)
                                  : setSelectedSection(each)
                              }
                            >
                              {each.sec_name}
                            </Tag>
                          ))}
                      </div>
                    </>
                  )}
                </>
              </div>
              <div className='th-bg-white th-br-4 shadow-sm'>
                <div
                  className={`col-12 d-md-flex ${
                    tabValue === '1' ? 'justify-content-between' : 'justify-content-end'
                  }`}
                >
                  {tabValue === '1' && (
                    <div>
                      {isBulk ? (
                        <>
                          <div className='d-flex align-items-center'>
                            <Button
                              size='small'
                              onClick={() => {
                                setIsBulk(!isBulk);
                                setPostIds([]);
                                setAllCheckBox(false);
                              }}
                              className='th-secondary-button'
                              style={{
                                marginRight: '0.5rem',
                              }}
                            >
                              Close Bulk Action
                            </Button>
                            <span
                              style={{
                                marginRight: '0.5rem',
                              }}
                            >
                              Select All Posts
                            </span>
                            <Checkbox
                              className='check-box'
                              checked={allCheckBox}
                              onChange={() => handleAllCheckBox()}
                            />
                          </div>
                        </>
                      ) : (
                        <Button
                          size='small'
                          onClick={() => setIsBulk(!isBulk)}
                          className='th-secondary-button'
                        >
                          Enable Bulk Action
                        </Button>
                      )}
                    </div>
                  )}
                  {isBulk && postIds?.length > 0 && (
                    <div className='mt-2'>
                      <Button
                        size='small'
                        icon={<CheckCircleOutlined />}
                        onClick={() =>
                          openModal({
                            key: 'approve',
                          })
                        }
                        className='th-primary-button approve-button'
                      >
                        Approve Posts
                      </Button>
                      <Button
                        size='small'
                        icon={<CloseCircleOutlined />}
                        onClick={() =>
                          openModal({
                            key: 'reject',
                          })
                        }
                        className='th-primary-button reject-button'
                      >
                        Reject Posts
                      </Button>
                    </div>
                  )}
                  {!isBulk && (
                    <div>
                      <Button
                        className={`th-primary-button ${
                          tabValue === '1' ? 'th-pending-active' : 'th-pending'
                        }`}
                        onClick={() => handleTabChange('1')}
                        icon={<ReloadOutlined />}
                      >
                        Pending
                      </Button>
                      <Button
                        className={`th-primary-button ${
                          tabValue === '2' ? 'th-approved-active' : 'th-approved'
                        }`}
                        onClick={() => handleTabChange('2')}
                        icon={<CheckCircleOutlined />}
                      >
                        Approved
                      </Button>
                      <Button
                        className={`th-primary-button ${
                          tabValue === '3' ? 'th-rejected-active' : 'th-rejected'
                        }`}
                        onClick={() => handleTabChange('3')}
                        icon={<CloseCircleOutlined />}
                      >
                        Rejected
                      </Button>
                      <Button
                        className={`th-primary-button ${
                          tabValue === '4' ? 'th-cancelled-active' : 'th-cancelled'
                        }`}
                        onClick={() => handleTabChange('4')}
                        icon={<DeleteOutlined />}
                      >
                        Deleted
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <Divider orientation='left'>
                    {selectedGrade ? selectedGrade.grade_name : 'All Grades'} -{' '}
                    {selectedSection ? selectedSection.sec_name : 'All Sections'} -{' '}
                    {tabValue === '1'
                      ? 'Pending'
                      : tabValue === '2'
                      ? 'Approved'
                      : tabValue === '3'
                      ? 'Rejected'
                      : 'Deleted'}{' '}
                    Posts
                  </Divider>
                </div>
                <div
                  className='row px-2'
                  style={{
                    flexGrow: 1,
                  }}
                >
                  {dataLoading ? (
                    <Skeleton active />
                  ) : (
                    <>
                      {postsData &&
                        postsData?.results &&
                        postsData?.results?.length === 0 && (
                          <div
                            className='col-12 d-flex justify-content-center align-items-center'
                            style={{ height: '50vh' }}
                          >
                            <Empty
                              description={<i>No Posts Found For Given Filters</i>}
                            />
                          </div>
                        )}
                      {postsData &&
                        postsData?.results &&
                        postsData?.results?.length > 0 &&
                        postsData?.results.map((data, index) => {
                          const each = data?.feed;
                          return (
                            <div
                              className={`col-md-6 col-sm-12 col-12 py-2 px-1 ${
                                tileView === '4'
                                  ? 'col-lg-3'
                                  : tileView === '1'
                                  ? 'col-lg-12'
                                  : 'col-lg-6'
                              }`}
                              key={index}
                            >
                              <Card
                                className={`post-card div-card ${
                                  postIds.includes(each?.id) && 'bg-card'
                                }`}
                                bodyStyle={{
                                  height: '100%',
                                  overflowY: 'auto',
                                  scrollbarWidth: 'thin',
                                }}
                              >
                                <div className='div-card'>
                                  <div>
                                    <div className='d-flex justify-content-between'>
                                      <div className='d-flex'>
                                        <Image
                                          className='th-post-card-dp'
                                          src={
                                            each?.created_by?.profile_img
                                              ? each?.created_by?.profile_img
                                              : dummyProfilePic
                                          }
                                        />
                                        <div>
                                          <h6
                                            className='m-0 th-14 profile-name px-2'
                                            title={getFullName(each?.created_by)}
                                          >
                                            {[
                                              each?.created_by?.first_name ?? '',
                                              each?.created_by?.middle_name ?? '',
                                              each?.created_by?.last_name,
                                            ].join(' ')}
                                          </h6>
                                          <span className='py-1 px-2 th-br-12 mt-1 th-bg-grey mb-1 text-center th-10'>
                                            {[
                                              each?.section_mapping[0]
                                                ?.grade__grade_name ?? '',
                                              each?.section_mapping[0]
                                                ?.section__section_name ?? '',
                                            ].join(' ')}
                                          </span>
                                          <div className='th-10 th-grey px-2'>
                                            <i>
                                              {dayjs(each?.created_at).format(
                                                'DD MMM YYYY h:mm a'
                                              )}
                                            </i>
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className='d-flex flex-column'
                                        style={{
                                          marginRight: tabValue === '2' ? '10px' : '0px',
                                          marginTop: tabValue === '2' ? '10px' : '0px',
                                        }}
                                      >
                                        <div className='d-flex align-items-center'>
                                          {each?.media_files?.length > 0 && (
                                            <Tooltip title='View Files'>
                                              <Button
                                                shape='circle'
                                                size='small'
                                                icon={<FileOutlined />}
                                                className='icon-hover th-downloaded'
                                                onClick={() =>
                                                  openViewModal({ data: each })
                                                }
                                              />
                                            </Tooltip>
                                          )}
                                          {tabValue === '1' &&
                                            (isBulk ? (
                                              <Checkbox
                                                style={{
                                                  marginRight: '5px',
                                                }}
                                                className='check-box'
                                                checked={postIds.includes(each?.id)}
                                                onChange={() => handleCheckBox(each?.id)}
                                              />
                                            ) : (
                                              <div className='d-flex'>
                                                <Tooltip title='Approve Post'>
                                                  <Button
                                                    shape='circle'
                                                    size='small'
                                                    icon={<CheckOutlined />}
                                                    className='icon-hover th-approved'
                                                    onClick={() =>
                                                      openModal({
                                                        key: 'approve',
                                                        id: each?.id,
                                                      })
                                                    }
                                                  />
                                                </Tooltip>
                                                <Tooltip title='Reject Post'>
                                                  <Button
                                                    shape='circle'
                                                    size='small'
                                                    icon={<CloseOutlined />}
                                                    className='icon-hover th-rejected'
                                                    onClick={() =>
                                                      openModal({
                                                        key: 'reject',
                                                        id: each?.id,
                                                      })
                                                    }
                                                  />
                                                </Tooltip>
                                              </div>
                                            ))}
                                          {tabValue === '2' && (
                                            <>
                                              {each?.module_type_name === 'Posts' && (
                                                <Tooltip title='Delete Post'>
                                                  <Button
                                                    shape='circle'
                                                    size='small'
                                                    icon={<DeleteOutlined />}
                                                    className='icon-hover th-cancelled'
                                                    onClick={() =>
                                                      openModal({
                                                        key: 'cancel',
                                                        id: each?.id,
                                                      })
                                                    }
                                                  />
                                                </Tooltip>
                                              )}
                                            </>
                                          )}
                                          {tabValue === '2' && (
                                            <>
                                              <Badge
                                                count={data?.comments_count}
                                                overflowCount={9}
                                                status='error'
                                                className='th-custom-badge'
                                              >
                                                <Tooltip title='View Comments'>
                                                  <Button
                                                    shape='circle'
                                                    size='small'
                                                    icon={<CommentOutlined />}
                                                    className='icon-hover th-comments'
                                                    onClick={() =>
                                                      openCommentsDrawer({
                                                        postData: each,
                                                      })
                                                    }
                                                  />
                                                </Tooltip>
                                              </Badge>
                                            </>
                                          )}
                                          {tabValue === '3' && (
                                            <Tooltip title='Restore Post'>
                                              <Button
                                                shape='circle'
                                                size='small'
                                                icon={<ReloadOutlined />}
                                                className='icon-hover th-pending'
                                                onClick={() =>
                                                  openModal({
                                                    key: 'restore',
                                                    id: each?.id,
                                                  })
                                                }
                                              />
                                            </Tooltip>
                                          )}
                                        </div>
                                        {tabValue === '2' && (
                                          <div className='px-2 th-br-12 th-bg-violet text-center th-10 th-white'>
                                            <b>{each?.module_type_name}</b>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className='mt-2'>
                                      {tabValue === '2' && (
                                        <div>
                                          <div className='th-approved-text text-center'>
                                            Approved By :{' '}
                                            {
                                              <span
                                                title={getFullName(each?.published_by)}
                                              >
                                                {[
                                                  each?.published_by?.first_name ?? '',
                                                  each?.published_by?.middle_name ?? '',
                                                  each?.published_by?.last_name,
                                                ].join(' ')}
                                              </span>
                                            }
                                          </div>
                                        </div>
                                      )}
                                      {tabValue === '3' && (
                                        <div className='th-rejected-text text-center'>
                                          Rejected By :{' '}
                                          {
                                            <span title={getFullName(each?.published_by)}>
                                              {[
                                                each?.published_by?.first_name ?? '',
                                                each?.published_by?.middle_name ?? '',
                                                each?.published_by?.last_name,
                                              ].join(' ')}
                                            </span>
                                          }
                                        </div>
                                      )}
                                      {tabValue === '4' && (
                                        <div className='th-cancelled-text text-center'>
                                          Deleted By :{' '}
                                          {
                                            <span title={getFullName(each?.published_by)}>
                                              {[
                                                each?.published_by?.first_name ?? '',
                                                each?.published_by?.middle_name ?? '',
                                                each?.published_by?.last_name,
                                              ].join(' ')}
                                            </span>
                                          }
                                        </div>
                                      )}
                                    </div>
                                    <div className='mt-2 position-relative'>
                                      <TextCollapse content={each?.description} />
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          );
                        })}
                    </>
                  )}
                </div>
                <div className='d-flex justify-content-center py-2'>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    onChange={(page) => {
                      setCurrentPage(page);
                    }}
                    total={postsData?.count}
                  />
                </div>
              </div>
            </div>
          </div>
          <Modal
            title={
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  {flag === 'approve'
                    ? 'Approving Post(s)'
                    : flag === 'reject'
                    ? 'Rejecting Post(s)'
                    : flag === 'cancel'
                    ? 'Deleting Post(s)'
                    : 'Restoring Post(s)'}
                </div>
                <div>
                  <CloseOutlined onClick={closeModal} className='th-close-icon-1' />
                </div>
              </div>
            }
            visible={modalOpen}
            onCancel={closeModal}
            className={`my-posts ${
              flag === 'approve'
                ? 'th-modal-approved'
                : flag === 'reject'
                ? 'th-modal-rejected'
                : flag === 'cancel'
                ? 'th-modal-cancelled'
                : 'th-modal-pending'
            }`}
            footer={[
              <Row justify='end'>
                <Col>
                  <Button
                    size='small'
                    className='th-secondary-button footer-button'
                    onClick={closeModal}
                  >
                    Close
                  </Button>
                </Col>
                <Col>
                  <Button
                    size='small'
                    className={`th-primary-button footer-button ${
                      flag === 'approve'
                        ? 'approve-button'
                        : flag === 'reject'
                        ? 'reject-button'
                        : flag === 'cancel'
                        ? 'cancel-button'
                        : 'restore-button'
                    }`}
                    icon={
                      flag === 'approve' ? (
                        <CheckCircleOutlined />
                      ) : flag === 'reject' ? (
                        <CloseCircleOutlined />
                      ) : flag === 'cancel' ? (
                        <DeleteOutlined />
                      ) : (
                        <ReloadOutlined />
                      )
                    }
                    onClick={() => handleUpdatePosts()}
                    disabled={flagLoading}
                  >
                    {flag === 'approve'
                      ? 'Approve'
                      : flag === 'reject'
                      ? 'Reject'
                      : flag === 'cancel'
                      ? 'Delete'
                      : 'Restore'}
                  </Button>
                </Col>
              </Row>,
            ]}
          >
            {flagLoading ? (
              <div className='d-flex justify-content-center align-items-center'>
                <Spin tip='Hold on! Great things take time!' size='large' />
              </div>
            ) : (
              <div>
                Are You Sure To{' '}
                {flag === 'approve'
                  ? 'Approve'
                  : flag === 'reject'
                  ? 'Reject'
                  : flag === 'cancel'
                  ? 'Delete'
                  : 'Restore'}{' '}
                <b>{postIds.length ? postIds.length : ''}</b> Post(s) ?
              </div>
            )}
          </Modal>
          <Drawer
            title={
              <div className='d-flex justify-content-between align-items-center'>
                <div>Post Comments</div>
                <div>
                  <CloseOutlined
                    onClick={closeCommentsDrawer}
                    className='th-close-icon-1'
                  />
                </div>
              </div>
            }
            visible={commentsDrawerOpen}
            onClose={closeCommentsDrawer}
            footer={[
              <Row justify='space-around'>
                <Col>
                  <Button
                    size='small'
                    className='th-secondary-button footer-button'
                    onClick={closeCommentsDrawer}
                  >
                    Close
                  </Button>
                </Col>
                {commentsTabValue === '1' && (
                  <Col>
                    <Button
                      size='small'
                      className={`th-primary-button footer-button primary-button`}
                      icon={<CheckCircleOutlined />}
                      onClick={() =>
                        handleUpdateComments({
                          key: 'approve',
                        })
                      }
                      disabled={commentsDrawerLoading}
                    >
                      Approve Comments
                    </Button>
                  </Col>
                )}
              </Row>,
            ]}
            className='my-posts'
            closeIcon={false}
            width={drawerWidth}
          >
            <>
              <div className='col-12 d-flex justify-content-end mb-2'>
                <div>
                  <Button
                    size='small'
                    className={`th-primary-button ${
                      commentsTabValue === '1' ? 'th-pending-active' : 'th-pending'
                    }`}
                    onClick={() => handleCommentsTabChage('1')}
                    icon={<ReloadOutlined />}
                  >
                    Pending
                  </Button>
                  <Button
                    size='small'
                    className={`th-primary-button ${
                      commentsTabValue === '2' ? 'th-approved-active' : 'th-approved'
                    }`}
                    onClick={() => handleCommentsTabChage('2')}
                    icon={<CheckCircleOutlined />}
                  >
                    Approved
                  </Button>
                  <Button
                    size='small'
                    className={`th-primary-button ${
                      commentsTabValue === '3' ? 'th-rejected-active' : 'th-rejected'
                    }`}
                    onClick={() => handleCommentsTabChage('3')}
                    icon={<CloseCircleOutlined />}
                  >
                    Rejected
                  </Button>
                  <Button
                    size='small'
                    className={`th-primary-button ${
                      commentsTabValue === '4' ? 'th-cancelled-active' : 'th-cancelled'
                    }`}
                    onClick={() => handleCommentsTabChage('4')}
                    icon={<DeleteOutlined />}
                  >
                    Deleted
                  </Button>
                </div>
              </div>
              <div>
                <Divider orientation='left'>
                  {commentsTabValue === '1'
                    ? 'Pending'
                    : commentsTabValue === '2'
                    ? 'Approved'
                    : commentsTabValue === '3'
                    ? 'Rejected'
                    : 'Deleted'}{' '}
                  Comments
                </Divider>
              </div>
              <div
                className='row'
                style={{
                  flexGrow: 1,
                }}
              >
                {commentsDrawerLoading ? (
                  <Skeleton active />
                ) : (
                  <>
                    {commentsPostData &&
                      commentsPostData?.results &&
                      commentsPostData?.results?.length === 0 && (
                        <div
                          className='col-12 d-flex justify-content-center align-items-center'
                          style={{ height: '100%' }}
                        >
                          <Empty description={<i>No Comments Found</i>} />
                        </div>
                      )}
                    {commentsPostData &&
                      commentsPostData?.results &&
                      commentsPostData?.results?.length > 0 &&
                      commentsPostData?.results.map((each) => (
                        <>
                          <div
                            className='col-lg-3 col-md-6 col-sm-12 col-12 mb-2'
                            key={each.id}
                          >
                            <Card
                              className={`post-card div-card ${
                                commentsTabValue === '1' &&
                                selectedCommentIds.includes(each?.id) &&
                                'bg-card'
                              }`}
                            >
                              <div>
                                <div className='d-flex justify-content-between'>
                                  <div className='d-flex'>
                                    <Image
                                      className='th-post-card-dp'
                                      src={
                                        each?.created_by?.profile_img
                                          ? each?.created_by?.profile_img
                                          : dummyProfilePic
                                      }
                                    />
                                    <div>
                                      <h6
                                        className='m-0 th-14 profile-name'
                                        title={getFullName(each?.commented_by)}
                                      >
                                        {[
                                          each?.commented_by?.first_name ?? '',
                                          each?.commented_by?.middle_name ?? '',
                                          each?.commented_by?.last_name,
                                        ].join(' ')}
                                      </h6>
                                      <span className='py-1 px-2 th-br-12 mt-1 th-bg-grey mb-1 text-center th-10'>
                                        <i>
                                          {dayjs(each?.created_at).format(
                                            'DD MMM YYYY h:mm:ss a'
                                          )}
                                        </i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className='d-flex align-items-center'>
                                    {commentsTabValue === '1' && (
                                      <>
                                        {!selectedCommentIds.includes(each?.id) && (
                                          <Popconfirm
                                            title='Are you sure to reject ?'
                                            overlayStyle={{ zIndex: 2001 }}
                                            okText='Yes'
                                            cancelText='No'
                                            onConfirm={() =>
                                              handleUpdateComments({
                                                key: 'reject',
                                                comment_id: each?.id,
                                              })
                                            }
                                          >
                                            <Tooltip
                                              title='Reject Comment'
                                              overlayStyle={{ zIndex: 2001 }}
                                            >
                                              <Button
                                                shape='circle'
                                                size='small'
                                                icon={<CloseOutlined />}
                                                className='icon-hover th-rejected'
                                              />
                                            </Tooltip>
                                          </Popconfirm>
                                        )}
                                        <Checkbox
                                          className='check-box'
                                          checked={selectedCommentIds.includes(each?.id)}
                                          onChange={() =>
                                            handleCommentsCheckBox(each?.id)
                                          }
                                        />
                                      </>
                                    )}
                                    {commentsTabValue === '2' && (
                                      <>
                                        <Popconfirm
                                          title='Are you sure to delete ?'
                                          overlayStyle={{ zIndex: 2001 }}
                                          okText='Yes'
                                          cancelText='No'
                                          onConfirm={() =>
                                            handleUpdateComments({
                                              key: 'cancel',
                                              comment_id: each?.id,
                                            })
                                          }
                                        >
                                          <Tooltip
                                            title='Delete Comment'
                                            overlayStyle={{ zIndex: 2001 }}
                                          >
                                            <Button
                                              shape='circle'
                                              size='small'
                                              icon={<DeleteOutlined />}
                                              className='icon-hover th-cancelled'
                                            />
                                          </Tooltip>
                                        </Popconfirm>
                                      </>
                                    )}
                                    {commentsTabValue === '3' && (
                                      <>
                                        <Popconfirm
                                          title='Are you sure to restore ?'
                                          overlayStyle={{ zIndex: 2001 }}
                                          okText='Yes'
                                          cancelText='No'
                                          onConfirm={() =>
                                            handleUpdateComments({
                                              key: 'restore',
                                              comment_id: each?.id,
                                            })
                                          }
                                        >
                                          <Tooltip
                                            title='Restore Comment'
                                            overlayStyle={{ zIndex: 2001 }}
                                          >
                                            <Button
                                              shape='circle'
                                              size='small'
                                              icon={<ReloadOutlined />}
                                              className='icon-hover th-pending'
                                            />
                                          </Tooltip>
                                        </Popconfirm>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className='mt-2 position-relative'>
                                  <span>{each?.description}</span>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </>
                      ))}
                    {commentsPostData &&
                      commentsPostData.results &&
                      commentsPostData.count > 32 && (
                        <div className='col-12 d-flex justify-content-center py-2'>
                          <Pagination
                            current={currentCommentsPage}
                            pageSize={commentsPageSize}
                            showSizeChanger={false}
                            onChange={(page) => {
                              setCurrentCommentsPage(page);
                            }}
                            total={commentsPostData.count}
                          />
                        </div>
                      )}
                  </>
                )}
              </div>
            </>
          </Drawer>
          <Modal
            title={
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  {viewData?.media_files?.length > 0 && (
                    <Button
                      size='small'
                      icon={<CloudDownloadOutlined />}
                      className='th-secondary-button'
                      onClick={() => {
                        handleDownloadAll(viewData?.media_files);
                      }}
                    >
                      Download All
                    </Button>
                  )}
                </div>
                <div>
                  <CloseOutlined onClick={closeViewModal} className='th-close-icon-2' />
                </div>
              </div>
            }
            visible={viewModal}
            onCancel={closeViewModal}
            footer={false}
            centered
            className='my-posts'
          >
            <div className=''>
              <Slider {...settings} className='my-media-slider'>
                {viewData?.media_files?.map((each) => (
                  <MediaDisplay
                    mediaName={each}
                    mediaLink={each}
                    alt={each?.description}
                    className='w-100 th-br-20 p-3'
                    style={{ objectFit: 'contain' }}
                  />
                ))}
              </Slider>
            </div>
          </Modal>
        </div>
      </Layout>
    </>
  );
};

export default PostsModeration;
