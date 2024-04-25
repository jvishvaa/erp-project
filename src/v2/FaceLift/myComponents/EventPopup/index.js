import React, { useState } from 'react';
import './index.css';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import NotificationBellIcon from 'v2/Assets/images/notification.gif';
import endpoints from 'v2/config/endpoints';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const EventPopup = (props) => {
  const [isOpen, setIsOpen] = useState(
    localStorage.getItem('eventPopupClosed') ? false : true
  );

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  let userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level;

  return userLevel === 13 ? (
    <>
      {isOpen ? (
        <div className='th-event-popup open shadow-md'>
          <Slider {...settings} className='th-slick pt-3'>
            {props?.eventList?.map((each) => {
              const imageUrl = `${endpoints.erpBucket}announcement/${each?.flash_img}`;

              return (
                <div
                  className='th-br-16 th-bg-white position-relative'
                  style={{ border: '1px #dedede solid' }}
                >
                  <div
                    className='th-event-close-icon'
                    onClick={() => {
                      setIsOpen(false);
                      localStorage.setItem('eventPopupClosed', true);
                    }}
                  >
                    <CloseOutlined />
                  </div>

                  <div
                    className='th-event-img pb-2'
                    // style={{
                    //   backgroundImage: `url(${imageUrl})`,
                    // }}
                  >
                    <img src={imageUrl} style={{ height: '100%', width: '100%' }} />
                  </div>
                  <div className='px-2 pb-3'>
                    <div className='th-20 th-fw-600 text-center pb-1'>{each?.title}</div>
                    <div
                      className='th-14 th-fw-400 text-center pb-3'
                      style={{ maxHeight: '100px', overflowY: 'scroll' }}
                    >
                      {each?.content}
                    </div>
                    {each?.event_link ? (
                      <a href={each?.event_link} target='_blank'>
                        <Button type='primary' className='btn-block th-br-4'>
                          View
                        </Button>
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      ) : (
        <div
          className='th-event-popup-closed eventClose th-bg-primary p-2 th-br-36'
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <img height={50} src={NotificationBellIcon} />
        </div>
      )}
    </>
  ) : null;
};
export default EventPopup;
