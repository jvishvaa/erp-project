import React, { useEffect, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import { SRLWrapper } from 'simple-react-lightbox';

import Attachment from './attachment';
import endpoints from '../../../config/endpoints';
import placeholder from '../../../assets/images/placeholder_small.jpg';
import { IconButton } from '@material-ui/core';

const SubmittedQuestion = ({
  question,
  onNext,
  onPrev,
  activeQuestion,
  totalQuestions,
}) => {
  const scrollableContainer = useRef(null);
  const handleScroll = (dir) => {
    if (dir === 'left') {
      scrollableContainer.current.scrollLeft -= 150;
    } else {
      scrollableContainer.current.scrollLeft += 150;
      console.log(
        scrollableContainer.current.scrollLeft,
        scrollableContainer.current.scrollRight
      );
    }
  };
  useEffect(() => {
    // if(scrollableContainer.current.offsetWidth > = )
    console.log(
      'scroll width offset width ',
      scrollableContainer.current.offsetWidth,
      scrollableContainer.current.scrollWidth
    );
  }, [scrollableContainer.current]);

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
        <div className='question'>{question.homework_question}</div>
      </div>
      <div className='attachments-container'>
        <Typography component='h4' color='primary' className='header'>
          Attachments
        </Typography>
        <div className='attachments-list-outer-container'>
          <div className='prev-btn'>
            <IconButton onClick={() => handleScroll('left')}>
              <ArrowBackIosIcon />
            </IconButton>
          </div>
          <div
            className='attachments-list'
            ref={scrollableContainer}
            onScroll={(e) => {
              e.preventDefault();
              console.log('scrolled');
            }}
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
                </div>
                <div className='attachment'>
                  <Attachment
                    key={`homework_student_question_attachment_${i}`}
                    fileUrl={url}
                    fileName={`Attachment-${i + 1}`}
                    urlPrefix={`${endpoints.s3}/homework`}
                    index={i}
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
                </div> */}
              </>
            ))}
            <div style={{ position: 'absolute', visibility: 'hidden' }}>
              <SRLWrapper>
                {question.submitted_files.map((url, i) => (
                  <img
                    src={`${endpoints.s3}/homework/${url}`}
                    onError={(e) => {
                      e.target.src = placeholder;
                    }}
                    alt={`Attachment-${i + 1}`}
                  />
                ))}
              </SRLWrapper>
            </div>
          </div>
          <div className='next-btn'>
            <IconButton onClick={() => handleScroll('right')}>
              <ArrowForwardIosIcon color='primary' />
            </IconButton>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%', marginRight: '1rem' }}>
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
            />
          </FormControl>
        </div>
        <div style={{ flexGrow: '1' }}>
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
            />
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default SubmittedQuestion;
