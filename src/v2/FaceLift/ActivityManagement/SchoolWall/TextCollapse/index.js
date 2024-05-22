/** @format */

import { DownOutlined, UpOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect } from 'react';

const TextCollapse = ({ content, id }) => {
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
  const LIMIT = 570;
  return (
    <div ref={contentRef}>
      <div
        className={`${
          !showFullText && hasLargeText ? 'th-post-content' : ''
        } d-flex align-items-end`}
      >
        <div className='text-justify' style={{ width: '98%' }}>
          {content}
        </div>
        {hasLargeText && (
          <>
            {!showFullText ? (
              <span className='th-grey-1 ps-1 th-pointer' onClick={handleShowFullText}>
                <DownOutlined />
              </span>
            ) : (
              <span className='th-grey-1 ps-1 th-pointer' onClick={handleShowFullText}>
                &nbsp;
                <UpOutlined />
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TextCollapse;
