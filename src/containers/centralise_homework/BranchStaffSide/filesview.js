import React, { useState, useRef, useEffect } from 'react';
import { Tooltip, Tabs, Select, Drawer, Input } from 'antd';
import './branchside.scss';
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

const FilesView = ({ evaluateData }) => {
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
  const [selectedHomeworkIndex, setSelectedHomeworkIndex] = useState(0);

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

  let imgarr2 = [
    '40/38/193/993/2543/homework/1702384133_image_2_.png',
    '40/38/193/993/2543/homework/1702384133_image_2_.png',
    '40/38/193/993/2543/homework/1702384133_image_2_.png',
    '40/38/193/993/2543/homework/1702384133_image_2_.png',
  ];

  let imgarr = [
    {
      name: 'Notebook 1',
      description:
        'notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing notebook description testing',
      isNote: true,
      isBookmarked: true,
      isDownload: true,
      file: '40/38/193/993/2543/homework/1702384133_image_2_.png',
    },
    {
      name: 'Notebook 2',
      description: 'notebook description testing',
      isNote: false,
      isBookmarked: false,
      isDownload: true,
      file: '40/38/193/993/2543/homework/1702384133_image_2_.png',
    },
    {
      name: 'Notebook 3',
      description: 'notebook description testing',
      isNote: true,
      isBookmarked: true,
      isDownload: true,
      file: '40/38/193/993/2543/homework/1702384133_image_2_.png',
    },
    {
      name: 'Notebook 4',
      description: 'notebook description testing',
      isNote: true,
      isBookmarked: false,
      isDownload: true,
      file: '40/38/193/993/2543/homework/1702384133_image_2_.png',
    },
    {
      name: 'Notebook 5',
      description: 'notebook description testing',
      isNote: true,
      isBookmarked: true,
      isDownload: true,
      file: '40/38/193/993/2543/homework/1702384133_image_2_.png',
    },
  ];

  const handleSaveEvaluatedFile = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    // const filePath = await uploadFile(fd);
    // setPenToolUrl(null);
    // setcurrentEvaluatedFileName(null);
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
          <Tabs type='card' onChange={onChange} defaultActiveKey={showTab}>
            <TabPane tab='Assessed' key='1'>
              <div className=' row'>
                <div className='col-md-5 col-xl-4 pl-0'>
                  {/* <div className=' d-flex justify-content-center'>
                      <span className='th-16'>Files</span>
                    </div> */}
                  <div className='card shadow border-0 th-br-4 w-100'>
                    <div className='card-body'>
                      <div>
                        <p className='text-uppercase'>Homework Files</p>
                      </div>
                      <div className='notebook-list mt-3'>
                        {evaluateData?.map((item, index) => (
                          <div
                            className='notebook-list-item'
                            key={index}
                            style={{
                              backgroundColor: `${
                                selectedHomeworkIndex === index ? '#f8f8f8' : '#fff'
                              }`,
                            }}
                          >
                            <div className='download-icon'>
                              <img
                                src={DOWNLOADICON}
                                alt='download'
                                className='img-fluid'
                              />
                            </div>
                            <div
                              className='notebook-content ml-2'
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleImageScroll(index)}
                            >
                              <Tooltip
                                title={`${item.student_erp}`}
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
                                      actions={['preview', 'download', 'pentool']}
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
                  <div className='col-md-1 p-0'>
                    <IconButton
                      onClick={showDrawer}
                      style={{ backgroundColor: '#0000000a' }}
                    >
                      <img src={QuestionPng} width='24px' />
                    </IconButton>
                  </div>
                </div>
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
            </TabPane>
            <TabPane tab='Under Assessed' key='2'>
              <p>Hello</p>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FilesView;
