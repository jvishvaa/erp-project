import React, { useState } from 'react';
import '../index.css';
import fileDownload from 'js-file-download';
import {
  PaperClipOutlined,
  EllipsisOutlined,
  EyeFilled,
  CloseOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { Button, message, Space, Drawer, Popover } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useHistory } from 'react-router-dom';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';

const DiaryCard = ({ diary, fetchDiaryList }) => {
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const history = useHistory();

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const handleDownloadAll = (files) => {
    files.map((item) => {
      const fullName = item?.split('_')[item?.split('_').length - 1];

      axios
        .get(`${endpoints.announcementList.s3erp}${item}`, {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res.data, fullName);
        });
    });
  };

  const deleteDiary = (id) => {
    axios
      .delete(`${endpoints?.dailyDiary?.updateDelete}${id}/update-delete-dairy/`)
      .then((response) => {
        if (response?.data?.status_code === 200) {
          message.success('Holiday Deleted Successfully');
          fetchDiaryList();
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const editDiary = (data) => {
    history.push({
      pathname: '/create/daily-diary',
      state: {
        data: data,
        isEdit: true,
      },
    });
  };

  return (
    <div
      className={`row th-br-6 ${diary?.dairy_type == 2 ? 'th-bg-yellow' : 'th-bg-grey'}`}
      style={{ border: '1px solid #d9d9d9' }}
    >
      <div className='col-md-12 py-3'>
        <div className='row th-16 th-fw-700 d-flex justify-content-between th-black-1'>
          {' '}
          <div>
            {diary?.dairy_type == 2
              ? diary?.subject?.subject_name
              : `Topic: ${diary?.title}`}
          </div>
          <div>
            <Popover
              content={
                <>
                  {diary?.dairy_type == 2 && (
                    <div
                      className='row justify-content-between th-pointer'
                      onClick={() => editDiary(diary)}
                    >
                      <span className='th-green th-16'>Edit</span>
                    </div>
                  )}

                  <div
                    className='row justify-content-between th-pointer pt-2'
                    onClick={() => deleteDiary(diary?.id)}
                  >
                    <span className='th-red th-16 '>Delete</span>
                  </div>
                </>
              }
              trigger='click'
              placement='bottomRight'
            >
              <EllipsisOutlined />
            </Popover>{' '}
          </div>
        </div>

        <div className='row th-black-2 th-fw-500 py-2'>
          {diary?.dairy_type == 1 ? 'General Diary' : 'Daiy Dairy'}
        </div>
        <div className='row th-black-2 py-2'>
          <span className='text-truncate'>
            {diary?.dairy_type == 2
              ? diary?.teacher_report?.homework
              : `Message: ${diary?.message}`}
          </span>
        </div>

        <div className='row th-black-2'>
          Created By -
          <span>
            {diary?.created_by?.first_name} on {diary?.created_at?.substring(0, 10)}
          </span>
        </div>
        <Button
          className='th-white badge th-bg-primary th-br-10 mt-2'
          onClick={showDrawer}
          visible={visible}
        >
          View More
        </Button>

        <div className='row py-2'>
          <div
            className='col-4 th-br-10 py-1 th-bg-grey'
            style={{ border: '1px solid #d9d9d9' }}
          >
            <PaperClipOutlined /> {diary?.documents ? diary?.documents.length : 0} Files
          </div>
        </div>
      </div>
      <Drawer
        placement='right'
        className='th-diaryDrawer'
        title={
          <div>
            <div className='th-fw-600 th-primary th-18'>
              {diary?.dairy_type == 2 ? diary?.subject?.subject_name : diary?.title}
            </div>
            <div className='th-fw-400 mt-2'>Created On:</div>
            <div className='th-fw-400'>{diary?.created_at?.substring(0, 10)}</div>
          </div>
        }
        onClose={closeDrawer}
        // visible={true}
        visible={visible}
        closable={false}
        extra={
          <Space>
            <CloseOutlined clasName='th-primary' onClick={closeDrawer} />
          </Space>
        }
      >
        <div className='row'>
          {diary?.dairy_type == 2 ? (
            <>
              <div
                className='row px-3 py-2 th-bg-grey th-br-6 flex-column th-black-2 mb-3'
                style={{ border: '1px solid #d9d9d9' }}
              >
                <div className='th-16 th-black-2 th-fw-500'>Recap of previous class:</div>
                <div className='th-16 th-primary th-width-100 text-wrap'>
                  {diary?.teacher_report?.previous_class}
                </div>
              </div>
              <div
                className='row px-3 py-2 th-bg-grey th-br-6 flex-column th-black-2 mb-3'
                style={{ border: '1px solid #d9d9d9' }}
              >
                <div className='th-16 th-black-2 th-fw-500'>Details of classwork:</div>
                <div className='th-16 th-primary th-width-100 text-wrap'>
                  {diary?.teacher_report?.class_work}
                </div>
              </div>
              <div
                className='row px-3 py-2 th-bg-grey th-br-6 flex-column th-black-2 mb-3'
                style={{ border: '1px solid #d9d9d9' }}
              >
                <div className='th-16 th-black-2 th-fw-500'>Summary:</div>
                <div className='th-16 th-primary th-width-100 text-wrap'>
                  {diary?.teacher_report?.summary}
                </div>
              </div>
              <div
                className='row px-3 py-2 th-bg-grey th-br-6 flex-column th-black-2 mb-3'
                style={{ border: '1px solid #d9d9d9' }}
              >
                <div className='th-16 th-black-2 th-fw-500'>Tools Used:</div>
                <div className='th-16 th-primary th-width-100 text-wrap'>
                  {diary?.teacher_report?.tools_used}
                </div>
              </div>
              <div
                className='row px-3 py-2 th-bg-grey th-br-6 flex-column th-black-2 mb-3'
                style={{ border: '1px solid #d9d9d9' }}
              >
                <div className='th-16 th-black-2 th-fw-500'>Homework:</div>
                <div className='th-16 th-primary th-width-100 text-wrap'>
                  {diary?.teacher_report?.homework}
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className='row px-3 py-2 th-bg-grey th-br-6 flex-column th-black-2 mb-3'
                style={{ border: '1px solid #d9d9d9' }}
              >
                <div className='th-16 th-black-2 th-fw-500'>Title:</div>
                <div className='th-16 th-primary th-width-100 text-wrap'>
                  {diary?.title}
                </div>
              </div>
              <div
                className='row px-3 py-2 th-bg-grey th-br-6 flex-column th-black-2 mb-3'
                style={{ border: '1px solid #d9d9d9' }}
              >
                <div className='th-16 th-black-2 th-fw-500'>Message:</div>
                <div className='th-16 th-primary th-width-100 text-wrap'>
                  {diary?.message}
                </div>
              </div>
            </>
          )}
          {diary?.documents?.length > 0 && (
            <div
              className='row px-3 py-2 th-bg-grey th-br-6 flex-column th-black-2 mb-3'
              style={{ border: '1px solid #d9d9d9' }}
            >
              <div className='th-16 th-black-2 th-fw-500 row'>
                <div className='col-6 pl-0 text-left'>Media:</div>
                <div className='col-6 text-right'>
                  <u
                    className='th-pointer th-12'
                    onClick={() => handleDownloadAll(diary?.documents)}
                  >
                    Download All
                  </u>
                </div>
              </div>
              <div className='th-16 th-primary' style={{ height: 80, overflowY: 'auto' }}>
                {diary?.documents?.map((each) => {
                  const fullName = each?.split('_')[each?.split('_').length - 1];
                  const fileName = fullName.split('.')[fullName?.split('.').length - 2];
                  const extension = fullName.split('.')[fullName?.split('.').length - 1];

                  return (
                    <div className='row py-2'>
                      <div className='col-8 pl-0' md={6}>
                        <div className='th-primary text-truncate'>{fileName}</div>
                      </div>
                      
                      <div className='col-4'>
                        <a href={`${endpoints.announcementList.s3erp}${each}`} download>
                          <ArrowDownOutlined className='th-primary th-pointer' />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default DiaryCard;
