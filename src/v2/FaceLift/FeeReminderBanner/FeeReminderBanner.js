import React from 'react';
import { Button } from 'antd';
import ENVCONFIG from 'config/config';
import reminder from './../../../assets/images/reminder.jpg';

const FeeReminderBanner = ({ data }) => {
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const handlePay = () => {
    window.open(`${ENVCONFIG?.apiGateway?.finance}/sso/${token}#/auth/login`, '_blank');
  };

  return (
    <>
      <div className='row px-3 mb-2'>
        <div className='col-md-4 th-bg-grey shadow-sm d-none d-md-block'>
          <div className='row pt-3  th-18 th-fw-600 text-danger'>Fee reminder</div>
          <div
            className='row py-3 th-black-2 pr-2 mt-1 text-wrap text-justify'
            style={{ overflowY: 'scroll' }}
          >
            This is to remind you that you have a pending fee of below mentioned amount{' '}
            <br />
            <span className='mt-3'>Total Due : ₹ {data[0].total_due}</span>
            <div
              class='w-100 d-flex justify-content-between'
              style={{ marginTop: '110px' }}
            >
              Due Date : {data[0].due_date}
              <Button onClick={() => handlePay()} className='bg-primary text-white'>
                Pay
              </Button>
            </div>
          </div>
        </div>
        <div className='col-md-8 shadow-sm px-0 '>
          <img
            src={reminder}
            className='th-br-6'
            style={{
              height: '300px',
              width: '100%',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default FeeReminderBanner;
