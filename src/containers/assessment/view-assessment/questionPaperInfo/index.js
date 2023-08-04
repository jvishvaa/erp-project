/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import {
  IconButton,
  OutlinedInput,
  FormHelperText,
  Typography,
  Badge,
} from '@material-ui/core';
import { Paper, Button } from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';
import { withRouter } from 'react-router-dom';
import { timeDeltaDiff } from '../../../../utility-functions';
import QuestionReview from './questions-review';
import toddlerGroup from '../../../../assets/images/toddler-group.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AssessmentReviewContext } from '../../assess-attemption/assess-review-context';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import './questionPaperInfo.css';
import { AssessuploadFile } from '../../../../redux/actions';
import { Grid, withStyles, Popover, SvgIcon } from '@material-ui/core';
import useStyles from './useStyles';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import FileValidators from '../../../../components/file-validation/FileValidators';
import endpoints from '../../../../config/endpoints';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import placeholder from '../../../../assets/images/placeholder_small.jpg';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Attachment from '../../../../containers/homework/teacher-homework/attachment';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { connect, useSelector } from 'react-redux';
import axiosInstance from '../../../../config/axios';
import Loader from './../../../../components/loader/loader';
import moment from 'moment';
const QuestionPaperInfo = ({
  assessmentId,
  assessmentDate,
  assessmentType,
  handleCloseInfo,
  ...restProps
}) => {
  const [subQuestionsData, setsubQuestionData] = useState([]);
  const classes = useStyles();
  const [fileUploadInProgress, setFileUploadInProgress] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [sizeValied, setSizeValied] = useState({});
  const [showSubmit, setShowSubmit] = useState({});
  const [reloadFlag, setReloadFlag] = useState(false);
  const [showagain, setShowagain] = useState([]);
  const [allImage, setAllImage] = useState([]);

  const {
    assessmentId: assessmentIdFromContext = null,
    setAssessmentId,
    setAssessmentType,
    setAssessmentDate,
    assessmentResult: {
      data: {
        instructions: testInstructions,
        descriptions: testDescription,
        test_name: testTitle,
        test_date: testDate,
        // id: assessmentId,
        question_paper: {
          // id: assessmentId = undefined,
          id: questionPaperId,
          grade_name: gradeName,
          subject_name: subjects = [],
        } = {},
        total_mark: totalMarks,
        obtained_mark: obtainedMarks,
        analysis = {},
        user_response: userResponseObj,
        test_duration: testDuration,
        test_mode: test_mode,
        test_type: test_type,
        test_type_name: test_type_name,
      } = {},
      fetching,
      fetchFailed,
      message,
    } = {},
    questionsArray,
  } = useContext(AssessmentReviewContext) || {};

  const firstUpdate = useRef(true);
  const fileUploadInput = useRef(null);
  const attachmentsRef = useRef(null);
  const attachmentsInitialRef = useRef(null);
  const [showPrev, setshowPrev] = useState(0);
  const [showPrevAgain, setshowPrevAgain] = useState(0);

  const handleScroll = (dir) => {
    if (dir === 'left') {
      attachmentsRef.current.scrollLeft -= 150;
    } else {
      attachmentsRef.current.scrollLeft += 150;
    }
  };

  const handleScrollAgain = (dir) => {
    if (dir === 'left') {
      attachmentsInitialRef.current.scrollLeft -= 150;
    } else {
      attachmentsInitialRef.current.scrollLeft += 150;
    }
  };

  useEffect(() => {
    let count = 0;
    attachmentPreviews.forEach((e) => {
      if (typeof e == 'string') count = count + 1;
      else {
        count = Object.keys(e).length + count;
      }
    });
    setshowPrev(count > 2);
  }, [attachmentPreviews]);

  useEffect(() => {
    let count = 0;
    showagain.forEach((e) => {
      if (typeof e == 'string') count = count + 1;
      else {
        count = Object.keys(e).length + count;
      }
    });
    setshowPrevAgain(count > 2);
  }, [showagain]);

  useEffect(() => {
    countSubQuestions();
  }, [questionsArray]);
  const countSubQuestions = () => {
    let data = 0;
    questionsArray.map((e) => {
      if (e.sub_question_answer?.length) {
        data = data + e.sub_question_answer?.length;
      }
      setsubQuestionData(data);
    });
  };
  const testEndTime = new Date(testDate).getTime() + testDuration * 60 * 1000;
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const isTestAttempted = !!userResponseObj;
  const {
    attempt_question: attemptedQuestions,
    correct_answer: correctAnswers,
    end_time: endTime,
    start_time: startTime,
    total_question: totalQuestions,
    wrong_answer: wrongAnswer,
  } = analysis || {};

  // const timeTakenForTest = timeDeltaDiff(new Date(endTime), new Date(startTime), true);
  // const themeContext = useTheme();
  // const { setAlert } = useContext(AlertNotificationContext);
  // const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const getTestStatus = () => {
    return new Date(testDate).getTime() <= new Date().getTime();
  };

  const SubmitAssessmentAPI = () => {
    const body = { question_files: attachments, test: assessmentId };
    const param = { upload_id: showSubmit?.upload_id, can_reupload: false };
    if (attachments.length === 0) param['question_files'] = [null];
    if (attachments.length > 0) param['question_files'] = attachments;
    // return {
    // setLoading(true);
    // setAssessmentId,
    if (attachments.length === 0) {
      setAlert('warning', 'Please upload file');
    }
    if (attachments.length > 0) {
      if (showSubmit.can_reupload) {
        axiosInstance
          .put(`${endpoints.assessment.imageupload}`, param)
          .then((result) => {
            if (result?.data?.status_code === 200) {
              setAlert('success', result?.data?.message);
              setReloadFlag(!reloadFlag);
              setShowagain([]);
            } else {
              setAlert('error', result?.data?.message);
            }
            // setLoading(false);
            // props.onClose();
          })
          .catch((error) => {
            // setAlert('error', error?.response.data.developer_msg);
            // setLoading(false);
          });
      } else {
        axiosInstance
          .post(`${endpoints.assessment.imageupload}`, body)
          .then((result) => {
            if (result?.data?.status_code === 200) {
              setAlert('success', result?.data?.message);
              setReloadFlag(!reloadFlag);
              setShowagain([]);
            } else {
              setAlert('error', result?.data?.message);
            }
          })
          .catch((error) => {
            // setAlert('error', error?.response.data.developer_msg);
            // setLoading(false);
          });
      }
    }
    // }
  };

  const getAssesmentDocument = () => {
    axiosInstance
      .get(`${endpoints.assessment.imageupload}?test_id=${assessmentId}`)
      .then((result) => {
        console.log(result?.data, 'orchids11');
        if (result?.data?.status_code === 200) {
          setShowSubmit(result?.data);
          setAttachments((pre) => [...pre, ...result?.data?.result]);
          setAttachmentPreviews((prevState) => [...prevState, ...result?.data?.result]);
          setShowagain(result?.data?.result);
          const preImgnames = result?.data?.result.map((i) => i.split('/')[3]);
          setAllImage((pre) => [...pre, ...preImgnames]);
        }
      });
  };

  useEffect(() => getAssesmentDocument(), [reloadFlag]);

  const imageValidator = (file) => {
    if (
      file.name.toLowerCase().lastIndexOf('.jpg') > 0 ||
      file.name.toLowerCase().lastIndexOf('.png') > 0 ||
      file.name.toLowerCase().lastIndexOf('.jpeg') > 0
    ) {
      if (file.size < 52428800) {
        const isFileValid = {
          msg: 'Accepted files: jpeg,jpg,png',
          msgColor: '#014b7e',
          isValid: true,
        };
        return isFileValid;
      }
    }
  };

  const handleFileUpload = async (file) => {
    console.log('File', file);
    if (!file) {
      return null;
    }
    // const isValid = FileValidators(file);
    const isValid = imageValidator(file);
    const uniqueImages = allImage.includes(file.name);
    if (!uniqueImages) setAllImage((pre) => [...pre, file.name]);
    if (uniqueImages && allImage.length > 0) setAlert('warning', 'File already uploaded');
    !isValid?.isValid && setAlert('error', 'Please upload image file and less than 50mb');

    if (isValid?.isValid && !uniqueImages) {
      try {
        if (
          // file.name.toLowerCase().lastIndexOf('.pdf') > 0 ||
          file.name.toLowerCase().lastIndexOf('.jpeg') > 0 ||
          file.name.toLowerCase().lastIndexOf('.jpg') > 0 ||
          file.name.toLowerCase().lastIndexOf('.png') > 0
          // file.name.toLowerCase().lastIndexOf('.mp3') > 0 ||
          // file.name.toLowerCase().lastIndexOf('.mp4') > 0
        ) {
          const fd = new FormData();
          fd.append('file', file);
          setFileUploadInProgress(true);
          const filePath = await AssessuploadFile(fd);
          const final = Object.assign({}, filePath);
          if (file.type === 'application/pdf') {
            setAttachments((prevState) => [...prevState, final]);
            setAttachmentPreviews((prevState) => [...prevState, final]);
          } else {
            setAttachments((prevState) => [...prevState, filePath]);
            setAttachmentPreviews((prevState) => [...prevState, filePath]);
          }
          setFileUploadInProgress(false);
          setAlert('success', 'File uploaded successfully');
          setSizeValied('');
        } else {
          setAlert('error', 'Please upload valid file');
        }
      } catch (e) {
        setFileUploadInProgress(false);
        setAlert('error', 'File upload failed');
      }
    }
  };

  const removeAttachment = (pageIndex, pdfIndex, deletePdf, item) => {
    if (item !== undefined) {
      if (deletePdf) {
        setAttachmentPreviews((prevState) => {
          prevState.splice(pdfIndex, 1);
          return [...prevState];
        });
        // setAttachments((prevState) => {
        //   prevState.splice(pdfIndex, 1);
        //   return [...prevState];
        // });
      } else {
        setAttachmentPreviews((prevState) => {
          let newObj = prevState[pdfIndex];
          delete newObj[pageIndex];
          prevState[pdfIndex] = newObj;
          return [...prevState];
        });
        // setAttachments((prevState) => {
        //   let newObj = prevState[pdfIndex];
        //   delete newObj[pageIndex];
        //   prevState[pdfIndex] = newObj;
        //   return [...prevState];
        // });
      }
    } else {
      setAttachmentPreviews((prevState) => {
        prevState.splice(pdfIndex, 1);
        return [...prevState];
      });
      // setAttachments((prevState) => {
      //   prevState.splice(pdfIndex, 1);
      //   return [...prevState];
      // });
    }
  };

  useEffect(() => {
    if (assessmentIdFromContext !== assessmentId) {
      setAssessmentId(assessmentId);
    }
    if (assessmentDate) {
      setAssessmentDate(assessmentDate);
    }
    if (assessmentType) {
      setAssessmentType(assessmentType);
    }
  }, []);

  const testAnalysisRouteBtn = (
    <>
      <div style={{ display: 'flex', fontFamily: 'Andika New Basic, sans-serif' }}>
        <Button
          //  className={classes.customHover}
          variant='contained'
          color='primary'
          style={{
            fontFamily: 'Andika New Basic, sans-serif',
            padding: '0.3rem 1rem',
            borderRadius: '0.6rem',
            fontSize: '0.9rem',
            margin: 'auto',
          }}
          onClick={() => {
            restProps.history.push(
              `/assessment/${questionPaperId}/${assessmentId}/analysis/`
            );
          }}
        >
          Details
        </Button>
        {test_type_name == 'Practice Test' && (
          <Button
            variant='contained'
            color='primary'
            style={{
              fontFamily: 'Andika New Basic, sans-serif',
              padding: '0.3rem 1rem',
              borderRadius: '0.6rem',
              fontSize: '0.9rem',
              margin: 'auto',
            }}
            // disabled={(test_type != 37 && test_type != 38) && !getTestStatus()}
            onClick={() => {
              // Object.entries(localStorage).forEach(([key, value]) => {
              //   if (key?.startsWith('assessment-')) {
              //     localStorage.removeItem(key);
              //   }
              // });
              restProps.history.push(
                `/assessment/${questionPaperId}/${assessmentId}/attempt/`
              );
            }}
          >
            <b style={{ fontSize: '13px' }}>Take Test</b>
          </Button>
        )}
      </div>
      {test_type_name == 'Practice Test' && (
        <div className='d-flex justify-content-center pt-2'>
          Note: If you want to take this test again, please click on Take Test
        </div>
      )}
      <br />
    </>
  );
  const assessmentAnalysis = (
    <>
      <div className={classes.analysisWrapper}>
        <h3 className={classes.cardTitleHeading}>Assessment Analysis</h3>
        <div className={classes.analysisContainer}>
          <div className={classes.scoreBoard}>
            <div className={classes.scoreContainer}>
              <div className={classes.scoreGain}>{obtainedMarks || 0}</div>
              <div className={classes.scoreOutOf}>
                Out of
                {` ${totalMarks}`}
              </div>
            </div>
            {test_mode == 2 ? (
              ''
            ) : (
              <div className={classes.timeTakenContainer}>
                <div className={classes.timeTakenLabel}>You took</div>
                <div className={classes.timeTaken}>
                  {`${
                    timeDeltaDiff(new Date(endTime), new Date(startTime), true)?.minutes
                  }`}
                  <span className={classes.timeUnits}>min</span>
                  {` ${
                    timeDeltaDiff(new Date(endTime), new Date(startTime), true)?.seconds
                  }`}
                  <span className={classes.timeUnits}>secs</span>
                </div>
              </div>
            )}
          </div>
          <div className={classes.marksBarContainer}>
            <div className={classes.marksBar}>
              <div>Correct </div>
              <div>{correctAnswers}</div>
            </div>
            <div className={classes.marksBar}>
              <div>Wrong</div>
              <div>{wrongAnswer}</div>
            </div>
            <div className={classes.marksBar}>
              <div>No. of Questions</div>
              <div>{totalQuestions || (questionsArray && questionsArray.length)}</div>
            </div>
            <div className={classes.marksBar}>
              <div>Ques. Attempted</div>
              <div>{attemptedQuestions}</div>
            </div>
            <div className={classes.marksBar}>
              <div>SubQuestion</div>
              <div>{subQuestionsData}</div>
            </div>
          </div>
          <div className={classes.toddlerContainer}>
            <div className={classes.toddlerWrapper}>
              <img className={classes.toddler} alt='toddler' src={toddlerGroup} />
            </div>
          </div>
        </div>
        <QuestionReview />
      </div>
      {testAnalysisRouteBtn}
    </>
  );
  const headersUI = (
    <>
      <div className='closeContainer'>
        <a className='spanClose' onClick={handleCloseInfo}>
          &nbsp;
        </a>
      </div>
      <div className={classes.testInfoHeader}>
        <div className='d-flex flex-column'>
          <div>
            <h4 className={classes.cardTitleHeading}>
              {testTitle || (fetching ? 'Loading...' : fetchFailed ? `${message}` : '')}
            </h4>
            <h4 className={classes.cardDescription}>
              {[gradeName, ...(subjects || [])].join(', ')}
            </h4>
          </div>
          <div className='text-left'>
            {testDate && (
              <div className='th-green th-20 th-600'>
                {`${isTestAttempted ? 'Appeared on' : 'Scheduled at'} \n ${
                  moment(testDate).format('llll') || (fetching ? 'Loading...' : '')
                }`}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
  const takeTestUI = (
    <div style={{ padding: '10px' }}>
      <div>
        <h5 className={classes.cardTitleHeading}>Description:</h5>
        <div>
          &nbsp; &nbsp;
          <h6>{ReactHtmlParser(testDescription)}</h6>
        </div>
      </div>

      <div>
        <h5 className={classes.cardTitleHeading}>Instructions</h5>
        <div>
          &nbsp; &nbsp;
          <h6>{ReactHtmlParser(testInstructions)}</h6>
        </div>
      </div>
      {questionsArray && questionsArray.length ? (
        <div>
          <h4 className={classes.cardTitleHeading}>
            No of questions: &nbsp;
            {questionsArray && questionsArray.length}
          </h4>
        </div>
      ) : null}
      <div style={{ display: 'flex' }}>
        {/* <Button
          style={{
            padding: '0.3rem 1rem',
            borderRadius: '0.6rem',
            fontSize: '0.9rem',
            margin: 'auto',
          }}
          disabled={!questionPaperId}
          onClick={() => {
            restProps.history.push(`/assessment/${questionPaperId}/attempt/`);
          }}
        >
          Take Test
        </Button> */}
        {console.log('rohan', test_mode, testEndTime, testEndTime < new Date().getTime())}
        {test_mode == 1 ? (
          <>
            {test_type_name != 'Open Test' &&
            test_type_name != 'Practice Test' &&
            testEndTime < new Date().getTime() ? (
              <Button
                style={{
                  padding: '0.3rem 1rem',
                  borderRadius: '0.6rem',
                  fontSize: '0.9rem',
                  margin: 'auto',
                  color: 'white',
                }}
                disabled
                // onClick={() => {
                //   restProps.history.push(`/assessment/${questionPaperId}/attempt/`);
                // }}
              >
                Not Attempted
              </Button>
            ) : (
              <Button
                variant='contained'
                color='primary'
                style={{
                  fontFamily: 'Andika New Basic, sans-serif',
                  padding: '0.3rem 1rem',
                  borderRadius: '0.6rem',
                  fontSize: '0.9rem',
                  margin: 'auto',
                }}
                disabled={
                  test_type_name !== 'Open Test' &&
                  test_type_name !== 'Practice Test' &&
                  !getTestStatus()
                }
                onClick={() => {
                  // Object.entries(localStorage).forEach(([key, value]) => {
                  //   if (key?.startsWith('assessment-')) {
                  //     localStorage.removeItem(key);
                  //   }
                  // });
                  restProps.history.push(
                    `/assessment/${questionPaperId}/${assessmentId}/attempt/`
                  );
                }}
              >
                {test_type_name !== 'Open Test' && test_type_name !== 'Practice Test' ? (
                  getTestStatus() ? (
                    <b style={{ fontSize: '20px' }}>Take Test</b>
                  ) : (
                    'Not Started'
                  )
                ) : (
                  <b style={{ fontSize: '20px' }}>Take Test</b>
                )}
              </Button>
            )}
          </>
        ) : (
          <div>
            {(!showSubmit?.attempted && showSubmit?.is_test_active) ||
            showSubmit?.can_reupload ? (
              <>
                <h5>Upload the image file here.</h5>
                <input
                  className='file-upload-input'
                  type='file'
                  // style={{ display: 'none' }}
                  name='attachments'
                  // accept='.png, .jpg, .jpeg, .mp3, .mp4, .pdf, .PNG, .JPG, .JPEG, .MP3, .MP4, .PDF'
                  accept='.png, .jpg, .jpeg, .PNG, .JPG, .JPEG,'
                  onChange={(e) => {
                    handleFileUpload(e.target.files[0]);
                    e.target.value = null;
                    // onChange('attachments', Array.from(e.target.files)[]);
                  }}
                  ref={fileUploadInput}
                />
                {fileUploadInProgress ? (
                  <div>
                    <CircularProgress
                      color='primary'
                      style={{ width: '25px', height: '25px', margin: '5px' }}
                    />
                  </div>
                ) : (
                  <>
                    <IconButton
                      onClick={() => fileUploadInput.current.click()}
                      title='Attach files'
                      style={{ display: 'none' }}
                    >
                      <Badge
                        badgeContent={attachmentPreviews.length}
                        color='primary'
                        style={{ display: 'none' }}
                      >
                        <AttachFileIcon color='primary' />
                      </Badge>
                    </IconButton>
                    <small className={classes.acceptedfiles}>
                      {' '}
                      Accepted files: .png, .jpg, .jpeg, .PNG, .JPG, .JPEG,
                      {/*sizeValied ? 'Accepted files: jpeg,jpg,mp3,mp4,pdf,png' : 'Document size should be less than 5MB !'*/}
                    </small>
                  </>
                )}
                {attachmentPreviews.length > 0 && (
                  <Grid
                    item
                    xs={12}
                    style={{ width: '44vw' }}
                    className='attachments-grid'
                  >
                    <div className='attachments-list-outer-container'>
                      <div className='prev-btn'>
                        {showPrev && (
                          <IconButton onClick={() => handleScroll('left')}>
                            <ArrowBackIosIcon />
                          </IconButton>
                        )}
                      </div>
                      <SimpleReactLightbox>
                        <div
                          className='attachments-list'
                          ref={attachmentsRef}
                          onScroll={(e) => {
                            e.preventDefault();
                          }}
                        >
                          {attachmentPreviews.map((url, pdfindex) => {
                            console.log('URL', url);
                            let cindex = 0;
                            attachmentPreviews.forEach((item, index) => {
                              if (index < pdfindex) {
                                if (typeof item == 'string') {
                                  cindex = cindex + 1;
                                } else {
                                  cindex = Object.keys(item).length + cindex;
                                }
                              }
                            });
                            if (typeof url == 'object') {
                              return Object.values(url).map((item, i) => {
                                let imageIndex = Object.keys(url)[i];
                                return (
                                  <div className='attachment'>
                                    <Attachment
                                      key={`homework_student_question_attachment_${i}`}
                                      fileUrl={item}
                                      fileName={`Attachment-${i + 1 + cindex}`}
                                      urlPrefix={
                                        url.includes('/lesson_plan_file/')
                                          ? `${endpoints.homework.resourcesS3}`
                                          : `${endpoints.discussionForum.s3}/homework`
                                      }
                                      index={i}
                                      actions={['preview', 'download', 'delete']}
                                      onDelete={(index, deletePdf) => {
                                        removeAttachment(
                                          imageIndex,
                                          pdfindex,
                                          deletePdf,
                                          {
                                            item,
                                          }
                                        );
                                      }}
                                      ispdf={true}
                                    />
                                  </div>
                                );
                              });
                            } else
                              return (
                                <div className='attachment'>
                                  <Attachment
                                    key={`homework_student_question_attachment_${pdfindex}`}
                                    fileUrl={url}
                                    fileName={`Attachment-${1 + cindex}`}
                                    urlPrefix={
                                      url.includes('/lesson_plan_file/')
                                        ? `${endpoints.homework.resourcesS3}`
                                        : `${endpoints.discussionForum.s3}/homework`
                                    }
                                    index={pdfindex}
                                    actions={['preview', 'download', 'delete']}
                                    onDelete={(index, deletePdf) => {
                                      removeAttachment(index, pdfindex, deletePdf);
                                      const images = attachments.filter(
                                        (i) => i !== attachments[pdfindex]
                                      );
                                      setAttachments(images);
                                      const sameImage = allImage.filter(
                                        (i) => i !== allImage[pdfindex]
                                      );
                                      setAllImage(sameImage);
                                    }}
                                    ispdf={false}
                                  />
                                </div>
                              );
                          })}

                          <div style={{ position: 'absolute', visibility: 'hidden' }}>
                            <SRLWrapper>
                              {attachmentPreviews.map((url, i) => {
                                console.log('URLSRL', url);
                                if (typeof url == 'object') {
                                  return Object.values(url).map((item, i) => {
                                    return (
                                      <img
                                        src={
                                          url.includes('/lesson_plan_file/')
                                            ? `${endpoints.homework.resourcesS3}`
                                            : `${endpoints.discussionForum.s3}/homework/${item}`
                                        }
                                        onError={(e) => {
                                          e.target.src = placeholder;
                                        }}
                                        alt={`Attachment-${i + 1}`}
                                      />
                                    );
                                  });
                                } else
                                  return (
                                    <img
                                      src={
                                        url.includes('/lesson_plan_file/')
                                          ? `${endpoints.homework.resourcesS3}`
                                          : `${endpoints.discussionForum.s3}/homework/${url}`
                                      }
                                      onError={(e) => {
                                        e.target.src = placeholder;
                                      }}
                                      alt={`Attachment-${i + 1}`}
                                    />
                                  );
                              })}
                            </SRLWrapper>
                          </div>
                        </div>
                      </SimpleReactLightbox>
                      <div className='next-btn'>
                        {showPrev && (
                          <IconButton onClick={() => handleScroll('right')}>
                            <ArrowForwardIosIcon color='primary' />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  className='attachments-grid'
                  style={{ paddingTop: '20px' }}
                >
                  <Button
                    className={classes.cardStartButton}
                    variant='contained'
                    color='primary'
                    style={{ color: 'white' }}
                    onClick={(e) => {
                      // handleViewMore(questionPaperId);
                      SubmitAssessmentAPI();
                    }}
                  >
                    Submit Assessment
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                {showagain.length > 0 && (
                  <Grid
                    item
                    xs={12}
                    style={{ width: '44vw' }}
                    className='attachments-grid'
                  >
                    <div className='attachments-list-outer-container'>
                      <div className='prev-btn'>
                        {setshowPrevAgain && (
                          <IconButton onClick={() => handleScrollAgain('left')}>
                            <ArrowBackIosIcon />
                          </IconButton>
                        )}
                      </div>
                      <SimpleReactLightbox>
                        <div
                          className='attachments-list'
                          ref={attachmentsInitialRef}
                          onScroll={(e) => {
                            e.preventDefault();
                          }}
                        >
                          {showagain.map((url, pdfindex) => {
                            console.log('URL', url);
                            let cindex = 0;
                            attachmentPreviews.forEach((item, index) => {
                              if (index < pdfindex) {
                                if (typeof item == 'string') {
                                  cindex = cindex + 1;
                                } else {
                                  cindex = Object.keys(item).length + cindex;
                                }
                              }
                            });
                            if (typeof url == 'object') {
                              return Object.values(url).map((item, i) => {
                                let imageIndex = Object.keys(url)[i];
                                return (
                                  <div className='attachment'>
                                    <Attachment
                                      key={`homework_student_question_attachment_${i}`}
                                      fileUrl={item}
                                      fileName={`Attachment-${i + 1 + cindex}`}
                                      urlPrefix={
                                        url.includes('/lesson_plan_file/')
                                          ? `${endpoints.homework.resourcesS3}`
                                          : `${endpoints.discussionForum.s3}/homework`
                                      }
                                      index={i}
                                      actions={['preview']}
                                      // onDelete={(index, deletePdf) =>{
                                      //   removeAttachment(imageIndex, pdfindex, deletePdf, {
                                      //     item,
                                      //   })
                                      // }}
                                      ispdf={true}
                                    />
                                  </div>
                                );
                              });
                            } else
                              return (
                                <div className='attachment'>
                                  <Attachment
                                    key={`homework_student_question_attachment_${pdfindex}`}
                                    fileUrl={url}
                                    fileName={`Attachment-${1 + cindex}`}
                                    urlPrefix={
                                      url.includes('/lesson_plan_file/')
                                        ? `${endpoints.homework.resourcesS3}`
                                        : `${endpoints.discussionForum.s3}/homework`
                                    }
                                    index={pdfindex}
                                    actions={['preview']}
                                    // onDelete={(index, deletePdf) =>{
                                    //   removeAttachment(index, pdfindex, deletePdf)
                                    //   const images = attachments.filter((i)=> i !== attachments[pdfindex])
                                    //   setAttachments(images)
                                    // }}
                                    ispdf={false}
                                  />
                                </div>
                              );
                          })}

                          <div style={{ position: 'absolute', visibility: 'hidden' }}>
                            <SRLWrapper>
                              {showagain.map((url, i) => {
                                console.log('URLSRL', url);
                                if (typeof url == 'object') {
                                  return Object.values(url).map((item, i) => {
                                    return (
                                      <img
                                        src={
                                          url.includes('/lesson_plan_file/')
                                            ? `${endpoints.homework.resourcesS3}`
                                            : `${endpoints.discussionForum.s3}/homework/${item}`
                                        }
                                        onError={(e) => {
                                          e.target.src = placeholder;
                                        }}
                                        alt={`Attachment-${i + 1}`}
                                      />
                                    );
                                  });
                                } else
                                  return (
                                    <img
                                      src={
                                        url.includes('/lesson_plan_file/')
                                          ? `${endpoints.homework.resourcesS3}`
                                          : `${endpoints.discussionForum.s3}/homework/${url}`
                                      }
                                      onError={(e) => {
                                        e.target.src = placeholder;
                                      }}
                                      alt={`Attachment-${i + 1}`}
                                    />
                                  );
                              })}
                            </SRLWrapper>
                          </div>
                        </div>
                      </SimpleReactLightbox>
                      <div className='next-btn'>
                        {showPrevAgain && (
                          <IconButton onClick={() => handleScrollAgain('right')}>
                            <ArrowForwardIosIcon color='primary' />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  </Grid>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {/* <br /> */}
    </div>
  );
  return (
    <Paper elevation={1} className={classes.paper}>
      <div className={classes.testInfo}>
        {fileUploadInProgress && <Loader />}
        {headersUI}
        {isTestAttempted ? assessmentAnalysis : takeTestUI}
        {/* {takeTestUI} */}
      </div>
    </Paper>
  );
};

export default withRouter(QuestionPaperInfo);
