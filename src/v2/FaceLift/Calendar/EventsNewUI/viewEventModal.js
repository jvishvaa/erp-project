import React from 'react';
import { Button, Card, Modal, Popconfirm, Popover } from 'antd';
import {
  DownloadOutlined,
  WalletOutlined,
  CalendarOutlined,
  BarcodeOutlined,
  CloseOutlined,
  EditOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import './eventsDashboard.css';
import Slider from 'react-slick';
import MediaDisplay from './mediaDisplayEvents';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import { NumberFormatter } from 'v2/CommonFormatter';

const ViewEventModal = ({
  viewEventModalOpen,
  closeViewEventModal,
  viewEvent,
  subscribeEvent,
  unSubscribeEvent,
  loading,
  unSubscribeLoading,
  openEventDrawer,
  openFeedBackModal,
  approveEvent,
  approveLoading,
}) => {
  const user_level = JSON.parse(localStorage.getItem('userDetails'))?.user_level || '';
  const is_superuser = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))?.is_superuser
    : '';
  const is_central_user = [1, 2].includes(user_level) || is_superuser ? true : false;
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const handleDownloadAll = async (files) => {
    for (const item of files) {
      const fullName = item?.split('/')[item?.split('/').length - 1];
      await downloadFile(`${item}`, fullName);
    }
  };
  const downloadFile = async (url, fullName) => {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, fullName);
  };

  console.log({ viewEvent });
  return (
    <>
      <Modal
        title={'Events Details'}
        visible={viewEventModalOpen}
        centered
        className='th-upload-modal'
        footer={null}
        onCancel={() => closeViewEventModal()}
        width='90vw'
      >
        <div className='py-3 th-bg-grey' style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <div className='row'>
            <div className='col-md-8'>
              {viewEvent?.attachments?.length > 0 && (
                <div className='th-br-10 mb-4 py-2 th-bg-white'>
                  <Slider
                    {...settings}
                    className='th-slick th-post-slick'
                    style={{ height: 320 }}
                  >
                    {viewEvent?.attachments?.map((each) => (
                      <MediaDisplay
                        mediaName={each}
                        mediaLink={each}
                        alt='File Not Supported'
                        className='w-100 th-br-20 p-3'
                      />
                    ))}
                  </Slider>

                  {viewEvent?.attachments?.length > 0 && (
                    <div className='text-right'>
                      <Button
                        size='small'
                        className='th-14'
                        type='link'
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          handleDownloadAll(viewEvent?.attachments);
                        }}
                      >
                        Download all attachments
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <Card
                className='th-br-20 mb-4'
                title={<div className='font-weight-bold th-grey'>Event Highlights</div>}
              >
                <div className='th-calendar-description'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: viewEvent?.highlight,
                    }}
                  />
                </div>
              </Card>
              <Card
                className='th-br-20'
                title={<div className='font-weight-bold th-grey'>Event Description</div>}
              >
                <div className='th-calendar-description'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: viewEvent?.description,
                    }}
                  />
                </div>
              </Card>
            </div>
            <div className='col-md-4 pl-md-0'>
              <Card className='th-br-20 th-bg-blue-1 mb-4'>
                <div className='d-flex flex-column' style={{ gap: 10 }}>
                  <div className='th-fw-700 th-18'>{viewEvent?.title}</div>

                  <div
                    className='d-flex align-items-center justify-content-start'
                    style={{ gap: 10 }}
                  >
                    <BarcodeOutlined className='th-grey' />{' '}
                    <div className='th-black-1'>
                      Registration :{' '}
                      <span className=' th-fw-600'>
                        {viewEvent?.reg_start} to {viewEvent?.reg_end}
                      </span>
                    </div>
                  </div>
                  <div
                    className='d-flex align-items-center justify-content-start'
                    style={{ gap: 10 }}
                  >
                    <CalendarOutlined className='th-grey' />{' '}
                    <div className='th-black-1'>
                      Event Date :{' '}
                      <span className=' th-fw-600'>{viewEvent?.event_date}</span>
                    </div>
                  </div>

                  <div className={`d-flex flex-column align-items-start`}>
                    {viewEvent?.is_subscription_need && (
                      <div
                        className='d-flex align-items-center justify-content-start pb-2'
                        style={{ gap: 10 }}
                      >
                        <WalletOutlined className='th-grey' />{' '}
                        <div className='th-black-1 th-fw-700 th-22 '>
                          ₹{' '}
                          {viewEvent?.event_price
                            ? `${NumberFormatter(viewEvent?.event_price)}`
                            : '0'}
                        </div>
                      </div>
                    )}
                    {user_level == 13 ? (
                      viewEvent?.approval_status == 4 ? (
                        viewEvent?.is_subscription_need ? (
                          viewEvent?.subscription == 'unsubscribed' ? (
                            <Button type='ghost' className='th-br-6 w-100'>
                              Unsubscribed
                            </Button>
                          ) : (
                            <>
                              {viewEvent?.subscription == 'subscribed' ? (
                                <Popconfirm
                                  title='Are you sure you want to unsubscribe?'
                                  okText={'Unsubscribe'}
                                  onConfirm={() => {
                                    unSubscribeEvent({
                                      eventId: viewEvent?.id,
                                    });
                                  }}
                                  zIndex={2100}
                                  placement='bottomRight'
                                >
                                  <Button
                                    type='danger'
                                    className='th-br-6 w-100'
                                    loading={unSubscribeLoading}
                                  >
                                    Unsubscribe
                                  </Button>
                                </Popconfirm>
                              ) : (
                                <Popconfirm
                                  title='Are you sure you want to subscribe?'
                                  okText={'Subscribe'}
                                  onConfirm={() => {
                                    subscribeEvent({
                                      eventId: viewEvent?.id,
                                      row: viewEvent,
                                    });
                                  }}
                                  zIndex={2100}
                                  placement='bottomRight'
                                >
                                  <Button
                                    type='primary'
                                    className='th-br-6 w-100'
                                    loading={loading}
                                  >
                                    Subscribe
                                  </Button>
                                </Popconfirm>
                              )}
                              {viewEvent?.refundable && (
                                <div className='th-grey pt-2 th-12'>
                                  Note: Please read the refund policy
                                </div>
                              )}
                            </>
                          )
                        ) : null
                      ) : viewEvent?.approval_status == 3 ? (
                        <Button type='ghost' className='th-br-6 w-100' disabled>
                          Cancelled
                        </Button>
                      ) : (
                        ''
                      )
                    ) : (
                      <div
                        className='d-flex align-items-center justify-content-between w-100'
                        style={{ gap: 5 }}
                      >
                        {([10, 14, 34, 8, 26].includes(user_level) ||
                          is_central_user) && (
                          <>
                            {viewEvent?.approval_status === 1 && (
                              <Button
                                type='default'
                                icon={<EditOutlined />}
                                onClick={() =>
                                  openEventDrawer({ key: 'edit', rowData: viewEvent })
                                }
                                className='th-br-6 flex-fill w-100'
                              >
                                Edit
                              </Button>
                            )}
                          </>
                        )}
                        {[8, 26].includes(user_level) && (
                          <>
                            {viewEvent?.approval_status === 4 && (
                              <Button
                                type='default'
                                icon={<CloseOutlined />}
                                onClick={() =>
                                  openFeedBackModal({
                                    key: 'cancel',
                                    id: viewEvent?.id,
                                  })
                                }
                                className='th-br-6 w-100'
                              >
                                Cancel Event
                              </Button>
                            )}
                            {viewEvent?.approval_status === 1 && (
                              <>
                                <Popconfirm
                                  zIndex={2100}
                                  placement='bottom'
                                  title='Are you sure to approve the event ?'
                                  onConfirm={() =>
                                    approveEvent({ approveId: viewEvent?.id })
                                  }
                                  okText={'Approve'}
                                >
                                  <Button
                                    loading={approveLoading}
                                    type='primary'
                                    icon={<CheckOutlined />}
                                    className='th-br-6 flex-fill w-100'
                                  >
                                    Approve
                                  </Button>
                                </Popconfirm>
                                <Popconfirm
                                  zIndex={2100}
                                  placement='bottomLeft'
                                  okText={'Reject'}
                                  title='Are you sure to approve the event ?'
                                  onConfirm={() =>
                                    openFeedBackModal({
                                      key: 'reject',
                                      id: viewEvent?.id,
                                    })
                                  }
                                >
                                  <Button
                                    type='danger'
                                    icon={<CloseOutlined />}
                                    className='th-br-6 flex-fill w-100'
                                  >
                                    Reject
                                  </Button>
                                </Popconfirm>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
              {viewEvent?.refundable && (
                <Card
                  className='th-br-20'
                  title={<div className='font-weight-bold th-grey'>Refund Policy</div>}
                >
                  {Object.keys(viewEvent?.policy_dates)?.map((item) => {
                    return (
                      <div className='d-flex align-items-center justify-content-between mb-2 th-15'>
                        <div className='th-grey'>
                          Till {dayjs(item).format('MMM D, YYYY')}
                        </div>
                        <div className='th-black-1 th-fw-500'>
                          ₹ {viewEvent?.policy_dates[item]}
                        </div>
                      </div>
                    );
                  })}
                </Card>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ViewEventModal;
