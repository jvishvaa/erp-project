import React, { useContext } from 'react';
import Alert from '@material-ui/lab/Alert';
// eslint-disable-next-line import/no-cycle
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './alert-notification.scss';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  menuItemIcon: {
    '& .MuiSvgIcon-root': {
      color: '#fff',
    },
  },
}));

const AlertNotification = () => {
  const classes = useStyles();
  const { message, type, isShown } = useContext(AlertNotificationContext);
  return (
    <>
      {isShown && (
        <Alert variant='filled' severity={type} className={clsx(classes.menuItemIcon, 'alert__container')}>
          {message}
        </Alert>
      )}
    </>
  );
};

export default AlertNotification;
