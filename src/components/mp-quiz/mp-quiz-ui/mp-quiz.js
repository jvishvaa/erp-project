import React from 'react';
import { SocketProvider, useSocket, GlobalSocket } from '../mp-quiz-providers';

function MpQuiz() {
  const ws = useSocket();
  React.useEffect(() => {
    ws.bind('open', (a, b, c, d) => {
      console.log(a, b, c, d);
    });
  }, []);
  return <SocketProvider>.</SocketProvider>;
}
export default MpQuiz;
/*
    Socket context undali.
    quiz events context - trigger and receive - save message data.
    questions context - fetch quesions - controls - attempt - track
*/
