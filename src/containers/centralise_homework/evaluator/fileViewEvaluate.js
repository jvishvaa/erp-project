import React, { useState, useRef, useEffect } from 'react';
import { Tooltip, Tabs, Select, Drawer, Input, message, Pagination } from 'antd';
import './index.scss';
import './../student/style.css';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Attachment from 'containers/homework/teacher-homework/attachment';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import endpoints from 'v2/config/endpoints';
import placeholder from 'assets/images/placeholder_small.jpg';
import DescriptiveTestcorrectionModule from 'components/EvaluationTool';
import QuestionPng from 'assets/images/question.png';
import { SendOutlined } from '@ant-design/icons';
import DOWNLOADICON from './../../../assets/images/download-icon-blue.png';
import BOOKMARKICON from './../../../assets/images/bookmark-icon.png';
import NOTEICON from './../../../assets/images/note-icon.png';
import axiosInstance from 'config/axios';
const { TabPane } = Tabs;

let chatarr = [
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'user',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'user',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'user',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'user',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'user',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'user',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'user',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'user',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'user',
    chat: 'Hello',
  },
  {
    user: 'sup',
    chat: 'Hello',
  },
  {
    user: 'user',
    chat: 'Hello',
  },
];

const FilesViewEvaluate = ({
  evaluateData,
  selectedHomeworkIndex,
  setSelectedHomeworkIndex,
}) => {
  const history = useHistory();
  const scrollableContainer = useRef(null);
  const attachmentContainer = useRef(null);
  const chatRef = useRef(null);

  const [volume, setVolume] = useState('');
  const [showTab, setShowTab] = useState('1');
  const [penToolOpen, setPenToolOpen] = useState(false);
  const [penToolUrl, setPenToolUrl] = useState('');
  const [currentEvaluatedFileName, setcurrentEvaluatedFileName] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [chattext, setChatText] = useState('');
  const [chatsData, setChatsData] = useState(chatarr);

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };
  useEffect(() => {
    if (openDrawer == true) {
      scrollToBottom();
    }
  }, [openDrawer]);

  const openInPenTool = (url, fileName) => {
    setPenToolUrl(url);
    setcurrentEvaluatedFileName(fileName);
  };
  const handleCloseCorrectionModal = () => {
    setPenToolUrl('');
  };

  useEffect(() => {
    if (penToolUrl) {
      setPenToolOpen(true);
    } else {
      setPenToolOpen(false);
    }
  }, [penToolUrl]);

  const getVolume = (value) => {
    setVolume(value);
  };

  const closeTable = useRef(null);
  const onChange = (key) => {
    setShowTab(key);
  };

  const handleScroll = (dir) => {
    console.log(attachmentContainer);
    if (dir === 'left') {
      scrollableContainer.current.scrollLeft -= attachmentContainer?.current?.clientWidth;
      setSelectedHomeworkIndex(
        selectedHomeworkIndex === 0 ? 0 : selectedHomeworkIndex - 1
      );
    } else {
      scrollableContainer.current.scrollLeft += attachmentContainer?.current?.clientWidth;
      setSelectedHomeworkIndex(
        selectedHomeworkIndex === evaluateData.length - 1
          ? evaluateData.length - 1
          : selectedHomeworkIndex + 1
      );
    }
  };

  const handleSaveEvaluatedFile = async (file) => {
    console.log(file, evaluateData[selectedHomeworkIndex], 'filedata');
    let path = evaluateData[selectedHomeworkIndex]?.file_location;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('destination_path', path);

    axiosInstance
      .post(`${endpoints.homework.updateImage}`, fd)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          message.success('Attachment Added');
          // setFileList([]);
          // setUploading(false);
        }
      })
      .catch((e) => {
        message.error('Upload Failed');
      });
  };

  const mediaContent = {
    file_content: penToolUrl,

    id: 1,
    splitted_media: null,
  };
  const desTestDetails = [{ asessment_response: { evaluvated_result: '' } }];

  const drawerTitle = () => {
    return (
      <div className='row justify-content-between'>
        <span className='d-flex' style={{ alignItems: 'center' }}>
          Query Box
        </span>
        <img src={QuestionPng} width='30px' />
      </div>
    );
  };

  const handlechange = (e) => {
    console.log(e);
    setChatText(e);
  };

  const handleAddtext = () => {
    let data = {
      user: 'user',
      chat: chattext,
    };
    console.log(data, 'arrdata');
    setChatsData([...chatsData, data]);
    setTimeout(scrollToBottom, 1000);
  };
  const suffix = <SendOutlined onClick={() => handleAddtext()} />;

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const handleImageScroll = (index) => {
    setSelectedHomeworkIndex(index);
    let imgwidth = index * attachmentContainer?.current?.clientWidth;
    console.log(scrollableContainer.current, 'scroll');
    scrollableContainer.current.scrollTo({ left: imgwidth, behavior: 'smooth' });
  };

  return (
    <React.Fragment>
      <div className='wholetabCentralHW'>
        <div className='th-tabs th-tabs-hw mt-3 th-bg-white'>
          <div className=' row'>
            <div className='col-md-5 col-xl-4 pl-0'>
              {/* <div className=' d-flex justify-content-center'>
                      <span className='th-16'>Files</span>
                    </div> */}
              <div className='card shadow border-0 th-br-4 w-100'>
                <div className='card-body'>
                  <div className='col-md-12 row'>
                    <div className='col-md-6'>
                      <p className='th-15 mb-0 text-muted text-truncate text-center'>
                        <span className='th-fw-600'>Worksheet</span>
                      </p>
                    </div>
                    <div className='col-md-6'>
                      <p className='th-15 mb-0 text-muted text-truncate text-center'>
                        <span className='th-fw-600'>Due Date</span>
                      </p>
                    </div>
                  </div>
                  <div className='notebook-list mt-3'>
                    {evaluateData?.map((item, index) => (
                      <div
                        className='notebook-list-item col-md-12'
                        key={index}
                        style={{
                          backgroundColor: `${
                            selectedHomeworkIndex === index ? '#f8f8f8' : '#fff'
                          }`,
                        }}
                        onClick={() => handleImageScroll(index)}
                      >
                        <div
                          className='notebook-content ml-2 col-md-6'
                          style={{ cursor: 'pointer' }}
                        >
                          <Tooltip
                            title={`${item?.student_erp}`}
                            showArrow={false}
                            placement='right'
                            overlayInnerStyle={{
                              borderRadius: 4,
                              backgroundColor: 'white',
                              color: 'black',
                              maxHeight: 200,
                              overflowY: 'scroll',
                              textTransform: 'capitalize',
                            }}
                          >
                            <h5 className='th-14 mb-0'>{item.student_erp}</h5>
                            {/* <p className='th-12 mb-0 text-muted text-truncate'>
                              <span className='th-fw-600'>Description:</span>
                              {item.description}
                            </p> */}
                          </Tooltip>
                        </div>
                        <div className='col-md-6'>
                          <p className='th-12 mb-0 text-muted text-truncate text-center'>
                            <span className='th-fw-600'>{item?.dueDate}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-7 col-xl-8 row'>
              <div className='col-md-11 p-0'>
                {/* Image Area */}
                <div>
                  <div className='attachments-list-outer-container'>
                    <div className='prev-btn'>
                      <IconButton onClick={() => handleScroll('left')}>
                        <ArrowBackIosIcon />
                      </IconButton>
                    </div>
                    <SimpleReactLightbox>
                      <div
                        className='attachments-list'
                        ref={scrollableContainer}
                        onScroll={(e) => {
                          e.preventDefault();
                        }}
                      >
                        {evaluateData.map((url, i) => {
                          const actions = ['preview', 'download', 'pentool'];

                          return (
                            <>
                              <div
                                className='attachment'
                                style={{ maxWidth: '100%' }}
                                ref={attachmentContainer}
                              >
                                <Attachment
                                  key={`homework_student_question_attachment_${i}`}
                                  fileUrl={url?.file_location}
                                  fileName={`Attachment-${i + 1}`}
                                  // urlPrefix={`${endpoints.academics.erpBucket}/homework`}
                                  urlPrefix={endpoints.erpBucket}
                                  index={i}
                                  actions={
                                    url?.file?.includes('.doc')
                                      ? ['download']
                                      : ['preview', 'download', 'pentool']
                                  }
                                  onOpenInPenTool={openInPenTool}
                                />
                              </div>
                            </>
                          );
                        })}
                        <div
                          style={{
                            position: 'absolute',
                            width: '0',
                            height: '0',
                            visibility: 'hidden',
                          }}
                        >
                          <SRLWrapper>
                            {evaluateData.map((url, i) => (
                              <img
                                //   src={`${endpoints.academics.erpBucket}/homework/${url}`}
                                src={`${endpoints.erpBucket}${url?.file_location}`}
                                onError={(e) => {
                                  e.target.src = placeholder;
                                }}
                                alt={`Attachment-${i + 1}`}
                                style={{ width: '0', height: '0' }}
                              />
                            ))}
                          </SRLWrapper>
                        </div>
                      </div>
                    </SimpleReactLightbox>
                    <div className='next-btn'>
                      <IconButton onClick={() => handleScroll('right')}>
                        <ArrowForwardIosIcon color='primary' />
                      </IconButton>
                    </div>
                  </div>
                </div>

                {penToolOpen && (
                  <DescriptiveTestcorrectionModule
                    desTestDetails={desTestDetails}
                    mediaContent={mediaContent}
                    handleClose={handleCloseCorrectionModal}
                    alert={undefined}
                    open={penToolOpen}
                    callBackOnPageChange={() => {}}
                    handleSaveFile={handleSaveEvaluatedFile}
                  />
                )}

                {/* Image Area Ends */}
              </div>
            </div>
          </div>
          <div className='row col-md-12 justify-content-center'>
            {/* <Pagination /> */}
          </div>
          <Drawer
            title={drawerTitle()}
            onClose={onClose}
            visible={openDrawer}
            closeIcon={false}
            className='chatDrawer'
          >
            <span className='pb-1'>Subject/Worksheet/Volume_Number</span>
            <div style={{ maxHeight: '75vh', overflowY: 'scroll' }} ref={chatRef}>
              {chatsData?.map((item) => (
                <div className='col-md-12'>
                  {item?.user == 'user' ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div className='p-2 col-md-6 userchat my-1'>
                        <span>{item?.chat}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div className='p-2 col-md-6 supchat my-1'>
                        <span>{item?.chat}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className='col-md-12'>
              <Input
                size='large'
                placeholder='Send Text'
                suffix={suffix}
                value={chattext}
                onChange={(e) => handlechange(e.target.value)}
              />
            </div>
          </Drawer>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FilesViewEvaluate;
