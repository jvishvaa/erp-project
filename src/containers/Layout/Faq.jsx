import React, { useEffect, useState } from 'react';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import FaqImage from 'assets/images/faq.gif';
import { Modal } from 'antd';
import endpoints from '../../config/endpoints';
import { FilePdfOutlined } from '@ant-design/icons';

const Faq = ({ moduleData }) => {
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const [modalVisible, setModalVisible] = useState(false);

  const [isExpanded, setIsExpanded] = useState(
    Array(moduleData[0]?.items?.length).fill(false)
  );

  const toggleExpand = (index) => {
    const expandedCopy = [...isExpanded];
    expandedCopy[index] = !expandedCopy[index];
    setIsExpanded(expandedCopy);
  };

  useEffect(() => {
    if (!modalVisible) {
      const video = document.getElementById('module_video');
      if (video) {
        video.pause();
      }
    }
  }, [modalVisible]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          onClick={() => setModalVisible(true)}
          style={{
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease',
            padding: '6px',
            borderRadius: '18px',
            backgroundColor: 'white',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
        >
          <img src={FaqImage} width='20px' />
        </div>
      </div>
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
        <div id='Preview-Container' style={{ padding: '10px' }}>
          <div style={{ width: '100%' }}>
            {moduleData[0]?.video_file ? (
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>
                  Demo Video
                </p>
                <video  
                  id='module_video'
                  src={`${endpoints.assessment.erpBucket}/${moduleData[0]?.video_file}`}
                  controls
                  preload='auto'
                  style={{
                    maxHeight: '150px',
                    width: '100%',
                    objectFit: 'fill',
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='30'
                  height='30'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#333'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <circle cx='12' cy='12' r='10'></circle>
                  <line x1='12' y1='16' x2='12' y2='12'></line>
                  <line x1='12' y1='8' x2='12.01' y2='8'></line>
                </svg>
                <p
                  style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#333',
                  }}
                >
                  No Video File Uploaded
                </p>
              </div>
            )}
            {moduleData[0]?.pdf_file ? (
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
            ) : (
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='30'
                  height='30'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#333'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <circle cx='12' cy='12' r='10'></circle>
                  <line x1='12' y1='16' x2='12' y2='12'></line>
                  <line x1='12' y1='8' x2='12.01' y2='8'></line>
                </svg>
                <p
                  style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#333',
                  }}
                >
                  No PDF File Uploaded
                </p>
              </div>
            )}
          </div>
        </div>
        {moduleData?.length > 0 && (
          <div id='Edit-Container'>
            <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
              Question and Answers
            </p>
            {moduleData[0]?.items?.map((ele, index) => (
              <div id='Question-Answer-Cont'>
                <label style={{ fontWeight: 'bold' }}>Question {index+1}</label>

                <p>{ele?.question}</p>
                <label style={{ color: 'gray', marginTop: '3px' }}>Answer</label>
                {ele?.answer && (
                  <div>
                    {isExpanded[index] || ele.answer.length <= 150 ? (
                      <div>
                        <p>{ele.answer}</p>
                        {ele.answer.length > 150 && (
                          <a
                            style={{ color: 'blue' }}
                            onClick={() => toggleExpand(index)}
                          >
                            See less
                          </a>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p>{`${ele.answer.substring(0, 150)}...`}</p>
                        <a onClick={() => toggleExpand(index)} style={{ color: 'blue' }}>
                          See more...
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Faq;
