/** @format */

import { DownOutlined, UpOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect } from 'react';

const TextCollapse = ({ content }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [hasLargeText, setHasLargeText] = useState(false);
  const contentRef = useRef();
  const handleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.clientHeight > 110) {
        setShowFullText(false);
        setHasLargeText(true);
      }
    }
  }, [content]);
  return (
    <div ref={contentRef}>
      <div
        className={`${
          !showFullText && hasLargeText ? 'th-post-description' : ''
        } d-flex align-items-end`}
      >
        <div className='text-justify' style={{ fontStyle: 'italic', width: '98%' }}>
          {content}
        </div>
      </div>
      {hasLargeText && (
        <>
          {!showFullText ? (
            <span className='th-show-more-less' onClick={handleShowFullText}>
              show more
            </span>
          ) : (
            <span className='th-show-more-less' onClick={handleShowFullText}>
              show less
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default TextCollapse;
