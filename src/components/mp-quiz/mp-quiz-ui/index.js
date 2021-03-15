import React from 'react';
import { SocketProvider, useSocket, GlobalSocket } from '../mp-quiz-providers';
import MpQuiz from './mp-quiz';

function MpQuizHome() {
  return (
    <SocketProvider lobbyId={80}>
      <>
        <p>MpQuizHome</p>
        <MpQuiz />
      </>
    </SocketProvider>
  );
}
export default MpQuizHome;
/*
    Socket context undali.
    quiz events context - trigger and receive - save message data.
    questions context - fetch quesions - controls - attempt - track
*/
