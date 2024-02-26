import React, { useState } from 'react';
import { Badge } from 'antd';
import BOOKMARKICON from './../../../assets/images/bookmark-icon.png';
import BOOKMARKEDICON from './../../../assets/images/bookmarked-icon.png';
import CHATICON from './../../../assets/images/chat-icon.png';
import NOTEICON from './../../../assets/images/note-icon.png';

const HomeworkAttachment = () => {
  const [bookmarkAttachment, setBookmarkedAttachment] = useState(false);

  const handleBookmarkAttachment = () => {
    setBookmarkedAttachment(!bookmarkAttachment);
  };

  return (
    <React.Fragment>
      <div className='w-100'>
        <div className='th-bg-white attachment-left-box shadow p-3 w-90 float-left'>
          <img
            src='https://fakeimg.pl/640x360'
            alt='Homework Attachments'
            className='w-100'
            style={{
              cursor: 'pointer',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: '#6c757d',
            }}
          />
          {bookmarkAttachment && (
            <div className='bookmarked-icon'>
              <img src={BOOKMARKEDICON} alt='bookmarked' className='img-fluid' />
            </div>
          )}
        </div>
        <div
          className='th-bg-white attachment-right-box float-right'
          style={{ width: '10%' }}
        >
          <div
            className='p-1 p-lg-3 text-center cursor-pointer'
            onClick={() => handleBookmarkAttachment()}
          >
            <img className='attachment-action-icon' alt='bookmark' src={BOOKMARKICON} />
          </div>
          <div className='p-1 p-lg-3 text-center cursor-pointer'>
            <img className='attachment-action-icon' alt='note' src={NOTEICON} />
          </div>
          <div className='p-1 p-lg-3 text-center cursor-pointer'>
            <img className='attachment-action-icon' alt='Chat' src={CHATICON} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomeworkAttachment;
