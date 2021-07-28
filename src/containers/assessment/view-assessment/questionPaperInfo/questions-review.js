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
        question_answer: [{ question, answer: correctAnswer = [], answer_values: correctAnswerValues = [] }] = [{}],
        user_response: { answer: userAnswer = [], user_answer_values: differUserResponse } = {},
        sub_question_answer: subQuestion = [{}],
      } = questionsDataObj[questionId] || {};
      const handlerAnswerVar = (ansVar) => {
        if (Array.isArray(ansVar)) {
          return ansVar.join(', ');
        }
        if (typeof ansVar === 'object') {
          return Object.entries(ansVar)
            .map(([key, val]) => [isNaN(+key) ? key : +key + 1, val])
            .map((keyVal) => keyVal.join(' : '))
            .join(',');
        }
        return `${ansVar}`;
      };
      return (
        <div className={classes.questionCotainer}>
          {questionType === 7 ? (
            <>
              {
                subQuestion.map((item, index) =>
                  <>
                    <div className={classes.questionText}>
                      <span>
                        {`Q${index + 1}.`}
                        &nbsp;
                      </span>
                      <span>{ReactHtmlParser(item.question_answer[0]?.question)}</span>
                    </div>
                    {item?.user_sub_answer?.question_type === 9 ? (
                      <div className={classes.answersContainer}>
                        <b>Your answer : &nbsp; </b>
                        <label dangerouslySetInnerHTML={{ __html: handlerAnswerVar(item?.user_sub_answer?.user_answer[0]) }}></label>
                        <br />
                        <b>Correct answer : &nbsp; </b>
                        <label dangerouslySetInnerHTML={{ __html: handlerAnswerVar(item?.question_answer[0]?.answer_values) }}></label>
                      </div>

                    ) : (
                      <div className={classes.answersContainer}>
                        <b>Your answer : &nbsp; </b>
                        <label dangerouslySetInnerHTML={{ __html: handlerAnswerVar(item?.user_sub_answer?.user_answer_values) }}></label>
                        <br />
                        <b>Correct answer : &nbsp; </b>
                        <label dangerouslySetInnerHTML={{ __html: handlerAnswerVar(item?.question_answer[0]?.answer_values) }}></label>
                      </div>

                    )}
                  </>
                )
              }
            </>
          ) : (
            <>
              <div className={classes.questionText}>
                <span>
                  {`Q${index + 1}.`}
                  &nbsp;
                </span>
                <span>{ReactHtmlParser(question)}</span>
              </div>
              {(questionType === 1 || questionType === 8 || questionType === 2) ? (
                <div className={classes.answersContainer}>
                  <b>Your answer: &nbsp; </b><label dangerouslySetInnerHTML={{ __html: handlerAnswerVar(differUserResponse) }}></label>
                  <br />
                  <b>Correct answer: &nbsp;</b>
                  <span dangerouslySetInnerHTML={{ __html: handlerAnswerVar(correctAnswerValues) }}></span>
                </div>

              ) : (questionType === 9) ? (<div className={classes.answersContainer}>
                <b>Your answer: &nbsp; </b><label dangerouslySetInnerHTML={{ __html: handlerAnswerVar(userAnswer[0]) }}></label>
                <br />
                <b>Correct answer: &nbsp;</b>
                <span dangerouslySetInnerHTML={{ __html: handlerAnswerVar(correctAnswer) }}></span>
              </div>
              ) : (
                <div className={classes.answersContainer}>
                  <b>Your answer: &nbsp; </b><label dangerouslySetInnerHTML={{ __html: handlerAnswerVar(userAnswer) }}></label>
                  <br />
                  <b>Correct answer: &nbsp;</b>
                  <span dangerouslySetInnerHTML={{ __html: handlerAnswerVar(correctAnswer) }}></span>
                </div>
              )}
            </>
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
        <Button
          variant='contained'
          color='primary'
          className={classes.closeBtn} onClick={() => setOpen(false)}>
          Close
        </Button>
      </Collapse>
    </div>
  );
}
export default withRouter(QuestionReview);
