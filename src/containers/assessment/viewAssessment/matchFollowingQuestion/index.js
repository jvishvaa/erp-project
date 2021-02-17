import React, { useContext, useState, useEffect, useRef } from 'react';
import '../viewAssessment.css';

import ReactHtmlParser from 'react-html-parser';
import { AssessmentHandlerContext } from '../../assess-attemption/assess-attemption-context';
import TinyMce from '../../../../components/TinyMCE/tinyMce';

const MatchFollowingQuestion = () => {
  const {
    assessmentQp: { fetching },
    fetchAssessmentQp,

    questionsDataObj,
    questionsArray,
    controls: {
      selectQues,
      nextQues,
      //   prevQues,
      attemptQuestion,
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

  const [{ answer, options, question, matchingOptions }] = question_answer;
  // const [isChecked, setIsChecked] = useState([]);
  useEffect(() => {
    console.log('is CHecked: ', currentQuestionObj);
    // if (currentQuestionObj?.user_response?.attemptionStatus) {
    //   console.log('selected answer: ', currentQuestionObj?.user_response);
    //   setOptionSelected(currentQuestionObj?.user_response?.answer);
    // }
  }, []);

  const handleNextQuestion = () => {
    nextQues(qId);
  };

  const handleTextEditor = (event) => {
    // console.log('from editor', e);
    // setTextEditorContent(event);
    attemptQuestion(qId, { attemptionStatus: true, answer: event });
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
        <h3>{ReactHtmlParser(question)}</h3>
        <div className='match-question-wrapper'>
          <div className='match-options'>
            {options.map((option, index) => {
              return (
                <div key={index + 1} className='match-image'>
                  <img src={option?.images[0]} alt='match follow' />
                </div>
              );
            })}
          </div>

          <div className='match-answers'>
            {matchingOptions.map((option, index) => {
              return (
                <div key={index + 1} className='match-image'>
                  <img src={option?.images[0]} alt='matching follow' />
                </div>
              );
            })}
          </div>
        </div>
        <div className='question-submit-btn' onClick={handleNextQuestion}>
          Next
        </div>
      </div>
    </div>
  );
};

export default MatchFollowingQuestion;
