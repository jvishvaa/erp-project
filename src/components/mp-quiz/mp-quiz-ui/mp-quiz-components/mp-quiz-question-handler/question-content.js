import React from 'react';
import { useQuizQuesContext } from '../../../mp-quiz-providers';
import { McqQuestion } from './mp-quiz-question-type-handlers';
import InternalPageStatus from '../internal-page-status';

export default function QuestionContent() {
  const {
    // timeToRenderControls: { onAttemptionCurrentQuesAttemption },
    questionsDataObj,
    responsesDataObj,
    currentQuesionId,
    quizQp: { isFetching, message, fetchFailed },
    controls: { attemptQuestion, setStartTime },
  } = useQuizQuesContext() || {};
  const questionsObj = (questionsDataObj && questionsDataObj[currentQuesionId]) || {};
  const responsesObj = (responsesDataObj && responsesDataObj[currentQuesionId]) || {};
  if (isFetching) {
    return <InternalPageStatus loader label='Loading questions....' />;
  }

  if (!isFetching && fetchFailed) {
    return <InternalPageStatus label={`${message}`} />;
  }
  if (!questionsObj) {
    return <InternalPageStatus loader label='Question obj not found' />;
  }
  const { question_type: questionType } = questionsObj || {};
  if (questionType === 1) {
    return (
      <McqQuestion
        questionObj={questionsObj}
        responseObj={responsesObj}
        attemptQuestion={attemptQuestion}
        setStartTime={setStartTime}
        // onAttemptionCurrentQuesAttemption={onAttemptionCurrentQuesAttemption}
      />
    );
  }
  return (
    <InternalPageStatus
      label={` Cannot handler other than Mcq single choice questions are handled - ${questionType}`}
    />
  );
}
