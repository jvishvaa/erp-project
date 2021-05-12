import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import OptionsHandler from './options-handler';

export default function McqQuestion(props) {
  const {
    // onAttemptionCurrentQuesAttemption,
    setStartTime,
    questionObj: currentQuestionObj,
    attemptQuestion,
    responseObj,
    getBgmAudioTag,
  } = props || {};
  const { question_answer: questionAnswer } = currentQuestionObj || {};
  const [{ question = 'No content available' }] = (questionAnswer || []).length
    ? questionAnswer
    : [{}];

  React.useEffect(() => {
    setStartTime(currentQuestionObj.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className='whole-container grow'>
      <div className='question-container mp-quiz'>
        <div className='resizeable-text'>
          <div className='resizeable'>{ReactHtmlParser(question)}</div>
        </div>
      </div>
      <div className='options-container_new'>
        <OptionsHandler
          questionObj={currentQuestionObj}
          responseObj={responseObj}
          attemptQuestion={attemptQuestion}
          getBgmAudioTag={getBgmAudioTag}
          // onAttemptionCurrentQuesAttemption={onAttemptionCurrentQuesAttemption}
        />
      </div>
    </div>
  );
}

/* <FormControl component='fieldset' onChange={handleOptionValue}>
          <RadioGroup
            aria-label='gender'
            name='options'
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
                control={<Radio checked={existingAnswer === 'option3'} />}
                label={options[2].option3.optionValue}
              />
            ) : null}

            {options[3]?.option4?.optionValue ? (
              <FormControlLabel
                className='mcq-options'
                value='option4'
                control={<Radio checked={existingAnswer === 'option4'} />}
                label={options[3].option4.optionValue}
              />
            ) : null}

            {options[4]?.option5?.optionValue ? (
              <FormControlLabel
                className='mcq-options'
                value='option5'
                control={<Radio checked={existingAnswer === 'option5'} />}
                label={options[4].option5.optionValue}
              />
            ) : null}
          </RadioGroup>
        </FormControl> */
