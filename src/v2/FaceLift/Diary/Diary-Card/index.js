import React, { useState } from 'react';
import '../index.css';
import fileDownload from 'js-file-download';
import {
  FileUnknownOutlined,
  PaperClipOutlined,
  MoreOutlined,
  CloseOutlined,
  EyeFilled,
} from '@ant-design/icons';
import {
  Badge,
  Avatar,
  message,
  Space,
  Drawer,
  Popover,
  Popconfirm,
  Divider,
} from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useHistory } from 'react-router-dom';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import moment from 'moment';
import hwIcon from 'v2/Assets/dashboardIcons/diaryIcons/hwIcon.png';
import { getFileIcon } from 'v2/getFileIcon';

const DiaryCard = ({ diary, fetchDiaryList }) => {
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const { user_id } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [homeworkDetails, setHomeworkDetails] = useState(false);

  const history = useHistory();

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

  const editDiary = (data) => {
    history.push({
      pathname: '/create/daily-diary',
      state: {
        data: data,
        isDiaryEdit: true,
      },
    });
  };

  const fetchHomeworkDetails = (params = {}) => {
    axios
      .get(`${endpoints?.dailyDiary?.assignHomeworkDiary}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status == 200) {
          if (result?.data?.data.length > 0) {
            axios
              .get(`academic/${result?.data?.data[0]?.id}/hw-questions/?hw_status=1`)
              .then((result) => {
                if (result?.data?.status_code == 200) {
                  setHomeworkDetails(result?.data?.data);
                }
              })
              .catch((error) => message.error('error', error?.message));
          }
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  return (
    <>
      <div className={`th-br-6 th-bg-white`} style={{ border: '1px solid #d9d9d9' }}>
        <div
          className={`row ${
            diary?.diary_type == 2 ? 'th-bg-blue-1' : 'th-bg-pink-3'
          } align-items-center py-1`}
          style={{ borderRadius: '6px 6px 0px 0px' }}
        >
          <div className='col-7 pl-2'>
            <div className='th-fw-600 th-black-2'>
              <span>{diary?.grade[0]?.grade_name}, </span>
              <span>
                {diary?.section[0]?.section__section_name?.slice(-1).toUpperCase()}
              </span>
            </div>
          </div>
          <div className='col-4 text-center px-0 py-1'>
            <span
              className={`${
                diary?.diary_type == 2 ? 'th-bg-primary' : 'th-bg-violet'
              } th-white th-br-6 p-1`}
            >
              {diary?.diary_type == 2 ? 'Daily Diary' : 'General Diary'}
            </span>
          </div>
          <div className='col-1 text-right '>
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
                </>
              }
              trigger='click'
              placement='bottomRight'
            >
              <MoreOutlined />
            </Popover>
          </div>
        </div>
        <div className='row' onClick={showDrawer}>
          <div className='col-12 p-1'>
            <div className='row th-bg-grey py-1 px-2'>
              {diary?.diary_type == 1 ? (
                <>
                  <>
                    <div className='col-12 px-0 th-10'>
                      <div className='th-fw-600 th-black-1 '></div>Title
                    </div>
                    <div className='col-12 px-0 th-fw-500 th-black-2 text-truncate'>
                      {diary?.title}
                    </div>
                    <div className='col-12 px-0 th-10'>
                      <div className='th-fw-600 th-black-1'></div>Description
                    </div>
                    <div className='col-12 px-0 th-fw-500 th-black-2 text-truncate'>
                      {diary?.message}
                    </div>
                  </>
                </>
              ) : (
                <>
                  <div className='col-12 px-0 th-10 '>
                    <div className='th-fw-600 th-black-1'></div>Topic Name{' '}
                    <span className='th-black-2'>({diary?.period_name})</span>
                  </div>
                  <div className='col-12 px-0 th-fw-500 th-black-2 text-truncate'>
                    {diary?.topic_name}
                  </div>
                  <div className='col-12 px-0 th-10'>
                    <div className='th-fw-600 th-black-1'></div>Key Concept{' '}
                  </div>
                  <div className='col-12 px-0 th-fw-500 th-black-2 text-truncate'>
                    {diary?.key_concept__topic_name}
                  </div>
                </>
              )}{' '}
            </div>
          </div>
          <div className='col-12 p-0 px-1'>
            <div className='row'>
              <div className='col-6 px-1 th-10'>
                <div className='row th-grey'></div>Created By
                <div className='row th-black-2 th-16 th-fw-600'>
                  {diary?.created_by?.first_name}&nbsp;{diary?.created_by?.last_name}
                </div>
                <div className='row px-0 th-12 th-grey'>
                  {moment(diary?.created_at).format('DD/MM/YYYY HH:mm a')}
                </div>
              </div>

              <div className='col-6 px-2 pb-1'>
                <div
                  className={`row ${
                    diary?.diary_type == 1
                      ? 'justify-content-end'
                      : 'justify-content-between'
                  } align-items-end h-100`}
                >
                  {diary?.diary_type == 2 && (
                    <div className='d-flex align-items-end th-bg-grey th-12 p-0'>
                      <span>
                        <img src={hwIcon} height={35} />
                      </span>
                      <span className='th-red px-2 th-fw-500'>
                        Homework <br />
                        not assigned
                      </span>
                    </div>
                  )}
                  <div>
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
              {diary?.diary_type == 1 ? (
                <>
                  <div className='th-fw-600 th-primary th-18 text-capitalize pt-2'>
                    {diary?.title}
                  </div>
                  <div className='th-fw-400 mt-1'>Created On:</div>
                  <div className='th-fw-400 mb-1'>21-11-2022, 12:56 pm</div>
                </>
              ) : (
                <>
                  <div className='row th-fw-700 th-black-1 py-1'>
                    <div className='col-3 px-0'>Subject : </div>
                    <div className='col-8 pl-0'>Mathematics </div>
                    <div className='col-1 px-0 tex-right'>
                      <CloseOutlined onClick={closeDrawer} />
                    </div>
                  </div>
                  <div className='row th-fw-600'>Grade: 2B</div>
                  <div className='row py-1'>
                    <div className='row'>
                      <span className='th-black-2'>Created By : </span>{' '}
                      <span className='th-fw-600'>Teachers Name</span>
                    </div>
                    <div className='row th-12 th-black-2'> 21-11-2022, 12:56 pm</div>
                  </div>
                </>
              )}
            </div>
          </div>
        }
        onClose={closeDrawer}
        visible={drawerVisible}
        closable={false}
        width={window.innerWidth < 768 ? '90vw' : '450px'}
      >
        <>
          {diary?.diary_type == 1 ? (
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
          ) : (
            <>
              <div
                className='th-bg-white shadom-sm pb-3 th-br-4'
                style={{ border: '2px solid #d9d9d9' }}
              >
                <div className='row th-black-1 th-fw-600 th-bg-pink-2 px-2 py-1 th-18'>
                  Today's Topic
                </div>
                <div className='row th-fw-600 pt-2'>
                  <div className='col-4 pr-0'>Period Number :</div>
                  <div className='col-8 pl-0 text-truncate'>2</div>
                </div>
                <div className='row'>
                  <div className='col-4 pr-0 th-fw-600'>Module :</div>
                  <div className='col-8 pl-0 text-truncate th-grey-1'>Module name</div>
                </div>
                <div className='row'>
                  <div className='col-4 pr-0 th-fw-600'>Chapter Name :</div>
                  <div className='col-8 pl-0 text-truncate th-grey-1'>Chapter name</div>
                </div>
                <div className='row'>
                  <div className='col-4 pr-0 th-fw-600'>Key Concept :</div>
                  <div className='col-8 pl-0 text-truncate th-grey-1'>Concept name</div>
                </div>
                <div className='row'>
                  <div className='col-12'>
                    <Divider className='my-3' />
                  </div>
                </div>
                <div className='row th-fw-600'>
                  <div className='col-12 th-grey-1 th-18'>Upcoming Period</div>
                </div>
                <div className='row th-fw-600 pt-2'>
                  <div className='col-4 pr-0'>Period Number :</div>
                  <div className='col-8 pl-0 text-truncate'>2</div>
                </div>
                <div className='row'>
                  <div className='col-4 pr-0 th-fw-600'>Module :</div>
                  <div className='col-8 pl-0 text-truncate th-grey-1'>Module name</div>
                </div>
                <div className='row'>
                  <div className='col-4 pr-0 th-fw-600'>Chapter Name :</div>
                  <div className='col-8 pl-0 text-truncate th-grey-1'>Chapter name</div>
                </div>
                <div className='row'>
                  <div className='col-4 pr-0 th-fw-600'>Key Concept :</div>
                  <div className='col-8 pl-0 text-truncate th-grey-1'>Concept name</div>
                </div>
              </div>
              <div className='row py-2'>
                <div className='col-12 px-0 th-fw-600'>Homework</div>
                <div className='col-12 px-0'>
                  <div className='row th-bg-blue-2 th-br-6'>
                    <div className='row pt-1'>
                      <div className='col-3 pr-0 th-black-1'>Title</div>
                      <div className='col-9 pl-0'>Concept name</div>
                    </div>
                    <div className='row pt-1'>
                      <div className='col-3 pr-0 th-black-1'>Instructions</div>
                      <div className='col-9 pl-0'>Concept name</div>
                    </div>
                    <div className='row pt-1'>
                      <div className='col-3 pr-0 th-black-1'>Due Date</div>
                      <div className='col-9 pl-0'>Concept name</div>
                    </div>
                    <div className='row py-1'>
                      <div className='col-3 pr-0 th-black-1'>Description</div>
                      <div className='col-9 pl-0'>Concept name</div>
                    </div>
                    <div class='row py-1 pb-2 justify-content-end'>
                      <div class='col-4 text-center'>
                        <div class='th-bg-primary th-white px-2 py-1 th-br-6 th-pointer'>
                          {' '}
                          View Details
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row py-2'>
                <div className='col-12 px-0 th-fw-600'>Notes</div>
                <div className='col-12 px-0'>
                  <div className='row th-bg-blue-1 th-br-6'>
                    <div className='row py-1'>
                      <div className='col-3 pr-0 th-black-1'>Description</div>
                      <div className='col-9 pl-0'>Concept name</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
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
                <div
                  className='th-16 th-primary'
                  style={{ height: 120, overflowY: 'auto' }}
                >
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

export default DiaryCard;
