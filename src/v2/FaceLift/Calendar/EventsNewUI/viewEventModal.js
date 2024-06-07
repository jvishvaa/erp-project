import React from 'react';
import { Button, Card, Modal, List, Row, Col } from 'antd';
import { DownloadOutlined, CloseSquareOutlined } from '@ant-design/icons';
import './eventsDashboard.css';
import Slider from 'react-slick';
import MediaDisplay from './mediaDisplayEvents';
import { saveAs } from 'file-saver';

const viewEventModal = ({ viewEventModalOpen, closeViewEventModal, viewEvent }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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

  return (
    <>
      <Modal
        title={
          <div className='d-flex justify-content-between align-items-center'>
            <div>{viewEvent?.title}</div>
            <div>
              <CloseSquareOutlined
                onClick={closeViewEventModal}
                className='th-close-icon'
              />
            </div>
          </div>
        }
        visible={viewEventModalOpen}
        className='th-event-modal-preview'
        footer={null}
        onCancel={() => closeViewEventModal()}
        style={{
          top: '0%',
          height: '100%',
          bottom: '0%',
        }}
        width='90%'
      >
        <>
          <div className='row'>
            <div className='row col-lg-12 col-md-12 col-sm-12 col-12'>
              <div className='col-lg-6 col-md-12 col-sm-12 col-12'>
                <Card className='th-images-card'>
                  {viewEvent?.attachments?.length > 0 ? (
                    <Slider {...settings} className='th-slick th-post-slick'>
                      {viewEvent?.attachments?.map((each) => (
                        <MediaDisplay
                          mediaName={each}
                          mediaLink={each}
                          alt='File Not Supported'
                          className='w-100 th-br-20 p-3'
                          style={{ objectFit: 'contain' }}
                        />
                      ))}
                    </Slider>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '12px',
                        fontStyle: 'italic',
                        height: '300px',
                      }}
                    >
                      No Attachments Available
                    </div>
                  )}
                  {viewEvent?.attachments?.length > 0 && (
                    <div className='text-right'>
                      <Button
                        size='small'
                        className='secondary-button'
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          handleDownloadAll(viewEvent?.attachments);
                        }}
                      >
                        Download all attachments
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
              <div className='col-lg-3 col-md-6 col-sm-12 col-12'>
                <List
                  size='small'
                  className='th-event-list'
                  header={<div className='th-event-list-header'>Event Details</div>}
                  dataSource={[
                    { title: 'Reg Start Date', content: viewEvent?.reg_start },
                    { title: 'Reg End Date', content: viewEvent?.reg_end },
                    { title: 'Event Date', content: viewEvent?.event_date },
                    {
                      title: 'Subscription',
                      content: viewEvent?.is_subscription_need ? 'Yes' : 'No',
                    },
                    {
                      title: 'Amount',
                      content: viewEvent?.event_price
                        ? `Rs. ${viewEvent?.event_price}`
                        : 'Rs. 0',
                    },
                    {
                      title: 'Refundable',
                      content: viewEvent?.refundable ? 'Yes' : 'No',
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item className='th-event-list-item'>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <span style={{ flex: 1 }}>{item.title}</span>
                        <span style={{ flex: 1, textAlign: 'right' }}>
                          {item.content}
                        </span>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
              <div className='col-lg-3 col-md-6 col-sm-12 col-12'>
                <List
                  size='small'
                  className='th-event-list'
                  header={
                    <>
                      <div className='th-event-list-header'>Refund Policy</div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '10px 10px',
                          borderBottom: '1px solid #f0f0f0',
                          background: '#fafafa',
                        }}
                      >
                        <span style={{ flex: 1 }}>
                          <strong>Cancel Before</strong>
                        </span>
                        <span style={{ flex: 1, textAlign: 'right' }}>
                          <strong>Refund Amount</strong>
                        </span>
                      </div>
                    </>
                  }
                  dataSource={policyDatesArray.length > 0 ? policyDatesArray : [{}]}
                  renderItem={(item) =>
                    viewEvent?.refundable && policyDatesArray.length > 0 ? (
                      <List.Item className='th-event-list-item'>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <span style={{ flex: 1 }}>{item.date}</span>
                          <span style={{ flex: 1, textAlign: 'right' }}>
                            {item.amount}
                          </span>
                        </div>
                      </List.Item>
                    ) : (
                      <List.Item className='d-flex justify-content-center align-items-center th-event-list-item'>
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '12px',
                            fontStyle: 'italic',
                            color: '#f44336',
                          }}
                        >
                          No Refund Once Subscribed
                        </span>
                      </List.Item>
                    )
                  }
                />
              </div>
            </div>
            <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
              <Card className='th-event-card'>
                <div className='card-content'>
                  <div className='card-title'>Event Highlights</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: viewEvent?.highlight,
                    }}
                  />
                </div>
              </Card>
              <Card className='th-event-card'>
                <div className='card-content'>
                  <div className='card-title'>Event Description</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: viewEvent?.description,
                    }}
                  />
                </div>
              </Card>
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};

export default viewEventModal;
