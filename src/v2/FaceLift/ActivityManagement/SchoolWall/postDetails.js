import React, { useState, useEffect, useRef } from 'react';
import Layout from 'containers/Layout';
import { saveAs } from 'file-saver';
import {
  Breadcrumb,
  Card,
  Comment,
  Input,
  message,
  Avatar,
  Button,
  Form,
  Popover,
} from 'antd';
import { useParams } from 'react-router-dom';
import axiosInstance from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import MediaDisplay from './mediaDisplay';
import dayjs from 'dayjs';
import Slider from 'react-slick';
import {
  StarTwoTone,
  CommentOutlined,
  StarOutlined,
  SendOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import Loader from './Loader';
import { Profanity } from 'components/file-validation/Profanity';
import ReactHtmlParser from 'react-html-parser';
import LikesModal from './LikesModal';

const PostDetails = () => {
  let { postId } = useParams();
  const [postDetails, setPostDetails] = useState({});
  const [commentsList, setCommentsList] = useState([]);
  const [commentsCount, setCommentsCount] = useState();
  const [showLikesModal, setShowLikeModal] = useState(false);
  const [parentCommentId, setParentCommentId] = useState(null);
  const [allowSubComment, setAllowSubComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const newCommentRef = useRef();
  const subCommentRef = useRef();
  const { user_id, user_level } = JSON.parse(localStorage?.getItem('userDetails'));

  const handleCloseLikesModal = () => {
    setShowLikeModal(false);
  };

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
          setCommentsCount(response?.data?.result?.results[0]?.comments_count);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchComments = (params = {}) => {
    axiosInstance
      .get(`${endpoints?.schoolWall?.comments}`, {
        params: {
          ...params,
        },
      })
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setCommentsList(response?.data?.result);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  };
  const handleAddComment = (description = '', isChildComment = false) => {
    let formData = new FormData();
    const updatedValues = newCommentRef.current.getFieldsValue();
    if (Profanity(isChildComment ? description : updatedValues?.comment)) {
      message.error('Comment contains foul words, please remove them');
      return;
    }
    formData.append('post', postId);
    formData.append('description', isChildComment ? description : updatedValues?.comment);
    formData.append('commented_by', user_id);
    if (isChildComment) {
      formData.append('parent_comment', parentCommentId);
    }
    axiosInstance
      .post(`${endpoints?.schoolWall?.comments}`, formData)
      .then((res) => {
        if (res?.data?.status_code == 200) {
          // message.success(res?.data?.message);
          setCommentsCount((prevState) => prevState + 1);
          newCommentRef.current.resetFields();
          fetchComments({ post_id: postId });
          if (isChildComment) {
            subCommentRef.current.input.value = '';
            setAllowSubComment(false);
            setParentCommentId(null);
          }
        }
      })
      .catch((err) => {
        message.error('Something went wrong !!');
      });
  };

  const handleLikePost = (selectedPostID) => {
    let updatedPost = { ...postDetails };
    if (updatedPost['is_like']) {
      updatedPost['is_like'] = false;
      updatedPost['likes_count'] -= 1;
    } else {
      updatedPost['is_like'] = true;
      updatedPost['likes_count'] += 1;
    }
    setPostDetails(updatedPost);
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
    fetchComments({ post_id: postId });
  }, [window.location.pathname]);

  const {
    id,
    user,
    created_at,
    likes_count: likeCount,
    description,
    is_like: liked,
    media_files,
    section_mapping,
  } = postDetails;

  const Branches = [
    ...new Set(section_mapping?.map((item) => item?.acad_session?.branch?.branch_name)),
  ];
  const Grades = [
    ...new Set(
      section_mapping?.map((item) =>
        [item?.acad_session?.branch?.branch_name ?? '', item?.grade?.grade_name].join(' ')
      )
    ),
  ];
  const Sections = section_mapping?.map((item) =>
    [
      item?.acad_session?.branch?.branch_name ?? '',
      item?.grade?.grade_name ?? '',
      item?.section?.section_name,
    ].join(' ')
  );

  const userImage =
    user?.profile_img ??
    'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg';

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.4,
    slidesToScroll: 1,
    arrows: true,
  };

  const handleDownloadAll = async (files) => {
    for (const item of files) {
      const fullName =
        item?.media_file?.split('.')[item?.media_file?.split('_').length - 1];
      await downloadFile(item?.media_file, fullName);
    }
  };

  const downloadFile = async (url, fullName) => {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, fullName);
  };

  const handleLongText = (data) => {
    const limit = 1;
    return data?.length > limit ? (
      <Popover
        placement='right'
        content={data?.slice(limit)?.map((item) => (
          <>
            <i>{item}</i>
            <br />
          </>
        ))}
      >
        <span>{data?.slice(0, limit).join(', ')} </span>
        <span className='th-black'>+ {data?.length - limit} more</span>
      </Popover>
    ) : (
      data?.join(', ')
    );
  };

  return (
    <Layout>
      <div className='row'>
        <div className='col-md-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/school-wall' className='th-black-1 th-16 th-fw-500'>
              School Wall
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className='col-md-6 my-3'>
              <Card className={'bg-white th-post-card'}>
                <div className='th-post-details-card th-custom-scrollbar'>
                  <div className='d-flex justify-content-between align-items-center '>
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
                    <div className='th-fw-400 th-14 th-grey pb-1 th-truncate-2'>
                      {handleLongText(Branches)} | {handleLongText(Grades)} |{' '}
                      {handleLongText(Sections)}
                    </div>
                    <div className='th-fw-500 th-14 th-black py-2'>
                      {ReactHtmlParser(description)}
                    </div>

                    {media_files?.length > 0 ? (
                      <Slider {...settings} className='th-slick th-post-slick'>
                        {media_files?.map((each) => (
                          <div className=''>
                            <MediaDisplay
                              mediaName={each?.media_file}
                              mediaLink={each?.media_file}
                              alt={description}
                              className='w-100 th-br-20'
                              styles={{ objectFit: 'contain', maxHeight: '500px' }}
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : null}
                  </div>
                  <div className='d-flex justify-content-between align-items-center  mt-3'>
                    <div className='d-flex th-grey'>
                      <div className='px-2 d-flex align-items-center'>
                        <span
                          onClick={() => handleLikePost(postId)}
                          className='th-pointer'
                        >
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
                      </div>
                      <div className='px-2 d-flex align-items-center th-pointer '>
                        <CommentOutlined className='th-20' />{' '}
                        <span className='pl-2'>
                          {commentsCount} comment
                          {commentsCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    {media_files.length > 0 && (
                      <div>
                        <Button
                          type='link'
                          icon={<DownloadOutlined />}
                          onClick={() => {
                            handleDownloadAll(media_files);
                          }}
                        >
                          Download all attachments
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
            <div className='col-6 my-3 '>
              <Card className={'bg-white th-br-20'}>
                <div className='d-flex flex-column justify-contnet-between'>
                  <div className='th-black-1 th-fw-600 mb-3'>
                    <i>Comments</i>
                  </div>

                  {commentsList?.length > 0 ? (
                    <>
                      <div
                        className='mb-3'
                        style={{ maxHeight: '60vh', overflowY: 'auto' }}
                      >
                        {commentsList?.map((item) => {
                          return (
                            <Comment
                              datetime={
                                <i>
                                  {dayjs(item?.updated_at)?.format(
                                    'DD MM YYYY, h:mm:ss a'
                                  )}
                                </i>
                              }
                              avatar={
                                <Avatar
                                  src={
                                    item?.profile ??
                                    'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg'
                                  }
                                  alt='user'
                                />
                              }
                              author={
                                <span className='th-black-1'>
                                  {[item?.first_name ?? '', item?.last_name].join(' ')}
                                </span>
                              }
                              content={<>{item?.description}</>}
                              actions={[
                                <span
                                  onClick={() => {
                                    setParentCommentId(item?.id);
                                    setAllowSubComment(true);
                                  }}
                                >
                                  Reply to
                                </span>,
                              ]}
                            >
                              {item?.id == parentCommentId && allowSubComment && (
                                <div className='d-flex justify-content-center align-items-center'>
                                  <Input
                                    ref={subCommentRef}
                                    bordered={false}
                                    onKeyDown={(e) => {
                                      if (e.key == 'Enter') {
                                        handleAddComment(
                                          subCommentRef?.current?.input?.value,
                                          true
                                        );
                                      }
                                    }}
                                    placeholder='Add a comment...'
                                    suffix={
                                      <SendOutlined
                                        onClick={() => {
                                          handleAddComment(
                                            subCommentRef?.current?.input?.value,
                                            true
                                          );
                                        }}
                                      />
                                    }
                                    className='th-14 py-2 px-3 th-br-12 th-grey mb-1 th-bg-grey '
                                  />
                                  <CloseCircleOutlined
                                    className='pl-2'
                                    onClick={() => {
                                      setAllowSubComment(false);
                                      setParentCommentId(null);
                                      subCommentRef.current.input.value = null;
                                    }}
                                  />
                                </div>
                              )}
                              {item?.child_comments?.length > 0 &&
                                item?.child_comments?.map((each, index) => (
                                  <Comment
                                    datetime={
                                      <i>
                                        {dayjs(each?.updated_at)?.format(
                                          'DD MM YYYY, h:mm:ss a'
                                        )}
                                      </i>
                                    }
                                    avatar={
                                      <Avatar
                                        src={
                                          each?.profile ??
                                          'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg'
                                        }
                                        alt='user'
                                      />
                                    }
                                    author={
                                      <span className='th-black-1'>
                                        {[each?.first_name ?? '', each?.last_name].join(
                                          ' '
                                        )}
                                      </span>
                                    }
                                    content={<>{each?.description}</>}
                                  />
                                ))}
                            </Comment>
                          );
                        })}
                      </div>
                    </>
                  ) : null}
                  <div
                    className='w-100'
                    // style={{
                    //   position: 'absolute',
                    //   bottom: '4%',
                    //   left: '2%',
                    //   right: '2%',
                    // }}
                  >
                    <Form ref={newCommentRef}>
                      <Form.Item name='comment'>
                        <Input
                          bordered={false}
                          placeholder='Add a comment...'
                          onKeyDown={(e) => {
                            if (e.key == 'Enter') {
                              handleAddComment();
                            }
                          }}
                          suffix={
                            <SendOutlined
                              onClick={() => {
                                handleAddComment();
                              }}
                            />
                          }
                          className='th-14 py-2 px-3 th-br-12 th-grey mb-1 th-bg-grey '
                        />
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
        <LikesModal
          showLikesModal={showLikesModal}
          handleCloseLikesModal={handleCloseLikesModal}
          selectedPostId={postId}
        />
      </div>
    </Layout>
  );
};

export default PostDetails;
