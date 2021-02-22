import React, { useState, useContext, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';

// import TinyMce from '../../../../../components/TinyMCE/tinyMce';
import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';
import '../../viewAssessment.css';

const FillUpsQuestion = (props) => {
  const {
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

  // const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};
  const { questionObj: currentQuestionObj } = props || {};
  const {
    id: qId,
    question_type: questionType,
    meta: { index: qIndex } = {},
    question_answer,
    user_response: { attemption_status: attemptionStatus } = {},
  } = currentQuestionObj || {};

  const [{ answer, options, question }] = question_answer;
  const [fillupAnswers, setFillupAnswers] = useState({});

  // useEffect(() => {
  //   console.log('fill up answers ===> ', fillupAnswers[0]);
  //   if (currentQuestionObj?.user_response?.answer) {
  //     attemptQuestion(qId, { attemptionStatus: true, answer: fillupAnswers });
  //   } else {
  //     attemptQuestion(qId, { attemptionStatus: false, answer: null });
  //   }

  //   console.log('fill up answers: ', currentQuestionObj?.user_response?.answer[1]);
  // }, [fillupAnswers]);

  const handleNextQuestion = () => {
    nextQues(qId);
  };
  const handleFillups = (event, index) => {
    setFillupAnswers({ ...fillupAnswers, [index]: event.target.value });
    attemptQuestion(qId, {
      attemption_status: true,
      answer: { ...fillupAnswers, [index]: event.target.value },
    });
  };
  return (
    <div>
      {/* <div className='question-header'>
        Fill up the blanks in the sentence correctly by typing the words in below option
      </div>
      <div className='question-numbers'>
        <div>{qIndex + 1}</div>
        <div>
          Progress - {qIndex + 1}/{questionsArray.length}
        </div>
      </div> */}
      <div className='mcq-question-wrapper'>
        <h3>{ReactHtmlParser(question)}</h3>

        {options.length &&
          options.map((option, index) => {
            return (
              <TextField
                id='outlined-basic'
                value={
                  currentQuestionObj?.user_response?.answer
                    ? currentQuestionObj?.user_response?.answer[index]
                    : ''
                }
                onChange={(e) => handleFillups(e, index)}
                label={`Option ${index + 1}`}
                variant='outlined'
              />
            );
          })}

        {/* <div className='question-submit-btn' onClick={handleNextQuestion}>
          Next
        </div> */}
      </div>
    </div>
  );
};

export default FillUpsQuestion;
