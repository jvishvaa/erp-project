import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import { IconButton, Typography } from '@material-ui/core';

import Attachment from './attachment';
import endpoints from '../../../config/endpoints';
import placeholder from '../../../assets/images/placeholder_small.jpg';

const ViewHomeworkQuestion = ({ question, index }) => {

  const [showAttachmentArrows, setShowAttachmentArrows] = useState(false);
  const scrollableContainer = useRef(null);
  const attachmentsOuterContainer = useRef(null);

  const handleScroll = (dir) => {
    if (dir === 'left') {
      scrollableContainer.current.scrollLeft -= 150;
    } else {
      scrollableContainer.current.scrollLeft += 150;
    }
  };

  useLayoutEffect(() => {
  
    if (scrollableContainer.current) {
      if (
        scrollableContainer.current.clientWidth < scrollableContainer.current.scrollWidth
      ) {
        setShowAttachmentArrows(true);
      } else {
        setShowAttachmentArrows(false);
      }
    }
  }, [question]);

  return (
    <div
      className='homework-question-container'
      key={`homework_student_question_${index}`}
    >
      <div className='homework-question'>
        <div className='question'>{question.question}</div>
      </div>
      <div className='attachments-container'>
        <Typography component='h4' color='primary' className='header'>
          Attachments
        </Typography>
        <div className='attachments-list-outer-container'>
          <div className='prev-btn'>
            {showAttachmentArrows && (
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
              {question.question_files.map((url, i) => {
                 if (typeof url == 'object') {
                    return Object.values(url).map((item, i) => {
                  return <div className='attachment'>
                    <Attachment
                      key={`homework_student_question_attachment_${i}`}
                      fileUrl={item}
                      fileName={`Attachment-${i + 1}`}
                      urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                      index={i}
                      actions={['preview', 'download']}
                    />
                  </div>
                    })}
                    else  return <div className='attachment'>
                    <Attachment
                      key={`homework_student_question_attachment_${i}`}
                      fileUrl={url}
                      fileName={`Attachment-${i + 1}`}
                      urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                      index={i}
                      actions={['preview', 'download']}
                    />
                  </div> 
                
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
                  {question.question_files.map((url, i) => {
                    if (typeof url == 'object') {
                      return Object.values(url).map((item, i) => {
                    return <img
                      src={`${endpoints.discussionForum.s3}/homework/${item}`}
                      onError={(e) => {
                        e.target.src = placeholder;
                      }}
                      alt={`Attachment-${i + 1}`}
                      style={{ width: '0', height: '0' }}
                    />
                    })}
                    else return <img
                    src={`${endpoints.discussionForum.s3}/homework/${url}`}
                    onError={(e) => {
                      e.target.src = placeholder;
                    }}
                    alt={`Attachment-${i + 1}`}
                    style={{ width: '0', height: '0' }}
                  />
                  })}
                </SRLWrapper>
              </div>
            </div>
          </SimpleReactLightbox>
          <div className='next-btn'>
            {showAttachmentArrows && (
              <IconButton onClick={() => handleScroll('right')}>
                <ArrowForwardIosIcon color='primary' />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHomeworkQuestion;
