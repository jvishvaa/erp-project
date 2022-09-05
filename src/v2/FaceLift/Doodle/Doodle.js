import React, { useState, useEffect } from 'react';
import { Popover, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';

const Doodle = () => {
  const [doodleData, setDoodleData] = useState([]);
  const fetchDoodle = () => {
    axios
      .get(`${endpoints.doodle.fetchDoodle}`)
      .then((response) => {
        if (response.data.status_code === 200) {
          setDoodleData(response?.data?.data);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  useEffect(() => {
    fetchDoodle();
  }, []);

  const doodleInfo = () => {
    return (
      <div className='row p-2 flex-column'>
        <div className='th-20 th-fw-600 th-primary'>{doodleData?.title}</div>
        <div
          className='th-14 th-fw-400 th-black-2 py-3'
          style={{ height: 200, width: '75vw', overflowY: 'auto' }}
        >
          {doodleData?.description}
        </div>
      </div>
    );
  };
  return (
    <>
      {doodleData && (
        <div className='row px-3 mb-2'>
          <div className='col-md-4 th-bg-grey shadow-sm d-none d-md-block'>
            <div className='row pt-3 th-primary th-18 th-fw-600'>{doodleData?.title}</div>
            <div
              className='row py-3 th-black-2 pr-2 mt-1 text-wrap text-justify'
              style={{ height: '220px', overflowY: 'scroll' }}
            >
              {doodleData?.description}
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
              src={`${endpoints.announcementList.s3erp}${doodleData?.image}`}
              className='th-br-6'
              style={{
                height: '300px',
                width: '100%',
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Doodle;
