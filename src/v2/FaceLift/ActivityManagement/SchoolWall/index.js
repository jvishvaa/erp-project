import Layout from 'containers/Layout';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, List, Skeleton, Card, Calendar, Avatar, Input } from 'antd';
import Loader from './Loader';
import PostCard from './postCard';
import { SendOutlined } from '@ant-design/icons';
import axiosInstance from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import CreatePost from './CreatePost';

const SchoolWall = () => {
  const [hasMore, setHasMore] = useState(true);
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [pageDetails, setPageDetails] = useState({ current: 1, total: 0 });

  const handleClosePostModal = () => {
    setShowCreatePostModal(false);
  };

  const fetchNewPosts = () => {
    if (pageDetails?.current !== 1) {
      setPageDetails((prevState) => ({ ...prevState, current: 1 }));
    } else {
      fetchPosts({ page: pageDetails?.current });
    }
  };

  const fetchPosts = (params = {}) => {
    if (postList?.length > pageDetails?.total && params.page != 1) {
      setHasMore(false);
      return;
    }
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
  console.log({ hasMore }, postList?.length);

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
            <div className='col-md-8'>
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
                    placeholder='Create your post...'
                    suffix={<SendOutlined />}
                    className='th-14 py-2 mx-3 th-br-12 th-grey mb-1 th-bg-grey '
                  />
                </div>
              </Card>
              <List
                className='demo-loadmore-list'
                itemLayout='horizontal'
                loadMore={loadMore}
                bordered={false}
                dataSource={postList}
                renderItem={(each, index) => (
                  <List.Item>
                    {' '}
                    <PostCard
                      post={each}
                      likePost={() => {
                        handleLikePost(index, each?.id);
                      }}
                    />
                  </List.Item>
                )}
              />
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
    </Layout>
  );
};

export default SchoolWall;
