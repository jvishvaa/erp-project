import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Avatar, Comment, Tag, Popover, Popconfirm, Space } from 'antd';
import MediaDisplay from './mediaDisplay';
import dayjs from 'dayjs';
import {
  StarTwoTone,
  CommentOutlined,
  StarOutlined,
  SendOutlined,
  DeleteOutlined,
  MoreOutlined,
  EditOutlined,
} from '@ant-design/icons';
import Slider from 'react-slick';
import ReactHtmlParser from 'react-html-parser';

const PostCard = (props) => {
  const newCommentRef = useRef();
  const { user_level, user_id } = JSON.parse(localStorage?.getItem('userDetails'));
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
    recent_comment,
  } = props?.post;
  const likePost = props?.likePost;

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

  const addComment = async () => {
    const updatedValues = newCommentRef.current.getFieldsValue();
    await props.handleAddComment(props?.index, id, updatedValues?.comment);
    newCommentRef.current.resetFields();
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.6,
    slidesToScroll: 1,
    arrows: true,
  };

  const handleLongText = (data) => {
    return data?.length > 2 ? (
      <Popover
        placement='right'
        content={data?.slice(2)?.map((item) => (
          <>
            <i>{item}</i>
            <br />
          </>
        ))}
      >
        <span>{data?.slice(0, 2).join(', ')} </span>
        <span className='th-black'>+ {data?.length - 2} more</span>
      </Popover>
    ) : (
      data?.join(', ')
    );
  };

  return (
    <>
      <div className={'p-3 bg-white th-post-card'}>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <div
              className={`th-bg-img th-post-dp`}
              style={{
                backgroundImage: `url(${userImage})`,
              }}
            ></div>
            <div className=''>
              <h5 className='m-0 th-16'>
                {[user?.first_name ?? '', user?.middle_name ?? '', user?.last_name].join(
                  ' '
                )}
              </h5>
              <small className='th-grey'>{dayjs(created_at).format('DD MMM YYYY')}</small>
            </div>
          </div>
          {props?.handleAllowDeletePost(props?.post) && (
            <div className='d-flex justify-content-between'>
              <Popover
                placement='right'
                content={
                  <div className='d-flex flex-column align-items-center'>
                    {user_id === user?.id && (
                      <Tag
                        color='processing'
                        icon={<EditOutlined />}
                        className='th-br-8 th-pointer text-center w-100'
                        onClick={() => {
                          props.handleEditPost();
                        }}
                      >
                        Edit
                      </Tag>
                    )}
                    <Popconfirm
                      className='mt-2'
                      placement='bottom'
                      title='Are you sure to delete this post?'
                      onConfirm={props.handleDeletePost}
                      okText='Yes'
                      cancelText='No'
                    >
                      <Tag
                        color='volcano'
                        icon={<DeleteOutlined />}
                        className='th-br-8 th-pointer text-center w-100'
                      >
                        Delete
                      </Tag>
                    </Popconfirm>
                  </div>
                }
              >
                <MoreOutlined className='th-pointer th-24' />
              </Popover>
            </div>
          )}
        </div>

        <div className='mt-3 position-relative'>
          {user_level !== 13 && (
            <>
              <span className='th-fw-400 th-14 th-grey pb-1 th-truncate-2'>
                {handleLongText(Branches)} | {handleLongText(Grades)} |{' '}
                {handleLongText(Sections)}
              </span>
              <div className='th-fw-500 th-14 th-black py-2 w-100'>
                {ReactHtmlParser(description)}
              </div>
            </>
          )}

          {files?.length > 0 ? (
            <Slider {...settings} className='th-slick th-post-slick'>
              {files?.map((each) => (
                <MediaDisplay
                  mediaName={each?.media_file}
                  mediaLink={each?.media_file}
                  alt={description}
                  className='w-100 th-br-20 p-3'
                  style={{ objectFit: 'contain' }}
                />
              ))}
            </Slider>
          ) : null}

          {files?.length > 1 && (
            <div
              className='position-absolute p-1 d-none'
              style={{
                bottom: '-20px',
                right: '10px',
              }}
            >
              <Link to={`/school-wall/${id}`}>
                <div className='th-primary th-14 px-3 th-br-5'>
                  +{files?.length - 1} More
                </div>
              </Link>
            </div>
          )}
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
                  if (likeCount > 0) props.handleShowLikesModal(id);
                }}
              >
                {likeCount} Star{likeCount > 1 ? 's' : ''}
              </span>
            </span>
            {/* <Link to={`/school-wall/${id}`}>
              <span className='px-2 th-pointer th-grey'>
                <CommentOutlined className='th-20' />{' '}
                <span className='pl-2'>
                  {comments} comment{comments > 1 ? 's' : ''}
                </span>
              </span>
            </Link> */}
          </div>
        </div>
        {/* {comments > 1 ? (
          <Link to={`/school-wall/${id}`}>
            <div className='th-14 pt-1 th-grey mb-1 px-2'>
              View all {comments} comments
            </div>
          </Link>
        ) : null} */}
        {/* <div className='th-14 py-2 px-3 th-br-12 th-grey mb-1 th-bg-grey m-2'>
          Add a comment...
        </div> */}
        {/* {recent_comment !== '' && (
          <Comment
            datetime={
              <i>{dayjs(recent_comment?.updated_at)?.format('DD MM YYYY, h:mm:ss a')}</i>
            }
            avatar={
              <Avatar
                src={
                  recent_comment?.commented_by?.profile_img ??
                  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg'
                }
                alt='user'
              />
            }
            author={
              <span className='th-black-1'>
                {[
                  recent_comment?.commented_by?.first_name ?? '',
                  recent_comment?.commented_by?.last_name,
                ].join(' ')}
              </span>
            }
            content={<>{recent_comment?.description}</>}
          />
        )} */}
        {/* <Form ref={newCommentRef}>
          <Form.Item name='comment'>
            <Input
              bordered={false}
              placeholder='Add a comment...'
              onKeyDown={(e) => {
                if (e.key == 'Enter') {
                  addComment();
                }
              }}
              suffix={
                <SendOutlined
                  onClick={() => {
                    addComment();
                  }}
                />
              }
              className='th-14 py-2 px-3 th-br-12 th-grey mt-3 th-bg-grey '
            />
          </Form.Item>
        </Form> */}
      </div>
    </>
  );
};

export default PostCard;
