/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState } from 'react';
import { useLightbox } from 'simple-react-lightbox';
import ConformDeleteMOdel from './conform-delete-model';
import { IconButton, Typography } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import placeholder from '../../../assets/images/placeholder_small.jpg';
import { isVideo, isAudio } from '../../../utility-functions';
import './styles.scss';
import PDFIcon from 'v2/Assets/images/pdfImage.png';
import PowerPointIcon from 'v2/Assets/images/PowerPointIcon.png';

const Attachment = (props) => {
  const {
    fileName,
    urlPrefix,
    fileUrl,
    onOpenInPenTool,
    preview,
    actions,
    index,
    onDelete,
    ispdf,
  } = props;
  const [imagePreviewAvailable, setImagePreviewAvailable] = useState(true);
  const { openLightbox } = useLightbox();
  const [openModal, setOpenModal] = useState(false);

  let isAudioVideo = false;
  let isAudioFile = false;
  let isVideoFile = false;

  if (isAudio(fileUrl)) {
    isAudioVideo = true;
    isAudioFile = true;
  }

  if (isVideo(fileUrl)) {
    isAudioVideo = true;
    isVideoFile = true;
  }
  // console.log(props, 'teachers data');

  let markup = null;

  if (!isAudioVideo) {
    markup = (
      <>
        <div className='file-card-container'>
          <div className='overlay-container'>
            <div className='overlay'>
              <Typography
                component='h6'
                style={{ color: '#ffffff', textAlign: 'center', position: 'absolute' }}
              >
                {fileName}
              </Typography>
              {imagePreviewAvailable && (
                <div className='action-buttons' style={{ display: 'flex' }}>
                  {actions?.includes('preview') && (
                    <IconButton
                      onClick={() => {
                        openLightbox(index);
                      }}
                      size='small'
                    >
                      <VisibilityIcon style={{ color: '#ffffff' }} />
                    </IconButton>
                  )}

                  {actions?.includes('download') && (
                    <IconButton size='small'>
                      <a href={`${urlPrefix}/${fileUrl}`} download target='_blank'>
                        <GetAppIcon style={{ color: '#ffffff' }} />
                      </a>
                    </IconButton>
                  )}

                  {actions?.includes('pentool') && (
                    <IconButton
                      size='small'
                      onClick={() =>
                        onOpenInPenTool(`${urlPrefix}/${fileUrl}`, fileUrl, index)
                      }
                    >
                      <CreateIcon style={{ color: '#ffffff' }} />
                    </IconButton>
                  )}

                  {actions?.includes('delete') && (
                    <IconButton
                      size='small'
                      onClick={(e) => {
                        setOpenModal(true);
                      }}
                    >
                      <DeleteIcon style={{ color: '#ffffff' }} />
                    </IconButton>
                  )}
                </div>
              )}
            </div>
          </div>
          <img
            className='attachment-file'
            src={`${urlPrefix}/${fileUrl}?${escape(new Date().getTime())}`}
            alt='File'
            onError={(e) => {
              if (!fileUrl.includes('/lesson_plan_file/')) {
                setImagePreviewAvailable(false);
                e.target.src = placeholder;
              } else {
                if (fileUrl.includes('pdf')) {
                  e.target.src = PDFIcon;
                } else if (fileUrl.includes('ppt')) {
                  e.target.src = PowerPointIcon;
                }
              }
            }}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        {openModal && (
          <ConformDeleteMOdel
            submit={(status) => onDelete(index, status)}
            openModal={openModal}
            setOpenModal={setOpenModal}
            ispdf={ispdf}
          />
        )}
      </>
    );
  } else {
    if (isVideoFile) {
      markup = (
        <>
          <div className='file-card-container'>
            <div className='overlay-container' style={{ zIndex: 2 }}>
              <div className='overlay'>
                <Typography
                  component='h6'
                  style={{ color: '#ffffff', textAlign: 'center', position: 'absolute' }}
                >
                  {fileName}
                </Typography>

                <div className='action-buttons' style={{ display: 'flex' }}>
                  {actions?.includes('download') && (
                    <IconButton size='small'>
                      <a href={`${urlPrefix}/${fileUrl}`} download target='_blank'>
                        <GetAppIcon style={{ color: '#ffffff' }} />
                      </a>
                    </IconButton>
                  )}
                  {actions?.includes('pentool') && (
                    <IconButton
                      size='small'
                      onClick={() =>
                        onOpenInPenTool(`${urlPrefix}/${fileUrl}`, fileUrl, index)
                      }
                    >
                      <CreateIcon style={{ color: '#ffffff' }} />
                    </IconButton>
                  )}
                  {actions?.includes('delete') && (
                    <IconButton
                      size='small'
                      onClick={(e) => {
                        setOpenModal(true);
                      }}
                    >
                      <DeleteIcon style={{ color: '#ffffff' }} />
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
            <div className='file-card-container'>
              <video controls className='video-file'>
                <source src={`${urlPrefix}/${fileUrl}`} />
                Your browser does not support the audio element.
              </video>
            </div>
          </div>
          {openModal && (
            <ConformDeleteMOdel
              submit={(status) => onDelete(index, status)}
              openModal={openModal}
              setOpenModal={setOpenModal}
              ispdf={ispdf}
            />
          )}
        </>
      );
    }
    if (isAudioFile) {
      markup = (
        <>
          <div className='file-card-container'>
            <div className='overlay-container' style={{ zIndex: 2 }}>
              <div className='overlay'>
                <Typography
                  component='h6'
                  style={{
                    color: '#ffffff',
                    textAlign: 'center',
                    position: 'absolute',
                  }}
                >
                  {fileName}
                </Typography>

                <div className='action-buttons' style={{ display: 'flex' }}>
                  {actions?.includes('download') && (
                    <IconButton size='small'>
                      <a href={`${urlPrefix}/${fileUrl}`} download target='_blank'>
                        <GetAppIcon style={{ color: '#ffffff' }} />
                      </a>
                    </IconButton>
                  )}
                  {actions?.includes('pentool') && (
                    <IconButton
                      size='small'
                      onClick={() =>
                        onOpenInPenTool(`${urlPrefix}/${fileUrl}`, fileUrl, index)
                      }
                    >
                      <CreateIcon style={{ color: '#ffffff' }} />
                    </IconButton>
                  )}
                  {actions?.includes('delete') && (
                    <IconButton
                      size='small'
                      onClick={(e) => {
                        setOpenModal(true);
                      }}
                    >
                      <DeleteIcon style={{ color: '#ffffff' }} />
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
            <div className='file-card-container'>
              <audio controls className='video-file'>
                <source src={`${urlPrefix}/${fileUrl}`} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
          {openModal && (
            <ConformDeleteMOdel
              submit={(status) => onDelete(index, status)}
              openModal={openModal}
              setOpenModal={setOpenModal}
              ispdf={ispdf}
            />
          )}
        </>
      );
    }
  }

  return markup;
};

export default Attachment;
