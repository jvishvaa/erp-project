import React, { useEffect, useState } from 'react';
import { Modal, Upload, message, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import endpoints from 'v2/config/endpoints';
import axios from 'v2/config/axios';
import dragDropIcon from 'v2/Assets/dashboardIcons/announcementListIcons/dragDropIcon.svg';
import { Progress } from 'antd';

const UploadDocument = (props) => {
  const [fileList, setFileList] = useState([]);
  const [fileTypeError, setFileTypeError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileUploadInProgress, setFileUploadInProgress] = useState(false);
  const [percentValue, setPercentValue] = useState(10);

  let idInterval = null;
  useEffect(() => {
    if (fileUploadInProgress == true && percentValue < 90) {
      idInterval = setInterval(
        () => setPercentValue((oldCount) => checkCount(oldCount)),
        1000
      );
    }
    if (fileUploadInProgress == true && percentValue < 90) {
      idInterval = setInterval(
        () => setPercentValue((oldCount) => checkCount(oldCount)),
        1000
      );
    }

    return () => {
      clearInterval(idInterval);
      setPercentValue(10);
    };
  }, [fileUploadInProgress]);

  const checkCount = (count) => {
    if (count < 90) {
      return count + 5;
    } else {
      return count;
    }
  };
  const getSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(parseFloat(bytes / Math.pow(k, i))) + ' ' + sizes[i];
  };

  const handleUpload = () => {
    console.log(uniqueFilesList, 'listfile');
    let validateMP4 = false;
    let checkMP4 = uniqueFilesList.map((e) => {
      if (e?.type == 'video/mp4' && e?.size > 524288000) {
        validateMP4 = true;
        return message.error('MP4 Size Cannot Exceed 500MB');
      }
    });
    if (validateMP4 == false) {
      uniqueFilesList.forEach((file) => {
        const formData = new FormData();
        formData.append('branch_name', props?.branchName);
        formData.append('grades', props?.gradeID);
        formData.append('file', file);
        if (props?.section) {
          formData.append('section', props?.section);
        }
        setFileUploadInProgress(true);
        axios
          .post(`${endpoints.dailyDiary.upload}`, formData)
          .then((res) => {
            if (res?.data?.status_code === 200) {
              message.success('Attachment Added');
              props.setUploadedFiles((pre) => [...pre, res?.data?.result]);
              setFileList([]);
              props.handleClose();
              setUploading(false);
              setFileUploadInProgress(false);
            }
          })
          .catch((e) => {
            message.error(e);
            setFileUploadInProgress(false);
          });
      });
    }
  };
  const { Dragger } = Upload;
  const draggerProps = {
    showUploadList: false,
    disabled: false,
    accept: '.jpeg,.jpg,.png,.pdf,.mp4 ',
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (...file) => {
      let type = file[0]?.type.split('/')[1];
      if (type == 'mp4') {
        let checkFormat = file[0]?.name.split('.')[1];
        type = checkFormat;
      }
      if (['jpeg', 'jpg', 'png', 'pdf', 'mp4'].includes(type)) {
        setFileList([...fileList, ...file[1]]);
        setFileTypeError(false);
      } else {
        setFileTypeError(true);
      }
      return false;
    },
    fileList,
  };

  const uniqueFiles = [];
  let uniqueFilesList = fileList.filter((element) => {
    const isDuplicate = uniqueFiles.includes(element.name);

    if (!isDuplicate) {
      uniqueFiles.push(element.name);

      return true;
    }
  });

  useEffect(() => {
    if (uniqueFilesList.length !== 0) {
      setUploading(false);
    } else {
      setUploading(true);
    }
  }, [uniqueFilesList]);
  return (
    <>
      <Modal
        centered
        visible={props?.show}
        width={500}
        className='th-upload-modal'
        title='Upload Files'
        onCancel={() => {
          setFileList([]);
          props.handleClose();
        }}
        footer={
          <div className='d-flex justify-content-center'>
            <Button
              className='th-br-4 th-black-2'
              onClick={() => {
                setFileList([]);
                props.handleClose();
              }}
              style={{ border: '1px solid #868686' }}
            >
              Cancel
            </Button>

            <Button
              className='th-fw-500 th-br-4 th-bg-primary th-white'
              onClick={() => {
                setUploading(true);
                handleUpload();
              }}
              disabled={uploading}
            >
              Upload
            </Button>
          </div>
        }
      >
        <div className='row px-4 mt-3 th-bg-white th-br-10'>
          <Dragger
            multiple
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
              <img src={dragDropIcon} />
            </p>

            <p className='pt-2'>
              {' '}
              Drag And Drop Files Here <br /> or
            </p>

            <Button
              className='th-primary pb-2 mt-0 th-bg-white th-br-4'
              style={{ border: '1px solid #1b4ccb' }}
            >
              Browse Files
            </Button>
          </Dragger>
          {fileTypeError && (
            <div className='row pt-3 justify-content-center th-red'>
              Please add image, pdf and mp4 files only
            </div>
          )}
          {fileList?.length > 0 && (
            <span className='th-black-1 mt-3'>Selected Files</span>
          )}
          <div className='row my-2 th-grey' style={{ height: 150, overflowY: 'auto' }}>
            {uniqueFilesList?.map((item) => {
              const filename = item?.name?.split('.')[0];
              const extension = item?.type?.split('/')[1];

              return (
                <div className='row mb-1 align-items-center th-12 th-bg-grey py-2'>
                  <div className='col-6 text-truncate'>{filename}</div>
                  <div className='col-2 px-0'>{getSize(item?.size)}</div>
                  <div className='col-2 pr-0'>.{extension}</div>
                  <div className='col-2'>
                    <CloseCircleOutlined
                      onClick={() => {
                        draggerProps.onRemove(item);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
      <Modal
        maskClosable={false}
        closable={false}
        footer={null}
        visible={fileUploadInProgress}
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
    </>
  );
};

export default UploadDocument;
