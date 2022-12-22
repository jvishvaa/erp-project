import React, { useState, createRef } from 'react';
import { Modal, message, Input, Button, Form, Switch } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import ENVCONFIG from 'config/config';

const { TextArea } = Input;

const FeedbackModal = (props) => {
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [description, setDescription] = useState('');
  const [isClassCancelled, setIsClassCancelled] = useState(false);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const formRef = createRef();
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const handleCancellationCheck = (event) => {
    setIsClassCancelled(event);
    setDescription('');
  };

  const handleSubmit = () => {
    if (description) {
      const payload = new FormData();
      payload.append('finance_session_year', selectedAcademicYear?.session_year);
      payload.append('branch_id', selectedBranch?.branch?.id);
      payload.append(
        'student_name',
        userDetails?.first_name + ' ' + userDetails?.last_name
      );
      payload.append('raised_by', userDetails?.erp);
      payload.append('description', description);

      axios
        .post(`${endpoints.grievances.grievanceTicket}`, payload)
        .then((res) => {
          if (res.status === 201) {
            props.handleClose();
            message.success('Ticket raised successfully');

            setTimeout(function () {
              window.open(
                `${ENVCONFIG?.apiGateway?.finance}/sso/ticket/${token}#/auth/login`,
                '_blank'
              );
            }, 800);
          }
        })
        .catch((error) => {
          message.error(error.message);
        });
    } else {
      message.error('Please enter description!');
    }
  };
  return (
    <div>
      <Modal
        title={props?.title}
        visible={props.showFeedbackModal}
        onCancel={props?.handleClose}
        className='th-upload-modal'
        centered
        footer={[
          <>
            <Button
              className='text-center th-br-10 th-bg-grey th-black-2'
              onClick={props.handleClose}
            >
              Close
            </Button>

            <Button
              htmlType='submit'
              className='text-center th-br-10 th-bg-primary th-white'
              onClick={handleSubmit}
            >
              <strong>Submit</strong>
            </Button>
          </>,
        ]}
      >
        <Form id='grievanceForm' layout='vertical' ref={formRef}>
          <div className='row px-2 pt-2'>
            <div className='col-12'>
              <Form.Item name='class_cancelled'>
                <span className='mr-2'>Was the Class cancelled?</span>
                <Switch
                  checkedChildren='Yes'
                  unCheckedChildren='No'
                  onChange={handleCancellationCheck}
                />
              </Form.Item>
            </div>
            <div className='col-12'>
              <Form.Item
                name='description'
                label='Reason'
                rules={[{ required: true, message: 'Please Add Description' }]}
              >
                <TextArea
                  rows={5}
                  disabled={isClassCancelled}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Enter Reason'
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedbackModal;
