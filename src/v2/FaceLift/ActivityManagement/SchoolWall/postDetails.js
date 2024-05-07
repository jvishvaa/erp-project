import React, { useState, useEffect, useRef } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Card, Input } from 'antd';
import { useParams } from 'react-router-dom';
import axiosInstance from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import MediaDisplay from './mediaDisplay';
import dayjs from 'dayjs';
import { StarTwoTone, CommentOutlined, StarOutlined } from '@ant-design/icons';

const PostDetails = () => {
  let { postId } = useParams();
  const [postDetails, setPostDetails] = useState(true);
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const newCommentRef = useRef();
  const likePost = () => {};

  const fetchPostDetails = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints?.schoolWall?.getPosts}`, {
        params: {
          ...params,
        },
      })
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setPostDetails(response?.data?.result?.results[0]);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddComment = () => {};

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
  useEffect(() => {
    fetchPostDetails({ post_id: postId });
  }, [window.location.pathname]);
  const {
    id,
    user,
    created_at,
    likes_count: likeCount,
    description,
    comments_count: comments,
    is_like: liked,
    media_files: files,
    section_mapping,
  } = postDetails;

  const Branches = section_mapping
    ?.map((item) => item?.acad_session?.branch?.branch_name)
    .join(', ');
  const Grades = section_mapping?.map((item) => item?.grade?.grade_name).join(', ');
  const Sections = section_mapping?.map((item) => item?.section?.section_name).join(', ');
  const userImage =
    user?.profile_img ??
    'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg';

  return (
    <Layout>
      <div className='row'>
        <div className='col-md-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/school-wall' className='th-black-1 th-18 th-fw-500'>
              School Wall
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-grey th-18 th-fw-500'>
              {postId}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-8 my-3'>
          <Card loading={loading} className={'bg-white th-post-card'}>
            <div className='d-flex justify-content-between align-items-center'>
              <div className='d-flex gap-3 align-items-center'>
                <div
                  className={`th-bg-img th-post-dp`}
                  style={{
                    backgroundImage: `url(${userImage})`,
                  }}
                ></div>
                <div className=''>
                  <h5 className='m-0 th-16'>
                    {[
                      user?.first_name ?? '',
                      user?.middle_name ?? '',
                      user?.last_name,
                    ].join(' ')}
                  </h5>
                  <small className='th-grey'>
                    {dayjs(created_at).format('DD MMM YYYY')}
                  </small>
                </div>
              </div>
            </div>

            <div className='mt-3 position-relative'>
              <div className='th-fw-400 th-14 th-grey pb-1'>
                {Branches} | {Grades} | {Sections}
              </div>
              <div className='th-fw-500 th-14 th-black py-2'>{description}</div>

              {files?.length > 0 ? (
                files[0]?.media_file ? (
                  <MediaDisplay
                    mediaName={files[0]?.media_file}
                    mediaLink={files[0]?.media_file}
                    alt={description}
                    className='w-100 th-br-20 p-3'
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  ' Unsupported File Format'
                )
              ) : null}
            </div>
            <div className='d-flex justify-content-between align-items-center  mt-3'>
              <div className='th-grey'>
                <span className='px-2'>
                  <span onClick={likePost} className='th-pointer'>
                    {liked ? (
                      <StarTwoTone className='th-20' />
                    ) : (
                      <StarOutlined className='th-20' />
                    )}{' '}
                  </span>
                  <span
                    className='pl-2 th-pointer'
                    onClick={() => {
                      if (likeCount > 0) setShowLikeModal(true);
                    }}
                  >
                    {likeCount} Star{likeCount > 1 ? 's' : ''}
                  </span>
                </span>
                <span className='px-2 th-pointer th-grey'>
                  <CommentOutlined className='th-20' />{' '}
                  <span className='pl-2'>
                    {comments} comment{comments > 1 ? 's' : ''}
                  </span>
                </span>
              </div>
            </div>

            <div className='m-2'>
              <Input
                ref={newCommentRef}
                bordered={false}
                placeholder='Add a comment...'
                className='th-14 py-2 px-3 th-br-12 th-grey mb-1 th-bg-grey '
              />
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetails;
