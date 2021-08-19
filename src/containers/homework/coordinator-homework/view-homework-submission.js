/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  IconButton,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';

import Attachment from './attachment';
import endpoints from '../../../config/endpoints';

import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

import {
  fetchSubmittedHomeworkDetails,
  evaluateHomework,
  uploadFile,
  finalEvaluationForHomework,
} from '../../../redux/actions';

import SubmittedQuestion from './submitted-question';
import DescriptiveTestcorrectionModule from '../../../components/EvaluationTool';
import placeholder from '../../../assets/images/placeholder_small.jpg';

const useStyles = makeStyles((theme) => ({
  attachmentIcon: {
    color: '#ff6b6b',
    marginLeft: '4%',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  fileInput: {
    fontSize: '50px',
    position: 'absolute',
    width: '20%',
    top: 0,
    bottom: 0,
    opacity: 0,
  },
  fileRow: {
    padding: '6px',
  },
  modalButtons: {
    position: 'sticky',
    width: '98%',
    margin: 'auto',
    bottom: 0,
  },
  navCard:{
    border : `1px solid ${theme.palette.primary.main}`
  },
  homeworkblock:{
    color : theme.palette.secondary.main,
    fontWeight: 600
  },
   headerText: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
    fontSize: "1rem",
    ['@media screen(min-width:768px)']: {
      fontSize: "0.85rem",
    }
  },
  homeworkSubmitwrapper:{
    border: `1px solid ${theme.palette.primary.main}`,  
    borderRadius: "10px",
    padding: "20px",
    ['@media screen(min-width:768px)']: {
      margin: "10px",
      width: "90% !important",
      height: "auto !important",
    }
  }
}));

