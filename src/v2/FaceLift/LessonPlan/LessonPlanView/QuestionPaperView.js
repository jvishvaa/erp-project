import React from 'react';
import { Button, Collapse, Divider } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import ReactHtmlParser from 'react-html-parser';
import endpoints from 'v2/config/endpoints';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
const { Panel } = Collapse;

const QuestionPaperView = ({ questionData }) => {
  console.log({ questionData });

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

  const extractContent = (s) => {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };

  const showAnswer = (id) => {
    console.log(id);
    let element = document.getElementsByClassName(id);
    console.log(element);
    for (var i = 0; i < element.length; i++) {
      element[i].style.display = 'block';
    }
  };

  const getS3DomainURL = (fileSrc) => {
    return `${endpoints.lessonPlan.bucket}/${fileSrc}`;
  };

  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};

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
                              onClick={() => showAnswer(`${item.name}q-${qindex + 1}`)}
                            >
                              Show Answer
                            </Button>
                            {Array.isArray(qitem.question_answer[0].answer) &&
                              qitem.question_answer[0].answer.length > 0 &&
                              qitem.question_answer[0].answer.map((ansitem, ansindex) => (
                                <>
                                  <p
                                    className={`mb-1 ${item.name}q-${qindex + 1}`}
                                    id={`${item.name}q-${qindex + 1}`}
                                    style={{ display: 'none' }}
                                    key={ansindex}
                                  >
                                    {ansitem}
                                  </p>
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
                                      <div className='lp-sub-question-box'>
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
                                                  (subopitem, subopindex) => (
                                                    <li key={subopindex}>
                                                      <span className='pr-2'>
                                                        Option {subopindex + 1}.{' '}
                                                      </span>
                                                      {extractContent(
                                                        subopitem[
                                                          `option${subopindex + 1}`
                                                        ].optionValue
                                                      )}

                                                      {Array.isArray(
                                                        subopitem[
                                                          `option${subopindex + 1}`
                                                        ].images
                                                      ) &&
                                                        subopitem[
                                                          `option${subopindex + 1}`
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
                                                                          subopitem[
                                                                            `option${
                                                                              subopindex +
                                                                              1
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
                                                                  subopitem[
                                                                    `option${
                                                                      subopindex + 1
                                                                    }`
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
                                              onClick={() =>
                                                showAnswer(`${item.name}q-${qindex + 1}`)
                                              }
                                            >
                                              Show Answer
                                            </Button>
                                            {Array.isArray(
                                              subitem.question_answer[0].answer
                                            ) &&
                                              subitem.question_answer[0].answer.length >
                                                0 &&
                                              subitem.question_answer[0].answer.map(
                                                (subansitem, subansindex) => (
                                                  <>
                                                    <p
                                                      className={`mb-1 ${item.name}q-${
                                                        qindex + 1
                                                      }`}
                                                      id={`${item.name}q-${qindex + 1}`}
                                                      style={{ display: 'none' }}
                                                      key={subansindex}
                                                    >
                                                      {subansitem}
                                                    </p>
                                                  </>
                                                )
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                    ) : null}

                                    {subitem.question_type == 8 ? (
                                      <div className='lp-question-box'>
                                        <div className='row'>
                                          {/* <div className='col-12'>
                                            <p className='text-right '>
                                              {resolveQuestionTypeName(
                                                subitem.question_type
                                              )}
                                            </p>
                                          </div> */}
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
                                              onClick={() =>
                                                showAnswer(
                                                  `${item.name}subq-${subindex + 1}`
                                                )
                                              }
                                            >
                                              Show Answer
                                            </Button>
                                            {Array.isArray(
                                              subitem.question_answer[0].answer
                                            ) &&
                                              subitem.question_answer[0].answer.length >
                                                0 &&
                                              subitem.question_answer[0].answer.map(
                                                (ansitem, ansindex) => (
                                                  <>
                                                    <p
                                                      className={`mb-1 ${item.name}subq-${subindex + 1}`}
                                                      id={`${item.name}subq-${subindex + 1}`}
                                                      style={{ display: 'none' }}
                                                      key={ansindex}
                                                    >
                                                      {ansitem}
                                                    </p>
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
                                              onClick={() =>
                                                showAnswer(
                                                  `${item.name}q-${subindex + 1}`
                                                )
                                              }
                                            >
                                              Show Answer
                                            </Button>
                                            <p
                                              className={`mb-1 ${item.name}q-${
                                                subindex + 1
                                              } lp-question`}
                                              id={`${item.name}q-${subindex + 1}`}
                                              style={{ display: 'none' }}
                                            >
                                              {ReactHtmlParser(
                                                subitem.question_answer[0].answer
                                              )}
                                            </p>
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
                                      {/* {extractContent(opitem[`option${opindex + 1}`].optionValue) === true || extractContent(opitem[`option${opindex + 1}`].optionValue) == "True" ? "True" : "False"} */}

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
                              onClick={() => showAnswer(`${item.name}q-${qindex + 1}`)}
                            >
                              Show Answer
                            </Button>
                            {Array.isArray(qitem.question_answer[0].answer) &&
                              qitem.question_answer[0].answer.length > 0 &&
                              qitem.question_answer[0].answer.map((ansitem, ansindex) => (
                                <>
                                  <p
                                    className={`mb-1 ${item.name}q-${qindex + 1}`}
                                    id={`${item.name}q-${qindex + 1}`}
                                    style={{ display: 'none' }}
                                    key={ansindex}
                                  >
                                    {ansitem}
                                  </p>
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
                              onClick={() => showAnswer(`${item.name}q-${qindex + 1}`)}
                            >
                              Show Answer
                            </Button>
                            <p
                              className={`mb-1 ${item.name}q-${qindex + 1} lp-question`}
                              id={`${item.name}q-${qindex + 1}`}
                              style={{ display: 'none' }}
                            >
                              {ReactHtmlParser(qitem.question_answer[0].answer)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                ))}
            </Panel>
          ))}
        {/* 
        <Panel
          header={
            <div className='row'>
              <div className='th-black-1 px-0 col-12 pl-0'>
                <div className='row justify-content-between'>
                  <span className='th-fw-500'>Section</span>
                </div>
              </div>
            </div>
          }
          key='2'
          className='site-collapse-custom-panel mb-2 th-br-8'
        >
          {Array.isArray([1, 2]) &&
            [1, 2].length > 0 &&
            [1, 2].map((item, index) => (
              <div className='lp-question-box'>
                <div className='row'>
                  <div className='col-12'>
                    <p className='text-right'>{resolveQuestionTypeName(8)}</p>
                  </div>
                  <div className='col-12'>
                    <p className='th-black th-fw-600 mb-0'>Question 1</p>
                    <p className=''>
                      Identifies and describes shapes learnt Identifies and describes
                      shapes learnt Identifies and describes shapes learnt Identifies and
                      describes shapes learnt
                    </p>
                  </div>
                  <div className='col-12'>
                    <p className='th-black th-fw-600 mb-0'>Options</p>
                    <ul style={{ listStyle: 'none' }}>
                      <li>
                        <span className='pr-2'>Option 1. </span> True
                      </li>
                      <li>
                        <span className='pr-2'>Option 2. </span> False
                      </li>
                    </ul>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12'>
                    <Button type='primary' className='th-br-4'>
                      Show Answer
                    </Button>
                    <p className='mt-3' style={{ display: 'none' }}>
                      Option 4
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </Panel> */}

        {/* 
        <Panel
          header={
            <div className='row'>
              <div className='th-black-1 px-0 col-12 pl-0'>
                <div className='row justify-content-between'>
                  <span className='th-fw-500'>Section</span>
                </div>
              </div>
            </div>
          }
          key='3'
          className='site-collapse-custom-panel mb-2 th-br-8'
          style={{
            borderWidth: 3,
            borderStyle: 'solid',
            borderColor: '#f8f8f8',
            borderBottomWidth: 3,
          }}
        >
          {Array.isArray([1, 2]) &&
            [1, 2].length > 0 &&
            [1, 2].map((item, index) => (
              <div className='lp-question-box'>
                <div className='row'>
                  <div className='col-12'>
                    <p className='text-right'>{resolveQuestionTypeName(7)}</p>
                  </div>
                  <div className='col-12'>
                    <p className='th-black th-fw-600 mb-0'>Question {index + 1}</p>
                    <p className=''>
                      Identifies and describes shapes learnt Identifies and describes
                      shapes learnt Identifies and describes shapes learnt Identifies and
                      describes shapes learnt
                    </p>
                  </div>
                  <div className='col-12'>
                    {Array.isArray([1, 2]) &&
                      [1, 2].length > 0 &&
                      [1, 2].map((item, index) => (
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
                                      {resolveQuestionTypeName(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            }
                            key={index + 1}
                            className='site-collapse-custom-panel mb-2 th-br-8'
                          >
                            <div className='lp-sub-question-box'>
                              <div className='row'>
                                <div className='col-12'>
                                  <p className='th-black th-fw-600 mb-0'>
                                    Question {index + 1}
                                  </p>
                                  <p className=''>
                                    Identifies and describes shapes learnt Identifies and
                                    describes shapes learnt Identifies and describes
                                    shapes learnt Identifies and describes shapes learnt
                                  </p>
                                </div>
                                <div className='col-12'>
                                  <p className='th-black th-fw-600 mb-0'>Options</p>
                                  <ul style={{ listStyle: 'none' }}>
                                    <li>
                                      <span className='pr-2'>Option 1. </span>{' '}
                                      Identification of notes and coins
                                    </li>
                                    <li>
                                      <span className='pr-2'>Option 2. </span>{' '}
                                      Identification of notes and coins
                                    </li>
                                    <li>
                                      <span className='pr-2'>Option 3. </span>{' '}
                                      Identification of notes and coins
                                    </li>
                                    <li>
                                      <span className='pr-2'>Option 4. </span>{' '}
                                      Identification of notes and coins
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className='row'>
                                <div className='col-12'>
                                  <Button type='primary' className='th-br-4'>
                                    Show Answer
                                  </Button>
                                  <p className='mt-3' style={{ display: 'none' }}>
                                    Option 4
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Panel>
                        </Collapse>
                      ))}
                  </div>
                </div>
              </div>
            ))}
        </Panel> */}
      </Collapse>
    </>
  );
};

export default QuestionPaperView;
