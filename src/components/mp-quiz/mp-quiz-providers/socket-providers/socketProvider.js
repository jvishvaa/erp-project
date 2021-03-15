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
  const [readyState, setReadyState] = useState(null);

  const {
    lobbyId: lobbyIdFProps,
    role: roleFProps,
    userAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozNjcxLCJ1c2VybmFtZSI6IjIwMDEyMzAwMDUiLCJleHAiOjY2MTU1Mjg1MzIsImVtYWlsIjoia3V2aWthc2gxMjNAZ21haWwuY29tIn0.yw3hZZ5GwrnDRrjGdLhmFm5v2QlA8HQ0yAHc7NQw8Jo',
  } = restProps || {};
  const [lobbyId] = useState(lobbyIdFProps);
  const socketUrl = (urls.socketBase + urls.socketEndPoint)
    .replace('<online_class_id>', lobbyId)
    .replace('<user_auth_token>', userAuthToken);

  // const socketUrl = 'ws://javascript.info';
  // const socketUrl = 'wss://javascript.info/article/websocket/demo/hello';
  // const [role] = useState(roleFProps);

  // useEffect(() => {
  // debugger;
  // if (ws && ws.connection) {
  // setReadyState(ws.connection.readyState);
  // }
  // }, [ws]);

  useEffect(() => {
    let webSocket;
    if (lobbyId) {
      webSocket = new Socket(socketUrl);
      setWs(webSocket);
      GlobalSocket = webSocket;
      webSocket.bind('error', () => {
        // debugger;
        setWs(webSocket);
        setReadyState(webSocket.connection.readyState);
      });
      webSocket.bind('close', () => {
        setWs(webSocket);
        setReadyState(webSocket.connection.readyState);
      });
      webSocket.bind('open', () => {
        setWs(webSocket);
        setReadyState(webSocket.connection.readyState);
      });
    }
    return () => {
      if (webSocket && webSocket.connection.readyState === webSocket.connection.OPEN) {
        webSocket.close();
      }
    };
  }, [lobbyId]);
  console.log(readyState, ws?.connection.readyState, 'readyState');

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
