import React, { useContext, useState, useEffect, useRef } from 'react';
import '../viewAssessment.css';
import { AssessmentHandlerContext } from '../../assess-attemption/assess-attemption-context';

const McqQuestion = () => {
  const {
    assessmentQp: { fetching },
    fetchAssessmentQp,

    questionsDataObj,
    questionsArray,
    controls: {
      selectQues,
      //   nextQues,
      //   prevQues,
      //   attemptQuestion,
      isStarted,
      currentQuesionId,
      start,
      //   startedAt,
    },
  } = useContext(AssessmentHandlerContext);

  const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};

  const {
    id: qId,
    question_type: questionType,
    meta: { index: qIndex } = {},
    question_answer,
    user_response: { attemption_status: attemptionStatus } = {},
  } = currentQuestionObj || {};

  const [{ answer, options, question }] = question_answer;

  const [optionSelected, setOptionSelected] = useState(null);
  const [optionAns, setAnswer] = useState(null);
  const inputEl = useRef(null);
  useEffect(() => {
    // console.log('effect questionsData array: ', options);
    // console.log('effect context: ', currentQuestionObj);
    // console.log('effect meta: ', qIndex);
  }, []);

  function removeTags(str) {
    if (str === null || str === '') return false;
    str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '');
  }

  const handleOptionValue = (optionIndex, optionValue) => {
    // console.log('select ques: ', selectQues(qId));

    setAnswer(optionValue);
    // selectQues(qId);

    console.log('option Selcted: ', inputEl.current);
  };

  return (
    <div>
      <div className='question-header'>
        Description specific to this test to be followed by all appearing students/pupils
        / attendees (Write if req. else leave empty)
      </div>
      <div className='question-numbers'>
        <div>{qIndex + 1}</div>
        <div>
          Progress - {qIndex + 1}/{questionsArray.length}
        </div>
      </div>
      <div className='mcq-question-wrapper'>
        <h3>{removeTags(question)}</h3>
        <img src='https://via.placeholder.com/150' alt='question image' />
        {options.map((option, index) => {
          // console.log(option[`option${(index + 1).toString()}`]);
          return (
            <div
              ref={inputEl}
              className='mcq-options'
              onClick={() =>
                handleOptionValue(
                  index,
                  option[`option${(index + 1).toString()}`].optionValue
                )
              }
            >
              {option[`option${(index + 1).toString()}`].optionValue}
            </div>
          );
        })}

        <div className='question-submit-btn'>Next</div>
      </div>
    </div>
  );
};

export default McqQuestion;
