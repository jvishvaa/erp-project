import React, { useState, useEffect, useRef, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';

import Attachment from './attachment';
import endpoints from '../../../config/endpoints';
import placeholder from '../../../assets/images/placeholder_small.jpg';
import { IconButton } from '@material-ui/core';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const SubmittedQuestion = ({
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
}) => {
  const scrollableContainer = useRef(null);
  const submittedAttachmentsOuterContainer = useRef(null);
  const submittedAttachmentsInnerContainer = useRef(null);
  const evaluatedAttachmentsOuterContainer = useRef(null);
  const evaluatedAttachmentsInnerContainer = useRef(null);
  const { setAlert } = useContext(AlertNotificationContext);
  const [showSubmittedAttachmentArrows, setShowSubmittedAttachmentArrows] = useState(
    false
  );
  const [showEvaluatedAttachmentArrows, setShowEvaluatedAttachmentArrows] = useState(
    false
  );

  const handleScroll = (dir) => {
    if (dir === 'left') {
      submittedAttachmentsInnerContainer.current.scrollLeft -= 150;
    } else {
      submittedAttachmentsInnerContainer.current.scrollLeft += 150;
    }
  };
  const handleScrollEvaluated = (dir) => {
    if (dir === 'left') {
      evaluatedAttachmentsInnerContainer.current.scrollLeft -= 150;
    } else {
      evaluatedAttachmentsInnerContainer.current.scrollLeft += 150;
    }
  };
  // useEffect(() => {
  //   // if(scrollableContainer.current.offsetWidth > = )
  //   console.log(
  //     'scroll width offset width ',
  //     scrollableContainer.current.offsetWidth,
  //     scrollableContainer.current.scrollWidth
  //   );
  // }, [scrollableContainer.current]);

  useEffect(() => {
    // console.log(
    //   'scroll widths outer inner ',
    //   submittedAttachmentsInnerContainer.current.clientWidth,
    //   submittedAttachmentsInnerContainer.current.scrollWidth
    // );

    // console.log(
    //   'scroll widths outer inner ',
    //   submittedAttachmentsOuterContainer.current.scrollWidth,
    //   submittedAttachmentsInnerContainer.current.scrollWidth
    // );
    if (submittedAttachmentsInnerContainer.current) {
      console.log(
        'submittedscroll widths outer inner ',
        submittedAttachmentsOuterContainer.current.clientWidth,
        submittedAttachmentsInnerContainer.current.scrollWidth
      );
      if (
        submittedAttachmentsInnerContainer.current.clientWidth <
        submittedAttachmentsInnerContainer.current.scrollWidth
      ) {
        setShowSubmittedAttachmentArrows(true);
      } else {
        setShowSubmittedAttachmentArrows(false);
      }
    }
    if (evaluatedAttachmentsInnerContainer.current) {
      console.log(
        'evaluated scroll widths outer inner ',
        evaluatedAttachmentsInnerContainer.current.clientWidth,
        evaluatedAttachmentsInnerContainer.current.scrollWidth
      );
      if (
        evaluatedAttachmentsInnerContainer.current.clientWidth <
        evaluatedAttachmentsInnerContainer.current.scrollWidth
      ) {
        setShowEvaluatedAttachmentArrows(true);
      } else {
        setShowEvaluatedAttachmentArrows(false);
      }
    }
  }, [correctedQuestions.length, question.submitted_files.length]);

  const onEvaluate = () => {
    // if (correctedQuestions.length < question.submitted_files.length) {
    //   setAlert('error', 'Please evaluate all attachments');
    // } else {
    evaluateAnswer();
    // }
  };

  return (
    <div className='homework-question-container' key={`homework_student_question_${1}`}>
      <div
        className='button-container'
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Typography
          component='h5'
          style={{ marginRight: '1rem' }}
        >{`${activeQuestion}/${totalQuestions}`}</Typography>
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
      </div>
      <div className='homework-question'>
        <div className='question'>{question.question}</div>
      </div>
      <div className='attachments-container'>
        <Typography component='h4' color='primary' className='header'>
          Attachments
        </Typography>
        <div
          className='attachments-list-outer-container'
          ref={submittedAttachmentsOuterContainer}
        >
          <div className='prev-btn'>
            {showSubmittedAttachmentArrows && (
              <IconButton onClick={() => handleScroll('left')}>
                <ArrowBackIosIcon />
              </IconButton>
            )}
          </div>
          <SimpleReactLightbox>
            <div
              className='attachments-list'
              // ref={scrollableContainer}
              onScroll={(e) => {
                e.preventDefault();
                console.log('scrolled');
              }}
              ref={submittedAttachmentsInnerContainer}
            >
              {question.submitted_files.map((url, i) => (
                <>
                  <div className='attachment'>
                    <Attachment
                      key={`homework_student_question_attachment_${i}`}
                      fileUrl={url}
                      fileName={`Attachment-${i + 1}`}
                      urlPrefix={`${endpoints.s3}/homework`}
                      index={i}
                      actions={['preview', 'download', 'pentool']}
                      onOpenInPenTool={onOpenInPenTool}
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
                  {question.submitted_files.map((url, i) => (
                    <img
                      src={`${endpoints.s3}/homework/${url}`}
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
            {showSubmittedAttachmentArrows && (
              <IconButton onClick={() => handleScroll('right')}>
                <ArrowForwardIosIcon color='primary' />
              </IconButton>
            )}
          </div>
        </div>
      </div>
      {correctedQuestions.length > 0 && (
        <div className='attachments-container'>
          <Typography component='h4' color='primary' className='header'>
            Evaluated
          </Typography>
          <div
            className='attachments-list-outer-container'
            ref={evaluatedAttachmentsOuterContainer}
          >
            <div className='prev-btn'>
              {showEvaluatedAttachmentArrows && (
                <IconButton onClick={() => handleScrollEvaluated('left')}>
                  <ArrowBackIosIcon />
                </IconButton>
              )}
            </div>
            <SimpleReactLightbox>
              <div
                className='attachments-list'
                // ref={scrollableContainer}
                onScroll={(e) => {
                  e.preventDefault();
                  console.log('scrolled');
                }}
                ref={evaluatedAttachmentsInnerContainer}
              >
                {correctedQuestions.map((url, i) => (
                  <>
                    <div className='attachment'>
                      <Attachment
                        key={`homework_student_question_attachment_${i}`}
                        fileUrl={url}
                        fileName={`Attachment-${i + 1}`}
                        urlPrefix={`${endpoints.s3}/homework`}
                        index={i}
                        actions={['preview', 'delete', 'download']}
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
                        src={`${endpoints.s3}/homework/${url}`}
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
              {showEvaluatedAttachmentArrows && (
                <IconButton onClick={() => handleScrollEvaluated('right')}>
                  <ArrowForwardIosIcon color='primary' />
                </IconButton>
              )}
            </div>
          </div>
        </div>
      )}
      <div className='comments-remarks-container' style={{ display: 'flex' }}>
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
              onChange={(e) => onChangeQuestionsState('comments', e.target.value)}
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
              onChange={(e) => onChangeQuestionsState('remarks', e.target.value)}
            />
          </FormControl>
        </div>
      </div>
      <div className='evaluate-answer-btn-container'>
        <Button variant='contained' color='primary' onClick={onEvaluate}>
          EVALUATE ANSWER
        </Button>
      </div>
    </div>
  );
};

export default SubmittedQuestion;
