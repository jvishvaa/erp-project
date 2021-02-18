/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';

import { AssessmentHandlerContext } from '../../assess-attemption/assess-attemption-context';
import McqQuestion from './mcqQuestion';
import DescriptiveQuestion from './descriptiveQuestion';
import FillUpsQuestion from './fillUpsQuestion';
import TrueFalseQuestion from './trueFalseQuestion';
import VideoQuestion from './videoQuestion';
import MatchFollowingQuestion from './matchFollowingQuestion';
import MatrixQuestion from './matrixQuestion';
import QuestionHeader from './question-header';
import QuestionBody from './question-body';

const decideQuestion = {
  1: () => <McqQuestion />,
  3: () => <MatchFollowingQuestion />,
  4: () => <VideoQuestion />,
  6: () => <MatrixQuestion />,
  8: () => <TrueFalseQuestion />,
  9: () => <FillUpsQuestion />,
  10: () => <DescriptiveQuestion />,
  undefined: () => <p>question_type undefined</p>,
  null: () => <p>question_type null</p>,
};
const QuestionHandler = () => {
  const {
    // assessmentQp: { fetching },
    // fetchAssessmentQp,

    questionsDataObj,
    questionsArray,
    controls: {
      //   selectQues,
      nextQues,
      //   prevQues,
      //   attemptQuestion,
      //   isStarted,
      currentQuesionId,
      //   start,
      //   startedAt,
    },
  } = useContext(AssessmentHandlerContext);

  const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};
  const { meta: { index: qIndex } = {} } = currentQuestionObj || {};

  return (
    <>
      <QuestionHeader qIndex={qIndex} questionsArray={questionsArray} />
      <QuestionBody questionObj={currentQuestionObj} />
      <div
        key='question-submit-btn'
        className='question-submit-btn'
        onClick={() => nextQues()}
      >
        Next
      </div>
    </>
  );
};
export default QuestionHandler;
