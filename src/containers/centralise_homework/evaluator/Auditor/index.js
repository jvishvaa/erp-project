import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const AuditorRating = () => {
  const [isAuditorModalOpen, setIsAuditorModalOpen] = useState(false);
  const openAuditorModal = () => {
    setIsAuditorModalOpen(true);
  };

  const closeAuditorModal = () => {
    setIsAuditorModalOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        className=' th-br-4 w-100  th-select'
        type='primary'
        onClick={openAuditorModal}
      >
        Rating &amp; Feedback
      </Button>

      <Modal visible={isAuditorModalOpen}  >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </React.Fragment>
  );
};

export default AuditorRating;
