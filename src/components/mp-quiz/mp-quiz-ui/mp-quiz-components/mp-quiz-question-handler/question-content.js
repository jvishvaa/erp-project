import React from 'react';
import { useQuizQuesContext } from '../../../mp-quiz-providers';
import { McqQuestion } from './mp-quiz-question-type-handlers';

export default function QuestionContent() {
  const {
    timeToRenderControls: { onAttemptionCurrentQuesAttemption },
    questionsDataObj,
    responsesDataObj,
    currentQuesionId,
    controls: { attemptQuestion },
  } = useQuizQuesContext() || {};
  const questionsObj = (questionsDataObj && questionsDataObj[currentQuesionId]) || {};
  const responsesObj = (responsesDataObj && responsesDataObj[currentQuesionId]) || {};
  if (!questionsObj) {
    return <p>Question obj not found</p>;
  }
  const { question_type: questionType } = questionsObj || {};
  if (questionType === 1) {
    return (
      <McqQuestion
        questionsObj={questionsObj}
        responsesObj={responsesObj}
        attemptQuestion={attemptQuestion}
        onAttemptionCurrentQuesAttemption={onAttemptionCurrentQuesAttemption}
      />
    );
  }
  return (
    <p>
      Cannot handler other than Mcq single choice questions are handled
      {questionType}
    </p>
  );
}
