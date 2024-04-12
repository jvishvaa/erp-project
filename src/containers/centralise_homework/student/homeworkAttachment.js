import React, { useState } from 'react';
import { message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import BOOKMARKICON from './../../../assets/images/bookmark-icon.png';
import BOOKMARKEDICON from './../../../assets/images/bookmarked-icon.png';
import CHATICON from './../../../assets/images/chat-icon.png';
import NOTEICON from './../../../assets/images/note-icon.png';
import DOWNLOADICON from './../../../assets/images/download-icon-blue.png';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import { saveAs } from 'file-saver';

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
    setHomeworkData,
  } = props;

  console.log({ props });

  const handleBookmarkAttachment = (id, data) => {
    const formData = new FormData();
    formData.append('is_bookmarked', data);
    axiosInstance
      .patch(`${endpoints.centralizedHomework.studentView}${id}/`, formData)
      .then((res) => {
        console.log('subject res', res);
        if (res?.data?.status_code === 200) {
          setSelectedHomework((prevState) => ({
            ...prevState,
            is_bookmarked: data === 'True' ? true : false,
          }));
          // let hwData = homeworkData;
          // hwData[selectedHomeworkIndex].is_bookmarked = data === 'True' ? true : false;
          // console.log({hwData})
          // setHomeworkData(hwData);
          setHomeworkData((prevHomeworkData) => {
            const updatedData = [...prevHomeworkData];
            updatedData[selectedHomeworkIndex] = {
              ...updatedData[selectedHomeworkIndex],
              is_bookmarked: data === 'True' ? true : false,
            };
            console.log({ updatedData });
            return updatedData;
          });
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleAttachmentControl = (type, currentIndex) => {
    console.log({ type, currentIndex });
    if (type === 'prev' && currentIndex > 0) {
      setSelectedHomeworkIndex(currentIndex - 1);
      setSelectedHomework(homeworkData[currentIndex - 1]);
    } else if (type !== 'prev' && currentIndex < homeworkData.length - 1) {
      setSelectedHomeworkIndex(currentIndex + 1);
      setSelectedHomework(homeworkData[currentIndex + 1]);
    }
  };

  const downloadHomeworkAttachment = async (url, filename) => {
    console.log(url, filename);
    const res = await fetch(url);
    const blob = await res.blob();
    saveAs(blob, filename);
  };

  return (
    <React.Fragment>
      <div className='w-100'>
        <div className='py-2'>
          Attachment <span className='th-fw-600'>{selectedHomeworkIndex + 1}</span> of
          <span className='th-fw-600'> {homeworkData?.length}</span>
        </div>
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

            <>
              <div
                className='download-icon'
                style={{
                  position: 'absolute',
                  top: -5,
                  right: 10,
                }}
                onClick={() => {
                  downloadHomeworkAttachment(
                    `${endpoints.erpBucket}${selectedHomework?.file_location}`,
                    selectedHomework.file_location
                  );
                }}
              >
                <img
                  src={DOWNLOADICON}
                  alt='download'
                  className='img-fluid'
                  title='Download File'
                />
              </div>
              {/* <div className='zip-container' onClick={() => handleAttachmentView(true)}>
                <img
                  src='https://cdn-icons-png.flaticon.com/128/9496/9496565.png'
                  className='img-fluid'
                  alt={selectedHomework?.name}
                />
              </div> */}
            </>
            <button
              className='attachment-control-icon next btn'
              onClick={() => handleAttachmentControl('next', selectedHomeworkIndex)}
              disabled={selectedHomeworkIndex === homeworkData?.length - 1}
            >
              <RightOutlined className='icon' />
            </button>
            {selectedHomework?.is_bookmarked && (
              <div className='bookmarked-icon'>
                <img src={BOOKMARKEDICON} alt='bookmarked' className='img-fluid w-75' />
              </div>
            )}
          </div>
        </div>

        {/* ACTION ATTACHMENT */}
        <div
          className='th-bg-white attachment-right-box float-right'
          style={{ width: '10%' }}
        >
          <div
            className='p-1 p-md-2 p-lg-3 text-center cursor-pointer'
            onClick={() =>
              handleBookmarkAttachment(
                selectedHomework?.id,
                selectedHomework?.is_bookmarked ? 'False' : 'True'
              )
            }
          >
            <img className='attachment-action-icon' alt='bookmark' src={BOOKMARKICON} />
          </div>
          {/* <div
            className='p-1 p-md-2 p-lg-3 text-center cursor-pointer'
            onClick={() => handleNoteTakerView(true)}
          >
            <img className='attachment-action-icon' alt='note' src={NOTEICON} />
          </div>
          <div className='p-1 p-md-2 p-lg-3 text-center cursor-pointer'>
            <img className='attachment-action-icon' alt='Chat' src={CHATICON} />
          </div>  */}
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomeworkAttachment;
