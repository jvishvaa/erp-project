import React, { useContext } from 'react';
import Alert from '@material-ui/lab/Alert';
// eslint-disable-next-line import/no-cycle
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './alert-notification.scss';

const AlertNotification = () => {
  const { message, type, isShown } = useContext(AlertNotificationContext);
  return (
    <>
      {isShown && (
        <Alert variant='filled' severity={type} className='alert__container'>
          {message}
        </Alert>
      )}
    </>
  );
};

export default AlertNotification;
