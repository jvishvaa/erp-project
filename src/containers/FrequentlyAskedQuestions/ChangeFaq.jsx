import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Popconfirm, Select, Tooltip, message } from 'antd';
import './Faq.scss';
import endpoints from 'config/endpoints';
import endpointsV2 from 'v2/config/endpoints';
import { DeleteOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import axios from 'axios';
import UploadPdf from './UploadPdf';
import UploadVideo from './UploadVideo';
import Loader from 'components/loader/loader';
import { DeleteOutline } from '@material-ui/icons';
import TextArea from 'antd/lib/input/TextArea';
import { getFileIcon } from 'v2/getFileIcon';

const { Option } = Select;

const ChangeFaq = ({
  moduleData,
  openDrawer,
  userLevelList,
  userLevel,
  subModule,
  devices,
  fetchData,
  setOpenDrawer,
  edit,
}) => {
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};

  const [isEditing, setIsEditing] = useState(edit);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isExpanded, setIsExpanded] = useState(
    Array(moduleData?.items?.length).fill(false)
  );

  const [editingSubModules, setEditingSubModules] = useState(edit);

  let navigationData = JSON.parse(localStorage.getItem('navigationData'));

  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  const [VideoPrevModal, setVideoPrevModal] = useState(false);
  const [VideoPrev, setVideoPrev] = useState('');

  const [editUserLevel, setEditUserLevel] = useState(moduleData?.user_level);

  const [deletePdfFile, setDeletePdfFile] = useState(false);
  const [deleteVideoFile, setDeleteVideoFile] = useState(false);
  const [showPdfText, setShowPdfText] = useState(false);
  const [showVideoText, setShowVideoText] = useState(false);

  const [showUploadVideoModal, setShowUploadVideoModal] = useState(false);
  const [showUploadPdfModal, setShowUploadPdfModal] = useState(false);

  const [load, setLoad] = useState(false);

  const toggleExpand = (index) => {
    const expandedCopy = [...isExpanded];
    expandedCopy[index] = !expandedCopy[index];
    setIsExpanded(expandedCopy);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleEditClick = (userLevel) => {
    setEditingSubModules(true);
  };

  const handleSaveClick = () => {
    if (editUserLevel.length <= 0) {
      return;
    }
    const data_id = moduleData?.items?.map((ele) => ele?.id ?? null);
    const formData = new FormData();
    formData.append('data_ids', data_id);
    formData.append('media_id', moduleData?.media_id);
    formData.append('user_level', editUserLevel);
    formData.append('edit_type', 'user_level');
    axios
      .patch(`${endpointsV2.FrequentlyAskedQuestions.FaqApi}`, formData, {
        headers: {
          Authorization: `Bearer ${userDetails?.token}`,
        },
      })
      .then((res) => {
        if (res?.data) {
          setEditingSubModules(false);
        }
      })
      .catch((error) => {
        setLoad(false);
      });
  };
  useEffect(() => {
    if (!openDrawer) {
      setQuestions([]);
      setAnswers([]);
    } else {
      setQuestions(moduleData?.items.map((item) => item.question) || []);
      setAnswers(moduleData?.items.map((item) => item.answer) || []);
    }
    if (deletePdfFile == false) {
      if (moduleData?.pdf_file) {
        setShowPdfText(false);
      } else {
        setShowPdfText(true);
      }
    }
    if (deleteVideoFile == false) {
      if (moduleData?.video_file) {
        setShowVideoText(false);
      } else {
        setShowVideoText(true);
      }
    }
  }, [openDrawer, moduleData]);

  const handleUploadVideoModalClose = () => {
    setShowUploadVideoModal(false);
  };
  const handleUploadPdfModalClose = () => {
    setShowUploadPdfModal(false);
  };

  const handleVideoPrev = (data) => {
    setVideoPrev(data);
    setVideoPrevModal(true);
  };

  useEffect(() => {
    if (!VideoPrevModal) {
      const video = document.getElementById('module_video');
      if (video) {
        video.pause();
      }
    }
  }, [VideoPrevModal]);

  const moduleInfo = navigationData?.find((item) =>
    item?.child_module?.some((module) => module?.child_id === moduleData?.module_id)
  );
  const moduleName = moduleInfo
    ? moduleInfo?.child_module?.find(
        (module) => module?.child_id === moduleData?.module_id
      )?.child_name
    : '';

  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });

  const handleChangeUser = (e) => {
    if (e) {
      const value = e;
      const ids = value
        .map((value) => {
          if (typeof value === 'string') {
            const level = userLevelList.find((level) => level.level_name === value);
            return level ? level.id : null;
          } else if (typeof value === 'number') {
            return value;
          }
          return null;
        })
        .filter((id) => id !== null);

      setEditUserLevel(ids);
    }
    if (e.length <= 0) {
      setEditUserLevel([]);
    }
  };

  const handleDeleteVideo = (video_id) => {
    setLoad(true);
    const formData = new FormData();
    formData.append('media_id', video_id);
    formData.append('file_type', 'video');
    axios
      .delete(`${endpointsV2.FrequentlyAskedQuestions.FaqApi}`, {
        headers: {
          Authorization: `Bearer ${userDetails?.token}`,
        },
        data: formData,
      })
      .then((res) => {
        if (res?.data) {
          fetchTableData();
          message.success(`Video File Deleted successfully`);
          setLoad(false);
          setDeleteVideoFile(true);
          setShowVideoText(true);
          setOpenDrawer(false);
        }
      })
      .catch((error) => {
        setDeleteVideoFile(false);
        setLoad(false);
      });
  };

  const handleDeletePdf = (pdf_id) => {
    setLoad(true);
    const formData = new FormData();
    formData.append('media_id', pdf_id);
    formData.append('file_type', 'pdf');
    axios
      .delete(`${endpointsV2.FrequentlyAskedQuestions.FaqApi}`, {
        headers: {
          Authorization: `Bearer ${userDetails?.token}`,
        },
        data: formData,
      })
      .then((res) => {
        if (res?.data) {
          message.success(`PDF File Deleted Successfully`);
          fetchTableData();
          setLoad(false);
          setDeletePdfFile(true);
          setShowPdfText(true);
          setOpenDrawer(false);
        }
      })
      .catch((error) => {
        setLoad(false);
        setDeletePdfFile(false);
      });
  };

  const toggleEditMode = (action) => {
    setIsEditing(!isEditing);
    if (editUserLevel.length <= 0) {
      return message.error('User Level Cannot Be Empty');
    }
    if (action == 'save') {
      const dataToSave = questions.map((question, index) => {
        const trimmedQuestion = question.trim();
        const trimmedAnswer = answers[index].trim();

        return {
          id: moduleData.items[index]?.id,
          question: trimmedQuestion,
          answer: trimmedAnswer,
        };
      });
      dataToSave.forEach((item, index) => {
        if (!item.question || !item.answer) {
          return message.error('Question or answer is empty');
        }
      });

      setLoad(true);
      const formData = new FormData();
      formData.append('edit_question_answer', JSON.stringify(dataToSave));
      axios
        .patch(`${endpointsV2.FrequentlyAskedQuestions.FaqApi}`, formData, {
          headers: {
            Authorization: `Bearer ${userDetails?.token}`,
          },
        })
        .then((res) => {
          if (res?.data) {
            message.success('FAQ Edited Successfully');
            fetchTableData();
            setLoad(false);
            setOpenDrawer(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoad(false);
        });
    }
  };

  const deleteQuestion = (question_id) => {
    setLoad(true);
    const formData = new FormData();
    formData.append('data_id', question_id);
    axios
      .delete(`${endpointsV2.FrequentlyAskedQuestions.FaqApi}`, {
        headers: {
          Authorization: `Bearer ${userDetails?.token}`,
        },
        data: formData,
      })
      .then((res) => {
        if (res?.data) {
          message.success(`Question Deleted Successfully`);
          fetchTableData();
          setLoad(false);
          setDeletePdfFile(true);
          setShowPdfText(true);
          setOpenDrawer(false);
        }
      })
      .catch((error) => {
        setLoad(false);
        setDeletePdfFile(false);
      });
  };

  const fetchTableData = () => {
    const params = {};
    if (userLevel && userLevel.length > 0) {
      params.user_level = userLevel?.join(',');
    }

    if (subModule) {
      params.child_id = subModule;
    }

    if (devices && devices.length > 0) {
      params.device = devices?.join(',');
    }

    fetchData({ params });
  };

  const handleReplaceVideo = () => {
    setShowUploadVideoModal(true);
  };

  const handleReplacePdf = () => {
    setShowUploadPdfModal(true);
  };

  const handleEdit = () => {
    handleSaveClick();
    toggleEditMode('save');
  };
  const getPopupContainer = (trigger) => trigger.parentNode;

  return (
    <div>
      <>
        {load && <Loader />}
        {moduleData ? (
          <>
            <div id='Drawer-Heading'>
              <div>
                <p style={{ marginTop: '3px' }}>Sub Module Name :- {moduleName}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Select
                  defaultValue={moduleData?.user_level}
                  mode='multiple'
                  onChange={(e) => handleChangeUser(e)}
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  style={{ margin: 'auto', width: '90%' }}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  status={editUserLevel.length <= 0 ? 'error' : ''}
                >
                  {userLevelListOptions}
                </Select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div id='Preview-Container'>
                {moduleData?.video_file ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      marginRight: '55px',
                    }}
                  >
                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Demo Video</p>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Tooltip title="Click For Preview" getPopupContainer={getPopupContainer}>
                      <PlayCircleOutlined
                        onClick={() =>
                          handleVideoPrev(
                            `${endpoints.assessment.erpBucket}/${moduleData?.video_file}`
                          )
                        }
                        style={{ fontSize: '40px', color: 'blueviolet' }}
                      />
                      </Tooltip>
                    </div>
                    <Popconfirm
                      title='Delete Video?'
                      onConfirm={() => handleDeleteVideo(moduleData?.media_id)}
                      okText='Yes'
                      cancelText='No'
                      getPopupContainer={getPopupContainer}
                    >
                      <DeleteOutline style={{ color: 'red', cursor: 'pointer' }} />
                    </Popconfirm>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}
                  >
                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Demo Video</p>
                    <p style={{ marginTop: '10px' }}>No Video File Exists</p>
                    {moduleData?.media_id && (
                      <Button style={{marginRight : "7px"}} type='primary' onClick={() => handleReplaceVideo()}>
                        Upload
                      </Button>
                    )}
                  </div>
                )}

                { moduleData?.pdf_file ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      marginRight: '55px',
                    }}
                  >
                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>User Manual</p>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Tooltip title="Click For Preview" getPopupContainer={getPopupContainer}>
                      <img
                        src={getFileIcon('pdf')}
                        onClick={() => {
                          const fileName = moduleData?.pdf_file;
                          let extension = fileName ? fileName[fileName?.length - 1] : '';
                          console.log(extension, 'hello');
                          openPreview({
                            currentAttachmentIndex: 0,
                            attachmentsArray: [
                              {
                                src: `${endpoints.assessment.erpBucket}/${moduleData?.pdf_file}`,

                                name: fileName,
                                extension: '.' + extension,
                              },
                            ],
                          });
                        }}
                        style={{cursor: 'pointer' }}
                      />
                      </Tooltip>
                    </div>
                    <Popconfirm
                      title='Delete PDF?'
                      onConfirm={() => handleDeletePdf(moduleData?.media_id)}
                      okText='Yes'
                      cancelText='No'
                      getPopupContainer={getPopupContainer}
                    >
                      <DeleteOutline style={{ color: 'red', cursor: 'pointer' }} />
                    </Popconfirm>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}
                  >
                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Demo PDF</p>
                    <p>No PDF File Exists</p>

                    {moduleData?.media_id && (
                      <Button type='primary' onClick={() => handleReplacePdf()}>
                        Upload
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div id='Edit-Container'>
              <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
                Question and Answers
              </p>
              {moduleData?.items?.map((each, index) => (
                <div key={index} id='Question-Answer-Cont'>
                  <div
                    style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}
                  >
                    <Popconfirm
                      title='Delete?'
                      onConfirm={() => deleteQuestion(each?.id)}
                      okText='Yes'
                      cancelText='No'
                      getPopupContainer={getPopupContainer}
                      placement='top'
                    >
                      <span
                        style={{
                          display: 'flex',
                          gap: '15px',
                          width: '18%',
                          cursor: 'pointer',
                        }}
                      >
                        <p>Delete</p>
                        <DeleteOutlined o style={{ color: 'red', marginTop: '5px' }} />
                      </span>
                    </Popconfirm>
                  </div>
                  <label style={{ fontWeight: 'bold' }}>Question {index + 1}</label>
                  <Input
                    maxLength={300}
                    value={questions[index]}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    showCount
                    status={`${
                      questions[index] == ''
                        ? 'error'
                        : '' || questions[index]?.trim() == ''
                        ? 'error'
                        : ''
                    }`}
                  />
                  <label style={{ color: 'gray', marginTop: '3px', fontWeight: 'bold' }}>
                    Answer
                  </label>
                  <TextArea
                    showCount
                    style={{ height: '80px' }}
                    maxLength={1500}
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    status={`${
                      answers[index] == ''
                        ? 'error'
                        : '' || answers[index]?.trim() == ''
                        ? 'error'
                        : ''
                    }`}
                  />
                </div>
              ))}
              <div id='Button-Cont'>
                <Button
                  style={{ backgroundColor: 'green', color: 'white' }}
                  onClick={() => handleEdit()}
                  disabled={
                    questions.some((item) => item == '') ||
                    answers.some((item) => item == '') ||
                    editUserLevel.length <= 0 ||
                    questions.some((item) => item?.trim() == '') ||
                    answers.some((item) => item?.trim() == '')
                  }
                >
                  Save
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p>No Data Found..</p>
          </>
        )}

        <Modal
          visible={VideoPrevModal}
          footer={false}
          className='th-modal'
          onCancel={() => {
            setVideoPrev(null);
            setVideoPrevModal(false);
          }}
          width={'60%'}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <video
              id='module_video'
              src={VideoPrev}
              controls
              preload='auto'
              alt={VideoPrev}
              style={{
                maxHeight: '400px',
                width: '96%',
                objectFit: 'fill',
              }}
              disablePictureInPicture
            />
          </div>
        </Modal>

        <UploadPdf
          show={showUploadPdfModal}
          handleUploadPdfModalClose={handleUploadPdfModalClose}
          media_id={moduleData?.media_id}
          fetchTableData={fetchTableData}
          setOpenDrawer={setOpenDrawer}
        />
        <UploadVideo
          show={showUploadVideoModal}
          handleUploadVideoModalClose={handleUploadVideoModalClose}
          media_id={moduleData?.media_id}
          fetchTableData={fetchTableData}
          setOpenDrawer={setOpenDrawer}
        />
      </>
    </div>
  );
};

export default ChangeFaq;
