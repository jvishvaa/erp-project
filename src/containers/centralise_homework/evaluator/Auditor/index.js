import React, { useRef, useState } from 'react';
import { Button, Modal, Form, Rate, Input, message } from 'antd';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import './style.scss';

const AuditorRating = ({ selectedHomework, setSelectedHomework, fetchRating }) => {
  const auditorFormRef = useRef(null);
  const [isAuditorModalOpen, setIsAuditorModalOpen] = useState(false);
  const [uploadStart, setUploadStart] = useState(false);
  const { TextArea } = Input;
  const openAuditorModal = () => {
    setIsAuditorModalOpen(true);
  };

  const closeAuditorModal = () => {
    setIsAuditorModalOpen(false);
    auditorFormRef.current.setFieldsValue({
      rate: null,
      feedback: null,
    });
  };
  const rateEvaluator = () => {
    const FormData = auditorFormRef ? auditorFormRef?.current?.getFieldsValue() : null;
    if (!FormData?.rate) {
      return message.error('Please Select stars to rate !');
    }
    setUploadStart(true);
    axiosInstance
      .post(`${endpoints.centralizedHomework.rating}`, {
        hw_dist_file: selectedHomework?.id,
        rating: FormData?.rate,
        feedback: FormData?.feedback,
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          selectedHomework.is_audited = true;
          // setSelectedHomework((prevState) => ({ ...prevState, is_audited: true }));
          setSelectedHomework(selectedHomework);
          fetchRating({
            hw_dist_file: selectedHomework?.id,
          });
          message.success(res?.data?.message ?? 'Evaluator rated successfully');
          closeAuditorModal();
        } else {
          message.error(res?.data?.message ?? 'Something went wrong');
        }
      })
      .catch((e) => {
        message.error(e?.response?.data?.message ?? 'Something went wrong');
      })
      .finally(() => {
        setUploadStart(false);
      });
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

      <Modal
        visible={isAuditorModalOpen}
        centered
        title='Rate Evaluator'
        onCancel={closeAuditorModal}
        footer={false}
        bodyStyle={{ paddingBottom: 20 }}
      >
        <Form ref={auditorFormRef}>
          <div className='row justify-content-center pt-4'>
            <div className='col-10 text-center'>
              <Form.Item name='rate'>
                <Rate className='auditor-rate' />
              </Form.Item>
              <Form.Item name='feedback'>
                <TextArea
                  className='mt-3'
                  cols={30}
                  rows={3}
                  showCount
                  maxLength={100}
                  placeholder='Feedback'
                />
              </Form.Item>
              <Button
                style={{ width: 'fit-content' }}
                className='th-br-4 mt-3 px-3'
                type='primary'
                onClick={rateEvaluator}
                disabled={uploadStart}
              >
                Submit
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default AuditorRating;
