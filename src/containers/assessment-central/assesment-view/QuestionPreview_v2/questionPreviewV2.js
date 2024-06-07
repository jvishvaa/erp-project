import React, { useEffect, useRef } from 'react';
import { Table, Typography, Divider, Grid, Row, Col } from 'antd';
import moment from 'moment';
import OrchidsLogo from '../../../../assets/images/orchidsLogo1.png';
import { getArrayValues } from '../../../../utility-functions';
import endpoints from '../../../../config/endpoints';
import './previewStyle.scss';
import QuestionView from './questionView';

const QuestionPreview_V2 = React.forwardRef(
  (
    {
      classes,
      templateFrom,
      currentStep,
      isPrint,
      isQuestionPaper,
      printWithID,
      schoolData,
    },
    ref
  ) => {
    const contentRef = useRef();
    const printContainerRef = useRef(null);

    useEffect(() => {
      const handleBeforePrint = () => {
        const content = contentRef.current;
        const elements = content.querySelectorAll('.check-break');
        const printContainer = printContainerRef.current;
        elements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          // if (rect.bottom > window.innerHeight) {
          if (rect.bottom > printContainer.scrollHeight) {
            element.classList.add('force-page-break');
          }
        });
      };
      window.addEventListener('beforeprint', handleBeforePrint);
      return () => {
        window.removeEventListener('beforeprint', handleBeforePrint);
      };
    }, []);

    useEffect(() => {
      const addPageNumbers = () => {
        const printContainer = printContainerRef.current;
        const totalPages = Math.ceil(printContainer.scrollHeight / 1400);
        // console.log(
        //   totalPages,
        //   printContainer.scrollHeight / 1400,
        //   1400,
        //   'printContainer'
        // );
        for (let i = 1; i <= totalPages; i++) {
          const pageNumberDiv = document.createElement('div');
          const pageNumber = document.createTextNode(`Page ${i}`);
          pageNumberDiv.style.position = 'absolute';
          if (i === 1) {
            pageNumberDiv.style.top = `calc(${i} * (378mm))`;
          } else if (i > 1 && i <= 4) {
            pageNumberDiv.style.top = `calc(${i} * (378mm + ${i + 1}mm))`;
          } else if (i > 4 && i < 6) {
            pageNumberDiv.style.top = `calc(${i} * (378mm + ${i}mm))`;
          } else if (i === 6) {
            pageNumberDiv.style.top = `calc(${i} * (378mm + ${i - 1}mm))`;
          } else if (i === 7) {
            pageNumberDiv.style.top = `calc(${i} * (378mm + ${i - 1.5}mm))`;
          } else if (i === 8) {
            pageNumberDiv.style.top = `calc(${i} * (378mm + ${i - 2.5}mm))`;
          } else if (i === 9) {
            pageNumberDiv.style.top = `calc(${i} * (378mm + ${i - 3.5}mm))`;
          } else if (i === 10) {
            pageNumberDiv.style.top = `calc(${i} * (378mm + ${i - 4}mm))`;
          } else {
            pageNumberDiv.style.top = `calc(${i} * (378mm + ${i - (i - 6)}mm))`;
          }
          pageNumberDiv.style.height = '16px';
          pageNumberDiv.appendChild(pageNumber);
          printContainer.appendChild(pageNumberDiv);
          pageNumberDiv.style.left = `calc(100% - (${pageNumberDiv.offsetWidth}px + 40px))`;
        }
      };

      if (isPrint) {
        addPageNumbers();
      }
    }, [isPrint]);

    return (
      <div ref={ref}>
        <div ref={printContainerRef} className='container border p-1 print-container'>
          {/* <div> */}
          <div className='row bg-light p-2'>
            <div className='col-6 d-flex align-items-center'>
              <div className='mr-3 bg-white br-10 rounded-6'>
                <img
                  src={schoolData?.school_logo}
                  alt='OrchidsLogo'
                  className='rounded-6 image'
                  style={{ width: '80px', height: '80px' }}
                />
              </div>
              <div>
                <div className='school-name'>{schoolData?.school_name}</div>
                <div className='text-muted'>Powered By Eduvate</div>
              </div>
            </div>
            <div className='col-6 d-flex flex-column align-items-end'>
              <div className='p-2 rounded mb-2 w-75 d-flex bg-custom'>
                <div>Name:</div>
              </div>
              <div className='p-2 rounded mb-2 w-75 d-flex bg-custom'>
                <div>ERP:</div>
              </div>
            </div>
          </div>
          <div className='row p-2 mb-3 pl-4 pr-4 justify-content-between bg-custom border-bottom-custom'>
            <div className='d-flex flex-row'>
              <div className='font-weight-bold'> {templateFrom?.grade?.grade_name}</div>
            </div>
            <div className='d-flex flex-row'>
              <div className='font-weight-bold mr-1'>Subject:</div>
              <div>{templateFrom?.subject?.subject?.subject_name}</div>
            </div>
            <div className='d-flex flex-row'>
              <div className='font-weight-bold mr-1'>Duration:</div>
              <div>{templateFrom?.duration} Min</div>
            </div>
            <div className='d-flex flex-row'>
              <div className='font-weight-bold mr-1'>Total Marks:</div>
              <div> {templateFrom?.total_marks}</div>
            </div>
          </div>
          <div className='mb-1 rounded d-flex flex-column align-items-center pl-4 pr-4 p-1'>
            <div className='font-weight-bold title-cutom '>{templateFrom?.title}</div>
          </div>
          <div className='mb-1 rounded d-flex flex-column pl-4 pr-4 p-1 bg-custom'>
            <div className='font-weight-bold'>General Instructions</div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{templateFrom?.instruction}</p>
          </div>
          {currentStep > 1 &&
            templateFrom?.section?.map((eachSection, sectionIndex) => {
              const sectionTotalMarks = eachSection.question.reduce(
                (total, question) => total + parseFloat(question.marks || 0),
                0
              );
              const sectionQuestion = Math.ceil(
                sectionTotalMarks / eachSection?.totalQuestion
              );
              console.log(templateFrom?.section, 'templateFrom?.section');
              return (
                <div className='p-3'>
                  <div
                    className='py-2 px-4 rounded bg-custom check-break section-container'
                    ref={contentRef}
                  >
                    <div className='d-flex align-items-center'>
                      <div className='font-weight-bold bold text-center flex-fill ml-5'>
                        {eachSection?.header.replace(/\d+/, (match) =>
                          String.fromCharCode(64 + parseInt(match))
                        )}
                      </div>
                      <div className='font-weight-bold section-mark'>
                        {eachSection?.totalQuestion && sectionQuestion
                          ? `Marks: ${eachSection?.totalQuestion} × ${sectionQuestion}M = ${sectionTotalMarks}M`
                          : '0M'}
                      </div>
                    </div>
                    <div>{eachSection?.description}</div>
                  </div>
                  {eachSection?.question?.map((eachQuestion, index) => {
                    return (
                      <>
                        <div className='p-2'>
                          <div
                            className='d-flex justify-content-between mb-1'
                            style={{ width: '100%' }}
                          >
                            <div className='d-flex' style={{ width: '80%' }}>
                              <div className='mr-2'>
                                {index +
                                  1 +
                                  (sectionIndex > 0
                                    ? templateFrom?.section
                                        ?.slice(0, sectionIndex)
                                        ?.map((each) => each.question)
                                        ?.flat()?.length
                                    : 0)}
                                .
                              </div>
                              <div>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: eachQuestion?.question?.question_answer
                                      ?.length
                                      ? eachQuestion?.question?.question_answer[0]
                                          ?.question
                                      : null,
                                  }}
                                  className='pl-1 align-self-center generated-question-div question-custom check-break mb-1'
                                />
                                {printWithID ? (
                                  <div className='mb-2 mt-0'>{`(Question ID = ${eachQuestion?.question?.id} )`}</div>
                                ) : null}
                              </div>
                              {/* <div>
                                {printWithID ? (
                                  <div className='ml-15'>{`(Question ID = ${eachQuestion?.question?.id} )`}</div>
                                ) : null}
                              </div> */}
                            </div>

                            <div
                              className='th-marks-info text-right'
                              style={{ width: '20%' }}
                            >{`${eachQuestion?.marks} marks`}</div>
                          </div>
                          {eachQuestion?.question?.question_type_name !==
                          'Fill in the Blanks' ? (
                            eachQuestion?.question?.question_answer?.length &&
                            eachQuestion?.question?.question_answer[0]?.options &&
                            eachQuestion?.question?.question_answer[0]?.options
                              ?.length ? (
                              <>
                                {eachQuestion?.question?.question_answer?.length ? (
                                  <div className='container ml-4'>
                                    {eachQuestion?.question?.question_answer[0]?.options?.map(
                                      (eachOption, index) => {
                                        if (index % 2 === 0) {
                                          return (
                                            <div
                                              className='row mb-2 check-break'
                                              key={index}
                                            >
                                              <div className='col-6 option-container row check-break'>
                                                <div className='row'>
                                                  <div className='font-size-12 mr-1'>
                                                    {String.fromCharCode(
                                                      65 + index
                                                    )?.toLowerCase()}
                                                    .
                                                  </div>
                                                  <div className='font-size-12'>
                                                    {eachOption[`option${index + 1}`]
                                                      ?.title
                                                      ? eachOption[`option${index + 1}`]
                                                          ?.title
                                                      : ![undefined, null].includes(
                                                          eachOption[`option${index + 1}`]
                                                            ?.optionValue
                                                        )
                                                      ? typeof eachOption[
                                                          `option${index + 1}`
                                                        ]?.optionValue === 'string'
                                                        ? eachOption[`option${index + 1}`]
                                                            ?.optionValue
                                                        : eachOption[
                                                            `option${index + 1}`
                                                          ]?.optionValue.toString()
                                                      : null}
                                                  </div>
                                                </div>
                                                <div className='option-image-container'>
                                                  {/* <div
                                                  style={{
                                                    marginTop:
                                                      eachOption[`option${index + 1}`]
                                                        ?.images?.length > 0
                                                        ? '5px'
                                                        : '',
                                                  }}
                                                > */}
                                                  {eachOption[`option${index + 1}`]
                                                    ?.images?.length
                                                    ? eachOption[
                                                        `option${index + 1}`
                                                      ]?.images?.map(
                                                        (eachImage, indexImage) => (
                                                          <img
                                                            src={endpoints.s3 + eachImage}
                                                            alt='option image'
                                                            // height={150}
                                                            // width={200}
                                                            className='p-3'
                                                            key={indexImage}
                                                            style={{
                                                              maxHeight: '150px',
                                                              maxWidth: '200px',
                                                            }}
                                                          />
                                                        )
                                                      )
                                                    : null}
                                                </div>
                                              </div>
                                              {index + 1 <
                                                eachQuestion?.question?.question_answer[0]
                                                  ?.options?.length && (
                                                <div className='col-6 option-container row check-break'>
                                                  <div className='row'>
                                                    <div className='font-size-12 mr-1'>
                                                      {String.fromCharCode(
                                                        65 + index + 1
                                                      )?.toLowerCase()}
                                                      .
                                                    </div>
                                                    <div className='font-size-12'>
                                                      {eachQuestion?.question
                                                        ?.question_answer[0]?.options[
                                                        index + 1
                                                      ][`option${index + 2}`]?.title
                                                        ? eachQuestion?.question
                                                            ?.question_answer[0]?.options[
                                                            index + 1
                                                          ][`option${index + 2}`]?.title
                                                        : ![undefined, null].includes(
                                                            eachQuestion?.question
                                                              ?.question_answer[0]
                                                              ?.options[index + 1][
                                                              `option${index + 2}`
                                                            ]?.optionValue
                                                          )
                                                        ? typeof eachQuestion?.question
                                                            ?.question_answer[0]?.options[
                                                            index + 1
                                                          ][`option${index + 2}`]
                                                            ?.optionValue === 'string'
                                                          ? eachQuestion?.question
                                                              ?.question_answer[0]
                                                              ?.options[index + 1][
                                                              `option${index + 2}`
                                                            ]?.optionValue
                                                          : eachQuestion?.question?.question_answer[0]?.options[
                                                              index + 1
                                                            ][
                                                              `option${index + 2}`
                                                            ]?.optionValue.toString()
                                                        : null}
                                                    </div>
                                                  </div>
                                                  <div className='option-image-container'>
                                                    {eachQuestion?.question
                                                      ?.question_answer[0]?.options[
                                                      index + 1
                                                    ][`option${index + 2}`]?.images
                                                      ?.length
                                                      ? eachQuestion?.question?.question_answer[0]?.options[
                                                          index + 1
                                                        ][
                                                          `option${index + 2}`
                                                        ]?.images.map(
                                                          (eachImage, indexImage) => (
                                                            <img
                                                              src={
                                                                endpoints.s3 + eachImage
                                                              }
                                                              alt='option image'
                                                              // height={150}
                                                              // width={200}
                                                              className='p-2 check-break'
                                                              key={indexImage}
                                                              style={{
                                                                maxHeight: '150px',
                                                                maxWidth: '200px',
                                                              }}
                                                            />
                                                          )
                                                        )
                                                      : null}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        }
                                        return null;
                                      }
                                    )}
                                  </div>
                                ) : null}
                              </>
                            ) : null
                          ) : null}
                          {eachQuestion?.question?.sub_questions?.map(
                            (each_sub, sub_index) => {
                              return (
                                <>
                                  <div className='pl-4 check-break'>
                                    <QuestionView question={each_sub} showAns={false} />
                                  </div>
                                </>
                              );
                            }
                          )}
                        </div>
                      </>
                    );
                  })}
                </div>
              );
            })}
          <div className='text-center pt-3'>-End of Question Paper-</div>
          {/* </div> */}
        </div>
      </div>
    );
  }
);
export default QuestionPreview_V2;
