import React from 'react';
import { useSocket } from '../../mp-quiz-providers';
import { InternalPageStatus } from '../../mp-quiz-utils';

function MpQuizSocketStatus() {
  const ws = useSocket() || {};
  const { readyState } = ws || {};
  const statusObj = {
    [window.WebSocket.CLOSED]: 'closed',
    [window.WebSocket.OPEN]: 'open',
    [window.WebSocket.CONNECTING]: 'connecting',
  };

  return (
    statusObj[readyState] === 'open' ? null :
      <InternalPageStatus
        label={`Connecting to server.   (stat:${readyState}-${statusObj[readyState || 0]})`}
      />
  );
}
export default MpQuizSocketStatus;
