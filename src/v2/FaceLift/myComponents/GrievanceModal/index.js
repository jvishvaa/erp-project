import React, { useState, createRef } from 'react';
import { Modal, message, Input, Button, Form, Radio } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import ENVCONFIG from 'config/config';

const { TextArea } = Input;

const GrievanceModal = (props) => {
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [description, setDescription] = useState('');
  const [issueOrigin, setIssueOrigin] = useState(null);
  const [attachment, setAttachment] = useState();
  const [resquestSent, setResquestSent] = useState(false);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const formRef = createRef();
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const originOptions = [
    {
      label: 'Web',
      value: 'web',
    },
    {
      label: 'App',
      value: 'app',
    },
  ];

  const handleImage = (e) => {
    let allowedExtension = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
    ];
    let imgType = e.target.files[0]?.type;
    if (allowedExtension.indexOf(imgType) > -1) {
      if (e.target.files[0].size > 5242880) {
        message.error('File Size should be less than 5MB');
        props.handleClose();
      } else {
        setAttachment(e.target.files[0]);
      }
    } else {
      message.error('Only Jpeg, Jpg and png files are allowed');
      setAttachment(null);
      props.handleClose();
    }
  };
  const handleIssueOriginChange = (e) => {
    setIssueOrigin(e.target.value);
  };
  const handleSubmit = () => {
    if (!issueOrigin) {
      message.error('Please select origin of the issue!');
      return;
    }
    if (!description.trim().length) {
      message.error('Please enter description!');
      return;
    } else {
      const payload = new FormData();
      payload.append('finance_session_year', selectedAcademicYear?.session_year);
      payload.append('branch_id', selectedBranch?.branch?.id);
      payload.append(
        'student_name',
        userDetails?.first_name + ' ' + userDetails?.last_name
      );
      payload.append('raised_by', userDetails?.erp);
      payload.append('description', description);
      payload.append('source_module', props?.module);
      payload.append('issue_origin', issueOrigin);

      if (attachment) {
        payload.append('file', attachment);
      }
      setResquestSent(true);
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
          message.error(error.response.data.message);
        })
        .finally(() => {
          setResquestSent(false);
        });
    }
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
              disabled={resquestSent}
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
                name='issue_origin'
                label='Where are you facing this issue?'
                rules={[{ required: true, message: 'Please select issue origin' }]}
              >
                <Radio.Group
                  options={originOptions}
                  onChange={handleIssueOriginChange}
                  value={issueOrigin}
                />
              </Form.Item>
            </div>
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
              <Form.Item name='attachment' label='Attachment (Max size 5MB)'>
                <input
                  type='file'
                  id='image'
                  accept='image/png, image/jpeg'
                  onChange={(e) => {
                    setAttachment(null);
                    handleImage(e);
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
