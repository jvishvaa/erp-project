import Layout from 'containers/Layout';
import React, { useEffect, useRef, useState } from 'react';
import {
  Breadcrumb,
  Button,
  List,
  Skeleton,
  Card,
  Avatar,
  Input,
  message,
  Form,
  DatePicker,
  Select,
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
import RecentAnnouncements from '../../TeacherDashboard/components/Announcement';
import NoDataIcon from 'v2/Assets/images/no_data.gif';

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
  const formRef = useRef();
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
      setPageDetails((prevState) => ({ ...prevState, current: 1 }));
    } else {
      fetchPosts({ page: pageDetails?.current });
    }
  };

  const fetchPosts = (params = {}) => {
    axiosInstance
      .get(`${endpoints?.schoolWall?.getPosts}`, {
        params: {
          ...params,
          page_size: 10,
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
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
        setMoreLoading(false);
      });
  };

  const fetchMoreData = () => {
    setMoreLoading(true);
    setPageDetails((prev) => ({ ...prev, current: prev?.current + 1 }));
  };

  useEffect(() => {
    fetchPosts({ page: pageDetails?.current });
  }, [pageDetails?.current]);

  useEffect(() => {
    fetchCategoryData();
    fetchHeirarchyConfig({ config_key: 'post-edit-permission' });
  }, []);

  const loadMore = loading ? null : !moreLoading && !loading ? (
    <div className='my-3 text-center '>
      <Button onClick={fetchMoreData} type='link'>
        Load more posts
      </Button>
    </div>
  ) : (
    <Card className='my-3 th-bg-white'>
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
          console.log('Post Liked');
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
        console.log('Error in post like');
      });
  };

  const fetchGradeData = (params = {}) => {
    axiosInstance
      .get(`/erp_user/grademapping/`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeData(res?.data?.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchSectionData = (params = {}) => {
    axiosInstance
      .get(`/erp_user/v2/sectionmapping-list/`, { params: { ...params } })
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
      <Option key={each?.id} value={each.id} gradeId={each?.grade_id}>
        {each?.grade__grade_name}
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
      let branchParam;
      if (each.some((item) => item.value === 'all')) {
        const allBranches = branchList.map((item) => item?.branch?.id);
        branchParam = allBranches;
        setSelectedBranch(allBranches);
        setSelectedAcadSession(branchList?.map((item) => item?.id));
      } else {
        setSelectedBranch(each.map((item) => item.value).join(','));
        setSelectedAcadSession(each.map((item) => item.acad_session));
        branchParam = each.map((item) => item.value).join(',');
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
        branch_id: selectedBranch,
        section_mapping_ids: gradeParam?.join(','),
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

  const handleFilteredData = () => {
    const updatedValues = formRef.current.getFieldsValue();
    console.log({ gradeID, selectedAcadSession, sectionID, selectedBranch });
    console.log('asdsadasdasd', updatedValues?.date);
    let payload = { page: 1, page_size: 10 };
    if (selectedAcadSession) {
      payload['acad_session'] = selectedAcadSession?.join(',');
    }
    if (gradeID?.length > 0) {
      payload['grades'] = gradeID?.join(',');
    }
    if (sectionID.length > 0) {
      payload['sections'] = sectionID?.join(',');
    }
    if (category) {
      payload['category'] = category;
    }
    fetchPosts(payload);
  };
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

                  <Form
                    className={showFilters ? '' : 'd-none'}
                    id='filterForm'
                    ref={formRef}
                    layout={'vertical'}
                    onFinish={handleFilteredData}
                  >
                    <div className='d-flex py-3 flex-wrap align-items-end'>
                      {branchList?.length > 1 && (
                        <div className='col-4'>
                          <Form.Item name='branch' label='Branch'>
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
                              className='w-100 text-left th-black-1 th-br-16'
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
                          </Form.Item>
                        </div>
                      )}
                      <div className='col-4'>
                        <Form.Item name='grade' label='Grade'>
                          <Select
                            allowClear
                            placeholder='Select Grade*'
                            showSearch
                            mode='multiple'
                            suffixIcon={<DownOutlined className='th-grey' />}
                            maxTagCount={1}
                            required={true}
                            value={selectedBranch}
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
                              handleGrade(value);
                            }}
                            className='w-100 text-left th-black-1 th-br-4'
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
                        </Form.Item>
                      </div>
                      <div className='col-4'>
                        <Form.Item name='section' label='Sections'>
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
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            onChange={(e, value) => {
                              handleChangeSection(value);
                            }}
                            allowClear
                            className='w-100 text-left th-black-1 th-br-4'
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
                        </Form.Item>
                      </div>
                      <div className='col-4'>
                        <Form.Item name='category' label='Category'>
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
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            onChange={(e) => {
                              setCategory(e);
                            }}
                            allowClear
                            className='w-100 text-left th-black-1 th-br-4'
                          >
                            {categoryOptions}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className='col-4'>
                        <Form.Item name='date' label='Range'>
                          <RangePicker />
                        </Form.Item>
                      </div>
                      <div className='col-4'>
                        <Form.Item name='' label=''>
                          <Button
                            type='primary'
                            htmlType='submit'
                            id='filterForm'
                            className='th-br-12 w-100'
                          >
                            Filter
                          </Button>
                        </Form.Item>
                      </div>
                    </div>
                  </Form>
                </Card>
              )}
              <div className='th-posts-list'>
                {postList?.length > 0 ? (
                  <List
                    className='demo-loadmore-list '
                    itemLayout='horizontal'
                    loadMore={loadMore}
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
                    <img src={NoDataIcon} alt='no_data' />
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
