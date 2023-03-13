import React, { useState } from 'react';
import { Button, Divider, makeStyles, SvgIcon } from '@material-ui/core';
import ReactPlayer from 'react-player';
import ReactHtmlParser from 'react-html-parser';
import endpoints from '../../../../config/endpoints';
import './styles-style.scss';
import VisibilityIcon from '@material-ui/icons/Visibility';
// import { AttachmentPreviewerContext } from '../../../../components/attachment-previewer/attachment-previewer-contexts';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';

const useStyles = makeStyles((theme) => ({
  questionHeader: {
    // color: theme.palette.secondary.main,
    color: 'orange',
    fontSize: '1.1rem',
    margin: '10px 0',
  },
  answersHeader: {
    // color: theme.palette.secondary.main,
    color: 'orange',
    fontSize: '1.1rem',
    margin: '10px 0',
  },
  questionContainer: {
    // border: '1px solid #dbdbdb',
    // padding: '1rem',
    fontSize: '1.0rem',
    // borderRadius: '10px',
    // margin: '1rem 0',
    // color: `${theme.palette.secondary.main} !important`,
  },
  answersContainer: {
    color: theme.palette.secondary.main,
  },
  option: {
    // backgroundColor: '#f3f3f3',
    // padding: "1rem",
    // margin: '1rem 0',
    // borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

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
  const classes = useStyles();
  const { question_type: questionType } = question;
  const [expand, setExpand] = useState(true);
  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};
  const toggleExpand = () => {
    setExpand((prev) => !prev);
  };

  function extractContentOption(s) {
    if (s?.length > 0 && s.indexOf('<') > -1) {
      let newarr = s.replace('<', '&lt;')
      const span = document.createElement('span');
      span.innerHTML = newarr;
      return span.textContent || span.innerText;
    } else {
      const span = document.createElement('span');
      span.innerHTML = s;
      return span.textContent || span.innerText;
    }
  }



  const getS3DomainURL = (fileSrc) => {
    return `${
      // viewMoreData?.parent?.is_central ? endpoints.s3 : endpoints.assessmentErp.s3
      question?.is_central === true ? endpoints.s3 : endpoints.assessmentErp.s3
      }/${fileSrc}`;
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
          <div className={classes.questionHeader}>Question {index + 1}</div> 
          {/* <Divider className='secondary-divider' /> */}
          {questionType == 1 && (
            <div className='mcq-container'>
              <div className={classes.questionContainer}>
                {ReactHtmlParser(question.question_answer[0].question)}
              </div>
              <div className={classes.answersContainer}>
                <div className={classes.answersHeader}>Options</div>
                {/* <Divider className='secondary-divider' /> */}
                <div className='options-container'>
                  {question?.question_answer[0]?.options?.map((optionObj, subIndex) => (
                    <div className={classes.option} key={`option-item-${index}`}>
                      {/* {ReactHtmlParser(optionObj[`option${subIndex + 1}`]?.optionValue)} */}
                      {subIndex + 1}.&nbsp;
                      {extractContentOption(optionObj[`option${subIndex + 1}`]?.optionValue)}

                      {`${optionObj[`option${subIndex + 1}`]?.images}`?.length > 0 && (
                        <div>
                          <a
                            onClick={() => {
                              openPreview({
                                currentAttachmentIndex: 0,
                                attachmentsArray: (() => {
                                  const images =
                                    `${optionObj[`option${subIndex + 1}`]?.images}`.split(',') || {};

                                  const attachmentsArray = [];
                                  images.forEach((image) => {
                                    const attachmentObj = {
                                      src: getS3DomainURL(image),
                                      name: `${image}`.split('.').slice(0, -1).join('.'),
                                      extension: `.${`${image}`.split('.').slice(-1)[0]}`,
                                    };
                                    attachmentsArray.push(attachmentObj);
                                  });
                                  return attachmentsArray;
                                })(),
                              });
                            }}
                          >
                            <SvgIcon component={() => <VisibilityIcon />} />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Divider className='secondary-divider' />
              </div>
              <div className={classes.answersContainer}>
                <div className={classes.answersHeader}>Answers</div>
                <div className='options-container'>
                  {question?.question_answer[0]?.answer?.map((optionObj, subIndex) => (
                    <div className={classes.option} key={`option-item-${index}`}>
                      {/* {ReactHtmlParser(optionObj[`option${subIndex + 1}`]?.optionValue)} */}
                      {extractContentOption(optionObj)}

                      {/* {`${optionObj[`option${subIndex + 1}`]?.images}`?.length > 0 && (
                        <div>
                          <a
                            onClick={() => {
                              openPreview({
                                currentAttachmentIndex: 0,
                                attachmentsArray: (() => {
                                  const images =
                                    `${optionObj[`option${subIndex + 1}`]?.images}`.split(',') || {};

                                  const attachmentsArray = [];
                                  images.forEach((image) => {
                                    const attachmentObj = {
                                      src: getS3DomainURL(image),
                                      name: `${image}`.split('.').slice(0, -1).join('.'),
                                      extension: `.${`${image}`.split('.').slice(-1)[0]}`,
                                    };
                                    attachmentsArray.push(attachmentObj);
                                  });
                                  return attachmentsArray;
                                })(),
                              });
                            }}
                          >
                            <SvgIcon component={() => <VisibilityIcon />} />
                          </a>
                        </div>
                      )} */}
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
                  {ReactHtmlParser(question.question_answer[0].question)}
                </div>
                <div className='answers-container'>
                  <div className={classes.answersHeader}>Options</div>
                  {/* <Divider className='secondary-divider' /> */}
                  <div className='options-container'>
                    {question.question_answer[0]?.options.map((optionObj, subIndex) => (
                      <div className='option' key={`option-item-${index}`} style={{ display: 'flex' }}>
                        <div>{subIndex + 1}.&nbsp;
                          {ReactHtmlParser(optionObj[`option${subIndex + 1}`].optionValue)}</div>
                        {`${optionObj[`option${subIndex + 1}`]?.images}`?.length > 0 && (
                          <div>
                            <a
                              onClick={() => {
                                openPreview({
                                  currentAttachmentIndex: 0,
                                  attachmentsArray: (() => {
                                    const images =
                                      `${optionObj[`option${subIndex + 1}`]?.images}`.split(',') || {};

                                    const attachmentsArray = [];
                                    images.forEach((image) => {
                                      const attachmentObj = {
                                        src: getS3DomainURL(image),
                                        name: `${image}`.split('.').slice(0, -1).join('.'),
                                        extension: `.${`${image}`.split('.').slice(-1)[0]}`,
                                      };
                                      attachmentsArray.push(attachmentObj);
                                    });
                                    return attachmentsArray;
                                  })(),
                                });
                              }}
                            >
                              <SvgIcon component={() => <VisibilityIcon />} />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Divider className='secondary-divider' />
                </div>
                <div className='answers-container'>
                  <div className={classes.answersHeader}>Answers</div>
                  {/* <Divider className='secondary-divider' /> */}
                  <div className='options-container'>
                    {question.question_answer[0]?.answer.map((optionObj, subIndex) => (
                      <div className='option' key={`option-item-${index}`}>
                        {ReactHtmlParser(optionObj)}
                        {/* {`${optionObj[`option${subIndex + 1}`]?.images}`?.length > 0 && (
                          <div>
                            <a
                              onClick={() => {
                                openPreview({
                                  currentAttachmentIndex: 0,
                                  attachmentsArray: (() => {
                                    const images =
                                      `${optionObj[`option${subIndex + 1}`]?.images}`.split(',') || {};

                                    const attachmentsArray = [];
                                    images.forEach((image) => {
                                      const attachmentObj = {
                                        src: getS3DomainURL(image),
                                        name: `${image}`.split('.').slice(0, -1).join('.'),
                                        extension: `.${`${image}`.split('.').slice(-1)[0]}`,
                                      };
                                      attachmentsArray.push(attachmentObj);
                                    });
                                    return attachmentsArray;
                                  })(),
                                });
                              }}
                            >
                              <SvgIcon component={() => <VisibilityIcon />} />
                            </a>
                          </div>
                        )} */}
                      </div>
                    ))}
                  </div>
                  <Divider className='secondary-divider' />
                </div>

              </div>
            )}
          </div>

          {questionType === 3 && (
            <div className='match-container'>
              <div className='question-container'>
                {ReactHtmlParser(question.question_answer[0].question)}
              </div>
              <div className='answers-container'>
                <div className={classes.answersHeader}>Answers Question</div>
                {/* <Divider className='secondary-divider' /> */}
                <div className='options-container'>
                  {question?.question_answer[0]?.questionAnswer.map((obj, index) => (
                    <div className='option'>
                      {obj?.answer}&nbsp;&nbsp;{obj?.question}
                    </div>
                  ))}
                </div>
                <div className='match-info'>OPTIONS</div>
                {/* <Divider className='secondary-divider' /> */}
                <div className='options-container'>
                  {question?.question_answer[0]?.options.map((obj, index) => (
                    <div className='option'>{obj?.optionValue}</div>
                  ))}
                </div>
                <div className='match-info'>MATCHING OPTIONS</div>
                {/* <Divider className='secondary-divider' /> */}
                <div className='options-container'>
                  {question?.question_answer[0]?.matchingOptions.map((obj, index) => (
                    <div className='option'>{obj?.optionValue}</div>
                  ))}
                </div>
                <Divider className='secondary-divider' />
              </div>
            </div>
          )}
          {questionType === 6 && (
            <div className='matrix-container'>
              <div className='question-container'>
                {ReactHtmlParser(question.question_answer[0].question)}
              </div>
              <div className='answers-container'>
                <div className={classes.answersHeader}>Answers</div>
                {/* <Divider className='secondary-divider' /> */}
                <div className='matrix-columns'>
                  {question.question_answer[0]?.options.map((obj) => (
                    <div className='matrix-column'>
                      <span>{obj.optionValue}</span>
                      {/* <span className='vertical-divider'></span> */}
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
                {ReactHtmlParser(question.question_answer[0]?.question)}
              </div>
              <div className='answers-container'>

                <div className={classes.answersHeader}>Options</div>
                <div className='options-container '>
                  {question.question_answer[0]?.options.map((obj, i) => (
                    <div className='option flex-space-between'>
                      {' '}
                      <div className='matrix-column d-flex'>
                        <div>{Object.keys(obj)[0] || ''}</div> {' : '}
                        <div>{obj[Object.keys(obj)[0]].optionValue}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={classes.answersHeader}>Answers</div>
                <div className='options-container '>
                  <div className='option flex-space-between'>
                    {question.question_answer[0]?.answer.map((obj) => (
                      <div className='matrix-column'>
                        <span>{obj}</span>
                        {/* <span className='vertical-divider'></span> */}
                      </div>
                    ))}{' '}
                  </div>
                </div>
              </div>
            </div>
          )}
          {questionType === 9 && (
            <div className='fill-in-the-blanks-container'>
              <div className='question-container'>
                {ReactHtmlParser(question.question_answer[0]?.question)}
              </div>
              <div className='answers-container'>
                <div className={classes.answersHeader}>Answers</div>
                {/* <Divider className='secondary-divider' /> */}
                <div className='options-container'>
                  {question.question_answer[0]?.answer?.map((obj) => (
                    <div className='matrix-column'>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
                {/* <div className={classes.answersHeader}>Options</div> */}
                {/* <Divider className='secondary-divider' /> */}
                {/* <div className='options-container'>
                  {question.question_answer[0]?.options?.map((obj, i) => (
                    <div className='matrix-column'>
                      {obj[`option${i + 1}`].optionValue}
                    </div>
                  ))}
                </div> */}
              </div>
              <Divider className='secondary-divider' />
            </div>
          )}
          {questionType === 7 && (
            <div className='comprehension-container'>
              <div className='question-container'>
                {ReactHtmlParser(question.question_answer[0]?.question)}
              </div>
              <div className='sub-questions-container'>
                {question.sub_questions?.map((question, index) => (
                  <div className='sub-question-container' key={question.id}>
                    <QuestionView question={question} index={index} showHeader />
                  </div>
                ))}
              </div>
              <Divider className='secondary-divider' />
            </div>
          )}
          {questionType === 10 && (
            <div className='descriptive-container'>
              <div className='question-container'>
                {ReactHtmlParser(question.question_answer[0]?.question)}
              </div>
              <div className='answers-container'>
                <div className={classes.answersHeader}>Answers</div>
                {/* <Divider className='secondary-divider' /> */}
                <div className='options-container'>
                  <div className='option'>
                    {ReactHtmlParser(question.question_answer[0]?.answer)}
                  </div>
                </div>
              </div>
              <Divider className='secondary-divider' />
            </div>
          )}
          {questionType === 4 && (
            <div className='video-container'>
              <div className='question-container'>
                {ReactHtmlParser(question?.question_answer[0]?.question)}
                <ReactPlayer
                  playing={false}
                  controls={true}
                  url={`${question?.is_central ? endpoints.s3 : endpoints.assessmentErp.s3
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
              <Divider className='secondary-divider' />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionView;
