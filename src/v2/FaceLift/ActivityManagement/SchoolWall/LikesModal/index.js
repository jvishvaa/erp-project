import { EyeFilled, StarTwoTone } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Modal, message, List, Image } from 'antd';
import React, { useState, useEffect } from 'react';
import axiosInstance from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';

const LikesModal = ({ showLikesModal, handleCloseLikesModal, selectedPostId }) => {
  const [likesList, setLikesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPostLikes = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints?.schoolWall?.likePost}`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setLikesList(res?.data?.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (showLikesModal) {
      fetchPostLikes({ post_id: selectedPostId });
    }
  }, [showLikesModal]);
  return (
    <Modal
      className='th-upload-modal'
      title='Post Likes'
      visible={showLikesModal}
      onCancel={handleCloseLikesModal}
      centered
      footer={null}
      width={'400px'}
    >
      <div className='p-4'>
        <List
          className='demo-loadmore-list'
          itemLayout='horizontal'
          loading={loading}
          //   loadMore={loadMore}
          bordered={false}
          dataSource={likesList}
          renderItem={(each, index) => {
            const userImage =
              each?.reacted_by?.profile_img ??
              'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg';
            return (
              <List.Item>
                <div className='d-flex align-items-center justify-content-between w-100'>
                  <div className='d-flex align-items-center'>
                    {/* <div
                      className={`th-bg-img th-post-dp`}
                      style={{
                        backgroundImage: `url(${userImage})`,
                      }}
                    ></div> */}
                    <Image
                      src={userImage}
                      style={{
                        height: 40,
                        width: 40,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                      preview={{ mask: <EyeFilled /> }}
                    />
                    <i className='m-2 '>
                      {[
                        each?.reacted_by?.first_name ?? '',
                        each?.reacted_by?.last_name,
                      ].join(' ')}
                    </i>
                  </div>
                  <div className='d-none flex-column align-items-center'>
                    <StarTwoTone className='th-20 th-primary' />
                    <span className='th-grey mt-2'>
                      Liked on {dayjs(each?.created_at).format('DD MMM YYYY h:mm:ss a')}
                    </span>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </div>
    </Modal>
  );
};

export default LikesModal;
