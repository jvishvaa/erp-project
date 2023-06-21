import React, { useState } from 'react';
import { Button, Collapse, Divider } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import ReactHtmlParser from 'react-html-parser';
import endpoints from 'v2/config/endpoints';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {  SvgIcon } from '@material-ui/core';

const { Panel } = Collapse;

const QuestionPaperView = ({ questionData }) => {
  const [answerHidden, setAnswerHidden] = useState([]);

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

  // const extractContent = (s) => {
  //   const span = document.createElement('span');
  //   span.innerHTML = s;
  //   return span.textContent || span.innerText;
  // };
  function extractContent(s) {
    if (s?.length > 0 && s.indexOf('<') > -1) {
      let newarr = s.replace('<', '&lt;')
      console.log(newarr , 'arr');
      const span = document.createElement('span');
      span.innerHTML = newarr;
      return span.textContent || span.innerText;
    } else {
      const span = document.createElement('span');
      span.innerHTML = s;
      return span.textContent || span.innerText;
    }
  }

  const toggleAnswer = (id) => {
    if (answerHidden.includes(id)) {
      let removeArr = answerHidden?.filter((each) => {
        return each !== id;
      });
      setAnswerHidden(removeArr);
    } else {
      let arr = [];
      arr.push(id);
      setAnswerHidden(arr);
    }
  };

  const getS3DomainURL = (fileSrc) => {
    return `${endpoints.lessonPlan.bucket}/${fileSrc}`;
  };

  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};

  return (
    <>
      <Collapse
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        expandIconPosition='end'
        className='th-br-6 my-2 th-collapse th-question-collapse'
        style={{ border: '0px solid #d9d9d9', backgroundColor: 'transparent' }}
        accordion
      >
        {Array.isArray(questionData) &&
          questionData.length > 0 &&
          questionData.map((item, index) => (
            <Panel
              header={
                <div className='row'>
                  <div className='th-black-1 px-0 col-12 pl-0'>
                    <div className='row justify-content-between'>
                      <span className='th-fw-500'>Section {item.name}</span>
                    </div>
                  </div>
                </div>
              }
              key={index + 1}
              className='site-collapse-custom-panel mb-2 th-br-8'
            >
              {Array.isArray(item.questions) &&
                item.questions.length > 0 &&
                item.questions.map((qitem, qindex) => (
                  <>
                    {qitem.question_type == 1 ||
                    qitem.question_type == 2 ||
                    qitem.question_type == 9 ? (
                      <div className='lp-question-box'>
                        <div className='row'>
                          <div className='col-12'>
                            <p className='text-right '>
                              {resolveQuestionTypeName(qitem.question_type)}
                            </p>
                          </div>
                          <div className='col-12'>
                            <p className='th-black th-fw-600 mb-0'>
                              Question {qindex + 1}
                            </p>
                            <p className='lp-question'>
                              {ReactHtmlParser(qitem.question_answer[0].question)}
                            </p>
                          </div>
                          <div className='col-12'>
                            <p className='th-black th-fw-600 mb-0'>Options</p>
                            <ul style={{ listStyle: 'none' }}>
                              {Array.isArray(qitem.question_answer[0].options) &&
                                qitem.question_answer[0].options.length > 0 &&
                                qitem.question_answer[0].options.map(
                                  (opitem, opindex) => (
                                    <li key={opindex}>
                                      <span className='pr-2'>Option {opindex + 1}. </span>
                                      {extractContent(
                                        opitem[`option${opindex + 1}`].optionValue
                                      )}

                                      {Array.isArray(
                                        opitem[`option${opindex + 1}`].images
                                      ) &&
                                        opitem[`option${opindex + 1}`].images.map(
                                          (imgitem, imgindex) => (
                                            <img
                                              className='m-2'
                                              style={{ cursor: 'pointer' }}
                                              onClick={() => {
                                                openPreview({
                                                  currentAttachmentIndex: imgindex,
                                                  attachmentsArray: (() => {
                                                    const images =
                                                      `${
                                                        opitem[`option${opindex + 1}`]
                                                          .images
                                                      }`.split(',') || {};
                                                    const attachmentsArray = [];
                                                    images.forEach((image) => {
                                                      const attachmentObj = {
                                                        src: getS3DomainURL(image),
                                                        name: `${image}`
                                                          .split('.')
                                                          .slice(0, -1)
                                                          .join('.'),
                                                        extension: `.${
                                                          `${image}`
                                                            .split('.')
                                                            .slice(-1)[0]
                                                        }`,
                                                      };
                                                      // console.log('attachmentObj', attachmentObj)
                                                      attachmentsArray.push(
                                                        attachmentObj
                                                      );
                                                    });

                                                    return attachmentsArray;
                                                  })(),
                                                });
                                              }}
                                              // src={getS3DomainURL(
                                              //   `${opitem[`option${opindex + 1}`].images}`.split(
                                              //     ','
                                              //   )
                                              // )}
                                              src={getS3DomainURL(imgitem)}
                                              alt={getS3DomainURL(
                                                `${opitem[`option${opindex + 1}`].images}`
                                              )}
                                              height='50px'
                                              width='75px'
                                            />
                                          )
                                        )}
                                    </li>
                                  )
                                )}
                            </ul>
                          </div>
                        </div>

                        <div className='row'>
                          <div className='col-12'>
                            <Button
                              type='primary'
                              className='th-br-4 mb-2'
                              onClick={() => {
                                toggleAnswer(qitem.id);
                              }}
                            >
                              {answerHidden?.includes(qitem.id)
                                ? 'Hide Answer'
                                : 'Show Answer'}
                            </Button>
                            {Array.isArray(qitem.question_answer[0].answer) &&
                              qitem.question_answer[0].answer.length > 0 &&
                              qitem.question_answer[0].answer.map((ansitem, ansindex) => (
                                <>
                                  {answerHidden?.includes(qitem.id) ? (
                                    <p
                                      className={`mb-1 ${item.name}q-${qindex + 1}`}
                                      id={`${item.name}q-${qindex + 1}`}
                                      key={ansindex}
                                    >
                                      {ansitem}
                                    </p>
                                  ) : null}
                                  {/* {ansitem} */}
                                  {/* {ansitem.split('')[ansitem.length-1]} */}
                                </>
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {qitem.question_type == 7 ? (
                      <div className='lp-question-box'>
                        <div className='row'>
                          <div className='col-12'>
                            <p className='text-right '>
                              {resolveQuestionTypeName(qitem.question_type)}
                            </p>
                          </div>
                          <div className='col-12'>
                            <p className='th-black th-fw-600 mb-0'>
                              Question {qindex + 1}
                            </p>
                            <p className='lp-question'>
                              {ReactHtmlParser(qitem.question_answer[0].question)}
                            </p>
                          </div>

                          <div className='col-12'>
                            {Array.isArray(qitem.sub_questions) &&
                              qitem.sub_questions.length > 0 &&
                              qitem.sub_questions.map((subitem, subindex) => (
                                <Collapse
                                  expandIcon={({ isActive }) => (
                                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                                  )}
                                  expandIconPosition='end'
                                  className='th-br-6 my-2 th-collapse th-question-collapse'
                                  style={{
                                    border: '0px solid #d9d9d9',
                                    backgroundColor: 'transparent',
                                  }}
                                >
                                  <Panel
                                    header={
                                      <div className='row'>
                                        <div className='th-black-1 px-0 col-12 pl-0'>
                                          <div className='row justify-content-between'>
                                            <span className='th-fw-500'>
                                              {resolveQuestionTypeName(
                                                subitem.question_type
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                    key={subindex + 1}
                                    className='site-collapse-custom-panel mb-2 th-br-8'
                                  >
                                    {subitem.question_type == 1 ||
                                    subitem.question_type == 2 ||
                                    subitem.question_type == 9 ? (
                                      // <div className='lp-sub-question-box'>
                                      //   <div className='row'>
                                      //     <div className='col-12'>
                                      //       <p className='th-black th-fw-600 mb-0'>
                                      //         Question {subindex + 1}
                                      //       </p>
                                      //       <p className='lp-question'>
                                      //         {ReactHtmlParser(
                                      //           subitem.question_answer[0].question
                                      //         )}
                                      //       </p>
                                      //     </div>
                                      //     <div className='col-12'>
                                      //       <p className='th-black th-fw-600 mb-0'>
                                      //         Options
                                      //       </p>
                                      //       <ul style={{ listStyle: 'none' }}>
                                      //         {Array.isArray(
                                      //           subitem.question_answer[0].options
                                      //         ) &&
                                      //           subitem.question_answer[0].options
                                      //             .length > 0 &&
                                      //           subitem.question_answer[0].options.map(
                                      //             (subopitem, subopindex) => (
                                      //               <li key={subopindex}>
                                      //                 <span className='pr-2'>
                                      //                   Option {subopindex + 1}.{' '}
                                      //                 </span>
                                      //                 {extractContent(
                                      //                   subopitem[
                                      //                     `option${subopindex + 1}`
                                      //                   ].optionValue
                                      //                 )}

                                      //                 {Array.isArray(
                                      //                   subopitem[
                                      //                     `option${subopindex + 1}`
                                      //                   ].images
                                      //                 ) &&
                                      //                   subopitem[
                                      //                     `option${subopindex + 1}`
                                      //                   ].images.map(
                                      //                     (imgitem, imgindex) => (
                                      //                       <img
                                      //                         onClick={() => {
                                      //                           openPreview({
                                      //                             currentAttachmentIndex:
                                      //                               imgindex,
                                      //                             attachmentsArray:
                                      //                               (() => {
                                      //                                 const images =
                                      //                                   `${
                                      //                                     subopitem[
                                      //                                       `option${
                                      //                                         subopindex +
                                      //                                         1
                                      //                                       }`
                                      //                                     ].images
                                      //                                   }`.split(',') ||
                                      //                                   {};
                                      //                                 const attachmentsArray =
                                      //                                   [];
                                      //                                 images.forEach(
                                      //                                   (image) => {
                                      //                                     const attachmentObj =
                                      //                                       {
                                      //                                         src: getS3DomainURL(
                                      //                                           image
                                      //                                         ),
                                      //                                         name: `${image}`
                                      //                                           .split(
                                      //                                             '.'
                                      //                                           )
                                      //                                           .slice(
                                      //                                             0,
                                      //                                             -1
                                      //                                           )
                                      //                                           .join(
                                      //                                             '.'
                                      //                                           ),
                                      //                                         extension: `.${
                                      //                                           `${image}`
                                      //                                             .split(
                                      //                                               '.'
                                      //                                             )
                                      //                                             .slice(
                                      //                                               -1
                                      //                                             )[0]
                                      //                                         }`,
                                      //                                       };
                                      //                                     // console.log('attachmentObj', attachmentObj)
                                      //                                     attachmentsArray.push(
                                      //                                       attachmentObj
                                      //                                     );
                                      //                                   }
                                      //                                 );

                                      //                                 return attachmentsArray;
                                      //                               })(),
                                      //                           });
                                      //                         }}
                                      //                         src={getS3DomainURL(
                                      //                           imgitem
                                      //                         )}
                                      //                         alt={getS3DomainURL(
                                      //                           `${
                                      //                             subopitem[
                                      //                               `option${
                                      //                                 subopindex + 1
                                      //                               }`
                                      //                             ].images
                                      //                           }`
                                      //                         )}
                                      //                         height='50px'
                                      //                         width='75px'
                                      //                       />
                                      //                     )
                                      //                   )}
                                      //               </li>
                                      //             )
                                      //           )}
                                      //       </ul>
                                      //     </div>
                                      //   </div>

                                      //   <div className='row'>
                                      //     <div className='col-12'>
                                      //       <Button
                                      //         type='primary'
                                      //         className='th-br-4 mb-2'
                                      //         onClick={() => {
                                      //           toggleAnswer(subitem.id);
                                      //         }}
                                      //       >
                                      //         {answerHidden?.includes(subitem.id)
                                      //           ? 'Hide Answer'
                                      //           : 'Show Answer'}
                                      //       </Button>
                                      //       {Array.isArray(
                                      //         subitem.question_answer[0].answer
                                      //       ) &&
                                      //         subitem.question_answer[0].answer.length >
                                      //           0 &&
                                      //         subitem.question_answer[0].answer.map(
                                      //           (subansitem, subansindex) => (
                                      //             <>
                                      //               {answerHidden?.includes(
                                      //                 subitem.id
                                      //               ) ? (
                                      //                 <p
                                      //                   className={`mb-1 ${item.name}q-${
                                      //                     qindex + 1
                                      //                   }`}
                                      //                   id={`${item.name}q-${qindex + 1}`}
                                      //                   key={subansindex}
                                      //                 >
                                      //                   {subansitem}
                                      //                 </p>
                                      //               ) : null}
                                      //             </>
                                      //           )
                                      //         )}
                                      //     </div>
                                      //   </div>
                                      // </div>
                                      <>
                                      <div className='mcq-container'>
                                        <div className='question-container'>
                                          <div>
                                            {subitem.question_type === 1
                                              ? 'MCQ SINGLE'
                                              : 'MCQ MULTI'}
                                          </div>
                                          <div style={{ color: '#014B7E' }}>
                                            <span style={{ color: 'red', fontSize: 16 }}>
                                              {`Q${index + 1}`}:{' '}
                                            </span>{' '}
                                            {ReactHtmlParser(
                                              subitem.question_answer[0].question
                                            )}
                                          </div>
                                        </div>
                                        <div className='resourceBulkDownload'>Answers</div>
                                        <div className='question-container'>
                                          {subitem?.question_answer[0]?.answer.map(
                                            (obj, i) => (
                                              <div>{obj}</div>
                                            )
                                          )}
                                        </div>
                                        <div className='resourceBulkDownload'>Options</div>
                                        <div>
                                          {subitem?.question_answer[0]?.options.map(
                                            (obj, i) => (
                                              <div className='question-container'>
                                                {`OPTION${i + 1}:   ${
                                                  obj[`option${i + 1}`].optionValue
                                                }`}
                                                {`${obj[`option${i + 1}`].images}`.length > 0 && (
                                                  <div>
                                                    <a
                                                      onClick={() => {
                                                        openPreview({
                                                          currentAttachmentIndex: 0,
                                                          attachmentsArray: (() => {
                                                            const images =
                                                              `${obj[`option${i + 1}`].images}`.split(
                                                                ','
                                                              ) || {};
                                                            const attachmentsArray = [];
                                                            images.forEach((image) => {
                                                              const attachmentObj = {
                                                                src: getS3DomainURL(image),
                                                                name: `${image}`
                                                                  .split('.')
                                                                  .slice(0, -1)
                                                                  .join('.'),
                                                                extension: `.${
                                                                  `${image}`.split('.').slice(-1)[0]
                                                                }`,
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
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </>
                                    ) : null}

                                    {subitem.question_type == 8 ? (
                                      <div className='lp-question-box'>
                                        <div className='row'>
                                          <div className='col-12'>
                                            <p className='th-black th-fw-600 mb-0'>
                                              Question {subindex + 1}
                                            </p>
                                            <p className='lp-question'>
                                              {ReactHtmlParser(
                                                subitem.question_answer[0].question
                                              )}
                                            </p>
                                          </div>
                                          <div className='col-12'>
                                            <p className='th-black th-fw-600 mb-0'>
                                              Options
                                            </p>
                                            <ul style={{ listStyle: 'none' }}>
                                              {Array.isArray(
                                                subitem.question_answer[0].options
                                              ) &&
                                                subitem.question_answer[0].options
                                                  .length > 0 &&
                                                subitem.question_answer[0].options.map(
                                                  (opitem, opindex) => (
                                                    <li key={opindex}>
                                                      <span className='pr-2'>
                                                        Option {opindex + 1}.{' '}
                                                      </span>
                                                      {opitem[`option${opindex + 1}`]
                                                        .optionValue === true ||
                                                      opitem[`option${opindex + 1}`]
                                                        .optionValue === 'True' ||
                                                      opitem[`option${opindex + 1}`]
                                                        .optionValue === 'true'
                                                        ? 'True'
                                                        : 'False'}

                                                      {Array.isArray(
                                                        opitem[`option${opindex + 1}`]
                                                          .images
                                                      ) &&
                                                        opitem[
                                                          `option${opindex + 1}`
                                                        ].images.map(
                                                          (imgitem, imgindex) => (
                                                            <img
                                                              onClick={() => {
                                                                openPreview({
                                                                  currentAttachmentIndex:
                                                                    imgindex,
                                                                  attachmentsArray:
                                                                    (() => {
                                                                      const images =
                                                                        `${
                                                                          opitem[
                                                                            `option${
                                                                              opindex + 1
                                                                            }`
                                                                          ].images
                                                                        }`.split(',') ||
                                                                        {};
                                                                      const attachmentsArray =
                                                                        [];
                                                                      images.forEach(
                                                                        (image) => {
                                                                          const attachmentObj =
                                                                            {
                                                                              src: getS3DomainURL(
                                                                                image
                                                                              ),
                                                                              name: `${image}`
                                                                                .split(
                                                                                  '.'
                                                                                )
                                                                                .slice(
                                                                                  0,
                                                                                  -1
                                                                                )
                                                                                .join(
                                                                                  '.'
                                                                                ),
                                                                              extension: `.${
                                                                                `${image}`
                                                                                  .split(
                                                                                    '.'
                                                                                  )
                                                                                  .slice(
                                                                                    -1
                                                                                  )[0]
                                                                              }`,
                                                                            };
                                                                          // console.log('attachmentObj', attachmentObj)
                                                                          attachmentsArray.push(
                                                                            attachmentObj
                                                                          );
                                                                        }
                                                                      );

                                                                      return attachmentsArray;
                                                                    })(),
                                                                });
                                                              }}
                                                              src={getS3DomainURL(
                                                                imgitem
                                                              )}
                                                              alt={getS3DomainURL(
                                                                `${
                                                                  opitem[
                                                                    `option${opindex + 1}`
                                                                  ].images
                                                                }`
                                                              )}
                                                              height='50px'
                                                              width='75px'
                                                            />
                                                          )
                                                        )}
                                                    </li>
                                                  )
                                                )}
                                            </ul>
                                          </div>
                                        </div>

                                        <div className='row'>
                                          <div className='col-12'>
                                            <Button
                                              type='primary'
                                              className='th-br-4 mb-2'
                                              onClick={() => {
                                                toggleAnswer(subitem.id);
                                              }}
                                            >
                                              {answerHidden?.includes(subitem.id)
                                                ? 'Hide Answer'
                                                : 'Show Answer'}
                                            </Button>
                                            {Array.isArray(
                                              subitem.question_answer[0].answer
                                            ) &&
                                              subitem.question_answer[0].answer.length >
                                                0 &&
                                              subitem.question_answer[0].answer.map(
                                                (ansitem, ansindex) => (
                                                  <>
                                                    {/* <p
                                                      className={`mb-1 ${item.name}subq-${
                                                        subindex + 1
                                                      }`}
                                                      id={`${item.name}subq-${
                                                        subindex + 1
                                                      }`}
                                                      style={{ display: 'none' }}
                                                      key={ansindex}
                                                    >
                                                      {ansitem}
                                                    </p> */}

                                                    {answerHidden?.includes(
                                                      subitem.id
                                                    ) ? (
                                                      <p
                                                        className={`mb-1 ${
                                                          item.name
                                                        }subq-${subindex + 1}`}
                                                        id={`${item.name}subq-${
                                                          subindex + 1
                                                        }`}
                                                        key={ansindex}
                                                      >
                                                        {ansitem}
                                                      </p>
                                                    ) : null}
                                                  </>
                                                )
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                    ) : null}

                                    {subitem.question_type == 10 ? (
                                      <div className='lp-question-box'>
                                        <div className='row'>
                                          <div className='col-12'>
                                            <p className='text-right '>
                                              {resolveQuestionTypeName(
                                                subitem.question_type
                                              )}
                                            </p>
                                          </div>
                                          <div className='col-12'>
                                            <p className='th-black th-fw-600 mb-0'>
                                              Question {subindex + 1}
                                            </p>
                                            <p className='lp-question'>
                                              {ReactHtmlParser(
                                                subitem.question_answer[0].question
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                        <div className='row'>
                                          <div className='col-12'>
                                            <Button
                                              type='primary'
                                              className='th-br-4 mb-2'
                                              onClick={() => {
                                                toggleAnswer(subitem.id);
                                              }}
                                            >
                                              {answerHidden?.includes(subitem.id)
                                                ? 'Hide Answer'
                                                : 'Show Answer'}
                                            </Button>

                                            {answerHidden?.includes(subitem.id) ? (
                                              <p
                                                className={`mb-1 ${item.name}q-${
                                                  subindex + 1
                                                } lp-question`}
                                                id={`${item.name}q-${subindex + 1}`}
                                              >
                                                {ReactHtmlParser(
                                                  subitem.question_answer[0].answer
                                                )}
                                              </p>
                                            ) : null}
                                          </div>
                                        </div>
                                      </div>
                                    ) : null}
                                  </Panel>
                                </Collapse>
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {qitem.question_type == 8 ? (
                      <div className='lp-question-box'>
                        <div className='row'>
                          <div className='col-12'>
                            <p className='text-right '>
                              {resolveQuestionTypeName(qitem.question_type)}
                            </p>
                          </div>
                          <div className='col-12'>
                            <p className='th-black th-fw-600 mb-0'>
                              Question {qindex + 1}
                            </p>
                            <p className='lp-question'>
                              {ReactHtmlParser(qitem.question_answer[0].question)}
                            </p>
                          </div>
                          <div className='col-12'>
                            <p className='th-black th-fw-600 mb-0'>Options</p>
                            <ul style={{ listStyle: 'none' }}>
                              {Array.isArray(qitem.question_answer[0].options) &&
                                qitem.question_answer[0].options.length > 0 &&
                                qitem.question_answer[0].options.map(
                                  (opitem, opindex) => (
                                    <li key={opindex}>
                                      <span className='pr-2'>Option {opindex + 1}. </span>
                                      {opitem[`option${opindex + 1}`].optionValue ===
                                        true ||
                                      opitem[`option${opindex + 1}`].optionValue ===
                                        'True' ||
                                      opitem[`option${opindex + 1}`].optionValue ===
                                        'true'
                                        ? 'True'
                                        : 'False'}

                                      {Array.isArray(
                                        opitem[`option${opindex + 1}`].images
                                      ) &&
                                        opitem[`option${opindex + 1}`].images.map(
                                          (imgitem, imgindex) => (
                                            <img
                                              onClick={() => {
                                                openPreview({
                                                  currentAttachmentIndex: imgindex,
                                                  attachmentsArray: (() => {
                                                    const images =
                                                      `${
                                                        opitem[`option${opindex + 1}`]
                                                          .images
                                                      }`.split(',') || {};
                                                    const attachmentsArray = [];
                                                    images.forEach((image) => {
                                                      const attachmentObj = {
                                                        src: getS3DomainURL(image),
                                                        name: `${image}`
                                                          .split('.')
                                                          .slice(0, -1)
                                                          .join('.'),
                                                        extension: `.${
                                                          `${image}`
                                                            .split('.')
                                                            .slice(-1)[0]
                                                        }`,
                                                      };
                                                      attachmentsArray.push(
                                                        attachmentObj
                                                      );
                                                    });

                                                    return attachmentsArray;
                                                  })(),
                                                });
                                              }}
                                              src={getS3DomainURL(imgitem)}
                                              alt={getS3DomainURL(
                                                `${opitem[`option${opindex + 1}`].images}`
                                              )}
                                              height='50px'
                                              width='75px'
                                            />
                                          )
                                        )}
                                    </li>
                                  )
                                )}
                            </ul>
                          </div>
                        </div>

                        <div className='row'>
                          <div className='col-12'>
                            <Button
                              type='primary'
                              className='th-br-4 mb-2'
                              onClick={() => {
                                toggleAnswer(qitem.id);
                              }}
                              id={`${item.name}btn-${qindex + 1}`}
                            >
                              {answerHidden?.includes(qitem.id)
                                ? 'Hide Answer'
                                : 'Show Answer'}
                            </Button>
                            {Array.isArray(qitem.question_answer[0].answer) &&
                              qitem.question_answer[0].answer.length > 0 &&
                              qitem.question_answer[0].answer.map((ansitem, ansindex) => (
                                <>
                                  {answerHidden?.includes(qitem.id) ? (
                                    <p
                                      className={`mb-1 ${item.name}q-${qindex + 1}`}
                                      id={`${item.name}q-${qindex + 1}`}
                                      key={ansindex}
                                    >
                                      {ansitem}
                                    </p>
                                  ) : null}
                                </>
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {qitem.question_type == 10 ? (
                      <div className='lp-question-box'>
                        <div className='row'>
                          <div className='col-12'>
                            <p className='text-right '>
                              {resolveQuestionTypeName(qitem.question_type)}
                            </p>
                          </div>
                          <div className='col-12'>
                            <p className='th-black th-fw-600 mb-0'>
                              Question {qindex + 1}
                            </p>
                            <p className='lp-question'>
                              {ReactHtmlParser(qitem.question_answer[0].question)}
                            </p>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-12'>
                            <Button
                              type='primary'
                              className='th-br-4 mb-2'
                              // onClick={() => showAnswer(`${item.name}q-${qindex + 1}`)}
                              onClick={() => {
                                toggleAnswer(qitem.id);
                              }}
                            >
                              {answerHidden?.includes(qitem.id)
                                ? 'Hide Answer'
                                : 'Show Answer'}
                            </Button>
                            <p
                              className={`mb-1 ${item.name}q-${qindex + 1} lp-question`}
                              id={`${item.name}q-${qindex + 1}`}
                            >
                              {answerHidden?.includes(qitem.id) ? (
                                <>{ReactHtmlParser(qitem.question_answer[0].answer)}</>
                              ) : null}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                ))}
            </Panel>
          ))}
      </Collapse>
    </>
  );
};

export default QuestionPaperView;
