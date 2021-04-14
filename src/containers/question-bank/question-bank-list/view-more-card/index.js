import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import { browserHistory } from 'react-router-dom'
import ReactPlayer from 'react-player';
import Paper from '@material-ui/core/Paper';
import { useTheme, IconButton, SvgIcon, Divider, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Flare } from '@material-ui/icons';
import axiosInstance from '../../../../config/axios';
import './view-more.css';
// import './styles.scss';
import VisibilityIcon from '@material-ui/icons/Visibility';
import endpoints from '../../../../config/endpoints';
import download from '../../../../assets/images/download.svg';
import downloadAll from '../../../../assets/images/downloadAll.svg';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import { Context } from '../../context/QuestionStore';
import { AttachmentPreviewerContext } from '../../../../components/attachment-previewer/attachment-previewer-contexts';
import axios from 'axios';

const ViewMoreCard = ({
  viewMoreData,
  setViewMore,
  filterDataDown,
  periodDataForView,
  setSelectedIndex,
  handlePeriodList,
  tabQueTypeId,
  tabQueCatId,
  tabMapId,
  tabQueLevel,
  tabTopicId,
}) => {
  // const { year: { session_year }, grade: { grade_name }, subject: { subject: { subject_name } }, chapter: { chapter_name }, volume: { volume_name } } = filterDataDown;
  // const { setAlert } = useContext(AlertNotificationContext);
  // context data
  // const [state,setState]= useContext(Context)
  const { setAlert } = useContext(AlertNotificationContext);
  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};

  const [queName, setQueName] = useState(viewMoreData.parent);
  const compData = viewMoreData?.child;
  const Data = periodDataForView?.question_answer;
  const history = useHistory();
  const [queSRC, setQueSRC] = useState('');
  const optData = viewMoreData.parent;
  const getS3DomainURL = (fileSrc) => {
    return `${endpoints.assessment.s3}${fileSrc}`;
  };
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
  const handleEdit = () => {
    history.push(`/create-question/${viewMoreData?.parent?.id}`);
  };

  const handlePublish = (obj) => {
    // axiosInstance
    axios
      .put(
        `${endpoints.questionBank.deleteQuestion}`,
        {
          question_status: 2,
          question: obj.parent.id,
        },
        {
          headers: { 'x-api-key': 'vikash@12345#1231' },
        }
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setSelectedIndex(-1);
          handlePeriodList(tabQueTypeId, tabQueCatId, tabMapId, tabQueLevel, tabTopicId);
          setAlert('success', result?.data?.message);
        } else {
          setAlert('error', 'ERROR!');
        }
      })
      .catch((error) => setAlert('error', error?.message));
  };
  const handleDelete = (obj) => {
    // axiosInstance
    axios
      .put(
        `${endpoints.questionBank.deleteQuestion}`,
        {
          question_status: 1,
          question: obj.parent.id,
        },
        {
          headers: { 'x-api-key': 'vikash@12345#1231' },
        }
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setSelectedIndex(-1);
          handlePeriodList(tabQueTypeId, tabQueCatId, tabMapId, tabQueLevel, tabTopicId);
          setAlert('success', 'Question Moved To Draft');
        } else {
          setAlert('error', 'ERROR!');
        }
      })
      .catch((error) => setAlert('error', error?.message));
  };

  return (
    <Paper className='rootViewMore'>
      <div className='viewMoreHeader'>
        <div className='leftHeader'>
          <div className='headerTitle'>
            {resolveQuestionTypeName(periodDataForView.question_type)}
            {/* {compData && compData.forEach */}
          </div>

          {/* { 
                    Data?.map(p=> (
                    <div className="headerTitle">
                       {extractContent(p.question )}
                    </div> )
                    
                    )}  */}
          <div className='headerContent'>
            {/* {filterDataDown?.chapter?.chapter_name} */}
          </div>
        </div>
        <div className='rightHeader'>
          <div className='headerTitle closeIcon'>
            <IconButton
              onClick={() => {
                setViewMore(false);
                setSelectedIndex(-1);
              }}
            >
              <CloseIcon color='primary' />
            </IconButton>
          </div>
          <div className='headerContent' onClick={handleEdit}>
            <a>Edit Details</a>
          </div>
        </div>
      </div>
      <div className='resourceBulkDownload'>Questions</div>
      <div className='divider'>{/* <Divider/> */}</div>

      <div className='viewMoreBody'>
        {(periodDataForView.question_type == 1 ||
          periodDataForView.question_type == 2) && (
          <div className='mcq-container'>
            <div className='question-container'>
              {Data?.map((p) => (
                <div style={{ color: '#014B7E' }}>
                  {extractContent(p?.question)}
                  <div>
                    {p?.question?.split('"').filter((str) => str.startsWith('https'))
                      .length > 0 && (
                      <a
                        onClick={() => {
                          openPreview({
                            currentAttachmentIndex: 0,
                            attachmentsArray: (() => {
                              let newArray = p?.question?.split('"');
                              let filtered = newArray.filter((str) =>
                                str.startsWith('https')
                              );
                              const images = filtered || {};
                              const attachmentsArray = [];
                              images.forEach((image) => {
                                const attachmentObj = {
                                  src: image,
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
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className='resourceBulkDownload'>Answers</div>
            <div className='question-container'>
              {Data[0]?.answer.map((obj, i) => (
                <div>{obj}</div>
              ))}
            </div>
            <div className='resourceBulkDownload'>Options</div>
            <div>
              {Data[0]?.options.map((obj, i) => (
                <div className='question-container'>
                  {`OPTION${i + 1}:   ${obj[`option${i + 1}`].optionValue}`}
                  {`${obj[`option${i + 1}`].images}`.length > 0 && (
                    <div>
                      <a
                        onClick={() => {
                          openPreview({
                            currentAttachmentIndex: 0,
                            attachmentsArray: (() => {
                              const images =
                                `${obj[`option${i + 1}`].images}`.split(',') || {};
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
          </div>
        )}

        {periodDataForView.question_type === 3 && (
          <div className='ccc'>
            <div className='question-container'>
              {Data?.map((p) => (
                <div style={{ color: '#014B7E' }}>
                  {extractContent(p.question)}
                  {p?.question?.split('"').filter((str) => str.startsWith('https'))
                    .length > 0 && (
                    <div>
                      <a
                        onClick={() => {
                          openPreview({
                            currentAttachmentIndex: 0,
                            attachmentsArray: (() => {
                              let newArray = p?.question?.split('"');
                              let filtered = newArray.filter((str) =>
                                str.startsWith('https')
                              );
                              const images = filtered || {};
                              const attachmentsArray = [];
                              images.forEach((image) => {
                                const attachmentObj = {
                                  src: image,
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

            <div className='resourceBulkDownload'>Answers</div>
            {/* <Divider className='secondary-divider' /> */}
            <div>
              {Data[0]?.questionAnswer?.map((obj, index) => (
                <>
                  <div style={{ display: 'flex' }} className='question-container'>
                    <div className='option'>{obj.answer}</div>
                    <div className='option' style={{ marginLeft: '2rem' }}>
                      {obj.question}
                    </div>
                  </div>
                </>
              ))}
            </div>

            <div className='resourceBulkDownload'>Options</div>
            <div>
              {Data[0]?.options?.map((obj, i) => (
                <div className='question-container'>
                  {`OPTION${i + 1}:   ${obj.optionValue}`}
                  {obj?.images?.length > 0 && (
                    <div>
                      <a
                        onClick={() => {
                          openPreview({
                            currentAttachmentIndex: 0,
                            attachmentsArray: (() => {
                              const images = obj?.images || {};
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
              <div style={{ fontSize: '1.25rem', color: '#ff6b6b' }}>
                Match with the following{' '}
              </div>
              {Data[0]?.matchingOptions.map((obj, i) => (
                <div className='question-container'>
                  {`OPTION${i + 1}:   ${obj.optionValue}`}
                  {obj?.images?.length > 0 && (
                    <div>
                      <a
                        onClick={() => {
                          openPreview({
                            currentAttachmentIndex: 0,
                            attachmentsArray: (() => {
                              const images = obj?.images || {};
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
          </div>
        )}

        {periodDataForView.question_type === 4 && (
          <div>
            <div className='question-container'>{extractContent(Data[0]?.question)}</div>
            <ReactPlayer
              playing={false}
              controls
              url={`${endpoints.s3}${Data[0]?.video}`}
              style={{ maxWidth: '100%' }}
            />
            {Array.isArray(compData) &&
              compData.map((childQuestions, indexQue) => {
                if (childQuestions.question_type === 10) {
                  return (
                    <>
                      <div>
                        <div className='question-container'>
                          <div style={{ color: '#014B7E' }}>
                            <span style={{ color: 'red', fontSize: 16 }}>
                              {`Q${indexQue + 1}`}:{' '}
                            </span>
                            {extractContent(childQuestions?.question_answer[0]?.question)}
                          </div>
                        </div>

                        <div className='resourceBulkDownload'>Answers</div>

                        <div className='question-container'>
                          <div style={{ color: '#014B7E' }}>
                            {extractContent(childQuestions?.question_answer[0]?.answer)}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }
                if (childQuestions.question_type === 9) {
                  return (
                    <>
                      <div>
                        <div className='question-container'>
                          <div style={{ color: '#014B7E' }}>
                            <span style={{ color: 'red', fontSize: 16 }}>
                              {`Q${indexQue + 1}`}:{' '}
                            </span>
                            {extractContent(childQuestions?.question_answer[0]?.question)}
                          </div>
                        </div>
                        {/* <div className='resourceBulkDownload'>Answers</div>
                        <div className='question-container'>
                          {childQuestions?.question_answer[0]?.answer.map((obj, i) => (
                            <div>{obj}</div>
                          ))}
                        </div> */}
                        <div className='resourceBulkDownload'>Answers</div>
                        <div>
                          {childQuestions?.question_answer[0]?.options.map((obj, i) => (
                            <div className='question-container'>
                              {obj[`option${i + 1}`].optionValue}
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
                          ))}
                        </div>
                      </div>
                    </>
                  );
                }
                if (childQuestions.question_type === 8) {
                  return (
                    <>
                      <div>
                        <div className='question-container'>
                          <div style={{ color: '#014B7E' }}>
                            <span style={{ color: 'red', fontSize: 16 }}>
                              {`Q${indexQue + 1}`}:{' '}
                            </span>
                            {extractContent(childQuestions?.question_answer[0]?.question)}
                          </div>
                        </div>
                        <div className='resourceBulkDownload'>Answers</div>
                        <div className='question-container'>
                          {childQuestions?.question_answer[0]?.answer.map((obj, i) => (
                            <div>{obj}</div>
                          ))}
                        </div>
                        <div className='resourceBulkDownload'>Options</div>
                        <div className='question-container'>
                          {childQuestions?.question_answer[0]?.options.map((obj, i) => {
                            return (
                              <div>
                                {Object.keys(obj)[0] || ''} :{' '}
                                {obj[Object.keys(obj)[0]]?.isChecked ? 'True' : 'False'}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                }
                if (childQuestions.question_type === 6) {
                  return (
                    <>
                      <div className='ccc'>
                        <div className='question-container'>
                          <div style={{ color: '#014B7E' }}>
                            <span style={{ color: 'red', fontSize: 16 }}>
                              {`Q${indexQue + 1}`}:{' '}
                            </span>{' '}
                            {extractContent(childQuestions?.question_answer[0]?.question)}
                          </div>
                        </div>
                        <div className='resourceBulkDownload'>Answers</div>
                        <div>
                          {childQuestions?.question_answer[0]?.questionAnswer?.map(
                            (obj, index) => (
                              <>
                                <div
                                  style={{ display: 'flex' }}
                                  className='question-container'
                                >
                                  <div className='option'>{obj?.answer}</div>
                                  <div className='option' style={{ marginLeft: '2rem' }}>
                                    {obj?.question}
                                  </div>
                                </div>
                              </>
                            )
                          )}
                        </div>

                        <div className='resourceBulkDownload'>Options</div>
                        <div>
                          {childQuestions?.question_answer[0]?.options.map((obj, i) => (
                            <div className='question-container'>
                              {`OPTION${i + 1}:   ${obj.optionValue}`}
                              {obj?.images.length > 0 && (
                                <div>
                                  <a
                                    onClick={() => {
                                      openPreview({
                                        currentAttachmentIndex: 0,
                                        attachmentsArray: (() => {
                                          const images = obj?.images || {};
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
                          ))}
                          <div style={{ fontSize: '1.25rem', color: '#ff6b6b' }}>
                            Match with the following{' '}
                          </div>
                          {childQuestions?.question_answer[0]?.matrixOptions.map(
                            (obj, i) => (
                              <div className='question-container'>
                                {`OPTION${i + 1}:   ${obj.optionValue}`}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  );
                }
                if (childQuestions.question_type === 3) {
                  return (
                    <>
                      <div className='ccc'>
                        <div className='question-container'>
                          <div style={{ color: '#014B7E' }}>
                            <span style={{ color: 'red', fontSize: 16 }}>
                              {`Q${indexQue + 1}`}:{' '}
                            </span>{' '}
                            {extractContent(childQuestions?.question_answer[0]?.question)}
                          </div>
                        </div>
                        <div className='resourceBulkDownload'>Answers</div>
                        <div>
                          {childQuestions?.question_answer[0]?.questionAnswer?.map(
                            (obj, index) => (
                              <>
                                <div
                                  style={{ display: 'flex' }}
                                  className='question-container'
                                >
                                  <div className='option'>{obj.answer}</div>
                                  <div className='option' style={{ marginLeft: '2rem' }}>
                                    {obj.question}
                                  </div>
                                </div>
                              </>
                            )
                          )}
                        </div>
                        <div className='resourceBulkDownload'>Options</div>
                        <div>
                          {childQuestions?.question_answer[0]?.options.map((obj, i) => (
                            <div className='question-container'>
                              {`OPTION${i + 1}:   ${obj.optionValue}`}
                              {obj?.images?.length > 0 && (
                                <div>
                                  <a
                                    onClick={() => {
                                      openPreview({
                                        currentAttachmentIndex: 0,
                                        attachmentsArray: (() => {
                                          const images = obj?.images || {};
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
                          ))}
                          <div style={{ fontSize: '1.25rem', color: '#ff6b6b' }}>
                            Match with the following{' '}
                          </div>
                          {childQuestions?.question_answer[0]?.matchingOptions.map(
                            (obj, i) => (
                              <div className='question-container'>
                                {`OPTION${i + 1}:   ${obj.optionValue}`}
                                {obj?.images?.length > 0 && (
                                  <div>
                                    <a
                                      onClick={() => {
                                        openPreview({
                                          currentAttachmentIndex: 0,
                                          attachmentsArray: (() => {
                                            const images = obj?.images || {};
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
                  );
                }
                if (
                  childQuestions.question_type === 1 ||
                  childQuestions.question_type === 2
                ) {
                  return (
                    <>
                      <div className='mcq-container'>
                        <div className='question-container'>
                          <div>
                            {childQuestions.question_type === 1
                              ? 'MCQ SINGLE'
                              : 'MCQ MULTI'}
                          </div>
                          <div style={{ color: '#014B7E' }}>
                            <span style={{ color: 'red', fontSize: 16 }}>
                              {`Q${indexQue + 1}`}:{' '}
                            </span>{' '}
                            {extractContent(childQuestions?.question_answer[0]?.question)}
                          </div>
                        </div>
                        <div className='resourceBulkDownload'>Answers</div>
                        <div className='question-container'>
                          {childQuestions?.question_answer[0]?.answer.map((obj, i) => (
                            <div>{obj}</div>
                          ))}
                        </div>
                        <div className='resourceBulkDownload'>Options</div>
                        <div>
                          {childQuestions?.question_answer[0]?.options.map((obj, i) => (
                            <div className='question-container'>
                              {`OPTION${i + 1}:   ${obj[`option${i + 1}`].optionValue}`}
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
                          ))}
                        </div>
                      </div>
                    </>
                  );
                }
              })}
          </div>
        )}

        {periodDataForView.question_type === 6 && (
          <div className='ccc'>
            <div className='question-container'>
              {Data?.map((p) => (
                <div style={{ color: '#014B7E' }}>
                  {extractContent(p.question)}
                  {p?.question?.split('"').filter((str) => str.startsWith('https'))
                    .length > 0 && (
                    <div>
                      <a
                        onClick={() => {
                          openPreview({
                            currentAttachmentIndex: 0,
                            attachmentsArray: (() => {
                              let newArray = p?.question?.split('"');
                              let filtered = newArray.filter((str) =>
                                str.startsWith('https')
                              );
                              const images = filtered || {};
                              const attachmentsArray = [];
                              images.forEach((image) => {
                                const attachmentObj = {
                                  src: image,
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

            <div className='resourceBulkDownload'>Answers</div>
            {/* <Divider className='secondary-divider' /> */}
            <div>
              {Data[0]?.questionAnswer?.map((obj, index) => (
                <>
                  <div style={{ display: 'flex' }} className='question-container'>
                    <div className='option'>{obj.answer}</div>
                    <div className='option' style={{ marginLeft: '2rem' }}>
                      {obj.question}
                    </div>
                  </div>
                </>
              ))}
            </div>

            <div className='resourceBulkDownload'>Options</div>
            <div>
              {Data[0]?.options.map((obj, i) => (
                <div className='question-container'>
                  {`OPTION${i + 1}:   ${obj.optionValue}`}
                  {obj?.images.length > 0 && (
                    <div>
                      <a
                        onClick={() => {
                          openPreview({
                            currentAttachmentIndex: 0,
                            attachmentsArray: (() => {
                              const images = obj?.images || {};
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
              <div style={{ fontSize: '1.25rem', color: '#ff6b6b' }}>
                Match with the following{' '}
              </div>
              {Data[0]?.matrixOptions.map((obj, i) => (
                <div className='question-container'>
                  {`OPTION${i + 1}:   ${obj.optionValue}`}
                </div>
              ))}
            </div>
          </div>
        )}

        {periodDataForView.question_type === 7 && (
          <div className='ccc'>
            <div className='question-container'>
              {Data?.map((p) => (
                <div style={{ color: '#014B7E' }}>
                  {extractContent(p.question)}
                  {p?.question?.split('"').filter((str) => str.startsWith('https'))
                    .length > 0 && (
                    <div>
                      <a
                        onClick={() => {
                          openPreview({
                            currentAttachmentIndex: 0,
                            attachmentsArray: (() => {
                              let newArray = p?.question?.split('"');
                              let filtered = newArray.filter((str) =>
                                str.startsWith('https')
                              );
                              const images = filtered || {};
                              const attachmentsArray = [];
                              images.forEach((image) => {
                                const attachmentObj = {
                                  src: image,
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
            {Array.isArray(compData) &&
              compData.map((childQuestions, indexQue) => {
                if (childQuestions.question_type === 10) {
                  return (
                    <>
                      <div>
                        <div className='question-container'>
                          <div style={{ color: '#014B7E' }}>
                            <span style={{ color: 'red', fontSize: 16 }}>
                              {`Q${indexQue + 1}`}:{' '}
                            </span>{' '}
                            {extractContent(childQuestions?.question_answer[0]?.question)}
                          </div>
                        </div>

                        <div className='resourceBulkDownload'>Answers</div>

                        <div className='question-container'>
                          <div style={{ color: '#014B7E' }}>
                            {extractContent(childQuestions?.question_answer[0]?.answer)}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }
                if (childQuestions.question_type === 9) {
                  return (
                    <>
                      <div>
                        <div className='question-container'>
                          <div style={{ color: '#014B7E' }}>
                            <span style={{ color: 'red', fontSize: 16 }}>
                              {`Q${indexQue + 1}`}:{' '}
                            </span>{' '}
                            {extractContent(childQuestions?.question_answer[0]?.question)}
                          </div>
                        </div>
                        {/* <div className='resourceBulkDownload'>Answers</div>
                        <div className='question-container'>
                          {childQuestions?.question_answer[0]?.answer.map((obj, i) => (
                            <div>{obj}</div>
                          ))}
                        </div> */}
                        <div className='resourceBulkDownload'>Answers</div>
                        <div>
                          {childQuestions?.question_answer[0]?.options.map((obj, i) => (
                            <div className='question-container'>
                              {obj[`option${i + 1}`].optionValue}
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
                          ))}
                        </div>
                      </div>
                    </>
                  );
                }
                if (childQuestions.question_type === 8) {
                  return (
                    <>
                      <div>
                        <div className='question-container'>
                          <div style={{ color: '#014B7E' }}>
                            <span style={{ color: 'red', fontSize: 16 }}>
                              {`Q${indexQue + 1}`}:{' '}
                            </span>{' '}
                            {extractContent(childQuestions?.question_answer[0]?.question)}
                          </div>
                        </div>
                        <div className='resourceBulkDownload'>Answers</div>
                        <div className='question-container'>
                          {childQuestions?.question_answer[0]?.answer.map((obj, i) => (
                            <div>{obj}</div>
                          ))}
                        </div>
                        <div className='resourceBulkDownload'>Options</div>
                        <div className='question-container'>
                          {childQuestions?.question_answer[0]?.options.map((obj, i) => {
                            return (
                              <div>
                                {Object.keys(obj)[0] || ''} :{' '}
                                {obj[Object.keys(obj)[0]]?.isChecked ? 'True' : 'False'}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                }
                if (childQuestions.question_type === 6) {
                  return (
                    <>
                      <div className='ccc'>
                        <div className='question-container'>
                          <div style={{ color: '#014B7E' }}>
                            <span style={{ color: 'red', fontSize: 16 }}>
                              {`Q${indexQue + 1}`}:{' '}
                            </span>{' '}
                            {extractContent(childQuestions?.question_answer[0]?.question)}
                          </div>
                        </div>
                        <div className='resourceBulkDownload'>Answers</div>
                        <div>
                          {childQuestions?.question_answer[0]?.questionAnswer?.map(
                            (obj, index) => (
                              <>
                                <div
                                  style={{ display: 'flex' }}
                                  className='question-container'
                                >
                                  <div className='option'>{obj?.answer}</div>
                                  <div className='option' style={{ marginLeft: '2rem' }}>
                                    {obj?.question}
                                  </div>
                                </div>
                              </>
                            )
                          )}
                        </div>

                        <div className='resourceBulkDownload'>Options</div>
                        <div>
                          {childQuestions?.question_answer[0]?.options.map((obj, i) => (
                            <div className='question-container'>
                              {`OPTION${i + 1}:   ${obj.optionValue}`}
                              {obj?.images.length > 0 && (
                                <div>
                                  <a
                                    onClick={() => {
                                      openPreview({
                                        currentAttachmentIndex: 0,
                                        attachmentsArray: (() => {
                                          const images = obj?.images || {};
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
                          ))}
                          <div style={{ fontSize: '1.25rem', color: '#ff6b6b' }}>
                            Match with the following{' '}
                          </div>
                          {childQuestions?.question_answer[0]?.matrixOptions.map(
                            (obj, i) => (
                              <div className='question-container'>
                                {`OPTION${i + 1}:   ${obj.optionValue}`}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  );
                }
                if (childQuestions.question_type === 3) {
                  return (
                    <>
                      <div className='ccc'>
                        <div className='question-container'>
                          <div style={{ color: '#014B7E' }}>
                            <span style={{ color: 'red', fontSize: 16 }}>
                              {`Q${indexQue + 1}`}:{' '}
                            </span>{' '}
                            {extractContent(childQuestions?.question_answer[0]?.question)}
                          </div>
                        </div>
                        <div className='resourceBulkDownload'>Answers</div>
                        <div>
                          {childQuestions?.question_answer[0]?.questionAnswer?.map(
                            (obj, index) => (
                              <>
                                <div
                                  style={{ display: 'flex' }}
                                  className='question-container'
                                >
                                  <div className='option'>{obj.answer}</div>
                                  <div className='option' style={{ marginLeft: '2rem' }}>
                                    {obj.question}
                                  </div>
                                </div>
                              </>
                            )
                          )}
                        </div>
                        <div className='resourceBulkDownload'>Options</div>
                        <div>
                          {childQuestions?.question_answer[0]?.options.map((obj, i) => (
                            <div className='question-container'>
                              {`OPTION${i + 1}:   ${obj.optionValue}`}
                              {obj?.images?.length > 0 && (
                                <div>
                                  <a
                                    onClick={() => {
                                      openPreview({
                                        currentAttachmentIndex: 0,
                                        attachmentsArray: (() => {
                                          const images = obj?.images || {};
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
                          ))}
                          <div style={{ fontSize: '1.25rem', color: '#ff6b6b' }}>
                            Match with the following{' '}
                          </div>
                          {childQuestions?.question_answer[0]?.matchingOptions.map(
                            (obj, i) => (
                              <div className='question-container'>
                                {`OPTION${i + 1}:   ${obj.optionValue}`}
                                {obj?.images?.length > 0 && (
                                  <div>
                                    <a
                                      onClick={() => {
                                        openPreview({
                                          currentAttachmentIndex: 0,
                                          attachmentsArray: (() => {
                                            const images = obj?.images || {};
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
                  );
                }
                if (
                  childQuestions.question_type === 1 ||
                  childQuestions.question_type === 2
                ) {
                  return (
                    <>
                      <div className='mcq-container'>
                        <div className='question-container'>
                          <div>
                            {childQuestions.question_type === 1
                              ? 'MCQ SINGLE'
                              : 'MCQ MULTI'}
                          </div>
                          <div style={{ color: '#014B7E' }}>
                            <span style={{ color: 'red', fontSize: 16 }}>
                              {`Q${indexQue + 1}`}:{' '}
                            </span>{' '}
                            {extractContent(childQuestions?.question_answer[0]?.question)}
                          </div>
                        </div>
                        <div className='resourceBulkDownload'>Answers</div>
                        <div className='question-container'>
                          {childQuestions?.question_answer[0]?.answer.map((obj, i) => (
                            <div>{obj}</div>
                          ))}
                        </div>
                        <div className='resourceBulkDownload'>Options</div>
                        <div>
                          {childQuestions?.question_answer[0]?.options.map((obj, i) => (
                            <div className='question-container'>
                              {`OPTION${i + 1}:   ${obj[`option${i + 1}`].optionValue}`}
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
                          ))}
                        </div>
                      </div>
                    </>
                  );
                }
              })}
          </div>
        )}

        {periodDataForView.question_type === 8 && (
          <div>
            <div className='question-container'>
              {Data &&
                Data?.map((p) => (
                  <div style={{ color: '#014B7E' }}>
                    {extractContent(p.question)}
                    {p?.question?.split('"').filter((str) => str.startsWith('https'))
                      .length > 0 && (
                      <div>
                        <a
                          onClick={() => {
                            openPreview({
                              currentAttachmentIndex: 0,
                              attachmentsArray: (() => {
                                let newArray = p?.question?.split('"');
                                let filtered = newArray.filter((str) =>
                                  str.startsWith('https')
                                );
                                const images = filtered || {};
                                const attachmentsArray = [];
                                images.forEach((image) => {
                                  const attachmentObj = {
                                    src: image,
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
            <div className='resourceBulkDownload'>Answers</div>
            <div className='question-container'>
              {Data && Data[0]?.answer.map((obj, i) => <div>{obj}</div>)}
            </div>
            <div className='resourceBulkDownload'>Options</div>
            <div className='question-container'>
              {Data &&
                Data[0]?.options.map((obj, i) => {
                  return (
                    <div>
                      {Object.keys(obj)[0] || ''} :{' '}
                      {obj[Object.keys(obj)[0]]?.isChecked ? 'True' : 'False'}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {periodDataForView.question_type === 9 && (
          <div>
            <div className='question-container'>
              {Data &&
                Data?.map((p) => (
                  <div style={{ color: '#014B7E' }}>
                    {extractContent(p.question)}
                    {p?.question?.split('"').filter((str) => str.startsWith('https'))
                      .length > 0 && (
                      <div>
                        <a
                          onClick={() => {
                            openPreview({
                              currentAttachmentIndex: 0,
                              attachmentsArray: (() => {
                                let newArray = p?.question?.split('"');
                                let filtered = newArray.filter((str) =>
                                  str.startsWith('https')
                                );
                                const images = filtered || {};
                                const attachmentsArray = [];
                                images.forEach((image) => {
                                  const attachmentObj = {
                                    src: image,
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

            {/* <div className='resourceBulkDownload'>Answers</div>
            <div className='question-container'>
              {Data && Data[0]?.answer.map((obj, i) => <div>{obj}</div>)}
            </div> */}
            <div className='resourceBulkDownload'>Answers</div>
            <div>
              {Data &&
                Data[0]?.options.map((obj, i) => (
                  <div className='question-container'>
                    {obj[`option${i + 1}`].optionValue}
                    {`${obj[`option${i + 1}`].images}`.length > 0 && (
                      <div>
                        <a
                          onClick={() => {
                            openPreview({
                              currentAttachmentIndex: 0,
                              attachmentsArray: (() => {
                                const images =
                                  `${obj[`option${i + 1}`].images}`.split(',') || {};
                                const attachmentsArray = [];
                                images.forEach((image) => {
                                  console.log(image, '++++++');
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
          </div>
        )}
        {periodDataForView.question_type === 10 && (
          <div>
            <div className='question-container'>
              {Data &&
                Data?.map((p) => (
                  <div style={{ color: '#014B7E' }}>
                    {extractContent(p.question)}
                    {p?.question?.split('"').filter((str) => str.startsWith('https'))
                      .length > 0 && (
                      <div>
                        <a
                          onClick={() => {
                            openPreview({
                              currentAttachmentIndex: 0,
                              attachmentsArray: (() => {
                                let newArray = p?.question?.split('"');
                                let filtered = newArray.filter((str) =>
                                  str.startsWith('https')
                                );
                                const images = filtered || {};
                                const attachmentsArray = [];
                                images.map((image) => {
                                  const attachmentObj = {
                                    src: image,
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

            <div className='resourceBulkDownload'>Answers</div>

            <div className='question-container'>
              {Data &&
                Data?.map((p) => (
                  <div style={{ color: '#014B7E' }}>{extractContent(p.answer)}</div>
                ))}
            </div>
          </div>
        )}
      </div>
      {/* {viewMoreData?.parent?.question_status === 1 ||
      viewMoreData?.parent?.question_status === 3 ? ( */}
      <div style={{ margin: '5px 15px 15px 15px' }}>
        {viewMoreData?.parent?.question_status == 3 ? (
          <Button
            style={{ marginRight: '1rem', borderRadius: '10px' }}
            onClick={(e) => handlePublish(viewMoreData)}
            color='primary'
            variant='contained'
            size='small'
          >
            PUBLISH
          </Button>
        ) : null}
        {viewMoreData?.parent?.question_status == 2 ||
        viewMoreData?.parent?.question_status == 3 ? (
          <Button
            style={{ marginRight: '1rem', borderRadius: '10px' }}
            onClick={(e) => handleDelete(viewMoreData)}
            color='secondary'
            variant='contained'
            size='small'
          >
            REJECT
          </Button>
        ) : null}
      </div>
      {/* ) : null} */}
    </Paper>
  );
};

export default ViewMoreCard;
