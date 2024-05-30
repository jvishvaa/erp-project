import React from 'react';
import { Carousel, Image } from 'antd';
import PDFIcon from 'v2/Assets/images/pdf.png';

const MediaDisplay = ({ mediaLinks, alt = '', className = '', styles = {} }) => {
  const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
  };

  const getFileExtension = (url) => url?.split('.')?.pop();

  const getMediaTag = (link) => {
    const extension = getFileExtension(link);

    if (extension.match(/(jpg|jpeg|png|gif|avif|webp)/i)) {
      return (
        <Image
          style={{
            width: '200px',
            height: '200px',
            borderRadius: 16,
            objectFit: 'cover',
          }}
          src={link}
        />
      );
    } else if (extension.match(/(mp4|ogg|avi)/i)) {
      return (
        <video controls className={className} style={{ ...styles }}>
          <source src={link} type={`video/${extension}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (extension.match(/(mp3|webm)/i)) {
      return (
        <audio controls className={'w-100 th-br-20'}>
          <source src={link} type={`audio/${extension}`} />
          Your browser does not support the audio tag.
        </audio>
      );
    } else if (extension.match(/pdf/i)) {
      return (
        <div>
          <a href={link} target='__blank'>
            <img
              style={{
                width: '100px',
                height: '100px',
                borderRadius: 16,
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
    <div className='th-media-display text-center th-br-14 mx-3 my-2'>
      <Carousel effect='fade' autoplay>
        {mediaLinks.map((link, index) => (
          <div style={contentStyle} key={index}>
            {getMediaTag(link)}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MediaDisplay;
