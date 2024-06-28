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
              status='success'
              title='Payment Successful!'
              subTitle={
                <div className='d-flex flex-column th-grey th-fw-500' style={{ gap: 5 }}>
                  <div>Thank You !</div>
                  <div>Your transcation has been successfully processed</div>
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
