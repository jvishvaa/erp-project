import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import Collapse from '@material-ui/core/Collapse';
import { Button } from '@material-ui/core';
import useStyles from './questions-review.styles';

import { AssessmentReviewContext } from '../../assess-attemption/assess-review-context';

function QuestionReview() {
  const classes = useStyles();
  const [open, setOpen] = React.useState();
  const { questionsArray = [], questionsDataObj = {} } =
    React.useContext(AssessmentReviewContext) || {};
  const questionsUI = (quesArray) => {
    return quesArray?.map((Q, index) => {
      const questionId = Q.id;
      const {
        question_type: questionType,
        question_answer: [{ question, answer: correctAnswer = [] }] = [{}],
        user_response: { answer: userAnswer = [] } = {},
      } = questionsDataObj[questionId] || {};
      const handlerAnswerVar = (ansVar) => {
        if (Array.isArray(ansVar)) {
          return ansVar.join(', ');
        }
        if (typeof ansVar === 'object') {
          return Object.entries(ansVar)
            .map(([key, val]) => [isNaN(+key) ? key : +key + 1, val])
            .map((keyVal) => keyVal.join(' : '))
            .join(',/n');
        }
        return `${ansVar}`;
      };
      return (
        <div className={classes.questionCotainer}>
          <div className={classes.questionText}>
            <span>
              {`Q${index + 1}.`}
              &nbsp;
            </span>
            <span>{ReactHtmlParser(question)}</span>
          </div>
          {questionType === 7 ? (
            questionsUI(Q?.sub_questions || [])
          ) : (
            <div className={classes.answersContainer}>
              <p>
                Your answer: &nbsp;
                {handlerAnswerVar(userAnswer)}
              </p>
              <p>
                Correct answer: &nbsp;
                {handlerAnswerVar(correctAnswer)}
              </p>
            </div>
          )}
        </div>
      );
    });
  };
  return (
    <div>
      <Button
        style={{ visibility: open ? 'hidden' : 'visible' }}
        className={classes.btn}
        onClick={setOpen}
      >
        Review Answers
      </Button>
      <Collapse in={open}>
        <div>{questionsUI(questionsArray)}</div>
        <Button className={classes.closeBtn} onClick={() => setOpen(false)}>
          Close
        </Button>
      </Collapse>
    </div>
  );
}
export default withRouter(QuestionReview);
