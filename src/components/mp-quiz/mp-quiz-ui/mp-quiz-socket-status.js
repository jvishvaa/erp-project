import React from 'react';
import { useSocket } from '../mp-quiz-providers';

function MpQuizSocketStatus() {
  const ws = useSocket() || {};
  const { readyState } = ws || {};
  const statusObj = {
    [window.WebSocket.CLOSED]: 'Closed',
    [window.WebSocket.OPEN]: 'Open',
    [window.WebSocket.CONNECTING]: 'Connecting',
  };
  return (
    <div>
      <p>{`MpQuizSocketStatus - ${statusObj[readyState || 0]} - (${readyState})`}</p>
    </div>
  );
}
export default MpQuizSocketStatus;
