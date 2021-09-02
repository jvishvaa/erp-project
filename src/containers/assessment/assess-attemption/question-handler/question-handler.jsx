/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import { AssessmentHandlerContext } from '../../assess-attemption/assess-attemption-context';
import QuestionHeader from './question-header';
import QuestionBody from './question-body';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme)=>({
  questionsubmitbtn:{
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: '5px',
    background: theme.palette.secondary.main,
    padding: '10px',
    width: '100%',
    textAlign: 'center',
    maxWidth: '400px',
    cursor: 'pointer',
    color: '#fff',
    marginTop: '20px',
  }
}))



const QuestionHandler = () => {
  const classes = useStyles()
  const {
    questionsDataObj,
    questionsArray,
    controls: { nextQues, currentQuesionId, prevQues },
  } = useContext(AssessmentHandlerContext);

  const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};
  const { meta: { index: qIndex } = {} } = currentQuestionObj || {};
  const propsObj = {
    questionsDataObj,
    qIndex,
    questionsArray,
    questionObj: currentQuestionObj,
  };
  return (
    <>
      <QuestionHeader {...propsObj} />
      <QuestionBody {...propsObj} />
      <div style={{ display: 'flex', margin: 5 }}>
        <div
          key={classes.questionsubmitbtn}
          className={classes.questionsubmitbtn}
          style={{ margin: 'auto' }}
          onClick={() => prevQues()}
        >
          Prev
        </div>
        <div
          key={classes.questionsubmitbtn}
          className={classes.questionsubmitbtn}
          style={{ margin: 'auto' }}
          onClick={() => nextQues()}
        >
          Next
        </div>
      </div>
    </>
  );
};
export default QuestionHandler;
