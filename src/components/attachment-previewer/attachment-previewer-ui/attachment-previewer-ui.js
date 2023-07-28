/* eslint-disable no-nested-ternary */
import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import 'react-pdf/dist/umd/Page/AnnotationLayer.css';
import endpoints from 'v2/config/endpoints';
import axiosInstance from 'config/axios';
import Loader from 'components/loader/loader';
import {
  FullscreenOutlined,
  CloseSquareOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';

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
  const history = useHistory();
  const [webviewer, setWebViewer] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userDetails'));
  const user_level = userData?.user_level;
  const levelMatch =
    user_level == 11 || user_level == 10 || user_level == 8 ? true : false;
  const isOrchids =
    (window.location.host.split('.')[0] === 'orchids' && levelMatch) ||
    (window.location.host.split('.')[0] === 'localhost:3000' && levelMatch) ||
    (window.location.host.split('.')[0] === 'qa' && levelMatch)
      ? true
      : false;
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

  if (!isOpen) return null;

  document.addEventListener(
    'contextmenu',
    function (e) {
      e.preventDefault();
    },
    false
  );

  const handlePPt = () => {
    history.push({
      pathname: '/pptview',
      state: {
        src: src,
      },
    });
    closePreview();
  };

  const goFullScreen = () => {
    setFullScreen(true);
    var elem = document.getElementById('attachPPT');

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    setFullScreen(false);

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const checkFullscreen = () => {
    if (fullScreen == false) {
      goFullScreen();
    } else {
      exitFullScreen();
    }
  };

  if (document.addEventListener) {
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
  }

  function exitHandler() {
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      // Run code on exit
      console.log('exit fullscreen');
      setFullScreen(false);
    }
  }

  const previewerUI = (
    <>
      <Dialog fullScreen open TransitionComponent={Transition} style={{ zIndex: '2000' }}>
        <div className='attachment-viewer' key={src} id='attachPPT'>
          <div className='attachment-viewer-header col-md-4 row'>
            {!src.toLowerCase().endsWith('.mp3') ? (
              <div className='attachment-viewer-header-fullscreen-icon p-2'>
                {!fullScreen ? (
                  <Button
                    icon={<FullscreenOutlined />}
                    onClick={checkFullscreen}
                    title='View in Fullscreen'
                  />
                ) : (
                  <Button
                    icon={<FullscreenExitOutlined />}
                    onClick={checkFullscreen}
                    title='Exit Fullscreen'
                  />
                )}
              </div>
            ) : (
              ''
            )}
            <div className='attachment-viewer-header-close-icon p-2'>
              <Button
                icon={<CloseSquareOutlined />}
                onClick={closePreview}
                title='Close'
              />
            </div>
            {/* <div className='attachment-viewer-header-close-icon'>
              <IconButton onClick={closePreview} aria-label='close' size='small'>
                <CloseIcon
                  style={{ color: 'white', backgroundColor: 'black' }}
                  fontSize='inherit'
                />
              </IconButton>
            </div> */}
          </div>
          <div className='attachment-viewer-frames'>
            <div className='attachment-viewer-frame'>
              <div className='attachment-viewer-frame-preview-wrapper'>
                {imageFileFormats.includes(extension.toLowerCase()) ? (
                  <div className='attachment-viewer-frame-preview attachment-viewer-frame-preview-image-wrapper col-md-12'>
                    <img
                      alt='sd'
                      className='attachment-viewer-frame-preview-image'
                      src={src}
                    />
                  </div>
                ) : src.toLowerCase().endsWith('.mp4') ||
                  src.toLowerCase().endsWith('.mp3') ? (
                  <div className='col-md-12'>
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
                  </div>
                ) : isPPt ? (
                  <>
                    <iframe
                      id='attachment-iframe'
                      title='attachment-iframe'
                      src={pptFileSrc}
                      className='attachment-viewer-frame-preview-iframe'
                    />
                    {isOrchids ? (
                      ''
                    ) : (
                      <div
                        className='overlayDwnld'
                        style={{
                          height: '22px',
                          width: '94px',
                          bottom: '13px',
                          position: 'absolute',
                          background: '#444444',
                          right: '18px',
                        }}
                      ></div>
                    )}
                  </>
                ) : (
                  // <PdfjsPreview url={src} />
                  <div>
                    <Document
                      file={src}
                      className='pdf-document'
                      externalLinkTarget='_blank'
                      onLoadError={(error) =>
                        alert('Error while loading document! ' + error.message)
                      }
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page
                        height={550}
                        scale={scaleValue || 1}
                        width={500}
                        renderAnnotationLayer={true}
                        className='pdf-page'
                        pageNumber={pageNumber}
                      />
                    </Document>
                  </div>
                )}
              </div>
            </div>
          </div>
          {src.toLowerCase().endsWith('.pdf') && (
            <IconButton
              disabled={pageNumber === numPages}
              onClick={() => {
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
          )}
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
                  <ZoomOutIcon style={{ color: scaleValue === 1 ? 'grey' : '#979797' }} />
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
                  <ZoomInIcon
                    style={{ color: scaleValue === 2.5 ? 'grey' : '#979797' }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          )}
          {src.toLowerCase().endsWith('.pdf') && (
            <IconButton
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
            </IconButton>
          )}
        </div>
      </Dialog>
    </>
  );
  return <>{isOpen ? previewerUI : null}</>;
}

export default AttachmentPreviewerUI;
