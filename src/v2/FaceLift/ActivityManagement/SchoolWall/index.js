import Layout from 'containers/Layout';
import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Button,
  List,
  Skeleton,
  Card,
  Calendar,
  Avatar,
  Input,
  message,
} from 'antd';
import Loader from './Loader';
import PostCard from './postCard';
import { SendOutlined } from '@ant-design/icons';
import axiosInstance from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import CreatePost from './CreatePost';
import LikesModal from './LikesModal';
import { Profanity } from 'components/file-validation/Profanity';

const SchoolWall = () => {
  const { user_id, first_name, last_name } = JSON.parse(
    localStorage?.getItem('userDetails')
  );

  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [selectedPostID, setSelectedPostID] = useState(false);
  const [pageDetails, setPageDetails] = useState({ current: 1, total: 0 });

  const handleClosePostModal = () => {
    setShowCreatePostModal(false);
  };
  const handleShowLikesModal = (id) => {
    setSelectedPostID(id);
    setShowLikesModal(true);
  };
  const handleCloseLikesModal = () => {
    setShowLikesModal(false);
    setSelectedPostID(null);
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
        message.error('Something went wrong !!');
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

  return (
    <Layout>
      <div className='row'>
        <div className='col-md-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/school-wall' className='th-black-1 th-18 th-fw-500'>
              School Wall
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className='col-md-8 py-3'>
              <Card className='th-bg-white th-br-20'>
                <div
                  className='d-flex align-items-center th-pointer justify-content-between'
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
              </Card>
              <div className='th-posts-list'>
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
                        handleShowLikesModal={handleShowLikesModal}
                        handleAddComment={handleAddComment}
                        likePost={() => {
                          handleLikePost(index, each?.id);
                        }}
                        handleDeletePost={() => {
                          handleDeletePost(index, each?.id);
                        }}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </div>
            <div className='col-md-4 py-3'>
              <Card className='th-bg-white th-br-20 th-post-calendar'>
                <div className='th-black th-14 th-fw-500 mb-3'>Select a specifc date</div>
                <Calendar fullscreen={false} />
              </Card>
            </div>
          </>
        )}
      </div>
      <CreatePost
        showCreatePostModal={showCreatePostModal}
        handleClosePostModal={handleClosePostModal}
        fetchNewPosts={fetchNewPosts}
      />
      <LikesModal
        showLikesModal={showLikesModal}
        handleCloseLikesModal={handleCloseLikesModal}
        selectedPostId={selectedPostID}
      />
    </Layout>
  );
};

export default SchoolWall;
