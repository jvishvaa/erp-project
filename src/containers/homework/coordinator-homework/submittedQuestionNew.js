import React, { useEffect, useRef, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
// import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';

import Attachment from './attachment';
import endpoints from '../../../config/endpoints';
import placeholder from '../../../assets/images/placeholder_small.jpg';
import { IconButton } from '@material-ui/core';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Button } from 'antd';

const SubmittedQuestionNew = ({
  question,
  onNext,
  onPrev,
  activeQuestion,
  totalQuestions,
  onOpenInPenTool,
  correctedQuestions,
  onDeleteCorrectedAttachment,
  onChangeQuestionsState,
  evaluateAnswer,
  remark,
  comment,
  alreadyCorrectedQuestions,
}) => {
  const scrollableContainer = useRef(null);
  const { setAlert } = useContext(AlertNotificationContext);

  const handleScroll = (dir) => {
    if (dir === 'left') {
      scrollableContainer.current.scrollLeft -= 150;
    } else {
      scrollableContainer.current.scrollLeft += 150;
     
    }
  };
  useEffect(() => {
    // if(scrollableContainer.current.offsetWidth > = )
   
  }, [scrollableContainer.current]);

  const onEvaluate = () => {
    // if (correctedQuestions.length < question.submitted_files.length) {
    //   setAlert('error', 'Please evaluate all attachments');
    // } else {
    evaluateAnswer();
    // }
  };

  return (
    <div
      className='homework-question-container-coordinator'
      key={`homework_student_question_${1}`}
    >
      <div className='d-flex justify-content-between' >
      <div className='th-13 col-md-8 th-br-10' style={{background: '#eef2f8'}} >
        <div className='p-4 th-14 th-fw-600'>Question {activeQuestion} : {question.question}</div>
      </div>
      <div
        className='button-container col-md-4'
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <p className='th-14 th-fw-600 mx-2' style={{border: '1px solid #c3c3c3', display: 'flex' , justifyContent: 'center' , alignItems: 'center' ,width: '40px' , height: '25px' ,background: '#d1d1d1', borderRadius: '10px' }}
        >{`${activeQuestion}/${totalQuestions}`}</p>
        {totalQuestions > 1 && (
          <>
            <Button
              variant='contained'
              color='primary'
              onClick={onPrev}
              style={{ marginRight: '0.5rem' }}
              size='small'
            >
              Previous
            </Button>
            <Button variant='contained' size='small' color='primary' onClick={onNext}>
              Next
            </Button>
          </>
        )}

      </div>
      </div>
      <div className='attachments-container'>
        <div className='col-md-8 my-2 p-2 th-14 th-fw-600 th-br-10' style={{background: '#eef2f8' , borderBottom: '1px solid grey'}} >
          Attachments
        </div>
        <div className='attachments-list-outer-container'>
          <div className='prev-btn'>
            <IconButton onClick={() => handleScroll('left')}>
              <ArrowBackIosIcon />
            </IconButton>
          </div>
          <SimpleReactLightbox>
            <div
              className='attachments-list'
              ref={scrollableContainer}
              onScroll={(e) => {
                e.preventDefault();
              }}
            >
              {question.submitted_files.map((url, i) => {
                const actions = ['preview', 'download'];
                if (!alreadyCorrectedQuestions.includes(url)) {
                  actions.push('pentool');
                }
                return (
                  <>
                    <div className='attachment'>
                      <Attachment
                        key={`homework_student_question_attachment_${i}`}
                        fileUrl={url}
                        fileName={`Attachment-${i + 1}`}
                        urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                        index={i}
                        actions={['preview', 'download', 'pentool']}
                        onOpenInPenTool={onOpenInPenTool}
                      />
                    </div>
                  </>
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
                  {question.submitted_files.map((url, i) => (
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
            <IconButton onClick={() => handleScroll('right')}>
              <ArrowForwardIosIcon color='primary' />
            </IconButton>
          </div>
        </div>
      </div>
      {correctedQuestions.length > 0 && (
        <div className='attachments-container'>
          <Typography component='h4' color='primary' className='header'>
            Evaluated
          </Typography>
          <div className='attachments-list-outer-container'>
            <div className='prev-btn'>
              <IconButton onClick={() => handleScroll('left')}>
                <ArrowBackIosIcon />
              </IconButton>
            </div>
            <SimpleReactLightbox>
              <div
                className='attachments-list'
                // ref={scrollableContainer}
                onScroll={(e) => {
                  e.preventDefault();
                }}
              >
                {correctedQuestions.map((url, i) => (
                  <>
                    <div className='attachment'>
                      <Attachment
                        key={`homework_student_question_attachment_${i}`}
                        fileUrl={url}
                        fileName={`Attachment-${i + 1}`}
                        urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                        index={i}
                        actions={['preview', 'download', 'delete']}
                        onOpenInPenTool={onOpenInPenTool}
                        onDelete={onDeleteCorrectedAttachment}
                      />
                    </div>
                    {/* <div className='attachment'>
                  <Attachment
                    key={`homework_student_question_attachment_${i}`}
                    fileUrl={url}
                    fileName={`Attachment-${i + 1}`}
                    urlPrefix={`${endpoints.s3}/homework`}
                    index={i}
                  />
                </div>
                <div className='attachment'>
                  <Attachment
                    key={`homework_student_question_attachment_${i}`}
                    fileUrl={url}
                    fileName={`Attachment-${i + 1}`}
                    urlPrefix={`${endpoints.s3}/homework`}
                    index={i}
                  />
                </div> */}
                    {/* <div className='attachment'>
                  <Attachment
                    key={`homework_student_question_attachment_${i}`}
                    fileUrl={url}
                    fileName={`Attachment-${i + 1}`}
                    urlPrefix={`${endpoints.s3}/homework`}
                    index={i}
                  />
                </div> */}
                  </>
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
                    {correctedQuestions.map((url, i) => (
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
              <IconButton onClick={() => handleScroll('right')}>
                <ArrowForwardIosIcon color='primary' />
              </IconButton>
            </div>
          </div>
        </div>
      )}
      <div className='comments-remarks-container' style={{ display: 'flex' }}>
        {/* <div className='item comment'>
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
              value={comment}
              onChange={(e) => onChangeQuestionsState('comments', e.target.value)}
            />
          </FormControl>
        </div> */}
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
              value={remark}
              onChange={(e) => onChangeQuestionsState('remarks', e.target.value)}
            />
          </FormControl>
        </div>
      </div>
      <div className='evaluate-answer-btn-container'>
        <Button variant='contained' color='primary' onClick={onEvaluate}>
          SAVE
        </Button>
      </div>
    </div>
  );
};

export default SubmittedQuestionNew;
