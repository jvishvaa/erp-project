import React, { useContext, useState, useEffect, useRef } from 'react';
import '../../assess-attemption.css';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ReactHtmlParser from 'react-html-parser';
import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';
import TinyMce from '../../../../../components/TinyMCE/tinyMce';

const MatrixQuestion = (props) => {
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

  // const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};
  const { questionObj: currentQuestionObj } = props || {};

  const {
    id: qId,
    question_type: questionType,
    meta: { index: qIndex } = {},
    question_answer,
    user_response: { attemption_status: attemptionStatus } = {},
  } = currentQuestionObj || {};

  const [{ answer, options, question, matrixOptions }] = question_answer;
  // const [isChecked, setIsChecked] = useState([]);
  useEffect(() => {
    console.log('is CHecked: ', currentQuestionObj);
  }, []);

  const handleNextQuestion = () => {
    nextQues(qId);
  };

  const handleOptionValue = (event) => {
    // setIsChecked([{ [qId]: event.target.value }]);
    // setOptionSelected(event.target.value);
    attemptQuestion(qId, { attemption_status: true, answer: event.target.value });
    // console.log('selected value : ', attemptQuestion);
  };

  const handleTextEditor = (event) => {
    // console.log('from editor', e);
    // setTextEditorContent(event);
    attemptQuestion(qId, { attemption_status: true, answer: event });
  };
  return (
    <div>
      {/* <div className='question-header'>
        Description specific to this test to be followed by all appearing students/pupils
        / attendees (Write if req. else leave empty)
      </div>
      <div className='question-numbers'>
        <div>{qIndex + 1}</div>
        <div>
          Progress - {qIndex + 1}/{questionsArray.length}
        </div>
      </div> */}
      <div className='mcq-question-wrapper'>
        <h3>{ReactHtmlParser(question)}</h3>
        <div className='match-question-wrapper'>
          {/* <div>
            {options.map((option, index) => {
              return (
                <div>
                  <FormControl
                    component='fieldset'
                    style={{ flexDirection: 'row', marginTop: 25 }}
                  >
                    <FormLabel
                      style={{ marginBottom: 15, color: '#014b7e' }}
                      component='legend'
                    >
                      {option.optionValue}
                    </FormLabel>
                    <RadioGroup
                      aria-label='gender'
                      name='options'
                      //   value={currentQuestionObj?.user_response?.answer}
                      onChange={handleOptionValue}
                      style={{ flexDirection: 'row' }}
                    >
                      {matrixOptions.length &&
                        matrixOptions.map((matrix, index) => {
                          return (
                            <FormControlLabel
                              className='matrix-options'
                              // value='Option1'
                              value={`option${index + 1}`}
                              control={<Radio />}
                              label={matrix.optionValue}
                              labelPlacement='top'
                            />
                          );
                        })}
                    </RadioGroup>
                  </FormControl>
                </div>
              );
            })}
          </div> */}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div className='matrix-options' />
          {matrixOptions.map((matrix, index) => {
            return <div className='matrix-options'>{matrix.optionValue}</div>;
          })}
        </div>

        {options.map((option, index) => {
          return (
            <RadioGroup
              aria-label='matrix-options'
              name={option.optionValue}
              //   value={currentQuestionObj?.user_response?.answer}
              onChange={handleOptionValue}
              style={{ flexDirection: 'row' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <p className='matrix-options'>{option.optionValue}</p>
                {/* <FormControl component='fieldset'> */}
                {matrixOptions.map((matrix, index) => {
                  return (
                    <>
                      <p className='matrix-options'>
                        {/* {matrix.optionValue} */}
                        <Radio value={`option${index + 1}`} />
                      </p>
                    </>
                  );
                })}
                {/* </FormControl> */}
              </div>
            </RadioGroup>
          );
        })}
        {/* <form> */}
        <table>
          <thead>
            <tr>
              <th>&nbsp;</th>
              {matrixOptions.map((matrix, index) => {
                return <th>{matrix.optionValue.slice(0, 1)}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {options.map((option, index) => {
              return (
                <tr>
                  <td>{option.optionValue}</td>
                  {/* <RadioGroup style={{ flexDirection: 'row' }}> */}
                  {matrixOptions.map((matrix, index) => {
                    return (
                      <td>
                        {/* {matrix.optionValue} */}
                        <input
                          type='radio'
                          name={option.optionValue}
                          value={`option${index + 1}`}
                        />
                        {/* <Radio name={option.optionValue} value={`option${index + 1}`} /> */}
                      </td>
                    );
                  })}
                  {/* </RadioGroup> */}
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* </form> */}
      </div>
    </div>
  );
};

export default MatrixQuestion;
