import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MediaDisplay from './mediaDisplay';
import dayjs from 'dayjs';
import { StarTwoTone, CommentOutlined, StarOutlined } from '@ant-design/icons';

const PostCard = (props) => {
  const {
    id,
    dp,
    user,
    created_at,
    likes_count: likeCount,
    description,
    comments_count: comments,
    liked,
    media_files: files,
    commentList,
    postBy,
    acad_session,
    grades,
  } = props?.post;
  const likePost = props?.likePost;

  const Branches = acad_session?.map((item) => item?.branch?.branch_name).toString();
  const Grades = grades?.map((item) => item?.grade_name).toString();

  console.log({ props });

  const [showLikeModal, setShowLikeModal] = useState(false);
  return (
    <>
      <div className={'p-3 bg-white th-post-card'}>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex gap-3 align-items-center'>
            <div
              className={`th-bg-img th-post-dp`}
              style={{
                backgroundImage: `url(${dp})`,
              }}
            ></div>
            <div className=''>
              <h5 className='m-0 th-16'>{user?.first_name + '' + user?.last_name}</h5>
              <small className='th-grey'>{dayjs(created_at).format('DD MMM YYYY')}</small>
            </div>
          </div>
        </div>

        <div className='mt-3 position-relative'>
          <div className='th-fw-400 th-14 th-grey pb-1'>
            {Branches} | {Grades}
          </div>
          {description}

          {files?.length > 0 ? (
            files[0]?.path ? (
              <MediaDisplay
                mediaName={files[0]?.name}
                mediaLink={files[0]?.path}
                alt={description}
                className='w-100 th-br-20 p-3'
                style={{ objectFit: 'contain' }}
              />
            ) : (
              ' Unsupported File Format'
            )
          ) : null}

          {files?.length > 1 && (
            <Link href={`/post/${id}`}>
              <div
                className='position-absolute p-1'
                style={{
                  bottom: '-20px',
                  right: '10px',
                }}
              >
                <div className='th-transparent-chip th-14 px-3 th-br-5'>
                  +{files?.length - 1} More
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className='d-flex justify-content-between align-items-center  mt-3'>
          <div className='th-grey'>
            <span className='px-2'>
              <span onClick={likePost} className='th-pointer'>
                {liked ? <StarTwoTone /> : <StarOutlined />}{' '}
              </span>
              <span
                className='ps-2 th-pointer'
                onClick={() => {
                  if (likeCount > 0) setShowLikeModal(true);
                }}
              >
                {likeCount} Star{likeCount > 1 ? 's' : ''}
              </span>
            </span>
            <Link href={`/post/${id}`}>
              <span className='px-2 th-pointer'>
                <CommentOutlined />{' '}
                <span className='ps-2'>
                  {comments} comment{comments > 1 ? 's' : ''}
                </span>
              </span>
            </Link>
          </div>
        </div>
        {comments > 1 ? (
          <Link href={`/post/${id}`}>
            <div className='th-14 pt-1 th-grey mb-1'>View all {comments} comments</div>
          </Link>
        ) : null}
        {commentList?.slice(0, 1)?.map((each) => {
          return (
            <Link href={`/post/${id}`}>
              <div
                key={each?.id}
                className='d-flex mb-1 w-100 gap-2 align-items-center mt-2'
              >
                <div className='w-100'>
                  <span className='th-fw-600'>
                    {(each.reply_to_data?.first_name?.trim()?.length > 0
                      ? each.reply_to_data?.first_name
                      : 'Anonymous') + ' :'}
                  </span>
                  <span className='th-14 px-2'>{each?.content}</span>
                  <span className='th-14 px-2'>{each?.path?.length} </span>

                  {each?.path?.length > 0 ? (
                    <div className='th-transparent-chip th-12 px-1 th-br-5'>
                      + {each?.path?.length} attachment
                      {each?.path?.length > 1 ? 's' : ''}
                    </div>
                  ) : null}

                  <div className='th-12 text-end th-grey'>
                    <i>{dayjs(each?.created_at).format('DD MMM YYYY, h:mm:ss a')}</i>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        <Link href={`/post/${id}`}>
          <div className='th-14 pt-1 th-grey mb-1'>Add a comment...</div>
        </Link>
      </div>
    </>
  );
};

export default PostCard;
