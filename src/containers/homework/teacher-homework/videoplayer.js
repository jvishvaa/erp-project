import React , { useState } from 'react';
import { Button, Modal } from 'antd';
const VideoModal = ({ openVideoModal , setOpenVideoModal, src}) => {
 
  const handleOk = () => {
    setOpenVideoModal(false);
  };
  const handleCancel = () => {
    setOpenVideoModal(false);
  };
  return (
    <>
  
      <Modal title="Video Player" visible={openVideoModal} onOk={handleOk} onCancel={handleCancel} footer={null} >
        <div className='w-100 d-flex justify-content-center'   >
            <video controls className='video-file w-100 p-3'>
                <source src={src} />
                Your browser does not support the audio element.
              </video>
        </div>
      </Modal>
    </>
  );
};
export default VideoModal;