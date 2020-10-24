import React, { createContext, useReducer } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-cycle
import AlertNotification from '../../components/alert/alert-notification';
import alertReducer from './alert-reducer';
import { HIDE_ALERT, SHOW_ALERT } from './alert-types';

export const AlertNotificationContext = createContext();

const AlertNotificationProvider = (props) => {
  const { children } = props;
  const iniatialState = {
    isShown: false,
    type: 'success',
    message: '',
  };

  const [state, dispatch] = useReducer(alertReducer, iniatialState);

  const hide = () => {
    return {
      type: HIDE_ALERT,
    };
  };

  const show = (type, message) => {
    return {
      type: SHOW_ALERT,
      payload: { type, message },
    };
  };

  const hideAlert = () => {
    dispatch(hide());
  };

  const setAlert = (type, message, duration = 3000) => {
    dispatch(show(type, message));

    setTimeout(() => {
      dispatch(hide());
    }, duration);
  };

  return (
    <AlertNotificationContext.Provider value={{ setAlert, hideAlert, ...state }}>
      <AlertNotification />
      {children}
    </AlertNotificationContext.Provider>
  );
};

AlertNotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AlertNotificationProvider;
