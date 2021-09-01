import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import Collapse from '@material-ui/core/Collapse';
import { Button } from '@material-ui/core';
import useStyles from './questions-review.styles';
import { AssessmentReviewContext } from '../../assess-attemption/assess-review-context';
import { IconButton, SvgIcon } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AttachmentPreviewerContext } from '../../../../components/attachment-previewer/attachment-previewer-contexts';
import endpoints from '../../../../config/endpoints';
import { BorderLeft } from '@material-ui/icons';

function QuestionReview() {
  // const s3Images ="https://erp-revamp.s3.ap-south-1.amazonaws.com/"

  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};
  const classes = useStyles();
  const [open, setOpen] = React.useState();
  const { questionsArray = [], questionsDataObj = {} } =
    React.useContext(AssessmentReviewContext) || {};
  const questionsUI = (quesArray) => {
    return quesArray?.map((Q, index) => {
      const questionId = Q.id;
      const {
        question_type: questionType,
        question_answer: [
          {
            question,
            answer: correctAnswer = [],
            answer_values: correctAnswerValues = [],
            answer_images: answerImages = [],
          },
        ] = [{}],
        user_response: {
          answer: userAnswer = [],
          user_answer_values: differUserResponse,
          user_answer_images: userResposeImages,
        } = {},
        sub_question_answer: subQuestion = [{}],
        is_central: isCentral = false,
      } = questionsDataObj[questionId] || {};
      const handlerAnswerVar = (ansVar) => {
        let answer = '';
        if (Array.isArray(ansVar)) {
          answer = ansVar.join(', ');
        }
        if (typeof ansVar === 'object') {
          answer = Object.entries(ansVar)
            .map(([key, val]) => [isNaN(+key) ? '' : val])
            .map((keyVal) => (keyVal[1] !== '' ? keyVal.join(' : ') : ''))
            .filter(Boolean)
            .join(',');
        }
        answer = answer ?? `${ansVar}`;
        return answer;
      };
      const s3Images = `${isCentral ? endpoints.s3 : endpoints.assessmentErp.s3}/`;
      return (
        <div className={classes.questionCotainer}>
          {questionType === 7 ? (
            <>
              <div className={classes.questionText}>
                <span>
                  <b>
                    {`Q${index + 1}.`}
                  </b>
                  &nbsp;
                </span>
                <span>
                  <b>
                    {ReactHtmlParser(question)}
                  </b>
                </span>
              </div>
              {subQuestion.map((item, index) => (
                <>
                  <div className={classes.questionSubText}>
                    <span>
                      {`Sub Q${index + 1}.`}
                      &nbsp;
                    </span>
                    <span>{ReactHtmlParser(item?.question_answer[0]?.question)}</span>
                  </div>
                  {(item?.user_sub_answer?.question_type === 9) ? (
                    <div className={classes.answersContainer}>
                      <b>Your answer : &nbsp; </b>
                      <label
                        dangerouslySetInnerHTML={{
                          __html: handlerAnswerVar(item?.user_sub_answer?.user_answer),
                        }}
                      ></label>
                      <br />
                      <b>Correct answer : &nbsp; </b>
                      <label
                        dangerouslySetInnerHTML={{
                          __html: handlerAnswerVar(
                            item?.question_answer[0]?.answer_values
                          ),
                        }}
                      ></label>
                    </div>
                  ) : (
                    <div className={classes.answersContainer}>
                      <b>Your answer : &nbsp; </b>
                      <label
                        dangerouslySetInnerHTML={{
                          __html: handlerAnswerVar(
                            item?.user_sub_answer?.user_answer_values
                          ),
                        }}
                      ></label>
                      <br />
                      <b>Correct answer : &nbsp; </b>
                      <label
                        dangerouslySetInnerHTML={{
                          __html:
                            item?.question_answer[0]?.answer_values

                        }}
                      ></label>
                    </div>
                  )}
                </>
              ))
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
              {questionType === 1 || questionType === 8 || questionType === 2 ? (
                <>
                  {questionType === 8 ? (
                    <div className={classes.answersContainer}>
                      <b>Your answer: &nbsp; </b>
                      <label
                        dangerouslySetInnerHTML={{
                          __html: handlerAnswerVar(differUserResponse),
                        }}
                      ></label>
                      <br />
                      <b>Correct answer: &nbsp;</b>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: handlerAnswerVar(correctAnswerValues),
                        }}
                      ></span>
                    </div>
                  ) : (
                    <>
                      <div className={classes.answersContainer}>
                        <b>Your answer: &nbsp; </b>
                        <label
                          dangerouslySetInnerHTML={{
                            __html: handlerAnswerVar(differUserResponse),
                          }}
                        ></label>
                        {userResposeImages?.map((image) => (
                          <a
                            className='underlineRemove'
                            onClick={() => {
                              const fileSrc = `${s3Images}${image}`;
                              openPreview({
                                currentAttachmentIndex: 0,
                                attachmentsArray: [
                                  {
                                    src: fileSrc,
                                    name: `demo`,
                                    extension: '.png',
                                  },
                                ],
                              });
                            }}
                          >
                            <SvgIcon component={() => <VisibilityIcon />} />
                          </a>
                        ))}
                        <br />
                        <b>Correct answer: &nbsp;</b>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: handlerAnswerVar(correctAnswerValues),
                          }}
                        ></span>
                        {answerImages?.map((image) => (
                          <a
                            className='underlineRemove'
                            onClick={() => {
                              const fileSrc = `${s3Images}${image}`;
                              // 'https://erp-revamp.s3.ap-south-1.amazonaws.com/dev/questions_files/2/0/1/1/1627717292_2021-05-17_18_20_14.202081_screenshot_from_2021-03-18_20-31-20_(2).png';
                              // `${s3Image}${options[1]?.option2?.images[0]}`
                              openPreview({
                                currentAttachmentIndex: 0,
                                attachmentsArray: [
                                  {
                                    src: fileSrc,
                                    name: `demo`,
                                    extension: '.png',
                                  },
                                ],
                              });
                            }}
                          >
                            <SvgIcon component={() => <VisibilityIcon />} />
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : questionType === 9 ? (
                <div className={classes.answersContainer}>
                  <b>Your answer: &nbsp; </b>
                  <label
                    dangerouslySetInnerHTML={{ __html: handlerAnswerVar(userAnswer) }}
                  ></label>
                  <br />
                  <b>Correct answer: &nbsp;</b>
                  <span
                    dangerouslySetInnerHTML={{ __html: handlerAnswerVar(correctAnswer) }}
                  ></span>
                </div>
              ) : (
                <div className={classes.answersContainer}>
                  <b>Your answer: &nbsp; </b>
                  <label
                    dangerouslySetInnerHTML={{ __html: handlerAnswerVar(userAnswer) }}
                  ></label>
                  <br />
                  <b>Correct answer: &nbsp;</b>
                  <span
                    dangerouslySetInnerHTML={{ __html: handlerAnswerVar(correctAnswer) }}
                  ></span>
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
          className={classes.closeBtn}
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
      </Collapse>
    </div>
  );
}
export default withRouter(QuestionReview);
