import React, { useState } from 'react';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import FaqImage from 'assets/images/faq.png';
import { Modal } from 'antd';
import endpoints from '../../config/endpoints';
import { FilePdfOutlined } from '@ant-design/icons';

const Faq = ({ moduleData }) => {

  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {
        <div style={{ position: 'fixed', top: '76px', right: '80px', zIndex: '5' }}>
          <div
            onClick={() => setModalVisible(true)}
            style={{
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.3s ease',
              padding: '3px',
              borderRadius: '18px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <img src={FaqImage} width='24px' />
          </div>
        </div>
      }
      <Modal
        visible={modalVisible}
        footer={null}
        className='th-modal'
        width={'50%'}
        onCancel={() => setModalVisible(false)}
      >
        <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '20px' }}>
          Frequently Asked Questions
        </p>
        <div id='Preview-Container' style={{ height: '265px', gap: '20px' }}>
          <div style={{ width: '100%' }}>
            <p style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>
              Demo Video
            </p>
            <video
              src={`${endpoints.assessment.erpBucket}/${moduleData[0]?.video_file}`}
              controls
              preload='auto'
              style={{
                maxHeight: '165px',
                width: '100%',
                objectFit: 'fill',
              }}
            />
            <p
              onClick={() => {
                const fileName = moduleData[0]?.pdf_file;
                let extension = fileName ? fileName[fileName?.length - 1] : '';
                openPreview({
                  currentAttachmentIndex: 0,
                  attachmentsArray: [
                    {
                      src: `${endpoints.assessment.erpBucket}/${moduleData[0]?.pdf_file}`,

                      name: fileName,
                      extension: '.' + extension,
                    },
                  ],
                });
              }}
              style={{ color: 'blue', cursor: 'pointer', paddingTop: '8px' }}
            >
              Click For User Manual <FilePdfOutlined />
            </p>
          </div>
        </div>
        {moduleData?.length > 0 && (
          <div id='Edit-Container'>
            <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
              Question and Answers
            </p>
            {moduleData[0]?.items?.map((ele) => (
              <div id='Question-Answer-Cont'>
                <label style={{ fontWeight: 'bold' }}>Question</label>

                <p>{ele?.question}</p>
                <label style={{ color: 'gray', marginTop: '3px' }}>Answer</label>

                <p>{ele?.answer}</p>
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          For Further Assistance Please Mail Us At{' '}
          <a href='mailto:support@k12technoservices.freshdesk.com'>
            support@k12technoservices.freshdesk.com
          </a>
        </div>
      </Modal>
    </>
  );
};

export default Faq;
