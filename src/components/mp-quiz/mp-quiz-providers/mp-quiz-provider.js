import React from 'react';
import { QuizContextProvider } from './mp-quiz-event-contexts';
import { SocketProvider } from './socket-providers';
import { QuizUtilityContextProvider } from './mp-quiz-utility-contexts';

function QuizContextHome({ children, socketUrl }) {
  return (
    <SocketProvider socketUrl={socketUrl}>
      <QuizContextProvider>
        <QuizUtilityContextProvider>{children}</QuizUtilityContextProvider>
      </QuizContextProvider>
    </SocketProvider>
  );
}

export default QuizContextHome;
