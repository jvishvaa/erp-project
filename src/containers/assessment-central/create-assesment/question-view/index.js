import React, { useState } from 'react';
import { Button, Divider,makeStyles } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { debounce } from 'throttle-debounce';
import AssignMarksMenu from '../assign-marks-menu';
import endpoints from '../../../../config/endpoints';

import './styles.scss';

const useStyles = makeStyles((theme)=>({

  questionContainer:{
    border: '1px solid #dbdbdb',
    padding: '1rem',
    fontSize: '0.9rem',
    borderRadius: '10px',
    margin: '1rem 0',
    color : `${theme.palette.secondary.main} !important`,
  },
  answersHeader : {
    color: theme.palette.secondary.main,
    fontSize: '1.1rem',
    margin: '10px 0',
  },
  questionHeader : {
    color: theme.palette.secondary.main,
    fontSize: '1.1rem',
    margin: '10px 0',
  },
  answersContainer:{
    color:theme.palette.secondary.main
  },
  option:{
    backgroundColor: '#f3f3f3',
    padding: "1rem",
    margin: '1rem 0',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}))

const menuOptions = [
  'Assign marks',
  // 'Without marks',
  'Negative marking',
  // 'Grades only',
  // 'Relative marking',
];

const resolveQuestionTypeName = (type) => {
  switch (type) {
    case 1:
      return 'MCQ SINGLE CHOICE';
    case 2:
      return 'MCQ_MULTIPLE_CHOICE';
    case 3:
      return 'Match the Following';
    case 4:
      return 'Video Question';
    case 5:
      return 'PPT Question';
    case 6:
      return 'Matrix Questions';
    case 7:
      return 'Comprehension Questions';
    case 8:
      return 'True False';
    case 9:
      return 'Fill In The Blanks';
    case 10:
      return 'Descriptive';

    default:
      return '--';
  }
};

function extractContent(s) {
  const span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
}

function msToTime(duration) {
  const milliseconds = Number((duration % 1000) / 100);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${hours}:${minutes}:${seconds}`;
}

const QuestionView = ({
  question,
  showHeader,
  index,
  onChangeMarks,
  showTime,
  subQuestion,
  parentQuestionId,
  showSlide,
}) => {
  const classes = useStyles()
  const { question_type: questionType } = question;
  const [expand, setExpand] = useState(true);
  
  const debounceOnChangeMarks = debounce(300, onChangeMarks);
  const toggleExpand = () => {
    setExpand((prev) => !prev);
  };
  return (
    <div className='question-view-container'>
      {showHeader && (
        <div className='comprehension-question-header-container'>
          {`${index + 1}. ${resolveQuestionTypeName(question.question_type)} ${
            showTime || showSlide ? 'at' : ''
          } ${showTime ? msToTime(question.time_or_slide) : ''} ${
            showSlide ? question.time_or_slide : ''
          }`}
          <Button variant='contained' color='primary' onClick={toggleExpand}>
            {expand ? 'Close' : 'Expand'}
          </Button>
        </div>
      )}
      {expand && (
        <>
          <div
            className={classes.questionHeader}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            Question{' '}
            {showHeader && (
              <AssignMarksMenu
                menuOptions={menuOptions}
                handleChange={(field, value) => {
                  debounceOnChangeMarks(
                    field,
                    value,
                    null,
                    true,
                    question.id,
                    subQuestion && parentQuestionId,
                    question.is_central
                  );
                }}
              />
            )}
          </div>
          <Divider className='secondary-divider' />
          {(questionType == 1 || questionType == 2) && (
            <div className='mcq-container'>
              <div className={classes.questionContainer}>
                {extractContent(question.question_answer[0].question)}
              </div>
              <div className={classes.answersContainer}>
                <div className={classes.answersheader}>Answers</div>
                <Divider className='secondary-divider' />
                <div className='options-container'>
                  {question.question_answer[0].options.map((option, index) => {
                    return (
                      <div className={classes.option} key={`option${index}`}>
                        {/* {extractContent(question.question_answer[0].options[optionKey])} */}
                        {/* {`option${index}`} */}
                        {option[`option${index + 1}`]?.optionValue}
                        <AssignMarksMenu
                          menuOptions={menuOptions}
                          handleChange={(field, value) => {
                            debounceOnChangeMarks(
                              field,
                              value,
                              `option${index + 1}`,
                              false,
                              question.id,
                              subQuestion && parentQuestionId,
                              question.is_central
                            );
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {questionType === 3 && (
            <div className='match-container'>
              <div className='question-container'>
                What a question is this question to a question whos question was that ?
              </div>
              <div className='answers-container'>
                <div className={classes.answersheader}>Answers</div>
                <Divider className='secondary-divider' />
                <div className='options-container'>
                  {question.question_answer.map((obj, index) => (
                    <div className={classes.option}>
                      {obj[`question${index + 1}`]}{' '}
                      <AssignMarksMenu
                        menuOptions={menuOptions}
                        handleChange={(field, value) => {
                          //Assign value  //value    //question1,
                          debounceOnChangeMarks(
                            field,
                            value,
                            `question${index + 1}`,
                            false,
                            question.id,
                            subQuestion && parentQuestionId,
                            question.is_central
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className='match-info'>
                  Match the following on right side of screen
                </div>
                <div className='options-container'>
                  {question.question_answer.map((obj, index) => (
                    <div className={classes.option}>
                      {obj[`answer${index + 1}`]}{' '}
                      {/* <AssignMarksMenu
                        menuOptions={menuOptions}
                        handleChange={() => {}}
                      /> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {questionType === 6 && (
            <div className='matrix-container'>
              <div className='question-container'>
                {extractContent(question.question_answer[0]?.question)}
              </div>
              <div className='answers-container'>
                <div className={classes.answersheader}>Answers</div>
                <Divider className='secondary-divider' />
                <div className='matrix-columns'>
                  {question.question_answer[0]?.options.map((obj) => (
                    <div className='matrix-column'>
                      <span>{obj.optionValue}</span>
                      <span className='vertical-divider'></span>
                    </div>
                  ))}
                </div>

                <div className='options-container'>
                  {question.question_answer[0]?.matrixOptions.map((opt, index) => (
                    <div className={classes.option}>{opt[`optionValue`]} </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {questionType === 8 && (
            <div className='true-false-container'>
              <div className='question-container'>
                {extractContent(question.question_answer[0]?.question)}{' '}
              </div>
              <div className='answers-container'>
                <div className={classes.answersheader}>Answers</div>
                <div className='options-container '>
                  {question.question_answer[0]?.options.map((opt, index) => (
                    <div className='option flex-space-between'>
                      {opt[`option${index + 1}`].isChecked ? 'True' : 'False'}
                      {/* <AssignMarksMenu
                        menuOptions={menuOptions}
                        handleChange={(field, value) => {
                          //Assign value  //value    //option1,
                          onChangeMarks(field, value, `option${index + 1}`);
                        }}
                      /> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {questionType === 9 && (
            <div className='fill-in-the-blanks-container'>
              <div className='question-container'>
                {extractContent(question.question_answer[0]?.question)}
              </div>
              <div className='answers-container'>
                <div className={classes.answersheader}>Answers</div>
                <Divider className='secondary-divider' />
                <div className='options-container'>
                  {question.question_answer[0]?.options.map((opt, index) => (
                    <div className={classes.option}>
                      {opt[`option${index + 1}`].optionValue}
                      <AssignMarksMenu
                        menuOptions={menuOptions}
                        handleChange={(field, value) => {
                          //Assign value  //value    //option1,
                          debounceOnChangeMarks(
                            field,
                            value,
                            `option${index + 1}`,
                            false,
                            question.id,
                            subQuestion && parentQuestionId,
                            question.is_central
                          );
                        }}
                      />
                    </div>
                  ))}
                  {/* <div className={classes.option}>
                    OPTION A{' '}
                    <AssignMarksMenu menuOptions={menuOptions} handleChange={() => {}} />
                  </div>
                  <div className={classes.option}>
                    OPTION A{' '}
                    <AssignMarksMenu menuOptions={menuOptions} handleChange={() => {}} />
                  </div>
                  <div className={classes.option}>
                    OPTION A{' '}
                    <AssignMarksMenu menuOptions={menuOptions} handleChange={() => {}} />
                  </div> */}
                </div>
              </div>
            </div>
          )}
          {questionType === 7 && (
            <div className='comprehension-container'>
              <div className='question-container'>
                {question.question_answer[0]?.question}
              </div>
              <div className='sub-questions-container'>
                {question.sub_questions?.map((subQuestion, index) => (
                  <div className='sub-question-container' key={subQuestion.id}>
                    <QuestionView
                      question={subQuestion}
                      index={index}
                      showHeader
                      onChangeMarks={debounceOnChangeMarks}
                      subQuestion
                      parentQuestionId={question.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {questionType === 10 && (
            <div className='descriptive-container'>
              <div className='question-container'>
                {question.question_answer?.question}
              </div>
              <div className='answers-container'>
                <div className={classes.answersheader}>Answers</div>
                <Divider className='secondary-divider' />
                <div className='options-container'>
                  <div className={classes.option}>
                    Answer{' '}
                    {/* <AssignMarksMenu menuOptions={menuOptions} handleChange={() => {}} /> */}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* {questionType === 4 && (
            <div className='video-container'>
              <div className='question-container'>
                <ReactPlayer
                  // url={question.question_answer.question_answer[0]?.question}
                  style={{ maxWidth: '100%' }}
                  controls
                />
              </div>
              <div className='sub-questions-container'>
                {question.sub_questions?.map((subQuestion, index) => (
                  <div className='sub-question-container' key={subQuestion.id}>
                    <QuestionView
                      question={subQuestion}
                      index={index}
                      showHeader
                      showTime
                      onChangeMarks={debounceOnChangeMarks}
                      subQuestion
                      parentQuestionId={question.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          )} */}
          {questionType === 5 && (
            <div className='video-container'>
              <div className='question-container'>
                <Carousel
                  showArrows
                  onChange={() => {}}
                  onClickItem={() => {}}
                  onClickThumb={() => {}}
                  showThumbs={false}
                >
                  {question.question_answer instanceof Array &&
                    question?.question_answer?.map((obj) => (
                      <div style={{ height: '400px' }}>
                        <img
                          src={`${endpoints.s3}/${obj?.file}`}
                          alt='ppt'
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                      </div>
                    ))}
                </Carousel>
              </div>
              <div className='sub-questions-container'>
                {question.sub_questions?.map((subQuestion, index) => (
                  <div className='sub-question-container' key={subQuestion.id}>
                    <QuestionView
                      question={subQuestion}
                      index={index}
                      showHeader
                      showSlide
                      onChangeMarks={debounceOnChangeMarks}
                      subQuestion
                      parentQuestionId={question.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionView;
