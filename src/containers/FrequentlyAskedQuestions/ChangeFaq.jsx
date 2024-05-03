import React, { useEffect, useState } from 'react';
import { text } from './FrequentlyAskedQuestions';
import { Button, Input, Modal, Select, message } from 'antd';
import './Faq.scss';
import endpoints from 'config/endpoints';
import endpointsV2 from 'v2/config/endpoints';
import { FileTextOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import axios from 'axios';
import UploadPdf from './UploadPdf';
import UploadVideo from './UploadVideo';
import Loader from 'components/loader/loader';

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
}) => {
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};

  const [editableIndices, setEditableIndices] = useState([]);
  const [questions, setQuestions] = useState(
    moduleData?.items.map((item) => item.question) || []
  );
  const [answers, setAnswers] = useState(
    moduleData?.items.map((item) => item.answer) || []
  );

  const [editingSubModules, setEditingSubModules] = useState(false);

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

  const toggleEdit = (index, each, action) => {
    if (editableIndices.includes(index)) {
      setEditableIndices(editableIndices.filter((i) => i !== index));
    } else {
      setEditableIndices([...editableIndices, index]);
    }
    if (action == 'save') {
      const formData = new FormData();
      formData.append('data_id', each?.id);
      formData.append('question', questions[index]);
      formData.append('answer', answers[index]);
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
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const isEditable = (index) => {
    return editableIndices.includes(index);
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
    const data_id = moduleData?.items?.map((ele) => ele?.id ?? null);

    const formData = new FormData();
    formData.append('data_ids', data_id);
    formData.append('media_id', moduleData?.media_id);
    formData.append('user_level', editUserLevel);
    formData.append('edit_type', 'user_level');
    setLoad(true);
    axios
      .patch(`${endpointsV2.FrequentlyAskedQuestions.FaqApi}`, formData, {
        headers: {
          Authorization: `Bearer ${userDetails?.token}`,
        },
      })
      .then((res) => {
        if (res?.data) {
          fetchTableData();
          message.success('FAQ Edited Successfully');
          setLoad(false);
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
    if (deletePdfFile == false || deleteVideoFile == false) {
      if (moduleData?.pdf_file) {
        setShowPdfText(false);
      } else {
        setShowPdfText(true);
      }
      if (moduleData?.video_file) {
        setShowVideoText(false);
      } else {
        setShowVideoText(true);
      }
    }
  }, [openDrawer]);

  const handleUploadVideoModalClose = () => {
    setShowUploadVideoModal(false);
  };
  const handleUploadPdfModalClose = () => {
    setShowUploadPdfModal(false);
  };

  const handleShowVideoModal = () => {
    setShowUploadVideoModal(true);
  };
  const handleShowPdfModal = () => {
    setShowUploadPdfModal(true);
  };

  const handleVideoPrev = (data) => {
    setVideoPrev(data);
    setVideoPrevModal(true);
  };

  const moduleInfo = navigationData?.find((item) =>
    item?.child_module?.some((module) => module?.child_id === moduleData?.module_id)
  );
  const moduleName = moduleInfo
    ? moduleInfo?.child_module?.find(
        (module) => module?.child_id === moduleData?.module_id
      )?.child_name
    : '';

  const userLevelLookup = {};
  userLevelList.forEach((item) => {
    userLevelLookup[item?.id] = item?.level_name;
  });

  const userLevelNames = editUserLevel?.map((id) => userLevelLookup[id]);

  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });

  const handleChangeUser = (e) => {
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
          message.success(`P.D.F. File Deleted Successfully`);
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

  return (
    <>
      {load && <Loader />}
      {moduleData ? (
        <>
          <div id='Drawer-Heading'>
            <div>
              <p style={{ marginTop: '3px' }}>Sub Module Name :- {moduleName}</p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px',
                gap: '5px',
              }}
            >
              {
                <div style={{ width: '48%', height: '20px', width: '100%' }}>
                  {editingSubModules ? (
                    <Select
                      defaultValue={userLevelNames}
                      mode='multiple'
                      style={{ width: '100%' }}
                      onChange={(e) => handleChangeUser(e)}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {userLevelListOptions}
                    </Select>
                  ) : (
                    <p style={{ marginTop: '3px' }}>
                      User Level :- {userLevelNames.join(',  ')}
                    </p>
                  )}
                </div>
              }
              {!editingSubModules ? (
                <Button
                  style={{ width: '8%', height: '30px' }}
                  onClick={() => handleEditClick(userLevel)}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  style={{ width: '8%', height: '30px' }}
                  onClick={() => handleSaveClick(userLevel)}
                >
                  Save
                </Button>
              )}
            </div>
          </div>

          <div id='Preview-Container'>
            <div
              style={{
                border: '1px solid black',
                width: '45%',
                textAlign: 'center',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {!showVideoText ? (
                <>
                  <PlayCircleOutlined
                    onClick={() =>
                      handleVideoPrev(
                        `${endpoints.assessment.erpBucket}/${moduleData?.video_file}`
                      )
                    }
                    style={{ fontSize: '150px', marginTop: '10px' }}
                  />
                  <p>Click For Preview</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                      danger
                      onClick={() => handleDeleteVideo(moduleData?.media_id)}
                    >
                      Delete
                    </Button>
                    <Button type='primary' onClick={() => handleReplaceVideo()}>
                      Replace
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p>No Video File Exsists</p>
                  {moduleData?.media_id && (
                    <Button type='primary' onClick={() => handleReplaceVideo()}>
                      Upload
                    </Button>
                  )}
                </>
              )}
            </div>
            <div
              style={{
                border: '1px solid black',
                width: '45%',
                textAlign: 'center',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {!showPdfText ? (
                <>
                  <FileTextOutlined
                    onClick={() => {
                      const fileName = moduleData?.pdf_file;
                      let extension = fileName ? fileName[fileName?.length - 1] : '';
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
                    style={{ fontSize: '150px', marginTop: '10px' }}
                  />
                  <p>Click For Preview</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button danger onClick={() => handleDeletePdf(moduleData?.media_id)}>
                      Delete
                    </Button>
                    <Button type='primary' onClick={() => handleReplacePdf()}>
                      Replace
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p>No P.D.F. File Exsists</p>
                  {moduleData?.media_id && (
                    <Button type='primary' onClick={() => handleReplacePdf()}>
                      Upload
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          <div id='Edit-Container'>
            <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
              Question and Answers
            </p>
            {moduleData?.items?.map((each, index) => (
              <div key={index} id='Question-Answer-Cont'>
                <label style={{ fontWeight: 'bold' }}>Question</label>
                {isEditable(index) ? (
                  <Input
                    disabled={!isEditable(index)}
                    value={questions[index]}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                  />
                ) : (
                  <p>{questions[index]}</p>
                )}
                <label style={{ color: 'gray', marginTop: '3px' }}>Answer</label>
                {isEditable(index) ? (
                  <Input
                    disabled={!isEditable(index)}
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                ) : (
                  <p>{answers[index]}</p>
                )}
                <div id='Button-Cont'>
                  {!isEditable(index) ? (
                    <Button
                      style={{ backgroundColor: 'orange', color: 'white' }}
                      onClick={() => toggleEdit(index)}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      style={{ backgroundColor: 'green', color: 'white' }}
                      onClick={() => toggleEdit(index, each, 'save')}
                    >
                      Save
                    </Button>
                  )}
                  <Button type='danger' onClick={() => deleteQuestion(each?.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
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
            src={VideoPrev}
            controls
            preload='auto'
            alt={VideoPrev}
            style={{
              maxHeight: '400px',
              width: '96%',
              objectFit: 'fill',
            }}
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
  );
};

export default ChangeFaq;
