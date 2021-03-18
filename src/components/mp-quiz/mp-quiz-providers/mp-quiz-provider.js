import React from 'react';
import { QuizContextProvider, QuizEventTriggersProvider } from './mp-quiz-event-contexts';
import { SocketProvider } from './socket-providers';
import { QuizUtilityContextProvider } from './mp-quiz-utility-contexts';
import { QuizQuesContextProvider } from './mp-quiz-ques-contexts';

function QuizContextHome({ children, socketUrl }) {
  return (
    <SocketProvider socketUrl={socketUrl}>
      <QuizContextProvider>
        <QuizUtilityContextProvider>
          <QuizEventTriggersProvider>
            <QuizQuesContextProvider>{children}</QuizQuesContextProvider>
          </QuizEventTriggersProvider>
        </QuizUtilityContextProvider>
      </QuizContextProvider>
    </SocketProvider>
  );
}

export default QuizContextHome;
