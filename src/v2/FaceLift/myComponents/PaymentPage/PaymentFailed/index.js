import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import Layout from 'containers/Layout';

const PaymentSuccess = () => {
  const history = useHistory();
  return (
    <Layout>
      <div className='px-3'>
        <div className='card py-5 w-100' style={{ height: '75vh' }}>
          <div className='card-body '>
            <Result
              status='warning'
              title='Payment Failed!'
              subTitle={
                <div className='d-flex justify-content-center th-grey th-fw-500'>
                  We are sorry, but your transcation could not be completed. Please try
                  after sometime
                </div>
              }
              extra={[
                <Button
                  type=''
                  key='console'
                  className='th-br-6'
                  onClick={() => {
                    history.replace('/attendance-calendar/student-view');
                  }}
                >
                  Go Back
                </Button>,
              ]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
