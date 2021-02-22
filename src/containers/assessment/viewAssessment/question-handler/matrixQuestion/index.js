import React, { useContext } from 'react';
import ReactHtmlParser from 'react-html-parser';

import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';
import '../../viewAssessment.css';

const MatrixQuestion = (props) => {
  const {
    controls: { attemptQuestion },
  } = useContext(AssessmentHandlerContext);

  const { questionObj: currentQuestionObj } = props || {};

  const {
    id: qId,
    // meta: { index: qIndex } = {},
    question_answer: questionAnswer,
    user_response: { answer: existingAnswerObj = {} } = {},
  } = currentQuestionObj || {};

  const [{ options = [], question, matrixOptions }] = questionAnswer || {};

  const handleOptionValue = (event) => {
    const { target: { value, name } = {} } = event || {};
    /* 
      {
        value: "low",
        name: "2_bike"
      }
    */
    const [index, questionLabel] = name.split('_');
    const answerObj = {
      [`question${index}`]: questionLabel,
      [`answer${index}`]: value,
    };
    const noOfOptions = Array.isArray(options) ? options.length : null;

    const updatedAnswerObj = { ...existingAnswerObj, ...answerObj };
    attemptQuestion(qId, {
      attemption_status: noOfOptions * 2 === Object.keys(updatedAnswerObj).length,
      answer: updatedAnswerObj,
    });
  };

  //   const handleTextEditor = (event) => {
  //     attemptQuestion(qId, { attemption_status: true, answer: event });
  //   };
  return (
    <div>
      <div className='mcq-question-wrapper'>
        <h3>{ReactHtmlParser(question)}</h3>
        <div className='matrix-table-container'>
          <form onChange={handleOptionValue}>
            <table className='matrix-table'>
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  {matrixOptions.map((matrix) => {
                    return <th>{matrix.optionValue}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {options.map((option, optionIndex) => {
                  return (
                    <tr>
                      <td>{option.optionValue}</td>
                      {matrixOptions.map((matrix, matrixIndex) => {
                        const questionIndex = optionIndex + 1;
                        const name = `${questionIndex}_${option.optionValue}`;
                        const value = matrix.optionValue;
                        const { [`answer${questionIndex}`]: existingAns } =
                          existingAnswerObj || {};
                        return (
                          <td>
                            {/* {matrix.optionValue} */}
                            <input
                              type='radio'
                              // name={`question-${index + 1}`}
                              // value={`option-${matrixIndex + 1}`}
                              checked={existingAns === value}
                              name={name}
                              value={value}
                            />
                          </td>
                        );
                      })}
                      {/* </RadioGroup> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MatrixQuestion;
