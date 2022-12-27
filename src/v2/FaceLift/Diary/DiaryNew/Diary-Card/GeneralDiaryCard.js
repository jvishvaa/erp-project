import React, { useState } from 'react';
import '../index.css';
import fileDownload from 'js-file-download';
import { PaperClipOutlined, MoreOutlined, EyeFilled } from '@ant-design/icons';
import { Badge, Avatar, message, Drawer, Popover, Popconfirm, Tag } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import moment from 'moment';
import hwIcon from 'v2/Assets/dashboardIcons/diaryIcons/hwIcon.png';
import { getFileIcon } from 'v2/getFileIcon';

const GeneralDiaryCard = ({ diary, fetchDiaryList, isStudentDiary }) => {
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const { user_id } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
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
          message.success('Diary Deleted Successfully');
          fetchDiaryList();
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  return (
    <>
      <div className={`th-br-6 th-bg-white`} style={{ border: '1px solid #d9d9d9' }}>
        <div
          className={`row ${diary?.substitute ? 'th-bg-pink-2' : 'th-bg-pink-3'}
           align-items-center py-1`}
          style={{ borderRadius: '6px 6px 0px 0px' }}
        >
          <div className='col-7 pl-2'>
            <div className='th-fw-600 th-black-2 text-capitalize'>
              <span>{diary?.grade[0]?.grade_name}, </span>
              <span>Sec {diary?.section[0]?.section__section_name?.slice(-1)}</span>
            </div>
          </div>
          <div className='col-4 text-right px-0 py-1'>
            <Tag color='blue' className='th-10 th-br-6'>
              {diary?.substitute ? 'Substitute Diary' : 'General Diary'}
            </Tag>
          </div>
          {user_id == diary?.created_by?.id && (
            <div className='col-1 text-right pl-0'>
              <Popover
                content={
                  <Popconfirm
                    placement='bottomRight'
                    title={'Are you sure you want to delete this diary?'}
                    onConfirm={() => deleteDiary(diary?.id)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <div className='row justify-content-between th-pointer pt-2'>
                      <span className='th-red th-16 '>Delete</span>
                    </div>
                  </Popconfirm>
                }
                trigger='click'
                placement='bottomRight'
              >
                <MoreOutlined />
              </Popover>
            </div>
          )}
        </div>
        <div className='row' onClick={showDrawer}>
          <div className='col-12 p-1'>
            <div className='row th-bg-grey py-1 px-2'>
              <div className='col-12 px-0 th-10'>
                <div className='th-fw-600 th-black-1 '></div>Title
              </div>
              <div className='col-12 px-0 th-fw-500 th-black-2 text-truncate th-16'>
                {diary?.title}
              </div>
              <div className='col-12 px-0 th-10'>
                <div className='th-fw-600 th-black-1'></div>Description
              </div>
              <div className='col-12 px-0 th-fw-500 th-black-2 text-truncate th-16'>
                {diary?.message}
              </div>
            </div>
          </div>
          <div className='col-12 p-0 px-1'>
            <div className='row'>
              <div className='col-6 px-1 th-10'>
                <div className='row th-grey'></div>Created By
                <div className='row th-black-2 th-14 th-fw-600'>
                  {diary?.created_by?.first_name}&nbsp;{diary?.created_by?.last_name}
                </div>
                <div className='row px-0 th-12 th-grey'>
                  {moment(diary?.created_at).format('DD/MM/YYYY HH:mm a')}
                </div>
              </div>

              <div className='col-6 px-2 pb-1'>
                <div className={`row justify-content-end align-items-end h-100`}>
                  <div className='th-diary-badge'>
                    <Badge count={diary?.documents.length} size='small'>
                      <Avatar
                        shape='square'
                        size='large'
                        icon={<PaperClipOutlined />}
                        className='th-bg-grey th-black-2'
                      />
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        placement='right'
        className='th-diaryDrawer'
        zIndex={1300}
        title={
          <div className='row pr-1'>
            <div className='col-12 th-bg-yellow-2'>
              <div className='th-fw-600 th-primary th-18 text-capitalize pt-2'>
                {diary?.title}
              </div>
              <div className='th-fw-400 mt-1'>Created On:</div>
              <div className='th-fw-400 mb-1'>
                {moment(diary?.created_at).format('DD/MM/YYYY HH:mm a')}
              </div>
            </div>
          </div>
        }
        onClose={closeDrawer}
        visible={drawerVisible}
        closable={false}
        width={window.innerWidth < 768 ? '90vw' : '450px'}
      >
        <>
          <div
            className='row px-3 py-2 th-bg-grey th-br-6 flex-column th-black-2 mb-3'
            style={{ border: '1px solid #d9d9d9' }}
          >
            <div className='th-16 th-black-2 th-fw-500'>Title:</div>
            <div className='th-16 th-primary th-width-100 text-wrap'>{diary?.title}</div>
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

          {diary?.documents?.length > 0 && (
            <>
              <div className='th-16 th-black-2 th-fw-500 row'>
                <div className='col-6 pl-0 text-left'>Attachments:</div>
                <div className='col-6 text-right'>
                  <u
                    className='th-pointer th-12'
                    onClick={() => handleDownloadAll(diary?.documents)}
                  >
                    Download All
                  </u>
                </div>
              </div>
              <div
                className='row px-3 py-2 th-bg-white th-br-6 flex-column th-black-2 mb-3'
                style={{ border: '1px solid #d9d9d9' }}
              >
                <div className='th-16' style={{ height: 120, overflowY: 'auto' }}>
                  {diary?.documents?.map((each) => {
                    const fullName = each?.split('_')[each?.split('_').length - 1];
                    const fileName = fullName.split('.')[fullName?.split('.').length - 2];
                    const extension =
                      fullName.split('.')[fullName?.split('.').length - 1];

                    return (
                      <div
                        className='row mt-2 py-2 align-items-center th-bg-grey'
                        style={{ border: '1px solid #d9d9d9' }}
                      >
                        <div className='col-2'>
                          <img src={getFileIcon(extension)} />
                        </div>
                        <div className='col-10 px-0 th-pointer'>
                          <a
                            onClick={() => {
                              openPreview({
                                currentAttachmentIndex: 0,
                                attachmentsArray: [
                                  {
                                    src: `${endpoints.announcementList.s3erp}${each}`,

                                    name: fileName,
                                    extension: '.' + extension,
                                  },
                                ],
                              });
                            }}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            <div className='row align-items-center'>
                              <div className='col-10 px-1'>{fileName}</div>
                              <div className='col-2'>
                                <EyeFilled />
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </>
      </Drawer>
    </>
  );
};

export default GeneralDiaryCard;
