/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { IconButton } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import { AttachmentPreviewerContext } from '../attachment-previewer-contexts';
import './attachment-previewer-ui-styles.css';

function AttachmentPreviewerUI() {
  const {
    attachments = [],
    closePreview,
    currentAttachmentIndex,
    controls: { isOpen, next, prev, isNextAvailable, isPrevAvailable },
  } = React.useContext(AttachmentPreviewerContext) || {};
  const { extension, src = '', name } = (attachments || [])[currentAttachmentIndex] || {};

  const pptFileSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${src}`;
  const isPPt = String(src.split('.')[src.split('.').length - 1])
    .toLowerCase()
    .includes('ppt');
  const imageFileFormats = [
    '.tif',
    '.tiff',
    '.bmp',
    '.jpg',
    '.jpeg',
    '.gif',
    '.png',
    '.eps',
    '.raw',
    '.cr2',
    '.nef',
    '.orf',
    '.sr2',
  ];
  // const audioVideoFileFormats = [
  //   '.flv',
  //   '.mp4',
  //   '.m3u8',
  //   '.ts',
  //   '.3gp',
  //   '.mov',
  //   '.avi',
  //   '	.wmv',
  //   //
  //   '.wav',
  //   '.mp3',
  //   '.au',
  //   '.snd',
  // ];
  if (!isOpen) return null;
  
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  }, false);

  const previewerUI = (
    <>
      <div className='attachment-viewer' key={src}>
        <div className='attachment-viewer-header'>
          <div className='attachment-viewer-header-close-icon'>
            <IconButton onClick={closePreview} aria-label='close' size='small'>
              <CloseIcon style={{ color: 'white' }} fontSize='inherit' />
            </IconButton>
          </div>
        </div>
        <div className='attachment-viewer-frames'>
          <div className='attachment-viewer-frame'>
            <div className='attachment-viewer-frame-preview-wrapper'>
              {imageFileFormats.includes(extension) ? (
                <div className='attachment-viewer-frame-preview attachment-viewer-frame-preview-image-wrapper'>
                  <img
                    alt='sd'
                    className='attachment-viewer-frame-preview-image'
                    src={src}
                  />
                </div>
              ) : src.endsWith('.mp4') || src.endsWith('.mp3') ? (
                <video
                  id='attachment-iframe'
                  style={{
                    width: '100%',
                    objectFit: 'contain',
                    height: '80vh',
                    // height: fullscreen ? '92vh' : '69vh',
                  }}
                  controls
                  autoPlay
                  controlsList='nodownload'
                >
                  {src.endsWith('.mp4') ? (
                    <source src={src} type='video/mp4' />
                  ) : (
                    <source src={src} type='audio/mp3' />
                  )}
                  {/* <source src='mov_bbb.ogg' type='video/ogg' /> */}
                  Your browser does not support HTML5 video.
                </video>
              ) : (
                <iframe
                  id='attachment-iframe'
                  title='attachment-iframe'
                  src={isPPt ? pptFileSrc : `${src}#toolbar=0&navpanes=0&scrollbar=0`}
                  className='attachment-viewer-frame-preview-iframe'
                />
              )}
              {/* <p className='attachment-viewer-frame-preview-placeholder'>
                There is no preview available for this attachment.
                <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://trello-attachments.s3.amazonaws.com/6019233e97c6e58477f2621f/602234c24df242896848ffb1/bd1cd4a0e00622346d164ee34a767b3b/Screenshot_from_2021-02-26_12-20-09.png'
                className='attachment-viewer-frame-preview-placeholder-link'
                >
                Open in New Tab | Download
                </a>
              </p> */}
              {/* <div style={{ margin: 50 }}>.</div> */}
            </div>
          </div>
        </div>
        {/* <div className='attachment-viewer-overlay'>
          <div className='attachment-viewer-frame-details'>
          <div className='attachment-viewer-frame-details '>
          <h2 className='attachment-viewer-frame-details-title'>{name}</h2>
          <p>Added 3 hours ago - 200.54 KB</p>
          <p>
          <a href='/'>Open in New Tab &nbsp;</a>
          <a href='/'>Remove cover &nbsp;</a>
          <a href='/'>Delete &nbsp;</a>
          </p>
          </div>
          </div>
        </div> */}
        <IconButton
          // style={{ opacity: isNextAvailable ? 1 : 0 }}
          // style={{ color: isNextAvailable ? 'white' : 'black' }}
          disabled={!isNextAvailable}
          onClick={() => next()}
          aria-label='right'
          className='attachment-viewer-next-frame-btn'
          size='small'
        >
          <ArrowForwardIcon
            style={{ color: isNextAvailable ? 'white' : 'black' }}
            fontSize='inherit'
          />
        </IconButton>
        <IconButton
          // style={{ color: isPrevAvailable ? 'white' : 'black' }}
          disabled={!isPrevAvailable}
          onClick={() => prev()}
          aria-label='left'
          className='attachment-viewer-prev-frame-btn'
          size='small'
        >
          <ArrowBackIcon
            style={{ color: isPrevAvailable ? 'white' : 'black' }}
            fontSize='inherit'
          />
        </IconButton>
      </div>
    </>
  );
  return <>{isOpen ? previewerUI : null}</>;
}

export default AttachmentPreviewerUI;
