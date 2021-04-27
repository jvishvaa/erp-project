/* eslint-disable import/no-mutable-exports */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Socket from './socket';

const SocketContext = React.createContext();
let GlobalSocket = null;

const SocketProvider = ({ children, socketUrl }) => {
  const [ws, setWs] = useState(null);
  const [readyState, setReadyState] = useState(null);

  useEffect(() => {
    let webSocket;
    if (socketUrl) {
      webSocket = new Socket(socketUrl);
      setWs(webSocket);
      GlobalSocket = webSocket;
      webSocket.bind('error', () => setReadyState(webSocket.connection.readyState));
      webSocket.bind('close', () => setReadyState(webSocket.connection.readyState));
      webSocket.bind('open', () => setReadyState(webSocket.connection.readyState));
    }
    return () => {
      if (webSocket && webSocket.connection.readyState === webSocket.connection.OPEN) {
        webSocket.close();
      }
    };
  }, [socketUrl]);

  return (
    <SocketContext.Provider value={{ ...ws, readyState }}>
      {children}
    </SocketContext.Provider>
  );
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
