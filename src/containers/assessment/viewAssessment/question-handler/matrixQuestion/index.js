import React, { useContext, useState, useEffect, useRef } from 'react';
import '../../viewAssessment.css';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ReactHtmlParser from 'react-html-parser';
import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';
import TinyMce from '../../../../../components/TinyMCE/tinyMce';

const MatrixQuestion = () => {
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
    attemptQuestion(qId, { attemptionStatus: true, answer: event.target.value });
    // console.log('selected value : ', attemptQuestion);
  };

  const handleTextEditor = (event) => {
    // console.log('from editor', e);
    // setTextEditorContent(event);
    attemptQuestion(qId, { attemptionStatus: true, answer: event });
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
          {/* <div className='matrix-main-option'>
            {options.map((option, index) => {
              return (
                <div key={index + 1} className='match-image'>
                  <p>{option.optionValue}</p>
                </div>
              );
            })}
          </div> */}

          <div>
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
                        matrixOptions.map((matrix) => {
                          return (
                            <FormControlLabel
                              className='matrix-options'
                              value='Option1'
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
          </div>
        </div>
        {/* <div className='question-submit-btn' onClick={handleNextQuestion}>
          Next
        </div> */}
      </div>
    </div>
  );
};

export default MatrixQuestion;
