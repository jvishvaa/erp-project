import React, { useState, useRef, useEffect } from 'react';
import {
  Tooltip,
  Tabs,
  Select,
  Drawer,
  Input,
  message,
  Modal,
  Progress,
  Form,
  Image,
  Button,
  Carousel,
} from 'antd';
import {
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  LeftCircleFilled,
  RightCircleFilled,
} from '@ant-design/icons';
import './index.scss';
import './../student/style.css';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Attachment from './CentralAttachment';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import endpoints from 'v2/config/endpoints';
import endpointsV1 from 'config/endpoints';
import placeholder from 'assets/images/placeholder_small.jpg';
import DescriptiveTestcorrectionModule from './EvaluationTool';
import AuditorRating from './Auditor';
import QuestionPng from 'assets/images/question.png';
import { SendOutlined } from '@ant-design/icons';
import DOWNLOADICON from './../../../assets/images/download-icon-blue.png';
import BOOKMARKICON from './../../../assets/images/bookmark-icon.png';
import NOTEICON from './../../../assets/images/note-icon.png';
import axiosInstance from 'config/axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
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
  selectedGrade,
  selectedSubSecMap,
  fetchTeacherData,
  startDate,
  endDate,
  sub_sec_mpng,
  page,
  sectionMappingId,
  activeTab,
}) => {
  const history = useHistory();
  const { Option } = Select;
  const scrollableContainer = useRef(null);
  const attachmentContainer = useRef(null);
  const chatRef = useRef(null);
  const carousel = useRef();

  const [volume, setVolume] = useState('');
  const [showTab, setShowTab] = useState('1');
  const [penToolOpen, setPenToolOpen] = useState(false);
  const [penToolUrl, setPenToolUrl] = useState('');
  const [currentEvaluatedFileName, setcurrentEvaluatedFileName] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [chattext, setChatText] = useState('');
  const [chatsData, setChatsData] = useState(chatarr);
  const [selectedHomework, setSelectedHomework] = useState(
    evaluateData[selectedHomeworkIndex]
  );

  const [percentValue, setPercentValue] = useState(10);
  const [uploadStart, setUploadStart] = useState(false);
  const [erpList, setErpList] = useState([]);
  const [selectedErp, setSelectedErp] = useState();
  const [uploadBtn, setUploadBtn] = useState(false);

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    fetchErp({
      section_mapping_id: sectionMappingId,
      user_level: 13,
      status: 1,
    });
  }, [sectionMappingId]);

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

  let idInterval = null;
  useEffect(() => {
    if (uploadStart == true && percentValue < 90) {
      idInterval = setInterval(
        () => setPercentValue((oldCount) => checkCount(oldCount)),
        1000
      );
    }

    return () => {
      clearInterval(idInterval);
      setPercentValue(10);
    };
  }, [uploadStart]);

  const checkCount = (count) => {
    if (count < 90) {
      return count + 5;
    } else {
      return count;
    }
  };

  const getVolume = (value) => {
    setVolume(value);
  };

  const closeTable = useRef(null);
  const onChange = (key) => {
    setShowTab(key);
  };

  const handleScroll = (dir) => {
    if (dir === 'left') {
      scrollableContainer.current.scrollLeft -= scrollableContainer?.current?.clientWidth;
      setSelectedHomeworkIndex(
        selectedHomeworkIndex === 0 ? 0 : selectedHomeworkIndex - 1
      );
      setSelectedHomework(
        evaluateData[selectedHomeworkIndex === 0 ? 0 : selectedHomeworkIndex - 1]
      );
      // carousel.current.next();
    } else {
      scrollableContainer.current.scrollLeft += scrollableContainer?.current?.clientWidth;
      setSelectedHomeworkIndex(
        selectedHomeworkIndex === evaluateData.length - 1
          ? evaluateData.length - 1
          : selectedHomeworkIndex + 1
      );
      setSelectedHomework(
        evaluateData[
          selectedHomeworkIndex === evaluateData.length - 1
            ? evaluateData.length - 1
            : selectedHomeworkIndex + 1
        ]
      );
      // carousel.current.prev();
    }
  };

  const handleSaveEvaluatedFile = async (file) => {
    setUploadStart(true);
    let path = evaluateData[selectedHomeworkIndex]?.file_location;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('destination_path', path);

    axiosInstance
      .patch(`${endpoints.homework.updateImage}${selectedHomework?.id}/`, fd)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          message.success('Attachment Added');
          setUploadStart(false);
          handleCloseCorrectionModal();
          fetchTeacherData({
            start_date: startDate,
            end_date: endDate,
            sub_sec_mpng: sub_sec_mpng,
            page: page,
            is_assessed: activeTab === '1' ? 'True' : 'False',
          });
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
    setChatText(e);
  };

  const handleAddtext = () => {
    let data = {
      user: 'user',
      chat: chattext,
    };
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
    setSelectedHomework(evaluateData[index]);
    // carousel.current.goTo(index);

    let imgwidth = index * scrollableContainer?.current?.clientWidth;
    // console.log(scrollableContainer.current, 'scroll');
    scrollableContainer.current.scrollTo({ left: imgwidth, behavior: 'smooth' });
  };

  const fetchErp = (params = {}) => {
    axiosInstance
      .get(`${endpointsV1.homework.hwErp}`, {
        params: { ...params },
      })
      .then((res) => {
        setErpList(res?.data?.results);
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleErpChange = (e) => {
    setSelectedErp(e?.value);
  };

  const handleClearErp = () => {
    setSelectedErp(null);
  };

  const erpOptions = erpList?.map((each) => {
    return (
      <Option key={each?.erp_id} value={each.erp_id} title={each?.erp_id}>
        {each?.user?.first_name} {each?.user?.last_name}
      </Option>
    );
  });

  const handleSaveErp = async () => {
    setUploadBtn(true);
    axiosInstance
      .patch(`${endpointsV1.homework.hwData}${selectedHomework?.id}/`, {
        file_location: selectedHomework?.file_location,
        student_erp: selectedErp,
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          message.success('Erp Updated');
          setSelectedErp(null);
          let updatedErp = res?.data?.result?.student_erp;
          setSelectedHomework({ ...selectedHomework, student_erp: updatedErp });
          fetchTeacherData({
            is_assessed: activeTab === 1 ? 'True' : 'False',
            start_date: startDate,
            end_date: endDate,
            sub_sec_mpng: sub_sec_mpng,
            page: page,
          });
          // setFileList([]);
          // setUploading(false);
        }
      })
      .catch((e) => {
        message.error('Upload Failed');
      })
      .finally(() => {
        setUploadBtn(false);
      });
  };

  return (
    <React.Fragment>
      <div className='wholetabCentralHW'>
        <div className='th-tabs th-tabs-hw mt-3 th-bg-white'>
          {selectedHomework?.student_erp === 'INVALID' && (
            <div className='row'>
              <div className='col-md-4 col-xl-3'>
                <Form>
                  <Form.Item name='student_erp'>
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      maxTagCount={1}
                      allowClear={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                      placement='bottomRight'
                      showArrow={true}
                      onChange={(e, value) => handleErpChange(value)}
                      onClear={handleClearErp}
                      dropdownMatchSelectWidth={false}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      showSearch
                      placeholder='Select Erp'
                    >
                      {erpOptions}
                    </Select>
                  </Form.Item>
                </Form>
              </div>
              <div className='col-md-2 col-xl-2'>
                <Button
                  className=' th-br-4 w-100  th-select'
                  type='primary'
                  onClick={handleSaveErp}
                  disabled={uploadBtn}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
          <div className=' row'>
            <div className='col-md-5 col-xl-4 pl-0'>
              {/* <div className=' d-flex justify-content-center'>
                      <span className='th-16'>Files</span>
                    </div> */}
              <div className='card shadow border-0 th-br-4 w-100'>
                <div className='p-2'>
                  <div className='col-md-12 row'>
                    <div className='col-md-6'>
                      <p className='th-15 mb-0 text-muted text-truncate text-center'>
                        <span className='th-fw-600'>Worksheet</span>
                      </p>
                    </div>
                    <div className='col-md-6'>
                      <p className='th-15 mb-0 text-muted text-truncate text-center'>
                        <span className='th-fw-600'>Alloted Date</span>
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
                              // color: 'black',
                              color: item?.is_corrected ? '#006b00' : '#ff3b3c',
                              maxHeight: 200,
                              overflowY: 'scroll',
                              textTransform: 'capitalize',
                            }}
                          >
                            <h5
                              className='th-14 mb-0'
                              style={{
                                color: item?.is_corrected ? '#006b00' : '#ff3b3c',
                              }}
                            >
                              {item.student_erp}
                            </h5>
                            {/* <p className='th-12 mb-0 text-muted text-truncate'>
                              <span className='th-fw-600'>Description:</span>
                              {item.description}
                            </p> */}
                          </Tooltip>
                        </div>
                        <div className='col-md-6'>
                          <p className='th-12 mb-0 text-muted text-truncate text-center'>
                            <span className='th-fw-600'>
                              {item?.hw_date
                                ? moment(item?.hw_date).format('DD-MM-YYYY')
                                : ''}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-7 col-xl-8 pr-0'>
              {/* Image Area */}

              {/* <div className='auditor row'>
                  <div className='col-md-3 offset-md-8 pr-0'>
                    <AuditorRating selectedHomework={selectedHomework} />
                  </div>
                </div> */}
              <div className='attachments-container'>
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
                              urlPrefix={`${endpointsV1.erp_googleapi}`}
                              index={i}
                              actions={
                                url?.file?.includes('.doc')
                                  ? ['download']
                                  : ['preview', 'download', 'pentool']
                              }
                              onOpenInPenTool={openInPenTool}
                            />
                          </div>
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
                              src={`${endpointsV1.erp_googleapi}/${
                                url?.file_location
                              }?${escape(new Date().getTime())}`}
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
        <Modal
          maskClosable={false}
          closable={false}
          footer={null}
          visible={uploadStart}
          width={1000}
          centered
        >
          <Progress
            strokeColor={{
              from: '#108ee9',
              to: '#87d068',
            }}
            percent={percentValue}
            status='active'
            className='p-4'
          />
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default FilesViewEvaluate;
