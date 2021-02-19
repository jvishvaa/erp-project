import React, { useContext, useState, useEffect, useRef } from 'react';
import '../../viewAssessment.css';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ReactHtmlParser from 'react-html-parser';
import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';

const McqQuestion = (props) => {
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

  const [{ answer, options, question }] = question_answer;
  const [optionSelected, setOptionSelected] = React.useState(null);
  // const [isChecked, setIsChecked] = useState([]);
  useEffect(() => {
    console.log('is CHecked: ', currentQuestionObj);
    // if (currentQuestionObj?.user_response?.attemptionStatus) {
    //   console.log('selected answer: ', currentQuestionObj?.user_response);
    //   setOptionSelected(currentQuestionObj?.user_response?.answer);
    // }
  }, []);

  function removeTags(str) {
    if (str === null || str === '') return false;
    str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '');
  }

  const handleOptionValue = (event) => {
    // setIsChecked([{ [qId]: event.target.value }]);
    setOptionSelected(event.target.value);
    attemptQuestion(qId, { attemptionStatus: true, answer: event.target.value });
    // console.log('selected value : ', attemptQuestion);
  };

  const handleNextQuestion = () => {
    nextQues(qId);
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
              label={options[0].option1.optionValue}
            />
            <FormControlLabel
              className='mcq-options'
              value='Option2'
              control={<Radio />}
              label={options[1].option2.optionValue}
            />
            {options[2]?.option3?.optionValue ? (
              <FormControlLabel
                className='mcq-options'
                value='Option3'
                control={<Radio />}
                label={options[2].option3.optionValue}
              />
            ) : null}

            {options[3]?.option4?.optionValue ? (
              <FormControlLabel
                className='mcq-options'
                value='Option4'
                control={<Radio />}
                label={options[3].option4.optionValue}
              />
            ) : null}

            {options[4]?.option5?.optionValue ? (
              <FormControlLabel
                className='mcq-options'
                value='Option5'
                control={<Radio />}
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
