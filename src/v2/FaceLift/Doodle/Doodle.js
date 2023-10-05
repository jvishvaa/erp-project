import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Popover, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import ENVCONFIG from 'v2/config/config';

const Doodle = () => {
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [doodleData, setDoodleData] = useState([]);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const handleFinance = () => {
    window.location.href.includes('dheerajinternational')
      ? window.open(
          `https://formbuilder.ccavenue.com/live/dheeraj-international-school`,
          '_blank'
        )
      : window.open(
          `${ENVCONFIG?.apiGateway?.finance}/sso/finance/${token}#/auth/login`,
          '_blank'
        );
  };
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
            {(doodleData?.enable_branches || []).some(
              (branchId) => branchId === selectedBranch?.id
            ) && (
              <div style={{ position: 'absolute', bottom: '20px', right: '60px' }}>
                <Button
                  type='primary'
                  className='btn-block th-br-4 th-14'
                  style={{
                    width: '80px',
                    height: '30px',
                    fontWeight: 'bold',
                    padding: '0px 2px',
                  }}
                  onClick={handleFinance}
                >
                  Pay Now 
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Doodle;
