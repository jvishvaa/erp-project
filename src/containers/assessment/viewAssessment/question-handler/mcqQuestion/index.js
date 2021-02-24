import React, { useContext } from 'react';
import Radio from '@material-ui/core/Radio';
import ReactHtmlParser from 'react-html-parser';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';

import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';
import '../../viewAssessment.css';

const McqQuestion = (props) => {
  const {
    controls: { attemptQuestion },
  } = useContext(AssessmentHandlerContext);

  const { questionObj: currentQuestionObj } = props || {};

  const {
    id: qId,
    question_answer: questionAnswer,
    user_response: { answer: existingAnswerArray } = {},
  } = currentQuestionObj || {};

  const [existingAnswer] = existingAnswerArray || [];

  const [{ options, question }] = questionAnswer || [];

  const handleOptionValue = (event) => {
    attemptQuestion(qId, { attemption_status: true, answer: [event.target.value] });
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
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
          {ReactHtmlParser(question)}
        </div>
        {/* <img src='https://via.placeholder.com/150' alt='question image' /> */}
        {/* {options.map((option, index) => {
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
        })} */}
        <FormControl
          component='fieldset'
          // style={{ width: '80%' }}
          onChange={handleOptionValue}
        >
          {/* <FormLabel component='legend'>Options</FormLabel> */}
          <RadioGroup
            aria-label='gender'
            name='options'
            // value={currentQuestionObj?.user_response?.answer}
            value={existingAnswer}
            onChange={handleOptionValue}
          >
            <FormControlLabel
              className='mcq-options'
              value='option1'
              control={<Radio checked={existingAnswer === 'option1'} />}
              label={options[0].option1.optionValue}
            />
            <FormControlLabel
              className='mcq-options'
              value='option2'
              control={<Radio checked={existingAnswer === 'option2'} />}
              label={options[1].option2.optionValue}
            />
            {options[2]?.option3?.optionValue ? (
              <FormControlLabel
                className='mcq-options'
                value='option3'
                // control={<Radio />}
                control={<Radio checked={existingAnswer === 'option3'} />}
                label={options[2].option3.optionValue}
              />
            ) : null}

            {options[3]?.option4?.optionValue ? (
              <FormControlLabel
                className='mcq-options'
                value='option4'
                // control={<Radio />}
                control={<Radio checked={existingAnswer === 'option4'} />}
                label={options[3].option4.optionValue}
              />
            ) : null}

            {options[4]?.option5?.optionValue ? (
              <FormControlLabel
                className='mcq-options'
                value='option5'
                // control={<Radio />}
                control={<Radio checked={existingAnswer === 'option5'} />}
                label={options[4].option5.optionValue}
              />
            ) : null}
          </RadioGroup>
        </FormControl>
        {/* <div className='question-submit-btn' onClick={handleNextQuestion}>
          Next
        </div> */}
      </div>
    </div>
  );
};

export default McqQuestion;
