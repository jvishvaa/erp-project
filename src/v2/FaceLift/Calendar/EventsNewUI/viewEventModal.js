import React from 'react';
import { Button, Card, Modal, Popconfirm } from 'antd';
import {
  DownloadOutlined,
  WalletOutlined,
  CalendarOutlined,
  BarcodeOutlined,
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
}) => {
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
      const fullName = item?.split('.').pop();
      await downloadFile(`${item}`, fullName);
    }
  };
  const downloadFile = async (url, fullName) => {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, fullName);
  };
  const policyDatesArray = viewEvent?.policy_dates
    ? Object.entries(viewEvent.policy_dates).map(([date, amount]) => ({
        date,
        amount: `Rs. ${amount}`,
      }))
    : [];

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
                        className='th-10'
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
                      <span className=' th-fw-600'>{viewEvent?.reg_start}</span>
                    </div>
                  </div>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div
                      className='d-flex align-items-center justify-content-start'
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
                    {viewEvent?.approval_status == 4 ? (
                      viewEvent?.subscription == 'unsubscribed' ? (
                        <Button type='default' className='th-br-6'>
                          Unsubscribed
                        </Button>
                      ) : viewEvent?.subscription == 'subscribed' ? (
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
                            type='primary'
                            className='th-br-6'
                            loading={unSubscribeLoading}
                          >
                            Unsubscribe
                          </Button>
                        </Popconfirm>
                      ) : (
                        <Button
                          type='primary'
                          className='th-br-6'
                          loading={loading}
                          onClick={() => {
                            subscribeEvent({
                              eventId: viewEvent?.id,
                            });
                          }}
                        >
                          Subscribe
                        </Button>
                      )
                    ) : viewEvent?.approval_status == 3 ? (
                      <Button type='ghost' className='th-br-6' disabled>
                        Cancelled
                      </Button>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </Card>
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
