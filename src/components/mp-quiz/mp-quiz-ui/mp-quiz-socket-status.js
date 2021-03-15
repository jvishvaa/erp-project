import React from 'react';
import { useSocket, GlobalSocket } from '../mp-quiz-providers';

function MpQuizSocketStatus() {
  const ws = useSocket() || {};
  const { OPEN = null, readyState } = ws || {};
  // const { connection } = ws || {};
  // const { OPEN = null, readyState } = { ...(connection || {}) };
  // if(connection){
  //   debugger
  // }
  // console.log(connection, 'connection');
  const statusObj = {
    [window.WebSocket.CLOSED]: 'Closed',
    [window.WebSocket.OPEN]: 'Open',
    [window.WebSocket.CONNECTING]: 'Connecting',
  };
  return (
    <div>
      MpQuizSocketStatus
      {/* {console.log('ws.connection', ws.connection)} */}
      <p>
        {`${readyState}`}
        {statusObj[readyState]}
      </p>
    </div>
  );
}
export default MpQuizSocketStatus;
/*
    Socket context undali.
    quiz events context - trigger and receive - save message data.
    questions context - fetch quesions - controls - attempt - track
*/
