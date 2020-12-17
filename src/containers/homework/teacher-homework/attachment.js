import React, { useState } from 'react';
import { useLightbox } from 'simple-react-lightbox';

import { IconButton, Typography } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import placeholder from '../../../assets/images/placeholder_small.jpg';

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
  } = props;
  const [imagePreviewAvailable, setImagePreviewAvailable] = useState(true);
  const { openLightbox } = useLightbox();

  console.log('actions', actions);

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
            {imagePreviewAvailable && (
              <div className='action-buttons' style={{ display: 'flex' }}>
                {actions?.includes('preview') && (
                  <IconButton
                    onClick={() => {
                      openLightbox();
                    }}
                    size='small'
                  >
                    <VisibilityIcon style={{ color: '#ffffff' }} />
                  </IconButton>
                )}

                {actions?.includes('download') && (
                  <IconButton size='small'>
                    <a href={`${urlPrefix}/${fileUrl}`} download>
                      <GetAppIcon style={{ color: '#ffffff' }} />
                    </a>
                  </IconButton>
                )}

                {actions?.includes('pentool') && (
                  <IconButton
                    size='small'
                    onClick={() => onOpenInPenTool(`${urlPrefix}/${fileUrl}`)}
                  >
                    <CreateIcon style={{ color: '#ffffff' }} />
                  </IconButton>
                )}

                {actions?.includes('delete') && (
                  <IconButton size='small' onClick={() => onDelete(index)}>
                    <DeleteIcon style={{ color: '#ffffff' }} />
                  </IconButton>
                )}
              </div>
            )}
          </div>
        </div>
        <img
          className='attachment-file'
          src={
            preview ? fileUrl : `${urlPrefix}/${fileUrl}?${escape(new Date().getTime())}`
          }
          alt='file'
          onError={(e) => {
            e.target.src = placeholder;
            setImagePreviewAvailable(false);
          }}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
    </>
  );
};

export default Attachment;
