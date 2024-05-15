import Layout from 'containers/Layout';
import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Button,
  List,
  Skeleton,
  Card,
  Avatar,
  Input,
  message,
  Row,
  Col,
  DatePicker,
  Select,
  Result,
} from 'antd';
import Loader from './Loader';
import PostCard from './postCard';
import { SendOutlined, DownOutlined, FilterOutlined } from '@ant-design/icons';
import axiosInstance from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import CreatePost from './CreatePost';
import LikesModal from './LikesModal';
import { Profanity } from 'components/file-validation/Profanity';
import { useSelector } from 'react-redux';
import moment from 'moment';
import RecentAnnouncements from '../../TeacherDashboard/components/Announcement';

const { Option } = Select;
const { RangePicker } = DatePicker;

const SchoolWall = () => {
  const { user_id, first_name, last_name, user_level } = JSON.parse(
    localStorage?.getItem('userDetails')
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const branchList = useSelector((state) => state.commonFilterReducer?.branchList);
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [selectedPostID, setSelectedPostID] = useState(false);
  const [selectedPost, setSelectedPost] = useState();
  const [selectedPostIndex, setSelectedPostIndex] = useState();
  const [pageDetails, setPageDetails] = useState({ current: 1, total: 0 });
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedAcadSession, setSelectedAcadSession] = useState([]);
  const [gradeID, setGradeID] = useState([]);
  const [uniqueGradeId, setUniqueGradeId] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [sectionID, setSectionID] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [heirarchyConfig, setHeirarchyConfig] = useState({});
  const [category, setCategory] = useState();
  const [payload, setPayload] = useState({ page: 1, page_size: 10 });
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filterLoading, setFilterLoading] = useState(false);

  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
    }
  };

  const handleClosePostModal = () => {
    setShowCreatePostModal(false);
    setSelectedPost(null);
    setSelectedPostIndex(null);
  };

  const handleShowLikesModal = (id) => {
    setSelectedPostID(id);
    setShowLikesModal(true);
  };

  const handleCloseLikesModal = () => {
    setShowLikesModal(false);
    setSelectedPostID(null);
  };

  const handleEditPost = (index, data) => {
    setSelectedPost(data);
    setSelectedPostIndex(index);
    setShowCreatePostModal(true);
  };
  const handleUpdatedPost = (data) => {
    let newList = postList?.slice();
    newList[selectedPostIndex] = data;
    setPostList(newList);
  };

  const fetchNewPosts = () => {
    if (pageDetails?.current !== 1) {
      setPayload((prevState) => ({ ...prevState, page: 1 }));
      setPageDetails((prevState) => ({ ...prevState, current: 1 }));
    } else {
      fetchPosts({ ...payload });
    }
  };

  const fetchPosts = (params = {}) => {
    axiosInstance
      .get(`${endpoints?.schoolWall?.getPosts}`, {
        params: {
          ...params,
        },
      })
      .then((response) => {
        if (response?.data?.status_code === 200) {
          if (response?.data?.result?.current_page === 1) {
            setPostList([...response?.data?.result?.results]);
          } else {
            setPostList((prev) => [...prev, ...response?.data?.result?.results]);
          }
          setPageDetails((prev) => ({ ...prev, total: response?.data?.result?.count }));
          window.dispatchEvent(new Event('resize'));
        }
      })
      .catch((err) => message.error(err?.message))
      .finally(() => {
        setLoading(false);
        setMoreLoading(false);
        setFilterLoading(false);
      });
  };

  const fetchMoreData = () => {
    setMoreLoading(true);
    setPageDetails((prev) => ({ ...prev, current: prev?.current + 1 }));
    setPayload((prevState) => ({ ...prevState, page: prevState?.page + 1 }));
  };

  const loadMore = loading ? null : !moreLoading && !loading ? (
    <div className='my-3 text-center '>
      <Button onClick={fetchMoreData} type='link'>
        Load more posts
      </Button>
    </div>
  ) : (
    <Card className='my-3 th-bg-white th-br-20'>
      {[1, 2, 3]?.map((item) => (
        <Skeleton avatar title={false} loading={moreLoading} active></Skeleton>
      ))}
    </Card>
  );

  const handleLikePost = (index, selectedPostID) => {
    let newList = postList?.slice();
    if (newList[index]['is_like']) {
      newList[index]['is_like'] = false;
      newList[index]['likes_count'] -= 1;
    } else {
      newList[index]['is_like'] = true;
      newList[index]['likes_count'] += 1;
    }
    setPostList(newList);
    let formData = new FormData();
    formData.append('post_id', selectedPostID);
    axiosInstance
      .post(`${endpoints?.schoolWall?.likePost}`, formData)
      .then((res) => {
        if (res?.data?.status_code == 200) {
        }
      })
      .catch((err) => {
        console.log('Error in post like');
      });
  };

  const handleAddComment = (index, selectedPostId, description) => {
    if (Profanity(description)) {
      message.error('Comment contains foul words, please remove them');
      return;
    }

    let formData = new FormData();
    formData.append('post', selectedPostId);
    formData.append('description', description);
    formData.append('commented_by', user_id);

    axiosInstance
      .post(`${endpoints?.schoolWall?.comments}`, formData)
      .then((res) => {
        if (res?.data?.status_code == 200) {
          let newList = postList?.slice();
          newList[index]['comments_count'] += 1;
          newList[index]['recent_comment'] = {
            commented_by: {
              first_name,
              last_name,
            },
            description: res?.data?.result?.description,
            created_at: res?.data?.result?.created_at,
          };
          setPostList(newList);
        }
      })
      .catch((err) => {
        message.error('Something went wrong w2!!');
      });
  };

  const handleDeletePost = (index, selectedPostID) => {
    let list = postList.slice();
    list.splice(index, 1);
    setPostList(list);
    const params = {
      post_id: selectedPostID,
    };
    axiosInstance
      .delete(`${endpoints?.schoolWall?.getPosts}`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          message.success(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log('Error in post delete');
      });
  };

  const fetchGradeData = (params = {}) => {
    axiosInstance
      .get(`/erp_user/grademapping/`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          let data = res?.data?.data;
          const uniqueGradesMap = new Map();
          data.forEach((item) => {
            if (!uniqueGradesMap.has(item.grade_id)) {
              uniqueGradesMap.set(item.grade_id, {
                grade_id: item.grade_id,
                grade_name: item.grade_name,
              });
            }
          });
          const uniqueGrades = Array.from(uniqueGradesMap.values());
          setGradeData(uniqueGrades);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchSectionData = (params = {}) => {
    axiosInstance
      .get(`/erp_user/sectionmapping/`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setSectionData(res?.data?.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchCategoryData = (params = {}) => {
    axiosInstance
      .get(`/social-media/post-category-list/`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setCategoryData(res?.data?.result);
        } else {
          setCategoryData([]);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchHeirarchyConfig = (params = {}) => {
    axiosInstance
      .get(`/assessment/check-sys-config/`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setHeirarchyConfig(JSON.parse(res?.data?.result[0].replace(/'/g, '"')));
        } else {
          setHeirarchyConfig({});
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const branchOptions = branchList?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={each.branch?.id} acad_session={each?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });
  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each.grade_id} gradeId={each?.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });
  const sectionsOptions = sectionData?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.section__section_name}
      </Option>
    );
  });
  const categoryOptions = categoryData?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.category_name}
      </Option>
    );
  });

  const handleBranch = (each) => {
    setGradeID([]);
    setUniqueGradeId([]);
    setGradeData([]);
    setSectionData([]);
    setSectionID([]);
    if (each?.length > 0) {
      let branchParam = [];
      if (each.some((item) => item.value === 'all')) {
        const allBranches = branchList.map((item) => item?.branch?.id);
        branchParam = allBranches;
        setSelectedBranch(allBranches);
        setSelectedAcadSession(branchList?.map((item) => item?.id));
      } else {
        setSelectedBranch(each.map((item) => item.value));
        setSelectedAcadSession(each.map((item) => item.acad_session));
        branchParam = each.map((item) => item.value);
      }
      fetchGradeData({
        session_year: selectedAcademicYear?.id,
        branch_id: branchParam?.join(','),
      });
    } else {
      setSelectedAcadSession([]);
      setSelectedBranch([]);
    }
  };

  const handleGrade = (each) => {
    setSectionData([]);
    setSectionID([]);
    if (each?.length > 0) {
      let gradeParam;
      if (each.some((item) => item.value === 'all')) {
        const allGrades = [...new Set(gradeData.map((item) => item.id))];
        const allGradeID = [...new Set(gradeData.map((item) => item.grade_id))];
        gradeParam = allGrades;
        setGradeID(allGrades);
        setUniqueGradeId(allGradeID);
      } else {
        setUniqueGradeId([...new Set(each.map((item) => item.gradeId))]);
        setGradeID([...new Set(each.map((item) => item.value))]);
        gradeParam = [...new Set(each.map((item) => item.value))];
      }
      fetchSectionData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.join(','),
        grade_id: gradeParam?.join(','),
      });
    } else {
      setGradeID([]);
      setUniqueGradeId([]);
    }
  };

  const handleChangeSection = (each) => {
    if (each.some((item) => item.value === 'all')) {
      setSectionID(sectionData?.map((item) => item?.id));
    } else {
      setSectionID([...new Set(each.map((item) => item.value))]);
    }
  };

  const handleFilteredData = () => {
    let payload = { page: 1, page_size: 10 };
    if (selectedAcadSession) {
      payload['acad_session'] = selectedAcadSession?.join(',');
    }
    if (uniqueGradeId?.length > 0) {
      payload['grades'] = uniqueGradeId?.join(',');
    }
    if (sectionID.length > 0) {
      payload['sections'] = sectionID?.join(',');
    }
    if (category) {
      payload['category'] = category;
    }
    if (startDate && endDate) {
      payload['start_date '] = moment(startDate).format('YYYY-MM-DD');
      payload['end_date '] = moment(endDate).format('YYYY-MM-DD');
    }
    setFilterLoading(true);
    setPayload(payload);
  };

  const ClearFilters = () => {
    setSectionData([]);
    setSectionID([]);
    setGradeID([]);
    setUniqueGradeId([]);
    setFilterLoading(true);
    setPayload({ page: 1, page_size: 10 });
    if (branchList.length > 1) {
      setGradeData([]);
      setSelectedBranch([]);
      setSelectedAcadSession([]);
    }
  };

  const handleAllowDeletePost = (currentPost) => {
    if (currentPost?.user?.id === user_id) {
      return true;
    } else {
      if (
        Object.keys(heirarchyConfig)?.includes(currentPost?.user?.user_level?.toString())
      ) {
        if (
          heirarchyConfig[currentPost?.user?.user_level].includes(user_level?.toString())
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  };

  useEffect(() => {
    fetchPosts(payload);
  }, [payload]);

  useEffect(() => {
    fetchCategoryData();
    fetchHeirarchyConfig({ config_key: 'post-edit-permission' });
  }, []);
  return (
    <Layout>
      <div className='row'>
        <div className='col-md-12 px-md-4'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/school-wall' className='th-black-1 th-16'>
              School Wall
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className='col-md-8 py-3 px-md-4'>
              {user_level !== 13 && (
                <Card className='th-bg-white th-br-20'>
                  <div className='d-flex align-items-center th-pointer justify-content-between'>
                    <div
                      className='d-flex w-100 align-items-center'
                      onClick={() => {
                        setShowCreatePostModal(true);
                      }}
                    >
                      <Avatar
                        src={
                          'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg'
                        }
                        alt='user'
                      />
                      <Input
                        bordered={false}
                        readOnly
                        placeholder='Create your post...'
                        suffix={<SendOutlined />}
                        className='th-14 py-2 ml-3 th-br-12 th-grey mb-1 th-bg-grey '
                      />
                    </div>
                    <Button
                      type='link'
                      icon={<FilterOutlined />}
                      onClick={() => {
                        setShowFilters((prevState) => !prevState);
                        if (branchList.length === 1) {
                          setSelectedAcadSession([branchList[0]?.id]);
                          setSelectedBranch(branchList[0]?.branch?.id);
                          fetchGradeData({
                            session_year: selectedAcademicYear?.id,
                            branch_id: branchList[0]?.branch?.id,
                          });
                        }
                      }}
                    >
                      {showFilters ? 'Hide' : 'Show'} Filters
                    </Button>
                  </div>

                  <Row
                    gutter={[16, 16]}
                    className={`${showFilters ? '' : 'd-none'} py-3`}
                  >
                    {branchList?.length > 1 && (
                      <Col span={8}>
                        <Select
                          style={{ borderRadius: 16 }}
                          allowClear
                          placeholder='Select Branch*'
                          showSearch
                          maxTagCount={1}
                          mode='multiple'
                          value={selectedBranch}
                          required={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(e, value) => {
                            handleBranch(value);
                          }}
                          className='w-100 text-left th-black-1 th-select'
                        >
                          {branchList?.length > 1 && (
                            <>
                              <Option key={0} value={'all'}>
                                All
                              </Option>
                            </>
                          )}
                          {branchOptions}
                        </Select>
                      </Col>
                    )}
                    <Col span={8}>
                      <Select
                        allowClear
                        placeholder='Select Grade*'
                        showSearch
                        mode='multiple'
                        suffixIcon={<DownOutlined className='th-grey' />}
                        maxTagCount={1}
                        required={true}
                        value={gradeID}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        optionFilterProp='children'
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(e, value) => {
                          handleGrade(value);
                        }}
                        className='w-100 text-left th-black-1 th-select'
                      >
                        {gradeData?.length > 1 && (
                          <>
                            <Option key={0} value={'all'}>
                              All
                            </Option>
                          </>
                        )}
                        {gradeOptions}
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Select
                        placeholder='Select Sections'
                        showSearch
                        required={true}
                        mode='multiple'
                        maxTagCount={1}
                        value={sectionID}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        optionFilterProp='children'
                        suffixIcon={<DownOutlined className='th-grey' />}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(e, value) => {
                          handleChangeSection(value);
                        }}
                        allowClear
                        className='w-100 text-left th-black-1 th-select'
                      >
                        {sectionData?.length > 1 && (
                          <>
                            <Option key={0} value={'all'}>
                              All
                            </Option>
                          </>
                        )}
                        {sectionsOptions}
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Select
                        placeholder='Select Category'
                        showSearch
                        required={true}
                        value={category}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        optionFilterProp='children'
                        suffixIcon={<DownOutlined className='th-grey' />}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(e) => {
                          setCategory(e);
                        }}
                        allowClear
                        className='w-100 text-left th-black-1 th-br-4 th-select'
                      >
                        {categoryOptions}
                      </Select>
                    </Col>
                    <Col span={8}>
                      <RangePicker
                        allowClear={false}
                        placement='bottomRight'
                        showToday={false}
                        // suffixIcon={<DownOutlined />}
                        value={[moment(startDate), moment(endDate)]}
                        onChange={(value) => handleDateChange(value)}
                        separator={'to'}
                        format={'DD/MM/YYYY'}
                      />
                    </Col>
                    <Col span={8}>
                      <div className='d-flex justify-content-between '>
                        <Button
                          type='default'
                          className='th-br-8 w-50 mr-2'
                          onClick={ClearFilters}
                        >
                          Clear
                        </Button>
                        <Button
                          type='primary'
                          loading={filterLoading}
                          onClick={handleFilteredData}
                          className='th-br-8 w-50'
                        >
                          Filter
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}
              <div className='th-posts-list'>
                {filterLoading ? (
                  <Card className='my-3 th-bg-white th-br-20'>
                    {[...Array(6)]?.map((item) => (
                      <Skeleton
                        avatar
                        title={false}
                        loading={filterLoading}
                        active
                      ></Skeleton>
                    ))}
                  </Card>
                ) : postList?.length > 0 ? (
                  <List
                    className='demo-loadmore-list '
                    itemLayout='horizontal'
                    loadMore={postList.length < pageDetails?.total ? loadMore : null}
                    bordered={false}
                    dataSource={postList}
                    renderItem={(each, index) => (
                      <List.Item>
                        {' '}
                        <PostCard
                          index={index}
                          post={each}
                          handleAllowDeletePost={handleAllowDeletePost}
                          handleShowLikesModal={handleShowLikesModal}
                          handleAddComment={handleAddComment}
                          likePost={() => {
                            handleLikePost(index, each?.id);
                          }}
                          handleDeletePost={() => {
                            handleDeletePost(index, each?.id);
                          }}
                          handleEditPost={() => handleEditPost(index, each)}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Card className='th-br-20 my-3 text-center py-3'>
                    <Result
                      status='404'
                      title='No Data'
                      subTitle={
                        Object.keys(payload).length > 0
                          ? 'No posts available, try different filters'
                          : 'No posts to show at this moment'
                      }
                    />
                  </Card>
                )}
              </div>
            </div>
            <div className='col-lg-4 py-3 pl-lg-0'>
              <RecentAnnouncements isSchoolWall={true} scrollHeight={'60vh'} />
            </div>
          </>
        )}
      </div>
      {showCreatePostModal && (
        <CreatePost
          showCreatePostModal={showCreatePostModal}
          handleClosePostModal={handleClosePostModal}
          fetchNewPosts={fetchNewPosts}
          selectedPost={selectedPost}
          handleUpdatedPost={handleUpdatedPost}
        />
      )}
      {showLikesModal && (
        <LikesModal
          showLikesModal={showLikesModal}
          handleCloseLikesModal={handleCloseLikesModal}
          selectedPostId={selectedPostID}
        />
      )}
    </Layout>
  );
};

export default SchoolWall;
