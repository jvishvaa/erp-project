import React, { useState } from 'react';
import { useLightbox } from 'simple-react-lightbox';

import { IconButton, Typography } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import placeholder from '../../../assets/images/placeholder_small.jpg';

const Attachment = (props) => {
  const { fileName, urlPrefix, fileUrl, index } = props;
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
              <div className='action-buttons'>
                <IconButton
                  onClick={() => {
                    openLightbox();
                  }}
                >
                  <VisibilityIcon style={{ color: '#ffffff' }} />
                </IconButton>

                <IconButton>
                  <a href={`${urlPrefix}/${fileUrl}`} download>
                    <GetAppIcon style={{ color: '#ffffff' }} />
                  </a>
                </IconButton>
              </div>
            )}
          </div>
        </div>
        <img
          className='attachment-file'
          src={`${urlPrefix}/${fileUrl}`}
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
