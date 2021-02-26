/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import { AssessmentHandlerContext } from '../../assess-attemption/assess-attemption-context';
import QuestionHeader from './question-header';
import QuestionBody from './question-body';

const QuestionHandler = () => {
  const {
    questionsDataObj,
    questionsArray,
    controls: { nextQues, currentQuesionId },
  } = useContext(AssessmentHandlerContext);

  const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};
  const { meta: { index: qIndex } = {} } = currentQuestionObj || {};
  const propsObj = {
    questionsDataObj,
    qIndex,
    questionsArray,
    questionObj: currentQuestionObj,
  };
  return (
    <>
      <QuestionHeader {...propsObj} />
      <QuestionBody {...propsObj} />
      <div style={{ display: 'flex', margin: 5 }}>
        <div
          key='question-submit-btn'
          className='question-submit-btn'
          style={{ margin: 'auto' }}
          onClick={() => nextQues()}
        >
          Next
        </div>
      </div>
    </>
  );
};
export default QuestionHandler;
