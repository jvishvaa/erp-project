import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Popover, message, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import ENVCONFIG from 'v2/config/config';
import ReactHtmlParser from 'react-html-parser';

const Doodle = () => {
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [doodleData, setDoodleData] = useState([]);
  const [payConfigData, setPayConfigData] = useState(null);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const handleFinance = () => {
    // window.location.href.includes('dheerajinternational')
    //   ? window.open(
    //       `https://formbuilder.ccavenue.com/live/dheeraj-international-school`,
    //       '_blank'
    //     )
    //   : window.open(
    //       `${ENVCONFIG?.apiGateway?.finance}/sso/finance/${token}#/auth/login`,
    //       '_blank'
    //     );
    if (payConfigData?.length > 0) {
      let modifiedUrl = checkToken(payConfigData[1]);
      console.log(modifiedUrl, 'mod');
      window.open(modifiedUrl, '_blank');
    }
  };
  const checkToken = (url) => {
    if (url.includes('#token')) {
      return url.replace(new RegExp('#token', 'g'), token);
    } else {
      return url;
    }
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

  const fetchPayConfig = () => {
    axios
      .get(`${endpoints.doodle.fetchDoodlePayConfig}`)
      .then((response) => {
        if (response.data.status_code === 200) {
          console.log(response.data, 'payconfig');
          setPayConfigData(response?.data?.result);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  useEffect(() => {
    fetchDoodle();
    fetchPayConfig();
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
              {ReactHtmlParser(
                doodleData?.description?.replace(/(?:\r\n|\r|\n)/g, '<br />')
              )}
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
                {payConfigData?.length > 0 ? (
                  <Tooltip title={payConfigData?.length > 0 && payConfigData[0]}>
                    <Button
                      type='primary'
                      className='btn-block th-br-4 th-14 text-truncate'
                      style={{
                        height: '30px',
                        fontWeight: 'bold',
                        minWidth: '100px',
                        maxWidth: '250px',
                        padding: '0px 10px',
                        boxShadow: '0px 0px 8px 2px rgba(81, 179, 255, 1)',
                      }}
                      onClick={handleFinance}
                    >
                      {payConfigData?.length > 0 && payConfigData[0]}
                    </Button>
                  </Tooltip>
                ) : (
                  ''
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Doodle;
