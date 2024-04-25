import React, { useState } from 'react';
import { Modal, Upload, message, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import endpoints from 'v2/config/endpoints';
import axios from 'v2/config/axios';
import '../index.css';
import imageFileIcon from 'v2/Assets/dashboardIcons/announcementListIcons/imageFileIcon.svg';
import excelFileIcon from 'v2/Assets/dashboardIcons/announcementListIcons/excelFileIcon.svg';
import pdfFileIcon from 'v2/Assets/dashboardIcons/announcementListIcons/pdfFileIcon.svg';
import dragDropIcon from 'v2/Assets/dashboardIcons/announcementListIcons/dragDropIcon.svg';
import Loading from 'components/loader/loader';

const UploadModal = (props) => {
  const [fileList, setFileList] = useState([]);
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getFileIcon = (type) => {
    switch (type) {
      case 'png':
        return imageFileIcon;
      case 'jpeg':
        return imageFileIcon;
      case 'jpg':
        return imageFileIcon;
      case 'xlsx':
        return excelFileIcon;
      case 'xls':
        return excelFileIcon;
      case 'pdf':
        return pdfFileIcon;
      default:
        return pdfFileIcon;
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
    props.handleClose();
    let noOfFiles = uniqueFiles.length;
    uniqueFilesList.forEach((file) => {
      const formData = new FormData();
      formData.append('branch_id', props?.branchId);

      formData.append('file', file);

      axios
        .post(`${endpoints.createAnnouncement.uploadFile}`, formData)
        .then((res) => {
          if (res?.data?.status_code === 200) {
            message.success(res?.data?.message);
            props.setUploadedFiles((pre) => [...pre, res?.data?.data]);
            setFileList([]);
            noOfFiles = noOfFiles - 1;
            if (noOfFiles == 0) {
              setUploading(false);
            }
          }
        })
        .catch((e) => {
          message.error(e);
          setUploading(false);
        });
    });
  };
  const { Dragger } = Upload;
  const draggerProps = {
    showUploadList: false,
    disabled: false,
    multiple: true,
    accept: '.jpeg,.jpg,.png,.pdf,.mp3,.mp4',
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (...file) => {
      const type = file[0]?.type.split('/')[1];
      if (['jpeg', 'jpg', 'png', 'pdf', 'mp4', 'mpeg'].includes(type)) {
        if (file[0]?.size > 52428800) {
          setFileSizeError(true);
        } else {
          setFileList([...fileList, ...file[1]]);
          setFileSizeError(false);
        }
        setFileTypeError(false);
      } else {
        setFileTypeError(true);
      }
      return false;
    },
    fileList,
  };

  const uniqueFiles = [];

  const uniqueFilesList = fileList.filter((element) => {
    const isDuplicate = uniqueFiles.includes(element.name);

    if (!isDuplicate) {
      uniqueFiles.push(element.name);

      return true;
    }
  });

  return (
    <>
    {uploading ? <Loading message='Uploading...'/> : null}
      <Modal
        centered
        visible={props?.show}
        width={500}
        className='th-upload-modal'
        title='Upload Files'
        onCancel={props?.handleClose}
        footer={
          <div className='d-flex justify-content-center'>
            <Button
              className='th-br-4 th-black-2'
              onClick={props?.handleClose}
              style={{ border: '1px solid #868686' }}
            >
              Cancel
            </Button>

            <Button
              className='th-fw-500 th-br-4 th-bg-primary th-white'
              onClick={() => {
                if (uniqueFilesList.length > 0) {
                  setUploading(true);
                  handleUpload();
                }
              }}
              disabled={uploading || uniqueFilesList.length < 1}
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
            <p className='pt-2'>Accepted Files [jpeg,jpg,png,pdf,mp3,mp4]</p>
            <p className='pt-2'>The maximum size allowed for each file is 50 MB</p>
          </Dragger>
          {fileTypeError && (
            <div className='row pt-3 justify-content-center th-red'>
              This file type is not allowed
            </div>
          )}
          {fileSizeError && (
            <div className='row pt-3 justify-content-center th-red'>
              This file size must be less than 50 MB
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
                  <div className='col-1 pr-0'>
                    <img src={getFileIcon(extension)} />
                  </div>
                  <div className='col-5 text-truncate'>{filename}</div>
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
    </>
  );
};

export default UploadModal;
