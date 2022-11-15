import React, { useState, createRef } from 'react';
import { Modal, message, Input, Button, Form } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

const GrievanceModal = (props) => {
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState();
  const formRef = createRef();
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const handleSubmit = () => {
    const payload = new FormData();

    payload.append('finance_session_year', selectedAcademicYear?.session_year);
    payload.append('branch_id', selectedBranch?.branch?.id);
    payload.append(
      'student_name',
      userDetails?.first_name + ' ' + userDetails?.last_name
    );
    payload.append('raised_by', userDetails?.erp);
    payload.append('description', description);

    if (attachment) {
      payload.append('file', attachment);
    }
    axios
      .post(`${endpoints.grievances.grievanceTicket}`, payload)
      .then((res) => {
        if (res.status === 201) {
          props.handleClose();
          message.success('Ticket raised successfully');
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  return (
    <div>
      <Modal
        title={props?.title}
        visible={props.showGrievanceModal}
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
              <Form.Item
                name='description'
                label='Description'
                rules={[{ required: true, message: 'Please Add Description' }]}
              >
                <TextArea
                  rows={5}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Enter Description'
                />
              </Form.Item>
            </div>
            <div className='col-12'>
              <Form.Item name='attachment' label='Attachment'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) => {
                    setAttachment(e.target.files[0]);
                  }}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default GrievanceModal;
