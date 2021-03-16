import React from 'react';
import { QuizContextProvider } from './mp-quiz-event-contexts';
import { SocketProvider } from './socket-providers';

function QuizContextHome({ children, socketUrl }) {
  return (
    <SocketProvider socketUrl={socketUrl}>
      <QuizContextProvider>{children}</QuizContextProvider>
    </SocketProvider>
  );
}

export default QuizContextHome;
