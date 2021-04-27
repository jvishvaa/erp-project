/* eslint-disable no-nested-ternary */
import React from 'react';
import { Grid } from '@material-ui/core';

export default function OptionsHandler(props) {
  const {
    questionObj: currentQuestionObj,
    responseObj,
    attemptQuestion,
    getBgmAudioTag = () => {},
    // onAttemptionCurrentQuesAttemption,
  } = props || {};
  const {
    answer: attemptedAnswerArray,
    attemption_status: isAttempted,
    correct: isCorrect,
  } = responseObj || {};
  const { id: questionId, question_answer: questionAnswer } = currentQuestionObj || {};

  const [attemptedOption] = attemptedAnswerArray || [];

  const [
    { answer: answerArray = 'answer not found', options = [], question },
  ] = questionAnswer || [{}];
  const optionsArray = options.map((item) => {
    const [optionContentObj] = Object.values(item || {});
    const [optionLabel] = Object.keys(item || {});
    return { ...optionContentObj, label: optionLabel, identifier: optionLabel };
  });
  const [correctOption] = answerArray || [];
  //   function evaluate() {
  //     return true;
  //   }
  function handleOptionValue(optionIdentifier) {
    if (!isAttempted) {
      // const wasAttemptedCorrectly = evaluate();
      attemptQuestion(questionId, {
        id: questionId,
        attemption_status: true,
        answer: [optionIdentifier],
        correct: optionIdentifier === correctOption,
      });
      // onAttemptionCurrentQuesAttemption();
    }
  }
  const correctAnsStyles = {
    backgroundColor: 'rgb(98,195,112)',
    border: '3px solid rgb(98,195,112)',
  };

  const wrongAnsStyles = { backgroundColor: 'rgb(231,69,70)', border: 'rgb(231,69,70)' };
  return (
    <Grid container className='options-grid'>
      {isAttempted
        ? isCorrect
          ? getBgmAudioTag('right')
          : getBgmAudioTag('wrong')
        : null}
      {optionsArray.map((option, index) => {
        return (
          <Grid
            item
            xs={12}
            sm={3}
            md={3}
            lg={3}
            className={`option option-${index + 1}`}
            onClick={() => {
              handleOptionValue(option.identifier);
            }}
          >
            <div
              className='option-inner'
              style={{
                ...(isAttempted
                  ? correctOption === option.identifier
                    ? correctAnsStyles
                    : attemptedOption === option.identifier
                    ? wrongAnsStyles
                    : { display: 'none' }
                  : {}),
                ...(attemptedOption === option.identifier
                  ? { border: '3px solid white' }
                  : {}),
              }}
            >
              <div className='resizeable-text'>
                <div className='resizeable'>{option.optionValue}</div>
              </div>
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
}

//   const x = {
//     answer: ['option2'],
//     options: [
//       {
//         option1: {
//           images: [],
//           isChecked: false,
//           optionValue: 'By visiting the shop every day, herself.',
//         },
//       },
//       {
//         option2: {
//           images: [],
//           isChecked: true,
//           optionValue: 'By asking Sadako to take care of the shop.',
//         },
//       },
//       {
//         option3: {
//           images: [],
//           isChecked: false,
//           optionValue: 'With the help she got from her relatives ',
//         },
//       },
//       {
//         option4: {
//           images: [],
//           isChecked: false,
//           optionValue: 'By shifting the shop to the places she relocated to',
//         },
//       },
//     ],
//   };
