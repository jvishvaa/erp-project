import React, { useContext, useState } from 'react';
import '../../viewAssessment.css';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ReactHtmlParser from 'react-html-parser';
import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';

const TrueFalseQuestion = () => {
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

  const [{ answer, options, question }] = question_answer;
  const [optionSelected, setOptionSelected] = useState(null);
  const handleOptionValue = (event) => {
    // setIsChecked([{ [qId]: event.target.value }]);
    setOptionSelected(event.target.value);
    attemptQuestion(qId, { attemptionStatus: true, answer: event.target.value });
    // console.log('selected value : ', attemptQuestion);
  };
  debugger
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
        {/* <img src='https://via.placeholder.com/150' alt='question image' />
        <div className='mcq-options'>True</div>
        <div className='mcq-options'>False</div> */}
        <FormControl component='fieldset'>
          {/* <FormLabel component='legend'>Options</FormLabel> */}
          <RadioGroup
            aria-label='gender'
            name='options'
            value={currentQuestionObj?.user_response?.answer}
            onChange={handleOptionValue}
          >
            <FormControlLabel
              className='mcq-options'
              value='Option1'
              control={<Radio />}
              label={options[0].option1.isChecked ? 'True' : 'False'}
            />
            <FormControlLabel
              className='mcq-options'
              value='Option2'
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
