import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Result, notification } from 'antd';
import Layout from 'containers/Layout';

const AuthChecker = ({
  children,
  to = '/404',
  allowedUserLevels = [],
  restrictedUserLevels = [],
}) => {
  const history = useHistory();
  const userData = JSON.parse(localStorage.getItem('userDetails'));
  const is_superuser = userData?.is_superuser;
  const user_level = userData?.user_level;
  const authorized =
    ((allowedUserLevels?.length > 0 ? allowedUserLevels.includes(user_level) : true) &&
      (restrictedUserLevels?.length > 0
        ? !restrictedUserLevels.includes(user_level)
        : true)) ||
    is_superuser;

  useEffect(() => {
    if (!authorized) {
      notification.error({
        message: 'Unauthorized Access',
        description: 'You have no rights to access this page!',
      });
    }
  }, [authorized]);

  return authorized ? (
    <> {children}</>
  ) : (
    <Layout>
      <div className='px-3 pb-3'>
        <div className='th-br-10 th-bg-white'>
          <Result
            status='403'
            title='403'
            subTitle='Sorry, you are not authorized to access this page.'
            extra={
              <Button type='primary th-br-8' onClick={() => history.push('/')}>
                Back Home
              </Button>
            }
          />
        </div>
      </div>
    </Layout>
  );
};

export default AuthChecker;
