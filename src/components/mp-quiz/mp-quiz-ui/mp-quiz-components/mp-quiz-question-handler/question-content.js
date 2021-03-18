import React from 'react';
import { useQuizQuesContext, useQuizUitilityContext } from '../../../mp-quiz-providers';
import { McqQuestion } from './mp-quiz-question-type-handlers';
import { InternalPageStatus } from '../../../mp-quiz-utils';

export default function QuestionContent() {
  const {
    // timeToRenderControls: { onAttemptionCurrentQuesAttemption },
    questionsDataObj,
    responsesDataObj,
    currentQuesionId,
    quizQp: { isFetching, message, fetchFailed },
    controls: { attemptQuestion, setStartTime },
  } = useQuizQuesContext() || {};
  const { getBgmAudioTag } = useQuizUitilityContext();
  const { [currentQuesionId]: questionsObj = {} } = questionsDataObj || {};
  const { [currentQuesionId]: responsesObj = {} } = responsesDataObj || {};
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
        questionObj={questionsObj || {}}
        responseObj={responsesObj || {}}
        attemptQuestion={attemptQuestion}
        setStartTime={setStartTime}
        getBgmAudioTag={getBgmAudioTag}
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