const ViewHomework = withRouter(
  ({
    history,
    homework,
    setViewHomework,
    getHomeworkDetails,
    selectedHomeworkDetails,
    onClose,
    getSubmittedHomeworkDetails,
    submittedHomeworkDetails,
    totalSubmittedQuestions,
    isQuestionwise,
    collatedSubmissionFiles,
    ...props
  }) => {
    const { setAlert } = useContext(AlertNotificationContext);
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    const classes = useStyles();
    const { date, subject, studentHomeworkId } = homework || {};
    const [activeQuestion, setActiveQuestion] = useState(1);
    const [questionsState, setQuestionsState] = useState([]);
    const [collatedQuestionState, setCollatedQuestionState] = useState({});
    const [penToolOpen, setPenToolOpen] = useState(false);
    const [penToolUrl, setPenToolUrl] = useState('');
    const [remark, setRemark] = useState(null);
    const [score, setScore] = useState(null);
    const [homeworkId, setHomeworkId] = useState(null);
    const [currentEvaluatedFileName, setcurrentEvaluatedFileName] = useState(null);

    const scrollableContainer = useRef(null);

    const handleScroll = (dir) => {
      if (dir === 'left') {
        scrollableContainer.current.scrollLeft -= 150;
      } else {
        scrollableContainer.current.scrollLeft += 150;
       
      }
    };

    const openInPenTool = (url, fileName) => {
      setPenToolUrl(url);
      setcurrentEvaluatedFileName(fileName);

      // setPenToolOpen(true);
    };

    const handleFinalEvaluationForHomework = async () => {
      const reqData = {
        remark,
        score,
      };
      if (!remark) {
        setAlert('error', 'Please provide a remark');
        return;
      }
      //  else if (reqData.remark && reqData.remark.trim() == '') {
      //   setAlert('error', 'Please provide a remark');
      //   return;
      // }
      
      if (!score) {
        setAlert('error', 'Please provide a score');
        return;
      }
      // else if (reqData.score && reqData.score.trim() == '') {
      //   setAlert('error', 'Please provide a score');
      //   return;
      // }
      try {
        await finalEvaluationForHomework(homeworkId, reqData);
        setAlert('success', 'Homework Evaluated');
        onClose();
      } catch (e) {
        setAlert('error', 'Homework Evaluation Failed');
      }
    };

    const evaluateAnswer = async () => {
      let currentQuestion;
      if (isQuestionwise) {
        currentQuestion = questionsState[activeQuestion - 1];
      } else {
        currentQuestion = collatedQuestionState;

        // if (
        //   currentQuestion.corrected_submission.length < collatedSubmissionFiles.length
        // ) {
        //   setAlert('error', 'Please evaluate all the attachments');
        //   return;
        // }
      }
      const { id, ...reqData } = currentQuestion;
      try {
        await evaluateHomework(id, reqData);
        setAlert('success', 'Evaluation Successfull');
      } catch (e) {
        setAlert('error', 'Evaluation failed');
      }
    };

    const handleChangeQuestionState = (fieldName, value) => {
      const index = activeQuestion - 1;
      const currentQuestion = questionsState[index];
      currentQuestion[fieldName] = value;
      setQuestionsState([
        ...questionsState.slice(0, index),
        currentQuestion,
        ...questionsState.slice(index + 1),
      ]);
    };

    const deleteEvaluated = (index) => {
      if (isQuestionwise) {
        const currentQuestion = questionsState[activeQuestion - 1];
        const valueToRemove = currentQuestion.corrected_submission[index];
        currentQuestion.corrected_submission = currentQuestion.corrected_submission.filter(
          function (item) {
            return item !== valueToRemove;
          }
        );
        setQuestionsState([...questionsState, currentQuestion]);
      } else {
        const currentQuestion = { ...collatedQuestionState };
        currentQuestion.corrected_submission.splice(index, 1);
        setCollatedQuestionState(currentQuestion);
      }
    };

    const handleSaveEvaluatedFile = async (file) => {
      const fd = new FormData();
      fd.append('file', file);
      const filePath = await uploadFile(fd);
      if (isQuestionwise) {
        const index = activeQuestion - 1;
        const modifiedQuestion = { ...questionsState[index] };
        modifiedQuestion.corrected_submission.push(filePath);
        modifiedQuestion.evaluated_files.push(currentEvaluatedFileName);

        const newQuestionsState = [
          ...questionsState.slice(0, index),
          modifiedQuestion,
          ...questionsState.slice(index + 1),
        ];
        setQuestionsState(newQuestionsState);
      } else {
        const modifiedQuestion = collatedQuestionState;
        modifiedQuestion.corrected_submission.push(filePath);
        modifiedQuestion.evaluated_files.push(currentEvaluatedFileName);

        setCollatedQuestionState(modifiedQuestion);
      }
      setPenToolUrl(null);
      setcurrentEvaluatedFileName(null);
    };

    const handleCloseCorrectionModal = () => {
      setPenToolUrl('');

      // setPenToolOpen(false);
    };

    const fetchHomeworkDetails = async () => {
      const data = await getSubmittedHomeworkDetails(studentHomeworkId);

      const { hw_questions: hwQuestions, is_question_wise: isQuestionwise, overall_remark: overallRemarks, score: scores,  id } = data;
      setHomeworkId(id);
      setRemark(overallRemarks);
      setScore(scores);

      if (isQuestionwise) {
        const initialQuestionsState = hwQuestions.map((q) => ({
          id: q.id,
          remarks: q.remark,
          comments: q.comment,
          corrected_submission: q.corrected_files,
          evaluated_files: q.evaluated_files,
        }));
        setQuestionsState(initialQuestionsState);
      } else {
        setCollatedQuestionState({
          id: hwQuestions.id,
          corrected_submission: hwQuestions.corrected_files,
          evaluated_files: hwQuestions.evaluated_files,
          remarks: hwQuestions.remark,
          comments: hwQuestions.comment,
        });
      }
    };

    const handleCollatedQuestionState = (field, value) => {
      setCollatedQuestionState((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
      fetchHomeworkDetails();
    }, []);

    useEffect(() => {
      if (penToolUrl) {
        setPenToolOpen(true);
      } else {
        setPenToolOpen(false);
      }
    }, [penToolUrl]);

    const mediaContent = {
      file_content: penToolUrl,
      // file_content:
      //   'https://erp-revamp.s3.ap-south-1.amazonaws.com/homework/2020-12-14%2013:58:08.817012_Screenshot%20from%202020-11-18%2015-16-37.png',
      // file_content:
      //   'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg',
      id: 1,
      splitted_media: null,
    };
    const desTestDetails = [{ asessment_response: { evaluvated_result: '' } }];

    return (
      <div className='view-homework-container-coordinator create_group_filter_container'>
        <Grid container spacing={2} className='message_log_container'>
          <Grid item xs={12} className='add-homework-title-container' md={2}>
            <div className='nav-cards-container'>
              <div className={` ${classes.navCard} nav-card`}
                onClick={onClose}>
                <div className={` ${classes.headerText} text-center non_selected_homework_type_item`}>
                  All Homeworks
                </div>
              </div>
              <div className={` ${classes.navCard} nav-card`}
>
                <div className={` ${classes.headerText} text-center`}>{date}</div>
                <div className={` ${classes.headerText} text-center`}>{subject?.split('_')[1]}</div>
                <div className={` ${classes.headerText} text-center`}>{subject?.split('_')[2]}</div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={10}>
            <div className={classes.homeworkSubmitwrapper}>
              <div className='homework_block_wrapper'>
                <div className={`${classes.homeworkblock} homework_submit_tag`}>
                  Homework - {subject?.split('_')[2]}, {date}
                </div>
              </div>

              {isQuestionwise && submittedHomeworkDetails?.length && (
                <SubmittedQuestion
                  question={submittedHomeworkDetails[activeQuestion - 1]}
                  correctedQuestions={
                    questionsState.length
                      ? questionsState[activeQuestion - 1].corrected_submission
                      : []
                  }
                  alreadyCorrectedQuestions={
                    questionsState.length
                      ? questionsState[activeQuestion - 1].evaluated_files
                      : []
                  }
                  remark={
                    questionsState.length
                      ? questionsState[activeQuestion - 1].remarks
                      : []
                  }
                  comment={
                    questionsState.length
                      ? questionsState[activeQuestion - 1].comments
                      : []
                  }
                  activeQuestion={activeQuestion}
                  totalQuestions={totalSubmittedQuestions}
                  onNext={() => {
                    setActiveQuestion((prev) =>
                      prev < totalSubmittedQuestions ? prev + 1 : prev
                    );
                  }}
                  onPrev={() => {
                    setActiveQuestion((prev) => (prev > 1 ? prev - 1 : prev));
                  }}
                  onOpenInPenTool={openInPenTool}
                  onDeleteCorrectedAttachment={deleteEvaluated}
                  onChangeQuestionsState={handleChangeQuestionState}
                  evaluateAnswer={evaluateAnswer}
                />
              )}

              {!isQuestionwise &&
                submittedHomeworkDetails?.length &&
                submittedHomeworkDetails.map((question) => (
                  <div
                    className='homework-question-container-coordinator'
                    key={`homework_student_question_${1}`}
                  >
                    <div className='homework-question'>
                      <div className='question'>{question.question}</div>
                    </div>
                  </div>
                ))}
              {!isQuestionwise && (
                <>
                  {collatedSubmissionFiles?.length && (
                    <div className='attachments-container with-margin'>
                      <Typography component='h4' color='primary' className='header'>
                        Attachments
                      </Typography>
                      <div className='attachments-list-outer-container'>
                        <div className='prev-btn'>
                          {collatedSubmissionFiles.length > 2 && (
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
                            {collatedSubmissionFiles.map((url, i) => (
                              <div className='attachment'>
                                <Attachment
                                  key={`homework_student_question_attachment_${i}`}
                                  fileUrl={url}
                                  fileName={`Attachment-${i + 1}`}
                                  urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                                  index={i}
                                  actions={['preview', 'download', 'pentool']}
                                  onOpenInPenTool={openInPenTool}
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
                          {collatedSubmissionFiles.length > 2 && (
                            <IconButton onClick={() => handleScroll('right')}>
                              <ArrowForwardIosIcon color='primary' />
                            </IconButton>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {collatedQuestionState.corrected_submission?.length > 0 && (
                    <div className='attachments-container with-margin'>
                      <Typography component='h4' color='primary' className='header'>
                        Evaluated Attachments
                      </Typography>
                      <div className='attachments-list-outer-container'>
                        <div className='prev-btn'>
                          {collatedQuestionState.corrected_submission?.length > 2 && (
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
                            {collatedQuestionState.corrected_submission.map((url, i) => (
                              <div className='attachment'>
                                <Attachment
                                  key={`homework_student_question_attachment_${i}`}
                                  fileUrl={url}
                                  fileName={`Attachment-${i + 1}`}
                                  urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                                  index={i}
                                  actions={['preview', 'download', 'delete']}
                                  onOpenInPenTool={openInPenTool}
                                  onDelete={deleteEvaluated}
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
                                {collatedQuestionState.corrected_submission?.length &&
                                  collatedQuestionState.corrected_submission.map(
                                    (url, i) => (
                                      <img
                                        src={`${endpoints.discussionForum.s3}/homework/${url}`}
                                        onError={(e) => {
                                          e.target.src = placeholder;
                                        }}
                                        alt={`Attachment-${i + 1}`}
                                        style={{ width: '0', height: '0' }}
                                      />
                                    )
                                  )}
                              </SRLWrapper>
                            </div>
                          </div>
                        </SimpleReactLightbox>
                        <div className='next-btn'>
                          {collatedQuestionState.corrected_submission?.length > 2 && (
                            <IconButton onClick={() => handleScroll('right')}>
                              <ArrowForwardIosIcon color='primary' />
                            </IconButton>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    className='comments-remarks-container'
                    style={{ display: 'flex', width: '95%', margin: '0 auto' }}
                  >
                    <div className='item comment'>
                      <FormControl variant='outlined' fullWidth size='small'>
                        <InputLabel htmlFor='component-outlined'>Comments</InputLabel>
                        <OutlinedInput
                          id='comments'
                          name='comments'
                          inputProps={{ maxLength: 150 }}
                          multiline
                          rows={3}
                          rowsMax={4}
                          label='Comments'
                          value={collatedQuestionState?.comments || ''}
                          onChange={(e) => {
                            handleCollatedQuestionState('comments', e.target.value);
                          }}
                          autoFocus
                        />
                      </FormControl>
                    </div>
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
              )}
            </div>
            <div className='overall-evaluation-container'>
              <div className='input-container'>
                <div className='remark'>
                  <FormControl variant='outlined' fullWidth size='small'>
                    {/*
                    <InputLabel htmlFor='component-outlined'>Overall remarks</InputLabel>
                    <OutlinedInput
                      id='remarks'
                      name='remarks'
                      label='Overall remarks'
                      onChange={(e) => {
                        setRemark(e.target.value);
                      }}
                      value={remark}
                    />
                    */}
                    <TextField
                      id='remarks'
                      name='remarks'
                      label='Overall remarks'
                      variant='outlined'
                      size='small'
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => {
                        setRemark(e.target.value);
                      }}
                      value={remark}
                    />
                  </FormControl>
                </div>
                <div className='score' style={{ marginTop: 10 }}>
                  <FormControl variant='outlined' fullWidth size='small'>
                    {/*
                    <InputLabel htmlFor='component-outlined'>Overall score</InputLabel>
                    <OutlinedInput
                      id='score'
                      name='score'
                      label='Overall score'
                      onChange={(e) => {
                        setScore(e.target.value);
                      }}
                      value={score}
                    />
                    */}
                    <TextField
                      id='score'
                      name='score'
                      label='Overall score'
                      variant='outlined'
                      size='small'
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => {
                        setScore(e.target.value);
                      }}
                      value={score}
                    />
                  </FormControl>
                </div>
              </div>
              <div className='btn-container'>
                <div className='cancel-btn'>
                  <Button variant='contained' className='disabled-btn' onClick={onClose}>
                    Cancel
                  </Button>
                </div>
                <div className='done-btn'>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleFinalEvaluationForHomework}
                  >
                    EVALUATION DONE
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        {penToolOpen && (
          <DescriptiveTestcorrectionModule
            desTestDetails={desTestDetails}
            mediaContent={mediaContent}
            handleClose={handleCloseCorrectionModal}
            alert={undefined}
            open={penToolOpen}
            callBackOnPageChange={() => {}}
            handleSaveFile={handleSaveEvaluatedFile}
          />
        )}
      </div>
    );
  }
);

const mapStateToProps = (state) => ({
  submittedHomeworkDetails: state.teacherHomework.submittedHomeworkDetails,
  totalSubmittedQuestions: state.teacherHomework.totalSubmittedQuestions,
  fetchingSubmittedHomeworkDetails:
    state.teacherHomework.fetchingSubmittedHomeworkDetails,
  isQuestionwise: state.teacherHomework.isQuestionwise,
  collatedSubmissionFiles: state.teacherHomework.collatedSubmissionFiles,
});

const mapDispatchToProps = (dispatch) => ({
  getSubmittedHomeworkDetails: (id) => {
    return dispatch(fetchSubmittedHomeworkDetails(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewHomework);
