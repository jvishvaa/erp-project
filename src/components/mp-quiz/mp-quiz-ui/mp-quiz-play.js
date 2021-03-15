import React from 'react';
import { useSocket, GlobalSocket } from '../mp-quiz-providers';

function MpQuizPlay() {
  const socket = useSocket();
  React.useEffect(() => {
    // debugger;
    if (socket) {
      // debugger;
      socket.bind('fetch_participants', (a, b, c, d) => {
        console.log(a, b, c, d);
      });
    }
  }, [socket]);
  return <p>Quiz Lobby</p>;
}
export default MpQuizPlay;
/*
    Socket context undali.
    quiz events context - trigger and receive - save message data.
    questions context - fetch quesions - controls - attempt - track
*/
