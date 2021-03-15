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

  const socketUrl = 'wss://javascript.info/article/websocket/demo/hello';

  useEffect(() => {
    let webSocket;
    if (lobbyId) {
      webSocket = new Socket(socketUrl);
      setWs(webSocket);
      GlobalSocket = webSocket;
      webSocket.bind('error', () => setWs(webSocket));
      webSocket.bind('close', () => setWs(webSocket));
      webSocket.bind('open', () => setWs(webSocket));
      webSocket.bind('fetch_participants', (a, b, c, d) => {});
    }
    return () => {
      if (webSocket && webSocket.connection.readyState === webSocket.connection.OPEN) {
        webSocket.close();
      }
    };
  }, [lobbyId]);

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
