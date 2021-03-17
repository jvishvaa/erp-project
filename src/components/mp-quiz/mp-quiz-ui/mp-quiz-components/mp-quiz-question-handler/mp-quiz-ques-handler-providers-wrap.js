import React from 'react';
import { QuizQuesContextProvider } from '../../../mp-quiz-providers';

function QuestionHandlerProvderWrap({ children, ...restProps }) {
  return <QuizQuesContextProvider>{children}</QuizQuesContextProvider>;
}
export default QuestionHandlerProvderWrap;
