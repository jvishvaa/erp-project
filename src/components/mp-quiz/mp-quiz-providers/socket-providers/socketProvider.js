/* eslint-disable import/no-mutable-exports */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import constants from '../mp-quiz-constants';
import Socket from './socket';

const SocketContext = React.createContext();
let GlobalSocket = null;

const { urls } = constants;
const SocketProvider = ({ children, ...restProps }) => {
  const [ws, setWs] = useState(null);

  const { lobbyId: lobbyIdFProps, role: roleFProps } = restProps || {};
  const [lobbyId] = useState(lobbyIdFProps);
  const [role] = useState(roleFProps);

  useEffect(() => {
    let webSocket;
    if (lobbyId && role) {
      webSocket = new Socket(`${urls.socketBase}${lobbyId}/`);
      setWs(webSocket);
      GlobalSocket = webSocket;
      webSocket.bind('open', () => {
        const initialData = {
          stepNo: 1,
          stepId: 1,
          params: 'opening_screen',
          role,
        };
        webSocket.trigger('initiation', JSON.stringify(initialData));
      });
    }
    return () => {
      if (webSocket && webSocket.connection.readyState === webSocket.connection.OPEN) {
        webSocket.close();
      }
    };
  }, [lobbyId, role]);

  return <SocketContext.Provider value={ws}>{children}</SocketContext.Provider>;
};

SocketProvider.propTypes = {
  children: PropTypes.node,
};

SocketProvider.defaultProps = {
  children: '',
};

function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useContext must be used within a SocketProvider');
  }
  return context;
}

export { SocketProvider, useSocket, GlobalSocket };
