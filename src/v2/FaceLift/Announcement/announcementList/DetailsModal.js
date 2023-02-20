import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button, message, Carousel, Tooltip } from 'antd';
import {
  ArrowDownOutlined,
  LeftCircleFilled,
  RightCircleFilled,
} from '@ant-design/icons';
import { getTimeInterval } from 'v2/timeIntervalCalculator';
import { getRole } from 'v2/generalAnnouncementFunctions';
import axios from 'v2/config/axios';
import fileDownload from 'js-file-download';
import endpoints from 'v2/config/endpoints';
import imageFileIcon from 'v2/Assets/dashboardIcons/announcementListIcons/imageFileIcon.svg';
import excelFileIcon from 'v2/Assets/dashboardIcons/announcementListIcons/excelFileIcon.svg';
import pdfFileIcon from 'v2/Assets/dashboardIcons/announcementListIcons/pdfFileIcon.svg';
import moment from 'moment';
import '../index.css';

const DetailsModal = (props) => {
  const carousel = useRef();
  const data = props.data;
  const showTab = props.showTab;
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [branchName, setBranchName] = useState();
  const imageAttachments = data?.attachments.filter((item) =>
    ['jpg', 'jpeg', 'png'].includes(
      item.split('.')[item.split('.').length - 1].toLowerCase()
    )
  );
  const hasImageAttachments = imageAttachments.length > 0 ? true : false;

  const handleNext = () => carousel.current.next();

  const handlePrev = () => carousel.current.prev();

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
  const handleDownload = (files) => {
    files.map((item) => {
      const filename = item.split('/')[2];

      axios
        .get(`${endpoints.announcementList.s3erp}announcement/${item}`, {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res.data, filename);
        });
    });
  };

  const getDuration = (date) => {
    let currentDate = moment(date).format('DD/MM/YYYY');
    if (currentDate === moment().format('DD/MM/YYYY')) {
      return 'Today';
    } else if (currentDate == moment().subtract(1, 'days').format('DD/MM/YYYY')) {
      return 'Yesterday';
    } else {
      return (
        <span>
          on {currentDate} at {moment(data.created_time).format('LT')}
        </span>
      );
    }
  };

  function extractContent(s) {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  const handlePublish = (id) => {
    const params = {
      is_draft: false,
    };
    axios
      .patch(`${endpoints.createAnnouncement.updateAnnouncement}/${id}/`, params)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          props.handleClose();
          message.success('Announcement Published Successfully');
          props.setTab(3);
        }
      });
    props.setTab('3');
  };

  useEffect(() => {
    let gradelist = [];
    let sectionList = [];
    if (data.branch_name) {
      setBranchName(data?.branch_name[0]);
    }
    if (data?.bgsm?.length > 0) {
      data.bgsm.map((item) => {
        if (!gradelist.includes(item?.grade_name)) {
          gradelist.push(item?.grade_name);
          setGrades(gradelist);
        }
        if (!sections.includes(`${item?.grade_name} ${item?.section_name}`)) {
          sectionList.push(`${item?.grade_name} ${item?.section_name}`);
          setSections(sectionList);
        }
      });
    }
  }, []);
  return (
    <>
      <Modal
        centered
        visible={props?.show}
        onCancel={props?.handleClose}
        footer={false}
        width={hasImageAttachments ? 850 : 500}
      >
        <div className={`row justify-content-between px-0 th-14`}>
          {hasImageAttachments && (
            <div
              className='col-md-6 th-bg-grey px-4 pt-5 pt-sm-0'
              style={{ borderRadius: '10px 0px 0px 10px' }}
            >
              <Carousel effect='fade' dots={false} ref={carousel}>
                {imageAttachments?.map((item, index) => {
                  return (
                    <div className='d-flex th-primary'>
                      <img
                        src={`${endpoints.announcementList.s3erp}announcement/${item}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  );
                })}
              </Carousel>
              {imageAttachments.length > 1 && (
                <div className='d-flex justify-content-between'>
                  <LeftCircleFilled
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '0%',
                      fontSize: '30px',
                    }}
                    onClick={handlePrev}
                  />
                  <RightCircleFilled
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '0%',
                      fontSize: '30px',
                    }}
                    onClick={handleNext}
                  />
                </div>
              )}
            </div>
          )}

          <div
            className={`${hasImageAttachments ? 'col-md-6' : 'col-12'} pl-3 py-3`}
            style={{
              borderLeft: window.innerWidth < 768 ? '0px' : '2px solid #D9D9D9',
              borderRadius: hasImageAttachments ? '0px 10px 10px 0px' : '10px',
            }}
          >
            <div className='row th-black-1 th-fw-500 th-16 text-uppercase'>
              {data?.title}
            </div>

            <div className='row my-1 th-12'>
              <div className='row'>
                <div className='col-2 px-0'>
                  <div className='d-flex justify-content-between th-grey'>
                    <span>Branch</span>
                    <span>:&nbsp;</span>
                  </div>
                </div>
                <div className='col-10 pl-0 th-grey'>{branchName}</div>
              </div>
              {data?.role?.includes(13) && user_level != 13 && (
                <>
                  <div className='row th-grey'>
                    <div className='col-2 px-0'>
                      <div className='d-flex justify-content-between'>
                        <span>Grades</span>
                        <span>:&nbsp;</span>
                      </div>
                    </div>
                    <div className='col-10 pl-0'>
                      <span>{grades.slice(0, 2).toString()}</span>
                      {grades.length > 2 && (
                        <Tooltip
                          placement='bottomLeft'
                          title={
                            <div style={{ maxHeight: '150px', overflowY: 'scroll' }}>
                              {grades?.map((item) => (
                                <div>{item}</div>
                              ))}
                            </div>
                          }
                          trigger='click'
                          className='th-pointer'
                          zIndex={2000}
                        >
                          <span className='th-bg-grey th-12 th-black-1 p-1 th-br-6 ml-1 th-pointer'>
                            Show All
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  <div className='row th-grey'>
                    <div className='col-2 px-0'>
                      <div className='d-flex justify-content-between'>
                        <span>Sections</span>
                        <span>:&nbsp;</span>
                      </div>
                    </div>
                    <div className='col-10 pl-0 '>
                      <span>{sections.slice(0, 2).toString()}</span>
                      {sections.length > 2 && (
                        <Tooltip
                          placement='bottomLeft'
                          title={
                            <div style={{ maxHeight: '250px', overflowY: 'scroll' }}>
                              {sections?.map((item) => (
                                <div>{item}</div>
                              ))}
                            </div>
                          }
                          trigger='click'
                          className='th-pointer list_tooltip'
                          zIndex={2000}
                        >
                          <span className='th-bg-grey th-12 th-black-1 p-1 th-br-6 ml-1 th-pointer'>
                            Show All
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className='row th-grey'>
              Posted &nbsp;{getDuration(data.created_time)}&nbsp; by {data?.created_user}
            </div>
            <div className='row mt-1 th-12'>
              {data?.role.map((item) => (
                <div className='th-br-50 th-bg-grey th-black-2 px-3 py-2 mr-2 th-fw-400'>
                  {getRole(item)}
                </div>
              ))}
            </div>
            <div
              className='row mt-4 py-3 th-grey '
              style={{ overflowY: 'auto', maxHeight: 130 }}
            >
              <p>{extractContent(data?.content)}</p>
            </div>
            {data?.attachments.length > 0 && (
              <div className='row my-3 th-grey'>
                <div className='col-6 tex-left th-black-2 th-fw-500 pl-0'>
                  Attachments({data?.attachments.length}):
                </div>
                <div className='col-6 text-right th-primary th-12 pr-0'>
                  <u
                    className='th-pointer'
                    onClick={() => handleDownload(data?.attachments)}
                  >
                    Download All
                  </u>
                </div>
                <div className='row' style={{ height: '150px', overflowY: 'auto' }}>
                  {data?.attachments?.map((item) => {
                    const filename = item.split('/')[2].split('.')[0];
                    const extension = item.split('.')[item.split('.').length - 1];
                    return (
                      <div className='row my-3 align-items-center th-12'>
                        <div className='col-1 pr-0'>
                          <img src={getFileIcon(extension)} />
                        </div>
                        <div className='col-5 text-truncate'>{filename}</div>
                        <div className='col-4 pr-0'>.{extension}</div>
                        <div className='col-2 text-center'>
                          <a
                            href={`${endpoints.announcementList.s3erp}announcement/${item}`}
                            download
                          >
                            <ArrowDownOutlined className='th-primary th-pointer' />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {showTab == 2 && (
              <div className='d-flex justify-content-end'>
                <Button
                  className='th-bg-grey th-black-2 th-br-4 th-fw-500 th-14 th-pointer col-md-4 col-5 mr-5 mr-md-2'
                  style={{ border: '1px solid #D9D9D9' }}
                  onClick={props?.handleClose}
                >
                  Cancel
                </Button>

                <Button
                  className='th-bg-primary th-white th-br-4 th-fw-500 th-14 th-pointer col-md-4 col-5'
                  onClick={() => handlePublish(data?.id)}
                >
                  Publish
                </Button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DetailsModal;
