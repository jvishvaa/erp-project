/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useRef, useEffect, useContext } from 'react';
import { IconButton, FormHelperText, Typography, Badge } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import CardContent from '@material-ui/core/CardContent';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { Grid, withStyles, Popover, SvgIcon } from '@material-ui/core';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CancelIcon from '@material-ui/icons/Cancel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import { uploadFile } from '../../redux/actions';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import placeholder from '../../assets/images/placeholder_small.jpg';
import Attachment from '../../containers/homework/teacher-homework/attachment';
import endpoints from '../../config/endpoints';
import FileValidators from '../../components/file-validation/FileValidators';
import VisibilityIcon from '@material-ui/icons/Visibility';
import './styles.scss';
import Drawer from '@material-ui/core/Drawer';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axiosInstance from '../../config/axios';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  questionCard: {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: '10px',
  },
  acceptedfiles: {
    color: theme.palette.secondary.main,
    width: '100%',
  },
  resourcesDrawer: {
    top: '10%',
    wisth: '80vw',
  },
}));
const CancelButton = withStyles({
  root: {
    color: '#8C8C8C',
    backgroundColor: '#e0e0e0',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
})(Button);

const QuestionCard = ({
  addNewQuestion,
  isEdit,
  question,
  index,
  handleChange,
  removeQuestion,
  grade,
  branch,
  subject,
  isCentralHomework,
  periodData,
}) => {
  const classes = useStyles();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  console.log({ isCentralHomework });
  let sessionYear;
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const [attachments, setAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [enableAttachments, setEnableAttachments] = useState(false);
  const [openAttachmentModal, setOpenAttachmentModal] = useState(false);
  const [fileUploadInProgress, setFileUploadInProgress] = useState(false);
  const firstUpdate = useRef(true);
  const fileUploadInput = useRef(null);
  const attachmentsRef = useRef(null);
  const { setAlert } = useContext(AlertNotificationContext);
  const [sizeValied, setSizeValied] = useState({});
  const [showPrev, setshowPrev] = useState(0);
  const [pentool, setpentool] = useState(false);
  const [maxattachment, setmaxAttachment] = useState(2);
  // const [isAttachmentenable,setisAttachmentenable] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false);
  const [questionData, setquestionData] = useState();
  const [edit, setisEdit] = useState(isEdit);
  const [volumeListData, setVolumeListData] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState('');
  const [selectedVolumeId, setSelectedVolumeId] = useState('');
  const [boardListData, setBoardListData] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState('');
  const [selectedBoardsID, setSelectedBoardsID] = useState([]);
  const [moduleListData, setModuleListData] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedModuleID, setSelectedModuleID] = useState('');
  const [chapterListData, setChapterListData] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedChapterID, setSelectedChapterID] = useState('');
  const [topicListData, setTopicListData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTopicID, setSelectedTopicID] = useState('');
  const [resourcesData, setResourcesData] = useState();

  const [selectedResources, setSelectedResources] = useState([]);
  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'dev.olvorchidnaigaon.letseduvate.com',
    'ui-revamp1.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com',
  ];
  const handleScroll = (dir) => {
    if (dir === 'left') {
      attachmentsRef.current.scrollLeft -= 150;
    } else {
      attachmentsRef.current.scrollLeft += 150;
    }
  };

  useEffect(() => {
    if (edit) {
      setisEdit(false);
      setquestionData(question.question);
      setAttachmentPreviews(question.attachments);
      setAttachments(question.attachments);
      setpentool(question.penTool);
      setmaxAttachment(question.max_attachment);
      setEnableAttachments(question.is_attachment_enable);
      if (isCentralHomework) {
        console.log({ periodData });
        fetchResources({
          chapter: periodData[index]?.chapterID,
          topic_id: periodData[index]?.keyConceptID,
        });
      }
    }
  }, [question.question, question.attachments]);

  const openAttchmentsModal = () => {
    setOpenAttachmentModal(true);
  };

  const closeAttachmentsModal = () => {
    setOpenAttachmentModal(false);
  };

  const onChange = (field, value) => {
    handleChange(index, field, value);
  };

  const handleFileUpload = async (file) => {
    if (!file) {
      return null;
    }
    const isValid = FileValidators(file);
    !isValid?.isValid && isValid?.msg && setAlert('error', isValid?.msg);

    if (isValid?.isValid) {
      try {
        if (
          file.name.toLowerCase().lastIndexOf('.pdf') > 0 ||
          file.name.toLowerCase().lastIndexOf('.jpeg') > 0 ||
          file.name.toLowerCase().lastIndexOf('.jpg') > 0 ||
          file.name.toLowerCase().lastIndexOf('.png') > 0 ||
          file.name.toLowerCase().lastIndexOf('.mp3') > 0 ||
          file.name.toLowerCase().lastIndexOf('.mp4') > 0
        ) {
          const fd = new FormData();
          fd.append('file', file);
          setFileUploadInProgress(true);
          const filePath = await uploadFile(fd);
          const final = Object.assign({}, filePath);
          if (file.type === 'application/pdf') {
            if (attachmentPreviews.includes(final)) {
              setAlert('error', 'File already Added');
            } else {
              setAttachments((prevState) => [...prevState, final]);
              setAttachmentPreviews((prevState) => [...prevState, final]);
            }
          } else {
            if (attachmentPreviews.includes(filePath)) {
              setAlert('error', 'File already Added');
            } else {
              setAttachments((prevState) => [...prevState, filePath]);
              setAttachmentPreviews((prevState) => [...prevState, filePath]);
            }
          }
          setFileUploadInProgress(false);
          setAlert('success', 'File uploaded successfully');
          setSizeValied('');
        } else {
          setAlert('error', 'Please upload valid file');
        }
      } catch (e) {
        setFileUploadInProgress(false);
        setAlert('error', 'File upload failed');
      }
    }
  };

  // Confirm Popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const assignResource = (resource) => {
    if (attachmentPreviews?.some((ai) => resource?.includes(ai))) {
      setAlert('error', 'File already Added');
    } else {
      setAttachmentPreviews((prevState) => [...prevState, ...resource]);
      setAttachments((prevState) => [...prevState, ...resource]);
    }

    setSelectedResources([]);
  };

  const removeAttachment = (pageIndex, pdfIndex, deletePdf, item) => {
    // const extension = item.split('.').pop();

    if (item !== undefined) {
      if (deletePdf) {
        setAttachmentPreviews((prevState) => {
          prevState.splice(pdfIndex, 1);
          return [...prevState];
        });
        setAttachments((prevState) => {
          prevState.splice(pdfIndex, 1);
          return [...prevState];
        });
      } else {
        setAttachmentPreviews((prevState) => {
          let newObj = prevState[pdfIndex];
          delete newObj[pageIndex];
          prevState[pdfIndex] = newObj;
          return [...prevState];
        });
        setAttachments((prevState) => {
          let newObj = prevState[pdfIndex];
          delete newObj[pageIndex];
          prevState[pdfIndex] = newObj;
          return [...prevState];
        });
      }
    } else {
      setAttachmentPreviews((prevState) => {
        prevState.splice(pdfIndex, 1);
        return [...prevState];
      });
      setAttachments((prevState) => {
        prevState.splice(pdfIndex, 1);
        return [...prevState];
      });
    }
  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('penTool', pentool);
  }, [pentool]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('max_attachment', maxattachment);
  }, [maxattachment]);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('is_attachment_enable', enableAttachments);
  }, [enableAttachments]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('question', questionData);
  }, [questionData]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('attachments', attachments);
  }, [attachments]);

  useEffect(() => {
    let count = 0;
    if (attachmentPreviews) {
      attachmentPreviews.forEach((e) => {
        if (typeof e == 'string') count = count + 1;
        else {
          count = Object.keys(e).length + count;
        }
      });
    }
    setshowPrev(count > 2);
  }, [attachmentPreviews]);

  useEffect(() => {
    if (showDrawer) {
      fetchVolumeListData();
      fetchBoardListData();
      fetchResourceYear();
    }
  }, [showDrawer]);

  useEffect(() => {
    if (selectedVolumeId) {
      if (!boardFilterArr.includes(window.location.host)) {
        fetchModuleListData({
          subject_id: subject,
          volume: selectedVolumeId,
          academic_year: sessionYear,
          grade_id: grade,
          branch_id: branch,
          board: selectedBoards,
        });
      }
    }
  }, [selectedVolumeId]);

  const handleResourcesDrawerOpen = () => {
    setShowDrawer(true);
  };
  const handleResourcesDrawerClose = () => {
    setShowDrawer(false);
  };
  const fetchResources = (params = {}) => {
    if (!selectedChapter && !selectedTopic & !isCentralHomework) {
      setAlert('error', 'Please Select All Filters');
    } else {
      axiosInstance
        // ?chapter=${selectedChapterID}&topic_id=${selectedTopicID}`
        .get(`academic/get-period-resources/`, { params: { ...params } })
        .then((result) => {
          if (result?.data?.status === 200) {
            setResourcesData(result?.data?.data);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
    }
  };
  const fetchVolumeListData = () => {
    axios
      .get(`${endpoints.lessonPlan.volumeList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setVolumeListData(result?.data?.result?.results);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };
  const fetchResourceYear = () => {
    axios
      .get(`${endpoints.lessonPlan.academicYearList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          sessionYear = result?.data?.result?.results?.filter(
            (item) => item?.session_year == selectedAcademicYear.session_year
          )[0]?.id;
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };
  const fetchBoardListData = () => {
    axiosInstance
      .get('academic/get-board-list/')
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setBoardListData(result?.data?.result);
          if (!boardFilterArr.includes(window.location.host)) {
            let data = result?.data?.result?.filter(
              (item) => item?.board_name === 'CBSE'
            )[0];
            setSelectedBoards(data?.id);
          }
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };
  const fetchModuleListData = (params = {}) => {
    axiosInstance
      .get('academic/get-module-list/', { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setModuleListData(result?.data?.result?.module_list);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };
  const fetchChapterListData = (params = {}) => {
    axiosInstance
      .get('academic/central-chapters-list-v3/', { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setChapterListData(result?.data?.result?.chapter_list);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };
  const fetchTopicListData = (params = {}) => {
    axiosInstance
      .get('academic/get-key-concept-list/', { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setTopicListData(result?.data?.result);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };

  const handleVolume = (each) => {
    setBoardListData([]);
    setModuleListData([]);
    setChapterListData([]);
    setTopicListData([]);

    setSelectedBoards();
    setSelectedModule();
    setSelectedTopic();
    setSelectedChapter();

    setSelectedBoardsID();
    setSelectedModuleID();
    setSelectedTopicID();
    setSelectedChapterID();
    if (each) {
      setSelectedVolume(each);
      setSelectedVolumeId(each?.id);
      if (boardFilterArr.includes(window.location.host)) {
        fetchBoardListData();
      }
    }
  };

  const handleBoard = (each) => {
    setModuleListData([]);
    setChapterListData([]);
    setTopicListData([]);
    setSelectedModule();
    setSelectedTopic();
    setSelectedChapter();
    setSelectedModuleID();
    setSelectedTopicID();
    setSelectedChapterID();

    const boardsID = each?.map((item) => item?.id).join(',');
    if (each) {
      setSelectedBoards(each);
      setSelectedBoardsID(boardsID);
      fetchModuleListData({
        subject_id: subject,
        volume: selectedVolumeId,
        academic_year: sessionYear,
        grade_id: grade,
        branch_id: branch,
        board: boardsID,
      });
    }
  };

  const handleModule = (each) => {
    setChapterListData([]);
    setTopicListData([]);
    setSelectedTopic();
    setSelectedChapter();
    setSelectedModuleID();
    setSelectedTopicID();
    setSelectedChapterID();
    if (each) {
      setSelectedModule(each);
      setSelectedModuleID(each?.id);
      fetchChapterListData({
        subject_id: subject,
        volume: selectedVolumeId,
        academic_year: sessionYear,
        grade_id: grade,
        branch_id: branch,
        board: selectedBoardsID,
        module_id: each?.id,
      });
    }
  };

  const handleChapter = (each) => {
    setTopicListData([]);
    setSelectedTopic();
    setSelectedModuleID();
    setSelectedTopicID();
    setSelectedChapterID();
    if (each) {
      setSelectedChapter(each);
      setSelectedChapterID(each?.id);
      fetchTopicListData({
        chapter: each?.id,
      });
    }
  };

  const handleKeyConcept = (each) => {
    setSelectedTopicID();
    if (each) {
      setSelectedTopic(each);
      setSelectedTopicID(each?.id);
    }
  };

  return (
    <Grid container className='home-question-container' style={{ marginBottom: 5 }}>
      <Dialog maxWidth='sm' open={openAttachmentModal} onClose={closeAttachmentsModal}>
        <DialogTitle color='primary'>Attachments</DialogTitle>
        <DialogContent style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Grid container>
            {attachmentPreviews?.map((preview, index) => (
              <Grid item md='4' spacing={2}>
                <IconButton onClick={() => removeAttachment(index)}>
                  <CancelIcon style={{ width: '25px' }} className='disabled-icon' />
                </IconButton>
                <img src={preview} alt='preview' style={{ width: '100%' }} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            className='labelColor cancelButton'
            size='medium'
            onClick={closeAttachmentsModal}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12}>
        <Card className={` ${classes.questionCard} question-card`}>
          <CardContent>
            <Grid container>
              <Grid item container>
                <Grid item xs={12}>
                  <FormControl variant='outlined' fullWidth size='small'>
                    <TextField
                      id='question'
                      name='question'
                      onChange={(e) => {
                        if (
                          window.location.pathname.includes('/diary/') ||
                          isCentralHomework
                        ) {
                          return;
                        } else {
                          setquestionData(e.target.value);
                        }
                      }}
                      label='Question'
                      autoFocus={!window.location.pathname.includes('/diary')}
                      multiline
                      rows={4}
                      rowsMax={6}
                      value={questionData}
                      // disabled={true}
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {question.errors?.question}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {!window.location.pathname.includes('/diary/') && (
                  <Grid item md={6}>
                    <div>
                      <input
                        className='file-upload-input'
                        type='file'
                        name='attachments'
                        accept='.png, .jpg, .jpeg, .mp3, .mp4, .pdf, .PNG, .JPG, .JPEG, .MP3, .MP4, .PDF'
                        onChange={(e) => {
                          handleFileUpload(e.target.files[0]);
                          e.target.value = null;
                        }}
                        ref={fileUploadInput}
                      />
                      {fileUploadInProgress ? (
                        <div>
                          <CircularProgress
                            color='primary'
                            style={{ width: '25px', height: '25px', margin: '5px' }}
                          />
                        </div>
                      ) : (
                        <>
                          <IconButton
                            onClick={() => fileUploadInput.current.click()}
                            title='Attach files'
                          >
                            <Badge
                              badgeContent={attachmentPreviews?.length}
                              color='primary'
                            >
                              <AttachFileIcon color='primary' />
                            </Badge>
                          </IconButton>
                          <small className={classes.acceptedfiles}>
                            {' '}
                            Accepted files: jpeg,jpg,mp3,mp4,pdf,png
                          </small>
                        </>
                      )}
                    </div>
                    <div></div>
                  </Grid>
                )}
              </Grid>
              {attachmentPreviews?.length > 0 && (
                <Grid item xs={12} className='attachments-grid'>
                  <div className='attachments-list-outer-container'>
                    <div className='prev-btn'>
                      {showPrev && (
                        <IconButton onClick={() => handleScroll('left')}>
                          <ArrowBackIosIcon />
                        </IconButton>
                      )}
                    </div>
                    <SimpleReactLightbox>
                      <div
                        className='attachments-list'
                        ref={attachmentsRef}
                        onScroll={(e) => {
                          e.preventDefault();
                        }}
                      >
                        {attachmentPreviews?.map((url, pdfindex) => {
                          let cindex = 0;
                          attachmentPreviews.forEach((item, index) => {
                            if (index < pdfindex) {
                              if (typeof item == 'string') {
                                cindex = cindex + 1;
                              } else {
                                cindex = Object.keys(item).length + cindex;
                              }
                            }
                          });
                          if (typeof url == 'object') {
                            return Object.values(url).map((item, i) => {
                              let imageIndex = Object.keys(url)[i];
                              return (
                                <div className='attachment'>
                                  <Attachment
                                    key={`homework_student_question_attachment_${i}`}
                                    fileUrl={item}
                                    fileName={`Attachment-${i + 1 + cindex}`}
                                    urlPrefix={
                                      item.includes('/lesson_plan_file/')
                                        ? `${endpoints.homework.resourcesFiles}`
                                        : `${endpoints.discussionForum.s3}/homework`
                                    }
                                    index={i + cindex}
                                    actions={
                                      item.includes('/lesson_plan_file/')
                                        ? ['download', 'delete']
                                        : ['preview', 'download', 'delete']
                                    }
                                    onDelete={(index, deletePdf) =>
                                      removeAttachment(imageIndex, pdfindex, deletePdf, {
                                        item,
                                      })
                                    }
                                    ispdf={
                                      item.includes('/lesson_plan_file/') ? false : true
                                    }
                                  />
                                </div>
                              );
                            });
                          } else
                            return (
                              <div className='attachment'>
                                <Attachment
                                  key={`homework_student_question_attachment_${pdfindex}`}
                                  fileUrl={url}
                                  fileName={`Attachment-${1 + cindex}`}
                                  urlPrefix={
                                    url.includes('/lesson_plan_file/')
                                      ? `${endpoints.homework.resourcesFiles}`
                                      : `${endpoints.discussionForum.s3}/homework`
                                  }
                                  index={cindex}
                                  actions={
                                    url.includes('/lesson_plan_file/') &&
                                    !url.includes('png')
                                      ? ['download', 'delete']
                                      : ['preview', 'download', 'delete']
                                  }
                                  onDelete={(index, deletePdf) =>
                                    removeAttachment(index, pdfindex, deletePdf)
                                  }
                                  ispdf={
                                    url.includes('/lesson_plan_file/') ? false : true
                                  }
                                />
                              </div>
                            );
                        })}
                        <div style={{ position: 'absolute', visibility: 'hidden' }}>
                          <SRLWrapper>
                            {attachmentPreviews.map((url, i) => {
                              if (typeof url == 'object') {
                                return Object.values(url).map((item, i) => {
                                  return (
                                    <img
                                      src={
                                        item.includes('/lesson_plan_file/')
                                          ? `${endpoints.homework.resourcesFiles}/${item}`
                                          : `${endpoints.discussionForum.s3}/homework/${item}`
                                      }
                                      onError={(e) => {
                                        e.target.src = placeholder;
                                      }}
                                      alt={`Attachment-${i + 1}`}
                                    />
                                  );
                                });
                              } else
                                return (
                                  <img
                                    src={
                                      url.includes('/lesson_plan_file/')
                                        ? `${endpoints.homework.resourcesFiles}/${url}`
                                        : `${endpoints.discussionForum.s3}/homework/${url}`
                                    }
                                    onError={(e) => {
                                      e.target.src = placeholder;
                                    }}
                                    alt={`Attachment-${i + 1}`}
                                  />
                                );
                            })}
                          </SRLWrapper>
                        </div>
                      </div>
                    </SimpleReactLightbox>
                    <div className='next-btn'>
                      {showPrev && (
                        <IconButton onClick={() => handleScroll('right')}>
                          <ArrowForwardIosIcon color='primary' />
                        </IconButton>
                      )}
                    </div>
                  </div>
                </Grid>
              )}
            </Grid>
            <Grid container className='question-ctrls-container'>
              <Grid
                item
                xs={12}
                md={window.location.pathname.includes('/diary/') ? 6 : 3}
                // className='question-ctrls-inner'
                style={{ display: 'flex' }}
              >
                {/* <Box className='question-ctrl-inner-container'> */}

                <IconButton>
                  {/* <IconButton className='question-cntrl-file-upload'> */}
                  <CloudUploadIcon color='primary' />
                </IconButton>
                <FormControlLabel
                  // className='question-ctrl'ss
                  control={
                    <Switch
                      onChange={(e) => {
                        setEnableAttachments(e.target.checked);
                      }}
                      name='checkedA'
                      color='primary'
                      checked={enableAttachments}
                    />
                  }
                  label='File Upload'
                  labelPlacement='start'
                  style={{ minWidth: '50px' }}
                  disabled={window.location.pathname.includes('/diary/')}
                />

                {/* </Box> */}
              </Grid>
              {enableAttachments && (
                <Grid
                  item
                  xs={12}
                  md={window.location.pathname.includes('/diary/') ? 5 : 3}
                  className='question-ctrl-outer-container'
                >
                  {/* <Box className='question-ctrl-inner-container max-attachments'> */}
                  <div>
                    <div className='question-ctrl-label'>Maximum number of files</div>
                    <Select
                      native
                      labelId='demo-customized-select-label'
                      id='demo-customized-select'
                      defaultValue={2}
                      onChange={(e) => setmaxAttachment(e.target.value)}
                      value={maxattachment}
                      disabled={window.location.pathname.includes('/diary/')}
                    >
                      {Array.from({ length: 10 }, (_, index) => (
                        <option value={index + 1}>{index + 1}</option>
                      ))}
                    </Select>
                  </div>
                  {/* </Box> */}
                </Grid>
              )}
              <Grid
                item
                xs={12}
                md={window.location.pathname.includes('/diary/') ? 6 : 3}
                style={{ display: 'flex' }}
              >
                {/* <Box className='question-ctrl-inner-container'> */}
                <div style={{ display: 'flex' }}>
                  {/* <IconButton className='question-cntrl-file-upload'> */}
                  <IconButton>
                    <CreateIcon color='primary' />
                  </IconButton>
                  <FormControlLabel
                    // className='question-ctrl'
                    control={
                      <Switch
                        name='penTool'
                        onChange={(e) => {
                          setpentool(e.target.checked);
                        }}
                        color='primary'
                        checked={pentool}
                        value={pentool}
                      />
                    }
                    label='Pen tool'
                    labelPlacement='start'
                    style={{ minWidth: '50px' }}
                    disabled={window.location.pathname.includes('/diary/')}
                  />
                </div>
                {/* </Box> */}
              </Grid>
              {!window.location.pathname.includes('/diary/') && (
                <Grid
                  item
                  xs={12}
                  md={2}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {/* <Box className='question-ctrl-inner-container th-pointer'> */}
                  <div>
                    <Button
                      onClick={handleResourcesDrawerOpen}
                      variant='contained'
                      color='primary'
                    >
                      Resources
                    </Button>
                  </div>
                  <div className='th-12 pt-2'>(From Leson Plan)</div>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {!window.location.pathname.includes('/diary/') && (
        <Grid item xs={12}>
          <Grid item xs={12} className='question-btn-container' />
          {index > 0 && (
            <Grid item xs={12} className='question-btn-container'>
              <div className='question-btn-inner-container '>
                <Button
                  variant='contained'
                  color='default'
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    handleClick();
                  }}
                  title='Remove Question'
                  className='btn remove-question-btn'
                >
                  Remove question
                </Button>
              </div>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div style={{ padding: '20px 30px' }}>
                  <Typography style={{ fontSize: '20px', marginBottom: '15px' }}>
                    Are you sure you want to delete?
                  </Typography>
                  <div>
                    <CancelButton onClick={(e) => handleClose()}>Cancel</CancelButton>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => removeQuestion(index)}
                      style={{ float: 'right' }}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </Popover>
            </Grid>
          )}
        </Grid>
      )}
      <Drawer
        anchor='right'
        open={showDrawer}
        onClose={handleResourcesDrawerClose}
        style={{ overflowY: 'scroll', height: '80vh' }}
        className='th-resourcesDrawer'
      >
        {!isCentralHomework && (
          <Grid
            container
            spacing={5}
            className='resourcesDrawer'
            style={{ width: '100%' }}
          >
            <Grid item xs={12} sm={4}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={(e, value) => handleVolume(value)}
                id='volume'
                className='dropdownIcon'
                value={selectedVolume}
                options={volumeListData || []}
                getOptionLabel={(option) => option?.volume_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Volume'
                    placeholder='Volume'
                    required
                  />
                )}
              />
            </Grid>
            {boardFilterArr.includes(window.location.host) && (
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  multiple
                  style={{ width: '100%' }}
                  size='small'
                  onChange={(e, value) => handleBoard(value)}
                  id='board'
                  className='dropdownIcon'
                  value={selectedBoards || []}
                  options={boardListData || []}
                  getOptionLabel={(option) => option?.board_name || ''}
                  // filterSelectedOptions
                  getOptionSelected={(option, value) => option?.id == value?.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Board'
                      placeholder='Board'
                      required
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={(e, value) => handleModule(value)}
                id='module'
                className='dropdownIcon'
                value={selectedModule || []}
                options={moduleListData || []}
                getOptionLabel={(option) => option?.lt_module_name || ''}
                filterSelectedOptions
                // getOptionSelected={(option, value) =>
                //     option?.id == value?.id
                //   }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Module'
                    placeholder='Module'
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={(e, value) => handleChapter(value)}
                id='chapter'
                className='dropdownIcon'
                value={selectedChapter || ''}
                options={chapterListData || []}
                getOptionLabel={(option) => option?.chapter_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Chapter'
                    placeholder='Chapter'
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={(e, value) => handleKeyConcept(value)}
                id='keyConcept'
                className='dropdownIcon'
                value={selectedTopic || ''}
                options={topicListData || []}
                getOptionLabel={(option) => option?.topic_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='KeyConcept'
                    placeholder='KeyConcept'
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant='contained'
                color='primary'
                startIcon={<SearchIcon />}
                onClick={() => {
                  fetchResources({
                    chapter: selectedChapterID,
                    topic_id: selectedTopicID,
                  });
                }}
                title='Filter'
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        )}
        <Grid
          container
          style={{
            overflowY: 'scroll',
            overflowX: 'hidden',
            maxHeight:
              window.innerWidth < 768 ? '50vh' : isCentralHomework ? '70vh' : '50vh',
            marginTop: 20,
          }}
        >
          {resourcesData ? (
            Object.entries(resourcesData).map((item) => {
              return (
                <Accordion style={{ margin: '10px 5px', width: '100%' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1bh-content'
                    id='panel1bh-header'
                  >
                    <div className='th-fw-700 th-20'>{item[0]}</div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container>
                      {Object.entries(item[1])?.map((each) => {
                        return (
                          <Grid container style={{ width: '100%' }}>
                            <Grid md={6}>
                              <div className='th-fw-600'>{each[0]}</div>
                            </Grid>
                            {each[1]?.map((resource) => {
                              let resourceName = resource.split(
                                `${each[0].toLowerCase()}/`
                              );
                              return (
                                <>
                                  <Grid container style={{ width: '100%' }}>
                                    <Grid md={8} className='text-left'>
                                      <Typography className='text-truncate th-width-90'>
                                        {resourceName[1]}
                                      </Typography>
                                    </Grid>
                                    <Grid md={2} className='text-right'>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            // checked={state.checkedB}
                                            onChange={() =>
                                              setSelectedResources((prevState) => [
                                                ...prevState,
                                                resource,
                                              ])
                                            }
                                            name='checkedB'
                                            color='primary'
                                          />
                                        }
                                        label='Assign'
                                        style={{ minWidth: '50px' }}
                                      />
                                    </Grid>
                                    <Grid md={1} className='text-center pt-2'>
                                      <a
                                        onClick={() => {
                                          openPreview({
                                            currentAttachmentIndex: 0,
                                            attachmentsArray: [
                                              {
                                                src: `${endpoints.homework.resourcesFiles}/${resource}`,
                                                name: resource,
                                                extension:
                                                  '.' +
                                                  resource.split('.')[
                                                    resource.split('.').length - 1
                                                  ],
                                              },
                                            ],
                                          });
                                        }}
                                        rel='noopener noreferrer'
                                        target='_blank'
                                      >
                                        <SvgIcon component={() => <VisibilityIcon />} />
                                      </a>
                                    </Grid>
                                  </Grid>
                                </>
                              );
                            })}
                          </Grid>
                        );
                      })}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              );
            })
          ) : (
            <Grid className='mt-4 text-center th-width-100'>
              <Typography>Please select filters to get resoures</Typography>
            </Grid>
          )}
        </Grid>
        <Grid className='mt-3'>
          <Button
            className='mr-3'
            variant='contained'
            onClick={() => {
              setShowDrawer(false);
              assignResource([]);
            }}
          >
            Back
          </Button>
          {resourcesData && (
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                setShowDrawer(false);
                assignResource([...selectedResources]);
              }}
            >
              Submit
            </Button>
          )}
        </Grid>
      </Drawer>
    </Grid>
  );
};

export default QuestionCard;
