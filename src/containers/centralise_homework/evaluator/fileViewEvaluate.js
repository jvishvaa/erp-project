import React, { useState, useRef, useEffect } from 'react';
import { Breadcrumb, Tabs, Select, Drawer, Input } from 'antd';
import './index.scss';
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

const FilesViewEvaluate = () => {
  const history = useHistory();
  const scrollableContainer = useRef(null);
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
    if (dir === 'left') {
      scrollableContainer.current.scrollLeft -= 150;
    } else {
      scrollableContainer.current.scrollLeft += 150;
    }
  };

  let imgarr = [
    '40/38/193/993/2543/homework/1702384133_image_2_.png',
    '40/38/193/993/2543/homework/1702384133_image_2_.png',
    '40/38/193/993/2543/homework/1702384133_image_2_.png',
    '40/38/193/993/2543/homework/1702384133_image_2_.png',
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
    let imgwidth = index * 750;
    console.log(scrollableContainer.current, 'scroll');
    scrollableContainer.current.scrollTo({ left: imgwidth, behavior: 'smooth' });
  };

  return (
    <React.Fragment>
      <div className='row wholetabCentralHW'>
        <div className='col-12'>
          <div className=' th-bg-white'>
            <div className='col-md-12 row'>
              <div className='col-md-3' style={{ border: '1px solid black' }}>
                <div className=' d-flex justify-content-center'>
                  <span className='th-16'>Files</span>
                </div>
                <div
                  className='d-flex justify-content-center'
                  style={{ flexDirection: 'column' }}
                >
                  {imgarr?.map((url, index) => (
                    <div
                      className='p-2'
                      onClick={() => handleImageScroll(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      {index + 1} File {index + 1}
                    </div>
                  ))}
                </div>
              </div>
              <div className='col-md-9 row'>
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
                          {imgarr.map((url, i) => {
                            {
                              console.log('homeworkAtta', url, url.includes('.doc'));
                            }
                            const actions = ['preview', 'download', 'pentool'];

                            return (
                              <>
                                <div className='attachment' style={{ maxWidth: '100%' }}>
                                  <Attachment
                                    key={`homework_student_question_attachment_${i}`}
                                    fileUrl={url}
                                    fileName={`Attachment-${i + 1}`}
                                    // urlPrefix={`${endpoints.academics.erpBucket}/homework`}
                                    urlPrefix={
                                      'https://mgmt-cdn-stage.stage-gke.letseduvate.com/dev/lesson_plan_file/'
                                    }
                                    index={i}
                                    actions={
                                      url.includes('.doc')
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
                              {imgarr.map((url, i) => (
                                <img
                                  //   src={`${endpoints.academics.erpBucket}/homework/${url}`}
                                  src={`https://mgmt-cdn-stage.stage-gke.letseduvate.com/dev/lesson_plan_file/${url}`}
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
      </div>
    </React.Fragment>
  );
};

export default FilesViewEvaluate;
