import React, { useEffect, useState } from 'react';
import { Modal, Upload, message, Button, Progress } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import './Faq.scss';
import dragDropIcon from 'v2/Assets/dashboardIcons/announcementListIcons/dragDropIcon.svg';
import axios from 'axios';
import endpoints from 'v2/config/endpoints';

const UploadPdfFaq = (props) => {
  const [fileList, setFileList] = useState([]);
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [percentValue, setPercentValue] = useState(10);
  const [uploading, setUploading] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  const handleUpload = () => {
    setUploading(true);
    const formData = new FormData();
    formData.append('media_id', props?.media_id);
    formData.append('media_type', 'pdf');
    formData.append('pdf', fileList[0]);

    axios
      .patch(`${endpoints.FrequentlyAskedQuestions.FaqApi}`, formData, {
        headers: {
          Authorization: `Bearer ${userDetails?.token}`,
        },
      })
      .then((res) => {
        if (res?.data) {
          message.success(`New P.D.F. Uploaded Successfully`);
          props.setPdfPreviewLink(res?.data?.result?.pdf_file)
          props.fetchTableData();
          setUploading(false);
          props.setShowPdfText(false)          
          setFileList([]);
          props.handleUploadPdfModalClose();
        }
      })
      .catch((err) => {
        setUploading(false);
        message.error(err);
      });
  };
  const MAX_FILE_SIZE_MB = 500;
  const { Dragger } = Upload;
  const draggerProps = {
    showUploadList: false,
    disabled: false,
    multiple: false, 
    accept: '.pdf',
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      const type = file.type.split('/')[1];
      const isValidType = ['pdf'].includes(type);
      const isValidSize = file.size / 1024 / 1024 <= MAX_FILE_SIZE_MB; // Convert bytes to MB

      if (isValidType && isValidSize) {
        setFileList([file]);
        setFileTypeError(false);
        setFileSizeError(false);
      } else {
        if (!isValidType) {
          setFileTypeError(true);
        }
        if (!isValidSize) {
          setFileSizeError(true);
          message.error("File size must be less than 500 MB!")
        }
        setFileList([]);
      }
      return false;
    },
    fileList,
  };

  let idInterval = null;
  useEffect(() => {
    if (uploading == true && percentValue < 90) {
      idInterval = setInterval(
        () => setPercentValue((oldCount) => checkCount(oldCount)),
        1000
      );
    }

    return () => {
      clearInterval(idInterval);
      setPercentValue(10);
    };
  }, [uploading]);

  const checkCount = (count) => {
    if (count < 90) {
      return count + 5;
    } else {
      return count;
    }
  };

  return (
    <>
      <Modal
        centered
        visible={props?.show}
        width={500}
        className='th-upload-modal'
        title='Upload Files'
        onCancel={props?.handleUploadPdfModalClose}
        footer={
          <div className='d-flex justify-content-center'>
            <Button
              className='th-br-4 th-black-2'
              onClick={props?.handleUploadPdfModalClose}
              style={{ border: '1px solid #868686' }}
            >
              Cancel
            </Button>

            <Button
              className='th-fw-500 th-br-4 th-bg-primary th-white'
              onClick={() => {
                if (fileList.length === 1 && !fileSizeError) {
                  setUploading(true);
                  handleUpload();
                }
              }}
              disabled={uploading || fileList.length < 0 || fileSizeError}
            >
              Upload
            </Button>
          </div>
        }
      >
        <div className='row px-4 mt-3 th-bg-white th-br-10'>
          <Dragger
            {...draggerProps}
            className='th-br-4'
            style={{
              border: '1px solid #D9D9D9',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              width: window.innerWidth < 768 ? 330 : 450,
              height: 200,
            }}
          >
            <p className='pt-2'>
              <img src={dragDropIcon} alt='Drag and drop icon' />
            </p>
            <p className='pt-2'>
              {' '}
              Drag And Drop PDF File Here <br /> or
            </p>
            <Button
              className='th-primary pb-2 mt-0 th-bg-white th-br-4'
              style={{ border: '1px solid #1b4ccb' }}
            >
              Browse Files
            </Button>
            <p className='pt-2'>Accepted Files [P.D.F]</p>
          </Dragger>
          {fileTypeError && (
            <div className='row pt-3 justify-content-center th-red'>
              Only P.D.F File Is Allowed
            </div>
          )}
          {fileList?.length > 0 && (
            <span className='th-black-1 mt-3'>Selected Files</span>
          )}
          <div className='row my-2 th-grey' style={{ height: 150, overflowY: 'auto' }}>
            {fileList.map((item) => (
              <div
                key={item.uid}
                className='row mb-1 align-items-center th-12 th-bg-grey py-2'
              >
                <div className='col-1 pr-0'>{/* Display file icon here */}</div>
                <div className='col-5 text-truncate'>{item.name}</div>
                {/* <div className='col-2 px-0'>{getSize(item.size)}</div> */}
                <div className='col-2 pr-0'>.{item.type.split('/')[1]}</div>
                <div className='col-2'>
                  <CloseCircleOutlined
                    onClick={() => {
                      draggerProps.onRemove();
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal
          maskClosable={false}
          closable={false}
          footer={null}
          visible={uploading}
          width={1000}
          centered
        >
          <Progress
            strokeColor={{
              from: '#108ee9',
              to: '#87d068',
            }}
            percent={percentValue}
            status='active'
            className='p-4'
          />
        </Modal>
      </Modal>
    </>
  );
};

export default UploadPdfFaq;
