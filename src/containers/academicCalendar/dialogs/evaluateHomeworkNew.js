import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  IconButton,
} from '@material-ui/core';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from '../../../components/loader/loader';

import {
  fetchSubmittedHomeworkDetails,
  evaluateHomework,
  uploadFile,
  finalEvaluationForHomework,
} from '../../../redux/actions';
import Attachment from '../../homework/teacher-homework/attachment';
import endpoints from '../../../config/endpoints';
import placeholder from '../../../assets/images/placeholder_small.jpg';
import './styles.scss';
import DescriptiveTestcorrectionModule from '../../../components/EvaluationTool';
const desTestDetails = [{ asessment_response: { evaluvated_result: '' } }];

const EvaluateHomeworkOld = withRouter(
  ({
    fetchingSubmittedHomeworkDetails,
    getSubmittedHomeworkDetails,
    submittedHomeworkDetails,
    ...props
  }) => {
    const { setAlert } = useContext(AlertNotificationContext);
    const [collatedQuestionState, setCollatedQuestionState] = useState({});
    const [collatedSubmissionFiles, setcollatedSubmissionFiles] = useState(
      props?.studentData?.uploaded_file
    );
    const scrollableContainer = useRef(null);
    const scrollableContainerEvaluated = useRef(null);
    const [penToolOpen, setPenToolOpen] = useState(false);
    const [penToolUrl, setPenToolUrl] = useState('');
    const [remark, setRemark] = useState(null);
    const [score, setScore] = useState(null);
    const [homeworkId, setHomeworkId] = useState(props?.homeWorkId);
    const [currentEvaluatedFileName, setcurrentEvaluatedFileName] = useState(null);
    const [imageIndex, setImageIndex] = useState();
    const [loading, setLoading] = useState(false);

    const [studentHomeworkId, setstudentHomeworkId] = useState(
      props?.studentData?.student_homework_id
    );
    const [hwsubmissionID, setHomeworkSubmissionID] = useState();

    useEffect(() => {

      fetchHomeworkDetails();
    }, [props?.studentData?.student_homework_id]);
    const handleFinalEvaluationForHomework = async () => {
      setLoading(true);

      const reqData = {
        remark,
        score,
      };
      if (!remark) {
        setAlert('error', 'Please provide a remark');
        return;
      } else if (reqData.remark && reqData.remark.trim() === '') {
        setAlert('error', 'Please provide a remark');
        return;
      }
      if (!score) {
        setAlert('error', 'Please provide a score');
        return;
      }
      /*
        else if (reqData.score && reqData.score.trim() === '') {
          setAlert('error', 'Please provide a score');
          return;
        } */

      try {
        await finalEvaluationForHomework(studentHomeworkId, reqData);
        setAlert('success', 'Homework Evaluated ');
        setLoading(false);

        return props?.redirect();
      } catch (e) {
        setAlert('error', 'Homework Evaluation Failed');
        setLoading(false);

      }
    };
    const openInPenTool = (url, fileName, i) => {
      setPenToolUrl(url);
      // setcurrentEvaluatedFileName(fileName);
      setImageIndex(i);
    };

    const fetchHomeworkDetails = async () => {
      const data = await getSubmittedHomeworkDetails(studentHomeworkId);
      setHomeworkSubmissionID(data?.hw_questions?.id);
      setCollatedQuestionState({
        id: data?.hw_questions?.id,
        corrected_submission: data?.hw_questions?.corrected_files,
        evaluated_files: data?.hw_questions?.evaluated_files,
        remarks: data?.hw_questions?.remark,
        // comments: '',
        student_comment: data?.hw_questions?.student_comment,
      });
      setRemark(data?.overall_remark);
      setScore(data?.score);
    };

    const evaluateAnswer = async () => {
      let currentQuestion = collatedQuestionState;
      setLoading(true);

      if (currentQuestion.evaluated_files.length < collatedSubmissionFiles.length) {
        setAlert(
          'error',
          `Please evaluate all the attachments ${currentQuestion.corrected_submission.length} < ${collatedSubmissionFiles.length}`
        );
        setLoading(false);
        return;
      }
      const { id, ...reqData } = currentQuestion;
      try {
        await evaluateHomework(id, reqData);
        setAlert('success', 'Saved Successfully');
        setLoading(false);

      } catch (e) {
        setLoading(false);
        setAlert('error', 'Evaluation failed');
      }
    };
    const handleSaveEvaluatedFile = async (file) => {
      const fd = new FormData();
      fd.append('file', file);
      const filePath = await uploadFile(fd);
      const modifiedQuestion = collatedQuestionState;
      modifiedQuestion.corrected_submission.push(filePath);
      //   modifiedQuestion.evaluated_files.push(currentEvaluatedFileName);
      modifiedQuestion.evaluated_files.push(filePath);

      setCollatedQuestionState(modifiedQuestion);

      // }
      setPenToolUrl(null);
      handleCloseCorrectionModal();
    };
    const handleScroll = (dir) => {
      if (dir === 'left') {
        scrollableContainer.current.scrollLeft -= 150;
      } else {
        scrollableContainer.current.scrollLeft += 150;
      }
    };

    const handleCloseCorrectionModal = () => {
      setPenToolUrl('');

      // setPenToolOpen(false);
    };

    const handleScrollEvaluate = (dir) => {
      if (dir === 'left') {
        scrollableContainerEvaluated.current.scrollLeft -= 150;
      } else {
        scrollableContainerEvaluated.current.scrollLeft += 150;
      }
    };
    const handleCollatedQuestionState = (field, value) => {
      setCollatedQuestionState((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
      if (penToolUrl) {
        setPenToolOpen(true);
      } else {
        setPenToolOpen(false);
      }
    }, [penToolUrl]);
    const mediaContent = {
      file_content: penToolUrl,
      id: 1,
      splitted_media: null,
    };
    return (
      <>
        {loading && <Loader />}
        <div className='view-homework-container create_group_filter_container'>
          <div
            style={{ border: '1px solid #576dc5', padding: '20px', borderRadius: '10px' }}
          >
            <div className='homework_block_wrapper no-border'>
              {/* <div className={` ${classes.homeworkblock} homework_submit_tag`}>
                  Homework - {subject && subject}, {date}
                </div> */}
            </div>
            {submittedHomeworkDetails?.length &&
              submittedHomeworkDetails.map((question, i) => (
                <>
                  <div
                    className='homework-question-container'
                    key={`homework_student_question_${1}`}
                  >
                    <div className='homework-question'>
                      <div className='question'>{question.question}</div>
                    </div>
                  </div>
                  <div className='overallContainer'>
                    {collatedQuestionState?.student_comment &&
                      collatedQuestionState.student_comment[i] && (
                        <div
                          className='scoreBox1'
                          style={{ width: '49%', margin: '1%', marginLeft: '2%' }}
                        >
                          Student Comment : {collatedQuestionState.student_comment[i]}
                        </div>
                      )}
                  </div>
                </>
              ))}
            {
              <>
                {collatedSubmissionFiles?.length && (
                  <div className='attachments-container with-margin'>
                    <Typography component='h4' color='primary' className='header'>
                      Attachments
                    </Typography>
                    <div className='attachments-list-outer-container'>
                      <div className='prev-btn'>
                        {collatedSubmissionFiles?.length >= 2 && (
                          <IconButton onClick={() => handleScroll('left')}>
                            <ArrowBackIosIcon />
                          </IconButton>
                        )}
                      </div>
                      <SimpleReactLightbox>
                        <div
                          className='attachments-list'
                          ref={scrollableContainer}
                          onScroll={(e) => {
                            e.preventDefault();
                          }}
                        >
                          {collatedSubmissionFiles.map((url, i) => {
                            const actions = ['preview', 'download'];
                            if (!collatedQuestionState.evaluated_files?.includes(url)) {
                              actions.push('pentool');
                            }

                            return (
                              <div className='attachment'>
                                <Attachment
                                  key={`homework_student_question_attachment_${i}`}
                                  fileUrl={url}
                                  fileName={`Attachment-${i + 1}`}
                                  urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                                  index={i}
                                  actions={actions}
                                  onOpenInPenTool={openInPenTool}
                                />
                              </div>
                            );
                          })}
                          <div
                            style={{
                              position: 'absolute',
                              width: '0',
                              height: '0',
                              visibility: 'hidden',
                            }}
                          >
                            <SRLWrapper>
                              {collatedSubmissionFiles.map((url, i) => (
                                <img
                                  src={`${endpoints.discussionForum.s3}/homework/${url}`}
                                  onError={(e) => {
                                    e.target.src = placeholder;
                                  }}
                                  alt={`Attachment-${i + 1}`}
                                  style={{ width: '0', height: '0' }}
                                />
                              ))}
                            </SRLWrapper>
                          </div>
                        </div>
                      </SimpleReactLightbox>
                      <div className='next-btn'>
                        {collatedSubmissionFiles?.length >= 2 && (
                          <IconButton onClick={() => handleScroll('right')}>
                            <ArrowForwardIosIcon color='primary' />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {collatedQuestionState.evaluated_files?.length > 0 &&
                  (
                    (
                      <div className='attachments-container with-margin'>
                        <Typography component='h4' color='primary' className='header'>
                          Evaluated Attachments
                        </Typography>
                        <div className='attachments-list-outer-container'>
                          <div className='prev-btn'>
                            {collatedQuestionState.evaluated_files?.length > 2 && (
                              <IconButton onClick={() => handleScrollEvaluate('left')}>
                                <ArrowBackIosIcon />
                              </IconButton>
                            )}
                          </div>
                          <SimpleReactLightbox>
                            <div
                              className='attachments-list'
                              ref={scrollableContainerEvaluated}
                              onScroll={(e) => {
                                e.preventDefault();
                              }}
                            >
                              {collatedQuestionState.evaluated_files.map((url, i) => (
                                <div className='attachment'>
                                  <Attachment
                                    key={`homework_student_question_attachment_${i}`}
                                    fileUrl={url}
                                    fileName={`Attachment-${i + 1}`}
                                    urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                                    index={i}
                                    actions={['preview', 'download', 'delete']}
                                    onOpenInPenTool={openInPenTool}
                                  // onDelete={deleteEvaluated}
                                  />
                                </div>
                              ))}
                              <div
                                style={{
                                  position: 'absolute',
                                  width: '0',
                                  height: '0',
                                  visibility: 'hidden',
                                }}
                              >
                                <SRLWrapper>
                                  {collatedQuestionState.evaluated_files?.length &&
                                    collatedQuestionState.evaluated_files.map((url, i) => (
                                      <img
                                        src={`${endpoints.discussionForum.s3}/homework/${url}`}
                                        onError={(e) => {
                                          e.target.src = placeholder;
                                        }}
                                        alt={`Attachment-${i + 1}`}
                                        style={{ width: '0', height: '0' }}
                                      />
                                    ))}
                                </SRLWrapper>
                              </div>{' '}
                            </div>
                          </SimpleReactLightbox>
                          <div className='next-btn'>
                            {collatedQuestionState.evaluated_files?.length > 2 && (
                              <IconButton onClick={() => handleScrollEvaluate('right')}>
                                <ArrowForwardIosIcon color='primary' />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                <div
                  className='comments-remarks-container'
                  style={{ display: 'flex', width: '95%', margin: '0 auto' }}
                >
                  <div className='item'>
                    <FormControl variant='outlined' fullWidth size='small'>
                      <InputLabel htmlFor='component-outlined'>Remarks</InputLabel>
                      <OutlinedInput
                        id='remarks'
                        name='remarks'
                        inputProps={{ maxLength: 150 }}
                        multiline
                        rows={3}
                        rowsMax={4}
                        label='Remarks'
                        value={collatedQuestionState?.remarks || ''}
                        onChange={(e) => {
                          handleCollatedQuestionState('remarks', e.target.value);
                        }}
                        autoFocus
                      />
                    </FormControl>
                  </div>
                </div>
                <div className='evaluate-answer-btn-container'>
                  <Button variant='contained' color='primary' onClick={evaluateAnswer}>
                    SAVE
                  </Button>
                </div>
              </>
            }
          </div>
          <div className='overall-evaluation-container'>
            <div className='input-container'>
              <div className='remark'>
                <FormControl variant='outlined' fullWidth size='small'>
                  <InputLabel htmlFor='component-outlined'>Overall remarks*</InputLabel>
                  <OutlinedInput
                    id='remarks'
                    name='remarks'
                    label='Overall remarks'
                    onChange={(e) => {
                      setRemark(e.target.value);
                    }}
                    value={remark || ''}
                  />
                </FormControl>
              </div>
              <div className='score' style={{ marginTop: 10 }}>
                <FormControl variant='outlined' fullWidth size='small'>
                  <InputLabel htmlFor='component-outlined'>Overall score</InputLabel>
                  <OutlinedInput
                    id='score'
                    name='score'
                    label='Overall score'
                    onChange={(e) => {
                      setScore(e.target.value);
                    }}
                    value={score || ''}
                  />
                </FormControl>
              </div>
            </div>
            <div className='btn-container'>
              <div className='button-container'>
                <span className='cancel-btn'>
                  <Button
                    variant='contained'
                    className='disabled-btn'
                    onClick={() => props?.redirect()}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleFinalEvaluationForHomework}
                    style={{ marginLeft: '10px' }}
                  >
                    EVALUATION DONE
                  </Button>
                </span>
              </div>
            </div>
          </div>
        </div>
        {penToolOpen && (
          <DescriptiveTestcorrectionModule
            index={imageIndex}
            urlPrefix={`${endpoints.discussionForum.s3}/homework`}
            fileUrl={collatedSubmissionFiles}
            // savedFiles={savedFiles}
            desTestDetails={desTestDetails}
            mediaContent={mediaContent}
            handleClose={handleCloseCorrectionModal}
            alert={undefined}
            open={penToolOpen}
            callBackOnPageChange={() => { }}
            handleSaveFile={handleSaveEvaluatedFile}
          // setImage={setImage}
          />
        )}
      </>
    );
  }
);
const mapStateToProps = (state) => ({
  submittedHomeworkDetails: state.teacherHomework.submittedHomeworkDetails,
  // totalSubmittedQuestions: state.teacherHomework.totalSubmittedQuestions,
  fetchingSubmittedHomeworkDetails:
    state.teacherHomework.fetchingSubmittedHomeworkDetails,
  // isQuestionwise: state.teacherHomework.isQuestionwise,
  // collatedSubmissionFiles: state.teacherHomework.collatedSubmissionFiles,
});

const mapDispatchToProps = (dispatch) => ({
  getSubmittedHomeworkDetails: (id) => {
    return dispatch(fetchSubmittedHomeworkDetails(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EvaluateHomeworkOld);
