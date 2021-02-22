import React, { useContext } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import ReactHtmlParser from 'react-html-parser';

import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';
import '../../viewAssessment.css';

const TrueFalseQuestion = (props) => {
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
      <div className='mcq-question-wrapper'>
        <h3>{ReactHtmlParser(question)}</h3>
        {/* <img src='https://via.placeholder.com/150' alt='question image' /> */}
        <FormControl component='fieldset'>
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
              control={<Radio />}
              label={options[0].option1.isChecked ? 'True' : 'False'}
            />
            <FormControlLabel
              className='mcq-options'
              value='option2'
              control={<Radio />}
              label={options[1].option2.isChecked ? 'True' : 'False'}
            />
          </RadioGroup>
        </FormControl>
        {/* <div className='question-submit-btn'>Next</div> */}
      </div>
    </div>
  );
};

export default TrueFalseQuestion;
