import React , { useState } from 'react';
import { Button, Modal } from 'antd';
const AudioModal = ({ openAudioModal , setOpenAudioModal, src}) => {
 
  const handleOk = () => {
    setOpenAudioModal(false);
  };
  const handleCancel = () => {
    setOpenAudioModal(false);
  };
  return (
    <>
  
      <Modal title="Audio Player" visible={openAudioModal} onOk={handleOk} onCancel={handleCancel} footer={null} >
        <div className='w-100 p-4 d-flex justify-content-center'   >
        <audio controls className='video-file'>
                <source src={src} />
                Your browser does not support the audio element.
              </audio>
        </div>
      </Modal>
    </>
  );
};
export default AudioModal;