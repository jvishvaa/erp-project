import React from 'react';
import IdayDoodle from 'v2/Assets/images/iDay2.jpg';
import { Popover, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const Doodle = () => {
  let title = '75 Years of Independence';
  let description =
    "This 15th August marks the 75 years of Independence in India. The Government of India decided to celebrate the 75 years of Independence of India, with great excitement and tribute to freedom fighters. So, they decided to do various programs and the government named the celebration as 'Azadi Ka Amrit Mahotsav'. Amrit Mahotsav meaning Nectar of grand celebration which signifies the 75 years of India's independence from British Raj.The government of India also started a campaign 'Har Ghar Tiranga' where it will provide the National flag to every household. ";
  const doodleInfo = () => {
    return (
      <div className='row p-2 flex-column'>
        <div className='th-20 th-fw-600 th-primary'>{title}</div>
        <div
          className='th-14 th-fw-400 th-black-2 py-3'
          style={{ height: 200, width: '75vw', overflowY: 'auto' }}
        >
          {description}
        </div>
      </div>
    );
  };
  return (
    <div className='row px-3 mb-2'>
      <div className='col-md-4 th-bg-grey shadow-sm d-none d-md-block'>
        <div className='row pt-3 th-primary th-18 th-fw-600'>{title}</div>
        <div
          className='row py-3 th-black-2 pr-2 mt-1 text-wrap text-justify'
          style={{ height: '220px', overflowY: 'scroll' }}
        >
          {description}
        </div>
      </div>
      <div className='col-md-8 shadow-sm px-0 '>
        <Popover
          placement='bottomLeft'
          content={doodleInfo}
          trigger='click'
          className='d-md-none'
        >
          <div
            className='th-bg-grey th-br-6 p-2 th-pointer'
            style={{ border: '1px solid #d9d9d9', position: 'absolute', top: '5%' }}
          >
            <InfoCircleOutlined height={20} />
          </div>
        </Popover>
        <img
          src={IdayDoodle}
          className='th-br-6'
          style={{ height: '300px', width: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

export default Doodle;
