import React, { useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import BOOKMARKICON from './../../../assets/images/bookmark-icon.png';
import BOOKMARKEDICON from './../../../assets/images/bookmarked-icon.png';
import CHATICON from './../../../assets/images/chat-icon.png';
import NOTEICON from './../../../assets/images/note-icon.png';
import DOWNLOADICON from './../../../assets/images/download-icon-blue.png';
import endpoints from 'config/endpoints';

const HomeworkAttachment = ({ ...props }) => {
  const {
    attachmentView,
    setAttachmentView,
    handleAttachmentView,
    handleNoteTakerView,
    selectedHomework,
    setSelectedHomework,
    selectedHomeworkIndex,
    setSelectedHomeworkIndex,
    homeworkData,
  } = props;

  console.log({ props });
  const [bookmarkAttachment, setBookmarkedAttachment] = useState(false);

  const handleBookmarkAttachment = () => {
    setBookmarkedAttachment(!bookmarkAttachment);
  };

  const handleAttachmentControl = (type, currentIndex) => {
    if (type === 'prev' && currentIndex > 0) {
      setSelectedHomeworkIndex(currentIndex - 1);
      setSelectedHomework(homeworkData[currentIndex - 1]);
    } else if (type !== 'prev' && currentIndex < homeworkData.length - 1) {
      setSelectedHomeworkIndex(currentIndex + 1);
      setSelectedHomework(homeworkData[currentIndex + 1]);
    }
  };

  return (
    <React.Fragment>
      <div className='w-100'>
        <div className='th-bg-white attachment-left-box shadow p-3 w-90 float-left'>
          <div className='position-relative'>
            <button
              className='attachment-control-icon prev btn'
              onClick={() => handleAttachmentControl('prev', selectedHomeworkIndex)}
              disabled={selectedHomeworkIndex === 0}
            >
              <LeftOutlined className='icon' />
            </button>

            {/* {selectedHomework?.file?.split('.')[
              selectedHomework?.file?.split('.').length - 1
            ] !== 'zip' ? ( */}
            <div
              style={{
                backgroundImage: `url(${endpoints.erpBucket}${selectedHomework?.file_location})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                borderRadius: 4,
                overflow: 'hidden',
                aspectRatio: '1',
              }}
              onClick={() => handleAttachmentView(true)}
            ></div>
            {/* <img
              src={`${endpoints.erpBucket}/${selectedHomework?.file_location}`}
              alt={`${endpoints.erpBucket}${selectedHomework?.file_location}`}
              className='w-100'
            /> */}
            {/* ) : (
              <>
                <div
                  className='download-icon'
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                  }}
                >
                  <img
                    src={DOWNLOADICON}
                    alt='download'
                    className='img-fluid'
                    title='Download File'
                  />
                </div>
                <div className='zip-container' onClick={() => handleAttachmentView(true)}>
                  <img
                    src='https://cdn-icons-png.flaticon.com/128/9496/9496565.png'
                    className='img-fluid'
                    alt={selectedHomework?.name}
                  />
                </div>
              </>
            )} */}
            <button
              className='attachment-control-icon next btn'
              onClick={() => handleAttachmentControl('next', selectedHomeworkIndex)}
              disabled={selectedHomeworkIndex === homeworkData?.length - 1}
            >
              <RightOutlined className='icon' />
            </button>
            {/* {selectedHomework?.isBookmarked && (
              <div className='bookmarked-icon'>
                <img src={BOOKMARKEDICON} alt='bookmarked' className='img-fluid' />
              </div>
            )} */}
          </div>
        </div>
        <div
          className='th-bg-white attachment-right-box float-right'
          style={{ width: '10%' }}
        >
          <div
            className='p-1 p-md-2 p-lg-3 text-center cursor-pointer'
            onClick={() => handleBookmarkAttachment()}
          >
            <img className='attachment-action-icon' alt='bookmark' src={BOOKMARKICON} />
          </div>
          <div
            className='p-1 p-md-2 p-lg-3 text-center cursor-pointer'
            onClick={() => handleNoteTakerView(true)}
          >
            <img className='attachment-action-icon' alt='note' src={NOTEICON} />
          </div>
          <div className='p-1 p-md-2 p-lg-3 text-center cursor-pointer'>
            <img className='attachment-action-icon' alt='Chat' src={CHATICON} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomeworkAttachment;
