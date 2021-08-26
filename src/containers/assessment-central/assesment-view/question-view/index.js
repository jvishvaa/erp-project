import React, { useState } from 'react';
import { Button, Divider,makeStyles } from '@material-ui/core';
import ReactPlayer from 'react-player';
import endpoints from '../../../../config/endpoints';
import './styles-style.scss';

const useStyles = makeStyles((theme)=>({
  questionHeader : {
    color: theme.palette.secondary.main,
    fontSize: '1.1rem',
    margin: '10px 0',
  },
  answersHeader : {
    color: theme.palette.secondary.main,
    fontSize: '1.1rem',
    margin: '10px 0',
  },
  questionContainer:{
    border: '1px solid #dbdbdb',
    padding: '1rem',
    fontSize: '0.9rem',
    borderRadius: '10px',
    margin: '1rem 0',
    color : `${theme.palette.secondary.main} !important`
  },
  answersContainer:{
    color : theme.palette.secondary.main
  },
  option:{
    backgroundColor: '#f3f3f3',
        padding: "1rem",
        margin: '1rem 0',
        borderRadius: '10px',
        display: 'flex',
        justifyContent:'space-between',
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

const QuestionView = ({ question, showHeader, index }) => {
  const classes = useStyles()
  const { question_type: questionType } = question;
  const [expand, setExpand] = useState(true);
  const toggleExpand = () => {
    setExpand((prev) => !prev);
  };
  return (
    <div className='question-view-container' key={Math.random()}>
      {showHeader && (
        <div className='comprehension-question-header-container'>
          {`${index + 1}. ${resolveQuestionTypeName(question.question_type)}`}
          <Button variant='contained' color='primary' onClick={toggleExpand}>
            {expand ? 'Close' : 'Expand'}
          </Button>
        </div>
      )}
      {expand && (
        <>
          <div className={classes.questionHeader}>Question</div>
          <Divider className='secondary-divider' />
          {questionType == 1 && (
            <div className='mcq-container'>
              <div className={classes.questionContainer}>
                {extractContent(question.question_answer[0].question)}
              </div>
              <div className={classes.answersContainer}>
                <div className={classes.answersHeader}>Answers</div>
                <Divider className='secondary-divider' />
                <div className='options-container'>
                  {question?.question_answer[0]?.options?.map((optionObj, subIndex) => (
                    <div className={classes.option} key={`option-item-${index}`}>
                      {extractContent(optionObj[`option${subIndex + 1}`]?.optionValue)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div>
            {questionType == 2 && (
              <div className='mcq-container'>
                <div className='question-container'>
                  {extractContent(question.question_answer[0].question)}
                </div>
                <div className='answers-container'>
                  <div className={classes.answersHeader}>Answers</div>
                  <Divider className='secondary-divider' />
                  <div className='options-container'>
                    {question.question_answer[0]?.options.map((optionObj, subIndex) => (
                      <div className='option' key={`option-item-${index}`}>
                        {extractContent(optionObj[`option${subIndex + 1}`].optionValue)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {questionType === 3 && (
            <div className='match-container'>
              <div className='question-container'>
                {extractContent(question.question_answer[0].question)}
              </div>
              <div className='answers-container'>
                <div className={classes.answersHeader}>Answers Question</div>
                <Divider className='secondary-divider' />
                <div className='options-container'>
                  {question?.question_answer[0]?.questionAnswer.map((obj, index) => (
                    <div className='option'>
                      {obj?.answer}&nbsp;&nbsp;{obj?.question}
                    </div>
                  ))}
                </div>
                <div className='match-info'>OPTIONS</div>
                <Divider className='secondary-divider' />
                <div className='options-container'>
                  {question?.question_answer[0]?.options.map((obj, index) => (
                    <div className='option'>{obj?.optionValue}</div>
                  ))}
                </div>
                <div className='match-info'>MATCHING OPTIONS</div>
                <Divider className='secondary-divider' />
                <div className='options-container'>
                  {question?.question_answer[0]?.matchingOptions.map((obj, index) => (
                    <div className='option'>{obj?.optionValue}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {questionType === 6 && (
            <div className='matrix-container'>
              <div className='question-container'>
                {extractContent(question.question_answer[0].question)}
              </div>
              <div className='answers-container'>
                <div className={classes.answersHeader}>Answers</div>
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
                    <div className='option'>{opt[`optionValue`]} </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {questionType === 8 && (
            <div className='true-false-container'>
              <div className='question-container'>
                {extractContent(question.question_answer[0]?.question)}
              </div>
              <div className='answers-container'>
                <div className={classes.answersHeader}>Answers</div>
                <div className='options-container '>
                  <div className='option flex-space-between'>
                    {question.question_answer[0]?.answer.map((obj) => (
                      <div className='matrix-column'>
                        <span>{obj}</span>
                        <span className='vertical-divider'></span>
                      </div>
                    ))}{' '}
                  </div>
                </div>
                <div className={classes.answersHeader}>Options</div>

                <div className='options-container '>
                  {question.question_answer[0]?.options.map((obj, i) => (
                    <div className='option flex-space-between'>
                      {' '}
                      <div className='matrix-column'>
                        <div>{Object.keys(obj)[0] || ''}</div>
                      </div>
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
                <div className={classes.answersHeader}>Answers</div>
                <Divider className='secondary-divider' />
                <div className='options-container'>
                  {question.question_answer[0]?.answer?.map((obj) => (
                    <div className='matrix-column'>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
                <div className={classes.answersHeader}>Options</div>
                <Divider className='secondary-divider' />
                <div className='options-container'>
                  {question.question_answer[0]?.options?.map((obj, i) => (
                    <div className='matrix-column'>
                      {obj[`option${i + 1}`].optionValue}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {questionType === 7 && (
            <div className='comprehension-container'>
              <div className='question-container'>
                {extractContent(question.question_answer[0]?.question)}
              </div>
              <div className='sub-questions-container'>
                {question.sub_questions?.map((question, index) => (
                  <div className='sub-question-container' key={question.id}>
                    <QuestionView question={question} index={index} showHeader />
                  </div>
                ))}
              </div>
            </div>
          )}
          {questionType === 10 && (
            <div className='descriptive-container'>
              <div className='question-container'>
                {extractContent(question.question_answer[0]?.question)}
              </div>
              <div className='answers-container'>
                <div className={classes.answersHeader}>Answers</div>
                <Divider className='secondary-divider' />
                <div className='options-container'>
                  <div className='option'>
                    {extractContent(question.question_answer[0]?.answer)}
                  </div>
                </div>
              </div>
            </div>
          )}
          {questionType === 4 && (
            <div className='video-container'>
              <div className='question-container'>
                {extractContent(question?.question_answer[0]?.question)}
                <ReactPlayer
                  playing={false}
                  controls={true}
                  url={`${
                    question?.is_central ? endpoints.s3 : endpoints.assessmentErp.s3
                  }/${question?.question_answer[0]?.video}`}
                  style={{ maxWidth: '100%' }}
                />
              </div>
              <div className='sub-questions-container'>
                {question.sub_questions?.map((question, index) => (
                  <div className='sub-question-container' key={question.id}>
                    <QuestionView question={question} index={index} showHeader />
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
