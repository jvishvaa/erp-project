import React, { useContext } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import ReactHtmlParser from 'react-html-parser';
import { makeStyles } from '@material-ui/styles';
import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';
import '../../assess-attemption.css';


const useStyles = makeStyles((theme) => ({
  mcqOptions: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '5px',
    background: theme.palette.primary.primarylightest,
    padding: '10px',
    width: '100%',
    textAlign: 'center',
    // justifyContent: 'space-between',
    /* max-width: 400px, */
    cursor: 'pointer',
    marginBottom: '10px',
  }
}))
const TrueFalseQuestion = (props) => {
  const classes = useStyles()
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
        <div style={{ fontSize: "30px" }}>{ReactHtmlParser(question)}</div>
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
              className={classes.mcqOptions}
              value='option1'
              // control={<Radio />}
              control={<Radio checked={existingAnswer === 'option1'} />}
              // label={options[0].option1.isChecked ? 'True' : 'False'}
              label={'True'}
            />
            <FormControlLabel
              className={classes.mcqOptions}
              value='option2'
              // control={<Radio />}
              control={<Radio checked={existingAnswer === 'option2'} />}
              // label={options[1].option2.isChecked ? 'True' : 'False'}
              label={'False'}
            />
          </RadioGroup>
        </FormControl>
        {/* <div className='question-submit-btn'>Next</div> */}
      </div>
    </div>
  );
};

export default TrueFalseQuestion;
