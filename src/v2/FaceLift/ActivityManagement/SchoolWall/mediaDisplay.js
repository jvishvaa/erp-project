import React from 'react';
import { Image } from 'antd';
import endpoints from 'v2/config/endpoints';

const MediaDisplay = ({
  mediaLink,
  mediaName,
  alt = '',
  className = '',
  styles = {},
}) => {
  const CDNLink = `${endpoints?.erp_googleapi}/${mediaLink}`;

  const getFileExtension = (url) => {
    return url?.split('.')?.pop();
  };
  const getMediaTag = (link) => {
    const extension = getFileExtension(link);

    if (extension.match(/(jpg|jpeg|png|gif|avif|webp)/i)) {
      return (
        <Image
          style={{
            width: '200px',
            height: '200px',
            borderRadius: 16,
            objectFit:'cover'
          }}
          src={CDNLink}
        />
      );
    } else if (extension.match(/(mp4|ogg)/i)) {
      return (
        <video
          // autoPlay={true}
          controls
          className={className}
          style={{ ...styles }}
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
        <div>
          <a href={CDNLink} target='__blank'>
            <img
              src='https://img.freepik.com/free-vector/illustration-data-folder-icon_53876-6329.jpg?w=900&t=st=1698483764~exp=1698484364~hmac=2f391d43a022842ad959f2356ee00a6f73990982d805d142f5493c5834bd9481'
              alt={alt}
              className='th-pdf-logo'
              style={{ ...styles }}
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
    <div className='th-media-display text-center th-br-14 mx-3 my-2'>
      {getMediaTag(mediaName)}
    </div>
  );
};

export default MediaDisplay;
