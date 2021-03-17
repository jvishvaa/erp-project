import React from 'react';
import { useSocket } from '../mp-quiz-providers';
import InternalPageStatus from './mp-quiz-components/internal-page-status';

function MpQuizSocketStatus() {
  const ws = useSocket() || {};
  const { readyState } = ws || {};
  const statusObj = {
    [window.WebSocket.CLOSED]: 'closed',
    [window.WebSocket.OPEN]: 'open',
    [window.WebSocket.CONNECTING]: 'connecting',
  };
  return (
    <InternalPageStatus
      label={`Connecting to server.   (stat:${readyState}-${statusObj[readyState || 0]})`}
    />
  );
}
export default MpQuizSocketStatus;
