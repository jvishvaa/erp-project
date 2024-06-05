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
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
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

  return (
    <>
      <Modal
        title={
          <div className='d-flex justify-content-between align-items-center'>
            <div>{viewEvent?.title}</div>
            <div>
              <CloseSquareOutlined
                style={{ fontSize: '22px' }}
                onClick={closeViewEventModal}
              />
            </div>
          </div>
        }
        visible={viewEventModalOpen}
        className='th-event-modal-preview'
        // footer={[
        //   <Row justify='space-around'>
        //     <Col>
        //       <Button
        //         size='small'
        //         className='secondary-button drawer-modal-footer-button'
        //         onClick={closeViewEventModal}
        //       >
        //         Close
        //       </Button>
        //     </Col>
        //   </Row>,
        // ]}
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
              <div className='col-lg-8 col-md-7 col-sm-8 col-12'>
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
              <div className='col-lg-4 col-md-5 col-sm-12 col-12'>
                <List
                  size='small'
                  className='th-event-list'
                  header={<div className='th-event-list-header'>Event Details</div>}
                  dataSource={[
                    { title: 'Reg Start Date', content: viewEvent?.reg_start },
                    { title: 'Reg End Date', content: viewEvent?.reg_end },
                    { title: 'Event Date', content: viewEvent?.event_date },
                    {
                      title: 'Amount',
                      content: viewEvent?.event_price
                        ? `Rs. ${viewEvent?.event_price}`
                        : 'Nill',
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item className='th-event-list-item'>
                      <strong>{item.title}:</strong> {item.content}
                    </List.Item>
                  )}
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
