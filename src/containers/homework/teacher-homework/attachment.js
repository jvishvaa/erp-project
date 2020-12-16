import React, { useState } from 'react';
import { useLightbox } from 'simple-react-lightbox';

import { IconButton, Typography } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CreateIcon from '@material-ui/icons/Create';
import placeholder from '../../../assets/images/placeholder_small.jpg';

const Attachment = (props) => {
  const {
    fileName,
    urlPrefix,
    fileUrl,
    penTool,
    onOpenInPenTool,
    preview,
    index,
  } = props;
  const [imagePreviewNotAvailable, setImagePreviewNotAvailable] = useState(false);
  const { openLightbox } = useLightbox();

  return (
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
            {!imagePreviewNotAvailable && (
              <div className='action-buttons' style={{ display: 'flex' }}>
                <IconButton
                  onClick={() => {
                    openLightbox();
                  }}
                  size='small'
                >
                  <VisibilityIcon style={{ color: '#ffffff' }} />
                </IconButton>

                <IconButton size='small'>
                  <a href={`${urlPrefix}/${fileUrl}`} download>
                    <GetAppIcon style={{ color: '#ffffff' }} />
                  </a>
                </IconButton>

                {penTool && (
                  <IconButton
                    size='small'
                    onClick={() => onOpenInPenTool(`${urlPrefix}/${fileUrl}`)}
                  >
                    <CreateIcon style={{ color: '#ffffff' }} />
                  </IconButton>
                )}
              </div>
            )}
          </div>
        </div>
        <img
          className='attachment-file'
          src={preview ? fileUrl : `${urlPrefix}/${fileUrl}`}
          alt='file'
          onError={(e) => {
            e.target.src = placeholder;
            setImagePreviewNotAvailable(true);
          }}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
    </>
  );
};

export default Attachment;
