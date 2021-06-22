import React, { useContext, useEffect, useState, useRef } from 'react';
import { Grid, Button, useTheme, SvgIcon, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import ReactPlayer from 'react-player/lazy';
import cuid from 'cuid';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import minimize from '../../../../assets/images/minimize.svg';
import maximize from '../../../../assets/images/maximize.svg';
import deleteicon from '../../../../assets/images/deleteicon.svg';
import './question-type-filters.css';
import MultipleChoice from '../question-types/multiple-choice';
import ComprehensionModal from '../question-types/multiple-choice/comprehension-question-select';
import MyTinyEditor from '../tinymce-editor';
import TypeFiltersContainer from './type-filters-container';
import QuestionBulkCreation from '../question-bulk-upload';
import axios from 'axios';

const levels = [
  { id: '1', level: 'Easy' },
  { id: '2', level: 'Average' },
  { id: '3', level: 'Difficult' },
];

const categories = [
  { id: '1', category: 'Knowledge' },
  { id: '2', category: 'Understanding' },
  { id: '3', category: 'Application' },
  { id: '4', category: 'Analyse' },
];

const questionType = [
  { id: 1, name: 'Multiple Choice Single Select', MultipleChoiceSingleSelect: true },
  {
    id: 2,
    name: 'Multiple Choice Multiple Select',
    MultipleChoiceMultipleSelect: true,
  },
  { id: 3, name: 'Match The Following', MatchTheFollowing: true },
  { id: 6, name: 'Matrix Question', MatrixQuestion: true },
  { id: 8, name: 'True False', TrueFalse: true },
  { id: 9, name: 'Fill In The Blanks', FillInTheBlanks: true },
  { id: 10, name: 'Descriptive', Descriptive: true },
];

const bulkCreationSupportTypes = [1, 8, 9];
const QuestionTypeFilters = ({
  editData,
  setEditData,
  setLoading,
  setIsTopFilterOpen,
  filterDataDisplay,
  attributes,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const history = useHistory();
  const [comprehensionQuestion, setComprehensionQuestion] = useState('');
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [isQuestionFilterOpen, setIsQuestionFilterOpen] = useState(true);
  const videoPlayer = useRef(null);
  const [isCreateManuallyOpen, setIsCreateManuallyOpen] = useState(false);
  const [videoURL, setVideoURL] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [submitFlag, setSubmitFlag] = useState(false);
  const [saveFlag, setSaveFlag] = useState(false);
  const [comprehensionQuestions, setComprehensionQuestions] = useState([]);
  const [subQuestions, setSubQuestions] = useState([]);
  const [uploadInBulk, setUploadInBulk] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const getCurrentVideoTime = () => {
    if (showQuestionType?.VideoQuestion) {
      return videoPlayer.current?.getCurrentTime();
    }
  };

  const [filterData, setFilterData] = useState({
    level: '',
    category: '',
    type: '',
  });

  const [showQuestionType, setShowQuestionType] = useState({
    MultipleChoiceSingleSelect: false,
    MultipleChoiceMultipleSelect: false,
    MatchTheFollowing: false,
    VideoQuestion: false,
    PPTQuestion: false,
    MatrixQuestion: false,
    ComprehensionQuestions: false,
    TrueFalse: false,
    FillInTheBlanks: false,
    Descriptive: false,
  });

  useEffect(() => {
    if (editData?.id) {
      const {
        question_level,
        question_categories,
        question_type: qType,
        question_answer: [{ question: editQuestion, video: editVideo }],
      } = editData;

      setFilterData({
        level: levels.filter((obj) => obj.id === question_level)[0],
        category: categories.filter((obj) => obj.id === question_categories)[0],
        type: qType,
      });
      let count = 1;
      const objlist = { ...showQuestionType };
      if (qType?.id === 4 || qType?.id === 7) {
        setComprehensionQuestion(editQuestion);
        const subQuestionsList = editData?.sub_questions;
        const list = [...comprehensionQuestions];
        let coun = 0;
        subQuestionsList.forEach((subQuestion, index) => {
          const { question_type } = subQuestion;
          if (question_type?.id !== 4 && question_type?.id !== 7) {
            const obj = {};
            const key = Object.keys(
              questionType?.find((elem) => elem?.id === question_type?.id)
            )[2];
            obj[key] = true;
            obj.id = question_type?.id;
            obj.keyId = cuid();
            obj.is_delete = false;
            obj.data = subQuestion;
            if (qType?.id === 4) {
              obj.time = +subQuestion?.time_or_slide;
            }
            obj.count = ++coun;
            list.push(obj);
          }
        });
        setComprehensionQuestions(list);
      }
      if (qType?.id === 4) setVideoURL(editVideo);
      for (const key in objlist) {
        if (qType?.id === count) {
          objlist[key] = true;
          setShowQuestionType(objlist);
          setIsQuestionFilterOpen(false);
          setIsTopFilterOpen(false);
          setIsCreateManuallyOpen(true);
          break;
        }
        count++;
      }
    }
  }, []);

  useEffect(() => {
    if (submitFlag) {
      setSubQuestions([]);
      handleSendData(true);
    }
    if (saveFlag) {
      setSubQuestions([]);
      handleSendData(false);
    }
  }, [submitFlag, saveFlag]);

  const handleCreateManually = (variant = 'create_manaully') => {
    if (filterData.type != '' && filterData.level != '' && filterData.category != '') {
      let count = 1;
      const objlist = { ...showQuestionType };
      for (const key in objlist) {
        if (filterData.type?.id === count) {
          objlist[key] = true;
          setShowQuestionType(objlist);
          setIsQuestionFilterOpen(false);
          setIsTopFilterOpen(false);
          if (variant === 'bulk_creation') {
            setUploadInBulk(true);
          } else {
            setIsCreateManuallyOpen(true);
          }
          break;
        }
        count++;
      }
    } else if (filterData.level === '') {
      setAlert('error', 'Question Level is required');
    } else if (filterData.category === '') {
      setAlert('error', 'Question Category is required');
    } else if (filterData.type === '') {
      setAlert('error', 'Question Type is required');
    }
  };

  const handleOpenModal = () => {
    if (showQuestionType?.ComprehensionQuestions) {
      setOpenModal(true);
    } else if (showQuestionType?.VideoQuestion) {
      if (isVideoPlaying) {
        setAlert(
          'warning',
          'Please pause the video at the time you want to create the question.'
        );
      } else {
        setOpenModal(true);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = () => {
    setSubmitFlag(true);
  };

  const handleSave = () => {
    setSaveFlag(true);
  };

  const handleSendData = (isSubmit) => {
    const questionAndAnswer = [];
    if (showQuestionType?.VideoQuestion) {
      questionAndAnswer.push({
        question: comprehensionQuestion,
        video: videoURL,
      });
    }
    if (showQuestionType?.ComprehensionQuestions) {
      questionAndAnswer.push({
        question: comprehensionQuestion,
      });
    }
    let requestBody = {
      sub_questions: subQuestions,
      question_answer: questionAndAnswer,
      question_level: filterData.level.id,
      question_categories: filterData.category.id,
      question_type: filterData.type.id,
      chapter: filterDataDisplay.chapter?.id,
      topic: filterDataDisplay.topic?.id,
      question_status: isSubmit ? 3 : 1,
    };
    if (!editData?.id) {
      requestBody = {
        ...requestBody,
        academic_session: filterDataDisplay.branch?.id,
        is_central_chapter: filterDataDisplay.chapter?.is_central,
        grade: filterDataDisplay.grade?.grade_id,
        subject: filterDataDisplay.subject?.subject_id,
      };
    }
    if (editData?.id) {
      requestBody = {
        ...requestBody,
        id: editData?.id,
        delete_questions: comprehensionQuestions
          .filter((obj) => obj.is_delete)
          .map((obj) => obj?.data?.id)
          .filter(Boolean),
      };
      axiosInstance
        .put(`/assessment/${editData?.id}/retrieve_update_question/`, requestBody)
        .then((result) => {
          if (result.data.status_code === 200) {
            const objlist = { ...showQuestionType };
            for (const key in objlist) {
              if (objlist[key]) {
                objlist[key] = false;
                setShowQuestionType(objlist);
                break;
              }
            }
            setIsQuestionFilterOpen(true);
            setIsCreateManuallyOpen(false);
            setComprehensionQuestions([]);
            setComprehensionQuestion('');
            setVideoURL('');
            setSubQuestions([]);
            setSubmitFlag(false);
            setSaveFlag(false);
            setEditData([]);
            history.push('/question-bank');
            setAlert('success', result.data?.message);
          } else {
            setSubmitFlag(false);
            setSaveFlag(false);
            setAlert('error', result.data?.message);
          }
        })
        .catch((error) => {
          setSubmitFlag(false);
          setSaveFlag(false);
          setAlert('error', error.message);
        });
    } else {
      axiosInstance
        .post(`${endpoints.assessmentErp.createQuestion}`, requestBody)
        .then((result) => {
          if (result.data.status_code === 200) {
            const objlist = { ...showQuestionType };
            for (const key in objlist) {
              if (objlist[key]) {
                objlist[key] = false;
                setShowQuestionType(objlist);
                break;
              }
            }
            setIsQuestionFilterOpen(true);
            setIsCreateManuallyOpen(false);
            setComprehensionQuestions([]);
            setComprehensionQuestion('');
            setVideoURL('');
            setSubQuestions([]);
            setSubmitFlag(false);
            setSaveFlag(false);
            setAlert('success', result.data?.message);
            history.push('/question-bank');
          } else {
            setSubmitFlag(false);
            setSaveFlag(false);
            setAlert('error', result.data?.message);
          }
        })
        .catch((error) => {
          setSubmitFlag(false);
          setSaveFlag(false);
          setAlert('error', error.message);
        });
    }
  };

  const handleEditorChange = (content, editor) => {
    setComprehensionQuestion(content);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files;
    if (file && file[0] && file[0].name.lastIndexOf('.mp4') > 0) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file[0]);
      formData.append('grade_name', filterDataDisplay.grade?.grade_id);
      formData.append('subject_name', filterDataDisplay.subject?.subject_id);
      formData.append('question_categories_id', filterData.category?.id);
      formData.append('question_type', filterData.type?.id);
      axiosInstance
        .post(`${endpoints.assessmentErp.fileUpload}`, formData)
        .then((result) => {
          if (result.data.status_code === 200) {
            setVideoURL(result.data.result);
            setLoading(false);
            setAlert('success', result.data.message);
          } else {
            setLoading(false);
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      setAlert('error', 'Only .mp4 format is acceptable');
    }
  };

  const handleRemoveVideo = () => {
    setLoading(true);
    axiosInstance
      .post(`${endpoints.assessmentErp.fileRemove}`, {
        file_name: videoURL,
      })
      .then((result) => {
        if (result.data.status_code === 204) {
          setVideoURL('');
          setComprehensionQuestions([]);
          setAlert('success', result.data.message);
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  };

  const handleCancel = () => {
    const list = { ...showQuestionType };
    for (const key in list) {
      if (list[key]) {
        list[key] = false;
        break;
      }
    }
    setShowQuestionType(list);
    setIsQuestionFilterOpen(true);
    setIsCreateManuallyOpen(false);
    if (editData?.id) {
      history.push('/question-bank');
    }
  };

  return (
    <div className='typeFilterParent'>
      <div className='typeFilterContainers'>
        <div className='minMaxContainer'>
          <div className='questionPaperTypeTag'>Question Set Parameters</div>
          {!isQuestionFilterOpen && (
            <div className='lctBoxes'>
              <div className='levelBox'>{filterData.level.level}</div>
              <div className='categoryBox'>{filterData.category.category}</div>
              <div className='typeBox'>{filterData.type.question_type}</div>
            </div>
          )}
          {!isCreateManuallyOpen && (
            <div>
              <IconButton
                disableRipple
                onClick={() => setIsQuestionFilterOpen(!isQuestionFilterOpen)}
              >
                <div>
                  {!isMobile && (
                    <div className='minMaxText'>
                      {isQuestionFilterOpen ? 'Minimize' : 'Maximize'}
                    </div>
                  )}
                </div>
                <div className='iconContainer'>
                  <SvgIcon
                    component={() => (
                      <img
                        style={{ height: '25px', width: '25px' }}
                        src={isQuestionFilterOpen ? minimize : maximize}
                      />
                    )}
                  />
                </div>
              </IconButton>
            </div>
          )}
        </div>
        <div
          className={
            isQuestionFilterOpen
              ? 'showFilters questionTypefiltersContainer'
              : 'hideFilters questionTypefiltersContainer'
          }
        >
          <TypeFiltersContainer
            levels={levels}
            categories={categories}
            filterData={filterData}
            setFilterData={setFilterData}
          />
          {!isCreateManuallyOpen && !uploadInBulk && (
            <div className='buttonsAtBottom'>
              <Grid container spacing={isMobile ? 3 : 5}>
                {isMobile && <Grid item xs={3} sm={0} />}
                {bulkCreationSupportTypes.includes(filterData?.type?.id) && (
                  <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                    <Button
                      variant='contained'
                      style={{ color: 'white', textTransform: 'none' }}
                      color='primary'
                      className='custom_button_master modifyDesign'
                      size='medium'
                      // onClick={()=>{setUploadInBulk(true)}}
                      onClick={() => {
                        handleCreateManually('bulk_creation');
                      }}
                    >
                      Upload in Bulk
                    </Button>
                  </Grid>
                )}
                {isMobile && <Grid item xs={3} sm={0} />}
                {isMobile && <Grid item xs={3} sm={0} />}
                <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                  <Button
                    variant='contained'
                    className='custom_button_master modifyDesign createManuallyButton'
                    size='medium'
                    style={{ textTransform: 'none' }}
                    onClick={handleCreateManually}
                  >
                    Create Manually
                  </Button>
                </Grid>
                {isMobile && <Grid item xs={3} sm={0} />}
              </Grid>
            </div>
          )}
        </div>
      </div>
      {!isCreateManuallyOpen && uploadInBulk && (
        <QuestionBulkCreation
          attributes={{ ...(filterData || {}), ...(attributes || {}) }}
          onJobDone={() => {
            setIsQuestionFilterOpen(true);
            setIsTopFilterOpen(true);
            setUploadInBulk(false);
          }}
        />
      )}

      {isCreateManuallyOpen &&
        !showQuestionType.ComprehensionQuestions &&
        !showQuestionType.VideoQuestion && (
          <div
            className={
              showQuestionType.ComprehensionQuestions || showQuestionType.VideoQuestion
                ? ''
                : 'multipleChoiceBox'
            }
          >
            <MultipleChoice
              editData={editData}
              setEditData={setEditData}
              setLoading={setLoading}
              filterDataTop={filterDataDisplay}
              filterDataBottom={filterData}
              showQuestionType={showQuestionType}
              setShowQuestionType={setShowQuestionType}
              setIsQuestionFilterOpen={setIsQuestionFilterOpen}
              setIsCreateManuallyOpen={setIsCreateManuallyOpen}
              parentQuestionType={setShowQuestionType}
            />
          </div>
        )}

      {isCreateManuallyOpen &&
        (showQuestionType.ComprehensionQuestions || showQuestionType.VideoQuestion) && (
          <div className='comprehensionQuestionEditor'>
            <MyTinyEditor
              id={
                showQuestionType.VideoQuestion
                  ? 'videoQuestionEditor'
                  : 'comprehensionEditor'
              }
              content={comprehensionQuestion}
              handleEditorChange={handleEditorChange}
              placeholder={
                showQuestionType.VideoQuestion ? 'Video Question...' : 'Comprehension...'
              }
              filterDataTop={filterDataDisplay}
              filterDataBottom={filterData}
            />
          </div>
        )}

      {isCreateManuallyOpen && showQuestionType.VideoQuestion && videoURL !== '' && (
        <div className='videoContainer'>
          <div className='player-wrapper'>
            <ReactPlayer
              className='react-player'
              url={`${endpoints.assessmentErp.s3}${videoURL}`}
              playing={false}
              controls
              width='85%'
              height='15%'
              ref={videoPlayer}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
          </div>
          <div className='removeNoteContainer'>
            <div className='attachmentButtonContainer'>
              <Button
                startIcon={
                  <SvgIcon
                    component={() => (
                      <img style={{ height: '20px', width: '20px' }} src={deleteicon} />
                    )}
                  />
                }
                className='modifyDesign removeVideoButton'
                title='Remove Uploaded Video'
                variant='contained'
                size='medium'
                disableRipple
                disableElevation
                disableFocusRipple
                disableTouchRipple
                style={{ textTransform: 'none' }}
                onClick={handleRemoveVideo}
              >
                Remove Uploaded Video
              </Button>
            </div>
            <div
              className='noteContainer'
              style={{ color: '#014b7e', fontWeight: '600' }}
            >
              <span style={{ color: '#fe6b6b' }}>**</span>
              Note:&nbsp;
              <span style={{ fontWeight: '500' }}>
                Please pause the video at the time you want to create the question.
              </span>
            </div>
          </div>
        </div>
      )}

      {isCreateManuallyOpen && showQuestionType.VideoQuestion && videoURL === '' && (
        <div className='addPassageQuestionButtonContainer'>
          <Button
            className='modifyDesign addPassageQuestionButton'
            title='Add a video for the above question'
            variant='contained'
            size='medium'
            disableRipple
            disableElevation
            disableFocusRipple
            disableTouchRipple
            style={{ textTransform: 'none' }}
            startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
            component='label'
          >
            <input
              type='file'
              style={{ display: 'none' }}
              id='raised-button-file'
              accept='video/*'
              onChange={handleVideoUpload}
            />
            Select a video above to add question type
          </Button>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isCreateManuallyOpen &&
          (showQuestionType?.ComprehensionQuestions || showQuestionType?.VideoQuestion) &&
          comprehensionQuestions?.map(
            (question, index) =>
              !question.is_delete && (
                <div className='multipleChoiceBox'>
                  <MultipleChoice
                    key={question.keyId}
                    editData={question?.data}
                    index={index}
                    len={question.is_delete}
                    setLoading={setLoading}
                    subQuestions={subQuestions}
                    setSubQuestions={setSubQuestions}
                    submitFlag={submitFlag}
                    saveFlag={saveFlag}
                    comprehensionQuestions={comprehensionQuestions}
                    setComprehensionQuestions={setComprehensionQuestions}
                    filterDataTop={filterDataDisplay}
                    filterDataBottom={filterData}
                    showQuestionType={question}
                    setIsQuestionFilterOpen={setIsQuestionFilterOpen}
                    setIsCreateManuallyOpen={setIsCreateManuallyOpen}
                    parentQuestionType={showQuestionType} // Flag used for comprehension, video, ppt
                  />
                </div>
              )
          )}

        {(showQuestionType.ComprehensionQuestions ||
          (showQuestionType.VideoQuestion && videoURL !== '')) &&
          [...comprehensionQuestions]?.filter((obj) => !obj.is_delete)?.length < 10 && (
            <div className='addPassageQuestionButtonContainer'>
              <Button
                className='modifyDesign addPassageQuestionButton'
                title='Add a question for the above passage'
                variant='contained'
                size='medium'
                disableRipple
                disableElevation
                disableFocusRipple
                disableTouchRipple
                style={{ textTransform: 'none' }}
                startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
                onClick={handleOpenModal}
              >
                {showQuestionType.ComprehensionQuestions
                  ? 'Add question for the above comprehension'
                  : 'Add question for the above video'}
              </Button>
            </div>
          )}
      </div>
      {isCreateManuallyOpen &&
        (showQuestionType.ComprehensionQuestions || showQuestionType.VideoQuestion) && (
          <div className='comprehensionButtons'>
            <Grid container spacing={isMobile ? 3 : 5}>
              {isMobile && <Grid item xs={3} sm={0} />}
              <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                <Button
                  variant='contained'
                  style={{ textTransform: 'none' }}
                  className='custom_button_master modifyDesign cancelButtonLabel'
                  size='medium'
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={0} sm={6} />
              {isMobile && <Grid item xs={3} sm={0} />}
              <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                <Button
                  variant='contained'
                  className='custom_button_master modifyDesign saveAsDraftButton'
                  size='medium'
                  style={{ textTransform: 'none' }}
                  onClick={handleSave}
                >
                  Save as Draft
                </Button>
              </Grid>
              {isMobile && <Grid item xs={3} sm={0} />}
              {isMobile && <Grid item xs={3} sm={0} />}
              <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                <Button
                  variant='contained'
                  style={{ color: 'white', textTransform: 'none' }}
                  color='primary'
                  className='custom_button_master modifyDesign'
                  size='medium'
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Grid>
              {isMobile && <Grid item xs={3} sm={0} />}
            </Grid>
          </div>
        )}

      <ComprehensionModal
        questionType={questionType}
        showQuestionType={showQuestionType}
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        comprehensionQuestions={comprehensionQuestions}
        setComprehensionQuestions={setComprehensionQuestions}
        getCurrentVideoTime={getCurrentVideoTime}
      />
    </div>
  );
};

export default QuestionTypeFilters;
