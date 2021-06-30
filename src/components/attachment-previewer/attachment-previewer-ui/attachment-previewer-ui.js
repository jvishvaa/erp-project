/* eslint-disable no-nested-ternary */
import React from 'react';
import { IconButton } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import Dialog from '@material-ui/core/Dialog';
import { Slide } from '@material-ui/core';

import PdfjsPreview from '../pdf-js';

import { AttachmentPreviewerContext } from '../attachment-previewer-contexts';
import './attachment-previewer-ui-styles.css';
import { Document, Page, pdfjs } from 'react-pdf';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
  // return <Fade direction='in' ref={ref} {...props} />
});

function AttachmentPreviewerUI() {
  const {
    attachments = [],
    closePreview,
    currentAttachmentIndex,
    scaleValue,
    setScaleValue,
    numPages, 
    setNumPages,
    pageNumber,
    setPageNumber,
    controls: { isOpen, next, prev, isNextAvailable, isPrevAvailable },
  } = React.useContext(AttachmentPreviewerContext) || {};
  const { extension, src = '', name } = (attachments || [])[currentAttachmentIndex] || {};

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


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

  document.addEventListener(
    'contextmenu',
    function (e) {
      e.preventDefault();
    },
    false
  );

  const previewerUI = (
    <>
      <Dialog fullScreen open TransitionComponent={Transition}>
        <div className='attachment-viewer' key={src}>
          <div className='attachment-viewer-header'>
            <div className='attachment-viewer-header-close-icon'>
              <IconButton onClick={closePreview} aria-label='close' size='small'>
                <CloseIcon
                  style={{ color: 'white', backgroundColor: 'black' }}
                  fontSize='inherit'
                />
              </IconButton>
            </div>
          </div>
          <div className='attachment-viewer-frames'>
            <div className='attachment-viewer-frame'>
              <div className='attachment-viewer-frame-preview-wrapper'>
                {imageFileFormats.includes(extension.toLowerCase()) ? (
                  <div className='attachment-viewer-frame-preview attachment-viewer-frame-preview-image-wrapper'>
                    <img
                      alt='sd'
                      className='attachment-viewer-frame-preview-image'
                      src={src}
                    />
                  </div>
                ) : src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.mp3') ? (
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
                    {src.toLowerCase().endsWith('.mp4') ? (
                      <source src={src} type='video/mp4' />
                    ) : (
                      <source src={src} type='audio/mp3' />
                    )}
                    {/* <source src='mov_bbb.ogg' type='video/ogg' /> */}
                    Your browser does not support HTML5 video.
                  </video>
                ) : isPPt ? (
                  <iframe
                    id='attachment-iframe'
                    title='attachment-iframe'
                    src={pptFileSrc}
                    // src={isPPt ? pptFileSrc : `${src}#toolbar=0&navpanes=0&scrollbar=0`}
                    // src={isPPt ? pptFileSrc : `http://docs.google.com/gview?url=${src}&embedded=true#toolbar=0&navpanes=0&scrollbar=0`}
                    className='attachment-viewer-frame-preview-iframe'
                  />
                ) : (
                  // <PdfjsPreview url={src} />
                  <div>
                    <Document
                      file={src}
                      className='pdf-document'
                      onLoadError={(error) =>
                        alert('Error while loading document! ' + error.message)
                      }
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page
                        height={550}
                        scale={scaleValue || 1}
                        width={500}
                        className='pdf-page'
                        pageNumber={pageNumber}
                      />
                    </Document>
                  </div>
                )}
                {/* <iframe src="http://docs.google.com/gview?url=http://infolab.stanford.edu/pub/papers/google.pdf&embedded=true" style="width:600px; height:500px;" frameborder="0"></iframe> */}
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
        {src.toLowerCase().endsWith('.pdf') &&
          <IconButton
            // style={{ opacity: isNextAvailable ? 1 : 0 }}
            // style={{ color: isNextAvailable ? 'white' : 'black' }}
            // disabled={!isNextAvailable}
            disabled={pageNumber === numPages}
            onClick={() => {
              // next();
              setPageNumber((prev) => prev + 1);
            }}
            aria-label='right'
            className='attachment-viewer-next-frame-btn'
            size='small'
          >
            <ArrowForwardIcon
              style={{ color: pageNumber !== numPages ? 'white' : 'black' }}
              fontSize='inherit'
            />
          </IconButton>
          }
          {numPages && (
            <div className='attachment-viewer-buttons'>
              <Tooltip title='Zoom Out' placement='left'>
                <IconButton
                  disabled={scaleValue === 1}
                  onClick={() => {
                    if (scaleValue > 1) {
                      setScaleValue((prev) => prev - 0.5);
                    }
                  }}
                  aria-label='zoom-out'
                  className='attachment-viewer-zoom-out-btn'
                  size='small'
                >
                  <ZoomOutIcon style={{ color: scaleValue === 1 ? 'grey' : 'black' }} />
                </IconButton>
              </Tooltip>
              <div className='attachment-viewer-center-frame'>
                <p>
                  Page {pageNumber} of {numPages}
                </p>
              </div>
              <Tooltip title='Zoom In' placement='right'>
                <IconButton
                  disabled={scaleValue === 2.5}
                  onClick={() => {
                    if (scaleValue < 2.5) {
                      setScaleValue((prev) => prev + 0.5);
                    }
                  }}
                  aria-label='zoom-in'
                  className='attachment-viewer-zoom-in-btn'
                  size='small'
                >
                  <ZoomInIcon style={{ color: scaleValue === 2.5 ? 'grey' : 'black' }} />
                </IconButton>
              </Tooltip>
            </div>
          )}
          {src.toLowerCase().endsWith('.pdf') &&
          <IconButton
            // style={{ color: isPrevAvailable ? 'white' : 'black' }}
            // disabled={!isPrevAvailable}
            disabled={pageNumber === 1}
            onClick={() => {
              prev();
              setPageNumber((prev) => prev - 1);
            }}
            aria-label='left'
            className='attachment-viewer-prev-frame-btn'
            size='small'
          >
            <ArrowBackIcon
              style={{ color: pageNumber !== 1 ? 'white' : 'black' }}
              fontSize='inherit'
            />
          </IconButton>}
        </div>
      </Dialog>
    </>
  );
  return <>{isOpen ? previewerUI : null}</>;
}

export default AttachmentPreviewerUI;
