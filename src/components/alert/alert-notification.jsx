import React, { useContext } from 'react';
import Alert from '@material-ui/lab/Alert';
// eslint-disable-next-line import/no-cycle
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './alert-notification.scss';
import clsx from 'clsx';
import { makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  menuItemIcon: {
    '& .MuiSvgIcon-root': {
      color: '#fff',
    },
  },
  alertBox: {
    '& .MuiAlert-root': {
      height: 'auto',
      maxHeight: '100%',
      overflowY: 'scroll',
      '& .MuiAlert-action': {
        alignItems: 'flex-start',
      },
    },
  },
}));

const AlertNotification = () => {
  const classes = useStyles();
  const { message, type, isShown, hideAlert, showCloseIcon } = useContext(
    AlertNotificationContext
  );
  return (
    <>
      {isShown && (
        <Box className={classes.alertBox}>
          <Alert
            {...(showCloseIcon && { onClose: () => hideAlert() })}
            variant='filled'
            severity={type}
            className={clsx(classes.menuItemIcon, 'alert__container')}
          >
            {message}
          </Alert>
        </Box>
      )}
    </>
  );
};

export default AlertNotification;
