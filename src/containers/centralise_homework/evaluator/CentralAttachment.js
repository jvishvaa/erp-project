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
import './index.scss';
import PDFIcon from 'v2/Assets/images/pdfImage.png';
import PowerPointIcon from 'v2/Assets/images/PowerPointIcon.png';
const CentralAttachment = (props) => {
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
  const isDairy = window.location.pathname.includes('/diary/') ? true : false;
  console.log(index, fileUrl, 'preview');
  // console.log(props, 'teachers data');

  let markup = null;

  markup = (
    <>
      <div className='file-card-container'>
        <div className='overlay-container'>
          <div className='overlay'>
            <Typography
              component='h6'
              style={{
                color: '#ffffff',
                textAlign: 'center',
                position: 'absolute',
                fontSize: 12,
              }}
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

                {actions?.includes('delete') && !isDairy && (
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
              if (fileUrl.includes('doc')) {
                e.target.src = PowerPointIcon;
                setImagePreviewAvailable(true);
              } else {
                setImagePreviewAvailable(false);
                e.target.src = placeholder;
              }
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

  return markup;
};

export default CentralAttachment;
