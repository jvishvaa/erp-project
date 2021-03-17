import React from 'react';
import QuestionHandlerProvderWrap from './mp-quiz-ques-handler-providers-wrap';
import QuestionHandler from './mp-quiz-ques-handler';

function QuestionHandlerHome() {
  return (
    <QuestionHandlerProvderWrap>
      <QuestionHandler />
    </QuestionHandlerProvderWrap>
  );
}
export default QuestionHandlerHome;
