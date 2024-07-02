import React from 'react';
import { Image } from 'antd';
import endpoints from 'v2/config/endpoints';
import PDFIcon from 'v2/Assets/images/pdf.png';

const MediaDisplay = ({
  mediaLink,
  mediaName,
  alt = '',
  className = '',
  styles = {},
}) => {
  const CDNLink = mediaLink;

  const getFileExtension = (url) => {
    return url?.split('.')?.pop();
  };
  const getMediaTag = (link) => {
    const extension = getFileExtension(link);

    if (extension.match(/(jpg|jpeg|png|gif|avif|webp)/i)) {
      return (
        <Image
          src={CDNLink}
          style={{
            height: 300,
            width: '100%',
            borderRadius: 16,
            objectFit: 'cover',
          }}
        />
      );
    } else if (extension.match(/(mp4|ogg|avi)/i)) {
      return (
        <video
          style={{
            ...styles,
            width: '100%',
            height: '300px',
          }}
          controls
          className={className}
        >
          <source src={CDNLink} type={`video/${extension}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (extension.match(/(mp3|webm)/i)) {
      return (
        <audio controls className={'w-100 th-br-20'}>
          <source src={CDNLink} type={`audio/${extension}`} />
          Your browser does not support the audio tag.
        </audio>
      );
    } else if (extension.match(/pdf/i)) {
      return (
        <div className='d-flex align-items-center flex-column'>
          <a href={CDNLink} target='__blank'>
            <img
              style={{
                height: '300px',
                borderRadius: 6,
                objectFit: 'cover',
              }}
              src={PDFIcon}
              alt={alt}
              className='th-pdf-logo'
            />
          </a>
          <p>This is a PDF file. Click to view.</p>
        </div>
      );
    } else {
      return <p className='p-3'>Unsupported media type</p>;
    }
  };

  return (
    <div className='th-media-display text-center th-br-14 mx-3 my-2 th-events-display'>
      {getMediaTag(mediaName)}
    </div>
  );
};

export default MediaDisplay;
